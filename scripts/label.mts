// Label collected comments with the LLM classifier (lib/classifier.ts).
//
//   npm run label -- --month 2026-09 --dry-run    count items + estimate cost, no API calls
//   npm run label -- --month 2026-09 --limit 20   label 20 comments, print examples
//   npm run label -- --month 2026-09              label everything not yet labeled
//
// Other flags: --channel <@handle>, --group <key>, --model <gateway id>
// (default anthropic/claude-sonnet-5.5), --runs <k> (repeat runs per comment,
// for consistency checks; default 1), --concurrency <n> (default 6),
// --max-cost <usd> (stop once spend reaches this; default 5), --show <n>
// (examples to print at the end; default 5).
//
// Auth: AI Gateway via AI_GATEWAY_API_KEY, or VERCEL_OIDC_TOKEN from
// `vercel env pull .env.vercel.local` (expires after 12 hours).
// Re-running skips comments already labeled with the same model, run index
// and prompt hash, so an interrupted run can be resumed.

import { parseArgs } from "node:util";
import { CHANNELS } from "../lib/channels";
import {
  DEFAULT_MODEL,
  INSTRUCTIONS,
  PROMPT_HASH,
  checkLabels,
  labelComment,
  type CheckedFallacy,
} from "../lib/classifier";
import { openDb, purgeExpiredText } from "../lib/db";
import { RUBRIC_VERSION } from "../lib/fallacy-taxonomy";

const { values: args } = parseArgs({
  options: {
    month: { type: "string" },
    channel: { type: "string" },
    group: { type: "string" },
    model: { type: "string", default: DEFAULT_MODEL },
    runs: { type: "string", default: "1" },
    limit: { type: "string" },
    concurrency: { type: "string", default: "6" },
    "max-cost": { type: "string", default: "5" },
    show: { type: "string", default: "5" },
    "dry-run": { type: "boolean", default: false },
  },
});

for (const f of [".env.local", ".env.vercel.local"]) {
  try {
    process.loadEnvFile(f);
  } catch {}
}

const model = args.model;
const runs = Number(args.runs);
const maxCost = Number(args["max-cost"]);
const channelIds = CHANNELS.filter(
  (c) => (!args.group || c.group === args.group) && (!args.channel || c.handle === args.channel),
).map((c) => c.channelId);
if (!channelIds.length) throw new Error("No channels match --group/--channel.");

const db = openDb();
purgeExpiredText(db);

type Item = { id: string; text: string; parentText: string | null; groupKey: string };

const items: (Item & { runIndex: number })[] = [];
const selectItems = db.prepare(`
  SELECT c.id, c.text, p.text AS parentText, c.group_key AS groupKey
  FROM comments c LEFT JOIN comments p ON p.id = c.parent_id
  WHERE c.text IS NOT NULL
    AND (? IS NULL OR c.month = ?)
    AND c.channel_id IN (${channelIds.map(() => "?").join(",")})
    AND NOT EXISTS (SELECT 1 FROM labels l WHERE l.comment_id = c.id AND l.model = ? AND l.run_index = ? AND l.prompt_hash = ?)
  ORDER BY c.id`);
for (let run = 0; run < runs; run++) {
  const rows = selectItems.all(args.month ?? null, args.month ?? null, ...channelIds, model, run, PROMPT_HASH) as Item[];
  items.push(...rows.map((r) => ({ ...r, runIndex: run })));
}
if (args.limit) items.splice(Number(args.limit));

// Prices per token, from the gateway's public model list.
type Pricing = { input: number; output: number; cacheRead: number; cacheWrite: number };
async function fetchPricing(id: string): Promise<Pricing | null> {
  const res = await fetch("https://ai-gateway.vercel.sh/v1/models");
  const { data } = (await res.json()) as { data: { id: string; pricing?: Record<string, string> }[] };
  const p = data.find((m) => m.id === id)?.pricing;
  if (!p) return null;
  const n = (k: string, fallback: string) => Number(p[k] ?? p[fallback] ?? 0);
  return { input: n("input", "input"), output: n("output", "output"), cacheRead: n("input_cache_read", "input"), cacheWrite: n("input_cache_write", "input") };
}
const pricing = await fetchPricing(model);
if (!pricing) console.warn(`No public pricing found for ${model}; cost will show as 0.`);

const promptTokensEst = Math.round(INSTRUCTIONS.length / 4);
console.log(
  `Model ${model} · rubric ${RUBRIC_VERSION} · prompt ${PROMPT_HASH} (~${promptTokensEst.toLocaleString()} tokens of instructions)`,
);
console.log(`${items.length} comment-runs to label${args.month ? ` for ${args.month}` : ""}.`);

if (args["dry-run"]) {
  if (pricing) {
    const avgItemTokens = items.reduce((n, i) => n + (i.text.length + (i.parentText?.length ?? 0)) / 4 + 30, 0) / Math.max(1, items.length);
    const perItem = promptTokensEst * pricing.cacheRead + avgItemTokens * pricing.input + 350 * pricing.output;
    console.log(
      `Estimated cost: ~$${(perItem * items.length).toFixed(2)} (assumes the rubric is cached and ~350 output tokens per comment; first calls cost more while the cache warms).`,
    );
  }
  db.close();
  process.exit(0);
}

