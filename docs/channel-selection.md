# YouTube channel selection

Drafted 2026-10-11. Machine-readable list: `lib/channels.ts`. Applies until Reddit API access arrives; YouTube comments are the first data source.

All numbers below were verified with the YouTube Data API v3 on 2026-10-11. Verification used about **255 quota units** (channels.list, playlistItems.list and commentThreads.list only, all 1 unit each; no search.list). No comment text was stored. The verification scripts read only thread and reply counts in memory and discarded everything else.

---

## 1. Criteria (written before choosing, applied to every group the same way)

| # | Criterion | How it was checked |
|---|---|---|
| C1 | **Comments enabled, with substantial recent activity**: at least a few hundred comments per month. | commentThreads.list on 3 recent videos per channel (aged 7 to 60 days where possible, so most comments have arrived). A `commentsDisabled` 403 counts as disabled. |
| C2 | **Active**: regular uploads in the last 90 days. | Upload dates from the first page (50 items) of the uploads playlist. |
| C3 | **Representative, not the fringe** of the group. | Channel description, host's stated position, size relative to peers. |
| C4 | **3 to 4 channels per group**, so no one creator's audience defines the group. | Count; plus equal-allocation sampling (section 6). |
| C5 | **Content mainly about the group's topic.** | Channel description and recent upload topics. |
| C6 | **Not centred on attacking private individuals.** Criticism of public figures and institutions is allowed. | Channel description and reputation. |
| C7 | **Objections recorded**: anything a skeptical reader from either side would raise. | Section 5. |

### How comment volume was estimated

`estimated comments/month = mean comments per sampled video (top-level threads + their totalReplyCount) x uploads per month`.

- **Uploads per month** = uploads in the last 90 days / 3. When all 50 items on the first playlist page were within 90 days, the rate was computed from the time span of those 50 instead.
- **Rough.** Three videos per channel is a small sample. Debate or controversy episodes create large outliers (noted where seen). Uploads include Shorts, which usually get fewer comments. Paging was capped at 6 to 8 pages (600 to 800 threads) per video, so very large videos give lower bounds (marked `>=`).
- The method uses commentThreads.list instead of videos.list `commentCount`, to stay within the three allowed endpoints. Thread + reply counts from commentThreads should approximate `commentCount`. Held-for-review and removed comments are not visible in either.

---

## 2. Chosen channels

### Group 1: Ex-member / critical (counterpart to r/exmormon)

| Channel | Handle | Channel ID | Subs | Uploads/mo | Sampled videos (comments) | Est. comments/mo | Rationale |
|---|---|---|---|---|---|---|---|
| Mormon Stories Podcast | @mormonstories | UCx6OgmoqJbOVRq-Lv1P7SzA | 314K | 28 | 135, 123, 66 | ~3,060 | Largest and longest-running ex-member interview show; the community's reference point. |
| Nemo the Mormon | @nemothemormon | UCo-6l1g27GdDb4riutS8I0w | 47.7K | 9.7 | 74, 90, 336 | ~1,610 | Critical commentary on the public statements of Church leaders; a non-US (UK) voice. |
| Mormon Discussion Inc. | @mormondiscussion | UC5n_8_6j00PSeju0hu2CFXQ | 33.1K | 40 | 37, 12, 55 | ~1,420 | Home of Mormonism LIVE / Radio Free Mormon; history and truth-claim focus. |
| Mormonism with the Murph | @mormonismwiththemurph | UC2PM7e-RaSyhAXxEXQL_fjQ | 8.3K | 8.7 | 59, 27, 19 | ~300 | Smaller ex-member creator on history, doctrine and policy; dilutes the two big shows. |

Comments were enabled on every sampled video. Group total: **~6,400/mo**.

### Group 2: Mixed / both sides in dialogue (counterpart to r/mormon)

