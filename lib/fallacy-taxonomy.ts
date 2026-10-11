// Fallacy taxonomy shared by the site and the classifier prompt.
// Human-readable rationale, validation plan and references: docs/fallacy-framework.md.
// Bump RUBRIC_VERSION whenever any definition, condition or rule changes, and
// never compare numbers produced under different versions.

export const RUBRIC_VERSION = "1.0.0";

// ---------------------------------------------------------------------------
// Step 1: the argument gate. Only items that pass it are checked for fallacies.
// ---------------------------------------------------------------------------

/** All of these must hold for has_argument = true. */
export const ARGUMENT_GATE = [
  "The author puts forward a claim as true, or as something others should accept or do, OR rejects someone else's claim.",
  "The author offers at least one reason for that claim or rejection (stated, or unmistakably implied by the wording).",
  "The claim and reason are the author's own, not a report or quotation of someone else's view that the author does not endorse.",
] as const;

/** Content that is NOT an argument and must never receive a fallacy label. */
export const NON_ARGUMENT_TYPES = [
  { id: "venting", description: "Expressing anger, grief, relief or frustration without arguing for a claim." },
  { id: "personal_story", description: "Recounting what happened to the author, without generalizing from it to others." },
  { id: "joke_or_meme", description: "Humor, satire or memes whose point is entertainment rather than persuasion." },
  { id: "expression_of_belief", description: "Sincerely stating belief or disbelief (testimony, 'I know the church is true', 'I just don't believe anymore') without offering it as proof to others." },
  { id: "question", description: "Asking for information, advice or opinions. Rhetorical questions count only when the implied claim and reason are unmistakable." },
  { id: "quotation_or_report", description: "Quoting, linking or summarizing someone else's view without endorsing it." },
  { id: "announcement_or_logistics", description: "News, events, meetups, moderation notes, links without commentary." },
  { id: "other", description: "Anything else with no claim-plus-reason structure." },
] as const;

export type NonArgumentType = (typeof NON_ARGUMENT_TYPES)[number]["id"];

// ---------------------------------------------------------------------------
// Step 2: the taxonomy.
// ---------------------------------------------------------------------------

export const FALLACY_IDS = [
  "ad_hominem",
  "poisoning_the_well",
  "strawman",
  "genetic_fallacy",
  "tu_quoque",
  "no_true_scotsman",
  "hasty_generalization",
  "cherry_picking",
  "faulty_appeal_to_authority",
  "appeal_to_popularity",
  "appeal_to_consequences",
  "false_dilemma",
  "special_pleading",
  "moving_the_goalposts",
  "circular_reasoning",
] as const;

export type FallacyId = (typeof FALLACY_IDS)[number];

/** "faithful" = believing-member rhetoric, "critical" = ex-member / critic rhetoric. */
export type ExampleSide = "faithful" | "critical";

export type FallacyExample = {
  side: ExampleSide;
  fallacious: boolean;
  /** Invented paraphrase written for this rubric; not a real user post. */
  text: string;
  why: string;
};

export type FallacyDefinition = {
  id: FallacyId;
  name: string;
  definition: string;
  /** Necessary conditions. ALL must be confirmed before the label may be applied. */
  conditions: string[];
  /** Questions that separate fallacious from legitimate uses of the same move. */
  criticalQuestions: string[];
  falsePositiveTraps: string[];
  /** True when the label cannot be applied without the parent comment / thread. */
  needsThreadContext: boolean;
  /**
   * Prior expectation of annotation reliability, from the literature and the
   * amount of outside knowledge the label needs. Replace with measured values
   * after validation (see docs/fallacy-framework.md).
   */
  expectedReliability: "higher" | "medium" | "lower";
  /** Closest MAFALDA (Helwe et al. 2024) level-2 label, for building a gold set. */
  mafaldaEquivalent: string | null;
  examples: FallacyExample[];
};

