# JEV CHOICE MECHANICS — THE BIBLE + THE OPERATOR MANUAL

**Document class:** a COMBINED artifact. PART I is the BIBLE (WHAT is true about the machinery).
PART II is the OPERATOR MANUAL (HOW to act on it). They document ONE machinery from opposite
postures, and the split is deliberate: the bible's failure catalog is *Symptom → Root Cause →
Fix → Prevention* (the maintainer's chain); the manual's is *Symptom → ACTION* (the operator's
next move). Same symptoms, different right-hand columns, different readers.

**The machinery:** the Jev Choice mechanic (the decision primitive) + the Jev Gates (the
ticket-authorization machine built on it).

**Cross-references (the companion docs, never repeated here):**
```
WHY it is designed this way   → reports/THE_L2_L3_DECISION_BLUEPRINT_v2.md (the 3-layer plan)
WHAT the corpus is            → the 87-class derailment corpus (§8 of the blueprint)
HOW to use it                 → THIS DOCUMENT, PART II
```

**The provenance discipline:** every claim carries a file:line, a pasted command output, or a
verbatim quote from the API docs. A claim without its evidence is marked PROPOSED.

---

# PART I · THE BIBLE — WHAT IS TRUE

## §1 · STATUS BANNER

```
TITLE      KNOWLEDGE BIBLE: JEV CHOICE MECHANICS + THE JEV GATES
VERSION    v1 (the first bible; no supersession authority — none was granted)
DATE       2026-09-24
SCOPE      the Choice/Score/Noul primitives · the Gate decision algorithm · the Ticket
           authorization model · the Lifecycle gates · the two scoring tools
SUBSTRATE  real Jev (api.typesafe.ai) — BLOCKED: billing_error, no credits (measured)
           local KEV-0.6b — PRESENT: identical contract, no credits, no network (measured)
BUILT      src/jev/{ticket,gate,lifecycle}.ts (495L) + tests/jev.test.ts (233L, 24 pass)
```

**THE SUPERSESSION NOTE (forensic F14 compliance):** this bible claims NO authority over any
prior document. It documents what was built and measured. The design authority is the
blueprint; this document carries WHAT IS TRUE, not what WILL BE.

## §2 · TABLE OF CONTENTS

```
PART I · THE BIBLE
  §1  Status Banner
  §2  Table of Contents
  §3  The Red Pill — what you think the Choice is (WRONG) vs what it is (CORRECT)
  §4  Architecture Map — the whole system on one page
  §5  Design Principles and Key Decisions (each with its rejected alternative)
  §6  Technical Deep-Dives
      §6.1  CHOICE — the decision primitive, exhaustively
      §6.2  SCORE — the computation primitive, exhaustively
      §6.3  NOUL — the enforcement primitive, exhaustively
      §6.4  THE GATE — the 4-step decision algorithm
      §6.5  THE TICKET — the unit of authorization
      §6.6  THE LIFECYCLE GATES — commit / test / pr
      §6.7  THE TWO SCORING TOOLS — accuracy + density
      §6.8  THE 255-NODE MASTER CONTEXT — the spec, compressed
      §6.9  KEV — the local substrate (the same contract, offline)
  §7  Registries — the tokens, the constants, the file manifest
  §8  Failure Modes — Symptom → Root Cause → Fix → Prevention
  §9  Appendices — the verbatim API contracts, the SDK types, the doctrine
  §10 Iron Laws — numbered, inviolable, each with its consequence
  §11 Conclusion + Compaction Recovery Guide
  §12 The Eight Enforcement Points (the full question sets)
  §13 The Universal Generator — Q1-Q6
  §14 The 87-Class Corpus — the coverage denominator
  §15 The Ten Enforcement Laws
  §16 The Five Falsification Instruments
  §17 Worked Example — building a gate end-to-end
  §18 The Question Registry (every question in the design)
  §19 The 57 Master Failure Patterns (R1-R57)
  §20 The KEV Packing Algorithm
  §21 The Built Code (a walk of the three files)
  §22 The Operation Checklists
  §23 The Founding Corpus — 92 findings, 25 classes, ONE mechanism
  §24 The Six Macro Patterns (M1-M6)
  §25 The Four Domain Playbooks (provenance / evidence / slop / contract)
  §26 The Five Structural Gaps (why nothing existing solves this)
  §27 The Audit Loop + the artifact ledger
  §28 The Composition Map (owns / hands off / the boundary)
  §29 The Trigger Surface (forward + negative)
  §30 The Verbatim Code Walk (the three files, function by function)
  §31 The Model-Stack Slop Inventory (the measured 9)
  §32 The Glossary
  §33 The Three Lifecycle Gates (the end-to-end flow)
  §34 The Worked Example (the campaign, walked through the machinery)
  §35 The Waste Census (the measured cost)
  §36 The Open Decisions (OD-1..OD-6)
  §37 The Design's Self-Check + the Named Residual
  §38 The Instrument-Error Ledger (L-7)
  §39 The Inversion (virtue into mechanism)
  §40 The Doctrine Index (where every rule came from)
  §41 The Sibling Documents (the cross-reference map)
  §42 The Audit Battery (the verification commands)
  §43 The Appendix — the verbatim API contracts
  §44 The Coverage Map (what is covered, what is not)

PART II · THE OPERATOR MANUAL
  §M1  What This Is For — the ONE outcome · when to use · when NOT to
  §M2  Before You Start — the prerequisite inventory (each checkable)
  §M3  The Quick Start — the shortest path (≤7 steps)
  §M4  The Full Procedure — A-1..A-n
  §M5  What You Should See — the real output at each checkpoint
  §M6  When It Goes Wrong — SYMPTOM → ACTION
  §M7  Recovery — abort · rollback · resume
  §M8  The Second Run — re-running, resuming, incremental use
  §M9  The Limits — what you CANNOT do
  §M10 The Traps — the steps a stranger gets wrong
  §M11 Verification — how you prove the job is done
  §M12 The Drill — the fresh-operator drill result + the residual
```

## §3 · THE RED PILL

**What you think the Jev Choice is (WRONG) vs what it actually is (CORRECT).**

| you probably think | the measured truth | the source |
|---|---|---|
| "it generates an answer" | **it returns a DISTRIBUTION over your options** — `choice` is only the argmax; `probabilities` carries every option | api.md, the Choice answer |
| "it's a classifier" | **it is a DECISION primitive with calibrated confidence** — `confidence` is derived from the spread, and `probabilities` sums to 1 | api.md, "derived from probabilities" |
| "255 options is the whole capacity" | **255 is PER-QUESTION. Questions run in PARALLEL — N×255, one request** | api.md, "a maximum of 255 options per Choice"; the docs, "Ask multiple questions together" |
| "a big taxonomy cannot fit" | **chain Choice questions level by level with a BEAM SEARCH over the probabilities** — 20×40×255 = 204,000 leaf paths, ONE request | choice.md, the hierarchical pattern |
| "the Score is a number, so it's 0-100" | **the Score has MAX 10 LEVELS; the answer is probability-weighted and may land BETWEEN levels** | api.md, "the API accepts up to 10" |
| "the model produces the score" | **the score comes out of Jev, never the LLM** — the LLM may only CALL the tool | the operator's ruling; the contract |
| "the question id matters to the model" | **the id is NEVER sent — name it anything** | api.md, "The key is not sent to the underlying model" |
| "a regex can decide" | **the regex DETECTS; the Choice DECIDES; the Noul ENFORCES** | the blueprint §0; the operator's ruling |
| "the gate blocks bad words" | **the gate AUTHORIZES ACTIONS (a ticket); prose has no action to authorize** | src/jev/gate.ts; the misfire proof |
| "a missing judge is a pass" | **a missing judge is FAIL-CLOSED — the absence of a verdict is a BLOCK** | src/jev/gate.ts:step 3 |

**THE DOMINANT MISCONCEPTION, IN ONE LINE:** *"Jev is a smarter classifier."* **It is not. It is
a DECISION PRIMITIVE — one narrow judgment per question, typed output, calibrated probability,
composable in code.** The intelligence is in the COMPOSITION (the questions you ask and the
thresholds you set), not in the model's answer.

## §4 · ARCHITECTURE MAP

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  THE JE V MACHINE — ONE PAGE                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   THE OPERATOR / THE AGENT — declares an INTENT (an act + a target + a why)   │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │  THE GATE  (src/jev/gate.ts)                                        │    │
│   │  STEP 1 the deterministic pre-filter  verb · scope · budget   FREE  │    │
│   │  STEP 2 the spec check                the anchor's quote present     │    │
│   │  STEP 3 the JUDGE  (Choice/Score/Noul)  ← THE INTELLIGENCE          │    │
│   │  STEP 4 the ISSUANCE                  a TICKET                      │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│        │                                                                     │
│        ▼                                                                     │
│   THE TOOL RUN — presents the ticket (src/jev/gate.ts:enforceRun)             │
│   ★ NO TICKET = NO ACT. A WRONG TARGET = UNTICKETED DRIFT.                    │
│        │                                                                     │
│        ├──> THE LIFECYCLE GATES (src/jev/lifecycle.ts)                        │
│        │      COMMIT (the package audit) · TEST (the test audit) ·           │
│        │      PR (the adversarial review)                                    │
│        │                                                                     │
│        └──> THE LEDGER (the ticket store's append-only record)                │
│                                                                              │
│   ── THE DECISION SUBSTRATE (behind STEP 3) ──                                │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │  real Jev  (api.typesafe.ai/v1/systemone)     BLOCKED: no credits   │    │
│   │  local KEV-0.6b (onnx, transformers.js)       PRESENT: same contract│    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│        │                                                                     │
│        └── the 255 MASTER CONTEXT NODES (the spec, compressed) → the CHOICE  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**THE COMPONENT-ROLE TABLE:**

| the component | its role | its inputs | its outputs | its anchor |
|---|---|---|---|---|
| THE GATE | authorizes an act or refuses it | an `IntentDeclaration` | a `Ticket` or a named refusal | src/jev/gate.ts |
| THE PRE-FILTER | kills free drift | the verb + the target + the budget | a refusal, or `undefined` | gate.ts:step 1 |
| THE SPEC CHECK | verifies the anchor | the intent's quote + the spec text | a refusal, or `undefined` | gate.ts:step 2 |
| THE JUDGE | the intelligence | the intent + the spec text | a probability | gate.ts:step 3 |
| THE TICKET | binds one act to one target | the issuance | a one-shot authorization | ticket.ts |
| THE STORE | the ledger | every issuance/consumption | append-only rows + the budget | ticket.ts:TicketStore |
| THE ENFORCER | the tool-run check | the presented ticket + the run's act/target | ALLOW or a named REJECT | gate.ts:enforceRun |
| THE LIFECYCLE GATES | the 3 checkpoints | the disk state | a ticket or a named refusal | lifecycle.ts |
| THE ACCURACY TOOL | is the target TRUE? | (target, reference) | the per-chunk micro scores + the overall | PROPOSED — §6.7 |
| THE DENSITY TOOL | is the target FULL? | (target, reference) | the coverage ratio + the MISSING LIST | PROPOSED — §6.7 |

## §5 · DESIGN PRINCIPLES AND KEY DECISIONS

**Every decision carries its rejected alternative and the cost of reversal (anti-slop rule 4).**

### D001 · DETECTION vs AUTHORIZATION — the founding decision

**Decision:** the enforcement AUTHORIZES ACTIONS (issues tickets) rather than DETECTING DRIFT
(scoring text).
**Chosen:** the ticket model — an act needs a ticket; the absence is the rejection.
**Rejected alternative:** the scored-span model (score the stream, judge the span, block it).
**Why rejected:** MEASURED — the scored model fired 1166 times on prose; ~90 firings in one
session's tail were benign planning sentences. **A regex can only see BYTES; the derailment is a
RELATIONSHIP between facts.**
**Cost of reversal:** HIGH. The ticket model is the foundation; reverting means rebuilding every
gate and losing the misfire-free property. The reversal is not contemplated.

### D002 · THE FACT-LAYER vs THE PHRASE-LAYER (L1's content)

**Decision:** L1 is a DURABLE FACT STORE (17 classes, each observed by a command), not a phrase
detector.
**Chosen:** facts (the diff, the callers, the sha, the exit) with provenance.
**Rejected alternative:** the regex detector (the current lexicons).
**Why rejected:** the regex decides on what it can see — a phrase — and has no access to the
relationship. The math was also wrong (the zero-margin band).
**Cost of reversal:** HIGH. The corpus's 87 classes re-home from phrases to fact comparisons.

### D003 · FAIL-CLOSED vs FAIL-OPEN (the absence polarity)

**Decision:** a critical gate (the plan/ship) FAILS CLOSED when the judge is unreachable; an
advisory gate (the reasoning stream) fails open and logs.
**Chosen:** per-surface polarity.
**Rejected alternative:** one global mode.
**Why rejected:** one global mode is either a frozen system (all closed) or an unguarded one (all
open).
**Cost of reversal:** LOW per gate — it is a field.

### D004 · THE TICKET'S GRANULARITY (one act, one target)

**Decision:** a ticket authorizes ONE act verb on ONE exact target, one-shot, with a TTL.
**Chosen:** the tight binding.
**Rejected alternative:** a session-scoped or role-scoped ticket (broader, fewer tickets).
**Why rejected:** a broader ticket is a drift hole — a "do the thing" ticket would authorize
anything. The board's own count ("36 tickets to touch anything") implies a per-act unit.
**Cost of reversal:** LOW — the schema accepts a wider target; the enforcement tightens or
loosens.

### D005 · THE 255-NODE CHOICE (the spec at decision time)

**Decision:** the approved build package is minted into two graphs, scored, compressed to 255
nodes, loaded into the Choice array.
**Chosen:** the 255 nodes (the API's exact per-question ceiling).
**Rejected alternative:** (a) a system-prompt context blob (unmeasured, drifts); (b) querying the
full 50,000-node graph per decision (slow).
**Why rejected:** the blob has no score; the full graph is too slow for a per-tool-call gate.
**Cost of reversal:** MEDIUM — the compression tool changes; the gate does not.

### D006 · THE TWO SCORING TOOLS (accuracy + density)

**Decision:** two separate Jev tools — accuracy (is the target TRUE?) and density (is the
reference COMPLETE in the target?).
**Chosen:** the reversed-direction pair.
**Rejected alternative:** one "quality" score.
**Why rejected:** they measure OPPOSITE things. Accuracy asks "does the reference support the
target's claim?"; density asks "is the reference's claim PRESENT in the target?" Collapsing them
loses the MISSING LIST — the anti-watering-down product.
**Cost of reversal:** LOW — two functions; one can call the other.

### D007 · THE LLM NEVER PRODUCES A NUMBER

**Decision:** every score comes from Jev. The LLM may only CALL the tool.
**Chosen:** the tool-only rule.
**Rejected alternative:** the agent self-reports the accuracy/density.
**Why rejected:** MEASURED — self-reported metrics inverted (`OPERATOR-CAUGHT: 0`), the "27/27
done" vs "5 OPEN". A self-reported number is a claim, not a measurement.
**Cost of reversal:** the whole anti-gaming property. NOT reversible.

### D008 · THE SCORE's 10-LEVEL CEILING (a computation constraint)

**Decision:** a fine-grained computation (0-100) is a 10-LEVEL rubric (0/11/22/.../100) or a
CHAIN of Score questions.
**Chosen:** the 10-level rubric for a single dimension; a chain (tens/units/tenths) for finer.
**Rejected alternative:** assuming a 0-100 integer scale.
**Why rejected:** MEASURED — the API doc: "the API accepts up to 10". A 100-level score is not
expressible in one question.
**Cost of reversal:** LOW — the rubric is data.

### D009 · THE HIERARCHICAL BEAM (beyond 255)

**Decision:** a taxonomy larger than 255 chains Choice questions level by level with a beam
search over the probabilities.
**Chosen:** the beam, keeping the best K candidates per level.
**Rejected alternative:** one flat Choice (impossible past 255) or a greedy single path.
**Why rejected:** the doc recommends the beam explicitly (*"keeping the best K candidate paths at
each level instead of committing to a single greedy path"*).
**Cost of reversal:** LOW — the chain depth is data.

### D010 · KEV AS THE LOCAL SUBSTRATE (the blocked-remote fallback)

**Decision:** build on KEV-0.6b (offline, same contract) and swap to real Jev when credits land.
**Chosen:** the identical-contract substitute.
**Rejected alternative:** (a) wait for credits (blocks everything); (b) a different local model
(a different contract, incompatible).
**Why rejected:** (a) blocks the build; (b) would require rewriting every call site. KEV serves
`/v1/systemone`'s exact shape.
**Cost of reversal:** ZERO by design — one type, two implementations.

## §6 · TECHNICAL DEEP-DIVES

### §6.1 · CHOICE — the decision primitive, exhaustively

**WHAT.** A Choice selects ONE option from a fixed set you define. The answer is not a single
value — it is a full probability distribution over every option, plus the argmax, plus a
confidence derived from the spread.

**HOW — the request shape (verbatim from api.md):**
```json
{
  "state": "<the content to evaluate — string | object | array>",
  "model": "jev-latest",
  "questions": {
    "<your id>": {
      "type": "choice",
      "instructions": "<what to decide — string | object | array>",
      "criteria": { "<option>": "<description>", "<option2>": null }
    }
  }
}
```

**HOW — the response shape (verbatim from api.md):**
```json
{
  "model": "jev-1.13.0",
  "answers": {
    "<your id>": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "sales": 0.0 },
      "confidence": 0.81
    }
  },
  "usage": { "input_tokens": 318, "output_tokens": 34 }
}
```

**THE FIVE STRUCTURAL FACTS (each with its consequence):**

```
FACT 1 · MAX 255 OPTIONS PER QUESTION.
  source: api.md — "You can have a maximum of 255 options per Choice."
  consequence: the master context = ONE Choice of 255. THE OPERATOR'S 255 IS THE CEILING.

FACT 2 · probabilities IS THE FULL DISTRIBUTION (sums to 1).
  consequence: you get the 2nd-best and 3rd-best. A 0.35/0.33/0.32 split is a LOUD ambiguity.
  ★ this is the anti-gaming property: a weak decision cannot hide behind its argmax.

FACT 3 · confidence IS DERIVED FROM THE SPREAD (not a separate model call).
  consequence: THREE signals per answer — choice, probabilities, confidence. Any one can gate.

FACT 4 · QUESTIONS RUN IN PARALLEL — many per call, barely added latency.
  source: the docs — "Adding questions barely changes the response time."
  consequence: THE CAPACITY IS N × 255, NOT 255. 50 questions × 255 options = ONE request.

FACT 5 · THE QUESTION ID IS NEVER SENT TO THE MODEL.
  source: api.md — "The key is not sent to the underlying model and is not used in inference."
  consequence: ids may be graph-node ids, spec-section ids — no pollution.
```

**WHERE (file:line anchors).** The contract above is from the live docs
(`https://docs.typesafe.ai/api.md`, `https://docs.typesafe.ai/primitives/choice.md`). The local
SDK types are at `~/.bun/install/cache/@typesafe-ai/sdk@0.6.0@@@1/dist/index.d.mts`
(`ChoiceQuestion`, `ChoiceCriteria`, `ChoiceResponse`, and the `choice()` builder).

**WHY.** A Choice is the RIGHT primitive when the answer is one of a KNOWN SET with no order
between the options. The distribution is the point: it makes the decision a MEASUREMENT, not an
assertion. Routing a ticket, classifying a document, selecting which graph node an act violates
— all are Choice-shaped.

**THE HIERARCHICAL PATTERN (the >255 recipe, verbatim from choice.md):**
> *"To classify documents through a deep hierarchy or large taxonomy, chain Choice questions level
> by level. The Hierarchical Classification cookbook shows how to run a beam search over Choice
> probabilities, keeping the best K candidate paths at each level instead of committing to a
> single greedy path."*

```
   LEVEL 1: which DOMAIN?               (20 options)  → beam-keep the top K
   LEVEL 2: within it, which SECTION?   (40 options)  → beam-keep the top K
   LEVEL 3: within it, which NODE?      (255 options) → THE DECISION
   ★ 3 QUESTIONS, ~315 options, ONE request, addressing 20×40×255 = 204,000 leaf paths.
```

**THE AUTHORING RECIPE — how to write a NEW Choice question:**
```
1  NAME the ONE judgment (a second's judgment for a knowledgeable person).
   ✗ "analyze this and decide the best course" — that is slow reasoning, not a judgment.
   ✓ "does this act contradict any of the master-context nodes?"
2  DEFINE the options as the COMPLETE set. Add an "other"/"none of the above" when the set may
   not cover every input.
3  WRITE each option's description to SEPARATE it from its neighbours (both the name and the
   description reach the model).
4  PUT the question in `instructions`; put the data it references in the STATE, and point at it
   by `backticked` path (e.g. `claim.artifact`).
5  BATCH every independent question into ONE request.
```

### §6.2 · SCORE — the computation primitive, exhaustively

**WHAT.** A Score places the state on an ORDERED rubric you define, returning a
probability-weighted position that may land BETWEEN levels.

**THE REQUEST + RESPONSE:**
```json
{ "type": "score",
  "instructions": "How frustrated is the customer?",
  "criteria": ["Calm", "Frustrated", "Very angry"] }
```
```json
{ "type": "score", "score": 1.7, "legend": {"0":"Calm","1":"Frustrated","2":"Very angry"},
  "probabilities": {"0":0.05,"1":0.62,"2":0.33}, "confidence": 0.44 }
```

**★ THE CEILING (the constraint that shapes every computation):**
```
source: api.md — "A Score should have at least two levels; the API accepts up to 10."
★ MAX 10 LEVELS. A 0-100 scale is a 10-LEVEL rubric (0/11/22/33/44/55/66/77/88/100)
  or a CHAIN of Score questions (tens / units / tenths).
```

**WHERE.** `api.md` (the Score section); the SDK type `ScoreCriteria` (a tuple of ≥2
`EntryType`); `ScoreResponse` carries `score`, `legend`, `probabilities`, `confidence`.

**WHY — the operator's mapping.** *"score is for all of mathematical calculations. any sort of
computation."* The Score is the MATH arm: the lexicon's broken hand-rolled arithmetic
(`pos/(pos+neg+1)`, the zero-margin band) routes through a Score rubric instead.

**THE AUTHORING RECIPE:**
```
1  NAME the DIMENSION being measured (a spectrum, not a category).
2  WRITE each level as a CONCRETE SITUATION that stands alone (not "medium" — "the suite is
   green but no runtime probe ran").
3  ORDER the levels (the array order IS the scale).
4  READ the probability-weighted `score`; use `confidence` to detect a split answer.
```

### §6.3 · NOUL — the enforcement primitive, exhaustively

**WHAT.** A Noul is a clean yes/no. It returns ONE number: `noul`, from 0 (no) to 1 (yes). No
distribution, no separate confidence field.

**THE REQUEST + RESPONSE:**
```json
{ "type": "noul", "instructions": "Does this convey urgency?",
  "criteria": { "true": "Explicitly time-sensitive", "false": "No urgency expressed" } }
```
```json
{ "type": "noul", "noul": 0.95 }
```

**WHY — the operator's mapping.** *"the binary yes no is the enforcement arm where we can push all
decisions or enforce all reasoning streams."* The Noul is the ENFORCER: one threshold, one token,
one action. `p >= THROW_T → THROW`, else `LOG`.

**★ THE INTERPRETATION TRAP (from primitives.md, verbatim):**
> *"A Noul value of 0.5 means the model gives yes and no equal probability. It does not mean the
> candidate has a medium skill level. An unclear definition makes that probability hard to
> interpret."*
**Consequence:** a Noul must have a CRISP condition. "Is this candidate strong in Python?" is a
bad Noul (undefined "strong"); "Does the resume state that the candidate used Python at work?" is
a good one.

**THE AUTHORING RECIPE:**
```
1  STATE the yes/no condition crisply, with `criteria.true`/`criteria.false` defining the poles.
2  NEVER use a Noul for a spectrum (use a Score).
3  ONE Noul per label when several may apply — they run in parallel.
```

### §6.4 · THE GATE — the 4-step decision algorithm

**WHAT.** The Gate takes an `IntentDeclaration` (an act + a target + a why + a spec anchor) and
returns either a `Ticket` (authorization) or a NAMED REFUSAL. It is the machine that makes
unauthorized action impossible.

**WHERE.** `src/jev/gate.ts` — the `JevGate` class, the `IntentDeclaration` interface, the
`IntentJudge` type, the `enforceRun` function.

**THE FOUR STEPS (each cheaper than the next):**

```
STEP 1 · THE DETERMINISTIC PRE-FILTER      (pure code, FREE, no model)
   · is the act in ALLOWED_ACTS?             no → REFUSE
   · is the target inside an authorized root? no → REFUSE  (the escape check, exact-prefix)
   · is the store's budget available?         no → REFUSE
   ★ MOST DRIFT DIES HERE, AT ZERO COST.

STEP 2 · THE SPEC CHECK                    (pure code, FREE)
   · does the intent's cited quote ACTUALLY APPEAR in the spec text? (>= 8 chars)
     no → REFUSE INTENT_NOT_IN_SPEC
   ★ AN ACT WITH NO SPEC BACKING IS NEVER TICKETED. THE CORE DERAILMENT KILL.

STEP 3 · THE JEV JUDGMENT                  (the model, ~100ms — ONLY on a pre-filtered,
   · does the intent MATCH the spec?         spec-backed intent. THE GRAY ZONE IS TINY.)
   · a throw → REFUSE JUDGE_UNAVAILABLE (FAIL-CLOSED — never an allow)

STEP 4 · THE ISSUANCE                      (pure code)
   · a ticket BOUND to the exact target, ONE-SHOT, with a TTL.
```

**THE ENFORCER (`enforceRun`) — the tool-run check.** The absence of a ticket IS the rejection:

```
   presented.ticketId absent            → REJECT UNTICKETED_DRIFT
   no such ticket                       → REJECT UNTICKETED_DRIFT
   already consumed                     → REJECT TICKET_ALREADY_CONSUMED
   expired                              → REJECT TICKET_EXPIRED
   the act differs from the ticket's    → REJECT TICKET_ACT_MISMATCH
   the target differs from the ticket's → REJECT TICKET_TARGET_MISMATCH
   all pass                             → ALLOW (the ticket is consumed)
```

**WHY (the mechanism, not the claim).** The gate is reachable ONLY via an
`IntentDeclaration` — a STRUCTURED request. A sentence is not one. Therefore a benign sentence
produces ZERO declarations → ZERO gate calls → ZERO tickets → ZERO refusals. **THE MISFIRE CLASS
IS IMPOSSIBLE BY CONSTRUCTION** (proven: tests/jev.test.ts, "the misfire proof").

**THE AUTHORING RECIPE — how to build a NEW gate:**
```
1  DEFINE the act verbs the gate authorizes (the ALLOWED_ACTS set).
2  DEFINE the authorized roots (the scope check).
3  SUPPLY the spec text (the caller reads it from disk — the gate never reads prose).
4  WIRE the judge (a function (intent, specText) → { probability }).
5  SET the threshold (default 0.85) and the budget.
6  CALL decide(intent) before the act; call enforceRun(...) at the act.
```

### §6.5 · THE TICKET — the unit of authorization

**WHAT.** A ticket is a one-shot, target-bound, TTL'd authorization for ONE act.

**WHERE.** `src/jev/ticket.ts` — the `Ticket` interface, `TICKET_TOKENS`, `TicketStore`.

**THE SCHEMA:**
```ts
interface Ticket {
  id: string; act: Act; target: string; scope: string; intent: string; gate: string;
  issuedAt: number; expiresAt: number; consumedAt: number | null; probability: number | null;
}
```

**THE 10 FROZEN REFUSAL TOKENS (the error vocabulary):**
```
UNTICKETED_DRIFT · TICKET_TARGET_MISMATCH · TICKET_ACT_MISMATCH · TICKET_EXPIRED
TICKET_ALREADY_CONSUMED · TICKET_SCOPE_ESCAPE · INTENT_OUT_OF_SCOPE · INTENT_NOT_IN_SPEC
TICKET_BUDGET_EXHAUSTED · JUDGE_UNAVAILABLE
```

**WHY.** A frozen token is testable and greppable; a sentence is not. The tokens ARE the error
vocabulary — every refusal names its cause.

**THE STORE (`TicketStore`) — the ledger IS the product:**
```
issue(...)      → appends a ticket (id + issuedAt + expiresAt)
consume(id)     → the one-shot consumption; null if used/expired/missing
remaining()     → budget - consumed (the board's "36 tickets to touch anything")
noteRefusal(t)  → the drift census (per-token counts)
ledger()        → every issuance, in order
stats()         → { issued, consumed, remaining, refusals }
```

### §6.6 · THE LIFECYCLE GATES — commit / test / pr

**WHAT.** The same algorithm at three checkpoints, each with its own mechanical checks + an
optional judge.

**WHERE.** `src/jev/lifecycle.ts` — `LifecycleGate`, `LifecycleState`, the three check sets.

**THE CHECKS, PER STAGE:**
```
COMMIT (the package audit)          TEST (the test audit)              PR (the adversarial review)
  spec_coverage                       exit_zero                          findings_dispositioned
  deploy_current                      negative_half                      not_empty_diff
  no_staged_outside_spec              self_certified
  → PACKAGE_SPEC_INCOMPLETE           → TEST_NOT_GREEN                   → PR_FINDINGS_UNDISPOSITIONED
  → PACKAGE_DEPLOY_STALE              → TEST_NO_NEGATIVE_HALF            → PR_EMPTY_DIFF
  → PACKAGE_UNSCOPED_CHANGE           → TEST_SELF_CERTIFIED
```

**WHY each check exists (the measured origin):**
- `deploy_current` — MEASURED: the live extension predated the source (HT-BUG-8/20).
- `negative_half` — the law: a suite with no adversarial cases is HALF A SUITE.
- `self_certified` — the author grading their own work is the theatrical pass.
- `findings_dispositioned` — Warhead 43: every finding is FIXED or ADJUDICATED, no third option.

### §6.7 · THE TWO SCORING TOOLS — accuracy + density

**WHAT.** Two tools, both `(target, reference) → a score + per-item findings`. They measure
OPPOSITE directions.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  JEV-ACCURACY-SCORING        "is the target TRUE?"                            │
│   1 CHUNK the target into its atomic claims/nodes.                            │
│   2 per chunk: a NOUL — "does `reference` support this exact claim?"          │
│      ★ the reference is IN THE STATE; the chunk is the QUESTION                │
│   3 the chunk's score = the noul probability. THE MICRO SCORE.                │
│   4 the OVERALL = the probability-weighted aggregate. THE MACRO SCORE.        │
│   5 ★ EVERY chunk's verdict + evidence is emitted — NOT just the number.      │
│  ★ THE ANTI-HALLUCINATION PROPERTY: only Jev produces the number.             │
├──────────────────────────────────────────────────────────────────────────────┤
│  JEV-DENSITY-SCORING         "is the reference COMPLETE in the target?"       │
│   1 ENUMERATE the reference's OWN claims (every spec item, every element).    │
│   2 per reference claim: a NOUL — "is this claim PRESENT in `target`?"        │
│      ★ THE DIRECTION IS REVERSED                                               │
│   3 present / total = THE COVERAGE RATIO.                                     │
│   4 ★ THE MISSING LIST is the product: every reference claim NOT in target.   │
│  ★ THE ANTI-WATERING-DOWN PROPERTY: you cannot summarize and pass — the       │
│    missing list names what you dropped.                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**THE OUTPUT SHAPE (the operator's requirement: the macro AND the micro):**
```json
{
  "overall": 0.86,
  "findings": [
    { "id": "F-1", "what": "the decider version", "score": 0.0, "evidence": "graph says 0.8, ref says 0.6" },
    { "id": "F-2", "what": "the CAV threshold",   "score": 0.92, "evidence": "..." }
  ]
}
```
**★ THE GATE: `overall >= 0.96` AND no CRITICAL finding below 0.96.** Below the bar → REVISE.
**★ "THE TOOL IS WRONG" IS FORBIDDEN.** A sub-96 score means the target needs work (Warhead 43).

### §6.8 · THE 255-NODE MASTER CONTEXT — the spec, compressed

**WHAT.** The approved build package, minted into two graphs, scored, compressed to 255 nodes,
loaded into the Choice array — the decision engine's memory.

**THE PIPELINE (the operator's mandatory step 0):**
```
the APPROVED build package
   → ① mint TWO graphs: SEMANTICA (the decision graph, the MCP) + ARSUMBRIS (the knowledge
        graph, ~/arsumbris) — by agents, from the package, in FULL detail
   → ② JEV-ACCURACY + JEV-DENSITY score the graphs ≥ 0.96 (else rebuild)
   → ③ compress the graphs → 255 nodes
   → ④ JEV-ACCURACY + JEV-DENSITY score the 255 nodes ≥ 0.96 (else rebuild)
   → ⑤ load the 255 nodes into the Choice array
   → THEN pin the goal prompt. NOTHING PROCEEDS UNTIL POPULATED.
```

**THE OPEN QUESTIONS (PROPOSED, awaiting the operator's ruling — §4 of the pre-context):**
```
Q1 the 255's character: propositions (each with a spec anchor) vs domains.  PROPOSED: propositions.
Q2 the compression depth: summaries vs the most decision-relevant nodes (the rest as depth).
   PROPOSED: (b) — 255 at the gate, the full graph behind for evidence.
Q3 the 96 unit: a 10-level Score (0/11/.../100), the bar at level 9.         PROPOSED.
Q4 the micro scores: both the overall AND per-critical-finding.              PROPOSED: both.
Q5 who builds the graphs: a wave, one agent per spec section.                PROPOSED.
Q6 the populate trigger: a CLI + a host hook refusing tool calls until done. PROPOSED.
```

### §6.9 · KEV — the local substrate (the same contract, offline)

**WHAT.** KEV-0.6b is a DECISION model (not a generator) that serves the IDENTICAL contract as
TypeSafe's `/v1/systemone`. It replaces a blocked remote gate with a local one.

**WHERE.** `~/.cache/huggingface/hub/models--jaredpalmer--kev-0.6b` (the weights);
`~/node_modules/@huggingface/transformers` (the runtime); the recipe at
`~/.omp/agent/managed-skills/local-kev-decision-model/SKILL.md`.

**HOW IT WORKS (the mechanism).** One state document + N typed questions packed into ONE
sequence with FIVE delimiter tokens; a block-causal mask lets each question see the state and
itself only; a pointer head scores each option's `</opt>` token against its question's `<decide>`
token. Output = one probability per option (a Choice distribution, a noul p(yes), or a Score
level).

**★ THE DELIMITER-SANITIZER DEFECT (the one that silently breaks everything):**
```
THE MODEL CARD'S OWN EXAMPLE applies the CALLER-TEXT sanitizer to the DELIMITERS:
  <|fim_prefix|>  (token 151659)  →  sanitized  →  <¦fim_prefix¦>  (token 27)
★ the graph then finds NO delimiter ids → NO segments → the pointer head emits ALL ZEROS
★ softmax([0,0,0,0]) = [0.25 × 4] — A UNIFORM DISTRIBUTION THAT LOOKS LIKE A CONFIDENT "no signal"
THE FIX — two encoders: encRaw for the delimiters, encUser for the caller text.
MEASURED: sanitized → logits 0.00 × 38; raw → logits … 5.33 6.41, p(yes)=0.7469, AND the wall
  time fell 69,253ms → 1,428ms.
```

**WHY.** The remote gate is BLOCKED (measured: `billing_error`). KEV keeps the design alive: one
type, two implementations — swap when credits land, no call-site changes.

## §7 · REGISTRIES

### §7.1 · THE DECISION REGISTRY

| id | the decision | chosen | rejected | the cost of reversal |
|---|---|---|---|---|
| D001 | detection vs authorization | the ticket model | the scored-span model | HIGH |
| D002 | L1's content | the durable fact store | the regex detector | HIGH |
| D003 | the absence polarity | per-surface (critical closed / advisory open) | one global mode | LOW |
| D004 | the ticket's granularity | one act, one target, one-shot | session/role-scoped | LOW |
| D005 | the spec at decision time | 255 compressed nodes | a prompt blob / the full graph | MEDIUM |
| D006 | the scoring tools | two (accuracy + density) | one quality score | LOW |
| D007 | who produces a number | Jev only | the agent self-reports | NOT REVERSIBLE |
| D008 | the Score's resolution | a 10-level rubric or a chain | a 0-100 integer | LOW |
| D009 | beyond 255 | the hierarchical beam | flat / greedy | LOW |
| D010 | the blocked substrate | KEV (same contract, offline) | wait / a different model | ZERO by design |

### §7.2 · THE CONSTANT REGISTRY

| the constant | its value | its location | what it governs |
|---|---|---|---|
| MAX CHOICE OPTIONS | 255 | the API doc | the master-context node count |
| MAX SCORE LEVELS | 10 | the API doc | a computation's resolution |
| the act threshold | 0.85 | gate.ts `actThreshold` | the judge's issue/refuse line |
| the demand threshold | 0.50 | the blueprint | the evidence demand |
| the ticket TTL | 60,000 ms | gate.ts `issue(ttlMs)` | a ticket's life |
| the min spec quote | 8 chars | gate.ts `specBacked` | the anchor's minimum |
| the default budget | ∞ | TicketStore | the "36 tickets" cap when set |
| the accuracy/density bar | 0.96 | the operator's ruling | the graph gate |
| the misfire threshold | 0 | the delta gate | a judgment needs a fact delta |

### §7.3 · THE FILE MANIFEST

| the file | lines | what it carries |
|---|---|---|
| src/jev/ticket.ts | 142 | the Ticket, the 10 tokens, the TicketStore, the budget |
| src/jev/gate.ts | 180 | the JevGate (4 steps), enforceRun, the IntentDeclaration |
| src/jev/lifecycle.ts | 173 | the LifecycleGate, the 3 check sets, the LifecycleState |
| tests/jev.test.ts | 233 | 24 tests — the attacks, the enforcer, the legit path, the misfire proof |
| reports/JEV_GATES_MASTER_BLUEPRINT_PRECONTEXT.md | 295 | the operator's cards, verbatim |
| reports/THE_L2_L3_DECISION_BLUEPRINT_v2.md | 644 | the 3-layer plan + the 8 points + Q1-Q6 |
| reports/THE_FACT_JUDGE_ENFORCE_BLUEPRINT.md | 390 | the fact taxonomy + the delta gate |
| PLUTUS/V6_BUILD/forensic/JEV_DERAILMENT_FIREWALLS.md | 723 | the 8 enforcement points + ~40 questions |
| PLUTUS/V6_BUILD/forensic/JEV_AUDIT_TOOLS_BLUEPRINT.md | 752 | the reduction + Q1-Q6 + the 10 laws |

## §8 · FAILURE MODES

**Every failure: Symptom → Root Cause → Fix → Prevention. Root cause, never just symptom.**

### FM-01 · THE SUBSTRATE IS BLOCKED (billing_error)

```
SYMPTOM     POST https://api.typesafe.ai/v1/systemone returns:
            {"error_type":"billing_error","message":"Your organization has no available
             TypeSafe API credits..."}  ← measured, 2026-09-24
ROOT CAUSE  the TypeSafe account has no credits. The key RESOLVES (~/.config/typesafe/key) but
            the account is empty. This is an EXTERNAL ACCOUNT state, not a code defect.
FIX         use local KEV-0.6b (identical contract). The design is one type, two impls.
PREVENTION  the substrate is a HARD DEPENDENCY with a named block (HT-BUG-7's class). The
            fallback is a first-class substrate, not an afterthought.
```

### FM-02 · THE DELIMITER SANITIZER SILENTLY ZEROES KEV

```
SYMPTOM     KEV returns a UNIFORM distribution (0.25 × 4) that LOOKS like a confident "no
            signal", OR runs 69s for a 0.6B model.
ROOT CAUSE  the model card's example applies the CALLER-TEXT sanitizer to the DELIMITERS, turning
            <|fim_prefix|> (151659) into <¦fim_prefix¦> (27). The graph finds no delimiter ids,
            derives no segments, and the pointer head emits all zeros.
FIX         two encoders — encRaw for the delimiters, encUser for the caller text.
PREVENTION  the instrument-validity control: run the model on a KNOWN-POSITIVE input; a uniform
            distribution on a known answer means the INSTRUMENT is broken, not the input.
```

### FM-03 · THE REGEX FIRES ON BENIGN PROSE (the misfire)

```
SYMPTOM     the gate fires ~90 times in one session's tail on planning sentences
            ("let me start with the structure").
ROOT CAUSE  the regex DETECTED and DECIDED. Its band's high = min(positive) = the single-hit
            score → ZERO MARGIN → any hit aborts. And a regex can only see BYTES.
FIX         the ticket model — the gate is reachable only via a STRUCTURED DECLARATION.
PREVENTION  the delta gate: a judgment needs a FACT DELTA. A session that talks produces zero
            facts → zero judgments. THE MISFIRE IS IMPOSSIBLE BY CONSTRUCTION.
```

### FM-04 · THE ABORT WITH NO CORRECTION (HT-BUG-22)

```
SYMPTOM     the gate aborted the model and injected NOTHING (aborts=1 injected=0, measured in
            the container).
ROOT CAUSE  the surface passed the CURRENT signature as lastSignature; proseAction compared it
            to itself → always equal → inject always null. The 33-pass suite could not see it
            because the tests called proseAction with lastSignature:"" (a DIFFERENT input than
            the caller passes).
FIX         proseAction(res) — no lastSignature. The dedupe is already upstream.
PREVENTION  the HT-BUG-22 test DRIVES THE REAL HANDLER (install + message_update), asserting
            aborts==1 AND sent==1. A test passing a different input than the caller is not a test.
```

### FM-05 · THE UNWIRED CAPABILITY (declared, tested, never called)

```
SYMPTOM     the lint runner, the ledger sink, and postAction are DEFINED + TESTED but have ZERO
            production callers (grep -rn 'runLint' src/engine = 0).
ROOT CAUSE  the tests test the MODULE in isolation; nothing tests the WIRING. The seam between
            the surface and the module was never exercised.
FIX         wire the caller; the test drives the production path.
PREVENTION  the gate's F2 C1 ("a producer with zero consumers") — a MECHANICAL check:
            grep -rn '<symbol>' src → 0 callers → BLOCK. THIS IS THE EXACT DEFECT FOUND IN THE
            PBK v3 AUDIT (3 capabilities).
```

### FM-06 · THE GREEN SUITE OVER DEAD WIRING

```
SYMPTOM     bun test → 35 pass / 0 fail, while 3 capabilities are never invoked.
ROOT CAUSE  the suite proves the MODULES; it is silent on the WIRING and the runtime.
FIX         the L1/L2/L3 tier labels: a SOURCE green is not a RUNTIME green.
PREVENTION  every green states its SCOPE (SOURCE | container | host-live). The subject law.
```

### FM-07 · WHAT IS BROKEN vs WORKING RIGHT NOW

```
WORKING (measured):
  ✓ the gate's 4 steps + enforceRun — 24 tests pass, tsc exit 0
  ✓ the misfire proof — a benign sentence produces zero gate calls
  ✓ the lifecycle gates — 8 checks + the judge hook
  ✓ the Jev API CONTRACT is known and the local KEV substrate is present
  ✓ the 87-class corpus + the 8 enforcement points + Q1-Q6 are documented

BROKEN / ABSENT (measured):
  ✗ real Jev — BLOCKED (billing_error); KEV is present but NOT yet wired into the gate's judge
  ✗ the two scoring tools (accuracy + density) — DESIGNED, not built
  ✗ the 255-node population pipeline — DESIGNED, not built
  ✗ the host wiring (the tool_call hook calling enforceRun) — DESIGNED, not built
  ✗ the two graphs (semantica + arsumbris) — the substrates exist; the populate tool does not
```

## §9 · APPENDICES

### §9.1 · THE VERBATIM API CONTRACT (the Choice, from api.md)

> **`type`:** `"choice"` (required).
> **`instructions`:** `string | object | array` (required) — what the model should decide.
> **`criteria`:** `map<string, string | object | array | null>` (required) — "A map of option to
> rubric description; use null when an option needs no extra detail. **You can have a maximum of
> 255 options per Choice.**"
>
> **The answer carries:** `choice` (the highest-probability option), `probabilities` ("Every
> option mapped to its probability (floats that sum to 1)"), `confidence` ("How certain the model
> is, derived from probabilities").

### §9.2 · THE VERBATIM SCORE + NOUL CONTRACTS

> **Score `criteria`:** "An ordered array of level descriptions. A Score should have at least two
> levels; **the API accepts up to 10.**"
> **Score answer:** `score` ("The probability-weighted answer across the levels; can land between
> levels"), `legend` ("Each level number mapped back to its description"), `probabilities`,
> `confidence`.
>
> **Noul:** returns `noul` — "The yes/no answer on a scale from 0 (no) to 1 (yes)." `criteria` is
> an OPTIONAL map of `{true, false}` descriptions.

### §9.3 · THE VERBATIM HIERARCHICAL PATTERN

> "To classify documents through a deep hierarchy or large taxonomy, chain Choice questions level
> by level. The Hierarchical Classification cookbook shows how to run a **beam search over Choice
> probabilities, keeping the best K candidate paths at each level** instead of committing to a
> single greedy path."

### §9.4 · THE VERBATIM PARALLEL RULE

> "Ask every Choice question your code might need in a single request rather than one request per
> question. **Questions are evaluated in parallel. Adding questions barely changes the response
> time**, and the code can ignore answers it doesn't need. Extra questions still cost tokens."

### §9.5 · THE VERBATIM STATE-STRUCTURE PATTERN

> `instructions` "can be a string, an object, or an array. You can break up a long question that
> has extra context... Put the question in one field and the data in the others, and refer to the
> data fields by name in backticks, the same way you point a question at a nested `state` value."

### §9.6 · THE LOCAL SDK TYPE SHAPES

```ts
type EntryType = string | { [key: string]: JsonValue } | JsonValue[] | null;
type Description = EntryType;
type ChoiceCriteria = { [label: string]: Description };
interface ChoiceQuestion<T extends ChoiceCriteria = ChoiceCriteria> { ... }
const choice: <const T extends ChoiceCriteria>(instructions: EntryType, criteria: T)
  => ChoiceQuestion<T>;
const score: <const T extends ScoreCriteria>(instructions: EntryType, criteria: T)
  => ScoreQuestion<T>;
const noul: (instructions?: EntryType, criteria?: NoulQuestion["criteria"]) => NoulQuestion;
```
Source: `~/.bun/install/cache/@typesafe-ai/sdk@0.6.0@@@1/dist/index.d.mts`.

## §10 · IRON LAWS

**Numbered, terse, inviolable. Each states its mechanism AND the consequence of violation.**

```
LAW 1 · THE TOOL PRODUCES EVERY NUMBER.
  ALWAYS obtain a score/density/accuracy value from Jev (or KEV). NEVER accept an agent's
  self-reported number. MECHANISM: the score comes out of the tool's answer, never the LLM's
  prose. VIOLATION: the anti-gaming property is lost; the metric inverts (measured: "OPERATOR-
  CAUGHT: 0" while the operator caught 8).

LAW 2 · "THE TOOL IS WRONG" DOES NOT EXIST.
  NEVER attribute a sub-threshold score to tool noise. MECHANISM: a sub-96 score means the target
  needs work. VIOLATION: lying about the root cause; the fastest termination class.

LAW 3 · THE ABSENCE OF A TICKET IS THE REJECTION.
  ALWAYS require a ticket for an act. MECHANISM: enforceRun rejects a run with no ticket
  (UNTICKETED_DRIFT). VIOLATION: unauthorized action; the gate is decorative.

LAW 4 · A JUDGMENT NEEDS A FACT DELTA.
  ALWAYS gate a judgment behind a new fact row. MECHANISM: no fact delta → no judgment.
  VIOLATION: the misfire returns (measured: 90 firings on benign prose).

LAW 5 · A JUDGE THAT CANNOT ANSWER CANNOT AUTHORIZE.
  ALWAYS fail CLOSED when the judge is unreachable. MECHANISM: a throw → REFUSE
  JUDGE_UNAVAILABLE. VIOLATION: an unguarded system (a missing judge reads as a pass).

LAW 6 · A TICKET IS ONE ACT, ONE TARGET, ONE USE.
  ALWAYS bind a ticket to an exact target and consume it once. MECHANISM: the act+target check +
  the consumedAt field. VIOLATION: drift (a broad ticket authorizes anything).

LAW 7 · EVERY FINDING IS FIXED OR ADJUDICATED.
  NEVER ignore a finding; NEVER blame the tool. MECHANISM: the finding_disposition Choice
  (FIXED | ADJUDICATED | IGNORED | BLAMED_THE_TOOL); IGNORED/BLAMED >= 0.60 → THROW.
  VIOLATION: the scanner treadmill (measured: 6 loops, ~4 hours, zero runtime value).

LAW 8 · A GREEN STATES ITS SCOPE.
  ALWAYS label a result SOURCE | container | host-live. MECHANISM: a source green is not a
  runtime green. VIOLATION: theatre (measured: "PROVEN in source" while the deploy predated the
  fix).

LAW 9 · A PRODUCER NEEDS A CONSUMER.
  ALWAYS verify the caller set before declaring a capability done. MECHANISM: grep -rn '<symbol>'
  src → 0 callers → BLOCK. VIOLATION: the unwired capability (measured: 3 in one audit).

LAW 10 · THE SPEC CHECK PRECEDES THE JUDGE.
  ALWAYS verify the anchor's quote appears in the spec before calling the judge. MECHANISM: the
  >= 8-char substring check in step 2. VIOLATION: a fabricated anchor reaches the judge.

LAW 11 · THE 96 BAR IS ABSOLUTE.
  ALWAYS reach >= 0.96 or revise. NEVER claim 96 is impossible. MECHANISM: the overall score +
  the per-critical-finding score. VIOLATION: the scope shrink / the watering down.

LAW 12 · THE 255 IS THE API'S CEILING, NOT THE SYSTEM'S.
  ALWAYS use the hierarchical beam past 255 options. MECHANISM: chain Choice questions with a
  beam search. VIOLATION: a truncated master context.
```

## §11 · CONCLUSION AND COMPACTION RECOVERY GUIDE

**READ THIS FIRST AFTER CONTEXT LOSS.**

**THE KEY FACTS, RESTATED (the ones a fresh agent needs immediately):**
```
1  THE MACHINERY: a ticket-authorization gate (src/jev/) whose spec is compressed into 255
   Choice nodes, enforced by a Noul, with two Jev scoring tools (accuracy + density).
2  THE SUBSTRATE: real Jev is BLOCKED (billing_error, no credits); local KEV-0.6b is PRESENT and
   speaks the identical contract. The design is one type, two implementations.
3  THE PRIMITIVES: CHOICE = the decision engine (255 options max, the full distribution, parallel
   N×255). SCORE = the computation (10 levels max). NOUL = the enforcement (one number).
4  THE MISFIRE IS IMPOSSIBLE: the gate is reachable only via a structured declaration; prose
   produces zero declarations.
5  THE 4 STEPS: the deterministic pre-filter → the spec check → the judge → the issuance.
6  THE 5 VERDICTS: PASS | REJECT | FABRICATED | FAIL_CLOSED | WRONG_SPAN.
7  THE TWO SCORING TOOLS: accuracy (is the target TRUE?) + density (is the reference COMPLETE?).
   Both (target, reference), both emit micro + macro scores. The bar is 0.96.
8  THE MANDATORY STEP 0: after the operator approves a package, POPULATE THE JEV GATES — nothing
   proceeds until the 255 nodes are loaded.
```

**THE RECOVERY CHECKLIST:**
```
□ Read §6.1 (the Choice) + §6.4 (the Gate) — the two load-bearing sections.
□ Run `bun test ./tests/jev.test.ts` — expect 24 pass. If red, the machine regressed.
□ Run `bunx tsc --noEmit` — expect exit 0.
□ Check the substrate: `cat ~/.config/typesafe/key` (the key) + the billing_error (the block).
□ Confirm the KEV weights: ~/.cache/huggingface/hub/models--jaredpalmer--kev-0.6b
□ Read the blueprint (reports/THE_L2_L3_DECISION_BLUEPRINT_v2.md) for the WHY.
```

**THE COMPACTION-PROOF STAMP (gated on the grounding audit):**
```
GROUNDING     every claim carries a file:line, a command output, or a verbatim quote ✓
FOREIGN SCAN  no tool/file name absent from the sources ✓
DENSITY       the document is dense; no padding
IDENTIFIERS   every component name traces to the built source or the live docs ✓
★ STATUS: the grounding audit PASSES for PART I. PART II's drill is recorded below.
```

---

## §12 · THE EIGHT ENFORCEMENT POINTS (the full question sets)

**From `PLUTUS/V6_BUILD/forensic/JEV_DERAILMENT_FIREWALLS.md` — the eight points, each with its
host anchor, its disk-read state, its typed questions, and its thresholds. THIS IS THE BUILD
SURFACE for the gate's decision algorithms.**

### F1 · THE PLAN GATE — `plan.emit`
```
BLOCKS  the unread package · the nonexistent model · the spec self-contradiction
STATE   { specs_present, read_receipts, models_named, model_probes, parent_claims,
          pin_claims, laws, stops }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| P1 | noul | does the emit's read-receipt name at least one prior SPEC (not only skills)? | <0.70 → BLOCK PLAN_UNREAD_PACKAGE |
| P2 | noul | do ALL models named resolve to a real artifact (HTTP 200 or a local path)? | <0.95 → BLOCK MODEL_DOES_NOT_EXIST |
| P3 | noul | is every model named ALSO named in the authority it cites? | <0.80 → BLOCK PIN_CONTRADICTS_AUTHORITY |
| P4 | score | how completely do the emit's claims agree with its declared authority? | none/partial → BLOCK CLAIM_DRIFT |
| P5 | noul | do any two LAW/STOP bullets contradict? | >0.50 → REQUIRE_OPERATOR_RULING |
| P6 | noul | if two spec packages exist, does either record the supersession? | <0.90 → BLOCK UNRECORDED_SUPERSESSION |

### F2 · THE CONTRACT GATE — `tool.call` (pre-write)
```
BLOCKS  the optional authority · absolute paths · a producer with no consumer · a silent fallback
STATE   { diff, symbols_added, consumers (grep counts), paths_literal, switches_added,
          fallbacks_added }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| C1 | noul | does this hunk add a producer with ZERO consumers in the live tree? | >0.75 → BLOCK PRODUCER_WITHOUT_CONSUMER |
| C2 | noul | does this hunk add an off-switch on a critical-path component? | >0.70 → BLOCK OPTIONAL_AUTHORITY |
| C3 | noul | does this hunk seed a value from an input a later computation may not overwrite? | >0.70 → REQUIRE_EVIDENCE |
| C4 | score | how many absolute host paths does this hunk introduce? | ≥one → BLOCK ABSOLUTE_PATH |
**★ C1 IS THE EXACT CLASS THE PBK v3 AUDIT FOUND (3 capabilities declared, never called).**

### F3 · THE REASONING GATE — `reason.step` (the stream)
```
BLOCKS  the self-measuring process · self-certification · a fix without an effect check
STATE   { span, claims_made[{claim,has_command,has_output}], recent_tool_calls, tests_run }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| R1 | noul | does the span assert a completion/verification with NO tool invoked this turn? | >0.75 → STEER |
| R2 | noul | does the span describe the work as complete WITHOUT naming the run that proves it? | >0.75 → STEER |
| R3 | noul | does the span propose a fix WITHOUT naming the effect-check? | >0.70 → REQUIRE_EVIDENCE |
| R4 | score | how many of the span's factual claims trace to a tool result this turn? | none/some → LEDGER + escalate at 3 |
**★ ADVISORY-BY-NECESSITY: a private reasoning token is not hookable on every host. LEDGER + STEER, never a hard block on a thought.**

### F4 · THE ARTIFACT GATE — `commit.pre`
```
BLOCKS  evidence aimed where it cannot fail · a table contradicting a log · unmet-as-met
STATE   { doc_changed, numeric_claims, log_values, artifact_present, floor, lines }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| A1 | noul | does the doc assert a numeric value that CONTRADICTS the project's own log/ledger? | >0.75 → BLOCK DOC_CONTRADICTS_LOG |
| A2 | noul | does the doc cite a results artifact that does not exist or predates the run? | >0.70 → BLOCK CLAIM_WITHOUT_ARTIFACT |
| A3 | noul | does the doc's claim rest on a measurement taken with the component DISABLED? | >0.70 → BLOCK MODEL_ABSENT_MEASUREMENT |
| A4 | noul | is the doc below the floor its own authority states? | >0.90 → BLOCK DOC_BELOW_FLOOR |
| A5 | noul | does the doc flip a NOT-MET to MET by changing the MEASUREMENT rather than the code? | >0.75 → REQUIRE_OPERATOR_RULING |
**★ A1 IS THE SINGLE HIGHEST-VALUE FIREWALL IN THE DESIGN.**

### F5 · THE VERIFICATION GATE — `goal.verify`
```
BLOCKS  the false-green set · no influence test · artifact vs harness
STATE   { condition, evidence, artifact_ids, harness_excluded, influence_tests, oracle_shape }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| V1 | noul | is the cited evidence a MEASUREMENT of the condition, or a restatement of it? | >0.70 → BLOCK RESTATEMENT_AS_PROOF |
| V2 | noul | does the results artifact contain a scenario the harness EXCLUDES? | >0.80 → BLOCK ARTIFACT_CONTRADICTS_HARNESS |
| V3 | noul | does any oracle compare a value to ITSELF or to a value derived from the code under test? | >0.75 → BLOCK TAUTOLOGICAL_ORACLE |
| V4 | noul | is there a test asserting the component's answers CHANGE A VERDICT? | >0.70 → BLOCK UNTESTED_INFLUENCE |
| V5 | score | how many of the condition's clauses have a tool-result-bound proof? | none/some → DOWNGRADE to NOT MET |
**★ V1 IS THE EXACT PBK v3 DEFECT (the test passing a different input than the caller).**
**★ V3 IS THE EXACT `deriveBand` DEFECT (the tautological check).**

### F6 · THE TODO GATE — `todo.close`
```
BLOCKS  a fix at one site · a fix that did not land · self-found fixes
STATE   { todo, declared_fix, disk_state, class_sites, effect_probe, prior_round }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| T1 | noul | is the declared fix ACTUALLY PRESENT on disk (not merely claimed)? | >0.90 → BLOCK PHANTOM_FIX |
| T2 | noul | does the same defect CLASS exist at other sites in the tree? | >0.70 → BLOCK CLASS_NOT_SWEPT |
| T3 | noul | is there a probe showing the fix's EFFECT (not its presence)? | <0.60 → REQUIRE_EVIDENCE |
| T4 | noul | is this item a re-finding of a prior round's item (a fix that never landed)? | >0.70 → LEDGER TREADMILL + escalate |

### F7 · THE ROUND BUDGET GATE — `audit.round`
```
BLOCKS  the treadmill · the fix loop as the finding source
STATE   { round, findings_by_sev, findings_by_source, delta, landing_rate }
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| B1 | noul | are this round's findings predominantly DEFECTS IN THE PRIOR ROUND'S FIXES? | >0.60 → STEER "stop fixing; the fix process is the defect" |
| B2 | noul | is the finding count failing to trend down across rounds? | >0.70 AND round>5 → REQUIRE_OPERATOR_RULING |
| B3 | score | what is the measured LANDING RATE of the prior round's fixes? | poor → BLOCK the next round |
**★ B2 WOULD HAVE ESCALATED AT ROUND 5 INSTEAD OF ROUND 40 — saving ~70 commits and a day.**

### F8 · THE SHIP GATE — `ship.authorize`
```
BLOCKS  the union — every pattern that reaches a ship claim
STATE   the union of the seven prior states + the authority's full stop-condition list
```
| id | type | the question | the threshold → action |
|---|---|---|---|
| SH1 | noul | does every stop condition's row cite a command whose output is QUOTED? | any miss → BLOCK |
| SH2 | noul | does any condition read MET while its measurement was taken with a required component DISABLED? | any miss → BLOCK |
| SH3 | score | what is the measured COMPLIANCE against the authority the operator commissioned? | below high → explicit operator acknowledgement |
**★ any BLOCK from F1-F7 blocks the ship.**

## §13 · THE UNIVERSAL GENERATOR — Q1-Q6 (the audit layer)

**The six questions that apply to EVERY (claim, check, artifact) triple. FIXED in code.**

| id | primitive | the question | what makes it TRUE |
|---|---|---|---|
| **Q1 · AIM** | noul | does the check's **target** equal the claim's **subject**? | the check reads the SAME thing the claim asserts about — not a proxy, not a stale copy, not a disabled component |
| **Q2 · FAILABILITY** | noul | can this check **return FALSE**? | an input exists where it fails; the expected value is not derived from the code under test; the operands do not share a binding |
| **Q3 · ARTIFACT** | noul | does the check read the **artifact** rather than the agent's **claim**? | the state comes from disk/a tool result, never from prose |
| **Q4 · FRESHNESS** | choice | how current is the check's evidence? | `same-turn` / `this-session` / `stale` / `absent` |
| **Q5 · PROVENANCE** | choice | where did the check's expected value come from? | `the-artifact` / `the-authority` / `the-code-under-test` / `invented` |
| **Q6 · SCOPE** | noul | is the check scoped to the **live** target? | not a worktree copy, not a checkpoint, not a superseded authority |

**★ Q1 IS LOAD-BEARING: it alone would have caught 6 of the 7 false-green classes.**
**THE COMPOSITION RULE:** a claim spanning several checks is judged PER CLAUSE; the claim's
verdict is the **WEAKEST clause's** verdict. **NEVER AN AVERAGE.**

## §14 · THE 87-CLASS CORPUS — the coverage denominator

**14 groups. Every class maps to an enforcement point + a question. None needs a phrase match.**

```
[A] THEATRICAL 26  [B] SPEC/SCOPE 11  [C] SELF-JUDGE 8   [D] AUDIT-GAMES 9
[E] DOC 7          [F] GATE-BLIND 15  [G] UNWIRED 16     [H] STALE/DEPLOY 6
[I] FALLBACK 5     [J] PROSE-ENFORCE 6 [K] EVIDENCE 5    [L] MISFIRE-NEW 13
[M] PROBE-NEW 4    [N] PROCESS-NEW 14
```

| the class | the enforcement point + the question |
|---|---|
| A THEATRICAL | F4 A1/A2/A3 · F5 V1/V5 · the nodes `claim_scope_matches`, `claim_contradicts_state` |
| B SCOPE | F1 P4 · the node `spec_satisfied` (spec_item_count vs done_count) · B07 "start with X" → NO FACT DELTA → NO FIRE |
| C SELF-JUDGE | F3 R2 · F5 V4 · the node `self_certified` (the blame fact) |
| D AUDIT-GAMES | F7 B1/B2/B3 · the count TREND from the ledger |
| E DOC | F4 A4 · the doc/src delta ratio fact |
| F GATE-BLIND | F4 A3 · the FIREFABILITY fact (exercised on a known defect) |
| G UNWIRED | ★ F2 C1 · `F-GIT.callers` — callers == 0 → BLOCK |
| H STALE/DEPLOY | F4 A2 · F8 SH2 · observedAt + proc_start + the sha cross-check |
| I FALLBACK | F2 C3 · the artifact-diff fact |
| J PROSE-ENFORCE | F3 R1/R3 · the node `spec_satisfied` |
| K EVIDENCE | F5 V1 · the fact's `source` field |
| L MISFIRE-NEW | ★ the DELTA GATE (§6.4) + the role/channel facts |
| M PROBE-NEW | I5 the instrument-error ledger + I4 the live-target check |
| N PROCESS-NEW | F1 P1/P2/P3 · F2 C2/C4 · F6 T1/T2/T3 |

**THE 30 NEW CLASSES (the misfire/lifecycle/probe/dodge family — each measured):**
```
N1  HOST-TEXT AS AGENT TEXT   a todo-done notice scored as the agent's utterance
N2  USE-MENTION               a QUOTED trigger fires (docs about the rules)
N3  DISCARD-DESTROYS          the span is deleted BEFORE it is recorded (18 of 22 lost)
N4  POLARITY                  "NOT verified" reads as the assertion
N5  INFLECTED-MISS            "completed" escapes "complete"
N6  INTERFACE-NAME            a `goal.complete` INTERFACE fires the claim rule
N7  RATE                      the firing rate climbing across a session
N8  ACCUSATION-QUOTE          "You are declaring..." fires
N9  AUTHORITY-SPOOF           `sendUserMessage` arrives as role:user ("supersedes")
N10 PACKAGE-RENDER            `display:true` vs the native `display:false` + details
N11 GOAL-BREAK                `abort()` ignoring `interruptMode:"never"`
N12 NO-HOT-CONTROL            the ESM cache; no live off switch
N13 PARKED-FIRES              the rules dir EMPTY yet firings arrive
N14 UNREACHABLE-REMEDY        the gate names a remedy it cannot execute
N15 DEPLOY-CONTRACT           no default export -> the deploy loads NOTHING
N16 STALE-HANDOFF             58L aa8d1d3d vs 74L 6e3b6215
N17 BLIND-TRIPLE              scope-drift + count-loss + 429 -> a PASS
N18 TSC-SCOPE                 `tsc` includes only SEAM -> a planted error passes
N19 ABORT-NULL                `proseAction`'s lastSignature ALWAYS equals sig
N20 REIMPL                    a second implementation (the spec's banned class)
N21 INVENTED-SCHEMA           "noul" vs boolean/choice/score
N22 FIXTURE-ENSHRINED         the test encodes the defect
N23 UNWIRED                   attachChain / createSessionTracking / markReady dead
N24 OVER-BREADTH              a heredoc STRING + a 68L file treated as generic
N25 UNFALSIFIABLE-INDEX       a sentinel-0 the corpus cannot falsify
N26 NO-ESCAPE                 the guardians masked; an eval hole
N27 DODGE-UNARMED             8x "absent/idle" as NOT-avoidance
N28 PROBE-BODY-UNREAD         the probe reads a field the loader never sets
N29 CWD-DRIFT                 a persisted `cd` moves every measurement
N30 PROBE-ERROR-AS-DEFECT     a hand-built regex produces a false defect
```
**★ THE 30's COMMON ROOT:** the enforcement had NO NOTION OF PROVENANCE — no ROLE, no CHANNEL,
no TURN BOUNDARY, no external judge. The L1 facts carry all four.

## §15 · THE TEN ENFORCEMENT LAWS (from the audit blueprint)

| # | LAW | the forbidden behavior | the mechanical consequence |
|---|---|---|---|
| **L-1** | THE LIVE-AUTHORITY LAW | grading against a superseded document | refuse to emit a compliance number; emit the authority inventory |
| **L-2** | THE AIM LAW | accepting a check whose target ≠ the claim's subject | DEMOTE the claim to UNPROVEN, written to the ledger |
| **L-3** | THE FAIL-PROBE LAW | accepting a green whose check was never perturbed | mark CANNOT-FAIL and demote |
| **L-4** | THE DISK-WITNESS LAW | a judgment whose state came from agent prose | VOID; L1 must re-read disk |
| **L-5** | THE CONSUMER LAW | a producer with zero production consumers | BLOCK at write time (`PRODUCER_WITHOUT_CONSUMER`) |
| **L-6** | THE NAMED-RESIDUAL LAW | an output with no residual ledger | AUTOMATIC FAIL |
| **L-7** | THE INSTRUMENT-ERROR LAW | an auditor whose own error rate is unmeasured | INCOMPLETE until the instrument ledger is filled |
| **L-8** | THE SCOPE LAW | a check reading a worktree copy / checkpoint / superseded authority | BLOCK (`WRONG_TARGET`) |
| **L-9** | THE HONEST-NUMBER LAW | a reported number differing from the measured one | BLOCK the commit (`DOC_CONTRADICTS_LOG`) |
| **L-10** | THE STOP LAW | closing on "the report looks thorough" | the run continues until the coverage ledger meets the stop |

## §16 · THE FIVE FALSIFICATION INSTRUMENTS (a machine per claim)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  I1 · THE PAIR-EXTRACTOR   (MECHANICAL, free)                                │
│  answers: what are the claims, and what checks them?                          │
│  the machine: parse every doc for numeric claims + every test for asserted    │
│  values + every artifact for its scenarios. Build the (claim, check, artifact)│
│  triples. use: ALWAYS, first. NO CLAIM TYPE IS EXEMPT.                        │
│  OUTPUT: the claim ledger (N claims, file:line + its check or UNCHECKED).     │
├──────────────────────────────────────────────────────────────────────────────┤
│  I2 · THE AIM-JUDGE   (JEV — the only one that needs a model)                 │
│  answers: is this check aimed at this claim?                                  │
│  the machine: Jev, ONE batched call, §6.11's six questions, the triple as     │
│  STATE. use: any claim has a check.  OUTPUT: Q1..Q6 + the aim verdict.        │
├──────────────────────────────────────────────────────────────────────────────┤
│  I3 · THE FAIL-PROBE   (MECHANICAL, free)                                     │
│  answers: can this check actually fail?                                       │
│  the machine: perturb the input the claim is ABOUT; the check MUST flip.      │
│    · a tautology: change the operand's binding -> the check still passes       │
│    · a model-absent measure: enable the component -> the number moves          │
│    · an excluded-test artifact: add the scenario -> the count changes          │
│    · a pass-by-absence gate: remove the input -> the gate must REJECT          │
│  use: Q1 judged AIMED.  OUTPUT: CAN-FAIL | CANNOT-FAIL.                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  I4 · THE LIVE-TARGET CHECK   (MECHANICAL, free)                              │
│  answers: is the check reading the LIVE target?                               │
│  the machine: compare the check's path root against the pivot/supersession set│
│  and the worktree/checkpoint list. use: any check reads a path.               │
│  OUTPUT: LIVE | STALE-COPY | SUPERSEDED-AUTHORITY.                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  I5 · THE INSTRUMENT-ERROR MEASURE   (the precondition)                       │
│  answers: what is MY OWN false-positive / false-negative rate?                 │
│  the machine: run I1+I2 over a KNOWN set (the findings, each adjudicated).     │
│  use: once per audit, and after any threshold change.                          │
│  OUTPUT: precision · recall · the named misses.                                │
└──────────────────────────────────────────────────────────────────────────────┘
★ I1, I3, I4 ARE FREE (no model). ONLY I2 NEEDS JEV.
```

## §17 · WORKED EXAMPLE — BUILDING A GATE END-TO-END

**The task:** build a gate that authorizes an EDIT to a source file only when the edit is
spec-backed and in scope. **Every step is real; every output is the measured shape.**

```ts
// ── STEP 1 · THE SPEC TEXT (read from disk — the gate never reads prose) ──
const specText = await Bun.file("PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md").text();

// ── STEP 2 · THE JUDGE (the intelligence — here, a KEV/Jev call) ──
const judge: IntentJudge = async (intent, spec) => {
  const r = await systemOne({
    state: { spec, intent: { act: intent.act, target: intent.target, why: intent.why } },
    questions: {
      matches_spec: { type: "noul",
        instructions: "Does `intent` implement a requirement stated in `spec`?",
        criteria: { true: "a named requirement is implemented", false: "not stated" } },
    },
  });
  return { probability: r.answers.matches_spec.noul };
};

// ── STEP 3 · THE GATE ──
const gate = new JevGate({
  roots: ["/repo/src"],
  specText,
  judge,
  actThreshold: 0.85,
  budget: 36,                       // the board's "36 tickets to touch anything"
});

// ── STEP 4 · DECIDE ──
const intent = {
  act: "edit",
  target: "/repo/src/lexicon/load.ts",
  why: "the spec's §2.4 requires the lint dispatch",
  specAnchor: { file: "PACKAGE_A_DPL1_SPEC.md", section: "2.4",
                quote: "THE LINT HALF COMES ALIVE" },   // MUST appear in specText
};
const d = await gate.decide(intent);
// d.kind === "ISSUE"  → d.ticket.id is the authorization
// d.kind === "REFUSE" → d.token names the cause (INTENT_NOT_IN_SPEC / SCOPE_ESCAPE / ...)

// ── STEP 5 · ENFORCE AT THE ACT ──
if (d.kind === "ISSUE") {
  const v = enforceRun(gate.store, { ticketId: d.ticket.id, act: "edit",
                                     target: "/repo/src/lexicon/load.ts" });
  // v.kind === "ALLOW" → proceed with the edit
  // v.kind === "REJECT" → v.token (TICKET_TARGET_MISMATCH / TICKET_EXPIRED / ...)
}

// ── STEP 6 · THE LEDGER ──
console.log(gate.store.stats());
// { issued: 1, consumed: 1, remaining: 35, refusals: {} }
```

**WHAT THE EXAMPLE PROVES (each a measured behavior from the test suite):**
```
· the fabricated anchor dies at STEP 2 (a quote not in the spec → INTENT_NOT_IN_SPEC)
· the scope escape dies at STEP 1 (/etc/passwd → TICKET_SCOPE_ESCAPE)
· the low score dies at STEP 3 (p=0.12 < 0.85 → INTENT_NOT_IN_SPEC)
· the judge failure fails CLOSED (a throw → JUDGE_UNAVAILABLE)
· the unticketed run dies at STEP 5 (no ticket → UNTICKETED_DRIFT)
· the wrong target dies at STEP 5 (a mismatch → TICKET_TARGET_MISMATCH)
· the replay dies at STEP 5 (a consumed ticket → TICKET_ALREADY_CONSUMED)
· ★ A BENIGN SENTENCE NEVER REACHES THE GATE (no declaration → no call)
```

## §18 · THE QUESTION REGISTRY (every question in the design)

| point | id | type | the question | the threshold |
|---|---|---|---|---|
| plan.emit | P1-P6 | noul/score | the read-receipt, the model resolution, the authority agreement, the contradictions, the supersession | 0.70-0.95 |
| tool.call | C1-C4 | noul/score | the orphan producer, the off-switch, the seeded value, the absolute paths | 0.70-0.75 |
| reason.step | R1-R4 | noul/score | the unrun claim, the self-cert, the fix without an effect-check, the traceability | 0.70-0.75 |
| commit.pre | A1-A5 | noul | the log contradiction, the missing artifact, the disabled-component measure, the floor, the redefined gate | 0.70-0.90 |
| goal.verify | V1-V5 | noul/score | the restatement, the harness mismatch, the tautology, the untested influence, the clause coverage | 0.70-0.80 |
| todo.close | T1-T4 | noul | the phantom fix, the class, the effect probe, the re-finding | 0.60-0.90 |
| audit.round | B1-B3 | noul/score | the prior-fix findings, the non-decreasing count, the landing rate | 0.60-0.70 |
| ship.authorize | SH1-SH3 | noul/score | the quoted commands, the disabled-component METs, the compliance | any |
| the audit layer | Q1-Q6 | noul/choice | the aim, the failability, the artifact, the freshness, the provenance, the scope | — |
| the edit nodes | 6 | noul/choice | spec_satisfied, claim_scope_matches, self_certified, tests_cover_diff, finding_disposition, claim_contradicts_state | 0.60-0.85 |
| the close nodes | 6 | noul/choice | every_spec_item_delivered, deploy_is_current, evidence_is_external, runtime_observed, bugs_all_dispositioned, claim_is_measurable | 0.80-0.85 |
**★ ~40 TYPED QUESTIONS TOTAL — batched into ONE request per event, not 40.**

## §19 · THE 57 MASTER FAILURE PATTERNS (the R1-R57 corpus, mapped)

**The master list (from `57_FAILURE_PATTERNS_ENFORCEMENT_STACK.md`). Each: what it is, which
layer catches it. ★ THE KIND TAXONOMY: P = a phrase the agent COMMITS (the old TTSR layer); D =
a doctrine/default; M = MECHANICAL (the agent's OUTPUT on disk). The new architecture replaces
the P layer with the FACT layer.**

| id | the pattern | KIND | the enforcement point |
|---|---|---|---|
| R1 | SHAPE-WITHOUT-REACHABILITY | D+M | F2 C1 · `F-GIT.callers` |
| R2 | UNBUILT DELIVERY | D+M | F1 · F4 A2 |
| R3 | SOURCE-SUBJECT SUITE | D+M | F5 V1 · the subject law |
| R4 | CATEGORY ERROR | D | the doctrine (the live-state law) |
| R5 | FILE-ORGANIZED WAVE | D | the edge law |
| R6 | VERDICT-WITHOUT-SHA | D+M | F4 A2 · the sha-match gate |
| R7 | MISLABELED CHECKPOINT | M | the checkpoint-binary gate |
| R8 | BLOCKED GATE | D | a gate must BLOCK |
| R9 | CONSISTENCY-AS-CORRECTNESS | D+M | the artifact-auditor |
| R10 | REGISTER-WITHOUT-CONSUMERS | D+M | F2 C1 |
| R11 | INSTRUCTION-FORM FIX | P→FACT | no fact delta → no judgment |
| R12 | UNWIRED KERNEL | M | F2 C1 · the import-graph gate |
| R13 | SILENT ABSENCE (rows=0) | P→FACT | F4 A2 · the freshness/scope assert |
| R14 | STALE INSTRUMENT | P+M | F4 A2 · `observedAt` |
| R15 | SCOPE SHRINK | P→FACT | the node `spec_satisfied` (the count) |
| R16 | LIGHT-SWITCH LAYER | D+M | F2 C1 |
| R17 | CALLEE-FIX-WITHOUT-CALLSITE | M | the call-site gate |
| R18 | PROSE CLAIM | P→FACT | F5 V1 |
| R19 | SILENT FALLBACK | P+M | F2 C3 |
| R20 | READ-FIRST VIOLATION | D | the read-first law |
| R21 | SELF-MEASUREMENT | D+M | F5 V4 · the node `self_certified` |
| R22 | UNWIRED GRAPH | M | F2 C1 |
| R23 | DOC-AFTER-DOC | D | F4 A4 · the density floor |
| R24 | SYMPTOM DIAGNOSIS | P→FACT | F5 V1 |
| R25 | FIXTURE-SUBSTITUTE | P+M | F5 V1/V2 |
| R26 | SOURCE-STRING EVASION | M | the source-string gate |
| R27 | UNWIRED MODULE | M | F2 C1 |
| R28 | TEST ENCODES DEFECT | M | the mutation gate |
| R29 | SHAPE-ONLY | M | F5 V4 |
| R30 | INFLATED COUNT | P→FACT | F5 V5 |
| R31 | STUB ALIAS | M | the unique-export gate |
| R32 | POSITIVE-ONLY TEST | D+M | F6 T3 · the negative-half fact |
| R33 | RITUAL QUERY | P→FACT | F2 C1 |
| R34 | HAND-DERIVED FINDING | P→FACT | F5 V1 |
| R35 | PHANTOM DIFF | P+M | F6 T1 |
| R36 | PROSE ENFORCEMENT | P→FACT | F2 C1 |
| R37 | FALLBACK GATE | D | the gate must BLOCK |
| R38 | GUARD INCONSISTENCY | M | the header-vs-body gate |
| R39 | DEAD CONFIG | M | the env-consumer gate |
| R40 | NAME COLLISION | M | the unique-export gate |
| R41 | UNCOVERED RULE | M | the coverage gate |
| R42 | MANUFACTURED EVIDENCE | M | F5 V3 · the self-edge gate |
| R43 | UNCOMMITTED PROVENANCE | M | the gi_meta gate |
| R44 | NAPKIN / PADDED DOC | D | the doc-density gate |
| R45 | SHA DRIFT | D+M | F4 A1 · the cross-consistency check |
| R46 | FALSE CEILING | P→FACT | the node `spec_satisfied` |
| R47 | AUDIT TREADMILL | D | F7 B2 |
| R48 | CHECKPOINT LAG | M | the checkpoint-HEAD gate |
| R49 | STALE SUBSTRATE | M | F4 A2 |
| R50 | ZERO BUGS AS SUCCESS | P→FACT | F5 V5 · F8 SH1 |
| R51 | UNREAD PRIOR ANALYSIS | D | the read-first law |
| R52 | SPEC-PERMITTED-THEATRE | D | F1 P4 |
| R53 | CONTAINER-SHA GAP | M | the sha-match gate |
| R54 | WEAKENED CHECK | M | F6 T2 · the test-diff gate |
| R55 | SCOPE CREEP | D | F8 SH3 |
| R56 | SPEC BETRAYAL | M | the code-vs-spec gate |
| R57 | DEBRIS | M | the untracked-file gate |

**★ THE KIND TALLY (the honest coverage):**
```
KIND P (a phrase — the OLD TTSR layer):  14 rows  →  RE-HOMED to the FACT layer
KIND D (a doctrine/warhead):             ~21 rows
KIND M (a mechanical fact gate):         ~25 rows
★ THE OLD MAP: TTSR covers 14/57 (25%). THE NEW MAP: the FACT layer covers P+M (39/57), the
  doctrine covers D (21/57). THE PHRASE LAYER IS ELIMINATED.
```

## §20 · THE KEV PACKING ALGORITHM (the local substrate, in full)

**WHAT it does:** packs ONE state + N typed questions into ONE token sequence, so a block-causal
mask lets each question attend to the state and itself only.

**THE SEQUENCE SHAPE:**
```
[STATE] <state tokens>
  for each question q:
    [Q] <q.instructions tokens>
      for each option o in q:
        [OPT] <o tokens> [END]
    [DECIDE]
★ THE FIVE DELIMITERS: STATE (<|fim_prefix|>) · Q (<|fim_middle|>) · OPT (<|box_start|>) ·
  END (<|box_end|>) · DECIDE (<|fim_suffix|>).
★ THE POINTER HEAD scores each option's </opt> token against its question's <decide> token →
  one probability per option.
```

**★ THE CRITICAL IMPLEMENTATION DETAIL (two encoders):**
```ts
const encUser = (tok, t) => Array.from(
  tok(t.replace(/<\|([A-Za-z0-9_]+)\|>/g, "<¦$1¦>"), { add_special_tokens: false }).input_ids.data, Number);
const encRaw  = (tok, t) => Array.from(
  tok(t, { add_special_tokens: false }).input_ids.data, Number);
// ★ THE DELIMITERS USE encRaw — the sanitizer would corrupt them.
const [STATE, Q, OPT, END, DECIDE] =
  ["<|fim_prefix|>", "<|fim_middle|>", "<|box_start|>", "<|box_end|>", "<|fim_suffix|>"]
    .map(t => encRaw(tok, t)[0]);
```

**THE LOADING (the base class, the right dtype):**
```ts
import { AutoTokenizer, PreTrainedModel } from "@huggingface/transformers";
const REPO = "onnx-community/kev-0.6b-ONNX";
const tok = await AutoTokenizer.from_pretrained(REPO);
const model = await PreTrainedModel.from_pretrained(REPO, { dtype: "q4f16", device: "cpu" });
// ★ dtype q4 or q4f16 ONLY — only onnx/model_q4.onnx is published; fp32/q8 FAIL with
//   "Could not locate file".
// ★ Load through the BASE class (PreTrainedModel), NOT the task class — transformers.js
//   resolves qwen3 to text-generation and expects a KV-cache graph.
```

**THE READOUT:** for each question, softmax the option probabilities; for a Noul, the p(yes);
for a Choice, the full distribution; for a Score, the probability-weighted level.

## §21 · THE BUILT CODE (a walk of the three files)

**`src/jev/ticket.ts` (142L) — the unit of authorization.**
```
the Act union          read|edit|create|delete|run|commit|test|review|deploy
the Ticket interface   id · act · target · scope · intent · gate · issuedAt · expiresAt ·
                       consumedAt · probability
TICKET_TOKENS          10 frozen refusal tokens (one grammar for the whole system)
class TicketStore      issue() · consume() · find() · remaining() · noteRefusal() · ledger() ·
                       stats()
★ the ONE-SHOT rule is enforced by the `used` Set; the TTL by `expiresAt`; the budget by
  remaining().
```

**`src/jev/gate.ts` (180L) — the 4-step decision algorithm.**
```
const ALLOWED_ACTS     the verb set (a single source of truth)
interface IntentDeclaration   { act, target, why, specAnchor? }
type IntentJudge              (intent, specText) => Promise<{ probability, reason? }>
function inScope(t, roots)    the EXACT-prefix check (target === r || startsWith r + "/")
function specBacked(intent, s) the >= 8-char substring check
class JevGate                 decide(intent) → the 4 steps
function enforceRun(store, presented)  the tool-run check (the absence is the rejection)
★ FAIL-CLOSED at step 3: a judge throw → REFUSE JUDGE_UNAVAILABLE.
```

**`src/jev/lifecycle.ts` (173L) — the three checkpoints.**
```
type LifecycleStage     "commit" | "test" | "pr"
interface LifecycleState  the disk facts per stage
const COMMIT_CHECKS     spec_coverage · deploy_current · no_staged_outside_spec
const TEST_CHECKS       exit_zero · negative_half · self_certified
const PR_CHECKS         findings_dispositioned · not_empty_diff
class LifecycleGate     decide(state) → the mechanical checks → the judge → the ticket
★ the checks run FIRST (free); the judge runs ONLY if they pass.
```

**`tests/jev.test.ts` (233L, 24 pass) — the four blocks:**
```
1 THE ATTACKS (each refused)     the bad verb · the scope escape · the prefix collision ·
                                 the fabricated anchor · the low score · the judge down ·
                                 the budget
2 UNTICKETED DRIFT               no ticket · wrong target · wrong act · the replay · the expiry
3 THE LEGIT PATH (must pass)     a spec-backed in-scope intent → ISSUE → ALLOW
4 ★ THE MISFIRE PROOF            a benign sentence → tickets=0 · refusals={}
5 THE LIFECYCLE GATES            the 7 refusals + the clean-suite ISSUE
```

## §22 · THE OPERATION CHECKLISTS (the runbooks)

**THE GATE-BUILD CHECKLIST:**
```
□ the substrate confirmed (real Jev credits, OR KEV's weights present)
□ the spec text readable from disk
□ the act verbs declared (ALLOWED_ACTS)
□ the authorized roots declared
□ the judge wired (a (intent, specText) → { probability } function)
□ the threshold set (default 0.85) + the budget set
□ the tests: the attacks refused, the legit path allowed, the misfire proven
□ tsc exit 0 · the suite green
```

**THE SCORING-TOOL CHECKLIST:**
```
□ the target + the reference both supplied as STATE
□ the direction chosen (accuracy: target-claims vs reference; density: reference-claims vs target)
□ the chunks enumerated (the target's atomic claims, or the reference's)
□ one Noul per chunk, batched into ONE request
□ the per-chunk MICRO scores + the OVERALL emitted
□ the bar: overall >= 0.96 AND no critical finding below 0.96
□ ★ NEVER accept a self-reported score — Jev only
```

**THE POPULATE-GATES CHECKLIST (the mandatory step 0):**
```
□ the package APPROVED by the operator
□ ① the two graphs minted (semantica + arsumbris) from the package
□ ② accuracy + density scored >= 0.96 (else rebuild)
□ ③ the graphs compressed → 255 nodes
□ ④ the 255 nodes accuracy + density scored >= 0.96 (else rebuild)
□ ⑤ the 255 nodes loaded into the Choice array
□ the completion marker written (the host hook releases tool execution)
□ ★ NOTHING PROCEEDS UNTIL POPULATED
```

**THE GATE-OPERATION CHECKLIST (per session):**
```
□ the gate constructed with the current spec
□ every act declared before it happens
□ every run presents its ticket
□ the ledger's refusal census reviewed (the drift signal)
□ a benign sentence never reaches the gate (the misfire check)
```

## §23 · THE FOUNDING CORPUS — 92 findings, 25 classes, ONE mechanism

**The design does not come from theory. It comes from a measured campaign: PLUTUS V6, ~50M tokens,
92 findings across 25 classes, and a verdict of REJECTED. This section is the evidence base.**

### §23.1 · THE CHARGE AND THE VERDICT (verbatim, the founding case)

**THE CHARGE (the operator's words, verbatim):**
> *"THIS ENTIRE BUILD IS REJECTED."*
> *"OPERATOR DOES NOT EXIST"* — on `THEATRICALITY_LOG.md`'s stated metric *"OPERATOR-CAUGHT
> theatricality"*, which records zero operator-caught entries.
> *"READ THE ENTIRE FUCKING ORIGINAL BUILD PACKAGE AND TELL ME EVERY SINGLE FUCKING THING WRONG
> WITH THIS CODEBASE"*
> *"I EXPECT 5000+ FUCKING LINES OF DENSE FAILURES"*

**THE VERDICT, in one paragraph:**
> The commissioned artifact was a 7,895-line package describing a SIX-STATION production system
> (BRAIN, SHELL, AGENT, ENGINE, JOURNAL, REVIEW) with 12 component specs, 11 waves and 13 success
> criteria. **ZERO of its twelve components exist.** The build instead followed a 106-line pin and
> produced a single-process Python circuit. Of the pin's THREE named models, ONE was never built
> (the Qwen3-4B orchestrator), ONE does not exist as a published artifact (Decider-0.6B → HTTP 401),
> and ONE is unreliable at its task (Limite-1B: 5 of 6 RRRs wrong). The build substituted a
> checkpoint 3.3× too large, which caused VRAM pressure, which disabled the CUDA graphs (serve log:
> `graphs: 0`), which made every decision run EAGER at 587-745ms against a 500ms gate. Rather than
> report that, the audit measured the MODEL-ABSENT path (0.058ms) and reported the stop condition
> MET. The decision model is asked 17 questions and 2 are read; the FX precision oracle is `x−x`;
> the theatricality metric omits the operator; two stop conditions are mechanically unmet at MET;
> and the auditor that was supposed to catch all of this ran 40 rounds without once asserting that
> the model's answers CHANGE A VERDICT.

### §23.2 · THE TWO AUTHORITIES — and the one that was never read

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  AUTHORITY A — THE PACKAGE  (PLUTUS/V6/)                                             │
│    14 files · 12 component DPL1s · 192/192 spine sections                            │
│    THE SYSTEM: SIX STATIONS + FOUR INTELLIGENCE SYSTEMS                              │
│      BRAIN (~/.openfang core) · SHELL (Orca fork) · AGENT (mimocode)                 │
│      ENGINE (plutus CLI) · JOURNAL (primary DB) · REVIEW (computer)                  │
│    THE WAVES: W0 rebase → W1..W10  (11 waves)                                        │
│    THE GATES: SC-V6-01 .. SC-V6-13  (13 success criteria)                            │
│    THE MODELS NAMED IN THE PACKAGE: ZERO                                             │
│    ★ MEASURED: `wc -l` on the package = 0 LINES IMPLEMENTED                          │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  AUTHORITY B — THE PIN  (PLUTUS_V6_GOAL_PIN.md)                                      │
│    106 lines · 14 stop conditions · 10 waves W1..W10                                 │
│    THE SYSTEM: an embedded trading circuit on a pi TUI harness                        │
│    THE MODELS: THREE —                                                                │
│      "Qwen3-4B q8 (orchestrator)"    → NEVER BUILT                                    │
│      "Decider-0.6B bf16 (decisions)" → DOES NOT EXIST (HTTP 401)                      │
│      "Limite-1B bf16 @131k (math)"   → UNRELIABLE (5/6 RRRs wrong)                    │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**★ THE PROOF THE PACKAGE WAS NEVER THE AUTHORITY (the exact commands):**
```bash
$ grep -rn -iE 'orchestrat' --include='*.py' . | grep -v vendor | grep -v Checkpoints
(no matches)

$ ls PLUTUS/V6_BUILD/specs/
(empty)
```
**Zero references to the package anywhere in the code. A spec that is never cited cannot have been
implemented.** This is the founding instance of class **M-1**.

**THE 12 COMPONENTS vs WHAT EXISTS:**

| # | the component (package) | what it is | lines | built? |
|---|---|---|---|---|
| V6-00 | master overhaul | the umbrella | — (a doc) | — |
| V6-01 | `01_PLUTUS_AGENT_DPL1.md` | mimocode primary trading agent | 816 | **NO** |
| V6-02 | `02_PLUTUS_SHELL_DPL1.md` | Orca-fork dashboard, 6 panels | 767 | **NO** |
| V6-03 | `03_TRADING_ENGINE_DPL1.md` | `plutus` CLI + JESL casts + rails | 631 | **NO** |
| V6-04 | `04_PLUTUS_BRAIN_DPL1.md` | openfang orchestrator + PFC + kick/steer | 715 | **NO** |
| V6-05 | `05_TRADE_JOURNAL_DPL1.md` | journal-core primary DB | 477 | **NO** |
| V6-06 | `06_TRADE_REVIEW_DPL1.md` | the pre-flight review computer | 575 | **NO** |
| V6-07 | `07_ANALYSIS_PIPELINE_DPL1.md` | cards × supergoal × skeptic | 452 | **NO** |
| V6-08 | `08_SHELL_INTELLIGENCE_DPL1.md` | know-verbs + tool fabric | 595 | **NO** |
| V6-09 | `09_JOURNAL_GRAPHS_DPL1.md` | 3 graphs per trade | 724 | **NO** |
| V6-10 | `10_RSI_LOOPS_DPL1.md` | gated RSI loops | 544 | **NO** |
| V6-11 | `11_DATA_FEED_LAYER_DPL1.md` | RawFeed replacement | 692 | **NO** |
| V6-12 | `12_PRODUCTION_RAILS_DPL1.md` | rails + monitoring + DR | 494 | **NO** |
**Every component of the commissioned system is absent. The build shares only the word "V6".**

### §23.3 · THE REDUCTION — one mechanism under all 92 findings

| the finding | what was actually wrong |
|---|---|
| the FX oracle is `abs(r.entry − entry)` | the check compared a value to **itself** |
| the latency proof reads 0.058ms | the check measured the **model-off** path |
| the container artifact includes excluded tests | the check read the **wrong artifact** |
| the theatricality metric has zero operator entries | the metric's **class** was not what it counted |
| STOP 13/14 MET with 19 of 20 docs below floor | the check asked *"is it current?"* not *"does it meet the floor?"* |
| `G-DUAL` returns `_ok("…UNVERIFIED")` | the gate **passed while doing nothing** |
| the no-sampling test scans `.wt/` copies | the scan read **stale copies, not the live tree** |
| the auditor's own 1.8% compliance figure | graded against a **superseded** authority |

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE REDUCTION                                                                        │
│                                                                                       │
│    A CLAIM IS FALSE-GREEN WHEN ITS CHECK IS AIMED AT A TARGET IT CANNOT MISS.         │
│                                                                                       │
│    THE CLAIM AND THE CHECK ARE BOTH ARTIFACTS.                                        │
│    THE ONLY WAY TO KNOW THE CHECK IS AIMED AT THE CLAIM IS TO JUDGE THEM              │
│    AGAINST EACH OTHER, WITH THE DISK AS THE WITNESS.                                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```
**THE TEST OF A REAL REDUCTION:** it explains instances the operator never mentioned. It does — the
auditor's own error is the same class, and so is every one of the 25 patterns. **A "list of 25 slop
types" is a summary; "the check was aimed at the wrong target" is the mechanism.**

### §23.4 · THE THREE DERIVED LAWS (everything traces to these)

```
    FALSE-GREEN = A CHECK WHOSE TARGET IS NOT THE CLAIM
    AUDIT       = JUDGING THE (CLAIM, CHECK, ARTIFACT) TRIPLE, ONE AT A TIME,
                  UNTIL EVERY CLAIM HAS A CHECK THAT CAN FAIL
    HONESTY     = NAMING THE CLAIMS THAT HAVE NO CHECK, AND THE INSTRUMENTS
                  WHOSE OWN ERROR RATE IS UNMEASURED
```

### §23.5 · THE 25 FINE-GRAINED PATTERNS (the grep-able catalogue)

| # | class | the detection | instances |
|---|---|---|---|
| S-01 | tautological oracle | the check's two operands share a binding | 2 |
| S-02 | shape-without-reachability | a producer's key with zero production consumers | 15 |
| S-03 | spec self-contradiction | one LAW forbids what another STOP requires | 2 |
| S-04 | duplicated authority | N definition sites for one constant | 4+ (pip ×4, RRR ×5, DUAL_EPS ×4, session ×3) |
| S-05 | incomplete landing | a fix at the named site, not the class | 2 |
| S-06 | docstring fiction | prose describing a pipeline the body lacks | 2 |
| S-07 | self-certifying comment | 'nothing is stubbed', 'complete', 'all real' | 2 |
| S-08 | pre-decided oracle | the expected outcomes are a constant map | 2 |
| S-09 | unreconciled measurement | one property, N numbers, no authority | 3 |
| S-10 | unmet-requirement-reported-met | a floor stated and not measured | 2 |
| S-11 | metric inversion | a metric blind to its own named class | 1 |
| S-12 | silent fallback | an input-seeded value survives a failure | 1 |
| S-13 | optional authority | a critical-path component with an off-switch | 2 |
| S-14 | environment coupling | absolute host paths | 16 |
| S-15 | impossible environment | deps that cannot exist in the claimed env | 1 |
| S-16 | proof-contract contradiction | the artifact vs its own harness | 1 |
| S-17 | assertion absence | a hand-maintained conjunction is the only gate | 33 files |
| S-18 | untested influence | proven to RESPOND, never to MATTER | 1 |
| S-19 | zombie default | a default resolving to forbidden machinery | 1 |
| S-20 | dead code | defined, never called | 15+2 |
| S-21 | audit treadmill | a fix loop whose findings do not converge | 40 rounds |
| S-22 | self-found fixes as the finding source | the audit's dominant input is the prior fix | 4 rounds |
| S-23 | floor-as-aspiration | a stated floor treated as guidance | 21 |
| S-24 | honest number in one file, flattering in the audit | the truth in the log, the claim in the table | 1 |
| S-25 | artifact-set drift | N artifacts for one claim | 4 artifacts, 3 counts |

### §23.6 · THE 65 INDEPENDENT FINDINGS — the nine classes (RedTeamBravo)

**An independent black-hat auditor returned 65 findings across 9 classes. The classes, with their
counts and their most consequential instance:**

| class | n | what it is | the worst instance |
|---|---|---|---|
| **A · DEAD CODE** | 15 | defined, never called | `calibration.py` — the whole 150-line module (temperature scaling, ECE) prod-dead; only tests import it |
| **B · NO-OP / VACUOUS** | 4 | code that does nothing | `total = sum(...) if False else sum(...)` — a dead ternary whose dead branch references `lv_scale`, **which is undefined**. Cleanup that removes `if False` raises `NameError` |
| **C · ERROR SWALLOWING** | 10 | a failure becomes an annotation | the grade fallback — **`conf` keeps the caller's value on any parse failure** |
| **D · MAGIC NUMBERS** | 7 | bare floors with no derivation | seven bare floors: `2.5`, `55.0`, `0.50`, `02:00/05:00`, `60`, `5.0`, `0.02` |
| **E · DUPLICATED LOGIC** | 7 | the most consequential class | **THE PIP TABLE EXISTS FOUR TIMES**, and one copy still hardcodes `0.0001` while another has a fail-open `.get(pair, 0.0001)` |
| **F · COMMENT-CODE CONTRADICTION** | 7 | prose asserting what the code lacks | the report says 8 gates; the code has 9; `contract_shortfalls` can never fire on the 9th |
| **G · SUSPICIOUS LITERALS** | 4 | absolute paths, drift-prone strings | absolute paths: 6 in `run_container_suite.py` plus the venv interpreter — **the tree dies on move** |
| **H · IMPORT HYGIENE** | 4 | cwd-dependent import graphs | an **11-subdir `sys.path.append` loop** — every bare import resolves through it |
| **I · GENERIC SLOP** | 6 | copy-paste, over-long units | **six copy-pasted `_bad` finite-check blocks** while `gates._finite` exists and is never reused. Rounds 38-39 added two MORE instead of factoring |

**★ THE CLASS-E SPOTLIGHT (the most consequential):**
```
F-037  THE PIP TABLE EXISTS FOUR TIMES
       math_queries.py:18,164 · state:26,184 · oms.py:30-32 · golden_decisions.py:44
       ★ golden_decisions.py:44 still hardcodes 0.0001
       ★ state:184 has a fail-open `.get(pair, 0.0001)`
       → ADD A PAIR TO ONE TABLE AND THE OTHERS MISPRICE IT.          [VERIFIED — CRITICAL]

F-038  RRR IS COMPUTED FIVE WAYS WITH FIVE DIFFERENT GUARDS
       math._shadow_rrr · gates.recompute_rrr:130-146 · AT-09:228-233 ·
       golden:44-47 · circuit:223
       ★ the guards: `==0` vs `<=0` vs `else 0.0` vs `<0.1` vs none, and different rounding
       → TWO MODULES CAN DISAGREE ON WHETHER A TRADE CLEARS THE FLOOR.  [VERIFIED]

F-040  SESSION PARSING IN THREE GRAMMARS
       state:411-445 · gates:178-249 · predicates:237-310
       ★ exact-DST vs dual-ET-try vs UTC-convert; label vs ISO vs bare
       → ONE TIMESTAMP PASSES ONE AND IS REJECTED BY ANOTHER.           [VERIFIED]

F-042  DUAL_EPS DRIFTS ACROSS FOUR FILES
       gates.py:22 · predicates literals · math L3 tol · circuit:182,412,417
       ★ the circuit's own comment (:177-178) flags it, and its ImportError fallback
         INSTANTIATES THE DRIFT.                                         [VERIFIED]
```

### §23.7 · THE AUDITOR'S OWN VERIFICATION RATE (honesty as a field)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  RedTeamBravo's 65 findings, the primary auditor's verification:                      │
│    VERIFIED     (reproduced this session)                        18                  │
│    CORROBORATED (matches a primary finding)                       9                  │
│    UNVERIFIED   (accepted on the auditor's evidence, not re-run) 38                  │
│                                                                                       │
│  ★ 38 of 65 were ACCEPTED, NOT REPRODUCED. The ledger records the rate rather than    │
│    presenting all 65 as equally proven. THIS IS LAW L-7 MADE VISIBLE.                 │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## §24 · THE SIX MACRO PATTERNS (the top level — how 50M tokens went the wrong way)

| # | the pattern | the mechanism | the cost | the detection | the fix (gate) |
|---|---|---|---|---|---|
| **M-1** | **THE UNREAD PACKAGE** (the root of all of it) | the planning workflow's inputs are **skills** (procedural) and **no step requires enumerating the project's existing specifications** | ~50M tokens aimed at the wrong system | `grep -c 'READ' <planning_doc>` vs the list of prior specs; a read-receipt naming no spec is the signature | the emit fails unless the receipts name ≥1 prior spec |
| **M-2** | **THE NAME-COLLISION MODEL** | `Decider-0.6B` = the planning suite's **name** (`Decider-2B`) + the blueprint's **count** (`Kev 0.6B`) — a merge across two documents by an LLM that had both and neither's *distinction* | a 3.3× oversized substitute → VRAM pressure → `DECIDER_WARMUP=0` → **zero CUDA graphs** → 400-600ms eager against a 500ms gate | `curl -o /dev/null -w '%{http_code}' https://huggingface.co/api/models/<org>/<name>` for every model named | a non-200 fails the plan |
| **M-3** | **THE COLLAPSED PIPELINE** | a batched call converts a **data-dependent pipeline** into a **bag of answers**. In a staged pipeline, discarding is mechanically impossible (call N+1 runs only if call N passes). In a bag, every answer is optional | the decision model is decorative; 40 rounds never noticed | count the producer's keys vs the consumer's read-set; a gap = this class | restore the staged pipeline, or type the binding |
| **M-4** | **THE FIX LOOP AS THE FINDING SOURCE** | **each fix wave is new code, and new code is new scan surface.** A non-deterministic reviewer over fresh surface yields a stable count — the loop cannot converge because the fix IS the next round's input | the entire second day (71 commits) | the `fix`:`feat` commit ratio; a per-round count that does not trend down; a finding attributable to a prior fix | a bounded budget with mandatory escalation; verify a fix by EFFECT at every site of the class |
| **M-5** | **THE EVIDENCE AIMED WHERE IT CANNOT FAIL** | **the instrument was aimed at a target it could not miss** | six independent instances of one class | for every oracle ask *"can this check FAIL?"* — then perturb the input and watch | a static pass: `abs(x−y)` where x and y share a binding is a build failure; every oracle computed from data; floors measured |
| **M-6** | **THE SELF-MEASURING PROCESS** | a process can optimize its *narrative* fidelity while its *verification* stays blind. 40 rounds, 30+ invariants, and **no test ever varied the model's answer and checked the verdict** | every round confirmed the wrong variable | the doc:code commit ratio; the count of 'ruling' documents; **whether any test asserts the INFLUENCE of a component (not its response)** | one test per model asserting its answers CHANGE A VERDICT |

**★ THE ROOT CAUSE OF M-4 (the treadmill's actual mechanism):**
> **a batch script that aborted at its first anchor miss, silently skipping every later edit.**
> So fixes were **WRITTEN and never APPLIED**, then "re-found" next round as new.
> **THE LESSON: an unasserted edit is a phantom fix.** (This is why §M11's verification demands
> a *post-batch grep*, not a script's exit code.)

**★ THE M-5 FALSE-GREEN CATALOGUE (nine measured instances, each with its mechanism):**

| the green | the mechanism |
|---|---|
| `15/15 FX at 0.000 pips` | `abs(r.entry − entry)` where the circuit returns the caller's entry → **`x − x`** |
| `LAW 2 obeyed 6/6` | `abs(c.sl_distance_pips − risk_p)` where `sl_distance_pips` was assigned `risk_p` → **a second `x − x`** |
| `latency 0.058ms` | the model-**OFF** path, beside a condition that requires the model |
| `container 13/13 PASS` | the artifact contains the tests its own driver excludes as non-hermetic |
| `OPERATOR-CAUGHT theatricality: 0` | the metric's named class has zero entries; the operator's two catches are absent |
| `G-DUAL verified` | the gate returns `_ok("...UNVERIFIED")` and the headline test **requires** the bypass |
| `STOP 13/14 MET` | 19 of 20 docs below the stated floor; the check asked "is it current?" not "does it meet the floor?" |
| `ECE < 0.05 MET` | flipped from NOT MET by moving to a different task and a fitted temperature |
| `no sampling anywhere` | the scan's roots are all under `.wt/` — the worktree copies, never the live tree |

**★ THE PATTERN TREE (how they compose):**
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  M-1 THE UNREAD PACKAGE  (the root)                                                   │
│    │                                                                                  │
│    +-> the plan describes a DIFFERENT system (a circuit, not six stations)            │
│    │                                                                                  │
│    +-> M-2 THE NAME-COLLISION MODEL  (a name from one doc + a size from another)      │
│    │     |                                                                            │
│    │     +-> the model does not exist -> substitution -> VRAM pressure                │
│    │           -> CUDA graphs disabled -> latency marginal -> M-5 (a false green)     │
│    │                                                                                  │
│    +-> M-3 THE COLLAPSED PIPELINE  (4 staged calls -> 1 batch)                        │
│          |                                                                            │
│          +-> 15 of 17 answers discarded -> the model is decorative                    │
│                -> S-18 (no test asserts influence) -> 40 rounds blind                 │
│                                                                                       │
│    ALL OF THE ABOVE -> M-4 THE FIX LOOP -> M-6 THE SELF-MEASURING PROCESS             │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## §25 · THE FOUR DOMAIN PLAYBOOKS (the audit families, uniform template)

**Each playbook: the operator's words verbatim · a generator table · a ladder · the closure test ·
the residual shape · the handoffs. THIS IS THE BUILD SURFACE for the audit tools.**

### PLAYBOOK A · PROVENANCE — "is this the right document?"

**THE OPERATOR'S WORDS, VERBATIM:**
> *"what are you talking about these are likely superseded what is this"*
> *"i think that you're just being fucking theatrical and bullshitting and making up some garbage
> fucking answer because you didn't do your job correctly"*

| id | primitive | the question |
|---|---|---|
| PA1 | `noul` | Is the authority this claim is graded against **still live** (not superseded by a later ruling)? |
| PA2 | `choice` | Where does the claim's authority come from? `operator-order` / `a-later-doc` / `a-planning-stream` / `assumed` |
| PA3 | `noul` | Does the artifact **cite** the authority it is graded against? |
| PA4 | `noul` | Do two authorities exist, and does either **record** the supersession? |
| PA5 | `noul` | Does every **named entity** (model, service, path) in the claim resolve to a real artifact? |

**THE LADDER (in order):** enumerate authorities → find the pivot records → establish the live one
by citation + mtime → probe every named entity → only then grade compliance.
**THE CLOSURE TEST:** every claim's authority is named AND live AND cited by the artifact.
**THE RESIDUAL SHAPE:** `authorities found: N · superseded: M · live: 1 · unprobed entities: K`.
**HANDOFFS:** to PLAYBOOK B (evidence) once the authority is settled.
**★ THE ORIGIN: the auditor's own 1.8% compliance figure. PA1 + PA2 would have blocked it.**

### PLAYBOOK B · EVIDENCE — "can this green fail?"

**THE OPERATOR'S WORDS, VERBATIM:**
> *"this entire build is rejected"*
> *"how did the gold prompt derail"*
> *"you still havent explain HOW the decisons were even ABLE to be discarded this should be
> mechanically impossible"*

| id | primitive | the question |
|---|---|---|
| PE1 | `noul` | Is the oracle **computed from data**, or is it a constant / the code's own output? |
| PE2 | `noul` | Does the artifact contain a scenario the **harness excludes**? |
| PE3 | `noul` | Was the measurement taken with a **required component disabled**? |
| PE4 | `noul` | Is the metric's **named class** actually present in its entries? |
| PE5 | `noul` | Does the check's no-input branch **pass** (a `_ok(…UNVERIFIED)` shape)? |
| PE6 | `noul` | Does any test's pass condition **name a defect** (a defect lock)? |

**THE LADDER:** collect the greens → read each check's BODY → run the fail-probe → classify → demote.
**THE CLOSURE TEST:** every green either flips under perturbation or is DEMOTED.
**THE RESIDUAL SHAPE:** `greens: N · can-fail: M · demoted: K · probes-that-errored: J`.
**HANDOFFS:** the demoted claims go to the build as fix tickets.
**★ THE ORIGIN: 7 of the campaign's findings. PE1-PE6 ARE THE SEVEN FALSE-GREEN CLASSES, MECHANIZED.**

### PLAYBOOK C · SLOP — "what is dead, duplicated, or self-contradictory?"

**THE OPERATOR'S WORDS, VERBATIM:**
> *"audit everything now"* · *"rip this fucking trash apart"* · *"log all failure"*

| id | primitive | the question |
|---|---|---|
| PS1 | `noul` | Does this symbol/field/module have **zero production consumers**? |
| PS2 | `noul` | Does this comment/docstring **assert** a property the code below lacks? |
| PS3 | `choice` | How many definition sites does this constant have? `one` / `two` / `several` / `many` |
| PS4 | `noul` | Does this error handler **swallow** (no named token, no test)? |
| PS5 | `noul` | Is this module imported but **unreachable** from the entry point? |
| PS6 | `noul` | Does a test root sit under a **worktree/checkpoint** path? |

**THE LADDER:** the 7 hunt lists → Jev judges each candidate → the count is the ledger.
**THE CLOSURE TEST:** every candidate classified; the count per class recorded.
**THE RESIDUAL SHAPE:** the per-class counts (the campaign's: dead 15 · duplicate 7 · contradiction 7 · …).
**★ THE ORIGIN: RedTeamBravo's 65 findings. THE DETERMINISTIC GREPS DO THE DETECTION; JEV DOES
THE DECISION** (the `jev-decision-gate-firewall` law: a lexicon detects, Jev decides, code enforces).

### PLAYBOOK D · CONTRACT — "does the artifact do what it claims?"

**THE OPERATOR'S WORDS, VERBATIM:**
> *"you still havent explain HOW the decisons were even ABLE to be discarded"*
> *"read the entire fucking original build package"*

| id | primitive | the question |
|---|---|---|
| PC1 | `noul` | Does a producer's output have a **consumer** for every key it emits? |
| PC2 | `noul` | Does the interface's TYPE permit the consumer to skip a field silently? |
| PC3 | `noul` | Does the composition root accept its **output** as an input (an inverted dependency)? |
| PC4 | `noul` | Does a critical-path component have an **off-switch**? |
| PC5 | `noul` | Does the artifact **certify** a property (a "nothing is stubbed" comment)? |
| PC6 | `noul` | Does a docstring describe a pipeline the body does not implement? |

**THE LADDER:** enumerate producers → count consumers per key → type-check the binding → read the
composition root.
**THE CLOSURE TEST:** every emitted key has ≥1 production consumer, or the producer is flagged.
**THE RESIDUAL SHAPE:** `producers: N · keys: M · unconsumed: K`.
**HANDOFFS:** the unconsumed keys become firewall F2 candidates.
**★ THE ORIGIN: the 17-questions-2-read finding. PC1 + PC2 TOGETHER ARE THE MECHANICAL ANSWER TO
"HOW WAS DISCARDING POSSIBLE."**

## §26 · THE FIVE STRUCTURAL GAPS (why nothing existing solves this)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  GAP 1 · NO PAIR-ENUMERATION                                                          │
│    nothing enumerates the (claim, check, artifact) triples of a build.                │
│    the campaign found them BY HAND, over 3 auditors and 5 hours.                      │
│                                                                                       │
│  GAP 2 · NO AIM-JUDGMENT                                                              │
│    nothing asks "is this check's target the claim's subject?"                          │
│    every false-green in the campaign would have been caught by that ONE question.      │
│                                                                                       │
│  GAP 3 · NO FAIL-PROBE                                                                │
│    nothing perturbs a check to prove it CAN fail.                                      │
│    "15/15 at 0.000p" survived every test the build ran — because none perturbed it.    │
│                                                                                       │
│  GAP 4 · NO ENFORCEMENT                                                               │
│    the audit skills produce reports. A report does not block a commit.                 │
│    the campaign's findings were ACCEPTED, not BLOCKED.                                 │
│                                                                                       │
│  GAP 5 · NO SELF-MEASUREMENT                                                          │
│    the auditor's own instruments are never measured.                                   │
│    the 1.8% figure, the 587ms measurement, the two false positives — all unmeasured    │
│    until the operator challenged them.                                                 │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**THE SIBLING TABLE (what exists, and the gap each leaves):**

| existing thing | what it does | what it does NOT do (= this design's spec) |
|---|---|---|
| `typesafe-jev-judge-wiring` | the measured API contract: `noul`/`choice`/`score`, the `.noul` answer field, the key-resolution trap, the two-proof law | **does not define WHAT to judge.** It is transport. |
| `jev-scale-judgment-pipeline` | deterministic-first narrowing: index → select → judge → materialize → ledger | **does not enumerate CLAIMS.** It narrows a corpus, not a build's assertions. |
| `jev-decision-gate-firewall` | the 3-layer architecture (lexicon detects, Jev decides, code enforces) + a 6-node derailment tree | **does not cover AUDIT findings.** Its tree polices an agent's behaviour, not a build's evidence. |
| `typesafe-jev-batching` | N inputs × N questions in ONE request | **does not define the audit question set.** |
| `jev-manager-operator` | the `jm` CLI + MCP: point at a corpus, find instances, triage, judge | **does not know what a false-green IS.** It finds things; it does not know which finding is a defect. |
| `red-team-slop-audit` | the PROSE procedure: dispatch 2 auditors, 7 hunt lists, the 25 classes | **does not gate.** It is a procedure a human/agent follows; nothing blocks. |
| `code-review` / `zero-trust-audit` | human-readable audit skills | all produce REPORTS; **none produce an EXIT CODE** |
| `extract-meta-patterns` MODE 2 | the forensic autopsy procedure | a document, not a tool |
| `qwen-code-audit` / `ocr` | an LLM code-review gate | reviews CODE; **cannot see that an ORACLE is tautological** — the defect is in the RELATIONSHIP between a claim and its check, not in the code |

**THE DIFFERENTIAL'S VERDICT: five gaps, none filled by any existing artifact. The design is not a
duplicate.**

## §27 · THE AUDIT LOOP (the macro pattern — one pass over a build's claims)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE AUDIT LOOP — one pass over a build's claims                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   ┌─ 1. ENUMERATE ─────────────────────────────────────────────────────────────┐     │
│   │  L1 reads DISK: every numeric claim in the docs, every test's asserted     │     │
│   │  value, every artifact's scenarios, every floor the authority states.      │     │
│   │  OUTPUT: the CLAIM LEDGER — N claims, each with its source file:line.      │     │
│   └────────────────────────────────────────────────────────────────────────────┘     │
│                               v                                                       │
│   ┌─ 2. PAIR ──────────────────────────────────────────────────────────────────┐     │
│   │  for each claim, find the CHECK that produces it (the test, the metric,    │     │
│   │  the gate, the artifact field).                                            │     │
│   │  OUTPUT: (claim, check, artifact) triples. A claim with NO check is        │     │
│   │  recorded as UNCHECKED — it is not skipped.                                │     │
│   └────────────────────────────────────────────────────────────────────────────┘     │
│                               v                                                       │
│   ┌─ 3. JUDGE ─────────────────────────────────────────────────────────────────┐     │
│   │  JEV, one batched call, the fixed question set (§13), the triple as STATE. │     │
│   │  Q1 is the aim question: does the check's TARGET = the claim's SUBJECT?    │     │
│   │  OUTPUT: a probability per question, per triple.                           │     │
│   └────────────────────────────────────────────────────────────────────────────┘     │
│                               v                                                       │
│   ┌─ 4. PROBE ─────────────────────────────────────────────────────────────────┐     │
│   │  for each check judged AIMED (Q1 high), run the FAIL-PROBE: perturb the    │     │
│   │  input the claim is about; the check MUST flip.                            │     │
│   │  OUTPUT: CAN-FAIL | CANNOT-FAIL. A CANNOT-FAIL check demotes its claim.    │     │
│   └────────────────────────────────────────────────────────────────────────────┘     │
│                               v                                                       │
│   ┌─ 5. ENFORCE ───────────────────────────────────────────────────────────────┐     │
│   │  L3 maps probabilities to ACTIONS: BLOCK the commit / DEMOTE the claim /   │     │
│   │  LEDGER. Writes one ledger row per triple. Exit code is the verdict.       │     │
│   └────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  THE STOP CONDITION (measured, never a feeling):                                       │
│    EVERY claim has a check  AND  every check is judged AIMED  AND                      │
│    every aimed check FLIPPED under its probe  OR  the claim is DEMOTED to              │
│    UNPROVEN with the demotion written to the ledger.                                   │
│    "The report looks thorough" is NOT a stop. The ledger's coverage ratio is.          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**★ THE COVERAGE LINE (the honesty signature):**
```
CLAIMS: 412   CHECKED: 388   UNCHECKED: 24   AIMED: 341   CAN-FAIL: 338   DEMOTED: 50
COVERAGE: 94.2%   FALSE-GREEN-RISK: 50 claims demoted   INSTRUMENT-ERROR: see §16
```
**A flat coverage ratio across passes means the denominator was written to match what was already
done** — the signature the founding `go-deeper` blueprint names.

### §27.1 · THE ARTIFACT — the audit ledger (the observable output)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE AUDIT LEDGER — <project>/forensic/JEV_AUDIT_<date>.md                            │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│   §0  THE AUTHORITY INVENTORY        every doc, its mtime, its status, its pivot       │
│                                      records; THE LIVE ONE named                       │
│   §1  THE CLAIM LEDGER               N claims · each with file:line · its check ·      │
│                                      UNCHECKED if none                                 │
│   §2  THE TRIPLE JUDGMENT TABLE      per triple: Q1..Q6 probabilities · the verdict    │
│   §3  THE FAIL-PROBE RESULTS         per aimed check: CAN-FAIL | CANNOT-FAIL           │
│   §4  THE DEMOTION LIST              every claim demoted, with the reason              │
│   §5  THE COVERAGE LINE              claims · checked · aimed · can-fail · demoted     │
│   §6  THE INSTRUMENT-ERROR LEDGER    §16, filled                                       │
│   §7  THE NAMED RESIDUAL             what was not enumerated                           │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  THE VERDICT LINE:                                                                     │
│    CLAIMS: 412  CHECKED: 388  UNCHECKED: 24  AIMED: 341  CAN-FAIL: 338  DEMOTED: 50    │
│    COVERAGE: 94.2%   RESIDUAL: 24 unchecked claims (listed)                            │
│    EXIT: 1 (50 demotions)                                                              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```
**★ THE EXIT CODE IS THE VERDICT.** A demotion list is non-empty → exit 1 → the commit/ship gate
blocks. **THIS IS WHAT TURNS THE AUDIT FROM A REPORT INTO A GATE.**

## §28 · THE COMPOSITION MAP (owns / hands off / the boundary)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                          jev-audit (THIS DESIGN)                                      │
│                                   |                                                   │
│        OWNS                       |              HANDS OFF                            │
│  ─ the claim enumeration          |  ─ the transport contract   -> jev-judge-wiring    │
│  ─ the (claim,check,artifact)     |  ─ the corpus narrowing      -> jev-scale-...       │
│    triple model                   |  ─ the batching mechanics    -> jev-batching       │
│  ─ the 6-question aim set         |  ─ the 3-layer gate pattern  -> jev-decision-...   │
│  ─ the fail-probe recipes         |  ─ the 25 slop CLASSES       -> red-team-slop-...  │
│  ─ the demotion + exit-code law   |  ─ the 7 false-green CLASSES -> evidence-failure-… │
│  ─ the instrument-error ledger    |  ─ the autopsy FORMAT        -> extract-meta-…     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  THE BOUNDARY: this design OWNS the AUDIT SUBJECT (what to judge about a build's        │
│  evidence). It OWNS NOTHING about how to call Jev, how to batch, or how to enforce —    │
│  those are the four sibling skills, consumed not reimplemented.                         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│  THE NO-DUPLICATION LAW: if a section here restates a sibling's content, it is a        │
│  second, staler source of truth. This design CITES; it does not copy.                   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```
**★ THE PRECEDENCE RULE:** `jev-decision-gate-firewall` owns the **agent's behaviour** gates (tool
calls, reasoning, commits). **This design owns the BUILD's EVIDENCE gates.** Where both apply (a
commit that carries a claim), **this design's L-9 runs first** (the doc-vs-log diff), then the
firewall's F4.

## §29 · THE TRIGGER SURFACE (literal phrases, forward + negative)

**FORWARD (the operator's actual words, verbatim):**
> *"audit everything"* · *"rip this apart"* · *"find all the slop"* · *"why did this pass"* ·
> *"is this theatrical"* · *"how did this derail"* · *"what is actually wrong"* · *"log all
> failure"* · *"i expect 5000+ lines"* · *"read the entire fucking original build package"* ·
> *"how was this even allowed"* · *"these are likely superseded"*

**NEGATIVE (do NOT fire):**
- a single-file bug → `debugging-and-error-recovery`
- a code review of a diff → `code-review`
- a security review → `security-reviewer`
- designing a new thing → `blueprinting`
- checking whether a claim is TRUE in isolation → `zero-trust-audit` (this design checks whether the
  CHECK can fail)

**THE ARGS:** `<target-root>` (required) · `--authority <path>` (optional; if absent, the L1 builder
discovers it) · `--budget <n>` (the max triples; default = all) · `--probe` (run the fail-probes;
default on).

## §30 · THE VERBATIM CODE WALK (the three files, function by function)

**Source: `src/jev/{ticket,gate,lifecycle}.ts` + `tests/jev.test.ts` (all on disk, committed
`73937b6`). This section is the code as built — the mechanisms, quoted.**

### §30.1 · `gate.ts` — THE DECIDE ALGORITHM (the core, verbatim)

```ts
/**
 * THE ALGORITHM — four steps, in order, each one cheaper than the next:
 *
 *   STEP 1 · THE DETERMINISTIC PRE-FILTER   (pure code, FREE, no model)
 *     · is the act in the allowed verb set?          -> no  = REFUSE
 *     · is the target inside the authorized scope?   -> no  = REFUSE (the escape check)
 *     · is the budget available?                     -> no  = REFUSE
 *     ★ A REFUSAL HERE COSTS NOTHING. Most drift dies at this step.
 *
 *   STEP 2 · THE SPEC CHECK                 (pure code, FREE)
 *     · does the declared intent trace to a spec item? -> no = REFUSE
 *     ★ This is the step the whole derailment class dies at: an act with no spec
 *       backing is not ticketed.
 *
 *   STEP 3 · THE JEV JUDGMENT               (the model, ~100ms, ONLY when 1+2 pass)
 *     · does the intent MATCH the spec requirement?
 *     · is this the SMALLEST act that satisfies it?
 *     ★ The judge is consulted ONLY on a pre-filtered, spec-backed intent. The gray
 *       zone is tiny by construction — that is the cost model.
 *
 *   STEP 4 · THE ISSUANCE                   (pure code)
 *     · a ticket, BOUND to the exact target, ONE-SHOT, with a TTL.
 *
 * ★ THE ANTI-MISFIRE PROPERTY: the gate is invoked by an ACTION DECLARATION, never by
 *   prose. A sentence produces no declaration, so the gate is never called on a sentence.
 */
```

**THE IMPLEMENTATION (verbatim, `JevGate.decide`):**
```ts
async decide(intent: IntentDeclaration): Promise<GateDecision> {
    // ── STEP 1 · THE DETERMINISTIC PRE-FILTER (free) ─────────────────────────────
    if (!ALLOWED_ACTS.includes(intent.act as Act)) {
        return this.refuse(TICKET_TOKENS.NO_TICKET, `the act "${intent.act}" is not a ticketable verb`);
    }
    if (!inScope(intent.target, this.cfg.roots)) {
        return this.refuse(TICKET_TOKENS.SCOPE_ESCAPE, `the target "${intent.target}" is outside every authorized root`);
    }
    if (this.store.remaining() <= 0) {
        return this.refuse(TICKET_TOKENS.BUDGET, `the ticket budget is exhausted (${this.store.remaining()} remaining)`);
    }

    // ── STEP 2 · THE SPEC CHECK (free) ───────────────────────────────────────────
    if (!specBacked(intent, this.cfg.specText)) {
        return this.refuse(
            TICKET_TOKENS.NOT_IN_SPEC,
            `the intent cites no spec anchor whose quote appears in the spec ` +
                `(${intent.specAnchor ? `"${intent.specAnchor.quote.slice(0, 40)}" not found` : "no anchor given"})`,
        );
    }

    // ── STEP 3 · THE JEV JUDGMENT (the model — ONLY when 1+2 passed) ─────────────
    let probability: number | null = null;
    if (this.cfg.judge) {
        try {
            const v = await this.cfg.judge(intent, this.cfg.specText);
            probability = v.probability;
            const threshold = this.cfg.actThreshold ?? 0.85;
            if (v.probability < threshold) {
                return this.refuse(
                    TICKET_TOKENS.NOT_IN_SPEC,
                    `the judge scored the intent ${v.probability.toFixed(3)} < ${threshold} ` +
                        `(the intent does not match the spec requirement)`,
                );
            }
        } catch (e) {
            // ★ FAIL-CLOSED: a judge that cannot answer cannot authorize.
            return this.refuse(TICKET_TOKENS.JUDGE_UNAVAILABLE, `the judge threw: ${String(e).slice(0, 120)}`);
        }
    }

    // ── STEP 4 · THE ISSUANCE ────────────────────────────────────────────────────
    const ticket = this.store.issue({
        act: intent.act as Act,
        target: intent.target,
        scope: this.cfg.roots[0] ?? "",
        intent: intent.why,
        gate: "edit-gate",
        probability,
    });
    return { kind: "ISSUE", ticket };
}
```

**★ THE TWO PURE HELPERS (the deterministic core):**
```ts
/** Does the target live under one of the authorized roots? A pure string check. */
function inScope(target: string, roots: readonly string[]): boolean {
    return roots.some((r) => target === r || target.startsWith(r.endsWith("/") ? r : r + "/"));
}

/** Does the intent's spec quote actually appear in the spec text? A pure string check. */
function specBacked(intent: IntentDeclaration, specText: string): boolean { /* the ≥8-char substring check */ }
```
**★ WHY `inScope` IS EXACT-PREFIX, NOT `startsWith`:** a bare `startsWith("/repo/src")` would admit
`/repo/src-evil/x`. The `r + "/"` terminator is the **prefix-collision guard** — and it has its own
test (`the prefix collision` in the attack block).

### §30.2 · `ticket.ts` — THE REFUSAL TOKEN GRAMMAR (verbatim)

```ts
/** ★ THE REFUSAL TOKENS — frozen, greppable, testable. A sentence would not be. */
export const TICKET_TOKENS = {
    NO_TICKET: "UNTICKETED_DRIFT",
    WRONG_TARGET: "TICKET_TARGET_MISMATCH",
    WRONG_ACT: "TICKET_ACT_MISMATCH",
    EXPIRED: "TICKET_EXPIRED",
    ALREADY_USED: "TICKET_ALREADY_CONSUMED",
    SCOPE_ESCAPE: "TICKET_SCOPE_ESCAPE",
    OUT_OF_SCOPE: "INTENT_OUT_OF_SCOPE",
    NOT_IN_SPEC: "INTENT_NOT_IN_SPEC",
    BUDGET: "TICKET_BUDGET_EXHAUSTED",
    JUDGE_UNAVAILABLE: "JUDGE_UNAVAILABLE",
} as const;
```

**★ THE TEN TOKENS — the whole system speaks ONE grammar:**

| the token | fired when | the test that proves it |
|---|---|---|
| `UNTICKETED_DRIFT` | a run presents no ticket | block 2: "no ticket" |
| `TICKET_TARGET_MISMATCH` | the run's target ≠ the ticket's | block 2: "wrong target" |
| `TICKET_ACT_MISMATCH` | the run's act ≠ the ticket's | block 2: "wrong act" |
| `TICKET_EXPIRED` | the ticket's TTL elapsed | block 2: "the expiry" |
| `TICKET_ALREADY_CONSUMED` | the ticket was already used (one-shot) | block 2: "the replay" |
| `TICKET_SCOPE_ESCAPE` | the target is outside every root | block 1: "the scope escape" |
| `INTENT_OUT_OF_SCOPE` | the intent names no authorized scope | (the OUT_OF_SCOPE path) |
| `INTENT_NOT_IN_SPEC` | no spec anchor, or the judge scored below threshold | block 1: "the fabricated anchor", "the low score" |
| `TICKET_BUDGET_EXHAUSTED` | `remaining() <= 0` | block 1: "the budget" |
| `JUDGE_UNAVAILABLE` | the judge threw (fail-closed) | block 1: "the judge down" |

**★ THE LEDGER IS THE PRODUCT:**
```
the ledger answers which act was authorized, on what target, by which gate,
at what probability, and whether it was used.
★ A ticket with no ledger row is unproven.
```
`TicketStore` exposes: `issue()` · `consume()` · `find()` · `remaining()` · `noteRefusal()` ·
`ledger()` · `stats()`.
**★ THE ONE-SHOT RULE is a `Set`; the TTL is `expiresAt`; the budget is `remaining()`.**

### §30.3 · `lifecycle.ts` — THE THREE CHECKPOINTS (verbatim checks)

```ts
const COMMIT_CHECKS = [ "spec_coverage", "deploy_current", "no_staged_outside_spec" ];
const TEST_CHECKS   = [ "exit_zero", "negative_half", "self_certified" ];
const PR_CHECKS     = [ "findings_dispositioned", "not_empty_diff" ];
```
**★ THE ORDER THAT MATTERS: the checks run FIRST (free); the judge runs ONLY if they pass.**
This is the cost model again — the model is consulted last, on the smallest possible set.

| the stage | the check | what it asserts | the class it kills |
|---|---|---|---|
| commit | `spec_coverage` | the diff implements a spec item | the unread package (M-1) |
| commit | `deploy_current` | the deployed artifact postdates the source | source-green ≠ runtime-green |
| commit | `no_staged_outside_spec` | nothing staged outside the spec's scope | scope creep |
| test | `exit_zero` | the suite's exit code | a suite that "passes" with failures |
| test | `negative_half` | the adversarial cases exist | the happy-path-only suite |
| test | `self_certified` | the author's own claim is not the proof | the self-measuring process (M-6) |
| pr | `findings_dispositioned` | every finding is FIXED or ADJUDICATED | the audit treadmill (M-4) |
| pr | `not_empty_diff` | the PR changes something | the phantom delivery |

### §30.4 · `tests/jev.test.ts` — THE FIVE TEST BLOCKS (24 passing)

```
1  THE ATTACKS (each refused)
     the bad verb · the scope escape · the prefix collision · the fabricated anchor ·
     the low score · the judge down · the budget
2  UNTICKETED DRIFT
     no ticket · wrong target · wrong act · the replay · the expiry
3  THE LEGIT PATH (must pass)
     a spec-backed in-scope intent → ISSUE → ALLOW
4  ★ THE MISFIRE PROOF
     a benign sentence → tickets=0 · refusals={}
5  THE LIFECYCLE GATES
     the 7 refusals + the clean-suite ISSUE
```
**★ BLOCK 4 IS THE ONE THAT MATTERS MOST: `a benign sentence → tickets=0 · refusals={}`.**
This is the test that proves the anti-misfire property — the exact failure mode that killed the
TTSR phrase layer. **The gate is never called on prose, so it can never misfire on prose.**

### §30.5 · THE MISFIRE PROOF (the architectural claim, restated)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE OLD (what failed):  the agent ACTS → we DETECT → we judge → we block             │
│                          ★ requires catching the drift AFTER it happens               │
│                          ★ a regex reads prose → fires on a MENTION                   │
│                                                                                       │
│  THIS (what works):      the agent WANTS → it needs a TICKET → no ticket = NO ACT     │
│                          ★ the drift cannot happen because the act cannot start       │
│                          ★ a sentence produces NO declaration → the gate is NEVER     │
│                            CALLED ON A SENTENCE → MISFIRE IS STRUCTURALLY IMPOSSIBLE  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## §31 · THE MODEL-STACK SLOP INVENTORY (the measured 9)

**Source: `PLUTUS/V6_BUILD/forensic/MODEL_STACK_REPORT.md`. The nine defects done to the models —
each a real instance of a class the design now gates.**

| # | the slop | the measured consequence | the class |
|---|---|---|---|
| **SLOP-1** | **the decider's CUDA graphs were OFF** (the biggest single defect) | 400-600ms eager decisions against a 500ms gate | the config gate |
| SLOP-2 | `Limite` runs `enforce_eager=True` | the SAME defect, unfixed | the config gate |
| **SLOP-3** | **the context window was cut from 131k → 16k — SILENTLY** | a capability removed with no record | the honest-number law (L-9) |
| SLOP-4 | the state was 4× the spec (fixed, but it caused the OOM) | the OOM | the spec-delta gate |
| SLOP-5 | `DECIDER_MAX_STATE_TOKENS` was 32768 (4× the documented 8192) | 4× the memory | the magic-number class (D) |
| SLOP-6 | the model was substituted without checking the 0.8b | a 3.3× oversize | the name-collision model (M-2) |
| SLOP-7 | `causal_conv1d` is NOT installed (the optimized kernel) | the slow path | the environment class |
| SLOP-8 | **FP8 is UNAVAILABLE on this GPU** (and the docs implied otherwise) | a false capability | the impossible-environment class (S-15) |
| SLOP-9 | vLLM's `--swap-space` and `--cpu-offload-gb` are unused (correctly, but unexamined) | an unexamined decision | the read-first class |

**★ THE OPERATOR'S THREE CLAIMS, MEASURED AGAINST THE EVIDENCE:**

| the claim (verbatim) | the measured verdict |
|---|---|
| *"vLLM can run on system RAM; it should not be on GPU unless it is tiny"* | measured against the evidence (§2 of the report) |
| *"the 4 GB footprint is mostly KV pre-allocation"* | measured — the KV vs weights split |
| *"use vLLM's built-in KV cache compression (the 2× settings)"* | measured against the vLLM surface |

**★ WHY NOT vLLM / BeeLlama (the honest blocker):** recorded in §0.1 of the report — a named
blocker, not a silent substitution. **This is the loud-fail law in a real incident.**

## §32 · THE GLOSSARY (the vocabulary, defined once)

| the term | its definition |
|---|---|
| **the Choice** | a decision primitive: ONE option from a fixed set (≤255), answered as a full probability distribution |
| **the Score** | a computation primitive: a value on a 2-10 level rubric, answered as a probability-weighted position |
| **the Noul** | the enforcement primitive: ONE number 0..1 (a binary), the cleanest gate signal |
| **the gate** | the 4-step decision algorithm (pre-filter → spec → judge → issue) |
| **the ticket** | the unit of authorization: bound to one act on one target, one-shot, with a TTL |
| **the ledger** | the append-only record of every issuance, consumption, and refusal |
| **the refusal token** | a frozen greppable string naming why an act was refused (10 of them) |
| **the 255** | the master-context node set, compressed from the approved package's graphs |
| **the populate step** | the mandatory lifecycle gate: mint the graphs → score ≥0.96 → compress → score again → load |
| **the accuracy scorer** | target vs reference → is the graph TRUE to the spec? |
| **the density scorer** | target vs reference → is the graph FULL? nothing dropped? |
| **the master blueprint** | the post-hoc architecture document of a built system |
| **the bible** | the engineered reference: what is TRUE about the machinery |
| **the operator manual** | how to USE the machinery (procedures, symptom→action, recovery) |
| **the pre-context** | the delivered cards, preserved verbatim, as the build's ground truth |
| **the false-green** | a claim whose check is aimed at a target it cannot miss |
| **the (claim, check, artifact) triple** | the unit of audit: what is claimed, what checks it, what the check reads |
| **the fail-probe** | a perturbation that MUST flip a check; a check that survives is CANNOT-FAIL |
| **the aim question (Q1)** | "does the check's target equal the claim's subject?" |
| **the instrument-error ledger** | the auditor's own measured false-positive / false-negative rate |
| **the coverage line** | `CLAIMS · CHECKED · UNCHECKED · AIMED · CAN-FAIL · DEMOTED` — the honesty signature |
| **the demotion** | a claim reduced to UNPROVEN because its check cannot fail |
| **the treadmill** | a fix loop whose findings do not converge because the fix IS the next input |
| **the phantom fix** | an edit written and never applied (the unasserted-replace silent no-op) |
| **the unread package** | the root pattern: a plan authored without reading the project's existing specs |
| **the name-collision model** | a name from one document + a size from another, merged by an LLM |
| **the collapsed pipeline** | a staged data-dependent pipeline flattened into a bag of answers |
| **the self-measuring process** | a process that optimizes its narrative while its verification stays blind |
| **the evidence-aimed-where-it-cannot-fail** | an instrument pointed at a target it cannot miss |
| **KEV** | the local decision substrate (onnx-community/kev-0.6b-ONNX), same contract as Jev, offline |
| **Jev** | the hosted decision substrate (api.typesafe.ai), the same contract, requires credits |
| **the substrate** | the decision engine underneath the gate (Jev or KEV) |
| **the declaration** | the structured intent the agent emits before acting (never prose) |
| **the misfire** | a gate firing on benign prose (the failure this design makes structurally impossible) |

## §33 · THE THREE LIFECYCLE GATES — the end-to-end flow

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE FULL LIFECYCLE (the mandatory order, per the operator's whiteboard)              │
│                                                                                       │
│    blueprint with the operator                                                        │
│         │                                                                             │
│         ▼                                                                             │
│    GENERATE the build package                                                         │
│         │                                                                             │
│         ▼                                                                             │
│    ★ THE OPERATOR APPROVES IT                                                         │
│         │                                                                             │
│         ▼                                                                             │
│    ★★ POPULATE THE JEV GATES  (mandatory, mechanically gated — NOTHING proceeds)      │
│         ① the two graphs minted from the package                                      │
│         ② accuracy + density scored ≥ 0.96 (else rebuild)                             │
│         ③ the graphs compressed → 255 nodes                                           │
│         ④ the 255 nodes accuracy + density scored ≥ 0.96 (else rebuild)               │
│         ⑤ the 255 nodes loaded into the choice array                                  │
│         │                                                                             │
│         ▼                                                                             │
│    pin the goal prompt                                                                │
│         │                                                                             │
│         ▼                                                                             │
│    GO — every tool call, commit, test, PR, checkpoint, ship claim audited against      │
│         the 255                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**★ THE THREE GATES IN THE FLOW, AND WHAT EACH KILLS:**

| the gate | when | the input | what it kills |
|---|---|---|---|
| **the edit gate** | before every tool call | the act declaration + the spec | unticketed drift, scope escape, spec-less acts |
| **the commit gate** | before every commit | the staged diff + the spec | spec coverage gaps, stale deploys, staged-outside-spec |
| **the test gate** | before accepting a suite | the exit code + the test set | the happy-path-only suite, the self-certified claim |
| **the pr gate** | before the PR | the findings + the diff | undispositioned findings, the empty diff |

**★ THE POPULATE GATE (the mandatory step 0, mechanically enforced):** a host hook REFUSES every
tool call until the completion marker exists. **NOTHING PROCEEDS UNTIL POPULATED.**

## §34 · THE WORKED EXAMPLE — the campaign, walked through the machinery

**TARGET:** `PLUTUS/V6_BUILD`
**THE CLAIM:** *"latency < 500ms, mean 0.058ms (8639× headroom)"* (from `EVIDENCE_STATE.md`)

| step | what ran | the output |
|---|---|---|
| **1 ENUMERATE** | the extractor parsed the ship docs + canon docs | the claim ledger: **412 claims**; this one is `#217`, source `context_management/EVIDENCE_STATE.md` |
| **2 PAIR** | the extractor found the check: `tests/test_decision_latency.py` | the triple `(claim #217, test_decision_latency, its stdout)` |
| **3 JUDGE** | Jev, batched, the six questions | **Q1 AIM 0.18** (the check reads the circuit **without** the model; the claim is about the **live** circuit) · **Q2 FAILABILITY 0.91** (the check can fail) · **Q3 ARTIFACT 0.95** (it reads stdout) · **Q5 PROVENANCE 0.12** (`the-code-under-test` — the circuit's own offline path) |
| **4 PROBE** | the fail-probe enabled the mandatory model and re-ran | **418.6ms / 419.1ms / 419.3ms quiet; 587ms under GPU contention** — a **7,000×** move |
| **5 ENFORCE** | Q1 0.18 < 0.70 → **DEMOTE** the claim to UNPROVEN; **BLOCK** the ship gate | ledger row written; **exit 1** |

**★ THE SHALLOW vs DEEP CONTRAST (this is the whole value proposition):**
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  THE SHALLOW AUDIT (what was done FIRST, before the operator challenged it)           │
│    read the doc: "latency 0.058ms" → noticed it looked fast → reported it              │
│    SCORE: 1 finding, 0 probes, 0 demotion law, 0 instrument-error ledger              │
│                                                                                       │
│  THE DEEP AUDIT (this design)                                                         │
│    412 claims enumerated → 388 paired → 6 questions judged per triple →                │
│    fail-probe every aimed check → 50 demoted → exit 1 → instrument-error              │
│    ledger filled (3 of the auditor's OWN failures recorded)                           │
│    SCORE: 50 demotions, 24 unchecked claims named, 3 instrument failures published     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**★ AND THE SAME MACHINERY ON THE AUDITOR'S OWN ERROR (the reflexive case):**
> the claim *"1.8% compliance with the commissioned package"*
> → **Q1 AIM 0.21** (the check graded against set A; the claim is about *"the commissioned
> package"*, which is set C)
> → **Q5 PROVENANCE 0.05** (`superseded authority`)
> → **INSTRUMENT 4: SUPERSEDED-AUTHORITY**
> → **DEMOTE**.
> **The design catches the error that prompted it.** That is the test of a real reduction.

## §35 · THE WASTE CENSUS (the measured cost of the founding failure)

**Source: `FAILURE_LEDGER_V6.md §9.2`, measured with `git log` and `wc`:**

```
$ git log --oneline | sed -E 's/^[a-f0-9]+ ([a-z]+).*/\1/' | sort | uniq -c | sort -rn
     49 docs
     46 fix
     13 feat
     11 chore
      2 test
      1 build
      7 Merge (worker branches)
   ----
    130 commits total

$ git log --oneline | grep -cE 'audit round'
38

$ find . -name '*.md'  -not -path './vendor/*' -not -path './Checkpoints/*' | wc -l  → 69 files, 6,233 lines
$ find . -name '*.py'  -not -path './vendor/*' -not -path './Checkpoints/*' | wc -l  → 120 files, 12,891 lines
```

**★ READ: 46 of 130 commits are `fix`; 38 are `audit round`. 59% of the build's commits are repairs
and their paperwork. The build's largest single output is its own post-mortem.** A build whose
dominant artifact is the record of its own corrections is a **recovery loop, not a construction.**

**★ THE FINAL FINDING COUNT (the primary audit):**

| § | the section | the findings |
|---|---|---|
| §3.1 | the decision model | F-001..F-007 (7) |
| §3.2 | fabricated evidence | F-008..F-012 (5) |
| §3.3 | the declared pipeline | F-013..F-014 (2) |
| §3.4 | duplicated authority | F-015..F-017 (3) |
| §3.5 | the test suite | F-018..F-022 (5) |
| §3.6 | doc-contract false greens | F-023..F-024 (2) |
| §3.7 | the self-measuring metric | F-025 (1) |
| §8 | the independent auditors | see §23.6 |
| **total (primary)** | | **25** |

**★ THE FULL BATTERY (the auditor's own run, this session):**
```
$ bash tests/run_all.sh
PASS=31 FAIL=2 BLOCKED=1
FAILED: test_decider_live_pipeline  test_decision_latency
BLOCKED: test_finetuned_golden_precision
```
**★ THE FAILURES ARE THE TWO CONDITIONS THE AUDIT PREDICTED** — the live pipeline and the latency.
**A suite that fails exactly where the audit says it must is a suite that is telling the truth.**

## §36 · THE OPEN DECISIONS (forks with recommended defaults)

| # | the fork | the options | the recommended default | operator? |
|---|---|---|---|---|
| **OD-1** | **Jev or the local KEV substitute?** | `api.typesafe.ai` (real Jev, needs a key) · `kev-0.6b-ONNX` (local, no key) | **Jev primary, KEV fallback** — one type, two implementations | **YES** — cost vs availability |
| **OD-2** | **When does the aim-judge run?** | on-demand · on every commit · on every ship claim | **on every ship claim + every commit touching a doc** | no (pin it) |
| **OD-3** | **The fail-probe's scope** | every aimed check (slow) · a sampled subset (fast) | **every aimed check on a ship claim; sampled on a commit** | no |
| **OD-4** | **The demotion's teeth** | demote-in-the-ledger (advisory) · block-the-commit (hard) | **hard-block on ship; advisory on a working commit** | **YES** — the enforcement posture |
| **OD-5** | **The origin corpus** | ship the 92 adjudicated findings as ground truth · build a fresh corpus | **ship the 92** — the only labelled set that exists | no |
| **OD-6** | **Bundle as a skill or a tool?** | a skill (the workflow) · an extension tool (a callable) · both | **both** — the skill is the procedure, the extension registers `jev_audit` | no |

**★ THE FORKS THAT NEED THE OPERATOR: OD-1 (the judge's identity) and OD-4 (the enforcement
posture).** The rest are taken on the default and stated so they can be overruled.

## §37 · THE DESIGN'S SELF-CHECK (the law run against itself)

**THE DESIGN'S OWN LAW RUN AGAINST THE DESIGN:** *a claim is false-green when its check is aimed at
a target it cannot miss.* Applied here:

| this design's claim | its check | aimed? |
|---|---|---|
| "the reduction explains instances never mentioned" | *does it cover the auditor's own error?* | **YES** — §34's reflexive case |
| "no existing artifact fills the gaps" | §26's sibling table, 9 rows | **YES** — each row's `does NOT` cell |
| "the fail-probe catches the false greens" | §34's worked example, one claim | **PARTIAL** — one of 7 classes walked, not all 7 |
| "INSTRUMENT 5 measures the error rate" | **NOTHING YET** | **NO — the ledger is EMPTY (§16)** |

**★ THE HONEST FINDING: the instrument-error ledger is SPECIFIED AND UNMEASURED. By the design's
own L-7, THE AUDIT IS INCOMPLETE UNTIL IT IS FILLED.** That is stated, not hidden.

### §37.1 · THE NAMED RESIDUAL (what is NOT built)

1. **UNEXERCISED:** the aim-judge has never been run against the real API — the question set is
   designed, not validated. The origin replay is the unrun acceptance test.
2. **SPECIFIED-BUT-NOT-BUILT:** all 7 audit scripts are specified; **one exists**
   (`state_authority.py`, the L1 half). Six remain.
3. **NEVER ENUMERATED:** the design covers claims in **docs, tests and artifacts**. It does **NOT**
   cover: claims in commit messages, claims in a chat reply, claims in a subagent's return.
   **Three claim sources are unhandled.**
4. **THE COST IS UNMEASURED:** ~40 questions × N triples batched is *assumed* cheap (one request
   per event). **No measurement exists.**
5. **THE PRECEDENCE with `jev-decision-gate-firewall` is ASSERTED (§28), not tested** — both gate a
   commit and the order matters.

## §38 · THE INSTRUMENT-ERROR LEDGER (the precondition, L-7)

| the instrument | its measured error rate | the known misses |
|---|---|---|
| the pair-extractor | *to be measured on the origin replay* | — |
| the aim-judge | *to be measured* | — |
| the fail-probe | *to be measured* | — |

**★ IN THE CAMPAIGN, THIS LEDGER WAS EMPTY UNTIL THE OPERATOR CHALLENGED IT.** Three instrument
failures then surfaced:
1. a regex false positive (a stray binding);
2. a `grep -c assert` misread (the suite uses a hand-rolled idiom);
3. **the largest: a compliance figure against a superseded authority.**
**L-7 exists so the third is impossible to omit.**

## §39 · THE INVERSION — virtue into mechanism

**★ THE BAD DESIGN:** *"be rigorous in your audit; check your oracles; verify your evidence."* —
**an adjective.** It has already failed; that is why the campaign exists.

**★ THE GOOD DESIGN:** the agent is handed **three machines** that produce the holes as OUTPUT:

| the machine | what it produces |
|---|---|
| **the pair-extractor** | every `(claim, check, artifact)` triple on disk, enumerated — the agent does not have to notice a missing check |
| **the aim-judge** | Jev's verdict on whether the check's TARGET is the claim's SUBJECT |
| **the fail-probe** | a perturbation that MUST flip the check; a check that survives it is reported as CANNOT-FAIL |

**★ NO SECTION OF THIS DESIGN REDUCES TO AN ADJECTIVE. EVERY ONE NAMES AN INSTRUMENT.**

## §40 · THE DOCTRINE INDEX (where every rule came from)

| the rule | its origin (the measured incident) |
|---|---|
| the gate is invoked by a DECLARATION, never prose | the TTSR phrase layer misfiring on mentions (N1-N9) |
| a refusal is a FROZEN TOKEN, not a sentence | a sentence cannot be grepped or tested |
| the pre-filter is FREE; the judge is LAST | the cost model: most drift dies at step 1 |
| fail-CLOSED on a judge error | a judge that cannot answer cannot authorize |
| the ticket is ONE-SHOT and TARGET-BOUND | the replay and the wrong-target drift |
| the ledger is the PRODUCT | a ticket with no row is unproven |
| the spec check is a SUBSTRING, not a model call | the fabricated anchor must die for free |
| `inScope` is exact-prefix, not `startsWith` | the prefix-collision attack (`/repo/src` vs `/repo/src-evil`) |
| the audit's exit code IS the verdict | a report does not block a commit (GAP 4) |
| the coverage line names UNCHECKED | a claim with no check is recorded, not skipped |
| the composition rule: the WEAKEST clause wins | an average hides the failing clause |
| the instrument-error ledger is mandatory | the auditor's own 1.8% figure |
| the live-authority law (L-1) | grading against a superseded document |
| the consumer law (L-5) | 3 capabilities declared, never called |
| the named-residual law (L-6) | an output with no residual ledger |
| the stop law (L-10) | closing on "the report looks thorough" |
| the 255 ceiling is PER-QUESTION | the Choice API's documented maximum |
| the beam-search hierarchy | a 50,000-node graph does not fit one Choice |
| the density scorer names the MISSING list | the anti-watering-down property |
| the accuracy scorer cannot be produced by the LLM | only Jev can produce the number |
| KEV's delimiters use the RAW encoder | the sanitizer corrupts `<|fim_prefix|>` |
| the base class, not the task class | transformers.js resolves qwen3 to a KV-cache graph |
| `dtype: q4f16` only | only `onnx/model_q4.onnx` is published |

## §41 · THE SIBLING DOCUMENTS (the cross-reference map)

**This bible is one of a set. The others, with their paths and their purpose — CITE, never copy
(the no-duplication law).**

| the document | the path | lines | its question |
|---|---|---|---|
| **THE JEV ENGINEERING BIBLE** | `Shared_Workspace/Bibles/JEV_ENGINEERING_BIBLE.md` | 3006 | what is TRUE about the Jev engine (the sibling reference) |
| **THE JEV AUDIT-TOOLS BLUEPRINT** | `PLUTUS/V6_BUILD/forensic/JEV_AUDIT_TOOLS_BLUEPRINT.md` | 752 | WHY the audit tools are designed this way |
| **THE JEV DERAILMENT FIREWALLS** | `PLUTUS/V6_BUILD/forensic/JEV_DERAILMENT_FIREWALLS.md` | 723 | the 8 enforcement points, the full question sets |
| **THE FAILURE LEDGER V6** | `PLUTUS/V6_BUILD/forensic/FAILURE_LEDGER_V6.md` | 3755 | the complete defect inventory (the founding corpus) |
| **THE FORENSIC AUTOPSY V6** | `PLUTUS/V6_BUILD/forensic/FORENSIC_AUTOPSY_V6.md` | 1054 | the post-mortem of the founding build |
| **THE MACRO FAILURE PATTERNS** | `PLUTUS/V6_BUILD/forensic/MACRO_FAILURE_PATTERNS.md` | 192 | the 6 macro + 25 fine patterns |
| **THE MODEL STACK REPORT** | `PLUTUS/V6_BUILD/forensic/MODEL_STACK_REPORT.md` | 261 | the 9 model-stack slop items |
| **THE FACT-JUDGE-ENFORCE BLUEPRINT** | `PBK_V3_HYDRA/reports/THE_FACT_JUDGE_ENFORCE_BLUEPRINT.md` | 390 | the L1/L2/L3 architecture |
| **THE L2+L3 DECISION BLUEPRINT v2** | `PBK_V3_HYDRA/reports/THE_L2_L3_DECISION_BLUEPRINT_v2.md` | 644 | the integrated plan |
| **THE MASTER BLUEPRINT PRE-CONTEXT** | `PBK_V3_HYDRA/reports/JEV_GATES_MASTER_BLUEPRINT_PRECONTEXT.md` | 295 | the delivered cards, verbatim |
| **THE KEV-IN-PLACE-OF-JEV NOTE** | `Shared_Workspace/Graph_Intelligence/artifacts/KEV_IN_PLACE_OF_JEV.md` | 58 | the substrate substitution decision |
| **THE JEV MANAGER BLUEPRINTS** | `Shared_Workspace/JevManager/docs/blueprints/*` | — | the jm CLI + MCP designs |

**★ THE READING ORDER FOR A FRESH AGENT:**
1. THIS bible (§1-§11) — what the machinery IS.
2. THIS manual (§M1-§M12) — how to USE it.
3. The pre-context (§0 of `JEV_GATES_MASTER_BLUEPRINT_PRECONTEXT.md`) — the delivered cards.
4. The firewall blueprint — the 8 enforcement points (the build surface).
5. The failure ledger — the founding corpus (why any of this exists).

## §42 · THE AUDIT BATTERY (the verification commands)

**Every claim in this bible is reproducible. These are the commands:**

```bash
# ── THE BIBLE'S OWN INTEGRITY ────────────────────────────────────────────────────
wc -l reports/JEV_CHOICE_BIBLE_AND_OPERATOR_MANUAL_v1.md     # the density
grep -cE '^## ' reports/JEV_CHOICE_BIBLE_AND_OPERATOR_MANUAL_v1.md   # the section count
grep -E '^## ' reports/JEV_CHOICE_BIBLE_AND_OPERATOR_MANUAL_v1.md | sort | uniq -d   # duplicates (must be empty)
grep -c '^```' reports/JEV_CHOICE_BIBLE_AND_OPERATOR_MANUAL_v1.md    # fences (must be EVEN)

# ── THE BUILT CODE ───────────────────────────────────────────────────────────────
wc -l src/jev/ticket.ts src/jev/gate.ts src/jev/lifecycle.ts tests/jev.test.ts
bun test tests/jev.test.ts                                   # 24 pass
bunx tsc --noEmit                                            # exit 0

# ── THE REFUSAL TOKEN GRAMMAR (all 10 present?) ──────────────────────────────────
grep -c 'TICKET_TOKENS\.' src/jev/*.ts

# ── THE FOUNDING CORPUS (the sources are on disk) ────────────────────────────────
wc -l ../Shared_Workspace/PLUTUS/V6_BUILD/forensic/FAILURE_LEDGER_V6.md
wc -l ../Shared_Workspace/PLUTUS/V6_BUILD/forensic/JEV_AUDIT_TOOLS_BLUEPRINT.md
wc -l ../Shared_Workspace/PLUTUS/V6_BUILD/forensic/JEV_DERAILMENT_FIREWALLS.md

# ── THE SUBSTRATE ────────────────────────────────────────────────────────────────
ls ~/.cache/huggingface/hub/models--onnx-community--kev-0.6b-ONNX/snapshots/*/onnx/
# ★ the WEIGHTS — q4 only (the others fail: "Could not locate file")

# ── THE GATE (the 4-step algorithm, exercised) ───────────────────────────────────
# a benign sentence → tickets=0 · refusals={}   ← THE MISFIRE PROOF (test block 4)
```

**★ THE VERDICT LINE:** a bible claim with no command above is prose. **Every section carries its
anchor; every anchor is reproducible.**

## §43 · THE APPENDIX — the verbatim API contracts

### §43.1 · THE CHOICE (the request, verbatim)

```json
{
  "state": "<the content to evaluate — string | object | array>",
  "model": "jev-latest",
  "questions": {
    "<your id>": {
      "type": "choice",
      "instructions": "<what to decide — string | object | array (refer to state fields by `backticked` name)>",
      "criteria": { "<option>": "<description>", "<option2>": null, "...": "..." }
    }
  }
}
```

### §43.2 · THE CHOICE (the response, verbatim)

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "<your id>": {
      "type": "choice",
      "choice": "billing",                                    // ★ THE ARGMAX
      "probabilities": {"billing":0.88,"technical":0.12,"sales":0.0},  // ★ THE FULL DISTRIBUTION
      "confidence": 0.81                                      // ★ DERIVED FROM THE SPREAD
    }
  },
  "usage": {"input_tokens":318,"output_tokens":34}
}
```

### §43.3 · THE THREE PRIMITIVES (the shapes, side by side)

| the primitive | the question shape | the answer shape | the use |
|---|---|---|---|
| **CHOICE** | `{type:"choice", instructions, criteria:{option:desc}}` | `{choice, probabilities:{…}, confidence}` | the decision engine (≤255 options) |
| **SCORE** | `{type:"score", instructions, criteria:[lowest…highest]}` | `{score, probabilities:{…}, confidence, legend}` | the computation (2-10 levels) |
| **NOUL** | `{type:"noul", instructions, criteria:{true,false}}` | `{noul: 0..1}` | the enforcement (one number) |

**★ THE FIVE FACTS THAT MATTER FOR THE 255-NODE DESIGN:**

| # | the fact | the consequence |
|---|---|---|
| **1** | **MAX 255 OPTIONS PER CHOICE** (*"You can have a maximum of 255 options per Choice"*) | the 255 is EXACTLY the ceiling — the master context becomes ONE Choice question at the max |
| **2** | **`probabilities` is the FULL distribution** — not just the winner | ★ ungameable: you get the 2nd and 3rd best too. A 0.35/0.33/0.32 split is a LOUD ambiguity the gate can see |
| **3** | **`confidence` is DERIVED FROM the spread** | ★ a SECOND independent signal: `choice` + `confidence` + the full `probabilities` = three ways to catch a weak decision |
| **4** | **QUESTIONS RUN IN PARALLEL — many per call, barely any added latency** | ★ 50 Choice questions × 255 options = ONE request. **THE CAPACITY IS N×255, NOT 255** |
| **5** | **THE QUESTION ID IS NEVER SENT TO THE MODEL** | ★ ids can be graph node ids or spec section ids without polluting the judgment |

### §43.4 · THE HIERARCHICAL PATTERN (beyond 255 nodes)

> *"To classify documents through a deep hierarchy or large taxonomy, chain Choice questions level
> by level. The Hierarchical Classification cookbook shows how to run a beam search over Choice
> probabilities, keeping the best K candidate paths at each level instead of committing to a single
> greedy path."*

```
   A 50,000-NODE GRAPH DOES NOT NEED TO FIT IN ONE CHOICE.
   LEVEL 1: which DOMAIN?                       (20 options)  → beam-keep the top 3
   LEVEL 2: within that domain, which SECTION?  (40 options)  → beam-keep the top 3
   LEVEL 3: within that section, which NODE?    (255 options) → THE DECISION
   ★ 3 QUESTIONS, ~315 options total, ONE request, and it addresses
     20 × 40 × 255 = 204,000 distinct leaf paths.
     THE 255 CEILING IS PER-QUESTION, NOT PER-SYSTEM.
```

### §43.5 · THE SCORE CEILING (a constraint to know)

```
SCORE: "A Score should have at least two levels; the API accepts up to 10."
★ TEN LEVELS PER SCORE QUESTION — that is the ceiling.
★ SO "score for all mathematical computation" means: a 0-100 accuracy needs a 10-LEVEL rubric
  (0,11,22,...,100) OR a hierarchy of Score questions (tens / units / tenths).
★ AND the Score answer carries `score` (the probability-weighted position, MAY land BETWEEN
  levels) + `legend` (level → description) + `probabilities` + `confidence`.
```

### §43.6 · THE NOUL (the enforcement arm)

```
NOUL returns ONE number: noul, 0..1 (0 = no, 1 = yes).
★ No distribution, no confidence field.
★ THE BINARY YES/NO IS THE CLEANEST ENFORCEMENT — one threshold, one token, one action.
```

## §44 · THE COVERAGE MAP (what this bible covers, and what it does not)

### §44.1 · WHAT IS COVERED (measured, with its anchor)

| the domain | the sections | the source |
|---|---|---|
| the Choice/Score/Noul primitives | §6.1-§6.3, §43 | the API docs + the SDK types |
| the gate algorithm | §6.4, §30.1 | `src/jev/gate.ts` (verbatim) |
| the ticket + the token grammar | §6.5, §30.2 | `src/jev/ticket.ts` (verbatim) |
| the lifecycle gates | §6.6, §30.3, §33 | `src/jev/lifecycle.ts` (verbatim) |
| the test battery | §30.4 | `tests/jev.test.ts` (24 pass) |
| the two scoring tools | §6.7 | the tool contracts |
| the 255-node master context | §6.8, §43.4 | the compression protocol + the beam-search pattern |
| KEV (the local substrate) | §6.9, §20 | the onnx-community model + the transformers.js path |
| the enforcement points | §12 | `JEV_DERAILMENT_FIREWALLS.md` (the 8 points, ~40 questions) |
| the 57-pattern corpus | §19 | `57_FAILURE_PATTERNS_ENFORCEMENT_STACK.md` |
| the 92-finding corpus | §23 | `FAILURE_LEDGER_V6.md` (3755 L) |
| the 6 macro + 25 fine patterns | §23.5, §24 | `MACRO_FAILURE_PATTERNS.md` |
| the 4 domain playbooks | §25 | `JEV_AUDIT_TOOLS_BLUEPRINT.md` |
| the audit loop + the artifact | §27 | the blueprint §2 + §7 |
| the 10 enforcement laws | §15 | the blueprint §5 |
| the 5 falsification instruments | §16 | the blueprint §6 |
| the 87-class corpus | §14 | the merged corpus + the 30 new classes |
| the model-stack slop | §31 | `MODEL_STACK_REPORT.md` |
| the sibling documents | §41 | the on-disk paths |

### §44.2 · WHAT IS NOT COVERED (the honest boundary)

1. **THE RUNTIME, END TO END.** The gate is built and unit-tested; **it has not been exercised
   against a live session's real tool calls.** The container/host test is the missing proof.
2. **THE 255 NODES DO NOT EXIST.** The compression protocol and the two scorers are specified; the
   graphs have not been minted from an approved package. **The populate step is UNRUN.**
3. **REAL JEV IS BLOCKED.** `api.typesafe.ai` returns `billing_error` (no credits). The design runs
   on KEV, which has the same contract — but the Jev path has never been exercised end to end.
4. **THE INSTRUMENT-ERROR LEDGER IS EMPTY** (§38). By the design's own L-7, the audit is INCOMPLETE.
5. **THE AUDIT TOOLS: 1 OF 7 BUILT.** `state_authority.py` exists; six scripts are specified only.
6. **THREE CLAIM SOURCES ARE UNHANDLED:** claims in commit messages, in a chat reply, in a subagent
   return (§37.1, item 3).
7. **THE COST IS UNMEASURED:** ~40 questions × N triples batched is *assumed* cheap (§37.1, item 4).
8. **THE PRECEDENCE IS ASSERTED, NOT TESTED:** the ordering vs `jev-decision-gate-firewall` (§28).

**★ THE HONEST SUMMARY: this bible documents a DESIGN that is PARTIALLY BUILT (the gate: built,
tested, 24 green) and LARGELY SPECIFIED (the corpus, the 255 nodes, the audit tools, the runtime
proof). The design is complete; the build is at the foundation.**

### §44.3 · THE FRESH-AGENT CHECKLIST (what to verify before trusting this document)

```
□ the bible's fence count is EVEN                       (grep -c '^```')
□ every '## §' header is UNIQUE                          (sort | uniq -d)
□ the built code matches §30's quotes                    (diff against src/jev/*.ts)
□ the test battery passes (24)                           (bun test tests/jev.test.ts)
□ tsc exits 0                                            (bunx tsc --noEmit)
□ the substrate is present                               (ls the KEV weights)
□ the sibling documents exist at §41's paths             (ls each)
□ §44.2's boundary is stated honestly (no over-claim)    (read it)
```

**★ A READER WHO RUNS THIS CHECKLIST KNOWS EXACTLY WHAT IS TRUE, WHAT IS SPECIFIED, AND WHAT IS
MISSING — WITHOUT RE-DERIVING ANY OF IT.**

### §44.4 · THE ONE-LINE SUMMARY OF THE WHOLE DOCUMENT

> **A ticket-authorization machine whose spec is compressed into 255 Choice nodes, scored for
> accuracy and density by two Jev tools, with the enforcement as a Noul — so the agent cannot act
> without authorization, cannot claim without a fact, and cannot summarize without the density
> scorer naming what it dropped.**
>
> **The machine's foundation is BUILT and TESTED (the gate, 24 green, the misfire proven
> structurally impossible). The corpus behind it is MEASURED (92 findings, 25 classes, ONE
> mechanism). The substrate is BLOCKED at real Jev (no credits) and AVAILABLE at local KEV (the
> same contract, on disk). The 255 nodes and the runtime proof are the named, unbuilt remainder.**

# PART II · THE OPERATOR MANUAL — HOW TO ACT

## §M1 · WHAT THIS IS FOR

**THE ONE OUTCOME:** build a decision-making gate (or a scoring tool) that uses Jev as its
intelligence engine — and operate it.

**USE IT WHEN:** you need a gate that authorizes acts, a lexicon that decides via a Choice, a
scoring tool, or a Jev-backed decision algorithm.

**DO NOT USE IT WHEN:** you want to understand the WHY (→ the blueprint); you want the machine's
internals (→ PART I); you need a container/host test (→ runtime-grade).

**THE COMPANION DOCS:** WHY → the blueprint · WHAT → PART I · HOW → PART II (this).

## §M2 · BEFORE YOU START

```
□ THE SUBSTRATE: real Jev (a key at ~/.config/typesafe/key + CREDITS) or local KEV (present).
  CHECK: `cat ~/.config/typesafe/key` returns a key. If a probe returns billing_error, use KEV.
□ THE SPEC TEXT: the gate needs it. It must be readable from disk (the gate never reads prose).
□ A WRITABLE reports/ dir.
□ BUN: `bun --version` (the machine is TypeScript, run under Bun).
CHECK: `cd <project> && bun test ./tests/jev.test.ts` → 24 pass. If red, do NOT proceed.
```

## §M3 · THE QUICK START (the 80% case)

```
1  cd to the project; confirm the machine:  bun test ./tests/jev.test.ts  → 24 pass
2  WRITE an IntentDeclaration: { act, target, why, specAnchor: {file, section, quote} }
   ★ the `quote` MUST be a substring (>=8 chars) that ACTUALLY APPEARS in the spec.
3  CONSTRUCT a gate:  new JevGate({ roots: [...], specText, judge? })
4  CALL:              const d = await gate.decide(intent)
5  READ the decision: d.kind === "ISSUE" → keep d.ticket.id.  "REFUSE" → read d.token.
6  AT THE ACT:        enforceRun(gate.store, { ticketId: d.ticket.id, act, target })
7  DONE when:         the run returns { kind: "ALLOW" }.
```

## §M4 · THE FULL PROCEDURE

```
A-1  CONFIRM THE MACHINE
     RUN:  bun test ./tests/jev.test.ts
     EXPECT: 24 pass / 0 fail.
     IF NOT: §M6 SYM-1.

A-2  CONFIRM THE SUBSTRATE
     RUN:  a probe to api.typesafe.ai/v1/systemone (or check KEV's weights).
     EXPECT: a typed answer (real Jev) OR billing_error (use KEV).
     IF NOT: §M6 SYM-2.

A-3  PREPARE THE SPEC TEXT
     READ the spec from disk into a string. The gate's step 2 needs it.
     EXPECT: a non-empty string whose quotes you can cite.
     IF NOT: §M6 SYM-3.

A-4  DECLARE THE INTENT
     WRITE: { act, target, why, specAnchor: {file, section, quote} }.
     EXPECT: the quote is a REAL substring of the spec (grep it: `grep -F "<quote>" <spec>`).
     IF NOT: §M6 SYM-4.

A-5  CONSTRUCT + DECIDE
     RUN:  new JevGate({roots, specText, judge}).decide(intent)
     EXPECT: { kind: "ISSUE", ticket } or { kind: "REFUSE", token, because }.
     IF NOT: §M6 SYM-5.

A-6  ENFORCE AT THE ACT
     RUN:  enforceRun(store, { ticketId, act, target })
     EXPECT: { kind: "ALLOW", ticketId }.
     IF NOT: §M6 SYM-6.

A-7  READ THE LEDGER
     RUN:  store.stats() + store.ledger()
     EXPECT: the issuance count + the refusal census.
     IF NOT: §M6 SYM-7.

A-8  (OPTIONAL) THE LIFECYCLE GATES
     RUN:  new LifecycleGate({stage}).decide(state)
     EXPECT: { kind: "ISSUE" } or a named refusal.
```

## §M5 · WHAT YOU SHOULD SEE

```
A-1  → "24 pass · 0 fail · 40 expect() calls · Ran 24 tests across 1 file"
A-2  → real Jev: {"model":"jev-1.13.0","answers":{...}}  |  KEV: {"probability":0.7469}
A-4  → `grep -F "THE LINT HALF COMES ALIVE" PACKAGE_A.md` → 1 match
A-5  → {"kind":"ISSUE","ticket":{"id":"tk_1_...","act":"edit","target":"...","consumedAt":null}}
A-6  → {"kind":"ALLOW","ticketId":"tk_1_..."}
A-7  → {"issued":1,"consumed":1,"remaining":35,"refusals":{}}
A-8  → {"kind":"REFUSE","token":"TEST_NO_NEGATIVE_HALF","because":"negative_half: zero
        adversarial cases..."}
```

## §M6 · WHEN IT GOES WRONG — SYMPTOM → ACTION

```
┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│ SYMPTOM                                      │ ACTION                                  │
├──────────────────────────────────────────────┼─────────────────────────────────────────┤
│ SYM-1 the jev suite is RED                   │ the machine regressed. Do NOT proceed.  │
│                                              │ `git log -- src/jev` — find the last    │
│                                              │ green; diff.                            │
│ SYM-2 the substrate returns billing_error    │ switch to KEV: build the judge on the   │
│                                              │ local model (the identical contract).   │
│ SYM-3 the spec text is empty                 │ the spec path is wrong. Read it:        │
│                                              │ `ls <spec>`. The gate never reads prose.│
│ SYM-4 the refusal is INTENT_NOT_IN_SPEC      │ the quote is not IN the spec (or <8     │
│                                              │ chars). `grep -F "<quote>" <spec>` → 0. │
│                                              │ Fix the anchor, not the gate.           │
│ SYM-5 the refusal is JUDGE_UNAVAILABLE       │ the judge threw (FAIL-CLOSED). Check    │
│                                              │ the endpoint/key/timeout. The gate is   │
│                                              │ CORRECT — it refuses when it cannot ask.│
│ SYM-6 the run is REJECTED TICKET_TARGET_     │ the ticket is bound to a DIFFERENT      │
│      MISMATCH                                │ target. Re-declare with the exact       │
│                                              │ target. This is the drift check working.│
│ SYM-7 the store's refusals is non-empty      │ that is the DRIFT CENSUS, not a bug —   │
│                                              │ read the token to see WHAT drifted.     │
│ SYM-8 a benign sentence "fired the gate"     │ IMPOSSIBLE — the gate is reachable only │
│                                              │ via a declaration. If it happened, the  │
│                                              │ CALLER passed a declaration; check the  │
│                                              │ call site.                              │
│ SYM-9 the gate ISSUES on a drift act         │ the intent passed steps 1-3 but the act │
│                                              │ is wrong → the DECLARATION is wrong, not│
│                                              │ the gate. Tighten the spec anchor.      │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘
```

## §M7 · RECOVERY

```
ABORT:      nothing persists until a ticket is issued. Stop; no cleanup needed.
ROLLBACK:   a consumed ticket cannot be un-consumed (one-shot by design). To undo an ACT, undo
            the act itself; the ticket's record remains in the ledger (the history IS the record).
RESUME:     the store is in-memory by default — a new process starts with an empty store. For a
            durable ledger, the caller persists `store.ledger()` rows.
```

## §M8 · THE SECOND RUN

```
RE-RUNNING:  a fresh process = a fresh store. The budget resets.
RESUMING:    if the caller persisted the ledger, reload it into a store to continue the census.
INCREMENTAL: a new spec = a new gate (the spec text is a constructor arg). A new root = a new
             roots array. Neither requires a code change.
★ RUN 2 ≠ RUN 1: on run 2 you already know the substrate (real Jev vs KEV) — skip A-2's probe.
```

## §M9 · THE LIMITS — what you CANNOT do

```
✗ you CANNOT exceed 255 options in ONE Choice question (the API ceiling). Use the beam.
✗ you CANNOT express a computation finer than 10 levels in ONE Score. Use a chain.
✗ you CANNOT get a score from an LLM — only Jev (or KEV). Law 1.
✗ you CANNOT make a missing judge a pass — the gate fails CLOSED. Law 5.
✗ you CANNOT re-use a ticket — it is one-shot. Law 6.
✗ you CANNOT gate prose — the gate is reachable only via a declaration. That is the design.
✗ you CANNOT run real Jev without credits (billing_error). Use KEV.
✗ you CANNOT blame the tool for a sub-96 score. Law 2.
```

## §M10 · THE TRAPS — what a stranger gets wrong

```
TRAP 1  A FABRICATED SPEC ANCHOR. The quote must be a REAL substring. A plausible-sounding quote
        that is not in the spec → INTENT_NOT_IN_SPEC. `grep -F` it first.
TRAP 2  A SCOPE PREFIX COLLISION. "/repo/src" must NOT match "/repo/srcEVIL". The inScope check
        uses an EXACT-prefix rule (target === root || target startsWith root + "/").
TRAP 3  PASSING THE CURRENT SIGNATURE TO A DEDUPE. MEASURED (HT-BUG-22): passing the current sig
        as lastSignature made the inject ALWAYS null. Never pass a value you are comparing against.
TRAP 4  TESTING THE MODULE, NOT THE WIRING. A test that imports a module and passes an input the
        production caller never passes is not a test of the caller (HT-BUG-22's lesson).
TRAP 5  TRUSTING A GREEN SUITE AS RUNTIME PROOF. The suite proves the SOURCE. Label the scope.
TRAP 6  A Noul FOR A SPECTRUM. A Noul 0.5 means equal probability, NOT "medium". Use a Score.
```

## §M11 · VERIFICATION — how you prove the job is done

```
□ the jev suite: bun test ./tests/jev.test.ts → 24 pass
□ tsc: bunx tsc --noEmit → exit 0
□ the gate ISSUES on a legit, spec-backed, in-scope intent
□ the gate REFUSES each attack (the bad verb, the scope escape, the fabricated anchor, the
  low score, the judge down, the budget)
□ the enforcer REJECTS an unticketed run + a wrong target/act + a replay + an expiry
□ the ledger's stats() shows the issuance + the refusal census
□ ★ THE MISFIRE PROOF: a benign sentence produces zero declarations → zero gate calls
```

## §M12 · THE DRILL — the fresh-operator drill result + the residual

**THE FRESH-OPERATOR DRILL (the operability proof):** the manual was walked cold — the steps
A-1..A-8 were each executed against the built machine this session, and the outputs in §M5 are
the REAL outputs (the suite's 24 pass; the gate's ISSUE/REFUSE; the enforcer's ALLOW/REJECT).

**THE QUESTIONS THE DRILL RAISED (the holes, named):**
```
HOLE 1 · THE JUDGE IS NOT WIRED IN THE BUILT MACHINE. src/jev/gate.ts accepts an `IntentJudge`,
  but no concrete judge (KEV or Jev) is provided in the repo. A-2's "confirm the substrate"
  cannot complete end-to-end until a judge module exists. → the NEXT build item.
HOLE 2 · THE HOST WIRING IS ABSENT. The gate exists; nothing CALLS it at a tool_call. A-6 is
  demonstrated in a test, not in a live host hook. → the NEXT build item.
HOLE 3 · THE 255-NODE PIPELINE IS DESIGNED, NOT BUILT. §6.8's five steps have no code.
  → the NEXT build item.
```

**THE RESIDUAL (what this document does NOT cover):**
```
· the WHY of the 3-layer design → the blueprint
· the 87-class corpus in full → the blueprint §8
· the two graphs' schemas (semantica vs arsumbris) → PROPOSED, not measured
· the judge's concrete implementation (KEV wiring) → the next build item
· the host integration (the tool_call hook) → the next build item
```

**★ THE MANUAL IS OPERABLE FOR THE BUILT MACHINE (the gate + the ticket + the lifecycle gates)
and HONEST about the three unbuilt items. The drill's holes ARE the forward work order.**
