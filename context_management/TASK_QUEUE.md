# TASK QUEUE — PBK v3 HYDRA

Overwrite semantics — completed moves to done, active to next, backlog re-prioritised.

## ACTIVE (the next action)

```
[ ] N-1  the create-pin overhaul — re-mint both CREATE_PROMPTs against the worker topology
         DONE-WHEN: grep -c -i wave reads 0 in both AND each pin passes the validator
```

## NEXT (ordered, with their gates)

```
[ ] N-2  dispatch W1 + W2 in ONE batch
         GATE: two sessions report `stream`; both branches move
[ ] N-3  the orchestrator's audit loop
         GATE: every returned hunk carries a verdict against §A
[ ] N-4  the merge (W3)
         GATE: gates/merge-gate.sh PASS per branch; the combined tsc exit 0; both suites 0 fail
[ ] N-5  the migration (A108/B108)
         GATE: the new tree passes every oracle the live extension passed
[ ] N-6  the live container/host round
         GATE: .trident/container-test-results.json with per-scenario verdicts
```

## THE WORKER TODO ANCHORS (the pinned boards — the workers own these)

```
W1 (wt-engine/TODOS.md, 12 rows)
  [ ] W1-T1  worktree + branch verified    [ ] W1-T7  D6 the ledger writer
  [ ] W1-T2  spec + pin on disk            [ ] W1-T8  D7 the surface + purity
  [ ] W1-T3  D1 the vendored abide         [ ] W1-T9  the §A self-audit
  [ ] W1-T4  D2 the lexicon check type     [ ] W1-T10 the PR opened
  [ ] W1-T5  D3 the scorer                 [ ] W1-T11 the PR merged  [IMMUTABLE — the orchestrator]
  [ ] W1-T6  D4+D5 the runner + the lint   [ ] W1-T12 canon + ship docs [IMMUTABLE]

W2 (wt-surfaces/TODOS.md, 13 rows)
  [ ] W2-T1  worktree + branch verified    [ ] W2-T8  D6 the action dispatch
  [ ] W2-T2  spec + pin on disk            [ ] W2-T9  D7 the entry + purity
  [ ] W2-T3  D1 the source-kind gate       [ ] W2-T10 the §A self-audit
  [ ] W2-T4  D2 the quote-state machine    [ ] W2-T11 the PR opened
  [ ] W2-T5  D4 the delta accumulator      [ ] W2-T12 the PR merged  [IMMUTABLE]
  [ ] W2-T6  D5 the abort dedupe           [ ] W2-T13 canon + ship docs [IMMUTABLE]
  [ ] W2-T7  D3 the four hooks
```

## BACKLOG (real work, not yet sequenced)

```
[ ] B-1  the GitHub remote + required checks (operator-gated)
[ ] B-2  the Jev account credits (operator-gated, billing)
[ ] D-1  apply the correction sentinel fix (after its own test round)
[ ] the migration of the 9 live rules into the new engine's lexicon loader
[ ] the checkpoint seal at the first green merge
```

## DONE (with evidence)

```
[x] the hydra repo + 2 worktrees            88e4f3b, both seams 66b66a7f
[x] the worker-plan (264 L)                 worker-planning check.sh PASS
[x] the 2 worker specs (333/343 L)          worker-spec check.sh PASS ×2
[x] the 2 goal pins + 2 todo anchors        grep -c '^/goal' -> 1 each
[x] the merge gate + the pre-push deny      the negative control observed (GATE: FAIL)
[x] the 3 anchor commits                    26fa25a / 9049e83 / df915cd
[x] the topology predicate                  hydra-workers check.sh PASS
[x] the canon set (11 docs)                 this pass
[x] the meta-observation                    the ledger forensics + the latency probe
```

## THE GATES, PER TASK (a task completes ONLY when its gate lands)

```
| the task | the gate | the expected output |
| N-1 the pin overhaul | grep -c -i wave in both prompts | 0 |
| N-1 the pin overhaul | validate-goal-prompt.py DRAFT | PASS |
| N-2 the dispatch | trident-wave-read per sessionId | `stream` |
| N-3 the audit | the per-hunk verdict table | every hunk verdict-bearing |
| N-4 the merge | gates/merge-gate.sh per branch | GATE: PASS |
| N-4 the merge | bunx tsc --noEmit (the combined tree) | exit 0 |
| N-4 the merge | both suites | 0 fail each |
| N-5 the migration | the oracles the live extension passed | reproduced |
| N-6 the live round | .trident/container-test-results.json | every scenario has a verdict |
```

## THE ORCHESTRATOR'S LOOP (how this queue is worked)

```
1 DISPATCH     write the specs; spawn the workers (one worktree each; all N in ONE batch)
2 RUN THE CO.  while they work: audit returns, prep the next plan, arm gates, update the canon
3 DECIDE       per stream-state:
                 stream   -> leave alone (working)
                 idle     -> kick (action=resume taskIds=[...] — the same history)
                 complete -> the integrity gate, then the §A audit
                 drift    -> steer (evidence-based, naming the file and the defect)
                 frozen   -> investigate the stream tail before ANY kill
4 GATE         the PR + the required checks; the orchestrator merges, never the worker
5 RECORD       the canon + ship docs after every milestone
```

## THE ANTI-PATTERNS FOR THIS QUEUE (each is a paid-for failure)

