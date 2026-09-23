# BUILD REPORT — THE HYDRA-WORKERS TOPOLOGY + THE LEXICON-GATE CAMPAIGN

APPEND-ONLY. The permanent build record: what was built, why, how, the evidence, the verification.

---

## 2026-09-23 — THE HYDRA-WORKERS OVERHAUL (WAVES → WORKERS)

### THE BUILT

```
THE TOPOLOGY (the operator's directive: "ensure that your creation build packages are overhauled
accordingly to be built by hydra workers. this will be the first live run of this architecture")

  PBK_V3_HYDRA/                  its own git repo (baseline 88e4f3b)
  wt-engine/                     branch worker/engine  · WORKER_SPEC.md 333 L · WORKER_GOAL.md 57 L
                                 · TODOS.md 16 L (12 rows)
  wt-surfaces/                   branch worker/surfaces · WORKER_SPEC.md 343 L · WORKER_GOAL.md 60 L
                                 · TODOS.md 17 L (13 rows)
  .trident/worker-plan.md        264 L · WORKERS: 2 · 15 oracle rows · 32 T-refs · the bridge diagram
  gates/merge-gate.sh            20 L · 6 predicates (ANCHOR 1, the local equivalent)
  .git/hooks/pre-push            11 L · the direct-push deny to master
  context_management/            11 canon docs · 2,556 L

THE FOUR PREDICATES — all exit 0
  worker-planning/scripts/check.sh .trident/worker-plan.md
    -> PASS: worker-plan dispatchable (WORKERS=2, oracle rows=15, T-refs=32)
  worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md      -> PASS: worker-spec armable
  worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md    -> PASS: worker-spec armable
  hydra-workers/scripts/check.sh                             -> PASS: worker topology verified

THE THREE ANCHORS
  ANCHOR 1  the merge gate — WIRED + OBSERVED FAILING (the negative control)
  ANCHOR 2  the pinned todo anchors — 12 + 13 rows, every row naming its gate, 2 IMMUTABLE each
  ANCHOR 3  the pinned goal loops — the 7 slots + ONE /goal line each
```

### THE WHY

The operator's architecture: a wave = N parallel subagents that spawn, do a slice, and die; a
worker = ONE agent owning the ENTIRE scope of ONE git worktree across the full lifecycle, with
its own pinned goal loop, its own pinned todos, and its own SME identity. The scope boundary
coarsens from a FILE SET to a WORKTREE — which git enforces rather than prose.

### THE HOW

1. `git init` on the hydra dir; one baseline commit of the seam + both packages + the merge plan.
2. Two `git worktree add -b` — `worker/engine` and `worker/surfaces`, each seeing the frozen seam.
3. The worker-plan authored BACKWARDS (target → baseline) then FORWARDS (dependency-lawful
   grouping), with the 15 oracle rows, the pre-written audit §A, the coverage map, the bridge.
4. The two worker specs — each REFERENCING the master spec (never copying it), each carrying
   §W3 testing with tool-result-bound tokens, §W5 anti-patterns WITH detections, §W6 the gate,
   §W7 the todo anchor, §W9 the pre-written audit.
5. The two goal pins + the two todo anchors.
6. The merge gate + the pre-push deny.
7. Three commits: master `26fa25a` · `worker/engine` `9049e83` · `worker/surfaces` `df915cd`.

### THE EVIDENCE

```
sha256sum SEAM/seam.ts                    66b66a7f10c7c6e7...   (192 L)
git worktree list                         3 rows (master + 2 workers)
bash gates/merge-gate.sh worker/engine wt-engine
  -> tsc PASS · bun test FAIL · 4 PASS -> GATE: FAIL — DO NOT MERGE   (the negative control)
the 4 predicates                          all exit 0
```

### THE VERIFICATION

Every predicate was run by the agent, in this session, with its output pasted above. The merge
gate was run against a state that MUST fail it — the negative control — because a gate never
observed failing is untested.

### THE HONEST NOTES

- **THE WORKER TREES ARE EMPTY.** `wt-engine/src/` and `wt-surfaces/src/` both hold 0 entries.
  This milestone delivered the TOPOLOGY, not the product.
- **THE CREATE-PIN OVERHAUL IS INCOMPLETE.** Both `PACKAGE_*_CREATE_PROMPT.md` still describe 4
  sequential WAVES (grep -c -i wave → 4 and 4). N-1 in the task queue.
- **0 GIT REMOTES.** Anchor 1's GitHub half is OPEN; creating a repo on the operator's account is
  an external side effect not taken without an explicit order.
- **THE ORACLES: 5 of 15 have values; 10 read PENDING (unbuilt).**

---

## 2026-09-23 — THE META-OBSERVATION + THE HOT-SEAT ROUND

### THE BUILT

