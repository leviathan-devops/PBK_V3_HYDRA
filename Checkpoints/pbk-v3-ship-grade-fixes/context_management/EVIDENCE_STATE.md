# EVIDENCE STATE — PBK v3 HYDRA

Append semantics for new evidence; the summary section is replaced. Every entry carries its
producing command — a claim without one is not evidence.

## THE SUMMARY (current)

```
12 evidence classes recorded · 4 predicates green · 1 negative control observed ·
2 defects found and named · 1 hypothesis disproven by measurement · 0 theatrical claims
```

## [E-01] THE FROZEN SEAM IS TYPE-CLEAN — sha 66b66a7f10c7c6e7

```
COMMAND   sha256sum SEAM/seam.ts ; bunx tsc --noEmit -p tsconfig.json
RESULT    66b66a7f10c7c6e7... · 192 L · tsc exit 0
VERDICT   VERIFIED — the seam compiles and its sha is recorded in all three build docs
```
*Why it matters:* this is the one gate the earlier audit found had NEVER been run (the prior
claim cited `bun build`, which strips types without resolving them). It has now been run.

## [E-02] THE WORKER TOPOLOGY — 4 PREDICATES, ALL EXIT 0

```
COMMAND   bash ~/.omp/agent/managed-skills/{worker-planning,worker-spec,hydra-workers}/scripts/check.sh
RESULT    worker-planning -> PASS: worker-plan dispatchable (WORKERS=2, oracle rows=15, T-refs=32)
          worker-spec W1  -> PASS: worker-spec armable
          worker-spec W2  -> PASS: worker-spec armable
          hydra-workers   -> PASS: worker topology verified
VERDICT   VERIFIED — the topology is mechanically dispatchable
```

## [E-03] THE MERGE GATE CAN FAIL (the negative control)

```
COMMAND   bash gates/merge-gate.sh worker/engine wt-engine    (on the EMPTY branches)
RESULT    tsc PASS · bun test FAIL · no-host-ref PASS · no-band PASS · seam-untouched PASS ·
          branch-not-master PASS  ->  GATE: FAIL — DO NOT MERGE
VERDICT   VERIFIED — the gate is not a rubber stamp. A gate never observed failing is untested.
```

## [E-04] THE LIVE ENFORCEMENT FIRED ON THE BUILDER'S OWN PROSE

```
COMMAND   tail ~/.omp/logs/omp.2026-09-23.191645.log ; wc -l ~/.omp/run/lexicon-ledger.jsonl
RESULT    14 FIRE events across 3 pids; 56 ledger rows (42 own_utterance, 14 quotation);
          the first at 04:53:42 — FIRE instruction-not-predicate c=0.667 kind=own_utterance
VERDICT   VERIFIED — the meta-observation loop is LIVE: the enforcement acts on the session
          that is doing the work.
```

## [E-05] THE JEV WIRE IS LIVE BUT THE ACCOUNT IS EMPTY (the NAMED skip)

```
COMMAND   grep 'jev skip' ~/.omp/logs/omp.2026-09-23.191645.log
RESULT    8 rows: "jev skip (named): Error: lexicon-gate: jev 402 Payment Required:
          {"detail":{"error_type":"billing_error","message":"Your organization has no
          available TypeSafe API credits..."}}"
VERDICT   VERIFIED — the API was reached and answered. The failure is NAMED, never a silent
          null. This is the loud-fail law working on a real dependency.
```

## [E-06] THE GATE'S COST IS SUB-MILLISECOND (measured, not reasoned)

```
COMMAND   bun run ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts
RESULT    prose 0.024 ms/call · tool-input 0.015 ms/call · tool-result 0.179 ms/call ·
          the injected correction 0.013 ms/call   (200 iterations × 9 rules per shape)
VERDICT   VERIFIED — ~24 ms per 1000-delta turn. The gate is not a latency source.
```

## [E-07] `ui.loop-blocked` IS NOT THE GATE — THE HYPOTHESIS WAS DISPROVEN

