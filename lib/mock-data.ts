// SAMPLE DATA for the mockup. Numbers are placeholders, deliberately close
// together so the mockup does not imply any real finding.

export const COMMUNITIES = [
  { key: "exmormon", label: "r/exmormon", lean: "Ex-member" },
  { key: "mormon", label: "r/mormon", lean: "Mixed" },
  { key: "latterdaysaints", label: "r/latterdaysaints", lean: "Faithful" },
  { key: "religion", label: "r/religion", lean: "Neutral baseline" },
] as const;

export type CommunityKey = (typeof COMMUNITIES)[number]["key"];

// Small deterministic PRNG so server and client render identical numbers.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** % of sampled posts/comments flagged for each fallacy type. */
export const FALLACY_TYPES = [
  "Ad hominem",
  "Strawman",
  "Hasty generalization",
  "Genetic fallacy",
  "Poisoning the well",
];

export const fallacyRates = (() => {
  const r = rng(7);
  return FALLACY_TYPES.map((type) => {
    const row: Record<string, string | number> = { type };
    for (const c of COMMUNITIES) row[c.key] = Math.round((3 + r() * 9) * 10) / 10;
    return row;
  });
})();

/** Share of posts per topic (sums to 100 per community). */
export const TOPICS = [
  "History & truth claims",
  "Finances",
  "Policy & LGBTQ",
  "Temple & doctrine",
  "Personal & family",
  "Humor & other",
];

export const topicMix = (() => {
  const r = rng(42);
  return COMMUNITIES.map((c) => {
    const raw = TOPICS.map(() => 0.5 + r());
    const sum = raw.reduce((a, b) => a + b, 0);
    const row: Record<string, string | number> = { community: c.label };
    let acc = 0;
    TOPICS.forEach((t, i) => {
      const v = i === TOPICS.length - 1 ? 100 - acc : Math.round((raw[i] / sum) * 100);
      acc += v;
      row[t] = v;
    });
    return row;
  });
})();

/** Annotated events for the reaction timeline. */
export const EVENTS = [
  { week: "2026-04-06", label: "April General Conference" },
  { week: "2026-06-15", label: "Policy announcement (sample)" },
  { week: "2026-10-05", label: "October General Conference" },
];

/** Weekly post volume, indexed so a typical (non-event) week = 100. */
export const reactionTimeline = (() => {
  const r = rng(99);
  const start = new Date("2026-03-30T00:00:00Z"); // Mondays through 2026-10-05
  const weeks = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i * 7);
    return d.toISOString().slice(0, 10);
  });
  const eventIdx = EVENTS.map((e) => weeks.indexOf(e.week));

  return weeks.map((week, i) => {
    const row: Record<string, string | number> = { week };
    COMMUNITIES.forEach((c, ci) => {
      const spike = eventIdx.some((ei) => ei === i)
        ? 25 + r() * 40 * (ci === 3 ? 0.3 : 1)
        : eventIdx.some((ei) => ei === i - 1)
          ? 8 + r() * 12
          : 0;
      row[c.key] = Math.round(88 + r() * 16 + spike);
    });
    return row;
  });
})();

/** Stat tiles: one metric x four communities. */
export const statTiles = [
  {
    metric: "Factual claims citing a source",
    help: "Share of posts making a factual claim that link a primary or news source.",
    unit: "%",
    values: { exmormon: 41, mormon: 47, latterdaysaints: 38, religion: 33 },
  },
  {
    metric: "Echo-chamber score",
    help: "How much less dissenting comments are upvoted than agreeing ones (0 = no difference, 100 = dissent always buried).",
    unit: "",
    values: { exmormon: 52, mormon: 34, latterdaysaints: 49, religion: 29 },
  },
  {
    metric: "Talk about the Church vs. about yourself",
    help: "Share of posts mainly about the institution, as opposed to personal life or recovery.",
    unit: "%",
    values: { exmormon: 58, mormon: 71, latterdaysaints: 44, religion: 39 },
  },
] satisfies {
  metric: string;
  help: string;
  unit: string;
  values: Record<CommunityKey, number>;
}[];
