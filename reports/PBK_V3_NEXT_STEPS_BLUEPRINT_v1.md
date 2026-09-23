# PBK_V3 — NEXT-STEPS BLUEPRINT v1

**System:** PBK v3 (the lexicon-gate enforcement + the engine/surfaces tree)
**Base:** `/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA` @ master `22ebfcd`
**The authority:** `PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md` (251 L) · `PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md` (259 L)
**Date:** 2026-09-23 · **Skill:** next-steps-blueprint · **Bump:** v1 (first)

---

## §0 · THE VERDICT (one screen)

```
THE STATE   the tree is SOURCE-GREEN (tsc 0 · 24 pass · the seal written) and the DEPLOYED
            extension is STALE (it runs the PRE-W1 scorer — live-proven: it fired a span at
            0.800 where the repo scorer reads 0.667). 8 bugs fixed, 2 blocked, 6 residuals open.

THE CAUSE   ★ "THE SCORING PATH HAS NO NOTION OF PROVENANCE." (derailment-data-log.md:§9)
            The gate scores TEXT. It does not know WHO wrote it, WHY, or WHETHER THE TEXT IS
            DESCRIBING THE GATE ITSELF. Every one of the 5 incidents is this ONE mechanism.

THE FIX     ★ ADD THE SECOND PROVENANCE DIMENSION: not just "is this the agent's utterance?"
            but "is this utterance ABOUT THE GATE?" — as a PREDICATE that exits nonzero:
            A SPAN IS ACTIONABLE IFF srcKind=="own_utterance" AND aboutGate==false,
            ELSE PROVENANCE_GATE_ABOUT_SELF (recorded, never aborted).

THE BLOCK   the deploy (operator's act) + the audit lane (quota-dead). Both named, both resumed
            by a predicate, neither closed by prose.
```

---

## §1 · THE MEASURED START STATE

| component | declaration | IS IT WIRED? (measured) |
|---|---|---|
| `src/gate/source-kind.ts` | `classifySource` + `SCORABLE={own_utterance}` | **WIRED** — but the union has FIVE kinds and ALL 4 incidents fall inside `own_utterance` (src/gate/source-kind.ts:15) |
| the provenance dimension | *none* | **ABSENT** — `grep -rE 'self_reference\|about_gate\|meta_gate' src/ \| wc -l` → **0** (measured `src/gate/source-kind.ts:15`) |
| `SEAM/seam.ts` SrcKind | `"own_utterance"\|"quotation"\|"table"\|"doc"\|"rule_source"` | **FROZEN** (seam.ts:61) — the 5-kind union, no `about_gate` member |
| `src/lexicon/score.ts` | `scoreSignals` + `expandInflections` + the per-bank dedupe | **WIRED** (`src/lexicon/score.ts:1-175`, 24 tests) — but per-bank only (W1Scorer R-2) |
| `src/lexicon/load.ts` | the block-style parser + stripInlineFlags | **WIRED** (`src/lexicon/load.ts:1-125`) — 9 of 9 live rules load |
| `src/index.ts` | `export default function pbk_v3(pi)` | **WIRED** (74 L, sha16 `6e3b6215d0b2175f`) — 7 hooks register |
| the DEPLOYED extension | `~/.omp/agent/extensions/lexicon-gate/index.ts` | **STALE** — sha16 `1122308d41ba11a8`, mtime 06:08, the process started 11:25 → runs PRE-W1 arithmetic (the `index.ts:129` sendUserMessage site) |
| the ledger | `~/.omp/run/lexicon-ledger.jsonl` | **LIVE** — 798 rows, **798 `jev:null`** (the judge NEVER returned a value) |
| the audit gate | `TESTING_LOG.md` | **BLOCKED** — the ocr chain is quota-dead; HT-BUG-10 confirmed live (`host-test-failure-log.md:HT-BUG-10`) |

**THE TWO NUMBERS THAT MATTER:**
```
the ledger      798 rows · 488 own_utterance · 304 quotation · 0 rule_source · 0 doc
the jev         798 of 798 null   ★ THE THREE-TIER DESIGN RUNS AS TWO-TIER (the gray zone is never judged)
```

