# Kolob Metrics

The same measure for every side of the Mormon conversation.

Kolob Metrics compares how four groups of online communities talk: ex-member, mixed, faithful Latter-day Saint, and a general religion baseline. Every metric is computed the same way for all four and shown side by side: topic mix, how often factual claims cite a source, an echo-chamber score, and logical-fallacy rates.

> **Status:** early. The dashboard currently shows **sample data**. The YouTube comment collector works; classification is next.

## Principles

- **Symmetric.** One published rubric, applied identically to every group. A number only means something next to the others.
- **Aggregate only.** No usernames or commenter IDs are stored or shown, and no individual is singled out.
- **Short retention.** Raw comment text is deleted 30 days after collection. Only aggregate results are kept.
- **Checkable.** The rubric, channel choices and code are public. A metric is published only if it passes reliability thresholds set in advance.

## Docs

- [`docs/fallacy-framework.md`](docs/fallacy-framework.md): what counts as a fallacy, the 15-type taxonomy, the labeling protocol and the validation plan.
- [`docs/channel-selection.md`](docs/channel-selection.md): which YouTube channels represent each group, why, and the fixed-quota sampling design.

## Data sources

- **YouTube Data API v3**, read-only, from the channels in `lib/channels.ts`.
- **Reddit:** r/exmormon, r/mormon, r/latterdaysaints and r/religion, pending Reddit Data API approval.

## Running locally

Requires Node 24.

```bash
npm install
npm run dev                          # dashboard at http://localhost:3000
```

To collect comments, put a YouTube Data API key in `.env.local`:

```
YOUTUBE_API_KEY=...
```

Then:

```bash
npm run collect                      # previous calendar month, all channels
npm run collect -- --month 2026-09   # a specific month
npm run collect -- --dry-run         # fetch and sample without saving
npm run purge                        # delete comment text older than 30 days
```

Collected data goes to `data/kolob.db` (SQLite, git-ignored).
