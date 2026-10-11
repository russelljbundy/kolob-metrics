// Fixed-quota sampling (docs/channel-selection.md section 6): every group gets
// the same number of threads per month, split equally across its channels;
// threads are drawn uniformly at random from the channel's pool, and no video
// may supply more than MAX_SHARE_PER_VIDEO of a channel's sample. No
// back-filling: a channel that falls short is recorded as short.

/** Seeded PRNG (mulberry32) so a month's sample is reproducible. */
export function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function channelTarget(perGroup: number, channelsInGroup: number) {
  return Math.floor(perGroup / channelsInGroup);
}

export function sampleThreads<T extends { videoId: string }>(
  pool: T[],
  target: number,
  maxSharePerVideo: number,
  seed: string,
): T[] {
  const perVideoCap = Math.max(1, Math.floor(target * maxSharePerVideo));
  const rand = seededRandom(seed);

  // Fisher-Yates shuffle of a copy, then take in order subject to the cap.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const perVideo = new Map<string, number>();
  const picked: T[] = [];
  for (const t of shuffled) {
    if (picked.length >= target) break;
    const n = perVideo.get(t.videoId) ?? 0;
    if (n >= perVideoCap) continue;
    perVideo.set(t.videoId, n + 1);
    picked.push(t);
  }
  return picked;
}
