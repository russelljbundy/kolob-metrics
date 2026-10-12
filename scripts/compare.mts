// Compare two models' labels on the comments both have labeled (run 0, same
// prompt hash). Prints agreement on every field, fallacy counts, and the
// comments where the models disagree about fallacies, for human review.
//
//   npm run compare -- --a anthropic/claude-sonnet-5.5 --b anthropic/claude-haiku-5.5
//
// Flags: --show <n> disagreements to print (default 15).

import { parseArgs } from "node:util";
import { PROMPT_HASH } from "../lib/classifier";
import { openDb } from "../lib/db";

const { values: args } = parseArgs({
  options: {
    a: { type: "string", default: "anthropic/claude-sonnet-5.5" },
    b: { type: "string", default: "anthropic/claude-haiku-5.5" },
    show: { type: "string", default: "15" },
  },
});

type Row = {
  labelId: number;
  commentId: string;
  text: string | null;
  isReply: number;
  topic: string;
  factual: number;
  cites: number | null;
  stance: string | null;
  argument: number;
  costUsd: number;
};
type Fallacy = { labelId: number; type: string; kept: number; span: string | null; rationale: string | null; confidence: number };

const db = openDb();
const rowsFor = (model: string) =>
  new Map(
    (
      db
        .prepare(
          `SELECT l.id AS labelId, l.comment_id AS commentId, c.text, c.parent_id IS NOT NULL AS isReply, l.topic,
                  l.makes_factual_claim AS factual, l.cites_source AS cites, l.stance_to_parent AS stance,
                  l.has_argument AS argument, l.cost_usd AS costUsd
           FROM labels l JOIN comments c ON c.id = l.comment_id
           WHERE l.model = ? AND l.run_index = 0 AND l.prompt_hash = ?`,
        )
        .all(model, PROMPT_HASH) as Row[]
    ).map((r) => [r.commentId, r]),
  );
const A = rowsFor(args.a);
const B = rowsFor(args.b);
const shared = [...A.keys()].filter((id) => B.has(id));
if (!shared.length) {
  console.log(`No comments labeled by both ${args.a} and ${args.b} with prompt ${PROMPT_HASH}.`);
  process.exit(0);
}

const fallacyStmt = db.prepare(
  "SELECT label_id AS labelId, type, kept, span, rationale, confidence FROM fallacy_labels WHERE label_id = ?",
);
const fallacies = (labelId: number) => fallacyStmt.all(labelId) as Fallacy[];
const keptTypes = (labelId: number) => new Set(fallacies(labelId).filter((f) => f.kept).map((f) => f.type));

/** Cohen's kappa for two binary raters. */
function kappa(pairs: [boolean, boolean][]) {
  const n = pairs.length;
  const agree = pairs.filter(([x, y]) => x === y).length / n;
  const pa = pairs.filter(([x]) => x).length / n;
  const pb = pairs.filter(([, y]) => y).length / n;
  const chance = pa * pb + (1 - pa) * (1 - pb);
  return chance === 1 ? 1 : (agree - chance) / (1 - chance);
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const agreeRate = <T,>(f: (r: Row) => T, filter: (a: Row, b: Row) => boolean = () => true) => {
  const ids = shared.filter((id) => filter(A.get(id)!, B.get(id)!));
  if (!ids.length) return "n/a";
  return `${pct(ids.filter((id) => f(A.get(id)!) === f(B.get(id)!)).length / ids.length)} (n=${ids.length})`;
};

const anyFallacy = shared.map((id) => [keptTypes(A.get(id)!.labelId).size > 0, keptTypes(B.get(id)!.labelId).size > 0] as [boolean, boolean]);
const argPairs = shared.map((id) => [!!A.get(id)!.argument, !!B.get(id)!.argument] as [boolean, boolean]);
const cost = (m: Map<string, Row>) => shared.reduce((n, id) => n + m.get(id)!.costUsd, 0);

console.log(`Comparing on ${shared.length} comments (prompt ${PROMPT_HASH})\n  A = ${args.a}\n  B = ${args.b}\n`);
console.table({
  "Is an argument": { agreement: agreeRate((r) => r.argument), kappa: kappa(argPairs).toFixed(2), A: pct(argPairs.filter(([x]) => x).length / shared.length), B: pct(argPairs.filter(([, y]) => y).length / shared.length) },
  "Any fallacy kept": { agreement: `${pct(anyFallacy.filter(([x, y]) => x === y).length / shared.length)} (n=${shared.length})`, kappa: kappa(anyFallacy).toFixed(2), A: pct(anyFallacy.filter(([x]) => x).length / shared.length), B: pct(anyFallacy.filter(([, y]) => y).length / shared.length) },
  Topic: { agreement: agreeRate((r) => r.topic), kappa: "", A: "", B: "" },
  "States a fact": { agreement: agreeRate((r) => r.factual), kappa: "", A: "", B: "" },
  "Cites a source (when both see a fact)": { agreement: agreeRate((r) => r.cites, (a, b) => !!a.factual && !!b.factual), kappa: "", A: "", B: "" },
  "Stance to parent (replies)": { agreement: agreeRate((r) => r.stance, (a) => !!a.isReply), kappa: "", A: "", B: "" },
});

const typeCounts = (m: Map<string, Row>) => {
  const c: Record<string, number> = {};
  for (const id of shared) for (const t of keptTypes(m.get(id)!.labelId)) c[t] = (c[t] ?? 0) + 1;
  return c;
};
const ca = typeCounts(A);
const cb = typeCounts(B);
const types = [...new Set([...Object.keys(ca), ...Object.keys(cb)])].sort();
if (types.length) {
  console.log("\nKept fallacy labels by type (comments):");
  console.table(Object.fromEntries(types.map((t) => [t, { A: ca[t] ?? 0, B: cb[t] ?? 0 }])));
}
const dropped = (m: Map<string, Row>) => shared.reduce((n, id) => n + fallacies(m.get(id)!.labelId).filter((f) => !f.kept).length, 0);
console.log(`Labels discarded by post-processing: A ${dropped(A)}, B ${dropped(B)}`);
console.log(`Cost on these comments: A $${cost(A).toFixed(3)}, B $${cost(B).toFixed(3)}`);

// Disagreements about fallacies, for reading.
const disagreements = shared.filter((id) => {
  const a = [...keptTypes(A.get(id)!.labelId)].sort().join();
  const b = [...keptTypes(B.get(id)!.labelId)].sort().join();
  return a !== b;
});
console.log(`\n${disagreements.length} comments where the kept fallacy labels differ.`);
const fmt = (labelId: number) =>
  fallacies(labelId)
    .map((f) => `    ${f.kept ? "KEPT   " : "dropped"} ${f.type} (${f.confidence}): "${f.span}"\n             ${f.rationale}`)
    .join("\n") || "    (none)";
for (const id of disagreements.slice(0, Number(args.show))) {
  const a = A.get(id)!;
  console.log("\n" + "-".repeat(60));
  console.log(`${a.isReply ? "(reply) " : ""}${a.text?.slice(0, 500) ?? "(text purged)"}`);
  console.log(`  A (${args.a}):\n${fmt(a.labelId)}`);
  console.log(`  B (${args.b}):\n${fmt(B.get(id)!.labelId)}`);
}
db.close();
