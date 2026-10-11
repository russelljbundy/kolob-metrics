// YouTube channels sampled for each community group (first data source while
// Reddit API access is pending). Selection criteria, verified stats, rejected
// candidates and known objections: docs/channel-selection.md.
// Stats below were verified with the YouTube Data API on 2026-10-11 and are
// snapshots for documentation only; the collector should not rely on them.

import type { CommunityKey } from "./mock-data";

export type YouTubeChannel = {
  group: CommunityKey;
  channelId: string;
  handle: string;
  title: string;
  /** "UU" + channelId without its "UC" prefix; list with playlistItems.list (1 unit). */
  uploadsPlaylistId: string;
  rationale: string;
  /** Verified 2026-10-11: rough estimate (comments incl. replies) from 3 recent videos x upload rate. */
  estCommentsPerMonth: number;
};

/** Equal-allocation sampling target per group per month (see docs/channel-selection.md section 6). */
export const COMMENTS_PER_GROUP_PER_MONTH = 600;

/** No single video may supply more than this share of a channel's monthly sample. */
export const MAX_SHARE_PER_VIDEO = 0.25;

export const CHANNELS = [
  // Ex-member / critical (counterpart to r/exmormon)
  {
    group: "exmormon",
    channelId: "UCx6OgmoqJbOVRq-Lv1P7SzA",
    handle: "@mormonstories",
    title: "Mormon Stories Podcast",
    uploadsPlaylistId: "UUx6OgmoqJbOVRq-Lv1P7SzA",
    rationale: "Longest-running and largest ex-member interview show; the community's reference point.",
    estCommentsPerMonth: 3060,
  },
  {
    group: "exmormon",
    channelId: "UCo-6l1g27GdDb4riutS8I0w",
    handle: "@nemothemormon",
    title: "Nemo the Mormon",
    uploadsPlaylistId: "UUo-6l1g27GdDb4riutS8I0w",
    rationale: "Critical commentary on public statements of Church leaders; adds a non-US (UK) voice.",
    estCommentsPerMonth: 1610,
  },
  {
    group: "exmormon",
    channelId: "UC5n_8_6j00PSeju0hu2CFXQ",
    handle: "@mormondiscussion",
    title: "Mormon Discussion Inc.",
    uploadsPlaylistId: "UU5n_8_6j00PSeju0hu2CFXQ",
    rationale: "Home of Mormonism LIVE and Radio Free Mormon; history- and truth-claim focused deconstruction.",
    estCommentsPerMonth: 1420,
  },
  {
    group: "exmormon",
    channelId: "UC2PM7e-RaSyhAXxEXQL_fjQ",
    handle: "@mormonismwiththemurph",
    title: "Mormonism with the Murph",
    uploadsPlaylistId: "UU2PM7e-RaSyhAXxEXQL_fjQ",
    rationale: "Smaller ex-member creator on history, doctrine and policy; dilutes the two big shows.",
    estCommentsPerMonth: 300,
  },

  // Mixed / both sides in dialogue (counterpart to r/mormon)
  {
    group: "mormon",
    channelId: "UCp7-cFBse_-lN03U0QvMZyw",
    handle: "@hellosaints",
    title: "Hello Saints",
    uploadsPlaylistId: "UUp7-cFBse_-lN03U0QvMZyw",
    rationale: "Evangelical pastor in good-faith conversation with believing and former Latter-day Saints.",
    estCommentsPerMonth: 2290,
  },
  {
    group: "mormon",
    channelId: "UCNUSy8gSiEizL5U2npMVUhQ",
    handle: "@mormonbookreviews",
    title: "Mormon Book Reviews",
    uploadsPlaylistId: "UUNUSy8gSiEizL5U2npMVUhQ",
    rationale: "Outsider host interviewing authors from every branch of the Restoration, faithful and critical.",
    estCommentsPerMonth: 210,
  },
  {
    group: "mormon",
    channelId: "UC-3WFOCWkUFQcX_1W3NjqAQ",
    handle: "@thoughtfulfaith2020",
    title: "Thoughtful Faith",
    uploadsPlaylistId: "UU-3WFOCWkUFQcX_1W3NjqAQ",
    rationale: "Debate format pitting a Latter-day Saint host against critics; contested placement (see doc).",
    estCommentsPerMonth: 9430,
  },

  // Faithful Latter-day Saint (counterpart to r/latterdaysaints)
  {
    group: "latterdaysaints",
    channelId: "UCFNi-bt0oFbPvWvv5UmmAVQ",
    handle: "@cwicshow",
    title: "Cwic Show",
    uploadsPlaylistId: "UUFNi-bt0oFbPvWvv5UmmAVQ",
    rationale: "Largest independent faithful commentary channel with an active, open comment section.",
    estCommentsPerMonth: 4680,
  },
  {
    group: "latterdaysaints",
    channelId: "UCnmsAFGrFuGe0obW6tkEY6w",
    handle: "@wardradio",
    title: "WARD RADIO",
    uploadsPlaylistId: "UUnmsAFGrFuGe0obW6tkEY6w",
    rationale: "Popular faithful talk show that answers critics directly; the combative end of faithful YouTube.",
    estCommentsPerMonth: 1020,
  },
  {
    group: "latterdaysaints",
    channelId: "UCSsrx8lFpeuBjNIE7FNm2CQ",
    handle: "@scripturecentralofficial",
    title: "Scripture Central",
    uploadsPlaylistId: "UUSsrx8lFpeuBjNIE7FNm2CQ",
    rationale: "Scholarly faithful scripture and apologetics content; the calm, mainstream end of the group.",
    estCommentsPerMonth: 650,
  },

  // Neutral baseline: general religion (counterpart to r/religion)
  {
    group: "religion",
    channelId: "UCct9aR7HC79Cv2g-9oDOTLw",
    handle: "@religionforbreakfast",
    title: "ReligionForBreakfast",
    uploadsPlaylistId: "UUct9aR7HC79Cv2g-9oDOTLw",
    rationale: "Academic religious-studies channel with a large mixed-belief audience.",
    estCommentsPerMonth: 5120,
  },
  {
    group: "religion",
    channelId: "UC9dRb4fbJQIbQ3KHJZF_z0g",
    handle: "@letstalkreligion",
    title: "Let's Talk Religion",
    uploadsPlaylistId: "UU9dRb4fbJQIbQ3KHJZF_z0g",
    rationale: "Comparative religion across traditions, descriptive rather than partisan.",
    estCommentsPerMonth: 1610,
  },
  {
    group: "religion",
    channelId: "UC7kIy8fZavEni8Gzl8NLjOQ",
    handle: "@cosmicskeptic",
    title: "Alex O'Connor",
    uploadsPlaylistId: "UU7kIy8fZavEni8Gzl8NLjOQ",
    rationale: "Non-believing host in long conversations with believers; believers and skeptics both comment.",
    estCommentsPerMonth: 2940,
  },
  {
    group: "religion",
    channelId: "UCfQKDYGkX3nZ7Q9cAc-4rdg",
    handle: "@gospelsimplicity",
    title: "Gospel Simplicity",
    uploadsPlaylistId: "UUfQKDYGkX3nZ7Q9cAc-4rdg",
    rationale: "Christian host interviewing across denominations; offsets the skeptic-leaning host above.",
    estCommentsPerMonth: 500,
  },
] satisfies YouTubeChannel[];

export const channelsFor = (group: CommunityKey) => CHANNELS.filter((c) => c.group === group);
