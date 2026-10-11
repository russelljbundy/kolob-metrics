import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kolob Metrics",
  description:
    "Side-by-side discourse metrics for ex-Mormon, Mormon, LDS and general religion communities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <div className="bg-warn-bg text-warn-text text-center text-sm font-medium px-4 py-2">
          SAMPLE DATA. Every number on this site is a placeholder for the
          mockup, not a real measurement.
        </div>
        <header className="border-b border-line bg-surface-1">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4 sm:gap-6">
            <Link href="/" className="font-semibold text-ink whitespace-nowrap">
              Kolob Metrics
            </Link>
            <Link href="/" className="hidden sm:inline text-sm text-ink-2 hover:text-ink">
              Dashboard
            </Link>
            <Link
              href="/methodology"
              className="text-sm text-ink-2 hover:text-ink"
            >
              Methodology
            </Link>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 flex-1">
          {children}
        </main>
        <footer className="border-t border-line text-xs text-ink-3 px-4 py-6 text-center">
          Aggregate statistics only. No usernames or individual posts are
          shown.
        </footer>
      </body>
    </html>
  );
}