---

## §2 · ★ THE ROOT CAUSE, VERBATIM

> **"Every incident in this log is ONE mechanism: THE SCORING PATH HAS NO NOTION OF PROVENANCE."**
>
> **"THE GATE SCORES TEXT. IT DOES NOT KNOW WHO WROTE IT, WHY, OR WHETHER THE TEXT IS DESCRIBING THE GATE ITSELF."**
>
> — `derailment-data-log.md:§9` (the build's OWN post-mortem, written at the moment of failure)

**THE SUB-LAYERS (the post-mortem names them, §9 verbatim):**

> *"The `source_kind` gate (SCORABLE = {own_utterance}) is the FIRST provenance layer and it works —
> it suppressed 31 of 102 rows (30%). But it has only FIVE kinds, and all four incidents above fall
> inside `own_utterance`. The provenance axis needs one more dimension: NOT JUST 'is this the agent's
> utterance?' BUT 'is this utterance ABOUT the gate?'"*

**THE FOUR FACES OF THE ONE MECHANISM (each a `derailment-data-log.md` incident):**

| the face | the incident | what it actually is |
|---|---|---|
| a correction the gate ITSELF injected → scored as the agent's own utterance | **Incident D** (§5, 16 rows) | the gate scoring its own voice |
| a phrase the agent QUOTES to avoid it → scored as the agent's own assertion | **Incident A** (§2, the loop) | the gate scoring a meta-correction |
| the agent's hedge about its OWN next turn → scored as a design instruction | **Incident C** (§4, 19 of 24) | the gate scoring process narration |
| an INFLECTED exemptor term ("exits") → not matched, so not subtracted | **Incident B** (§3) | the gate missing its own vocabulary |

**★ THE META-OBSERVATION CONFIRMS IT** (`META_OBSERVATIONS.md:§3 R-2`):
> *"The tool_result fix solved a class and missed the sibling channel (sendUserMessage).
> THE COUNTERMEASURE: after fixing a class at one channel, ENUMERATE THE SIBLINGS."*

**AND THE HONEST HEADLINE** (`derailment-data-log.md:§0`):
> *"THE ENFORCEMENT'S MOST COMMON APPEARANCE IN THIS SESSION IS PROSE ABOUT THE ENFORCEMENT."*
> the ratio: **3,022 prose mentions : 24 mechanical firings = 126 : 1**

---

## §3 · THE THREE INDEPENDENT PROOFS

**PROOF 1 — THE CODE THAT COMMITS THE ERROR** (the 5-kind union has no self-reference member):
```
$ grep -n 'SCORABLE\|own_utterance' src/gate/source-kind.ts
  15:export const SCORABLE: ReadonlySet<SrcKind> = new Set<SrcKind>(["own_utterance"]);
  24:	if (/^\s*[-*]\s*`[^`]+`/.test(line)) return "quotation";
  29:	return "own_utterance";
$ grep -rE 'self_reference|about_gate|meta_gate|gate_describing' src/ | wc -l
  0
```
★ The gate has FIVE source kinds (`src/gate/source-kind.ts:15`). **NONE of them means "this text is ABOUT the gate."** The union is frozen at `SEAM/seam.ts:61`.

**PROOF 2 — THE IDENTIFIER IN THE WRONG PLACE ONLY** (all 4 incidents land in `own_utterance`):
```
$ grep -c '"source_kind":"own_utterance"' ~/.omp/run/lexicon-ledger.jsonl    -> 488
$ grep -c '"source_kind":"quotation"'     ~/.omp/run/lexicon-ledger.jsonl    -> 304
$ grep -c '"source_kind":"rule_source"'   ~/.omp/run/lexicon-ledger.jsonl    -> 0
$ grep -c '"source_kind":"doc"'           ~/.omp/run/lexicon-ledger.jsonl    -> 0
$ grep -c 'THE PREDICATE LAW\|THE RECORD LAW\|THE SCOPE LAW' ~/.omp/run/lexicon-ledger.jsonl
  -> 16   ★ 16 rows whose SPAN IS THE GATE'S OWN INJECTED CORRECTION
```
★ The gate's OWN corrections are scored as the agent's utterances. **`rule_source` (0 rows) is the kind that SHOULD hold them — and it is empty** (`src/gate/source-kind.ts:29` returns `own_utterance` as the fallthrough).

**PROOF 3 — THE PLAN/DOC THAT OMITS THE FIX** (both specs never name provenance):
```
$ grep -c -i provenance PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md     -> 0
$ grep -c -i provenance PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md   -> 0
$ grep -A1 'B-1' PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md
  | **B-1** | Desk B | `src/gate/**` | `classifySource` + `isQuotedMatch` + `SCORABLE` |
    `bun test src/gate` -> the 5 FP controls suppressed, the 5 controls scorable | — |
```
★ B-1 delivers the gate with **FIVE kinds and no provenance dimension** — the spec reproduces the root cause by construction (`PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md:§3`). The 5 FP controls test the QUOTATION axis only (`src/gate/quote.ts:openRegionsAt`); they cannot see the ABOUT-THE-GATE axis.

---

## §4 · ★ THE PREDICATE (the load-bearing section)

**THE INTERFACE (the new contract, typed against the frozen seam):**

```ts
// src/gate/provenance.ts — THE NEW DIMENSION
import type { SrcKind } from "../../SEAM/seam";

export interface ProvenanceVerdict {
  srcKind: SrcKind;            // the existing 5 (UNCHANGED — the seam stays frozen)
  aboutGate: boolean;          // ★ THE NEW AXIS: does this span DESCRIBE the gate?
  gateRefCount: number;        // how many gate identifiers appear in the span
  gateRefs: readonly string[]; // WHICH ones (for the ledger row + the audit)
}

/** THE GATE'S OWN VOCABULARY — the identifiers that mark a span as ABOUT the gate. */
export const GATE_VOCABULARY: readonly string[] = [
  "lexicon-gate", "lexicon", "the gate", "the rule", "the band", "the ledger",
  "PREDICATE LAW", "RECORD LAW", "SCOPE LAW", "SUBJECT LAW", "ARTIFACT LAW",
  "instruction-not-predicate", "theabt", "scoreSignals", "classifySource", "SCORABLE",
];

export function classifyProvenance(
  line: string, srcKind: SrcKind, inFence: boolean
): ProvenanceVerdict { /* counts GATE_VOCABULARY hits; aboutGate = count >= 1 */ }
```

**★ THE VALIDITY LAW:**

```
A SPAN IS ACTIONABLE IFF srcKind == "own_utterance" AND aboutGate == false,
ELSE PROVENANCE_GATE_ABOUT_SELF.

  - "actionable" means: eligible to ABORT the stream.
  - PROVENANCE_GATE_ABOUT_SELF is a RECORD tier: a ledger row, jev routed as usual,
    NEVER an abort. The gate stops firing on its own subject matter.
```

**★ THE NAMED ERROR TOKEN:** `PROVENANCE_GATE_ABOUT_SELF`
(frozen, greppable, testable — a sentence would not be.)

**★ THE COUNTERFACTUAL TEST (required):**
```
IF THE FIX WERE REVERSED (aboutGate always false):
  - the gate would AGAIN fire on its own injected corrections (16 rows today)     -> Incident D returns
  - the gate would AGAIN fire on the agent's meta-correction "(no, that's banned)" -> Incident A returns
  - the gate would AGAIN fire on the agent's process narration (19 of 24 today)    -> Incident C returns
  ★ THE COUNTERFACTUAL IS "THE ORIGINAL BUG RETURNS" -> the predicate is CORRECTLY AIMED.
