// Local SQLite store for collected comments (Node's built-in node:sqlite).
// No author names or channel IDs of commenters are stored. Comment text is
// nulled 30 days after fetch, per the YouTube API Services policy; classify
// before then. Collector-only: do not import from app/ code.

import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const TEXT_RETENTION_DAYS = 30;

const DB_PATH = path.join(process.cwd(), "data", "kolob.db");

export function openDb() {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS channel_samples (
      month              TEXT NOT NULL,   -- YYYY-MM the videos were published in
      channel_id         TEXT NOT NULL,
      group_key          TEXT NOT NULL,
      target             INTEGER NOT NULL,
      collected          INTEGER NOT NULL,
      videos_in_month    INTEGER NOT NULL,
      threads_available  INTEGER NOT NULL,
      truncated_videos   INTEGER NOT NULL, -- videos with more threads than we paged through
      sampled_at         TEXT NOT NULL,
      PRIMARY KEY (month, channel_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id              TEXT PRIMARY KEY,
      month           TEXT NOT NULL,
      group_key       TEXT NOT NULL,
      channel_id      TEXT NOT NULL,
      video_id        TEXT NOT NULL,
      parent_id       TEXT REFERENCES comments(id) ON DELETE CASCADE,
      published_at    TEXT NOT NULL,
      like_count      INTEGER NOT NULL,
      reply_count     INTEGER,          -- top-level comments only
      text            TEXT,             -- NULL once purged
      fetched_at      TEXT NOT NULL,
      text_purged_at  TEXT
    );
    CREATE INDEX IF NOT EXISTS comments_sample ON comments (month, channel_id);
  `);
  return db;
}

export type Db = ReturnType<typeof openDb>;

/** Null out comment text older than the retention window. Returns rows purged. */
export function purgeExpiredText(db: Db, now = new Date()) {
  const cutoff = new Date(now.getTime() - TEXT_RETENTION_DAYS * 86_400_000).toISOString();
  const res = db
    .prepare(
      `UPDATE comments SET text = NULL, text_purged_at = ?
       WHERE text IS NOT NULL AND fetched_at < ?`,
    )
    .run(now.toISOString(), cutoff);
  return Number(res.changes);
}