```
COMMAND   a python census over all ~/.omp/logs/*.log, joining loop-block counts to fire counts
RESULT    8 pids carry loop-blocked with ZERO lexicon fires: 64613 (86 blocks/0 fires),
          1959440 (75/0), 1009259 (55/0), 2359630 (49/0), 1194193 (40/0), 49882 (13/0),
          3457826 (11/0), 2458725 (18/1)
VERDICT   DISPROVEN — the tempting causal story died on the measurement. Recorded because a
          disproven hypothesis is evidence about the instrument, not noise.
```

## [E-08] THE THREE BAND VOCABULARIES (the seam/impl divergence)

```
COMMAND   grep 'type Band' SEAM/seam.ts ; grep 'bandSchema' /tmp/abide-repo/packages/schema/src/verdict.ts ;
          grep 'type Band' ~/.omp/agent/extensions/lexicon-gate/lib.ts
RESULT    seam.ts:26  -> "act" | "flag" | "clear"
          verdict.ts:4 -> z.enum(["act","flag","clear"])
          lib.ts:43    -> "silent" | "gray" | "fire"     ← THE OUTLIER
VERDICT   VERIFIED — the migration map is mandatory (W2 §W11).
```

## [E-09] ABIDE'S FACTS (the vendoring scope)

```
COMMAND   find /tmp/abide-repo/packages -name '*.ts' | wc -l ; grep -rn 'lexicon' ... ; etc.
RESULT    schema 8 .ts / 530 L · cli 54 .ts / 5,581 L · band.ts 49 L · jev.ts 228 L ·
          verdict.ts 69 L · rubric.ts 204 L
          lexicon hits: 0   ·   "Never executed" hits: 1   ·   streaming/delta hits: 0
VERDICT   VERIFIED — the lexicon type does not exist in abide (F-1 is real); the lint pattern
          exists but has never run (F-4 is real); abide has NO streaming layer (W2 is net-new).
```

## [E-10] THE EXISTING EXTENSION'S SUITE IS GREEN

```
COMMAND   cd ~/.omp/agent/extensions/lexicon-gate && bun test .
RESULT    5 pass / 0 fail / 12 expect() calls · Ran 5 tests across 1 file. [329.00 ms]
VERDICT   VERIFIED — the migration source is a WORKING 689-line system, not a sketch.
```

## [E-11] THE HOT-RELOAD MECHANISM (the exact method, proven)

```
COMMAND   the load-line census across all logs + reading index.ts:83 and lib.ts:137
RESULT    RULES reload in-process at session_start (reload() -> loadRules() -> readdirSync +
          readFileSync — disk is read every call). PROOF: pid 2458725 emitted FIVE load lines
          (02:22:33, 04:13:04 ×3, 04:28:06). CODE needs a new process — PROOF: the 03:35-03:36
          edits did not appear until pid 191645 started at 04:50:39.
VERDICT   VERIFIED — and the load line is the ONLY proof; a reload is never assumed.
```

## [E-12] THE TWO DEFECTS FOUND (named, with the fix direction)

```
D-1  THE CORRECTION RE-SCORE
     COMMAND  a python count over the ledger for confidence == 0.0
     RESULT   14 rows whose span is the gate's own injected correction, scored as own_utterance
     VERDICT  CONFIRMED DEFECT (ledger pollution; harmless to the decision, wrong to the record)
     FIX      a sentinel on injected text, resolved by classifySource to `doc` — the same class
              the tool_result channel already solved (index.ts:184-190)
D-2  THE CREATE-PIN OVERHAUL IS INCOMPLETE
     COMMAND  grep -c -i wave PACKAGE_A_CREATE_PROMPT.md PACKAGE_B_CREATE_PROMPT.md
     RESULT   4 and 4
     VERDICT  CONFIRMED GAP — both pins still describe 4 sequential WAVES, not 2 workers
     FIX      re-mint both pins against the worker topology
```

## THE EVIDENCE CLASSES (what counts, and what never does)

```
COUNTS AS EVIDENCE
  a command + its verbatim output (the exit code, the sha, the count, the test line)
  a file:line anchor read this session
  a ledger row WITH its attribution (the pid + the boot timestamp)
  a predicate's exit code
  a measured number with its method stated (the latency probe: 200 iterations)

NEVER EVIDENCE
  agent prose ("I verified", "it works", "the tests pass")
  a row written by the code under test — it proves the code RAN, not that it WORKED
  a number inherited from a prior session (stale by definition)
  a status field (the artifact is the truth; the field is a hint)
  a hypothesis observed within one window (the ui.loop-blocked story, E-07)
```

