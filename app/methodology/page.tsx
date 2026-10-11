import type { Metadata } from "next";

export const metadata: Metadata = { title: "Methodology · Kolob Metrics" };

const sections: { h: string; body: string[] }[] = [
  {
    h: "Why compare four communities",
    body: [
      "Every metric is run the same way on r/exmormon (ex-member), r/mormon (mixed), r/latterdaysaints (faithful) and r/religion (a general baseline). A fallacy rate of 30% says little on its own. Next to the same measurement for other communities, it becomes a finding, whichever way it points.",
    ],
  },
  {
    h: "Data collection (planned)",
    body: [
      "Posts and top-level comments are collected daily through the official Reddit Data API, within its terms. Only aggregate counts are stored for display. Usernames are never shown and no individual is singled out.",
    ],
  },
  {
    h: "Classification (planned)",
    body: [
      "Each post is labeled by a language model that returns structured fields: main topic, sentiment, whether it makes a factual claim, whether that claim cites a source, and any logical fallacies, from a fixed list.",
      "Fallacy detection is subjective. Before any number goes live, about 200 posts per community are labeled by hand and compared with the model's labels. The agreement score (Cohen's kappa) is published here, and metrics that score below 0.6 are not shown.",
    ],
  },
  {
    h: "Definitions",
    body: [
      "Ad hominem: attacking a person instead of their argument. Strawman: rebutting a distorted version of a position. Hasty generalization: a broad conclusion from a few cases. Genetic fallacy: judging a claim only by where it came from. Appeal to emotion: using feelings in place of evidence.",
      "Echo-chamber score: how much less dissenting comments are upvoted than agreeing comments in the same thread, scaled 0 to 100.",
    ],
  },
  {
    h: "Limitations",
    body: [
      "Subreddits do not represent everyone in a group. Moderation rules differ, which changes what gets posted. Model labels carry error, so every chart will show confidence intervals once real data is in. Readers will be able to flag misclassified examples.",
    ],
  },
];

export default function Methodology() {
  return (
    <article className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-semibold text-ink">Methodology</h1>
      {sections.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="font-semibold text-ink">{s.h}</h2>
          {s.body.map((p, i) => (
            <p key={i} className="text-ink-2 leading-relaxed">{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