export const FALLACY_TAXONOMY: FallacyDefinition[] = [
  {
    id: "ad_hominem",
    name: "Ad hominem",
    definition:
      "Rejecting or dismissing a claim by attacking the character, motives, intelligence or circumstances of the person who made it, instead of the claim itself.",
    conditions: [
      "A specific claim or argument made by an identifiable person or group is in view.",
      "The text attacks that person's character, motives, intelligence, morals or circumstances.",
      "The attack is offered as a reason to reject or ignore the claim (explicitly or by unmistakable implication).",
      "The attacked trait is not relevant to the claim's truth: the claim does not rest on that person's own testimony, expertise or trustworthiness.",
    ],
    criticalQuestions: [
      "Is the attack used to reject the claim, or is it an insult sitting next to an argument that stands on its own?",
      "Does the claim depend on the person's credibility (eyewitness testimony, unsupported say-so, a financial or institutional conflict of interest)? If so, questioning credibility is legitimate.",
      "Does the text still engage the substance of the claim?",
    ],
    falsePositiveTraps: [
      "Pure insults or rudeness that do not dismiss any claim are incivility, not this fallacy.",
      "Criticizing a leader's decisions or conduct ('he approved this policy') is a claim about actions, not an attack on a person in place of an argument.",
      "Pointing out a documented conflict of interest when the claim rests on that person's authority is legitimate source criticism.",
      "Questioning the reliability of a witness whose testimony is the evidence is legitimate.",
    ],
    needsThreadContext: false,
    expectedReliability: "higher",
    mafaldaEquivalent: "Abusive Ad Hominem",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Of course he thinks the Book of Abraham is a problem. He left because he wanted to drink and party; nothing he says about the papyri is worth reading.",
        why: "The person's supposed motive for leaving is used to dismiss his argument about the papyri, which can be checked on its own.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "The only source for this story is the blogger's own memory of a private meeting, and he has admitted making up details in an earlier post. I'd want independent confirmation before believing it.",
        why: "The claim rests entirely on this person's testimony, so his track record is relevant evidence.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "You can ignore that conference talk about tithing blessing families. The speaker is a wealthy retired executive who has never struggled a day in his life.",
        why: "The speaker's wealth is used to dismiss his claim without addressing it.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "The paper says church finances are nobody's business, but the author works for an institute the church funds. That doesn't make him wrong, but we shouldn't take his word for it. Let's look at his actual evidence.",
        why: "Notes a conflict of interest only to deny the paper's authority, then turns to the evidence.",
      },
    ],
  },
  {
    id: "poisoning_the_well",
    name: "Poisoning the well",
    definition:
      "Discrediting a source, person or group in advance, so that anything they say will be dismissed without being examined.",
    conditions: [
      "A source, person or group is identified (a book, website, organization, community or type of person).",
      "The text gives it a negative framing (a label, an alleged motive, a category).",
      "The framing is offered as a reason to disregard everything, or a whole class of claims, from that source without examining any specific claim.",
      "No specific, stated reliability problem relevant to the claims at issue is given.",
    ],
    criticalQuestions: [
      "Does the text tell readers not to engage at all, or does it name a specific error or reliability problem?",
      "Is the label a neutral or self-chosen description, or is it used to dismiss?",
      "Would the same dismissal apply if the source said something the author agreed with?",
    ],
    falsePositiveTraps: [
      "In-group vocabulary used descriptively or about oneself ('as a TBM I used to...', 'I'm PIMO', 'I'm an apologist') is not dismissal.",
      "Warning about a specific documented error in a source is legitimate source criticism.",
      "Saying who published something ('this is a church publication', 'this is an exmo podcast') without telling readers to disregard it.",
      "Recommending one source over another for a stated reason.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: "Guilt by Association",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Before you read that letter, remember it's anti-Mormon literature written to destroy testimonies. Nothing in it is worth your time.",
        why: "Labels the whole document as hostile and tells readers to ignore every claim in it without checking any of them.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Be careful with that pamphlet. Its quote from the 1832 account leaves out a sentence that changes the meaning. Compare it with the Joseph Smith Papers transcription before relying on it.",
        why: "Names a specific, checkable error and points to the primary source.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Don't bother with anything from apologetics sites. They're paid to lie for the Lord.",
        why: "Every claim from a whole category of sources is dismissed because of a supposed motive.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "That essay has no named author and no peer review, and two of its footnotes cite sources that don't say what it claims. I'd check every citation before trusting it.",
        why: "Gives specific reasons to be cautious and still engages with the content.",
      },
    ],
  },
  {
    id: "strawman",
    name: "Strawman",
    definition:
      "Misrepresenting an opponent's position (exaggerating it, oversimplifying it, or attributing a view they do not hold) and then attacking the misrepresentation as if it were their real view.",
    conditions: [
      "The text attributes a position to an identifiable opponent (a person, a group, or 'they').",
      "The attributed position is a distortion, as shown by the thread or by the group's openly stated positions, not by the labeler's own opinion of what the group 'really' thinks.",
      "The text argues against the distorted version.",
      "Defeating the distorted version is presented as defeating the opponent's actual view.",
    ],
    criticalQuestions: [
      "Can the distortion be shown from the available context (the parent comment, or a widely documented position)?",
      "Is the author describing a real minority view and saying it is a minority view?",
      "Would a fair-minded member of the targeted group recognize the attributed view as theirs?",
    ],
    falsePositiveTraps: [
      "An accurate paraphrase of a blunt or unflattering view is not a strawman.",
      "Criticizing a real minority view that the author openly labels as such.",
      "The labeler disagreeing with how a group is described is not enough; the distortion must be shown.",
      "Without the parent comment, a reply's 'so you're saying...' usually cannot be judged. Do not label, or label with low confidence.",
    ],
    needsThreadContext: true,
    expectedReliability: "medium",
    mafaldaEquivalent: "Strawman Fallacy",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Critics basically say that unless every prophet was perfect, the church is false. Nobody ever claimed prophets were perfect, so their whole case falls apart.",
        why: "Recasts specific historical objections as a demand for perfection, then knocks down that demand.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "You said the church hid the seer stone. It was described in an official magazine article in the 1970s, so 'hid' overstates it, though I'll grant most members had never heard of it.",
        why: "Responds to what the other person actually said and concedes part of the point.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Members think God wants their money sitting in a hedge fund instead of feeding the poor. That's obviously absurd.",
        why: "Assigns members a view almost none of them hold, then mocks it.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "In the talk you linked, the speaker tells members to be cautious about online sources that criticize the church. I think even that milder advice discourages honest inquiry, because...",
        why: "States the speaker's actual, milder position before criticizing it.",
      },
    ],
  },
  {
    id: "genetic_fallacy",
    name: "Genetic fallacy",
    definition:
      "Judging a claim, belief or practice to be true, false, good or bad only by where it came from, when its origin does not settle the question.",
    conditions: [
      "A claim, belief, practice or idea is being evaluated.",
      "The text points to its origin (who started it, where it came from, how it arose).",
      "The origin is treated as settling the question by itself.",
      "The question is not itself about origins, and the origin says nothing about how reliable the evidence is.",
    ],
    criticalQuestions: [
      "Is the disputed claim itself about origins (e.g., 'this ceremony is ancient')? If so, evidence about its origin bears directly on it.",
      "Does the origin bear on how reliable the evidence is (source criticism: an unsourced quote, a forged document, a late account)?",
      "Is the origin offered as one consideration among others, or as the decisive one?",
    ],
    falsePositiveTraps: [
      "Source criticism (who wrote this, when, with what access to events) is legitimate historical method, not this fallacy.",
      "Origin evidence against a claim of ancient or divine origin is relevant. Example: 19th-century parallels used to dispute an 'ancient' claim.",
      "Explaining why someone holds a belief, without saying the explanation makes the belief false.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Biblical criticism was developed by secular German scholars who were hostile to faith, so whatever it says about the Old Testament is false.",
        why: "Rejects the conclusions because of who first proposed them, without examining the arguments.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "That 'Brigham Young quote' has no source. It first shows up in a pamphlet from the 1990s with no citation. Until someone finds a primary source, we shouldn't attribute it to him.",
        why: "Where the quote came from is directly relevant to whether he said it.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "The idea of eternal families only exists because a 19th-century religion made it up, so it's meaningless.",
        why: "Uses the idea's origin to settle whether it has value or meaning, which origin alone does not decide.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "The church teaches the endowment restores an ancient ceremony. But its signs and wording closely match a Masonic ritual Joseph Smith had joined weeks earlier, which points to a 19th-century source rather than an ancient one.",
        why: "The disputed claim is about origin, so evidence about origin is the right kind of evidence.",
      },
    ],
  },
  {
    id: "tu_quoque",
    name: "Tu quoque / whataboutism",
    definition:
      "Deflecting a criticism by pointing out that the critic, or their side, is guilty of something similar, as if that made the criticism false or irrelevant.",
    conditions: [
      "A criticism or charge has been made (in the text or the visible thread).",
      "The response points to similar faults or inconsistency by the critic, their group or another party.",
      "That counter-charge is offered as a reason the original criticism is false or should be dropped.",
      "The response does not engage the substance of the original criticism.",
    ],
    criticalQuestions: [
      "Is the comparison used to dismiss the criticism, or to argue for one consistent standard?",
      "Was the original claim that something is unique or unusual? Then comparisons to others are relevant base-rate evidence.",
      "Was the original topic someone's consistency or hypocrisy? Then pointing to their behavior is on topic.",
    ],
    falsePositiveTraps: [
      "'Other churches do this too' is a legitimate answer to a claim that something is uniquely Mormon.",
      "Pointing out hypocrisy is relevant when the question is whether leaders practice what they teach.",
      "Arguing for an even-handed standard ('if that disqualifies them, it disqualifies us') is not deflection.",
    ],
    needsThreadContext: true,
    expectedReliability: "higher",
    mafaldaEquivalent: "Tu Quoque",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "You're criticizing the church's finances? Exmormons spend all day on Reddit instead of helping anyone. Fix yourselves first.",
        why: "Deflects a criticism of finances by attacking what critics do, without addressing the finances.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "The post says Mormonism is uniquely controlling because of its dress standards. Orthodox Jews, many Muslim communities and Catholic religious orders have comparable rules, so 'uniquely' isn't supported.",
        why: "The comparison directly tests the claim that it is unique.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Members complaining that this sub is mean? Your church excommunicated people for writing history books, so you have no right to complain about anything.",
        why: "Uses the institution's past conduct to dismiss a complaint about this sub's tone without addressing it.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "A leader gave a talk warning members against piling up wealth. It's fair to point out that the institution itself held huge investment reserves, since the question is whether leaders practice what they preach.",
        why: "The topic is consistency, so comparing what leaders say with what the institution does is on point.",
      },
    ],
  },
  {
    id: "no_true_scotsman",
    name: "No true Scotsman",
    definition:
      "Protecting a generalization about a group from a counterexample by redefining who counts as a real member of the group.",
    conditions: [
      "A generalization about a group is asserted or implied ('members never...', 'exmos always...').",
      "A counterexample is raised or acknowledged.",
      "The counterexample is excluded by a membership criterion ('real', 'true', 'actual') introduced just to exclude it.",
      "The criterion was not stated in advance and is not an established, independent definition.",
    ],
    criticalQuestions: [
      "Was the membership criterion stated in advance, independent of the disputed case?",
      "Is the distinction an established formal one (member of record vs. active member, records removed)?",
      "Is the speaker making a normative claim about what a teaching requires, rather than an empirical claim about what members do?",
    ],
    falsePositiveTraps: [
      "Normative statements ('a faithful member should not do X') are not empirical generalizations.",
      "Using official or formal membership categories.",
      "Someone describing their own identity ('I don't consider myself a real member anymore').",
      "Openly arguing about how a term should be defined.",
    ],
    needsThreadContext: false,
    expectedReliability: "higher",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Nobody who truly had a testimony ever leaves. If they left, they never really had one.",
        why: "Every counterexample (people who had a testimony and left) is defined away after the fact.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "The church itself separates members of record from active members. Saying many of the reported members don't attend isn't changing the definition. It's the church's own category.",
        why: "Uses an established, independent definition rather than one invented to dodge a counterexample.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "No real exmo would ever say anything nice about the church. If you defend any part of it, you're just a TBM in disguise.",
        why: "Anyone who breaks the generalization is redefined as not a real ex-member.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "In my survey I separated people who stopped attending for practical reasons from people who stopped believing the truth claims. I set that up before collecting any answers.",
        why: "The criterion was defined in advance, not invented to exclude a counterexample.",
      },
    ],
  },
  {
    id: "hasty_generalization",
    name: "Hasty generalization",
    definition:
      "Drawing a general conclusion about a group, institution or population from a sample that is too small or unrepresentative, including generalizing from one's own experience to everyone.",
    conditions: [
      "A general claim is made about a group, institution or population (all, most, typical, 'they').",
      "The support is a few cases, personal experience or a clearly unrepresentative sample.",
      "The text treats that sample as enough for the general claim.",
      "The claim is not limited or hedged ('in my ward', 'some', 'in my experience').",
    ],
    criticalQuestions: [
      "Is the conclusion actually general, or limited to the cases described?",
      "How many cases are there, and how were they selected?",
      "Is broader data cited elsewhere in the text or thread?",
    ],
    falsePositiveTraps: [
      "Personal stories that do not generalize are not arguments at all (gate them out).",
      "One counterexample against a universal claim ('no one ever...') is a valid refutation, not a hasty generalization.",
      "Hedged or limited claims.",
      "Generalizations backed by surveys, studies or many documented cases.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: "Hasty Generalization",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "I've met two exmos at work and both were bitter and angry. People leave because they got offended, period.",
        why: "Draws a conclusion about why everyone leaves from two coworkers.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "You said nobody finds real peace in the church. I did, and so did my sister. That's enough to show 'nobody' is wrong, even if it doesn't tell us how common it is.",
        why: "Counterexamples legitimately refute a universal claim, and the author is careful about what they show.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "My bishop mishandled my abuse report, so every bishop in the church covers up abuse.",
        why: "Generalizes from one bishop to every bishop.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "My bishop mishandled my report. Lawsuits and news investigations in several states describe the same reporting procedure, so I think this is a training and policy problem, not just one bad bishop.",
        why: "The broader conclusion rests on many documented cases, not only the author's own experience.",
      },
    ],
  },
  {
    id: "cherry_picking",
    name: "Cherry-picking",
    definition:
      "Presenting only the evidence that supports a conclusion while leaving out directly relevant, readily available evidence that cuts against it, in a way that implies the selection is representative.",
    conditions: [
      "A claim is supported by selected evidence (quotes, sources, data, examples).",
      "Directly relevant contrary evidence exists, and it is either raised in the thread or found in the same source or a standard, easily checked reference. The labeler must name it.",
      "The selection is presented as representative or decisive.",
      "Including the omitted evidence would substantially weaken or change the conclusion.",
    ],
    criticalQuestions: [
      "Can you name the specific omitted evidence and where it is found? If not, do not label.",
      "Does the author claim to present the whole picture, or are they openly arguing one side?",
      "Would the omitted evidence actually change the conclusion, or is it a minor detail?",
    ],
    falsePositiveTraps: [
      "Do not label on the labeler's unverified belief that counter-evidence exists somewhere.",
      "Openly arguing one side of a debate is not cherry-picking; short comments cannot cite everything.",
      "Quote-mining counts only when the omitted context is in the same source and reverses or materially changes the meaning.",
      "Disagreeing with which evidence matters most is not cherry-picking.",
    ],
    needsThreadContext: false,
    expectedReliability: "lower",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "The witnesses never wavered. Every statement they made late in life reaffirms that they saw the plates exactly as described.",
        why: "Leaves out well-documented statements in the same historical record that bear directly on how to read the witnesses' experience (e.g., reports of seeing with 'spiritual eyes'), while claiming 'every statement'.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Here are three late-life statements where the witnesses reaffirmed their testimony. I know critics point to the 'spiritual eyes' statements; I read those as describing how they saw, not denying it.",
        why: "Acknowledges the contrary evidence and explains how the author interprets it.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Past leaders taught that dark skin was a curse, so the church still teaches that today.",
        why: "Ignores the church's widely known official statement disavowing those teachings, which directly contradicts 'still teaches'.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "Leaders taught for over a century that the priesthood ban came from God. The recent official essay disavows the old explanations but never says the ban itself was a mistake, and I think that's not enough.",
        why: "Includes the contrary evidence (the disavowal) and argues it doesn't go far enough.",
      },
    ],
  },
  {
    id: "faulty_appeal_to_authority",
    name: "Faulty appeal to authority",
    definition:
      "Treating a claim as settled because an authority endorses it, when the authority lacks relevant expertise, is vague or anonymous, contradicts the relevant experts, or is used to shut down examination of a factual question.",
    conditions: [
      "The claim is supported mainly by citing a person's or institution's endorsement.",
      "At least one of the following holds: the claim is outside the authority's expertise; the authority is vague or unnamed ('experts say', 'scholars agree'); relevant experts substantially disagree; or the authority is used to forbid further examination of a factual claim.",
      "No independent evidence is offered for the claim.",
    ],
    criticalQuestions: [
      "Is the authority an expert in the field the claim belongs to (history, genetics, Egyptology, doctrine)?",
      "Is the claim about what the church teaches, where leaders and official texts are the authoritative source, or about a historical or scientific fact?",
      "Do other relevant experts agree? Is the cited statement quoted accurately and in context?",
      "Is the authority offered as the whole case or as one piece of evidence?",
    ],
    falsePositiveTraps: [
      "Citing leaders or the handbook to establish what official doctrine or policy is.",
      "Citing a real, sourced expert consensus in the relevant field.",
      "Citing a scholar as one piece of evidence among others.",
      "Personal deference stated as belief ('I trust the prophet') is an expression of belief; gate it out.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: "Appeal to Authority",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "An apostle said DNA evidence doesn't contradict the Book of Mormon, so the genetics question is settled.",
        why: "Cites a religious leader as settling a question in genetics, a field outside his expertise where the relevant experts disagree with him.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Whether coffee breaks the Word of Wisdom isn't really debatable. The handbook and current leaders define the standard, and they're the ones who set the temple recommend questions.",
        why: "The question is what church policy is, and church leaders are the authoritative source on that.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "A famous scientist said on a podcast that Mormonism is the dumbest religion, so it's obviously false.",
        why: "Fame in one field is treated as settling a broad question outside it, with no evidence given.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "Specialist archaeologists who aren't LDS, writing in published reviews, report no evidence of horses in the Americas during the Book of Mormon period. That expert consensus is a fair reason to doubt the historical claim.",
        why: "Appeals to a relevant, identifiable expert consensus on a factual question.",
      },
    ],
  },
  {
    id: "appeal_to_popularity",
    name: "Appeal to popularity",
    definition:
      "Arguing that a claim is true (or false) because many (or few) people believe or practice it.",
    conditions: [
      "A claim about truth or correctness is at issue, not a claim about popularity or trends themselves.",
      "The support is the number or proportion of people who believe or do something, or how fast that number is growing or shrinking.",
      "Popularity is offered as enough to establish truth.",
    ],
    criticalQuestions: [
      "Is the claim itself about numbers, trends or sociology (then numbers are the right evidence)?",
      "Are the 'many people' relevant experts? (Expert consensus is a different thing.)",
      "Is popularity offered as proof of truth, or as evidence of something else, like how common an experience is?",
    ],
    falsePositiveTraps: [
      "Discussing membership or activity statistics when the topic is growth or decline.",
      "'Many people report the same experience' used as evidence that the experience is common.",
      "Citing expert consensus (see faulty appeal to authority instead).",
    ],
    needsThreadContext: false,
    expectedReliability: "higher",
    mafaldaEquivalent: "Ad Populum",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Seventeen million members can't all be wrong.",
        why: "The number of members is offered as proof that the church's claims are true.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Membership in Africa grew faster than in the US over the last decade, so 'the church is collapsing' isn't true worldwide.",
        why: "The claim is about membership trends, so membership numbers are the right evidence.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Thousands of people leave every year. That's proof the church isn't true.",
        why: "The number of people leaving is offered as proof the church's claims are false.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "Retention surveys show most young adults my age stop attending. That's evidence the church has a retention problem, which is all I'm claiming.",
        why: "The claim is about retention, so data on who stays and who leaves is the right evidence.",
      },
    ],
  },
  {
    id: "appeal_to_consequences",
    name: "Appeal to consequences",
    definition:
      "Arguing that a factual claim is true or false because believing it would lead to good or bad outcomes.",
    conditions: [
      "A factual claim (something that is true or false) is at issue, not a decision, policy or moral question.",
      "The support is that accepting or rejecting the claim would lead to good or bad outcomes.",
      "Those outcomes are offered as evidence about whether the claim is true.",
    ],
    criticalQuestions: [
      "Is the question what is true, or what to do? Consequences are relevant to decisions and policies.",
      "Is there an unstated but explicit-enough premise ('a loving God would not command X') that makes this a substantive theological argument rather than wishful thinking?",
      "Are the consequences offered as practical reasons for a choice, or as proof of a fact?",
    ],
    falsePositiveTraps: [
      "Practical decisions ('I keep attending because it helps my kids') are not about truth.",
      "Policy arguments ('this policy harms LGBTQ youth, so it should change') are legitimately about consequences.",
      "'A good God would not do X; this teaching does X; so it is not from God' is a valid argument form with a debatable premise, not this fallacy (on either side).",
      "Expressions of hope or fear that are not offered as evidence.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "The Book of Mormon has to be historical. If it weren't, it would destroy my family's faith and everything we've built.",
        why: "A historical claim is defended by pointing to how bad it would be if it were false.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Even through my doubts I've decided to keep attending, because the community is good for my kids and that matters to us.",
        why: "A practical decision about what to do, where consequences are the right consideration.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "The church can't be true, because if it were, my gay best friend would be shut out of the highest heaven, and I refuse to live in a universe like that.",
        why: "A factual claim is rejected because its implications would be unbearable, not because of evidence.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "Several studies link teachings that call gay relationships sinful to higher suicide risk among LGBTQ youth, so the church should change how it teaches this.",
        why: "A policy argument, where harmful consequences are directly relevant.",
      },
    ],
  },
  {
    id: "false_dilemma",
    name: "False dilemma",
    definition:
      "Presenting two (or a few) options as the only possibilities when reasonable alternatives exist, and using that to force a conclusion.",
    conditions: [
      "The text presents a limited set of options (usually two) as the only ones.",
      "Reasonable alternatives exist that the text neither acknowledges nor rules out.",
      "A conclusion depends on eliminating one of the stated options.",
    ],
    criticalQuestions: [
      "Are there recognized middle positions (sincere but mistaken, inspired but not literal, nuanced or progressive belief)?",
      "Did the author argue that the options are exhaustive, or just assume it?",
      "Is the choice a genuine logical contradiction (P or not-P)?",
    ],
    falsePositiveTraps: [
      "A true contradiction ('the plates either physically existed or they didn't') is not a false dilemma.",
      "Personal framing ('for me it came down to staying or leaving') describes the author's experience and does not argue for a general conclusion.",
      "A rhetorical summary when the author acknowledges other options elsewhere in the text.",
    ],
    needsThreadContext: false,
    expectedReliability: "higher",
    mafaldaEquivalent: "False Dilemma",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Either Joseph Smith was a prophet of God or he was a deliberate fraud. He clearly wasn't a fraud, so he was a prophet.",
        why: "Ignores other possibilities, such as being sincere but mistaken.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "On the factual question there's no middle ground: either the plates physically existed or they didn't. I think the witness statements show they did.",
        why: "The two options really are exhaustive, and the author gives a reason for choosing one.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Either you accept everything the leaders say, or you're intellectually honest and leave. There's no third option.",
        why: "Rules out nuanced and progressive members, whose existence is well documented.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "Either the Book of Abraham is a translation of the papyri we have or it isn't. Egyptologists say it isn't, so defenders fall back on the missing-papyrus or catalyst theories, which I find weak because...",
        why: "A real either-or, and the author names the remaining alternatives and argues against them.",
      },
    ],
  },
  {
    id: "special_pleading",
    name: "Special pleading",
    definition:
      "Applying a standard to others while exempting one's own side from it, without a relevant reason for the exception.",
    conditions: [
      "A general standard, rule or test of evidence is applied to some case in the text or visible thread.",
      "A similar case (usually the author's own side) is exempted from that standard.",
      "No relevant difference that would justify the exemption is given, or the stated difference is invented for the occasion.",
    ],
    criticalQuestions: [
      "Is a relevant difference between the two cases actually stated?",
      "Does the author themselves apply the standard to the other case, or is the labeler supplying it?",
      "Would the stated reason for the exception also apply to the cases it is denied to?",
    ],
    falsePositiveTraps: [
      "Do not supply a standard the author never stated or applied.",
      "Cases that really do differ (different evidence, different claims) may be treated differently.",
      "Stating a doctrine that some rule doesn't apply to God is a theological claim. It becomes special pleading only when used to exempt one's own side from a standard of evidence applied to others.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "Other religions' founders who claimed angelic visits were obviously deluded; there's no evidence for any of it. But you can't apply evidence standards to Joseph Smith's visions. Spiritual things are known by the Spirit.",
        why: "Uses an evidence standard against other religions but exempts the author's own with no relevant difference.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "I hold everyone to the same standard: nobody's private spiritual experience can prove a historical claim to someone else, mine or a Muslim's. That's why I share my testimony as personal, not as proof.",
        why: "Applies one standard evenly.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "When members say the Spirit confirmed the church, that's just emotional manipulation. But the peace I felt after leaving proves I made the right choice.",
        why: "Rejects feelings as evidence for members but accepts them as evidence for the author.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "To be fair, the relief I felt after leaving doesn't prove the church is false, any more than a member's good feelings prove it true. My reasons are the historical ones.",
        why: "Applies the same standard to the author's own experience.",
      },
    ],
  },
  {
    id: "moving_the_goalposts",
    name: "Moving the goalposts",
    definition:
      "After a stated demand for evidence is met, raising the bar or switching to a different demand without acknowledging that the original one was met.",
    conditions: [
      "The author (or their side, earlier in the visible thread) stated a criterion or demand for evidence.",
      "That demand was met or directly addressed in the visible thread.",
      "The author then demands different or stronger evidence without acknowledging the original demand was met.",
      "The author gives no reason why the evidence offered is insufficient. Refining a criterion with a reason is legitimate.",
    ],
    criticalQuestions: [
      "Is the earlier criterion actually visible in the thread? If not, do not label.",
      "Did the author explain why the evidence offered falls short?",
      "Is the new demand a clarification of the original question or a new hurdle?",
    ],
    falsePositiveTraps: [
      "Never label from a single comment; this fallacy only exists across turns.",
      "Explaining why the evidence offered is weak, and saying so openly, is legitimate.",
      "Openly moving on to a different question after conceding the first one.",
    ],
    needsThreadContext: true,
    expectedReliability: "lower",
    mafaldaEquivalent: null,
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "(Earlier: 'Show me any church source admitting the seer stone was used.' After an official magazine article is linked:) Well, that's not an apostle speaking in General Conference, so it doesn't count.",
        why: "The original demand was 'any church source'. It was met, and a new bar is set without saying so.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "Fair enough, that 1970s article shows it wasn't hidden from people who went looking. What I'm asking now is a different question: whether ordinary members were taught it.",
        why: "Concedes the first point and openly moves on to a different question.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "(Earlier: 'Name one archaeological find that supports the Book of Mormon.' After someone cites an ancient inscription matching a place name:) That's in Arabia, not the Americas, and one name means nothing. Show me a whole city.",
        why: "The original challenge was 'one find'. When it was met, the demand was changed without admitting it had been met.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "I grant the inscription is a real match to a place name in the text. I still don't find it persuasive, because a single name match is weak next to the absence of evidence in the Americas, and I'd say the same about any single match.",
        why: "Admits the find meets the request and explains why the author still weighs it lightly.",
      },
    ],
  },
  {
    id: "circular_reasoning",
    name: "Circular reasoning",
    definition:
      "An argument whose premises assume the conclusion, so it can only persuade someone who already accepts it.",
    conditions: [
      "There is a conclusion and at least one premise offered in support.",
      "A premise restates the conclusion, or can only be accepted if the conclusion is already accepted.",
      "The argument is offered to persuade someone who does not already accept the conclusion.",
    ],
    criticalQuestions: [
      "Is this offered as an argument to persuade others, or is it a personal account of why the author believes (gate it out)?",
      "Does each premise have support that does not depend on the conclusion?",
    ],
    falsePositiveTraps: [
      "Testimony ('I know it's true because the Spirit told me') shared as a personal report is an expression of belief, not an argument.",
      "Belief systems that are internally consistent are not circular arguments unless they are offered as proof to outsiders.",
      "Defining a term is not arguing in a circle.",
    ],
    needsThreadContext: false,
    expectedReliability: "medium",
    mafaldaEquivalent: "Circular Reasoning",
    examples: [
      {
        side: "faithful",
        fallacious: true,
        text: "We know the prophet speaks for God because scripture tells us to follow the prophet, and we know that scripture is true because the prophet confirmed it.",
        why: "The prophet's authority is supported by scripture, whose authority is supported by the prophet, so the argument runs in a circle.",
      },
      {
        side: "faithful",
        fallacious: false,
        text: "I believe because of experiences I've had in prayer. I know that won't convince you, and I'm not offering it as proof.",
        why: "A personal account of belief, explicitly not offered as an argument to persuade others.",
      },
      {
        side: "critical",
        fallacious: true,
        text: "Any evidence apologists produce is worthless because they're biased, and we know they're biased because they keep producing evidence for the church.",
        why: "The evidence is assumed worthless in order to prove the bias, and the bias is then used to prove the evidence worthless.",
      },
      {
        side: "critical",
        fallacious: false,
        text: "I don't trust that apologist's paper because it misdates the 1835 manuscript, which you can check against the Joseph Smith Papers.",
        why: "The reason for distrust is independent and checkable.",
      },
    ],
  },
];