| Channel | Handle | Channel ID | Subs | Uploads/mo | Sampled videos (comments) | Est. comments/mo | Rationale |
|---|---|---|---|---|---|---|---|
| Hello Saints | @hellosaints | UCp7-cFBse_-lN03U0QvMZyw | 84.6K | 3.7 | 279, 238, 1,360 | ~2,290 (~1,000 without the outlier) | Evangelical pastor in good-faith conversation with believing and former Latter-day Saints; comment section draws all three camps. |
| Mormon Book Reviews | @mormonbookreviews | UCNUSy8gSiEizL5U2npMVUhQ | 12.2K | 11.7 | 17, 2, 34 | ~210 | Outsider host interviewing authors from every branch of the Restoration, faithful and critical. |
| Thoughtful Faith | @thoughtfulfaith2020 | UC-3WFOCWkUFQcX_1W3NjqAQ | 81.5K | 18 | 973, 47, 561 | ~9,400 (high variance) | Debates between a Latter-day Saint host and critics, ex-members, evangelicals and atheists; both sides fill the comments. **Placement is contested**; see section 5. |

Comments were enabled on every sampled video. Group total: **~11,900/mo**, of which Thoughtful Faith is ~79%. Only three channels qualified (see rejections).

### Group 3: Faithful Latter-day Saint (counterpart to r/latterdaysaints)

| Channel | Handle | Channel ID | Subs | Uploads/mo | Sampled videos (comments) | Est. comments/mo | Rationale |
|---|---|---|---|---|---|---|---|
| Cwic Show | @cwicshow | UCFNi-bt0oFbPvWvv5UmmAVQ | 69.6K | 21 | 53, 552, 59 | ~4,700 (~1,250 without the outlier) | Largest independent faithful commentary channel, with an open and active comment section. |
| WARD RADIO | @wardradio | UCnmsAFGrFuGe0obW6tkEY6w | 66.9K | 52 | 8, 20, 31 | ~1,020 | Popular faithful talk show that answers critics directly. |
| Scripture Central | @scripturecentralofficial | UCSsrx8lFpeuBjNIE7FNm2CQ | 322K | 40 | 13, 19, 16 | ~650 | Scholarly faithful scripture and apologetics; the calm, mainstream end of the group. |

Comments were enabled on every sampled video. Group total: **~6,350/mo**, of which Cwic Show is ~74%.

**Official Church channel (@churchofjesuschrist, UCdNjexbIS_NKJC4ZRwKf9ag, 2.58M subs).** Contrary to the common assumption, comments were **enabled on all 12 recent videos checked** (Sept to Oct 2026). Volume is about 41 comments per video, ~5.7 uploads/mo, so ~230/mo. It is kept as a **reserve, not chosen**. Reasons: the brief prefers independent creators, an institutional channel is likely moderated by the institution (which would distort the echo-chamber metric), and its volume is low. Comment settings on official channels can change per video, so the collector must handle `commentsDisabled` 403s.

### Group 4: Neutral baseline, general religion (counterpart to r/religion)

| Channel | Handle | Channel ID | Subs | Uploads/mo | Sampled videos (comments) | Est. comments/mo | Rationale |
|---|---|---|---|---|---|---|---|
| ReligionForBreakfast | @religionforbreakfast | UCct9aR7HC79Cv2g-9oDOTLw | 1.27M | 5.0 | 1,909, 242, 918 | ~5,100 | Academic religious-studies channel with a large mixed-belief audience. |
| Let's Talk Religion | @letstalkreligion | UC9dRb4fbJQIbQ3KHJZF_z0g | 1.08M | 5.3 | 181, 529, 195 | ~1,600 | Comparative religion across traditions; descriptive rather than partisan. |
| Alex O'Connor | @cosmicskeptic | UC7kIy8fZavEni8Gzl8NLjOQ | 2.04M | 3.0 | >=923, >=948, >=1,072 | >=2,900 | Non-believing host in long conversations with believers; both camps comment. |
| Gospel Simplicity | @gospelsimplicity | UCfQKDYGkX3nZ7Q9cAc-4rdg | 102K | 9.0 | 71, 51, 46 | ~500 | Christian host interviewing across denominations; offsets the skeptic-leaning host above. |

Comments were enabled on every sampled video. Group total: **>=10,200/mo**.

---

## 3. Rejected candidates

