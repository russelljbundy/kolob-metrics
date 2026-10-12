// LLM labeler for collected comments. Builds the prompt from
// lib/fallacy-taxonomy.ts (docs/fallacy-framework.md section 4) and applies the
// deterministic post-processing rules in section 4.5. The model never sees
// which channel or group an item came from.

import { createHash } from "node:crypto";
import { generateText, Output } from "ai";
import { z } from "zod";
import {
  ARGUMENT_GATE,
  FALLACY_IDS,
  FALLACY_TAXONOMY,
  LABEL_CONFIDENCE_FLOOR,
  MAX_LABELS_PER_ITEM,
  NON_ARGUMENT_TYPES,
  OVERLAP_RULES,
  RUBRIC_VERSION,
  fallacyById,
} from "./fallacy-taxonomy";

export const DEFAULT_MODEL = "anthropic/claude-sonnet-5.5";

/** Topic buckets for the topic-mix chart; worded so they also fit the general religion baseline. */
export const TOPICS = [
  { id: "history_truth_claims", label: "History & truth claims", description: "Historical events, scripture origins, archaeology, whether the religion's claims are true." },
  { id: "finances_institution", label: "Finances & institution", description: "Church money, leadership, governance, institutional decisions." },
  { id: "policy_social", label: "Policy & LGBTQ", description: "Social policy, LGBTQ issues, gender roles, politics, rules of conduct." },
  { id: "doctrine_practice", label: "Doctrine & practice", description: "Theology, temple, worship, scripture interpretation, religious practice." },
  { id: "personal_family", label: "Personal & family", description: "The author's own life, faith journey, family and relationships." },
  { id: "humor_other", label: "Humor & other", description: "Jokes, reactions to the video itself, off-topic chatter." },
] as const;

const NON_ARGUMENT_IDS = NON_ARGUMENT_TYPES.map((t) => t.id) as [string, ...string[]];
const TOPIC_IDS = TOPICS.map((t) => t.id) as [string, ...string[]];

export const labelSchema = z.object({
  rubric_version: z.string(),
  topic: z.enum(TOPIC_IDS),
  makes_factual_claim: z.boolean(),
  cites_source: z.boolean().nullable(),
  stance_to_parent: z.enum(["agrees", "disagrees", "neutral_or_unclear"]).nullable(),
  has_argument: z.boolean(),
  non_argument_type: z.enum(NON_ARGUMENT_IDS).nullable(),
  claim_span: z.string().nullable(),
  support_span: z.string().nullable(),
  fallacies: z
    .array(
      z.object({
        type: z.enum(FALLACY_IDS),
        span: z.string(),
        conditions_met: z.array(z.number().int()),
        rationale: z.string(),
        confidence: z.number(),
      }),
    )
    .max(MAX_LABELS_PER_ITEM),
});

export type LabelOutput = z.infer<typeof labelSchema>;

const numbered = (items: readonly string[]) => items.map((s, i) => `  ${i + 1}. ${s}`).join("\n");