/**
 * Tie-breakers when more than one label seems to fit the same span.
 * Apply the most specific label only; never stack labels on one span.
 */
export const OVERLAP_RULES = [
  "Dismissing a whole source or group in advance -> poisoning_the_well; attacking the person who made a specific argument in reply -> ad_hominem.",
  "Deflecting by pointing to the critic's own faults -> tu_quoque, not ad_hominem.",
  "Redefining group membership to dodge a counterexample -> no_true_scotsman, not hasty_generalization.",
  "Exempting one's own side from a standard used on others -> special_pleading. If the exemption arises only after evidence was supplied in the thread -> moving_the_goalposts.",
  "Leaving out known contrary evidence -> cherry_picking; generalizing from too few cases -> hasty_generalization.",
  "Rejecting a claim because of where it came from -> genetic_fallacy; because of who is saying it now -> ad_hominem.",
] as const;

// ---------------------------------------------------------------------------
// Classifier output contract (one object per post or comment).
// ---------------------------------------------------------------------------

// Keys are snake_case because this is the JSON the model returns.
export type FallacyLabel = {
  type: FallacyId;
  /** Exact, verbatim substring of the item text. Labels whose span is not found are discarded. */
  span: string;
  /** 1-based indexes into the fallacy's conditions[]; must list ALL of them for the label to count. */
  conditions_met: number[];
  /** One or two sentences: which critical question decided it. */
  rationale: string;
  /** 0-1. Labels below LABEL_CONFIDENCE_FLOOR are discarded before aggregation. */
  confidence: number;
};

export type ClassifierOutput = {
  rubric_version: string;
  has_argument: boolean;
  /** Required when has_argument is false. */
  non_argument_type: NonArgumentType | null;
  /** Verbatim claim and support spans; required when has_argument is true. */
  claim_span: string | null;
  support_span: string | null;
  /** Empty when has_argument is false. At most MAX_LABELS_PER_ITEM entries. */
  fallacies: FallacyLabel[];
};

export const LABEL_CONFIDENCE_FLOOR = 0.7;
export const MAX_LABELS_PER_ITEM = 3;

export const fallacyById = (id: FallacyId) =>
  FALLACY_TAXONOMY.find((f) => f.id === id)!;
