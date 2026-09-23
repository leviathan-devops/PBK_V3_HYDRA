# PBK v3 HYDRA — WORKER PLAN
WORKERS: 2

**The topology:** 2 long-horizon workers, each owning ONE git worktree, building against the
FROZEN SEAM. The orchestrator (the CTO seat) dispatches, audits, arms the gate, and merges.
**This is the FIRST LIVE RUN of the hydra-workers architecture.**

```
master        PBK_V3_HYDRA          branch master           the seam + the plans
W1            wt-engine             branch worker/engine    THE ENGINE (Desk A)
W2            wt-surfaces           branch worker/surfaces  THE SURFACES (Desk B)
```

---

## TARGET (verbatim success criteria, T-1..T-8)

```
T-1  the seam type-checks                     bunx tsc --noEmit -p tsconfig.json -> exit 0
T-2  the engine satisfies the seam            check(req) returns a CheckResult whose shape matches
T-3  the lexicon separates                    bun test -t lexicon_sweep -> F1=1.000
T-4  abide's lint half RUNS                   bun test -t lint_runner -> the known-bad REFUSED
T-5  the engine touches no host               grep -rc "ctx\|pi\." wt-engine/src/ -> EMPTY
T-6  the surfaces compute no band             grep -rc "bandOf\|confidence" wt-surfaces/src/ -> EMPTY
T-7  the streaming interrupt fires live        a fired band -> ctx.abort() + the injected correction
T-8  the merge is ONE import                  the combined tree type-checks + both suites green
```

## BASELINE (verified state, B-1..B-6)

```
B-1  the seam EXISTS, frozen, type-checks     SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc exit 0
B-2  the worktrees EXIST                      wt-engine (worker/engine) · wt-surfaces (worker/surfaces)
B-3  the engine is ABSENT                     wt-engine/src/ -> 0 entries
B-4  the surfaces are ABSENT                  wt-surfaces/src/ -> 0 entries
B-5  abide EXISTS at /tmp/abide-repo          673 L core · 0 lexicon hits · 0 source-kind hits
B-6  the existing extension EXISTS            689 L · 5/5 green · the MIGRATION baseline
```

## TARGET CLASSIFICATION

```
T-1, T-2, T-5  -> KIND: BUILD + STATIC CHECK      the seam's type contract + the invariant grep
T-3, T-4       -> KIND: BUILD + BEHAVIOURAL       the sweep + the lint fixture (a real run)
T-6            -> KIND: STATIC CHECK              the invariant grep
T-7            -> KIND: RUNTIME                   the live abort + inject (the container or the host)
T-8            -> KIND: INTEGRATION               the combined tree
```

## THE ORACLE TABLE (§O — per worker; machine-parseable `| OR-n | ...`)

**O1 = pre-state facts a worker CANNOT know without reading. O2 = post-state must-be-true.
O3 = trap oracles only a real execution produces. EVERY row carries its producing command.**

