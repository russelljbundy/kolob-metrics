# Fallacy classification framework

Rubric version **1.0.0**, drafted October 2026. The taxonomy in section 3 is generated from `lib/fallacy-taxonomy.ts`, the single source of truth that both the site and the classifier prompt read. If the two ever disagree, the TypeScript file wins. Regenerate this section after any change and bump `RUBRIC_VERSION`.

---

## 1. What counts as a fallacy here (plain language)

A **fallacy** is a flaw in reasoning: someone offers a reason for a claim, and the reason does not actually support the claim, yet it can still be persuasive. We label **reasoning moves in a piece of text**. We do not label people, communities or beliefs.

A fallacy label does **not** mean:

- the conclusion is false (bad arguments can have true conclusions);
- the writer is dishonest or unintelligent;
- the community is irrational. A rate is a property of sampled text, under one rubric, with known error.

Things that are **not arguments**, and so can never get a fallacy label:

| Not an argument | Example |
|---|---|
| Venting | "I'm so angry I wasted 20 years paying tithing." |
| Personal stories | "My mission was the hardest two years of my life." |
| Jokes, memes, satire | A meme about green Jell-O. |
| Sincere belief or disbelief | "I know the Book of Mormon is true." / "I just don't believe any of it anymore." |
| Questions | "How do I tell my parents I'm not going to church?" |
| Quoting or reporting others | "My bishop said X." (unless the writer endorses X and argues from it) |
| Announcements, links without commentary | "Conference starts Saturday." |

Rudeness is not a fallacy either. An insult with no claim attached is incivility, which could be measured separately and is not part of this rubric. Strong or loaded words alone (cult, apostate, anti-Mormon, TBM, Mopologist) are not fallacies either. They count only when they are used to dismiss claims without examining them (see poisoning the well).

The rubric never requires the labeler (human or model) to decide whether Latter-day Saint truth claims are true. Every condition is written so that a believer, an ex-member and an outsider should reach the same answer.

### Testimony and spiritual experience

