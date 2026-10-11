// Collect a month's fixed-quota comment sample from the YouTube channels in
// lib/channels.ts into data/kolob.db.
//
//   npm run collect                     previous calendar month, all channels
//   npm run collect -- --month 2026-09  a specific month
//   npm run collect -- --dry-run        fetch + sample, but write nothing
//
// Other flags: --group <key>, --channel <@handle>, --force (resample channels
// already done for the month), --max-units <n> (default 4000),
// --max-pages <n> (thread pages of 100 per video, default 30),
// --no-full-replies (keep only the up-to-5 replies YouTube inlines).
//
// Each channel is committed on its own, so a run that hits the quota can be
// resumed by re-running the same command: finished channels are skipped.

import { parseArgs } from "node:util";
import {
  CHANNELS,
  COMMENTS_PER_GROUP_PER_MONTH,
  MAX_SHARE_PER_VIDEO,
  channelsFor,
} from "../lib/channels";
import { openDb, purgeExpiredText } from "../lib/db";
import { channelTarget, sampleThreads } from "../lib/sampling";
import {
  CommentsDisabledError,
  QuotaExceededError,
  YouTubeClient,
  type ApiComment,
  type ApiThread,
} from "../lib/youtube";

const { values: args } = parseArgs({
  options: {
    month: { type: "string" },
    group: { type: "string" },
    channel: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    "max-units": { type: "string", default: "4000" },
    "max-pages": { type: "string", default: "30" },
    "no-full-replies": { type: "boolean", default: false },
  },
});

function previousMonth(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return d.toISOString().slice(0, 7);
}

const month = args.month ?? previousMonth();
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error(`--month must be YYYY-MM, got "${month}"`);
const from = new Date(`${month}-01T00:00:00Z`);
const to = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));
const dryRun = args["dry-run"];
const maxPages = Number(args["max-pages"]);

try {
  process.loadEnvFile(".env.local");
} catch {}
const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set (expected in .env.local).");

const yt = new YouTubeClient(apiKey, Number(args["max-units"]));
const db = openDb();

const purged = purgeExpiredText(db);
if (purged) console.log(`Purged text from ${purged} comments older than 30 days.`);

if (to > new Date()) {
  console.warn(`Note: ${month} hasn't ended. Comments are still arriving, so this sample is partial.`);
}

const selected = CHANNELS.filter(
  (c) => (!args.group || c.group === args.group) && (!args.channel || c.handle === args.channel),
);
if (!selected.length) throw new Error("No channels match --group/--channel.");

const alreadyDone = db.prepare("SELECT 1 FROM channel_samples WHERE month = ? AND channel_id = ?");
const insertComment = db.prepare(`
  INSERT OR REPLACE INTO comments
    (id, month, group_key, channel_id, video_id, parent_id, published_at, like_count, reply_count, text, fetched_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertSample = db.prepare(`
  INSERT OR REPLACE INTO channel_samples
    (month, channel_id, group_key, target, collected, videos_in_month, threads_available, truncated_videos, sampled_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const summary: Record<string, string | number>[] = [];

try {
  for (const ch of selected) {
    if (!args.force && !dryRun && alreadyDone.get(month, ch.channelId)) {
      console.log(`${ch.title}: already sampled for ${month}, skipping (use --force to resample).`);
      continue;
    }
    const target = channelTarget(COMMENTS_PER_GROUP_PER_MONTH, channelsFor(ch.group).length);

    const videos = await yt.listUploads(ch.uploadsPlaylistId, from, to);
    const pool: ApiThread[] = [];
    let truncatedVideos = 0;
    for (const v of videos) {
      try {
        const { threads, truncated } = await yt.listThreads(v.videoId, maxPages);
        pool.push(...threads);
        if (truncated) truncatedVideos++;
      } catch (e) {
        if (!(e instanceof CommentsDisabledError)) throw e;
      }
    }

    const picked = sampleThreads(pool, target, MAX_SHARE_PER_VIDEO, `${month}:${ch.channelId}`);

    // Replies for the echo-chamber metric: fetch the full set only where
    // YouTube's inline replies (max 5) are incomplete.
    const repliesByThread = new Map<string, ApiComment[]>();
    for (const t of picked) {
      const complete = t.replies.length >= t.totalReplyCount;
      repliesByThread.set(
        t.id,
        complete || args["no-full-replies"] ? t.replies : await yt.listReplies(t.id),
      );
    }

    const replyTotal = [...repliesByThread.values()].reduce((n, r) => n + r.length, 0);
    summary.push({
      channel: ch.title,
      group: ch.group,
      videos: videos.length,
      pool: pool.length,
      target,
      sampled: picked.length,
      short: Math.max(0, target - picked.length),
      replies: replyTotal,
    });
    console.log(
      `${ch.title}: ${videos.length} videos, ${pool.length} threads in pool, sampled ${picked.length}/${target}, ${replyTotal} replies. Units so far: ${yt.unitsUsed}`,
    );

    if (dryRun) continue;
    const fetchedAt = new Date().toISOString();
    db.exec("BEGIN");
    try {
      if (args.force) db.prepare("DELETE FROM comments WHERE month = ? AND channel_id = ?").run(month, ch.channelId);
      for (const t of picked) {
        insertComment.run(t.id, month, ch.group, ch.channelId, t.videoId, null, t.publishedAt, t.likeCount, t.totalReplyCount, t.text, fetchedAt);
        for (const r of repliesByThread.get(t.id)!) {
          insertComment.run(r.id, month, ch.group, ch.channelId, t.videoId, t.id, r.publishedAt, r.likeCount, null, r.text, fetchedAt);
        }
      }
      insertSample.run(month, ch.channelId, ch.group, target, picked.length, videos.length, pool.length, truncatedVideos, fetchedAt);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
} catch (e) {
  if (!(e instanceof QuotaExceededError)) throw e;
  console.error(`\n${e.message} Finished channels are saved; re-run the same command to resume.`);
  process.exitCode = 2;
} finally {
  if (summary.length) console.table(summary);
  console.log(`Month ${month}${dryRun ? " (dry run, nothing written)" : ""}. YouTube units used: ${yt.unitsUsed}.`);
  db.close();
}
