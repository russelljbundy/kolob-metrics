import { FallacyChart, ReactionTimeline, TopicMixChart } from "@/components/Charts";
import { COMMUNITIES, statTiles } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-ink">
          Religion discourse, side by side
        </h1>
        <p className="text-ink-2 mt-2">
          The same metrics, measured the same way, across four communities: an
          ex-member space, a mixed space, a faithful space and a general
          religion baseline. A number only means something next to the others.
        </p>
        <ul className="flex flex-wrap gap-2 mt-4">
          {COMMUNITIES.map((c, i) => (
            <li
              key={c.key}
              className="flex items-center gap-2 text-xs border border-line bg-surface-1 rounded-full px-3 py-1"
            >
              <span className="size-2.5 rounded-full" style={{ background: `var(--series-${i + 1})` }} />
              <span className="text-ink font-medium">{c.label}</span>
              <span className="text-ink-3">{c.lean}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statTiles.map((t) => (
          <section key={t.metric} className="bg-surface-1 border border-line rounded-xl p-5">
            <h2 className="text-sm font-medium text-ink">{t.metric}</h2>
            <p className="text-xs text-ink-3 mt-1 min-h-[2.5rem]">{t.help}</p>
            <dl className="mt-3 space-y-2">
              {COMMUNITIES.map((c, i) => (
                <div key={c.key} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-sm shrink-0" style={{ background: `var(--series-${i + 1})` }} />
                  <dt className="text-sm text-ink-2">{c.label}</dt>
                  <dd className="ml-auto text-lg font-semibold text-ink tabular-nums">
                    {t.values[c.key]}
                    {t.unit}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <FallacyChart />
      <div className="grid gap-6 lg:grid-cols-2">
        <TopicMixChart />
        <ReactionTimeline />
      </div>
    </div>
  );
}