```
| OR-1 | O1 | the seam's sha is 66b66a7f10c7c6e737a491b6e0f63903 | sha256sum SEAM/seam.ts | W1,W2 |
| OR-2 | O1 | abide has 0 lexicon hits | grep -rn "lexicon" /tmp/abide-repo/packages/ --include=*.ts \| wc -l | W1 |
| OR-3 | O1 | abide's lint pattern is "Never executed" | grep -c "Never executed" /tmp/abide-repo/packages/schema/src/rubric.ts | W1 |
| OR-4 | O1 | abide has 0 streaming hooks | grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts \| wc -l | W2 |
| OR-5 | O1 | the existing extension's suite is 5/5 | cd ~/.omp/agent/extensions/lexicon-gate && bun test . | W1,W2 |
| OR-6 | O2 | the engine's tree has NO host reference | grep -rc "ctx\|pi\." wt-engine/src/ \| grep -v ':0' | W1 |
| OR-7 | O2 | the surfaces' tree has NO band | grep -rc "bandOf\|confidence" wt-surfaces/src/ \| grep -v ':0' | W2 |
| OR-8 | O2 | the lexicon sweep separates | bun test -t lexicon_sweep -> F1=1.000 | W1 |
| OR-9 | O2 | abide's lint REFUSES the known-bad | bun test -t lint_runner -> exit 1 on the fixture | W1 |
| OR-10| O2 | the gate suppresses 5 FP controls | bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0" | W2 |
| OR-11| O3 | the streaming interrupt ABORTS | the harness: a fired band -> ctx.abort() called (2/2) | W2 |
| OR-12| O3 | the negatives stay SILENT | the harness: 3 negatives -> abort=0 | W2 |
| OR-13| O3 | the injected payload carries the correction | the harness prints the sendUserMessage payload | W2 |
| OR-14| O3 | the combined tree type-checks | bunx tsc --noEmit (both halves) | BOTH |
| OR-15| O3 | the ledger records decidedBy | grep -c '"decidedBy"' .abide/events.jsonl -> >= 1 | W1 |
```
*Oracles stay IN THE PLAN — never in the dispatch prompts (a worker that fits to them proves nothing).*

## BACKWARD MAP (T-n chains, grouped per worker)

```
W1 (THE ENGINE):
  T-2 <- requires <- src/index.ts exporting check()        <- B-3
  T-3 <- requires <- the lexicon type + scoreSignals       <- B-3, B-5
  T-4 <- requires <- the lint runner executing abide's pattern <- B-3, B-5
  T-5 <- requires <- the engine's purity (no host import)  <- B-1

W2 (THE SURFACES):
  T-6 <- requires <- the surfaces' purity (no band math)   <- B-1
  T-7 <- requires <- the 4 hooks + ctx.abort() + the inject <- B-4, B-6
  T-10<- requires <- classifySource + isQuotedMatch        <- B-4, B-6 (the existing gate migrates)

BOTH:
  T-1 <- requires <- the frozen seam                       <- B-1
  T-8 <- requires <- the merge (one import)                <- T-2 + T-6 + T-7
```

## FORWARD WORKERS

### Worker 1 — THE ENGINE (Desk A)   [depends: nothing]

```
Worktree:        /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-engine
Branch:          worker/engine
SME domain:      the abide-vendored decision engine + the lexicon pre-gate
Files (disjoint): wt-engine/src/{lexicon,engine,lint,ledger}/** · wt-engine/vendor/**
Goal pin:        wt-engine/WORKER_GOAL.md
Todos:           W1-T1..W1-T10 (see the worker spec §W7)
Gate:            bunx tsc --noEmit -> exit 0
                 bun test -> 0 fail
                 bun test -t lexicon_sweep -> F1=1.000
                 bun test -t lint_runner -> the known-bad REFUSED
                 grep -rc "ctx\|pi\." src/ | grep -v ':0' -> EMPTY
                 + the PR required checks
```