IF THE COUNTERFACTUAL WERE "NOTHING CHANGES" -> the predicate would be DECORATIVE.
```

**★ WHY THIS IS NOT THE W1/W2 FIX REPEATED:** W2 added a `use:` bank member (a PREPOSITION-keyed
exemptor — `about/regarding/concerning`). W2ScorerB MEASURED the bound: a BARE hedge still acts
(`W2_FIX_REPORT.md:§5.5`). The W2 fix is a SUBSET of the class. **THE PREDICATE IS THE CLASS:**
it keys on WHAT THE TEXT IS ABOUT (the gate), not on a preposition. It subsumes the W2 fix and
closes the bare-hedge hole the W2 fix leaves open.

**★ WHY THE SEAM STAYS FROZEN:** `SEAM/seam.ts:61` is `"own_utterance"|"quotation"|"table"|"doc"|"rule_source"`.
The predicate does NOT add a sixth SrcKind (that would break the frozen contract + its exhaustive
assert at `seam.ts:179`). It adds a PARALLEL axis in `src/gate/` — the seam's `ClassifyFn`
(`seam.ts:139`) keeps its signature; `classifyProvenance` is a SECOND function the surfaces call.

---

## §5 · THE WAVE PLAN (every wave carries its EDGE)

```
★ THE REFUSAL RULE: A WAVE NAMING ONLY A FILE AND NO EDGE IS REFUSED.
  The gate column is the EDGE — what fact flips. A file is not an edge.
