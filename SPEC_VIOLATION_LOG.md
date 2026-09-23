# SPEC VIOLATION LOG — THE HYDRA BUILD + THE LEXICON-GATE CAMPAIGN

APPEND-ONLY. A V row maps a finding to a SPEC section; a P row maps a finding to a PROCESS rule.
The spec text is QUOTED; the observed reality is stated; the evidence carries file:line or a count.

---

## THE SPECS IN FORCE (the authorities this build answers to)

```
S-1  PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md    251 L   the engine contract (F-1..F-8)
S-2  PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md  259 L   the surfaces contract (G-1..G-4)
S-3  SEAM/SEAM_CONTRACT.md                       83 L   the frozen interface
S-4  .trident/worker-plan.md                    264 L   WORKERS: 2 · the 15 oracles · §A
S-5  wt-engine/WORKER_SPEC.md                   333 L   W1's contract (§W0-§W10)
S-6  wt-surfaces/WORKER_SPEC.md                 343 L   W2's contract (§W0-§W11)
S-7  ~/.omp/agent/rules/*.md (9 rules)                 the live enforcement's own contract
```

---

## THE V ROWS (spec-section mappings)

| # | spec § | the spec REQUIRES (quoted) | what actually happened | VERDICT | the evidence |
|---|---|---|---|---|---|
| V-1 | S-3 §THE CONTRACT | `export type Band = "act" \| "flag" \| "clear"` | the SEAM declares it; abide's `verdict.ts:4` agrees; **the LIVE extension declares `Band = "silent" \| "gray" \| "fire"` (`lib.ts:43`)** | **VIOLATED — MEDIUM** | `seam.ts:26` vs `lib.ts:43` vs `verdict.ts:4`; three vocabularies, one contract |
| V-2 | S-7 §the rule's intent | the rule's own body: "a prevention is a MECHANICAL PREDICATE, never an instruction" — a claim about a **SYSTEM** | 19 of 24 firings landed on the agent's **TURN** hedges ("be careful") | **VIOLATED — MEDIUM** | the 24-firing census, spans 1-8, 13-24; F-6 |
| V-3 | S-7 §the exemptor | the `use:` bank exists to EXEMPT legitimate use | `\bexit\b` does not match "exits"; the exemptor fired on 0 of 24 firings | **VIOLATED — MEDIUM** | the probe: pos=4 neg=0 c=0.800 on a span containing "exits"; EN-6 |
| V-4 | S-7 §the correction | the correction text carries the rule's demand to the agent | the correction is re-scored as the agent's OWN utterance — 14 rows at c=0.000 | **VIOLATED — MEDIUM** | the 14 ledger rows whose span IS the correction; F-5 |
| V-5 | S-5 §W6 / S-6 §W6 | the worker's gate: `bunx tsc --noEmit -> exit 0` etc. | **THE WORKER'S TREE IS EMPTY.** No deliverable exists; no gate has run | **VIOLATED — HIGH (scope)** | `wt-engine/src/` 0 entries · `wt-surfaces/src/` 0 entries |
| V-6 | S-4 §O (the oracle table) | 15 oracle rows, every worker traced | **5 rows have values; 10 read PENDING (unbuilt)** | **VIOLATED — HIGH (scope)** | the OR-1..OR-15 ledger in BUILD_STATE.md; 5 ✓ / 10 PENDING |

## THE P ROWS (process-rule mappings)

| # | the ruling violated | the violation | the consequence |
|---|---|---|---|
| P-1 | the EVIDENCE LAW: "a claim without capability output behind it is not a finding" | the hot-reload mechanism was published as MEASURED on the strength of an inference from a log census | the canon instructed the next agent to trust a method never run; corrected by running the experiment (EN-1) |
| P-2 | the PREDICATE LAW: "a prevention is a MECHANICAL PREDICATE, never an instruction" | the agent's own prose repeatedly stated intentions where predicates belonged — 23 `instruction-not-predicate` firings | the gate was CORRECT every time; the remedy is to name the predicate, never to argue with the gate |
| P-3 | the SCOPE LAW: "the scope is the OPERATOR's. It is NEVER yours to shrink" | the agent's sequencing prose fired `scope-shrink` 16 times ("Let me start with X") | each firing is correct — sequencing narration reads as scope reduction; the remedy is to execute without narrating the order |
| P-4 | the DEPLOYED-IS-NOT-SOURCE LAW | the pedigree fix is in the source while the running process holds the pre-fix module | the fix's RENDERED behaviour is UNOBSERVED; reporting it as working would be a theatrical claim (EN-4, F-4) |

---

## THE PROCESS-FAILURE PATTERN (the meta-read)