```
THE META-OBSERVATION
  runtime-testing/references/meta-observations.md        204 L
  runtime-testing/references/guardrail-spec.md            85 L
  runtime-testing/references/suggested-improvements.md    67 L
  runtime-testing/references/lexicon-gate_live_forensic.md 241 L (the 9-section ledger)

THE CORPUS
  derailment-data-log.md        381 L · 5 incidents · 7 work orders
  host-test-failure-log.md      222 L · 9 numbered bugs (HT-BUG-1..9)

THE MEASUREMENTS
  the firing census             24 MECHANICAL firings · 3,022 prose mentions · 126:1 ratio
  the latency probe             0.024 / 0.015 / 0.179 / 0.013 ms per call
  the hot-reload round trip     9 → 10 → 9 in ONE pid, no restart
  the A/B control               8 pids with loop-blocks and ZERO fires (the story disproven)

THE FIX
  ~/.omp/agent/extensions/lexicon-gate/index.ts  203 L → 221 L
    pi.sendUserMessage(...) -> pi.sendMessage({customType: "ttsr-injection", display: true})
    + the new pi.on("input") hook routing event.source === "extension"
    7 pi.on registrations (was 6)
```

### THE WHY

The operator asked three things in sequence: (1) *"meta observe how this is firing"*, (2) *"document
the exact method you just used for hot reload"*, (3) *"test everything directly in the hot seat for
real time latency on debugging and testing"*. Then: *"is it possible to have these gates appear
with the proper system message pedigree instead of being a user message?"* — which produced the fix.

### THE HOW

The meta-observation loop: the testing agent IS the subject. The evidence channels are the session
JSONL (24 user-role deliveries, line-numbered), the process logs (15 FIRE events, 3 pids), the
ledger (102 rows), and a direct timing probe. **NO SYNTHETIC SUBSTITUTE for the live observation.**

### THE EVIDENCE

```
the session JSONL              01a0a495-cd80-74b8-818b-082b0dafde3b.jsonl · 31,342 lines
the 24 firings                 L31017 .. L31305 (288 lines) · 74.8 minutes · one per 187 s
  by rule:                     instruction-not-predicate 19 · scope-shrink 5
  by confidence:               0.667 x17 · 0.800 x7      <- TWO VALUES ONLY
the ledger                     102 rows · jev:null on ALL 102
the extension's suite          cd ~/.omp/agent/extensions/lexicon-gate && bun test .
                               -> 5 pass · 0 fail · 12 expect() · [326.00ms]
                               ★ SCOPE: this tests lib.ts (the SOURCE), not the deployed bundle
the pedigree unit proof        sendMessage called · sendUserMessage NOT called · customType carried
                               ★ SCOPE: unit only — the RENDERED behaviour is UNOBSERVED
```

### THE VERIFICATION

| claim | the run | the result |
|---|---|---|
| the gate fires on the agent's own prose | the JSONL walk | 24 user-role deliveries, line-numbered |
| the exemptor suppresses | the ledger census | 71 own_utterance vs 31 quotation (30%) |
| the reload works in-process | the round trip | 9 → 10 → 9, one pid |
| the gate is not a latency source | the probe | 0.024 ms/call prose |
| the loop-blocked story is false | the A/B | 8 pids block with 0 fires |
| the fix selects the right channel | the harness | sendMessage + customType |

### THE HONEST NOTES

- **THE FIX IS NOT LIVE.** The running process (started 04:50:25) predates the edit (mtime
  06:08:08). ESM-cached. The RENDERED pedigree is UNOBSERVED.
- **THE GRAY ZONE HAS NEVER BEEN JUDGED.** All 102 ledger rows carry `jev:null` (402). The
  three-tier design runs as two tiers.
- **SIX OF THE NINE BUGS ARE OPEN** (HT-BUG-3, -4, -5, -6, -7, -8) with designed work orders.
- **THE ABORT'S EFFECT WAS NOT ISOLATED.**

---

## THE ARTIFACT INDEX

```
THE PROJECT        /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
  SEAM/seam.ts                     192 L · sha 66b66a7f10c7c6e7 · FROZEN
  .trident/worker-plan.md          264 L
  .trident/host-suite-results.json 112 L
  gates/merge-gate.sh               20 L
  context_management/              11 docs · 2,556 L
  derailment-data-log.md           381 L
  host-test-failure-log.md         222 L
  BUILD_REPORT.md · DEBUG_LOG.md · FAILURE_LOG.md · SPEC_VIOLATION_LOG.md · TESTING_LOG.md
  THEATRICALITY_LOG.md · SHIP_DOCS_MANIFEST.md

THE LIVE ENFORCEMENT   ~/.omp/agent/extensions/lexicon-gate/
  index.ts                         221 L · sha 1122308d41ba11a8 · mtime 06:08:08
  lib.ts                           307 L · sha 4530b5f1ca9e046a
  lib.test.ts                      179 L
  ~/.omp/agent/rules/              9 rule files
  ~/.omp/run/lexicon-ledger.jsonl  102 rows
  ~/.omp/logs/omp.2026-09-23.191645.log   the campaign's process log
```

