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
