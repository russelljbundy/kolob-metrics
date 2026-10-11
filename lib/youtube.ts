// Minimal YouTube Data API v3 client for the collector. Uses only 1-unit
// endpoints (playlistItems.list, commentThreads.list, comments.list); never
// search.list (100 units). Requires YOUTUBE_API_KEY.

const BASE = "https://www.googleapis.com/youtube/v3";

export class QuotaExceededError extends Error {}
export class CommentsDisabledError extends Error {}

export type ApiComment = {
  id: string;
  parentId: string | null;
  publishedAt: string;
  likeCount: number;
  text: string;
};

export type ApiThread = ApiComment & {
  videoId: string;
  totalReplyCount: number;
  /** Up to 5 replies YouTube includes with the thread; may be incomplete. */
  replies: ApiComment[];
};

type RawComment = {
  id: string;
  snippet: {
    parentId?: string;
    publishedAt: string;
    likeCount: number;
    textOriginal: string;
  };
};

const toComment = (c: RawComment): ApiComment => ({
  id: c.id,
  parentId: c.snippet.parentId ?? null,
  publishedAt: c.snippet.publishedAt,
  likeCount: c.snippet.likeCount,
  text: c.snippet.textOriginal,
});

export class YouTubeClient {
  /** Quota units spent by this client (every call here costs 1 unit). */
  unitsUsed = 0;

  constructor(
    private readonly apiKey: string,
    private readonly maxUnits: number,
  ) {}

  private async get<T>(resource: string, params: Record<string, string>): Promise<T> {
    if (this.unitsUsed >= this.maxUnits) {
      throw new QuotaExceededError(`Stopped at the --max-units budget (${this.maxUnits}).`);
    }
    const url = new URL(`${BASE}/${resource}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set("key", this.apiKey);

    this.unitsUsed++;
    const res = await fetch(url);
    if (res.ok) return (await res.json()) as T;

    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string; errors?: { reason?: string }[] };
    };
    const reason = body.error?.errors?.[0]?.reason ?? "";
    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
      throw new QuotaExceededError("YouTube daily quota exhausted; resume tomorrow.");
    }
    if (reason === "commentsDisabled") throw new CommentsDisabledError(reason);
    // The key is in the URL, so never include the URL in errors.
    throw new Error(`YouTube ${resource} failed (${res.status} ${reason}): ${body.error?.message ?? ""}`);
  }

  /** Videos in an uploads playlist published in [from, to), newest first. */
  async listUploads(playlistId: string, from: Date, to: Date) {
    const videos: { videoId: string; publishedAt: string }[] = [];
    let pageToken = "";
    for (;;) {
      const page = await this.get<{
        items: { contentDetails: { videoId: string; videoPublishedAt?: string } }[];
        nextPageToken?: string;
      }>("playlistItems", {
        part: "contentDetails",
        playlistId,
        maxResults: "50",
        ...(pageToken && { pageToken }),
      });
      let reachedOlder = false;
      for (const { contentDetails: d } of page.items) {
        if (!d.videoPublishedAt) continue; // private or deleted
        const t = new Date(d.videoPublishedAt);
        if (t >= to) continue;
        if (t < from) {
          reachedOlder = true;
          continue;
        }
        videos.push({ videoId: d.videoId, publishedAt: d.videoPublishedAt });
      }
      // Uploads playlists are newest-first; stop once a page reaches older videos.
      if (reachedOlder || !page.nextPageToken) return videos;
      pageToken = page.nextPageToken;
    }
  }

  /** All top-level threads on a video, up to maxPages x 100. */
  async listThreads(videoId: string, maxPages: number) {
    const threads: ApiThread[] = [];
    let pageToken = "";
    for (let i = 0; i < maxPages; i++) {
      const page = await this.get<{
        items: {
          snippet: { videoId: string; totalReplyCount: number; topLevelComment: RawComment };
          replies?: { comments: RawComment[] };
        }[];
        nextPageToken?: string;
      }>("commentThreads", {
        part: "snippet,replies",
        videoId,
        order: "time",
        textFormat: "plainText",
        maxResults: "100",
        ...(pageToken && { pageToken }),
      });
      for (const it of page.items) {
        threads.push({
          ...toComment(it.snippet.topLevelComment),
          videoId: it.snippet.videoId,
          totalReplyCount: it.snippet.totalReplyCount,
          replies: (it.replies?.comments ?? []).map(toComment),
        });
      }
      if (!page.nextPageToken) return { threads, truncated: false };
      pageToken = page.nextPageToken;
    }
    return { threads, truncated: true };
  }

  /** Replies to one thread (first 100). */
  async listReplies(parentId: string) {
    const page = await this.get<{ items: RawComment[] }>("comments", {
      part: "snippet",
      parentId,
      textFormat: "plainText",
      maxResults: "100",
    });
    return page.items.map(toComment);
  }
}
