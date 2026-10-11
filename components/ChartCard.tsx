"use client";

import { useState, type ReactNode } from "react";

export type TableData = { columns: string[]; rows: (string | number)[][] };

export default function ChartCard({
  title,
  subtitle,
  table,
  children,
}: {
  title: string;
  subtitle?: string;
  table: TableData;
  children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className="bg-surface-1 border border-line rounded-xl p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-ink-2 mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={() => setShowTable((s) => !s)}
          className="ml-auto shrink-0 text-xs text-ink-2 hover:text-ink border border-line rounded-md px-2.5 py-1"
          aria-pressed={showTable}
        >
          {showTable ? "Chart" : "Table"}
        </button>
      </div>
      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-ink-2 text-left">
                {table.columns.map((c) => (
                  <th key={c} className="font-medium py-1.5 pr-4 border-b border-line whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((v, j) => (
                    <td key={j} className="py-1.5 pr-4 border-b border-line text-ink whitespace-nowrap">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-xs text-ink-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ background: it.color }} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