| Candidate | Group | Verified | Why rejected |
|---|---|---|---|
| Cults to Consciousness (@cultstoconsciousness, 458K) | 1 | ~1,700 comments/mo | Fails C5: covers cults and high-control groups in general, not mainly Mormonism. Its huge audience would also dominate. |
| Zelph on the Shelf (@zelphontheshelf, 51K) | 1 | ~210/mo, 3 uploads/mo | Viable. Lifestyle and deconstruction focus rather than Church topics; Murph covers the "smaller creator" slot better under C5. First reserve. |
| Analyzing Mormonism (@analyzingmormonism, 6.9K) | 1 | ~220/mo | Viable but small. Reserve. |
| Ex-Mormon Files (@exmormonfiles, 4K) | 1 | not sampled | Evangelical-conversion TV programme with a small channel; a niche of the group. |
| Radio Free Mormon, Mormonism LIVE, Mormonish | 1 | handles not found | Their content appears on Mormon Discussion Inc. (chosen). |
| Gospel Tangents (@gospeltangents, 11K) | 2 | ~33/mo | Fails C1. It is the best "360-degree" fit on content, but comments are too sparse. |
| Faith Matters (@faithmattersfoundation, 25.8K) | 2 | ~20/mo | Fails C1. Progressive-faithful, with very low comment activity. |
| Latter Day Struggles Podcast (@latterdaystrugglespodcast) | 2 | ~22/mo | Fails C1. |
| Mormon Sunday School (@mormonsundayschool) | 2 | 27 videos total | Fails C2 (too few uploads). |
| Mormon Matters, Mormonism Research Ministry | 2 / 1 | empty or inactive channels | Fails C1 and C2. |
| Saints Unscripted (@saintsunscripted, 95K) | 3 | 1 upload in 90 days, ~13/mo | Fails C2. The channel has gone quiet. |
| Don't Miss This (@dontmissthis, 240K) | 3 | ~3 comments per video, ~44/mo | Fails C1 despite its size. Devotional Come Follow Me content, so comments may be limited. |
| FAIR (FAIR Latter-day Saints) | 3 | no channel found under any tried handle | Not verifiable with the cheap endpoints. Worth adding if the channel ID is supplied and it passes C1. |
| Church official channel | 3 | ~230/mo, comments enabled | Kept as a reserve (see above). |
| Capturing Christianity (@capturingchristianity, 418K) | 4 | ~670/mo, 1.7 uploads/mo | Explicitly Christian-apologetic, so it would tilt the baseline. Gospel Simplicity gives a Christian voice in a dialogue format instead. |
| Genetically Modified Skeptic (@geneticallymodifiedskeptic, 919K) | 4 | >=1,470/mo | An explicitly atheist and critical voice would tilt the baseline the other way. |
| ESOTERICA (@theesotericachannel, 1.16M) | 4 | ~1,400/mo | Comments were disabled on 1 of 3 sampled videos, and the topics (esotericism, magic) are narrower than "religion". |

---

## 4. Balance check

| Group | Channels | Est. comments/mo | Largest single channel share |
|---|---|---|---|
| 1 Ex-member | 4 | ~6,400 | Mormon Stories, ~48% |
| 2 Mixed | 3 | ~11,900 | Thoughtful Faith, ~79% |
| 3 Faithful | 3 | ~6,350 | Cwic Show, ~74% |
| 4 Baseline | 4 | >=10,200 | ReligionForBreakfast, ~50% |

Imbalances:

1. **Raw volume is uneven across groups** (about 2x between the smallest and largest group) and very uneven within groups. Any pooled statistic would mostly measure Thoughtful Faith, Cwic Show and ReligionForBreakfast. Section 6 removes this by design.
2. **The mixed group is thin.** Genuine both-sides dialogue channels with active comments are rare on YouTube. Two of the three hosts are evangelical outsiders, and the third is a believing debater. No ex-member-hosted dialogue channel passed C1.
3. **Outliers.** Single debate or controversy videos (e.g. 1,360 comments on one Hello Saints video, 552 on one Cwic video) can swamp a channel-month. This is handled with a per-video cap.
4. **The smallest channels limit the sample.** Mormon Book Reviews (~210/mo) and Mormonism with the Murph (~300/mo) can supply their equal share (150 to 200/mo) but with little headroom. In a slow month they may fall short, and the shortfall should be reported, not back-filled.

---

## 5. Objections each side might raise

**From a faithful reader**

