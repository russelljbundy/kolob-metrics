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

    -- One row per model run over one comment. Spans quote comment text, so
    -- they are purged together with it.
    CREATE TABLE IF NOT EXISTS labels (
      id                   INTEGER PRIMARY KEY,
      comment_id           TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
      model                TEXT NOT NULL,
      run_index            INTEGER NOT NULL,
      rubric_version       TEXT NOT NULL,
      prompt_hash          TEXT NOT NULL,
      topic                TEXT NOT NULL,
      makes_factual_claim  INTEGER NOT NULL,
      cites_source         INTEGER,
      stance_to_parent     TEXT,
      has_argument         INTEGER NOT NULL,
      non_argument_type    TEXT,
      claim_span           TEXT,
      support_span         TEXT,
      input_tokens         INTEGER,
      cache_read_tokens    INTEGER,
      cache_write_tokens   INTEGER,
      output_tokens        INTEGER,
      cost_usd             REAL,
      created_at           TEXT NOT NULL,
      UNIQUE (comment_id, model, run_index, prompt_hash)
    );

    CREATE TABLE IF NOT EXISTS fallacy_labels (
      label_id             INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
      type                 TEXT NOT NULL,
      confidence           REAL NOT NULL,
      span_found           INTEGER NOT NULL,
      conditions_complete  INTEGER NOT NULL,
      context_ok           INTEGER NOT NULL,
      kept                 INTEGER NOT NULL,  -- passed every post-processing rule
      span                 TEXT,
      rationale            TEXT
    );
    CREATE INDEX IF NOT EXISTS fallacy_labels_label ON fallacy_labels (label_id);
  `);
  return db;
}

export type Db = ReturnType<typeof openDb>;

/**
 * Null out comment text older than the retention window, plus every label
 * field that quotes or paraphrases it. Returns comments purged.
 */
export function purgeExpiredText(db: Db, now = new Date()) {
  const cutoff = new Date(now.getTime() - TEXT_RETENTION_DAYS * 86_400_000).toISOString();
  const expired = "SELECT id FROM comments WHERE fetched_at < ?";
  db.exec("BEGIN");
  try {
    db.prepare(
      `UPDATE labels SET claim_span = NULL, support_span = NULL
       WHERE comment_id IN (${expired}) AND (claim_span IS NOT NULL OR support_span IS NOT NULL)`,
    ).run(cutoff);
    db.prepare(
      `UPDATE fallacy_labels SET span = NULL, rationale = NULL
       WHERE label_id IN (SELECT id FROM labels WHERE comment_id IN (${expired}))
         AND (span IS NOT NULL OR rationale IS NOT NULL)`,
    ).run(cutoff);
    const res = db
      .prepare(
        `UPDATE comments SET text = NULL, text_purged_at = ?
         WHERE text IS NOT NULL AND fetched_at < ?`,
      )
      .run(now.toISOString(), cutoff);
    db.exec("COMMIT");
    return Number(res.changes);
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