```
W1  A WAVE IN COSTUME        a "worker" that is really one task — kill: the 8 columns
W2  A SHARED WORKTREE        two workers, one tree — kill: one worktree per worker, always
W3  DEATH AFTER THE PR       killing the worker at merge — kill: L8, it persists as an SME
W4  AN UNANCHORED SPEC       the spec on disk, no todos — kill: §W7 IS the anchor
W5  A GATE IN PROSE          "the worker will check..." — kill: the predicate + the script
W6  THE ORCHESTRATOR BUILDS  writing product code yourself — kill: dispatch/audit/merge only
W7  TRUSTING THE RETURN      harvesting on the worker's word — kill: the integrity gate + re-verify
W8  CONTEXT DEATH            the worker loses its spec at compaction — kill: §W10's pointers
W9  BATCH WITHOUT RECORD     N workers, no canon update — kill: the record loop
W10 THE MERGE AUTHOR         a worker merging its own PR — kill: Anchor 1
```

## THE STATE OF THIS QUEUE (as of this write)

```
ACTIVE:  1 task  (N-1 the pin overhaul)
NEXT:    5 tasks (N-2..N-6)
BACKLOG: 4 items (2 operator-gated)
DONE:    9 items, each with its evidence line
BLOCKED: 3 (the GitHub remote, the Jev credits, the corpus sweep — all with named unblocks)
```

## THE EVIDENCE FOR EACH DONE ITEM (a done without its evidence is not done)

```
| the done item | the evidence |
| the hydra repo + 2 worktrees | git worktree list -> 3 rows; both seams sha 66b66a7f |
| the worker-plan (264 L) | check.sh -> PASS (WORKERS=2, oracle rows=15, T-refs=32) |
| the 2 worker specs (333/343 L) | check.sh ×2 -> PASS: armable |
| the 2 pins + 2 todo anchors | grep -c '^/goal' -> 1 each; 12 and 13 todo rows |
| the merge gate + the deny | the negative control: GATE: FAIL — DO NOT MERGE |
| the 3 anchor commits | 26fa25a / 9049e83 / df915cd |
| the topology predicate | hydra-workers check.sh -> PASS |
| the canon set (11 docs) | the U-gate run below |
| the meta-observation | 56 ledger rows · 14 fires · the latency probe's 4 numbers |
```

## THE BLOCKERS, IN DETAIL (with the exact unblock)

```
B-1 · THE GITHUB REMOTE
  the state: 0 remotes configured. `git remote -v` returns nothing.
  why it is blocked: creating a repository on the operator's GitHub account is an external
    side effect. The Hard-Dependency Law: report the blocker, list the options, stop.
  the options: (a) authorise a repo name + org and I create it; (b) accept the local gate for
    this run; (c) point at an existing repo.
  what the local gate already gives: 6 mechanical predicates + the pre-push deny. What it does
    NOT give: a deny the worker cannot delete (the local hook is editable by the worker).

B-2 · THE JEV CREDITS
  the state: 402 Payment Required, 8 named skips in the log.
  why it is blocked: billing, operator-owned.
  what already works: the designed `jev:null + a NAMED error` path — the wire is live, the
    failure is loud.

B-3 · THE CORPUS SWEEP
  the state: no scorer exists, so no F1 can be measured.
  why it is blocked: it depends on N-2/N-4 (the engine).
  the unblock: W1's D3 lands, then the sweep runs against the labeled corpus.
```

## THE METRICS TO WATCH (what "progress" means, mechanically)

```
| the metric | now | the target |
| predicates green | 4 of 4 | stays 4 |
| oracle rows with a value | 5 of 15 | 15 of 15 |
| wt-engine/src entries | 0 | 7 modules |
| wt-surfaces/src entries | 0 | 7 modules |
| the create prompts saying "wave" | 8 | 0 |
| the combined-tree tsc | not run | exit 0 |
| the live round artifact | absent | .trident/container-test-results.json |
| the open defects | 2 | 0 (or 1, the operator-gated GitHub half) |
```

## THE ORACLE ASSIGNMENT (which worker judges which row)

```
W1 (wt-engine) judges: OR-2 (abide's lexicon hits) · OR-3 (the lint pattern) ·
  OR-5 (the extension's suite) · OR-6 (the engine's purity) · OR-8 (the lexicon separates) ·
  OR-9 (abide's lint REFUSES) · OR-15 (the ledger records the decider)
W2 (wt-surfaces) judges: OR-4 (abide's streaming) · OR-5 (the extension's suite) ·
  OR-7 (the surfaces' purity) · OR-10 (the gate suppresses 5 FP) · OR-11 (the interrupt ABORTS) ·
  OR-12 (the negatives stay silent) · OR-13 (the payload carries it)
THE MERGE (W3) judges: OR-14 (the combined tree checks)
THE PRE-STATE (both read): OR-1 (the seam's sha)
```

## THE ESCALATION PATH (when a worker is stuck)

```
1  READ the session stream (the part content, not the status field)
2  IF off-course content -> STEER, naming the file and the defect
3  IF idle mid-task -> KICK (resume the SAME history; never respawn a worker that did work)
4  IF frozen past the ETA -> read the stream tail + the reasoning BEFORE any kill
5  IF a session did 200 parts of work -> kick forever
   IF a session did ZERO work after 3 kicks -> kill + fresh-dispatch
6  NEVER kill a session you did not spawn (the host runs concurrent operator sessions)
```

## THE RECORD LOOP (what lands where, after every milestone)

```
| the milestone | the canon doc | the ship doc |
| a wave of work completes | RUNNING_BUILD_LOG (the moment) | BUILD_REPORT |
| a bug is root-caused | RUNNING_DEBUG_LOG (the moment) | DEBUG_LOG |
| a ruling is made | DECISION_CHAIN | — |
| evidence is produced | EVIDENCE_STATE | TESTING_LOG |
| the state changes | CURRENT_STATE + BUILD_STATE | — |
| a spec violation occurs | — | SPEC_VIOLATION_LOG |
| a theatrical claim is caught | — | THEATRICALITY_LOG |
```