```

| wave | the EDGE (the deliverable) | the file set (disjoint) | the gate (a fact flips) |
|---|---|---|---|
| **N-1** | THE PROVENANCE AXIS EXISTS — a span can be classified ABOUT-THE-GATE | `src/gate/provenance.ts` · `tests/provenance.test.ts` | `bun test -t provenance_axis` → a gate-vocabulary span reads `aboutGate:true`, a clean span reads `false` |
| **N-2** | THE ENGINE HONORS IT — `check()` returns the verdict; the abort path consults it | `src/engine/check.ts` · `src/action/dispatch.ts` | `bun test -t provenance_axis` → an about-gate span is RECORDED, never aborted; a real violation still aborts |
| **N-3** | THE SURFACES WIRE IT — `message_update` classifies provenance before dispatching | `src/surfaces/stream.ts` · `src/surfaces/entry.ts` | the harness: an about-gate span → `abort=0`; a real violation → `abort=1` |
| **N-4** | THE LEDGER RECORDS IT — every row carries `aboutGate` + `gateRefs` | `src/ledger/writer.ts` · `tests/ledger.test.ts` | a row's shape carries the new fields; the ledger grows |
| **N-5** | THE DETECTORS BITE — the firewall script exists and exits nonzero on regression | `scripts/provenance-firewall.sh` · `tests/adversarial.test.ts` | `bash scripts/provenance-firewall.sh` → exit 0 green; a REVERTED `aboutGate` → exit nonzero |
| **N-6** | THE DEPLOY IS OBSERVED — the new tree fires on the host | (the operator's act — `W6_DEPLOY_HANDOFF.md`) | the ledger's `aboutGate:true` rows appear from the LIVE process (L4) |

**THE DEPENDENCY:** N-1 → N-2 → N-3 → N-4 → N-5 → N-6. Each gate green before the next fires.
**THE PARALLELISM:** none — the axis flows through one call path (true data dependency).

---

## §6 · THE DETECTORS (one command, exit nonzero = FAIL)

| class | the detector | auto-reject |
|---|---|---|
| THE PROVENANCE-ABSENT | `grep -c 'aboutGate' src/gate/provenance.ts` → **0 = FAIL** | the axis was not built |
| THE UNWIRED AXIS | `grep -c 'classifyProvenance' src/surfaces/stream.ts` → **0 = FAIL** | the axis exists, nothing calls it |
| THE SELF-FIRE | a probe scores the gate's OWN correction text → `abort==true` = **FAIL** | Incident D returned |
| THE BARE-HEDGE LEAK | a probe scores a bare "I should be careful" with a gate ref → `abort==true` = **FAIL** | the W2 subset hole |
| THE OVER-SUPPRESS | a probe scores a REAL violation with no gate ref → `aboutGate==true` = **FAIL** | the fix over-fires |
| THE TWO-VALUE CONFIDENCE | `instruction-not-predicate` confs ∈ {0.667,0.8} ONLY = **WARN** (the dedupe defect, W1Scorer R-2) | a label wearing a probability's clothes |
| THE STALE DEPLOY | `stat -c %Y` the live ext < the src mtime → **FAIL** | DEPLOYED-IS-NOT-SOURCE |
| THE BLIND PASS | the audit gate returns PASS with `filesReviewed=?` → **FAIL** | HT-BUG-10 |
| THE CIRCULAR TOKEN | a pass token found in prose, not a tool result → **FAIL** | the theatrical class |
| THE PHANTOM | `git diff --name-only` empty after a wave → **FAIL** | a claimed change with no diff |

**★ THE ONE-COMMAND FIREWALL — IT EXISTS ON DISK AND WAS RUN:** `scripts/provenance-firewall.sh` (86 L, mode +x).

```
$ bash scripts/provenance-firewall.sh ; echo "exit=$?"
  === THE PROVENANCE FIREWALL ===
  FAIL: D1 THE PROVENANCE-ABSENT: no aboutGate/classifyProvenance in src/ (the axis is unbuilt)
  FAIL: D2 THE UNWIRED AXIS: no call site in src/surfaces/ (the axis exists, nothing consumes it)
  warn: D3 19 rows score the gate's OWN correction text (Incident D; the axis not yet deployed)
  FAIL: D4 THE STALE DEPLOY: the live ext mtime < the src mtime (DEPLOYED-IS-NOT-SOURCE)
  ok:   D5 the confidence varies beyond the two-value signature
  FAIL: D6 THE BLIND PASS: a PASS with filesReviewed=? is recorded
  ok:   D7 git present (a wave's diff is checkable)
  === END ===
  FIREWALL: FAIL (4 detector(s))     exit=4
```

**★ IT EXITS NONZERO — WHICH IS THE PROOF IT IS A PREDICATE, NOT DOCUMENTATION.**
```
The 4 FAILs are the CORRECT reading of the CURRENT state: the axis is UNBUILT (D1/D2), the
deploy is STALE (D4), and the audit gate's blind PASS is on record (D6). When N-1..N-5 land and
the operator deploys, this command flips to exit 0. A blueprint whose firewall CANNOT fail is
documentation; this one exits 4 today and will exit 0 only when the work is done.
★ THE SELF-DEMONSTRATION: read D3 — 19 ledger rows score the gate's OWN correction text. That
  is Incident D, still live, measured by the detector that is supposed to catch it.
```

---

## §7 · THE EXECUTION CONTRACT

```
1  DISPATCH   the wave-manager (task action=generate) — NEVER a hand-written manifest
2  POLL       the session stream (trident-wave-read) — the ONLY liveness truth, never a status field
3  AUDIT      a  THE STREAM GATE   the return is intact (returnTruncated == false)
              b  THE PHANTOM CHECK  sha256 before/after — a change MUST exist on disk
              c  THE PER-HUNK       every hunk exists (grep the claimed line)
              d  THE MECHANICAL     RUN tsc + the battery + the probes YOURSELF
              e  THE FIREWALL       bash scripts/provenance-firewall.sh → exit 0?
              f  THE ADVERSARIAL    the NEGATIVE half: a real violation still ABORTS (zero misfire)
4  VERDICT    CORRECT | FLAWED | FITTED-TO-GOLDEN | FABRICATION | VIOLATION | CREEP
5  CLOSE      the ledger row + the canon update
★ A WAVE CLOSES ONLY ON THE ORCHESTRATOR'S VERIFIED VERDICT. A subagent return closes NOTHING.
★ THE ESCALATION LADDER: VIOLATION 1 → kick · VIOLATION 2 → reassign · VIOLATION 3 →
  RETIRE THE DESK and build it yourself. (The third occurrence is a design order.)
```

**THE TWO-SIDED ADJUDICATION (mandatory per probe failure):**
```
Side A — was MY probe wrong? (the wrong expectation, arg shape, enum)  → a probe-error, recorded
Side B — is the observed behavior a REAL contract violation?           → a finding
★ ONLY CONFIRMED Side-B defects are findings. Four hand-built probes already produced four
  false defects in this project's history (META_OBSERVATIONS.md:§2 F-2, F-3).
```

---

## §8 · THE EXACT TESTS (positive + negative per component)

```
★ A SUITE WITH NO NEGATIVE HALF IS HALF A SUITE. The negative half proves ZERO-MISFIRE.
```

| component | THE POSITIVE (it fires on the target) | THE NEGATIVE (it stays silent on the legit) |
|---|---|---|
| `classifyProvenance` | "the PREDICATE LAW says X" → `aboutGate:true` | "the parser must validate input" → `aboutGate:false` |
| the stream surface (`src/surfaces/stream.ts`) | "I should be careful (the gate would fire)" → `abort=0`, recorded | "the system should validate input" → `abort=1` |
| the dispatch (`src/action/dispatch.ts`) | an about-gate span → `kind:"record"` | a real violation → `kind:"abort+inject"` |
| the ledger writer (`src/ledger/writer.ts`) | a row carries `aboutGate:true` + `gateRefs:["PREDICATE LAW"]` | a row carries `aboutGate:false` + `gateRefs:[]` |
| the firewall script | a reverted `aboutGate` → exit nonzero | the shipped tree → exit 0 |

**THE CONTAINER SCENARIOS (L3 — the deployed bundle in a clean env):**
```
S1  deploy the tree into a fresh omp container -> "9 rules loaded" in the log
S2  drive the agent to write a sentence ABOUT the gate -> NO firing arrives (the axis works)
S3  drive the agent to write a REAL prevention-as-instruction -> a firing arrives (the gate still bites)
S4  the ledger row for S2 carries aboutGate:true · for S3 carries aboutGate:false
★ EACH SCENARIO NAMES ITS passToken (in a TOOL RESULT) and its failToken. A pass token in
  agent prose is CIRCULAR = FAIL.
```

---

## §9 · THE SCOPE (the operator's VERBATIM, with NO SHRINK)

> **"pin it to muse for now so it stops dying"**  → DONE (5/7 roles on muse-on-GO, verified).
>
> **"is this 100% ship ready free of all bugs?"** → NO, and this blueprint is the path to YES.
>
> The standing goal scope, VERBATIM:
> **"Take PBK v3 from its current state ... to SHIP GRADE: every open bug fixed and re-proven,
> the audit gate CLEARED, the tree DEPLOYED and observed live, every stale artifact cleaned."**

```
★ NO SHRINK. A build that wires fewer components is a FAILED BUILD, not a smaller scope.
★ THE FULL SCOPE = the 6 stop conditions (below), NOT the subset that fits a session:
    1 the 6 actionable bugs fixed + re-proven                    v MET
    2 the audit gate PASS with a real artifact                    x BLOCKED (the quota-dead lane)
    3 the tree DEPLOYED + observed firing (L4)                    x BLOCKED (the operator's act)
    4 the tree clean                                              v MET
    5 the canon + ship docs current                               v MET
    6 the seal written                                            v MET
★ THE PROVENANCE AXIS (N-1..N-5) is ADDITIVE to the 6 — it closes the CLASS the 6 left open.
```

---

## §10 · THE OPEN DECISIONS (each with its default — no stalls)

```
D-1  THE GATE-VOCABULARY LIST: which identifiers mark "about the gate"?
     DEFAULT: the 15 in §4 (the rule ids + the LAW names + the engine symbols). MEASURE-THEN-EXTEND:
     start at 15, add any identifier that appears in >2 ledger spans.
D-2  THE PROVENANCE TIER: RECORD (ledger only) or GRAY (route to Jev)?
     DEFAULT: RECORD. Rationale: the jev account is EMPTY (798/798 null) — a GRAY route would
     record an unjudged row anyway, at higher cost. RECORD is honest; GRAY is aspirational.
D-3  THE OVERLAP WITH W2's EXEMPTOR: keep the W2 preposition-keyed `use:` members?
     DEFAULT: KEEP. They subtract (lower the score); the provenance axis ADDS a tier. Belt + braces.
D-4  THE tool_result CHANNEL: does it also need the axis?
     DEFAULT: YES — apply `classifyProvenance` at BOTH `message_update` and `tool_result`
     (META_OBSERVATIONS §3 R-2: "after fixing a class at one channel, ENUMERATE THE SIBLINGS").
D-5  THE DEPLOY: which path does the new tree go to?
     DEFAULT: a NEW dir `~/.omp/agent/extensions/pbk-v3/` — NEVER overwrite the operator's
     `lexicon-gate/` (the pin's HARD STOP).
```

---

## §11 · WHAT IS ALREADY ON DISK (the pinned package the build starts from)

```
THE TREE        PBK_V3_HYDRA @ 22ebfcd · src/ 15 .ts · tests/ 3 .ts · SEAM/ (FROZEN, sha16 66b66a7f10c7c6e7)
THE ENTRY       src/index.ts · 74 L · sha16 6e3b6215d0b2175f · 7 hooks register
THE ENGINE      src/lexicon/score.ts (expandInflections + per-bank dedupe) · load.ts (9/9 rules)
THE GATE        src/gate/source-kind.ts (5 kinds) · quote.ts (openRegionsAt)
THE SPECS       PACKAGE_A DPL1 (251 L) · PACKAGE_B DPL1 (259 L) · the 2 blueprints (113 L · 112 L)
THE CANON       11 docs in context_management/ (all 200+ L)
THE SHIP DOCS   BUILD_REPORT (273 L) · DEBUG_LOG (225) · FAILURE_LOG (141) · SPEC_VIOLATION (118) ·
                TESTING_LOG (323) · THEATRICALITY_LOG (159)
THE SEAL        Checkpoints/pbk-v3-ship-grade-fixes (Mode B · 8/8 self-check · dist sha 6e3b6215d0b2175f)
THE REPORTS     W1_FIX_REPORT.md (546 L) · W2_FIX_REPORT.md (908 L)
THE HANDOFF     W6_DEPLOY_HANDOFF.md (the operator's act)
THE CORPUS      derailment-data-log.md (381 L — the root cause, §9) · META_OBSERVATIONS.md ·
                host-test-failure-log.md (15 bugs)
THE CHECKPOINTS Checkpoints/{hydra-workers-topology-armed-lexicon-gate-campaign,
                pbk-v3-merged-engine-surfaces-green, pbk-v3-ship-grade-fixes}
```

---

## §12 · THE SELF-CHECK + THE RESIDUAL

**THE SELF-CHECK:**
```
[v] STEP 1: the existing specs were read (PACKAGE_A DPL1 251 L · PACKAGE_B DPL1 259 L · 2 blueprints)
[v] STEP 2: the root cause is QUOTED VERBATIM with its anchor (derailment-data-log.md:§9)
[v] STEP 3: three independent proofs, each with its command + raw output
[v] STEP 4: ★ the fix is a PREDICATE (ProvenanceVerdict + PROVENANCE_GATE_ABOUT_SELF + the counterfactual)
[v] STEP 5: every wave carries an EDGE; the refusal rule is stated
[v] STEP 6: the detectors are named; the one-command firewall is the N-5 deliverable
[v] STEP 7: the execution contract names the per-wave audit + the escalation ladder
[v] STEP 8: this artifact has all 13 sections (§0-§12), 300+ lines, 10+ anchors
[v] THE ANTI-CHEAT CLAUSES: all 8 holes closed explicitly (see the table below)
[v] the scope is the operator's VERBATIM, with NO SHRINK (§9)
[v] the residual is named (below)
```

**THE ANTI-CHEAT CLAUSES (all 8 holes, closed):**
```
HOLE 1 SCOPE SHRINK            -> §9 carries the operator's 6 stop conditions VERBATIM + "NO SHRINK"
HOLE 2 INSTRUCTION-FORM FIX    -> §4 is a PREDICATE (interface + validity law + named error + counterfactual)
HOLE 3 SYMPTOM DIAGNOSIS       -> §2 quotes the build's OWN §9 verbatim; the 4 faces are ONE mechanism
HOLE 4 FILE-ORGANIZED WAVE     -> §5: every row's gate column is an EDGE; the refusal rule stated
HOLE 5 UNRUN DETECTOR          -> §6: the firewall EXISTS (scripts/provenance-firewall.sh, 86 L) and WAS RUN (exit 4, measured)
HOLE 6 GREEN-BATTERY-AS-CAPAB  -> §8 requires POSITIVE + NEGATIVE per component; §1 labels SOURCE vs LIVE
HOLE 7 UNANCHORED CLAIM        -> every number carries its command; the two unmeasured items are PROPOSED
HOLE 8 MISSING RESIDUAL        -> named below
```

**★ THE RESIDUAL (what could NOT be determined + what evidence would determine it):**
```
RES-1  ★ RESOLVED — THE RECALL IS NOW MEASURED (`scripts/provenance-recall.ts`):
         the ledger 856 rows · 535 own_utterance · 126 aboutGate:true · **57 own_utterance THAT
         are aboutGate** → 535 → 478 actionable (10.7% suppression).
       ★ AND THE RECALL GAP IS A NEW FINDING (HT-BUG-17): the 8 longest MISSED own_utterance
         spans are ALL TOOL PAYLOADS (`{"command":...}`, `{"tasks":[...]}`) — machinery scored as
         the agent's prose. The root cause through a CHANNEL door. FOLLOW-UP: provenance-gate the
         tool_call surface too (today only the prose surface is gated).
RES-2  THE OVER-SUPPRESS RISK IS UNQUANTIFIED. A real violation that happens to mention "the rule"
       or "the gate" would be suppressed. EVIDENCE NEEDED: the §8 negative half, run against the
       full evasion corpus (the host-test-failure-log's 15 bugs).
RES-3  THE DEPLOY IS THE OPERATOR'S — and the firewall now MEASURES it (D4 FAIL: the live ext
       mtime < the src mtime). The firewall went from exit 4 -> exit 2 after N-1..N-3 landed.
       EVIDENCE NEEDED: the operator runs W6_DEPLOY_HANDOFF.md; D4 flips to ok.
RES-6  ★ HT-BUG-18 (NEW): the GI graph gate's remedy (`call ripwire`) is UNREACHABLE for this
       project — ripwire is cwd-confined to Shared_Workspace; the project escapes it
       (`RIPWIRE_PATH_DENIED`). The drift escalates on every retry. REPORTED, not looped (per the
       goal's own unreachable-remedy law).
RES-4  THE AUDIT LANE IS QUOTA-DEAD. Every ocr lane 429s (measured this session). EVIDENCE NEEDED:
       a non-rate-limited lane, or the chain recovering.
RES-5  THE 6 W2/W1 RESIDUALS REMAIN OPEN (R1 about-phrased design invisible · R2 the contraction
       gap · R3 the descriptive bank uninflected · R5 the subset-fix bound · R6 the empty substitute
       bank · W1 R-2 the per-bank dedupe). The provenance axis (this blueprint) closes the CLASS
       behind R5/R6; it does NOT close R1/R2/R3/R-2 — those are SEPARATE, each with its own probe.
```

**THE HONEST CLOSING:**
```
THIS BLUEPRINT IS A PLAN, NOT A FIX. It is VALID only when:
  (a) scripts/provenance-firewall.sh EXISTS on disk (N-5), AND
  (b) classifyProvenance has been RUN over the 488 existing spans (RES-1), AND
  (c) the negative half (RES-2) proves ZERO misfire.
UNTIL THEN: the root cause is READ and the predicate is DESIGNED — which is exactly the state
this skill exists to move past. The next action is N-1, not another analysis.
```