| Deliverable | Spec §ref | Oracle rows | Done-when |
|---|---|---|---|
| D1 the vendored abide | PACKAGE_A §2.1 | OR-2, OR-3 | `bunx tsc --noEmit vendor/abide/index.ts` exit 0 + VENDOR.md sha per file |
| D2 the lexicon check type | PACKAGE_A §2.2 | OR-8 | the sweep prints F1=1.000 at the derived band |
| D3 the scorer | PACKAGE_A §2.3 | OR-8 | `grep -c 'bandFor' src/lexicon/` >= 1 (abide's, imported) |
| D4 the runner order | PACKAGE_A §2.4 | OR-8, OR-9 | the lexicon decides; only the gray reaches Jev |
| D5 the lint runner | PACKAGE_A §2.4 | OR-3, OR-9 | the known-bad REFUSED, the known-good accepted |
| D6 the ledger writer | PACKAGE_A §2.5 | OR-15 | the row carries decidedBy |
| D7 the public surface | PACKAGE_A §2.6 | OR-6, OR-14 | `check(req)` exported; the invariant grep EMPTY |

### Worker 2 — THE SURFACES (Desk B)   [depends: nothing — builds against the SEAM's stub]

```
Worktree:        /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-surfaces
Branch:          worker/surfaces
SME domain:      the OMP host surfaces + the streaming interrupt (abide has no equivalent)
Files (disjoint): wt-surfaces/src/{gate,surfaces,action}/**
Goal pin:        wt-surfaces/WORKER_GOAL.md
Todos:           W2-T1..W2-T10 (see the worker spec §W7)
Gate:            bunx tsc --noEmit -> exit 0
                 bun test -> 0 fail
                 bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
                 bun test -t abort_dispatch -> 2 positives abort, 3 negatives silent
                 grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> EMPTY
                 + the PR required checks
```

| Deliverable | Spec §ref | Oracle rows | Done-when |
|---|---|---|---|
| D1 the source-kind gate | PACKAGE_B §2.2 | OR-10 | 0 FP + 5/5 controls fired |
| D2 the quote-state machine | PACKAGE_B §2.2 | OR-10 | the 5 quote cases correct |
| D3 the 4 hooks | PACKAGE_B §2.3 | OR-11, OR-12 | 2 abort, 3 silent |
| D4 the delta accumulator | PACKAGE_B §2.3 | OR-11 | a split-across-deltas line assembles |
| D5 the abort dedupe | PACKAGE_B §2.4 | OR-11 | the same signature aborts ONCE |
| D6 the action dispatch | PACKAGE_B §2.5 | OR-12, OR-13 | the 4 rows produce the right kind |
| D7 the entry | PACKAGE_B §2.6 | OR-7, OR-14 | the 4 hooks registered; the invariant EMPTY |

### Dependency graph (text)

```
W1 (wt-engine)  ----+                              NO EDGE between W1 and W2:
                    |                              both build against the FROZEN SEAM.
                    +--> W3 THE MERGE  <----+      The merge is the FIRST time the
                    |      (the orchestrator) |     two halves meet.
W2 (wt-surfaces) ---+                         |
                                              |
   the seam (master) -------------------------+
```
**No worker consumes another's artifact.** The seam is the only shared surface. The merge (W3)
is the orchestrator's job, not a worker's.

## THE PRE-WRITTEN AUDIT (§A — per expected hunk; composed AT PLAN TIME)

```
W1 (THE ENGINE):
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| vendor/abide/* | abide's engine vendored verbatim | sha256sum each vs the source | OR-2 | _ |
| src/lexicon/schema.ts | check.type "lexicon" added | grep -c 'z.literal("lexicon")' | OR-8 | _ |
| src/lexicon/score.ts | the 4 weights, abide's band | grep -c 'bandFor' -> >= 1 | OR-8 | _ |
| src/lexicon/load.ts | a missing use: THROWS | bun test -t lexicon_load_throws | OR-8 | _ |
| src/engine/check.ts | the runner order | bun test -t runner_order | OR-8, OR-9 | _ |
| src/lint/runner.ts | abide's pattern EXECUTED | bun test -t lint_runner | OR-9 | _ |
| src/ledger/writer.ts | the row carries decidedBy | grep -c decidedBy | OR-15 | _ |
| src/index.ts | check(req) exported | grep -c 'export.*check' | OR-6 | _ |
| EVERY src file | NO host reference | grep -rc "ctx\|pi\." src/ | OR-6 | _ |

W2 (THE SURFACES):
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| src/gate/source-kind.ts | classifySource + SCORABLE | bun test -t source_kind_gate | OR-10 | _ |
| src/gate/quote.ts | isQuotedMatch (the state machine) | bun test -t quote_state | OR-10 | _ |
| src/surfaces/prose.ts | message_update takes (event, ctx) | grep -c 'ctx.abort' | OR-11 | _ |
| src/surfaces/stream.ts | the delta accumulator | bun test -t delta_accumulator | OR-11 | _ |
| src/surfaces/stream.ts | the abort dedupe | bun test -t abort_dedupe | OR-11 | _ |
| src/surfaces/tool.ts | the material kind "doc" | grep -c '"doc"' | OR-12 | _ |
| src/action/dispatch.ts | the 4-row mapping | bun test -t action_map | OR-12, OR-13 | _ |
| src/index.ts | the 4 hooks registered | grep -c 'pi.on(' -> >= 4 | OR-7 | _ |
| EVERY src file | NO band computed | grep -rc "bandOf\|confidence" src/ | OR-7 | _ |
```

## COVERAGE MAP

```
T-1  <-> the seam (master, frozen)          <-> OR-1
T-2  <-> W1/D7 the public surface           <-> OR-6, OR-14
T-3  <-> W1/D2, D3 the lexicon + scorer     <-> OR-8
T-4  <-> W1/D5 the lint runner              <-> OR-3, OR-9
T-5  <-> W1/D7 the invariant                <-> OR-6
T-6  <-> W2/D7 the invariant                <-> OR-7
T-7  <-> W2/D3, D4, D6 the hooks + dispatch <-> OR-11, OR-12, OR-13
T-8  <-> W3 THE MERGE (the orchestrator)    <-> OR-14

every worker <-> >= 1 oracle row:  W1 -> OR-2,3,5,6,8,9,15  W2 -> OR-4,5,7,10,11,12,13
every §ref   <-> a deliverable:    PACKAGE_A §2.1-2.6 -> D1-D7  PACKAGE_B §2.2-2.6 -> D1-D7
```

## THE BRIDGE DIAGRAM

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE SPEC — T-1..T-8 (the seam type-checks · the engine satisfies it ·    │
│ the lexicon separates · the lint runs · no host · no band · the         │
│ interrupt fires · the merge is one import)                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  backwards
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ THE BASELINE — the seam FROZEN (192 L, sha 66b66a7f10c7c6e737a491b6e0f63903, tsc exit 0) ·       │
│ 2 worktrees live · the engine ABSENT · the surfaces ABSENT ·            │
│ abide at /tmp/abide-repo · the existing extension 689 L (5/5)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  forwards
                                    ▼
┌──────────────────────────────┬─────────────────────────────────────────┐
│ W1 THE ENGINE                │ W2 THE SURFACES                         │
│ wt-engine · worker/engine    │ wt-surfaces · worker/surfaces           │
│ SME: the abide engine +      │ SME: the OMP surfaces + the             │
│      the lexicon pre-gate    │      streaming interrupt                │
│ owns src/{lexicon,engine,    │ owns src/{gate,surfaces,action}         │
│      lint,ledger} + vendor/  │                                         │
│ gate: tsc + F1=1.000 +       │ gate: tsc + 0 FP + 2 abort/3 silent +   │
│       the lint REFUSED       │       no band                           │
└──────────────────────────────┴─────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ §O: 15 ORACLE ROWS — every worker traced (W1: 7 rows · W2: 7 · BOTH: 1) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ THE GATE — the PR + the required checks · GitHub owns the deny          │
│ the worker CANNOT merge its own PR                                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ W3 THE MERGE (the orchestrator) — ONE IMPORT · the combined tsc + both  │
│ suites · then the migration (A108/B108) and the live container round    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ THE TARGET — all 8 criteria materialized                                │
└────────────────────────────────────────────────────────────────────────┘
```

## THE WORKER LAWS (the anchors)

```
ANCHOR 1  GITHUB — the PR + required checks; the worker CANNOT merge its own branch
ANCHOR 2  THE NATIVE TODO LIST — every spec milestone is a PINNED todo naming its gate
ANCHOR 3  THE PINNED GOAL LOOP — each worker's WORKER_GOAL.md re-asserts the law every turn
```