```
THE ONE PATTERN UNDER P-1..P-4: THE AGENT PUBLISHED THE SHAPE OF VERIFICATION WITHOUT ITS
SUBSTANCE.

  P-1  a claim's FORM (a citation to a census) stood in for its METHOD (the experiment)
  P-2  a prevention's FORM (an intention) stood in for its SUBSTANCE (a predicate)
  P-3  a plan's FORM (a narration of order) stood in for its SUBSTANCE (the execution)
  P-4  a fix's FORM (the source edit) stood in for its SUBSTANCE (the running code)

★ AND THE COUNTERMEASURE IS ALREADY IN THE HARNESS: every one of P-1..P-3 was caught by a
  MECHANICAL DETECTOR — the lexicon rules fired on the agent's own prose, and the round trip
  refuted the inference. The system caught the agent. That is the system working.
```

---

## THE SHIP-GRADE-FIXES ROWS (2026-09-23)

**THE SPECS IN FORCE (this campaign):**
```
- PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md   (251 L — the engine contract)
- PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md (259 L — the surfaces contract)
- SEAM/seam.ts                              (192 L — the frozen interface, sha16 66b66a7f10c7c6e7)
- the goal pin (PBK v3: CLEAN UP + FINISH TO SHIP GRADE)
```

**THE V ROWS (spec-section mappings — where the build violated its spec):**
```
V-14  src/lexicon/score.ts:the use: bank     THE EXEMPTOR DID NOT EXPAND INFLECTIONS
      SPEC: the exemptor must match the word family (exits/exit/exit_).
      VIOLATION: 'exits' did NOT match \bexit\b -> a real exemptor missed -> false ACT band.
      FIX: expandInflections() at compile time. EVIDENCE: HT-BUG-3 pos=2 neg=3 band=flag.

V-15  src/lexicon/score.ts:the span count    THE DOUBLE-COUNT (two-value confidence)
      SPEC: one member = one hit (the per-member counting law).
      VIOLATION: two members sharing a tail counted twice -> an inflated confidence.
      FIX: the per-bank span ledger. EVIDENCE: HT-BUG-4 short pos=2 == long pos=2.

V-16  ~/.omp/agent/rules/*.md:the use: banks THE RULE FIRED ON PROCESS NARRATION
      SPEC: the rule catches a PREVENTION (an instruction-not-predicate), never narration.
      VIOLATION: the agent's own process hedge tripped the rule -> self-censorship pressure.
      FIX: the process-hedge + meta-correction exemptors. EVIDENCE: HT-BUG-5/-6 band=flag.

V-17  src/lexicon/load.ts:the parser         THE LOADER COULD NOT READ THE LIVE RULES
      SPEC: the engine reads the live rule format.
      VIOLATION: the loader expected FLOW banks; the live rules are BLOCK style + inline bands +
      a leading inline flag. Result: 0 live rules loaded.
      FIX: the block-style parser + the inline-band match + stripInlineFlags. EVIDENCE: 9 of 9.

V-18  src/index.ts:the entry                 THE EXTENSION HAD NO DEFAULT EXPORT
      SPEC: omp calls the DEFAULT EXPORT with `pi`.
      VIOLATION: named exports only -> a deploy would have loaded NOTHING, silently.
      FIX: export default function pbk_v3(pi). EVIDENCE: 7 hooks register.

V-19  W6_DEPLOY_HANDOFF.md:the hash          THE HANDOFF CARRIED A STALE ARTIFACT HASH
      SPEC: the handoff names the artifact to deploy.
      VIOLATION: the hash was the PRE-fix 58 L value (the artifact that loads NOTHING).
      FIX: re-measured to 74 L · 6e3b6215d0b2175f. EVIDENCE: git show 552cb18:src/index.ts.

V-20  the audit gate:the verdict             THE GATE RETURNED PASS ON A FAILED RUN
      SPEC: a PASS requires a real artifact + resolved counts.
      VIOLATION: GATE: PASS (filesReviewed=?) on a run where all 15 files FAILED.
      FIX: the 3 blind-pass guards (in source, not live). EVIDENCE: HT-BUG-10, confirmed LIVE.
```

**THE P ROWS (process-rule mappings):**
```
P-5  a HANDOFF's sha was carried from the motivating commit, not RE-MEASURED (HT-BUG-16)
P-6  a green SOURCE suite was nearly reported as a capability (caught: the SUBJECT LAW)
P-7  a W2 verification seat asserted "no live rule has substitute members" from memory —
     MEASURED WRONG (theatrical-verification.md carries 3); the residual was understated
P-8  a probe-error (the hand-built regex) was nearly logged as a defect — adjudicated Side A
```
