"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
const ORDER: Theme[] = ["system", "light", "dark"];

const listeners = new Set<() => void>();

function read(): Theme {
  try {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && ORDER.includes(saved)) return saved;
  } catch {}
  return "system";
}

function write(theme: Theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  return (
    <button
      onClick={() => write(next)}
      className="text-sm text-ink-2 hover:text-ink border border-line rounded-md px-3 py-1 whitespace-nowrap capitalize sm:normal-case"
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
    >
      <span className="hidden sm:inline">Theme: </span>
      {theme}
    </button>
  );
}