- *Mormon Stories*: the host was excommunicated in 2015 and is the best-known public critic of the Church. A faithful reader would call it activist, not representative. Response: it is the largest ex-member channel, which is exactly what the counterpart to r/exmormon should include. Its weight is capped at 25% of the group.
- *Nemo the Mormon*: built around scrutinising named leaders. These are public figures acting in office, so it passes C6, but faithful readers may still see it as personal.
- *Mormon Discussion Inc.*: openly a deconstruction nonprofit. That fits the group, but it means the group is "advocacy channels", not a neutral sample of ex-members.
- *The mixed group's evangelical hosts* (Hello Saints, Mormon Book Reviews) are themselves outsiders with a missionary interest. A faithful reader may say "mixed" really means "Latter-day Saints vs. evangelicals".

**From an ex-member or critical reader**

- *WARD RADIO*: known for a mocking, combative style toward critics, and critics say it singles out specific ex-member creators. A critic will argue it is the fringe (C3) and borderline on C6. It is included because it is one of the most-watched independent faithful shows and is not centred on private individuals. However, it is the first candidate to drop in a sensitivity check (section 6).
- *Cwic Show*: covers politics and culture as well as religion (C5 is partly met). A large share of its comments may concern US politics, which would shift its topic mix.
- *Scripture Central*: describes itself as an "Independent Advocate Organization" of the Church. A critic may call it quasi-official.
- *Thoughtful Faith in the mixed group*: the host is a Latter-day Saint apologist, so a critic will say the mixed group leans faithful. Its debates also cover atheism and Islam, not only the Church. A faithful reader might instead object that its comment sections are full of critics. **It goes in group 2 because the format is two-sided debate and the comments are visibly two-sided**, but this is the single most contestable decision. It must be tested both ways (section 6).
- *No faithful channel hides its comments*, but faithful channels may moderate more heavily, which affects the echo-chamber score in a way the API cannot reveal (removed comments are invisible). The same applies to every group.

**From either side, about the baseline**

- ReligionForBreakfast and Let's Talk Religion are academic. Alex O'Connor is an agnostic or atheist host, balanced by the Christian Gospel Simplicity. The baseline is "educated religion-curious YouTube", not the general religious public. r/religion has a similar character, so the comparison holds, but the label should stay "baseline", not "neutral".

**General**

- YouTube comments respond to a creator's video. Reddit posts are self-directed. Topic mix will partly reflect what creators choose to cover. Report YouTube and Reddit results separately and never pool them.
- Selection is the author's judgement. The criteria and rejections are listed so others can audit and re-run them.

---

## 6. Recommendation: weighting and sampling

1. **Fixed quota per group per month: 600 comment threads** (`COMMENTS_PER_GROUP_PER_MONTH` in `lib/channels.ts`). Every group gets the same n, regardless of raw volume.
2. **Equal allocation across channels within a group**: 150 per channel in groups 1 and 4 (4 channels), 200 per channel in groups 2 and 3 (3 channels). No creator's audience can exceed 25% (or 33% for 3-channel groups) of its group. Report per-channel n every month. If a channel falls short, **do not back-fill** from its siblings; record the shortfall.
3. **Per-video cap**: no single video may supply more than 25% of a channel's monthly sample (`MAX_SHARE_PER_VIDEO`). This damps viral debate episodes.
4. **Within a video**, sample top-level threads uniformly at random from all threads on videos published in that month, not the "relevance" order (which favours popular comments). Fetch replies for the echo-chamber metric with comments.list (`parentId`) for sampled threads only.
5. **Sensitivity checks**, published alongside the headline numbers: (a) Thoughtful Faith moved from group 2 to group 3; (b) WARD RADIO dropped; (c) Mormon Stories dropped; (d) each group computed leave-one-channel-out. A finding that flips under any of these should not be reported as a group difference.
6. **Re-verify quarterly** with the same scripts (about 250 units). Channels go quiet (as Saints Unscripted did) and comment settings change.
7. **Compliance**: store comment IDs and derived labels only as long as YouTube policy allows (refresh or delete raw text within 30 days). Publish aggregates only, and never identify commenters.

Estimated collection cost at this quota: about 14 channels x roughly 15 videos per month x 1 to 3 pages, plus reply fetches, comes to roughly 500 to 1,000 units per month, well inside the daily allowance.