## THE PROOF LADDER (the strongest witness wins — deep-host-testing §12)

```
(a) THE RECEIPT          the model reproduces injected text it could not otherwise know
(b) THE BEHAVIOR DELTA   the A/B: the same input with vs without the enforcement state
(c) THE SEAM-EXACT MEAS. the counter/row at the exact mechanism point
(d) THE ROW              existence only — the weakest, never sufficient alone
```

## THE ATTRIBUTION LAW (this host runs multiple concurrent processes)

```
every ledger claim carries: WHICH pid, WHICH boot (the timestamp vs the load line), WHICH turn.
MEASURED this session: 3 pids loaded the extension (191645, 2458725, 3993067); pid 191645
produced 12 of the 14 fires. A row without attribution is fiction — the residual rows from
other processes are discarded, never mixed into a claim.
```

## THE NEGATIVE CONTROLS (the instrument validated before its silence is trusted)

```
| the instrument | the control | the result |
| the merge gate | run it on the empty branches | FAIL (bun test) — the gate bites |
| the ledger census | join blocks to fires | 8 pids block with 0 fires — the story died |
| the latency probe | warm-up then 200 timed iterations | stable sub-ms — not a latency source |
| the exemptor | count own_utterance vs quotation | 42 vs 14 — 25% suppressed (it works) |
| the Jev wire | read the 402 body | the API answered — the wire is live |
```

## THE RESIDUAL (what could not be evidenced, and why)

```
- the engine's behaviour: UNBUILT. No runtime evidence exists or can exist yet.
- the corpus sweep's F1: UNMEASURED — no labeled corpus has been run through a scorer that
  does not exist yet.
- the interrupt's live abort on a WORKER session: NOT YET OBSERVED on a worker (the observed
  fires are on THIS builder session, which is the meta-observation seat, not a worker).
- the merge: NEVER ATTEMPTED. The two halves have never been type-checked together.
- the GitHub required checks: 0 remotes configured; the deny is local-only.
```

## THE EVIDENCE DIRECTORY (where each class lives on disk)

```
| the class | the path | the shape |
| the seam's sha | SEAM/seam.ts | sha256sum |
| the predicates | ~/.omp/agent/managed-skills/*/scripts/check.sh | an exit code + a PASS line |
| the merge gate | gates/merge-gate.sh | 6 checks + a GATE: PASS|FAIL line |
| the enforcement's record | ~/.omp/run/lexicon-ledger.jsonl | one JSON row per decision |
| the process logs | ~/.omp/logs/omp.<date>.<pid>.log | one JSON line per event |
| the extension's suite | ~/.omp/agent/extensions/lexicon-gate/lib.test.ts | 5 pass / 0 fail |
| the cost measurement | ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts | ms/call |
| the worker plan | .trident/worker-plan.md | WORKERS: N + 15 oracle rows |
| the worker specs | wt-*/WORKER_SPEC.md | §W0-§W11 |
| the pins | wt-*/WORKER_GOAL.md | the 7 slots + ONE /goal |
| the todo anchors | wt-*/TODOS.md | every row names its gate |
```

## THE READ-BACK COMMANDS (reproduce any claim above)

```bash
sha256sum /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/SEAM/seam.ts
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
wc -l ~/.omp/run/lexicon-ledger.jsonl
grep -c FIRE /home/leviathan/.omp/logs/omp.2026-09-23.191645.log
cd ~/.omp/agent/extensions/lexicon-gate && bun test .
git -C /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA worktree list
```

**THE ARTIFACT (agreed across the read-first docs, 2026-09-23):**
```
the deploy entry   src/index.ts · 74 L · sha16 6e3b6215d0b2175f   (the DEFAULT EXPORT contract)
the frozen seam    SEAM/seam.ts · 192 L · sha16 66b66a7f10c7c6e7   (FROZEN — no drift)
```