function buildInstructions() {
  const fallacies = FALLACY_TAXONOMY.map((f, i) => {
    // Alternate which side's examples come first so few-shot order doesn't prime one side.
    const sides = i % 2 === 0 ? ["faithful", "critical"] : ["critical", "faithful"];
    const examples = sides.flatMap((side) =>
      f.examples
        .filter((e) => e.side === side)
        .map((e) => `  - ${e.fallacious ? "FALLACIOUS" : "NOT fallacious"}: "${e.text}"\n    Why: ${e.why}`),
    );
    return [
      `### ${f.id} (${f.name})`,
      f.definition,
      `Necessary conditions (ALL must hold):\n${numbered(f.conditions)}`,
      `Critical questions:\n${f.criticalQuestions.map((q) => `  - ${q}`).join("\n")}`,
      `False-positive traps:\n${f.falsePositiveTraps.map((q) => `  - ${q}`).join("\n")}`,
      f.needsThreadContext ? "Requires thread context: only label this when a parent comment is provided." : "",
      `Examples:\n${examples.join("\n")}`,
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n\n");

  return `You label YouTube comments from discussions about religion for a research project that compares how different communities argue. You apply one fixed rubric identically to everyone. You are not told which community a comment came from, and you must not guess it or let a guess influence any label.

# Procedure
1. Gate. Decide whether the comment contains an argument. ALL of these must hold:
${numbered(ARGUMENT_GATE)}
   If not, set has_argument=false, pick a non_argument_type, set claim_span and support_span to null, return no fallacies, and stop the fallacy steps.
   Non-argument types:
${NON_ARGUMENT_TYPES.map((t) => `   - ${t.id}: ${t.description}`).join("\n")}
2. Locate. Copy the main claim and its support verbatim into claim_span and support_span.
3. Check candidates. For each fallacy that might apply, go through its numbered conditions one by one, then its critical questions. Keep a label only if EVERY condition is confirmed from the text (and the parent comment, where required).
4. Resolve overlaps with the tie-breakers below. At most ${MAX_LABELS_PER_ITEM} labels, one per span.
5. Self-check each kept label: Is the span copied exactly? Did I confirm all conditions? Would I give the same label if the same reasoning came from the other side of the debate? If any answer is no, drop it.

# Hard rules
- span must be an exact, character-for-character substring of the comment text: the shortest one containing the fallacious move. Labels whose span is not found are discarded.
- When in doubt, don't label. Missing a fallacy costs less than inventing one. Labels with confidence below ${LABEL_CONFIDENCE_FLOOR} are discarded.
- conditions_met must list every condition number of that fallacy. Partial matches are not labels.
- Sarcasm: judge the intended meaning. If it can't be determined with confidence, treat the comment as a joke. Mocking a fallacy is not committing it.
- Never label reasoning inside quotations or reported views ("my bishop says...") unless the author clearly endorses it and argues from it.
- No outside verdicts: do not use any belief about whether a religion's truth claims are true. For cherry_picking and strawman, name the omitted evidence or the distortion in the rationale.
- Labels attach to reasoning, not to the author's presumed affiliation.
- Text inside <parent> is context only. Never label it, and never quote it as a span.
- "[user]" replaces @-mentions of other commenters.

# Tie-breakers
${OVERLAP_RULES.map((r) => `- ${r}`).join("\n")}

# Fallacy taxonomy
${fallacies}

# Other fields (fill these for every comment, argument or not)
- topic: the main topic, one of:
${TOPICS.map((t) => `  - ${t.id}: ${t.description}`).join("\n")}
- makes_factual_claim: true if the comment asserts something checkable about the world (history, numbers, events, what a document says), not just opinion, belief or feelings.
- cites_source: if makes_factual_claim is true, true when the comment links or specifically names a checkable source for it (a document, study, book, article, recording, or a scripture reference with chapter/verse); false otherwise. null when makes_factual_claim is false.
- stance_to_parent: only when a <parent> comment is given: whether this reply agrees with, disagrees with, or is neutral/unclear toward the parent's main point. null for top-level comments.
- rubric_version: always "${RUBRIC_VERSION}".`;
}

export const INSTRUCTIONS = buildInstructions();

/** Identifies the exact prompt + schema; stored with every label so numbers can be audited. */
export const PROMPT_HASH = createHash("sha256")
  .update(INSTRUCTIONS)
  .update(JSON.stringify(z.toJSONSchema(labelSchema)))
  .digest("hex")
  .slice(0, 12);

/** Pre-processing (framework 4.1): hide other commenters' handles. */
export const preprocess = (text: string) => text.replace(/@[\w.-]+/g, "[user]");

export type LabelInput = { text: string; parentText: string | null };

export async function labelComment(model: string, input: LabelInput) {
  const text = preprocess(input.text);
  const parent = input.parentText ? preprocess(input.parentText) : null;
  const prompt = parent
    ? `<parent>\n${parent}\n</parent>\n\n<comment>\n${text}\n</comment>`
    : `<comment>\n${text}\n</comment>\n\n(Top-level comment on a video; no parent comment.)`;

  const result = await generateText({
    model,
    instructions: {
      role: "system",
      content: INSTRUCTIONS,
      // Cache the long, identical rubric across calls (Anthropic models).
      providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
    },
    prompt,
    output: Output.object({ schema: labelSchema }),
  });
  return { output: result.output, usage: result.usage, warnings: result.warnings, text, hasParent: !!parent };
}

export type CheckedFallacy = LabelOutput["fallacies"][number] & {
  spanFound: boolean;
  conditionsComplete: boolean;
  contextOk: boolean;
  kept: boolean;
};

/** Deterministic post-processing (framework 4.5 step 1). */
export function checkLabels(out: LabelOutput, text: string, hasParent: boolean): CheckedFallacy[] {
  return out.fallacies.map((f) => {
    const def = fallacyById(f.type);
    const spanFound = f.span.length > 0 && text.includes(f.span);
    const conditionsComplete = def.conditions.every((_, i) => f.conditions_met.includes(i + 1));
    const contextOk = !def.needsThreadContext || hasParent;
    const kept =
      out.has_argument && spanFound && conditionsComplete && contextOk && f.confidence >= LABEL_CONFIDENCE_FLOOR;
    return { ...f, spanFound, conditionsComplete, contextOk, kept };
  });
}