Shared as a personal report ("I felt the Spirit confirm it", or "I felt overwhelming relief when I left"), spiritual experience is an **expression of belief**. It is not an argument. Even when it is offered to others as a reason ("pray about it and you'll know"), it is an appeal to experience whose evidential weight is a philosophical dispute, not a reasoning error, so it is **not labeled by itself**. It becomes labelable only when it meets the conditions of a listed fallacy. Examples: **special pleading** (my feelings count as evidence but yours don't) or **circular reasoning** (the feeling is valid because the book says so, and the book is true because of the feeling). This applies the same way to faithful and ex-member experiences.

---

## 2. Background

### 2.1 Formal vs. informal fallacies

- **Formal fallacies** are errors in logical form that make an argument invalid whatever its content, for example affirming the consequent ("If P then Q; Q; so P"). They are rare as such in social-media text and are usually better described as one of the informal fallacies below.
- **Informal fallacies** are errors that depend on content and context: relevance (ad hominem), evidence (hasty generalization), presumption (false dilemma, circular reasoning), or language (equivocation). Almost everything worth measuring on Reddit is informal, and informal fallacies are exactly the ones whose fallaciousness depends on context.

### 2.2 Scholarly traditions

- **Classical lists.** Aristotle's *Sophistical Refutations* lists 13 fallacies, 6 that depend on language and 7 that do not, including begging the question and false cause. Later Latin "ad" names (ad hominem, ad populum, ad verecundiam) were added, notably by Locke. Together these formed the **"standard treatment"** of mid-20th-century textbooks: a list of names, a one-line definition and a contrived example.
- **Hamblin's critique (1970).** C. L. Hamblin's *Fallacies* called the standard treatment "debased, worn-out and dogmatic." Its definitions ("an argument that seems valid but is not") did not fit many of its own examples, and many listed "fallacies" are often perfectly reasonable. He argued that fallacies have to be studied in the **dialogues** where they occur, against rules for reasonable dialogue. That move started modern argumentation theory.
- **Pragma-dialectics (van Eemeren & Grootendorst).** Argumentation is modeled as a *critical discussion* aimed at resolving a difference of opinion. It moves through four stages: confrontation, opening, argumentation and concluding. It is governed by **ten rules**. A fallacy is any move that breaks one of them. The rules and the fallacies they map to here are:

  | # | Rule (paraphrased) | Fallacies in this rubric |
  |---|---|---|
  | 1 | Freedom: don't prevent the other side from putting forward or questioning a view | ad hominem, poisoning the well, tu quoque |
  | 2 | Burden of proof: whoever puts forward a view must defend it if asked | (evasion; not labeled separately) |
  | 3 | Standpoint: attack the view actually held | strawman |
  | 4 | Relevance: defend a view only with argument relevant to it | genetic fallacy, appeal to consequences |
  | 5 | Unexpressed premise: don't misrepresent the other side's implicit premises | strawman |
  | 6 | Starting point: don't falsely claim, or deny, an agreed starting point | circular reasoning, false dilemma |
  | 7 | Argument scheme: use appropriate schemes, correctly applied | faulty appeal to authority, appeal to popularity, hasty generalization, cherry-picking, special pleading |
  | 8 | Validity: explicit reasoning must be valid | (formal fallacies) |
  | 9 | Closure: a failed defense means retracting the view; a successful one means dropping the doubt | moving the goalposts, no true Scotsman |
  | 10 | Usage: no unclear or ambiguous wording | (equivocation; not included) |

- **Walton's argumentation schemes and critical questions.** Douglas Walton (with Reed and Macagno) catalogued dozens of everyday **argumentation schemes**: argument from expert opinion, from position to know, from consequences, from popular opinion, ad hominem, slippery slope and more. Each comes with **critical questions**. A scheme gives a *presumptive* reason that stands until a critical question is raised and not answered. On this view, most "fallacies" are **legitimate schemes used badly**: pushed through while their critical questions are blocked, or used in the wrong type of dialogue. For example, the expert-opinion scheme asks: Is the source a real expert? In the relevant field? What exactly did they say? Are they trustworthy? Do other experts agree? Is the claim based on evidence?

### 2.3 Why most "fallacies" are fallacious only in context

The same surface pattern is often fine:

- **Appeal to authority** is how most of us rationally accept science and history. It is fallacious only when the authority is outside their field, vague, contradicted by peers, or used to stop inquiry. In this domain there is a twist: on the question "what does the church officially teach?", church leaders *are* the relevant authority.
- **Ad hominem.** When a claim rests on someone's testimony or say-so, their reliability and conflicts of interest are relevant evidence. Walton calls this the circumstantial ad hominem used properly.
- **Slippery slope** is a legitimate causal argument when each step has evidence behind it.
- **Genetic reasoning** about where a document or ritual came from is ordinary **source criticism** in historical work. It is fallacious only when origin is used to settle a question that origin cannot settle.
- **Tu quoque** comparisons are legitimate base-rate evidence when someone claims a group is uniquely bad.

The field handles this by being **dialectical and contextual**: decide whether a move blocks the critical questions that would expose its weakness. This framework puts that into practice with (a) **necessary conditions** that must all be confirmed before a label is applied, and (b) **critical questions** that separate the fallacious use from the legitimate one. The best-agreement annotation scheme in recent literature (CAMPFIRE, 2025) took exactly this approach with "litmus tests", reaching Cohen's κ of .69–.86 where earlier free-form schemes got roughly 0.4–0.6.

### 2.4 Prior work on automatic fallacy detection, and how good it really is

| Work | Data | Labels | Human agreement | Best automatic result |
|---|---|---|---|---|
| Jin et al. 2022, *Logical Fallacy Detection* (Findings of EMNLP) | LOGIC: 2,449 textbook/quiz examples; LogicClimate: 1,079 climate-news sentences | 13 types | Not reported as a statistic (two annotators, merged and adjudicated) | F1 58.8 on LOGIC, but only **27–29** on real-world LogicClimate |
| Goffredo et al. 2022 (IJCAI); 2023 (EMNLP) | ElecDeb60To16: US presidential debates, 1,628 fallacious arguments | 6 categories, 14 subcategories | Krippendorff's α **0.46–0.60** per category ("moderate") | Macro F1 0.84 on 6 categories *with* gold argument structure; 0.61 without; 0.42 on 14 subcategories |
| Sahai et al. 2021 (ACL) | Reddit comments, noisy labels cleaned by crowdworkers | 8 common fallacies | Re-audited by Yeh et al. 2024: expert-expert Cohen's κ **0.38** | Context (the parent comment) improves classification |
| Habernal et al. 2018 (NAACL) | ChangeMyView ad hominem | Ad hominem only | κ ≈ 0.79 (as cited by Goffredo et al.); a single, well-defined type agrees far better | — |
| Sourati et al. 2023 (Knowledge-Based Systems) | LOGIC and others | Detection, then coarse, then fine classification | — | Case-based and prototype reasoning helps robustness and explainability; fine-grained classification stays hard |
| **MAFALDA**, Helwe et al. 2024 (NAACL) | 9,745 texts unified from earlier datasets; **200 gold texts** annotated with explanations | 3 levels: fallacy yes/no → Pathos/Ethos/Logos → **23 types** | Uses a **disjunctive** scheme: a span may carry several acceptable labels (28% do), and "no fallacy" can be one alternative, which turns subjectivity into accepted alternatives rather than noise | Zero-shot, span-level F1: binary **0.63** (GPT-3.5) vs. humans **0.75**; 3-way 0.20 vs. 0.35; 23-type **0.14** vs. humans **0.19** |
| Yeh et al. 2024, CoCoLoFa (EMNLP) | 7,706 news comments written by LLM-assisted crowdworkers | 8 types | Expert-expert κ **0.47** | Fine-tuned BERT F1 0.86 (detection) on its own test set; GPT-4o 0.71–0.81 on Reddit, in an easier closed setting |
| Pan et al. 2024 (EMNLP) | Several benchmarks | — | — | Zero-shot LLMs competitive with fine-tuned models, and better out of distribution; multi-round prompting helps smaller models |
| Ruiz-Dolz & Lawrence 2023 (ArgMining) | Argumentation schemes "in the wild" | — | — | Models trained on benchmarks degrade badly outside their domain |
| Bytyqi & Hautli-Janisz 2025 (ArgMining) | Pragma-dialectical fallacy set and extended LOGIC | — | — | GPT-3.5/4/4o struggle; adding theory to the prompt did not help; smaller fine-tuned models often do better |
| Blodgett et al. 2025, **CAMPFIRE** (LAW) | 12 documents, multiple genres | 25 types, each defined by litmus tests | Cohen's κ **.69–.86** | Large LLM baseline F1 **.08** (fallacious spans only) vs. humans .59–.73; walking the model through the tests improved it |
| SmartyPat-Bench 2025 | 502 Reddit posts (r/ShittyAskScience) | 14 types | Two annotators, adjudicated | LLMs show **high false-positive rates** and near-zero false negatives: they over-detect fallacies |

**What this means for us:**

1. Humans themselves agree only moderately on *which* fallacy is present: α/κ of about 0.4–0.6 is typical on naturally occurring text. The exceptions are single, tightly defined types, and schemes built on explicit tests.
2. "Is there a fallacy here at all?" is easier than "which one?". Most expert disagreement is about *presence* (Yeh et al. 2024).
3. LLMs **over-flag**. Without strict gating, a model will find "fallacies" in ordinary disagreement, and the measured rate will depend more on how much a community argues than on how well it argues.
4. Real-world performance is far below benchmark performance (LOGIC 59 → LogicClimate 27–29 F1).

### 2.5 How the 15 types were chosen

Selection criteria: (a) the move plausibly occurs often in faith/ex-faith discussion **on all sides**; (b) it can be defined by conditions that can be checked in the text; (c) it has published reliability evidence, or closely resembles a type that does; (d) it has a clear legitimate twin, so critical questions can separate the two.

Deliberately **excluded** in v1:

- **Appeal to emotion.** It has the lowest agreement in Goffredo et al. (α 0.46), and in a recovery/support community like r/exmormon, emotional language is mostly venting, not argument. Including it would mechanically inflate the rate for the community that shares the most pain. That is a fairness problem, not a finding.
- **Loaded language.** It is a rhetorical feature, not a reasoning error. If wanted, it can be tracked as a separate, symmetric **lexicon metric** with a published term list covering every side ("anti-Mormon", "apostate", "TBM", "cult", "Mopologist", "brainwashed", "bitter"). It should never be labeled as a fallacy.
- **Slippery slope, equivocation, red herring.** These are rarer in this domain, or too vague to annotate reliably (red herring). Slippery slope can be added in a later version if pilot data show it is frequent.

### 2.6 Religion-specific patterns, handled symmetrically

| Pattern | Faithful-side form | Critical-side form | Rule |
|---|---|---|---|
| Source criticism vs. genetic fallacy | "Biblical criticism came from secular scholars, so it's wrong." | "Eternal families were invented in the 1800s, so they're meaningless." | Origin is relevant when the claim *is about* origin, or when origin affects how reliable the evidence is. Otherwise it is a genetic fallacy. |
| Who counts as a real member | "Real testimonies don't fail." | "Real exmos never defend the church." | No true Scotsman only when the criterion is invented after the fact to exclude a counterexample. Official categories (member of record, active) are fine. |
| Spiritual experience | "Pray and you'll know." | "The relief I felt proves leaving was right." | A non-argument, or an appeal to experience: not labeled. It is labeled only as special pleading or circular reasoning when those conditions are met. |
| Ad hominem against leaders vs. critics | "He left to sin, ignore him." | "That apostle is rich, ignore him." | Attacking motives *instead of* the claim → label. Criticizing conduct, or a conflict of interest when the claim rests on authority → don't. |
| Tu quoque | "Exmos are hateful too." | "Your church did worse." | Deflection → label. A base rate against a "uniquely bad" claim, or a hypocrisy question → don't. |
| Poisoning the well | "anti-Mormon literature", "apostate sources" | "Mopologists", "lying for the Lord", "TBM logic" | Label only when the term is used to dismiss everything from a source without examination. Neutral or self-descriptive use is fine. |
| Cherry-picking history | Quoting only faith-affirming witness statements | Quoting old teachings while ignoring official disavowals | The labeler must name the omitted evidence and where it is. Never label on a hunch. |
| Appeal to consequences | "If it's not true my family falls apart." | "If it's true, I refuse to live in that universe." | Labeled only for factual claims. Decisions and policy arguments may appeal to consequences. |
| Special pleading | "Evidence rules don't apply to our visions." | "Your feelings are manipulation, mine are real." | Same standard for both, or label. |
| Moving the goalposts | Changing "any church source" to "only an apostle in Conference" | Changing "one find" to "a whole city" | Needs visible thread context. Never label from a single comment. |
| Authority | "An apostle said the DNA question is settled." | "A famous scientist said it's dumb." | Leaders are authoritative on *what the church teaches*; specialists are authoritative on their own field; nobody is authoritative outside it. |

---

## 3. Taxonomy

Each entry gives the definition, the **necessary conditions** (the labeler must confirm every one), the **critical questions**, one fallacious and one non-fallacious example from each side, and common false-positive traps. All examples are invented paraphrases written for this rubric, not real user posts. Some mention real historical topics as debated by each side. The examples illustrate reasoning structure and take no position on those debates.

**Tie-breakers when two labels seem to fit** (one label per span, never stacked):

- Dismissing a whole source or group in advance → *poisoning the well*; attacking the person who made a specific argument → *ad hominem*.
- Deflecting by pointing at the critic's own faults → *tu quoque*, not ad hominem.
- Redefining group membership to dodge a counterexample → *no true Scotsman*, not hasty generalization.
- Exempting one's own side from a standard → *special pleading*; if the exemption appears only after evidence was supplied in the thread → *moving the goalposts*.
- Leaving out known contrary evidence → *cherry-picking*; generalizing from too few cases → *hasty generalization*.
- Rejecting a claim because of where it came from → *genetic fallacy*; because of who is saying it now → *ad hominem*.

### 3.1 Ad hominem `ad_hominem`

**Definition.** Rejecting or dismissing a claim by attacking the character, motives, intelligence or circumstances of the person who made it, instead of the claim itself.

Expected reliability: **higher** · Needs thread context: **no** · Closest MAFALDA label: Abusive Ad Hominem

**Necessary conditions (all must be confirmed):**

1. A specific claim or argument made by an identifiable person or group is in view.
2. The text attacks that person's character, motives, intelligence, morals or circumstances.
3. The attack is offered as a reason to reject or ignore the claim (explicitly or by unmistakable implication).
4. The attacked trait is not relevant to the claim's truth: the claim does not rest on that person's own testimony, expertise or trustworthiness.

**Critical questions:**

- Is the attack used to reject the claim, or is it an insult sitting next to an argument that stands on its own?
- Does the claim depend on the person's credibility (eyewitness testimony, unsupported say-so, a financial or institutional conflict of interest)? If so, questioning credibility is legitimate.
- Does the text still engage the substance of the claim?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Of course he thinks the Book of Abraham is a problem. He left because he wanted to drink and party; nothing he says about the papyri is worth reading. | The person's supposed motive for leaving is used to dismiss his argument about the papyri, which can be checked on its own. |
| Faithful | No | The only source for this story is the blogger's own memory of a private meeting, and he has admitted making up details in an earlier post. I'd want independent confirmation before believing it. | The claim rests entirely on this person's testimony, so his track record is relevant evidence. |
| Critical | **Fallacy** | You can ignore that conference talk about tithing blessing families. The speaker is a wealthy retired executive who has never struggled a day in his life. | The speaker's wealth is used to dismiss his claim without addressing it. |
| Critical | No | The paper says church finances are nobody's business, but the author works for an institute the church funds. That doesn't make him wrong, but we shouldn't take his word for it. Let's look at his actual evidence. | Notes a conflict of interest only to deny the paper's authority, then turns to the evidence. |

**False-positive traps:**

- Pure insults or rudeness that do not dismiss any claim are incivility, not this fallacy.
- Criticizing a leader's decisions or conduct ('he approved this policy') is a claim about actions, not an attack on a person in place of an argument.
- Pointing out a documented conflict of interest when the claim rests on that person's authority is legitimate source criticism.
- Questioning the reliability of a witness whose testimony is the evidence is legitimate.

### 3.2 Poisoning the well `poisoning_the_well`

**Definition.** Discrediting a source, person or group in advance, so that anything they say will be dismissed without being examined.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: Guilt by Association

**Necessary conditions (all must be confirmed):**

1. A source, person or group is identified (a book, website, organization, community or type of person).
2. The text gives it a negative framing (a label, an alleged motive, a category).
3. The framing is offered as a reason to disregard everything, or a whole class of claims, from that source without examining any specific claim.
4. No specific, stated reliability problem relevant to the claims at issue is given.

**Critical questions:**

- Does the text tell readers not to engage at all, or does it name a specific error or reliability problem?
- Is the label a neutral or self-chosen description, or is it used to dismiss?
- Would the same dismissal apply if the source said something the author agreed with?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Before you read that letter, remember it's anti-Mormon literature written to destroy testimonies. Nothing in it is worth your time. | Labels the whole document as hostile and tells readers to ignore every claim in it without checking any of them. |
| Faithful | No | Be careful with that pamphlet. Its quote from the 1832 account leaves out a sentence that changes the meaning. Compare it with the Joseph Smith Papers transcription before relying on it. | Names a specific, checkable error and points to the primary source. |
| Critical | **Fallacy** | Don't bother with anything from apologetics sites. They're paid to lie for the Lord. | Every claim from a whole category of sources is dismissed because of a supposed motive. |
| Critical | No | That essay has no named author and no peer review, and two of its footnotes cite sources that don't say what it claims. I'd check every citation before trusting it. | Gives specific reasons to be cautious and still engages with the content. |

**False-positive traps:**

- In-group vocabulary used descriptively or about oneself ('as a TBM I used to...', 'I'm PIMO', 'I'm an apologist') is not dismissal.
- Warning about a specific documented error in a source is legitimate source criticism.
- Saying who published something ('this is a church publication', 'this is an exmo podcast') without telling readers to disregard it.
- Recommending one source over another for a stated reason.

### 3.3 Strawman `strawman`

**Definition.** Misrepresenting an opponent's position (exaggerating it, oversimplifying it, or attributing a view they do not hold) and then attacking the misrepresentation as if it were their real view.

Expected reliability: **medium** · Needs thread context: **yes** · Closest MAFALDA label: Strawman Fallacy

**Necessary conditions (all must be confirmed):**

1. The text attributes a position to an identifiable opponent (a person, a group, or 'they').
2. The attributed position is a distortion, as shown by the thread or by the group's openly stated positions, not by the labeler's own opinion of what the group 'really' thinks.
3. The text argues against the distorted version.
4. Defeating the distorted version is presented as defeating the opponent's actual view.

**Critical questions:**

- Can the distortion be shown from the available context (the parent comment, or a widely documented position)?
- Is the author describing a real minority view and saying it is a minority view?
- Would a fair-minded member of the targeted group recognize the attributed view as theirs?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Critics basically say that unless every prophet was perfect, the church is false. Nobody ever claimed prophets were perfect, so their whole case falls apart. | Recasts specific historical objections as a demand for perfection, then knocks down that demand. |
| Faithful | No | You said the church hid the seer stone. It was described in an official magazine article in the 1970s, so 'hid' overstates it, though I'll grant most members had never heard of it. | Responds to what the other person actually said and concedes part of the point. |
| Critical | **Fallacy** | Members think God wants their money sitting in a hedge fund instead of feeding the poor. That's obviously absurd. | Assigns members a view almost none of them hold, then mocks it. |
| Critical | No | In the talk you linked, the speaker tells members to be cautious about online sources that criticize the church. I think even that milder advice discourages honest inquiry, because... | States the speaker's actual, milder position before criticizing it. |

**False-positive traps:**

- An accurate paraphrase of a blunt or unflattering view is not a strawman.
- Criticizing a real minority view that the author openly labels as such.
- The labeler disagreeing with how a group is described is not enough; the distortion must be shown.
- Without the parent comment, a reply's 'so you're saying...' usually cannot be judged. Do not label, or label with low confidence.

### 3.4 Genetic fallacy `genetic_fallacy`

**Definition.** Judging a claim, belief or practice to be true, false, good or bad only by where it came from, when its origin does not settle the question.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. A claim, belief, practice or idea is being evaluated.
2. The text points to its origin (who started it, where it came from, how it arose).
3. The origin is treated as settling the question by itself.
4. The question is not itself about origins, and the origin says nothing about how reliable the evidence is.

**Critical questions:**

- Is the disputed claim itself about origins (e.g., 'this ceremony is ancient')? If so, evidence about its origin bears directly on it.
- Does the origin bear on how reliable the evidence is (source criticism: an unsourced quote, a forged document, a late account)?
- Is the origin offered as one consideration among others, or as the decisive one?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Biblical criticism was developed by secular German scholars who were hostile to faith, so whatever it says about the Old Testament is false. | Rejects the conclusions because of who first proposed them, without examining the arguments. |
| Faithful | No | That 'Brigham Young quote' has no source. It first shows up in a pamphlet from the 1990s with no citation. Until someone finds a primary source, we shouldn't attribute it to him. | Where the quote came from is directly relevant to whether he said it. |
| Critical | **Fallacy** | The idea of eternal families only exists because a 19th-century religion made it up, so it's meaningless. | Uses the idea's origin to settle whether it has value or meaning, which origin alone does not decide. |
| Critical | No | The church teaches the endowment restores an ancient ceremony. But its signs and wording closely match a Masonic ritual Joseph Smith had joined weeks earlier, which points to a 19th-century source rather than an ancient one. | The disputed claim is about origin, so evidence about origin is the right kind of evidence. |

**False-positive traps:**

- Source criticism (who wrote this, when, with what access to events) is legitimate historical method, not this fallacy.
- Origin evidence against a claim of ancient or divine origin is relevant. Example: 19th-century parallels used to dispute an 'ancient' claim.
- Explaining why someone holds a belief, without saying the explanation makes the belief false.

### 3.5 Tu quoque / whataboutism `tu_quoque`

**Definition.** Deflecting a criticism by pointing out that the critic, or their side, is guilty of something similar, as if that made the criticism false or irrelevant.

Expected reliability: **higher** · Needs thread context: **yes** · Closest MAFALDA label: Tu Quoque

**Necessary conditions (all must be confirmed):**

1. A criticism or charge has been made (in the text or the visible thread).
2. The response points to similar faults or inconsistency by the critic, their group or another party.
3. That counter-charge is offered as a reason the original criticism is false or should be dropped.
4. The response does not engage the substance of the original criticism.

**Critical questions:**

- Is the comparison used to dismiss the criticism, or to argue for one consistent standard?
- Was the original claim that something is unique or unusual? Then comparisons to others are relevant base-rate evidence.
- Was the original topic someone's consistency or hypocrisy? Then pointing to their behavior is on topic.

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | You're criticizing the church's finances? Exmormons spend all day on Reddit instead of helping anyone. Fix yourselves first. | Deflects a criticism of finances by attacking what critics do, without addressing the finances. |
| Faithful | No | The post says Mormonism is uniquely controlling because of its dress standards. Orthodox Jews, many Muslim communities and Catholic religious orders have comparable rules, so 'uniquely' isn't supported. | The comparison directly tests the claim that it is unique. |
| Critical | **Fallacy** | Members complaining that this sub is mean? Your church excommunicated people for writing history books, so you have no right to complain about anything. | Uses the institution's past conduct to dismiss a complaint about this sub's tone without addressing it. |
| Critical | No | A leader gave a talk warning members against piling up wealth. It's fair to point out that the institution itself held huge investment reserves, since the question is whether leaders practice what they preach. | The topic is consistency, so comparing what leaders say with what the institution does is on point. |

**False-positive traps:**

- 'Other churches do this too' is a legitimate answer to a claim that something is uniquely Mormon.
- Pointing out hypocrisy is relevant when the question is whether leaders practice what they teach.
- Arguing for an even-handed standard ('if that disqualifies them, it disqualifies us') is not deflection.

### 3.6 No true Scotsman `no_true_scotsman`

**Definition.** Protecting a generalization about a group from a counterexample by redefining who counts as a real member of the group.

Expected reliability: **higher** · Needs thread context: **no** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. A generalization about a group is asserted or implied ('members never...', 'exmos always...').
2. A counterexample is raised or acknowledged.
3. The counterexample is excluded by a membership criterion ('real', 'true', 'actual') introduced just to exclude it.
4. The criterion was not stated in advance and is not an established, independent definition.

**Critical questions:**

- Was the membership criterion stated in advance, independent of the disputed case?
- Is the distinction an established formal one (member of record vs. active member, records removed)?
- Is the speaker making a normative claim about what a teaching requires, rather than an empirical claim about what members do?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Nobody who truly had a testimony ever leaves. If they left, they never really had one. | Every counterexample (people who had a testimony and left) is defined away after the fact. |
| Faithful | No | The church itself separates members of record from active members. Saying many of the reported members don't attend isn't changing the definition. It's the church's own category. | Uses an established, independent definition rather than one invented to dodge a counterexample. |
| Critical | **Fallacy** | No real exmo would ever say anything nice about the church. If you defend any part of it, you're just a TBM in disguise. | Anyone who breaks the generalization is redefined as not a real ex-member. |
| Critical | No | In my survey I separated people who stopped attending for practical reasons from people who stopped believing the truth claims. I set that up before collecting any answers. | The criterion was defined in advance, not invented to exclude a counterexample. |

**False-positive traps:**

- Normative statements ('a faithful member should not do X') are not empirical generalizations.
- Using official or formal membership categories.
- Someone describing their own identity ('I don't consider myself a real member anymore').
- Openly arguing about how a term should be defined.

### 3.7 Hasty generalization `hasty_generalization`

**Definition.** Drawing a general conclusion about a group, institution or population from a sample that is too small or unrepresentative, including generalizing from one's own experience to everyone.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: Hasty Generalization

**Necessary conditions (all must be confirmed):**

1. A general claim is made about a group, institution or population (all, most, typical, 'they').
2. The support is a few cases, personal experience or a clearly unrepresentative sample.
3. The text treats that sample as enough for the general claim.
4. The claim is not limited or hedged ('in my ward', 'some', 'in my experience').

**Critical questions:**

- Is the conclusion actually general, or limited to the cases described?
- How many cases are there, and how were they selected?
- Is broader data cited elsewhere in the text or thread?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | I've met two exmos at work and both were bitter and angry. People leave because they got offended, period. | Draws a conclusion about why everyone leaves from two coworkers. |
| Faithful | No | You said nobody finds real peace in the church. I did, and so did my sister. That's enough to show 'nobody' is wrong, even if it doesn't tell us how common it is. | Counterexamples legitimately refute a universal claim, and the author is careful about what they show. |
| Critical | **Fallacy** | My bishop mishandled my abuse report, so every bishop in the church covers up abuse. | Generalizes from one bishop to every bishop. |
| Critical | No | My bishop mishandled my report. Lawsuits and news investigations in several states describe the same reporting procedure, so I think this is a training and policy problem, not just one bad bishop. | The broader conclusion rests on many documented cases, not only the author's own experience. |

**False-positive traps:**

- Personal stories that do not generalize are not arguments at all (gate them out).
- One counterexample against a universal claim ('no one ever...') is a valid refutation, not a hasty generalization.
- Hedged or limited claims.
- Generalizations backed by surveys, studies or many documented cases.

### 3.8 Cherry-picking `cherry_picking`

**Definition.** Presenting only the evidence that supports a conclusion while leaving out directly relevant, readily available evidence that cuts against it, in a way that implies the selection is representative.

Expected reliability: **lower** · Needs thread context: **no** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. A claim is supported by selected evidence (quotes, sources, data, examples).
2. Directly relevant contrary evidence exists, and it is either raised in the thread or found in the same source or a standard, easily checked reference. The labeler must name it.
3. The selection is presented as representative or decisive.
4. Including the omitted evidence would substantially weaken or change the conclusion.

**Critical questions:**

- Can you name the specific omitted evidence and where it is found? If not, do not label.
- Does the author claim to present the whole picture, or are they openly arguing one side?
- Would the omitted evidence actually change the conclusion, or is it a minor detail?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | The witnesses never wavered. Every statement they made late in life reaffirms that they saw the plates exactly as described. | Leaves out well-documented statements in the same historical record that bear directly on how to read the witnesses' experience (e.g., reports of seeing with 'spiritual eyes'), while claiming 'every statement'. |
| Faithful | No | Here are three late-life statements where the witnesses reaffirmed their testimony. I know critics point to the 'spiritual eyes' statements; I read those as describing how they saw, not denying it. | Acknowledges the contrary evidence and explains how the author interprets it. |
| Critical | **Fallacy** | Past leaders taught that dark skin was a curse, so the church still teaches that today. | Ignores the church's widely known official statement disavowing those teachings, which directly contradicts 'still teaches'. |
| Critical | No | Leaders taught for over a century that the priesthood ban came from God. The recent official essay disavows the old explanations but never says the ban itself was a mistake, and I think that's not enough. | Includes the contrary evidence (the disavowal) and argues it doesn't go far enough. |

**False-positive traps:**

- Do not label on the labeler's unverified belief that counter-evidence exists somewhere.
- Openly arguing one side of a debate is not cherry-picking; short comments cannot cite everything.
- Quote-mining counts only when the omitted context is in the same source and reverses or materially changes the meaning.
- Disagreeing with which evidence matters most is not cherry-picking.

### 3.9 Faulty appeal to authority `faulty_appeal_to_authority`

**Definition.** Treating a claim as settled because an authority endorses it, when the authority lacks relevant expertise, is vague or anonymous, contradicts the relevant experts, or is used to shut down examination of a factual question.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: Appeal to Authority

**Necessary conditions (all must be confirmed):**

1. The claim is supported mainly by citing a person's or institution's endorsement.
2. At least one of the following holds: the claim is outside the authority's expertise; the authority is vague or unnamed ('experts say', 'scholars agree'); relevant experts substantially disagree; or the authority is used to forbid further examination of a factual claim.
3. No independent evidence is offered for the claim.

**Critical questions:**

- Is the authority an expert in the field the claim belongs to (history, genetics, Egyptology, doctrine)?
- Is the claim about what the church teaches, where leaders and official texts are the authoritative source, or about a historical or scientific fact?
- Do other relevant experts agree? Is the cited statement quoted accurately and in context?
- Is the authority offered as the whole case or as one piece of evidence?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | An apostle said DNA evidence doesn't contradict the Book of Mormon, so the genetics question is settled. | Cites a religious leader as settling a question in genetics, a field outside his expertise where the relevant experts disagree with him. |
| Faithful | No | Whether coffee breaks the Word of Wisdom isn't really debatable. The handbook and current leaders define the standard, and they're the ones who set the temple recommend questions. | The question is what church policy is, and church leaders are the authoritative source on that. |
| Critical | **Fallacy** | A famous scientist said on a podcast that Mormonism is the dumbest religion, so it's obviously false. | Fame in one field is treated as settling a broad question outside it, with no evidence given. |
| Critical | No | Specialist archaeologists who aren't LDS, writing in published reviews, report no evidence of horses in the Americas during the Book of Mormon period. That expert consensus is a fair reason to doubt the historical claim. | Appeals to a relevant, identifiable expert consensus on a factual question. |

**False-positive traps:**

- Citing leaders or the handbook to establish what official doctrine or policy is.
- Citing a real, sourced expert consensus in the relevant field.
- Citing a scholar as one piece of evidence among others.
- Personal deference stated as belief ('I trust the prophet') is an expression of belief; gate it out.

### 3.10 Appeal to popularity `appeal_to_popularity`

**Definition.** Arguing that a claim is true (or false) because many (or few) people believe or practice it.

Expected reliability: **higher** · Needs thread context: **no** · Closest MAFALDA label: Ad Populum

**Necessary conditions (all must be confirmed):**

1. A claim about truth or correctness is at issue, not a claim about popularity or trends themselves.
2. The support is the number or proportion of people who believe or do something, or how fast that number is growing or shrinking.
3. Popularity is offered as enough to establish truth.

**Critical questions:**

- Is the claim itself about numbers, trends or sociology (then numbers are the right evidence)?
- Are the 'many people' relevant experts? (Expert consensus is a different thing.)
- Is popularity offered as proof of truth, or as evidence of something else, like how common an experience is?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Seventeen million members can't all be wrong. | The number of members is offered as proof that the church's claims are true. |
| Faithful | No | Membership in Africa grew faster than in the US over the last decade, so 'the church is collapsing' isn't true worldwide. | The claim is about membership trends, so membership numbers are the right evidence. |
| Critical | **Fallacy** | Thousands of people leave every year. That's proof the church isn't true. | The number of people leaving is offered as proof the church's claims are false. |
| Critical | No | Retention surveys show most young adults my age stop attending. That's evidence the church has a retention problem, which is all I'm claiming. | The claim is about retention, so data on who stays and who leaves is the right evidence. |

**False-positive traps:**

- Discussing membership or activity statistics when the topic is growth or decline.
- 'Many people report the same experience' used as evidence that the experience is common.
- Citing expert consensus (see faulty appeal to authority instead).

### 3.11 Appeal to consequences `appeal_to_consequences`

**Definition.** Arguing that a factual claim is true or false because believing it would lead to good or bad outcomes.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. A factual claim (something that is true or false) is at issue, not a decision, policy or moral question.
2. The support is that accepting or rejecting the claim would lead to good or bad outcomes.
3. Those outcomes are offered as evidence about whether the claim is true.

**Critical questions:**

- Is the question what is true, or what to do? Consequences are relevant to decisions and policies.
- Is there an unstated but explicit-enough premise ('a loving God would not command X') that makes this a substantive theological argument rather than wishful thinking?
- Are the consequences offered as practical reasons for a choice, or as proof of a fact?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | The Book of Mormon has to be historical. If it weren't, it would destroy my family's faith and everything we've built. | A historical claim is defended by pointing to how bad it would be if it were false. |
| Faithful | No | Even through my doubts I've decided to keep attending, because the community is good for my kids and that matters to us. | A practical decision about what to do, where consequences are the right consideration. |
| Critical | **Fallacy** | The church can't be true, because if it were, my gay best friend would be shut out of the highest heaven, and I refuse to live in a universe like that. | A factual claim is rejected because its implications would be unbearable, not because of evidence. |
| Critical | No | Several studies link teachings that call gay relationships sinful to higher suicide risk among LGBTQ youth, so the church should change how it teaches this. | A policy argument, where harmful consequences are directly relevant. |

**False-positive traps:**

- Practical decisions ('I keep attending because it helps my kids') are not about truth.
- Policy arguments ('this policy harms LGBTQ youth, so it should change') are legitimately about consequences.
- 'A good God would not do X; this teaching does X; so it is not from God' is a valid argument form with a debatable premise, not this fallacy (on either side).
- Expressions of hope or fear that are not offered as evidence.

### 3.12 False dilemma `false_dilemma`

**Definition.** Presenting two (or a few) options as the only possibilities when reasonable alternatives exist, and using that to force a conclusion.

Expected reliability: **higher** · Needs thread context: **no** · Closest MAFALDA label: False Dilemma

**Necessary conditions (all must be confirmed):**

1. The text presents a limited set of options (usually two) as the only ones.
2. Reasonable alternatives exist that the text neither acknowledges nor rules out.
3. A conclusion depends on eliminating one of the stated options.

**Critical questions:**

- Are there recognized middle positions (sincere but mistaken, inspired but not literal, nuanced or progressive belief)?
- Did the author argue that the options are exhaustive, or just assume it?
- Is the choice a genuine logical contradiction (P or not-P)?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Either Joseph Smith was a prophet of God or he was a deliberate fraud. He clearly wasn't a fraud, so he was a prophet. | Ignores other possibilities, such as being sincere but mistaken. |
| Faithful | No | On the factual question there's no middle ground: either the plates physically existed or they didn't. I think the witness statements show they did. | The two options really are exhaustive, and the author gives a reason for choosing one. |
| Critical | **Fallacy** | Either you accept everything the leaders say, or you're intellectually honest and leave. There's no third option. | Rules out nuanced and progressive members, whose existence is well documented. |
| Critical | No | Either the Book of Abraham is a translation of the papyri we have or it isn't. Egyptologists say it isn't, so defenders fall back on the missing-papyrus or catalyst theories, which I find weak because... | A real either-or, and the author names the remaining alternatives and argues against them. |

**False-positive traps:**

- A true contradiction ('the plates either physically existed or they didn't') is not a false dilemma.
- Personal framing ('for me it came down to staying or leaving') describes the author's experience and does not argue for a general conclusion.
- A rhetorical summary when the author acknowledges other options elsewhere in the text.

### 3.13 Special pleading `special_pleading`

**Definition.** Applying a standard to others while exempting one's own side from it, without a relevant reason for the exception.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. A general standard, rule or test of evidence is applied to some case in the text or visible thread.
2. A similar case (usually the author's own side) is exempted from that standard.
3. No relevant difference that would justify the exemption is given, or the stated difference is invented for the occasion.

**Critical questions:**

- Is a relevant difference between the two cases actually stated?
- Does the author themselves apply the standard to the other case, or is the labeler supplying it?
- Would the stated reason for the exception also apply to the cases it is denied to?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | Other religions' founders who claimed angelic visits were obviously deluded; there's no evidence for any of it. But you can't apply evidence standards to Joseph Smith's visions. Spiritual things are known by the Spirit. | Uses an evidence standard against other religions but exempts the author's own with no relevant difference. |
| Faithful | No | I hold everyone to the same standard: nobody's private spiritual experience can prove a historical claim to someone else, mine or a Muslim's. That's why I share my testimony as personal, not as proof. | Applies one standard evenly. |
| Critical | **Fallacy** | When members say the Spirit confirmed the church, that's just emotional manipulation. But the peace I felt after leaving proves I made the right choice. | Rejects feelings as evidence for members but accepts them as evidence for the author. |
| Critical | No | To be fair, the relief I felt after leaving doesn't prove the church is false, any more than a member's good feelings prove it true. My reasons are the historical ones. | Applies the same standard to the author's own experience. |

**False-positive traps:**

- Do not supply a standard the author never stated or applied.
- Cases that really do differ (different evidence, different claims) may be treated differently.
- Stating a doctrine that some rule doesn't apply to God is a theological claim. It becomes special pleading only when used to exempt one's own side from a standard of evidence applied to others.

### 3.14 Moving the goalposts `moving_the_goalposts`

**Definition.** After a stated demand for evidence is met, raising the bar or switching to a different demand without acknowledging that the original one was met.

Expected reliability: **lower** · Needs thread context: **yes** · Closest MAFALDA label: none

**Necessary conditions (all must be confirmed):**

1. The author (or their side, earlier in the visible thread) stated a criterion or demand for evidence.
2. That demand was met or directly addressed in the visible thread.
3. The author then demands different or stronger evidence without acknowledging the original demand was met.
4. The author gives no reason why the evidence offered is insufficient. Refining a criterion with a reason is legitimate.

**Critical questions:**

- Is the earlier criterion actually visible in the thread? If not, do not label.
- Did the author explain why the evidence offered falls short?
- Is the new demand a clarification of the original question or a new hurdle?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | (Earlier: 'Show me any church source admitting the seer stone was used.' After an official magazine article is linked:) Well, that's not an apostle speaking in General Conference, so it doesn't count. | The original demand was 'any church source'. It was met, and a new bar is set without saying so. |
| Faithful | No | Fair enough, that 1970s article shows it wasn't hidden from people who went looking. What I'm asking now is a different question: whether ordinary members were taught it. | Concedes the first point and openly moves on to a different question. |
| Critical | **Fallacy** | (Earlier: 'Name one archaeological find that supports the Book of Mormon.' After someone cites an ancient inscription matching a place name:) That's in Arabia, not the Americas, and one name means nothing. Show me a whole city. | The original challenge was 'one find'. When it was met, the demand was changed without admitting it had been met. |
| Critical | No | I grant the inscription is a real match to a place name in the text. I still don't find it persuasive, because a single name match is weak next to the absence of evidence in the Americas, and I'd say the same about any single match. | Admits the find meets the request and explains why the author still weighs it lightly. |

**False-positive traps:**

- Never label from a single comment; this fallacy only exists across turns.
- Explaining why the evidence offered is weak, and saying so openly, is legitimate.
- Openly moving on to a different question after conceding the first one.

### 3.15 Circular reasoning `circular_reasoning`

**Definition.** An argument whose premises assume the conclusion, so it can only persuade someone who already accepts it.

Expected reliability: **medium** · Needs thread context: **no** · Closest MAFALDA label: Circular Reasoning

**Necessary conditions (all must be confirmed):**

1. There is a conclusion and at least one premise offered in support.
2. A premise restates the conclusion, or can only be accepted if the conclusion is already accepted.
3. The argument is offered to persuade someone who does not already accept the conclusion.

**Critical questions:**

- Is this offered as an argument to persuade others, or is it a personal account of why the author believes (gate it out)?
- Does each premise have support that does not depend on the conclusion?

**Examples** (invented paraphrases, not real posts):

| Side | Label? | Text | Why |
|---|---|---|---|
| Faithful | **Fallacy** | We know the prophet speaks for God because scripture tells us to follow the prophet, and we know that scripture is true because the prophet confirmed it. | The prophet's authority is supported by scripture, whose authority is supported by the prophet, so the argument runs in a circle. |
| Faithful | No | I believe because of experiences I've had in prayer. I know that won't convince you, and I'm not offering it as proof. | A personal account of belief, explicitly not offered as an argument to persuade others. |
| Critical | **Fallacy** | Any evidence apologists produce is worthless because they're biased, and we know they're biased because they keep producing evidence for the church. | The evidence is assumed worthless in order to prove the bias, and the bias is then used to prove the evidence worthless. |
| Critical | No | I don't trust that apologist's paper because it misdates the 1835 manuscript, which you can check against the Joseph Smith Papers. | The reason for distrust is independent and checkable. |

**False-positive traps:**

- Testimony ('I know it's true because the Spirit told me') shared as a personal report is an expression of belief, not an argument.
- Belief systems that are internally consistent are not circular arguments unless they are offered as proof to outsiders.
- Defining a term is not arguing in a circle.

---

## 4. Labeling protocol for the LLM

### 4.1 Pre-processing (identical for every community)

1. **Strip community identity**: no subreddit name, no flair, no usernames (replace with `[user]`), no vote counts. The model must not know which community an item came from.
2. **Keep the parent comment** (and for top-level comments, the post title) as context in a separate field. Fallacies marked `needsThreadContext` may only be labeled when that context is present.
3. **Mark quoted text**: Reddit `>` blockquotes and text in quotation marks attributed to someone else are wrapped in `<quoted>` tags.
4. Keep the original casing, spelling and wording; spans must be quoted exactly.
5. Use the same prompt, model, model version, temperature (0 or the lowest supported) and rubric version for all four communities in any comparison.

### 4.2 Procedure the model follows

1. **Gate.** Decide whether the item contains an argument. All three conditions of `ARGUMENT_GATE` must hold: a claim the author puts forward or rejects, at least one reason, and the author's own voice. If not, output `has_argument: false` with a `non_argument_type` and **stop**. No fallacies may be returned.
2. **Locate.** Quote the main claim span and support span verbatim.
3. **Check candidates.** For each fallacy type that might apply, go through its necessary conditions one by one, then its critical questions. Keep a label only if **every** condition is confirmed from the text (and thread context where required).
4. **Resolve overlaps** with the tie-breakers in section 3. At most **3** labels per item, and only one per span.
5. **Self-check.** For each kept label: Is the span copied exactly? Did I confirm all conditions? Would I give the same label if the same reasoning came from the other side of the debate? If any answer is no, drop the label.

### 4.3 Hard rules

- **Quote the exact span.** `span` must be a verbatim substring of the item text, preferably the shortest one that contains the fallacious move (claim plus the faulty reason). Post-processing discards any label whose span is not found character-for-character.
- **When in doubt, don't label.** Missing a fallacy costs less than inventing one, because the literature shows LLMs over-detect. Labels with `confidence < 0.7` are discarded before aggregation, and the model is told this.
- **All conditions or nothing.** `conditions_met` must list every condition number of that fallacy. Partial matches are not labels.
- **Sarcasm and irony.** Judge the intended meaning. If the intended claim cannot be determined with confidence, treat the item as a joke (not an argument). Mocking a fallacy ("sure, because 17 million members can't be wrong /s") is *not* committing it. A sarcastic misrepresentation of someone's view can still be a strawman if all conditions are met.
- **Quotations of others.** Never label fallacies inside `<quoted>` text or in reported views ("my mom says…"), unless the author clearly endorses the quoted reasoning and argues from it. In that case, label the author's endorsing sentence.
- **No outside verdicts.** Do not use beliefs about whether church truth claims are true. For cherry-picking and strawman, the omitted evidence or the distortion must be named in the rationale, and must be something shown in the thread or widely documented and easy to check.
- **No community priors.** Do not infer an author's side to decide a label. Labels attach to reasoning, not to the reasoner's affiliation.

### 4.4 Output schema

One JSON object per item. TypeScript types: `ClassifierOutput` and `FallacyLabel` in `lib/fallacy-taxonomy.ts`.

```json
{
  "rubric_version": "1.0.0",
  "has_argument": true,
  "non_argument_type": null,
  "claim_span": "Nobody who truly had a testimony ever leaves.",
  "support_span": "If they left, they never really had one.",
  "fallacies": [
    {
      "type": "no_true_scotsman",
      "span": "Nobody who truly had a testimony ever leaves. If they left, they never really had one.",
      "conditions_met": [1, 2, 3, 4],
      "rationale": "Universal claim about members; the counterexample (people who left) is excluded by redefining 'truly had a testimony' after the fact.",
      "confidence": 0.9
    }
  ]
}
```

For a non-argument:

```json
{
  "rubric_version": "1.0.0",
  "has_argument": false,
  "non_argument_type": "personal_story",
  "claim_span": null,
  "support_span": null,
  "fallacies": []
}
```

JSON Schema (for structured-output APIs):

```json
{
  "type": "object",
  "required": ["rubric_version", "has_argument", "non_argument_type", "claim_span", "support_span", "fallacies"],
  "additionalProperties": false,
  "properties": {
    "rubric_version": { "type": "string" },
    "has_argument": { "type": "boolean" },
    "non_argument_type": {
      "type": ["string", "null"],
      "enum": ["venting", "personal_story", "joke_or_meme", "expression_of_belief", "question",
               "quotation_or_report", "announcement_or_logistics", "other", null]
    },
    "claim_span": { "type": ["string", "null"] },
    "support_span": { "type": ["string", "null"] },
    "fallacies": {
      "type": "array",
      "maxItems": 3,
      "items": {
        "type": "object",
        "required": ["type", "span", "conditions_met", "rationale", "confidence"],
        "additionalProperties": false,
        "properties": {
          "type": { "type": "string", "enum": ["ad_hominem", "poisoning_the_well", "strawman", "genetic_fallacy",
            "tu_quoque", "no_true_scotsman", "hasty_generalization", "cherry_picking",
            "faulty_appeal_to_authority", "appeal_to_popularity", "appeal_to_consequences",
            "false_dilemma", "special_pleading", "moving_the_goalposts", "circular_reasoning"] },
          "span": { "type": "string" },
          "conditions_met": { "type": "array", "items": { "type": "integer", "minimum": 1 } },
          "rationale": { "type": "string" },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
        }
      }
    }
  }
}
```

### 4.5 Post-processing (deterministic code, not the model)

1. Reject a label if `span` is not a substring of the item text, if `conditions_met` does not contain every condition index, if `confidence < LABEL_CONFIDENCE_FLOOR`, if `needsThreadContext` is true and no context was supplied, or if `has_argument` is false.
2. Run each item **k = 3** times with one model and once with at least one model from a **different provider**. An item counts as containing fallacy *X* only if a majority of runs keep *X* after step 1.
3. Store every raw output with model ID, prompt hash and rubric version, so any published number can be audited and reproduced.

### 4.6 Prompt construction

Build the prompt from the TypeScript data, not by hand. The prompt contains the gate, the non-argument types, and for each fallacy its definition, numbered conditions, critical questions and false-positive traps, plus the tie-breakers. Give the four examples per type in a balanced order (faithful and critical, fallacious and not), so few-shot examples do not prime the model toward one side. Never put real items from the evaluation set into the prompt.

---

## 5. What the site reports

- **Primary metric:** % of *argumentative* items (those with `has_argument = true`) that contain fallacy *X*. Also show the **argument rate** (% of all items that are arguments) next to it. Rates per *all* items mostly measure how much a community argues instead of venting or sharing stories, and that differs a lot between these subreddits.
- **Uncertainty:** show 95% bootstrap confidence intervals on every bar. Call a community difference a "difference" only when the CI of the difference excludes zero after Benjamini–Hochberg correction across all types × community pairs.
- **Error-corrected rates:** use the validation confusion matrix (precision and recall per type, per community) to adjust raw rates with the Rogan–Gladen estimator: true rate ≈ (observed + specificity − 1) / (sensitivity + specificity − 1). If precision differs by community, uncorrected rates are biased in a predictable direction.
- **Sampling:** a random sample of posts *and* comments, stratified by week, not "top" or "hot". Report results stratified by topic too (history, finances, policy and so on), because communities discuss different topics and some topics invite more argument. Control or stratify by comment length, since longer texts have more room for every label.
- **Sample size:** to estimate a ~5% rate within ±1.5 points (95% CI), you need about **810 argumentative items per community per period** (n ≈ p(1−p)·(1.96/0.015)²). Smaller periods should show wider intervals or be merged.
- **Moderation bias disclaimer:** each subreddit removes different content (r/latterdaysaints in particular restricts critical content; r/exmormon has its own rules). Removed content isn't in the data, so the site measures *moderated* discourse.

---

## 6. Validation plan

The aim is that **no published number depends on the site owner's own judgment.**

### 6.1 External gold sets (sanity check, not the final word)

- **MAFALDA gold (200 texts)**: map its level-2 labels to ours (`mafaldaEquivalent` in the TS file). Score the pipeline with MAFALDA's disjunctive metric for the overlapping types and for binary detection. Expected: near MAFALDA's published numbers (binary F1 ~0.6–0.75).
- **Sahai et al. Reddit set and CoCoLoFa**: for overlapping types (hasty generalization, appeal to authority, appeal to popularity, false dilemma). These test the pipeline on Reddit-style text.
- **Out-of-domain negatives**: a few hundred non-argumentative items (venting, stories, jokes, testimony) from all four subs, labeled by the panel, to measure the **gate's** false-positive rate.

Passing external gold sets shows the pipeline works on someone else's definitions. It does not validate it in this domain.

### 6.2 In-domain gold set with a cross-perspective panel

- **Panel:** at least 6 paid raters. **2 currently believing members, 2 ex-members, 2 outsiders** (another faith or none, ideally with philosophy or argumentation training). The site owner does not rate. Moderators of each subreddit could be asked to nominate raters, which also helps credibility.
- **Training:** raters learn the rubric on **non-LDS** practice items (from MAFALDA or CoCoLoFa) before seeing domain items, so rubric skill is built without priming on the debate itself.
- **Items:** 400–600 items stratified evenly across the four communities and topics, with community identity stripped (section 4.1). Oversample likely positives (e.g., items any model flagged) so each type gets about 30 or more gold positives, and use sampling weights when estimating prevalence.
- **Design:** each item is rated independently by at least 3 raters, including **at least one from each side**. Raters never see model output. Gold = majority; ties are adjudicated by an outsider rater, and every adjudication is logged.
- **Bias check:** for each rater group, compute the flag rate on items from each community. If faithful raters flag r/exmormon items far more than ex-member raters do (or the reverse), that is perception bias. Report it, and use the cross-group majority as gold. Item clusters where groups systematically disagree mean the rubric needs revision, not the raters.

### 6.3 Model-consistency checks

- **Self-consistency:** Krippendorff's α across the k = 3 runs of the same model.
- **Cross-model:** α between two or more models from different providers.
- **Counterfactual symmetry test:** for about 100 argumentative items, create minimal pairs that swap the side and keep the reasoning (e.g., "TBM" ↔ "apostate", "the prophet said" ↔ "the historian said", "members" ↔ "exmos"). A fair labeler gives the same label to both. Report the flip rate.
- **Perturbation test:** small paraphrases and reordering should not change labels.

### 6.4 Publication thresholds

A fallacy type is **published** on the site only if **all** of these hold. Types that fail stay internal.

| Check | Threshold | Why |
|---|---|---|
| Human panel agreement (Krippendorff's α) on the gate | ≥ 0.67 | Krippendorff's minimum for tentative conclusions |
| Human panel α for this fallacy type | ≥ 0.67 (≥ 0.80 to call it "reliable") | Literature typically gets 0.4–0.6, so expect some types to fail |
| Model vs. panel gold: precision | ≥ 0.75 | False positives are the main risk to credibility |
| Model vs. panel gold: recall | ≥ 0.50 | Below this, the rate mostly reflects what the model misses |
| Model run-to-run and cross-model α | ≥ 0.80 | A model is cheap to rerun, so it should be more consistent than people |
| Per-community precision gap | max − min ≤ 0.10, and not statistically significant | Otherwise comparisons between communities are biased |
| Counterfactual flip rate | ≤ 10% | Direct test of symmetric treatment |
| Gold positives for the type | ≥ 30 | Minimum to estimate precision at all |

Types with human α between 0.50 and 0.67 that pass the other checks can go in an **"experimental"** tab, hidden by default and clearly labeled. Below 0.50, don't publish. Republish thresholds and results with each rubric or model version.

### 6.5 Ongoing

- Re-run a 100-item audit set every time the model, prompt or rubric changes, and every quarter regardless (models drift).
- **Pre-register** the rubric version, prompt and thresholds before computing any community comparisons, so the rubric can't be tuned to produce a desired result.
- Publish a random sample of labeled items with span, rationale and conditions (anonymized and paraphrased), and offer a public "dispute this label" link. Use disputes as new gold candidates, judged by the panel, not the owner.

---

## 7. Limitations (honest version)

- **Low accuracy ceiling.** On naturally occurring text, trained humans agree on fallacy *type* at roughly α/κ 0.4–0.6, and against a gold standard they reach only ~0.19 span-level F1 on 23 types (MAFALDA). The best zero-shot LLM in that study got 0.14. Binary "any fallacy?" is better (humans ~0.75, LLM ~0.63 F1). Real-world transfer is poor (LOGIC 59 → LogicClimate 27–29 F1). A realistic target for this pipeline: binary detection around 0.65–0.75 F1, and per-type precision of 0.6–0.8 for the best-defined types (false dilemma, appeal to popularity, no true Scotsman, tu quoque, ad hominem). Expect lower for context-heavy types (strawman, cherry-picking, moving the goalposts), which may never pass the thresholds.
- **Fallacy rate ≠ reasoning quality.** A community that argues more and longer will have more labels. Good arguments are not counted at all. The metric covers only one aspect of discourse.
- **Context.** Reddit threads are long. Many fallacies (strawman, goalposts) depend on earlier turns the model may not see.
- **Sarcasm and in-group language** are hard for models and for outsiders, and each community has its own idiom. This is the most likely source of side-specific error, which is why the per-community precision check exists.
- **Model bias.** LLMs carry training-data biases about religion and ex-religious communities. The symmetry tests reduce but cannot eliminate this.
- **Selection.** Moderation, removed and deleted content, and Reddit's demographics mean the samples are not representative of members or ex-members in general. Results describe these subreddits only.
- **Construct disputes.** Some readers will reject the premise that, say, an appeal to spiritual experience is not a fallacy, or that it should be gated out. The rubric takes a documented position (section 1) and applies it to both sides, but it cannot satisfy every philosophy of evidence.
- **Ethics.** Show aggregates only. Never display or rank individual users, and paraphrase rather than quote real posts on the site.

---

## 8. References

**Theory**

- Aristotle. *On Sophistical Refutations* (trans. W. A. Pickard-Cambridge). http://classics.mit.edu/Aristotle/sophist_refut.html
- Hamblin, C. L. (1970). *Fallacies*. London: Methuen. (Book; reprinted by Vale Press, 1993.)
- Hansen, H. (2015, rev. 2024). "Fallacies." *Stanford Encyclopedia of Philosophy*. https://plato.stanford.edu/entries/fallacies/
- van Eemeren, F. H., & Grootendorst, R. (2004). *A Systematic Theory of Argumentation: The Pragma-Dialectical Approach*. Cambridge University Press. https://doi.org/10.1017/CBO9780511616389
- Walton, D. (1995). *A Pragmatic Theory of Fallacy*. University of Alabama Press.
- Walton, D. (1998). *Ad Hominem Arguments*. University of Alabama Press.
- Walton, D., Reed, C., & Macagno, F. (2008). *Argumentation Schemes*. Cambridge University Press. https://doi.org/10.1017/CBO9780511802034

**Datasets and detection**

- Jin, Z., et al. (2022). "Logical Fallacy Detection." *Findings of EMNLP 2022*. https://arxiv.org/abs/2202.13758
- Goffredo, P., Haddadan, S., Vorakitphan, V., Cabrio, E., & Villata, S. (2022). "Fallacious Argument Classification in Political Debates." *IJCAI 2022*. https://www.ijcai.org/proceedings/2022/575
- Goffredo, P., Chaves, M., Villata, S., & Cabrio, E. (2023). "Argument-based Detection and Classification of Fallacies in Political Debates." *EMNLP 2023*. https://aclanthology.org/2023.emnlp-main.684
- Sahai, S., Balalau, O., & Horincar, R. (2021). "Breaking Down the Invisible Wall of Informal Fallacies in Online Discussions." *ACL-IJCNLP 2021*. https://aclanthology.org/2021.acl-long.53
- Habernal, I., Wachsmuth, H., Gurevych, I., & Stein, B. (2018). "Before Name-Calling: Dynamics and Triggers of Ad Hominem Fallacies in Web Argumentation." *NAACL 2018*. https://aclanthology.org/N18-1036
- Habernal, I., et al. (2017). "Argotario: Computational Argumentation Meets Serious Games." *EMNLP 2017 (demos)*. https://aclanthology.org/D17-2002
- Da San Martino, G., et al. (2019). "Fine-Grained Analysis of Propaganda in News Articles." *EMNLP-IJCNLP 2019*. https://aclanthology.org/D19-1565
- Sourati, Z., et al. (2023). "Robust and Explainable Identification of Logical Fallacies in Natural Language Arguments." *Knowledge-Based Systems* 266. https://arxiv.org/abs/2212.07425
- Bonial, C., et al. (2022). "The Search for Agreement on Logical Fallacy Annotation of an Infodemic." *LREC 2022*. https://aclanthology.org/2022.lrec-1.471
- Ruiz-Dolz, R., & Lawrence, J. (2023). "Detecting Argumentative Fallacies in the Wild: Problems and Limitations of Large Language Models." *ArgMining 2023*. https://aclanthology.org/2023.argmining-1.1
- Helwe, C., Calamai, T., Paris, P.-H., Clavel, C., & Suchanek, F. (2024). "MAFALDA: A Benchmark and Comprehensive Study of Fallacy Detection and Classification." *NAACL 2024*. https://aclanthology.org/2024.naacl-long.270/ (full text: https://arxiv.org/abs/2311.09761)
- Yeh, M.-H., Wan, R., & Huang, T.-H. K. (2024). "CoCoLoFa: A Dataset of News Comments with Common Logical Fallacies Written by LLM-Assisted Crowds." *EMNLP 2024*. https://arxiv.org/abs/2410.03457
- Pan, F., Wu, X., Li, Z., & Luu, A. T. (2024). "Are LLMs Good Zero-Shot Fallacy Classifiers?" *EMNLP 2024*. https://aclanthology.org/2024.emnlp-main.794
- Bytyqi, E., & Hautli-Janisz, A. (2025). "'The Facts Speak for Themselves': GPT and Fallacy Classification." *ArgMining 2025*. https://aclanthology.org/2025.argmining-1.1/
- Blodgett, A., Bonial, C., Pellegrin, T. A., Torgbi, M., & Tayyar Madabushi, H. (2025). "Illuminating Logical Fallacies with the CAMPFIRE Corpus." *LAW-XIX 2025*. https://aclanthology.org/2025.law-1.24
- "Socrates or Smartypants: Testing Logic Reasoning Capabilities of Large Language Models with Logic Programming-based Test Oracles" (SmartyPat-Bench) (2025). https://arxiv.org/abs/2504.12312

**Measurement**

- Krippendorff, K. (2004). "Reliability in Content Analysis: Some Common Misconceptions and Recommendations." *Human Communication Research* 30(3). https://doi.org/10.1111/j.1468-2958.2004.tb00738.x
- Rogan, W. J., & Gladen, B. (1978). "Estimating Prevalence from the Results of a Screening Test." *American Journal of Epidemiology* 107(1). https://doi.org/10.1093/oxfordjournals.aje.a112510
- Benjamini, Y., & Hochberg, Y. (1995). "Controlling the False Discovery Rate." *Journal of the Royal Statistical Society B* 57(1). https://doi.org/10.1111/j.2517-6161.1995.tb02031.x
