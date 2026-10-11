import type { Metadata } from "next";

export const metadata: Metadata = { title: "Methodology · Kolob Metrics" };

const sections: { h: string; body: string[] }[] = [
  {
    h: "Why compare four groups",
    body: [
      "Every metric is run the same way on four groups: ex-member, mixed (both sides in dialogue), faithful Latter-day Saint, and a general religion baseline. A fallacy rate of 30% says little on its own. Next to the same measurement for the other groups, it becomes a finding, whichever way it points.",
    ],
  },
  {
    h: "Data collection",
    body: [
      "The first source is public YouTube comments, read through the official YouTube Data API from 3 to 4 channels per group. Using several channels keeps any one creator's audience from defining a group. Reddit (r/exmormon, r/mormon, r/latterdaysaints and r/religion) will be added if Reddit approves API access.",
      "Each month, every group gets the same fixed sample: 600 comment threads, split equally across its channels and drawn at random. No single video can supply more than a quarter of a channel's share. A channel that falls short is reported as short, not topped up from the others.",
      "No usernames or commenter IDs are stored, and no individual is singled out. Comment text is deleted 30 days after collection. Only aggregate results are kept.",
    ],
  },
  {
    h: "Classification (in development)",
    body: [
      "A language model labels each sampled comment with structured fields: main topic, whether it makes a factual claim, whether that claim cites a source, and any logical fallacies from a fixed list of 15.",
      "It first decides whether the comment makes an argument at all. Venting, personal stories, jokes, questions and statements of belief or doubt are not arguments, so they are never labeled as fallacies. A fallacy is labeled only when every condition in its checklist is met, with the exact words quoted.",
    ],
  },
  {
    h: "Reliability",
    body: [
      "Research shows even trained people often disagree about fallacies, and language models tend to over-flag them. So a fallacy type is published only if it passes thresholds fixed in advance: agreement between independent human raters (believing members, ex-members and outsiders, who don't see which group a comment came from), consistency across repeated runs and different models, and equal accuracy across groups.",
      "Types that fail are not shown. Fallacy rates are reported as a share of comments that make an argument, with that share shown alongside.",
    ],
  },
  {
    h: "Definitions",
    body: [
      "The 15 fallacy types are ad hominem, poisoning the well, strawman, genetic fallacy, tu quoque, no true Scotsman, hasty generalization, cherry-picking, faulty appeal to authority, appeal to popularity, appeal to consequences, false dilemma, special pleading, moving the goalposts and circular reasoning. The framework document gives each one's conditions and examples from both sides.",
      "Echo-chamber score: how much less dissenting replies are upvoted than agreeing ones in the same thread, scaled 0 to 100.",
    ],
  },
  {
    h: "Limitations",
    body: [
      "A handful of channels or subreddits doesn't represent everyone in a group, and channel choices can be argued with. Results will be re-run with contested channels moved or removed, and published if they change. Moderation and comment filtering differ between channels, which changes what gets posted. Model labels carry error, so charts will show confidence intervals once real data is in.",
    ],
  },
];

const REPO = "https://github.com/russelljbundy/kolob-metrics";

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
      <section className="space-y-2">
        <h2 className="font-semibold text-ink">Full documents</h2>
        <ul className="list-disc pl-5 text-ink-2 space-y-1">
          <li>
            <a className="text-accent underline" href={`${REPO}/blob/main/docs/fallacy-framework.md`}>
              Fallacy framework
            </a>
          </li>
          <li>
            <a className="text-accent underline" href={`${REPO}/blob/main/docs/channel-selection.md`}>
              Channel selection and sampling
            </a>
          </li>
          <li>
            <a className="text-accent underline" href={REPO}>
              Source code
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