## THE PROOF-OF-STATE

```
the seam                   sha256sum SEAM/seam.ts -> 66b66a7f10c7c6e7...   (unchanged all session)
the topology predicate     PASS: worker topology verified
the 4 predicates           all exit 0
the merge gate             FAIL on the empty branches (the negative control — it bites)
the extension's suite      5 pass / 0 fail / 12 expect() (source scope)
the harnesses              REMOVED (no residue)
the rules                  9 (the probe removed; the threshold restored)
```

---

## 2026-09-23 — THE SHIP-GRADE FIXES (the 8-bug campaign)

### THE BUILT

```
THE SCORER (W1) — src/lexicon/score.ts +65/-5
  expandInflections()        expands the use: bank at compile time (the alternation group + the
                             bare-word case) -> 'exits' matches \bexit\b
  the per-bank span ledger   two members sharing a tail count ONCE (the double-count killed)

THE LIVE RULES (W2) — ~/.omp/agent/rules/instruction-not-predicate.md +2 use: members
  the meta-correction        a phrase inside a self-correction
  the process-hedge          a hedge about the agent's own process

THE LOADER (HT-BUG-14) — src/lexicon/load.ts +55/-8
  the block-style bank parser + the inline-band match + stripInlineFlags
  (ported from the live extension's lib.ts:59, case-insensitive compile)
  PROOF: loadRules(~/.omp/agent/rules) -> 9 of 9 rules load

THE DEPLOY CONTRACT (HT-BUG-15) — src/index.ts (58 L -> 74 L)
  export default function pbk_v3(pi)   — omp calls the DEFAULT EXPORT; without it the extension
  registers ZERO hooks. PROVEN: typeof default === "function", and calling it registers 7 hooks.

THE BLIND-PASS GUARDS (HT-BUG-10) — 3 guards (OCR_RUN_DEGRADED, OCR_NO_FILES_REVIEWED,
  OCR_COUNT_MISMATCH) — in SOURCE, not live.
```

### THE WHY

The goal: take PBK v3 to SHIP GRADE. The 5 OPEN bugs + the audit gate's false PASS + the tree
never deployed. Each fix answers a MEASURED defect, not a hypothesis.

### THE HOW

1. The bugs were found by a HOST-LIVE meta-observation round (the agent's own prose tripped the
   rules; the firings were the data).
2. W1 + W2 were dispatched in ONE batch (disjoint files: the scorer vs the live rules).
3. Both workers were INFRA-CUT at ~4min (zero file changes) — the orchestrator (Main) executed
   the fixes directly at f93e34a, then dispatched a verification seat (W1Scorer).
4. HT-BUG-14 was found WHILE proving W2 (the loader could not read the live rules at all).
5. HT-BUG-15 was found while writing the deploy handoff (the entry had no default export).
6. HT-BUG-16 was found while RE-MEASURING the handoff (the hash was the pre-fix 58 L value).

### THE EVIDENCE

```
bunx tsc --noEmit                               exit 0
bun test (engine, surfaces, adversarial)        24 pass / 0 fail / 101 expects
  HT-BUG-3 inflected                            pos=2 neg=3 c=0.333 band=flag
  HT-BUG-4 short / long                         pos=2 / pos=2 (no double-count)
  HT-BUG-5 the process hedge                    pos=2 neg=3 band=flag
  HT-BUG-6 the meta-correction                  pos=2 neg=3 band=flag
  the sacred overlap                            pos=0 neg=4 c=0.000 band=clear (PRESERVED)
  HT-BUG-10 the 3 guards                        present on disk
the default export                              7 hooks register (session_start, input,
                                                message_update, tool_call, tool_result,
                                                ttsr_triggered, agent_end)
the rules load                                  9 of 9
the live ledger                                 685 rows (the gate firing on the session)
the checkpoint                                  Checkpoints/pbk-v3-ship-grade-fixes
                                                dist sha16 6e3b6215d0b2175f · 8/8 self-check
```

### THE HONEST REMAINDER

```
- the new tree has NEVER RUN (L0/L1 SOURCE proof only; the deploy is the operator's act).
- the audit gate is BLOCKED: the ocr provider chain is quota-dead (429 on every lane), and the
  tool returned GATE: PASS on a run where all 15 files FAILED (HT-BUG-10, confirmed LIVE).
- HT-BUG-7 (the Jev 402) + HT-BUG-13 (the GI graph gate) are BLOCKED — both outside this tree.
- W2_FIX_REPORT.md (the independent W2 verification seat) is in flight; the W2 fixes ARE covered
  by tests/adversarial.test.ts (P7-HT-BUG-5, P7-HT-BUG-6 read the LIVE rule; 5 pass / 0 fail).
```
