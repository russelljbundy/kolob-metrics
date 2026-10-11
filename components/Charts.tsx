"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import ChartCard, { Legend } from "./ChartCard";
import {
  COMMUNITIES,
  EVENTS,

  TOPICS,
  fallacyRates,
  reactionTimeline,
  topicMix,
} from "@/lib/mock-data";

const series = (i: number) => `var(--series-${i + 1})`;
const axisTick = { fill: "var(--text-muted)", fontSize: 12 };
const communityLegend = COMMUNITIES.map((c, i) => ({ label: c.label, color: series(i) }));
const labelOf = (key: string) => COMMUNITIES.find((c) => c.key === key)?.label ?? key;

function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
  title,
}: TooltipProps<number, string> & { unit?: string; title?: (l: string) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface-1 px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-ink mb-1">{title ? title(String(label)) : label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2 text-ink-2">
          <span className="inline-block size-2 rounded-sm" style={{ background: p.color }} />
          <span>{labelOf(String(p.dataKey))}</span>
          <span className="ml-auto pl-4 text-ink tabular-nums">
            {p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function FallacyChart() {
  return (
    <ChartCard
      title="Logical fallacy rate, by type"
      subtitle="% of sampled posts and comments flagged for each fallacy. Last 30 days."
      table={{
        columns: ["Fallacy", ...COMMUNITIES.map((c) => c.label)],
        rows: fallacyRates.map((r) => [r.type, ...COMMUNITIES.map((c) => `${r[c.key]}%`)]),
      }}
    >
      <Legend items={communityLegend} />
      <div className="h-[420px]">
        <ResponsiveContainer>
          <BarChart data={fallacyRates} layout="vertical" barGap={2} barCategoryGap="22%" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="var(--grid)" />
            <XAxis type="number" tick={axisTick} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="type" tick={axisTick} width={130} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip unit="%" />} cursor={{ fill: "var(--grid)", opacity: 0.5 }} />
            {COMMUNITIES.map((c, i) => (
              <Bar key={c.key} isAnimationActive={false} dataKey={c.key} fill={series(i)} radius={[0, 4, 4, 0]} maxBarSize={14} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopicMixChart() {
  return (
    <ChartCard
      title="What each community talks about"
      subtitle="Share of posts by main topic. Each bar adds up to 100%."
      table={{
        columns: ["Community", ...TOPICS],
        rows: topicMix.map((r) => [r.community, ...TOPICS.map((t) => `${r[t]}%`)]),
      }}
    >
      <Legend items={TOPICS.map((t, i) => ({ label: t, color: series(i) }))} />
      <div className="h-[260px]">
        <ResponsiveContainer>
          <BarChart data={topicMix} layout="vertical" barCategoryGap="28%" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" domain={[0, 100]} tick={axisTick} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="community" tick={axisTick} width={130} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "var(--grid)", opacity: 0.5 }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-line bg-surface-1 px-3 py-2 text-xs shadow-sm">
                    <div className="font-medium text-ink mb-1">{label}</div>
                    {payload.map((p) => (
                      <div key={String(p.dataKey)} className="flex items-center gap-2 text-ink-2">
                        <span className="inline-block size-2 rounded-sm" style={{ background: p.color }} />
                        <span>{p.dataKey}</span>
                        <span className="ml-auto pl-4 text-ink tabular-nums">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                ) : null
              }
            />
            {TOPICS.map((t, i) => (
              <Bar
                key={t}
                dataKey={t}
                stackId="mix"
                isAnimationActive={false}
                fill={series(i)}
                stroke="var(--surface-1)"
                strokeWidth={2}
                maxBarSize={28}
                radius={i === TOPICS.length - 1 ? [0, 4, 4, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const fmtWeek = (w: string) =>
  new Date(w + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function ReactionTimeline() {
  return (
    <ChartCard
      title="How each community reacts to Church events"
      subtitle="Weekly post volume, indexed so a typical week = 100. Vertical lines mark Church events."
      table={{
        columns: ["Week of", ...COMMUNITIES.map((c) => c.label)],
        rows: reactionTimeline.map((r) => [fmtWeek(String(r.week)), ...COMMUNITIES.map((c) => r[c.key])]),
      }}
    >
      <Legend items={communityLegend} />
      <div className="h-[320px]">
        <ResponsiveContainer>
          <LineChart data={reactionTimeline} margin={{ top: 24, left: 0, right: 16 }}>
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis dataKey="week" tick={axisTick} tickFormatter={fmtWeek} axisLine={false} tickLine={false} minTickGap={28} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} domain={[80, "auto"]} />
            {EVENTS.map((e, i) => (
              <ReferenceLine
                key={e.week}
                x={e.week}
                stroke="var(--text-muted)"
                strokeWidth={1}
                label={{
                  value: String(i + 1),
                  position: "top",
                  fill: "var(--text-secondary)",
                  fontSize: 11,
                }}
              />
            ))}
            <Tooltip
              content={<ChartTooltip title={(w) => `Week of ${fmtWeek(w)}`} />}
              cursor={{ stroke: "var(--text-muted)", strokeWidth: 1 }}
            />
            {COMMUNITIES.map((c, i) => (
              <Line
                key={c.key}
                dataKey={c.key}
                isAnimationActive={false}
                stroke={series(i)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "var(--surface-1)", strokeWidth: 2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ol className="mt-3 text-xs text-ink-2 space-y-0.5">
        {EVENTS.map((e, i) => (
          <li key={e.week}>
            <span className="text-ink font-medium">{i + 1}.</span> {e.label}, week of {fmtWeek(e.week)}
          </li>
        ))}
      </ol>
    </ChartCard>
  );
}