const insertLabel = db.prepare(`
  INSERT INTO labels (comment_id, model, run_index, rubric_version, prompt_hash, topic, makes_factual_claim, cites_source,
    stance_to_parent, has_argument, non_argument_type, claim_span, support_span, input_tokens, cache_read_tokens,
    cache_write_tokens, output_tokens, cost_usd, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertFallacy = db.prepare(`
  INSERT INTO fallacy_labels (label_id, type, confidence, span_found, conditions_complete, context_ok, kept, span, rationale)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let spent = 0;
let done = 0;
let failed = 0;
let stopReason = "";
const warnings = new Set<string>();
const examples: { text: string; parent: boolean; out: { has_argument: boolean; non_argument_type: string | null; topic: string }; fallacies: CheckedFallacy[] }[] = [];

const isFatal = (e: unknown) => {
  const status = (e as { statusCode?: number })?.statusCode;
  return status === 401 || status === 402 || status === 403;
};

async function work(item: Item & { runIndex: number }) {
  const { output, usage, warnings: w, text, hasParent } = await labelComment(model, item);
  for (const x of w ?? []) warnings.add(JSON.stringify(x));

  const noCache = usage.inputTokenDetails?.noCacheTokens ?? usage.inputTokens ?? 0;
  const cacheRead = usage.inputTokenDetails?.cacheReadTokens ?? 0;
  const cacheWrite = usage.inputTokenDetails?.cacheWriteTokens ?? 0;
  const out = usage.outputTokens ?? 0;
  const cost = pricing
    ? noCache * pricing.input + cacheRead * pricing.cacheRead + cacheWrite * pricing.cacheWrite + out * pricing.output
    : 0;
  spent += cost;

  const checked = checkLabels(output, text, hasParent);
  db.exec("BEGIN");
  try {
    const res = insertLabel.run(
      item.id, model, item.runIndex, output.rubric_version, PROMPT_HASH, output.topic, Number(output.makes_factual_claim),
      output.cites_source === null ? null : Number(output.cites_source), output.stance_to_parent, Number(output.has_argument),
      output.non_argument_type, output.claim_span, output.support_span, usage.inputTokens ?? null, cacheRead, cacheWrite, out,
      cost, new Date().toISOString(),
    );
    for (const f of checked) {
      insertFallacy.run(
        res.lastInsertRowid, f.type, f.confidence, Number(f.spanFound), Number(f.conditionsComplete), Number(f.contextOk),
        Number(f.kept), f.span, f.rationale,
      );
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  done++;
  if (examples.length < 200) examples.push({ text, parent: hasParent, out: output, fallacies: checked });
}

// Simple worker pool.
let next = 0;
async function worker() {
  while (next < items.length && !stopReason) {
    if (spent >= maxCost) {
      stopReason = `Reached --max-cost $${maxCost}.`;
      break;
    }
    const item = items[next++];
    try {
      await work(item);
    } catch (e) {
      if (isFatal(e)) {
        stopReason = (e as Error).message;
        break;
      }
      failed++;
      console.error(`Failed on comment ${item.id}: ${(e as Error).message.slice(0, 200)}`);
    }
    if ((done + failed) % 25 === 0) console.log(`  ${done + failed}/${items.length} · $${spent.toFixed(3)}`);
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency) }, worker));

if (stopReason) console.error(`\nStopped early: ${stopReason}`);
if (warnings.size) console.warn(`Model warnings: ${[...warnings].join("; ")}`);

// Summary of this run.
const argued = examples.filter((e) => e.out.has_argument).length;
const kept = examples.flatMap((e) => e.fallacies.filter((f) => f.kept));
const dropped = examples.flatMap((e) => e.fallacies.filter((f) => !f.kept));
console.log(`\nLabeled ${done}, failed ${failed}. Cost $${spent.toFixed(3)} (~$${(spent / Math.max(1, done)).toFixed(4)} per comment).`);
console.log(`Arguments: ${argued}/${examples.length}. Fallacy labels kept: ${kept.length}, discarded by post-processing: ${dropped.length}.`);

const show = Number(args.show);
const withFallacy = examples.filter((e) => e.fallacies.length);
const sample = [...withFallacy.slice(0, Math.ceil(show / 2)), ...examples.filter((e) => !e.fallacies.length).slice(0, Math.floor(show / 2))];
for (const e of sample) {
  console.log("\n" + "-".repeat(60));
  console.log(`${e.parent ? "(reply) " : ""}${e.text.slice(0, 400)}${e.text.length > 400 ? "…" : ""}`);
  console.log(`→ topic ${e.out.topic}; ${e.out.has_argument ? "ARGUMENT" : `not an argument (${e.out.non_argument_type})`}`);
  for (const f of e.fallacies) {
    const why = [!f.spanFound && "span not found", !f.conditionsComplete && "conditions incomplete", !f.contextOk && "needs parent", f.confidence < 0.7 && "low confidence"].filter(Boolean).join(", ");
    console.log(`  ${f.kept ? "KEPT" : "DROPPED"} ${f.type} (${f.confidence})${why ? ` [${why}]` : ""}: "${f.span}"`);
    console.log(`    ${f.rationale}`);
  }
}
db.close();
if (stopReason) process.exitCode = 2;
