# NEXT STEPS — PBK v3 HYDRA

Overwrite semantics — the current plan replaces the old one.

## THE IMMEDIATE QUEUE (in dependency order)

```
N-1  THE CREATE-PIN OVERHAUL            the one remaining package task
     both CREATE_PROMPTs still describe 4 sequential WAVES. Re-mint each against the worker
     topology: 2 workers, 1 worktree each, the anchors, the gate. DONE-WHEN:
     `grep -c -i wave` reads 0 in both, and each pin passes validate-goal-prompt.py.

N-2  DISPATCH W1 AND W2                  the first live run of the worker topology
     one worker per worktree, both in ONE batch. Each receives its WORKER_SPEC.md + its
     WORKER_GOAL.md + its TODOS.md as its operating contract. The oracles stay in the plan.
     DONE-WHEN: two sessions report `stream` (working) and their branches move.

N-3  THE ORCHESTRATOR'S AUDIT LOOP        while the workers run
     poll each session; `stream` -> leave alone; `idle` -> kick (resume the same history);
     `complete` -> the integrity gate, then the per-hunk WHAT/WHY/HOW against §A.
     DONE-WHEN: every returned hunk carries a verdict (CORRECT | FLAWED | FITTED-TO-GOLDEN |
     DOWNSTREAM-FABRICATION | ARCHITECTURE-VIOLATION | SCOPE-CREEP).

N-4  THE MERGE (W3)                       the orchestrator's act, never a worker's
     run `gates/merge-gate.sh` per branch; then merge both into master; then type-check the
     COMBINED tree and run BOTH suites. DONE-WHEN: OR-14 green (the combined tsc exit 0) and
     both suites report 0 fail.

N-5  THE MIGRATION (A108/B108)            the live extension's logic moves into the new tree
     port classifySource (lib.ts:81), isQuotedMatch (lib.ts:288), SCORABLE (lib.ts:71) into
     W2's src/gate/; translate the band vocabulary per W2 §W11. The live extension is
     SUPERSEDED only after the integration audit is green.
     DONE-WHEN: the new tree passes every oracle the old extension passed, plus OR-11..OR-13.

N-6  THE LIVE CONTAINER/HOST ROUND         the runtime proof
     deploy the merged bundle; drive the 4 surfaces; observe ctx.abort() + the injected
     correction with tool-result tokens; record `.trident/container-test-results.json`.
     DONE-WHEN: every scenario carries a passToken in a tool result and a failToken absent.
```

## THE BLOCKED / OPERATOR-GATED ITEMS (named, with the unblock condition)

```
B-1  THE GITHUB REMOTE          BLOCKED on an operator decision
     Anchor 1's remote half needs a repository on the operator's account. Creating one is an
     external side effect. UNBLOCK: the operator authorises the repo (name + org), or accepts
     the local gate as sufficient for this run.

B-2  THE JEV LIVE CALL          BLOCKED on billing (402)
     the TypeSafe account has no credits. UNBLOCK: add credits, or accept the designed
     `jev:null + a NAMED error` path as the current behaviour (it is already correct).

B-3  THE CORPUS SWEEP           BLOCKED on the engine (N-2/N-4)
     F1=1.000 cannot be measured until a scorer exists. UNBLOCK: W1's D3 lands.
```

## THE ORACLES THAT REMAIN OPEN (from the worker-plan's 15)

```
OR-6  the engine's purity      grep -rc "ctx\|pi\." wt-engine/src/      PENDING (unbuilt)
OR-7  the surfaces' purity     grep -rc "bandOf\|confidence" wt-surfaces/src/  PENDING
OR-8  the lexicon separates    bun test -t lexicon_sweep -> F1=1.000     PENDING
OR-9  abide's lint REFUSES     bun test -t lint_runner                   PENDING
OR-10 the gate suppresses 5 FP bun test -t source_kind_gate              PENDING
OR-11 the interrupt ABORTS     the harness: 2 positives                  PENDING
OR-12 the negatives stay silent the harness: 3 negatives                 PENDING
OR-13 the payload carries it   the harness prints the payload            PENDING
OR-14 the combined tree checks bunx tsc --noEmit (both halves)           PENDING (the merge)
OR-15 the ledger records the decider grep -c decidedBy                   PENDING
```

## THE PER-WORKER EXECUTION DETAIL (what each worker does, in its own words)

```
W1 · THE ENGINE (wt-engine, branch worker/engine)
  D1 the vendored abide      cp /tmp/abide-repo/packages/{schema,cli}/src/** -> vendor/abide/ ;
                             VENDOR.md records a sha per file; intra-abide imports made relative
                             GATE: bunx tsc --noEmit vendor/abide/index.ts -> exit 0
  D2 the lexicon check type  extend abide's check schema with a "lexicon" variant carrying
                             PatternFamily + thresholds; a missing `use:` THROWS
                             GATE: grep -c 'z.literal("lexicon")' -> >= 1
  D3 the scorer              import abide's bandFor (band.ts:48); weights per the SEAM
                             (descriptive neg+=1 · suggestive pos+=2 · substitute pos+=2 ·
                             use neg+=3); confidence = pos/(pos+neg+1); the band DERIVED
                             GATE: bun test -t lexicon_sweep -> F1=1.000
  D4 the runner order        source-kind gate -> the lexicon score -> the band -> the action
                             GATE: bun test -t runner_order -> the 4 transitions
  D5 the lint runner         execute abide's rubric pattern (rubric.ts, the ONE
                             "Never executed" hit) against a known-bad fixture
                             GATE: bun test -t lint_runner -> REFUSED
  D6 the ledger writer       the row carries decidedBy (lexicon | jev)
                             GATE: grep -c '"decidedBy"' .abide/events.jsonl -> >= 1
  D7 the public surface      check(req): Promise<Decision> satisfying the seam; NO host ref
                             GATE: grep -rc "ctx\|pi\." src/ -> EMPTY

W2 · THE SURFACES (wt-surfaces, branch worker/surfaces)
  D1 the source-kind gate    port classifySource (lib.ts:81) + SCORABLE (lib.ts:71)
                             GATE: bun test -t source_kind_gate -> 0 FP + 5/5 controls
  D2 the quote-state machine port isQuotedMatch (lib.ts:288) — the STATE walk, not the index
                             GATE: bun test -t quote_state -> the 5 cases
  D3 the four hooks          prose -> ctx.abort() + sendUserMessage; tool-call -> {block};
                             tool-result -> {isError}; post-tool-use -> the repair demand
                             GATE: bun test -t abort_dispatch -> 2 abort / 3 silent
  D4 the delta accumulator   buffer deltas; assemble at the newline boundary; cap the buffer
                             GATE: bun test -t delta_accumulator -> the split line fires
  D5 the abort dedupe        a per-turn Set of signatures; reset at session_start/agent_end
                             GATE: bun test -t abort_dedupe -> abort=1 across 10 deltas
  D6 the action dispatch     map (surface, phase, decidedBy, band) -> the action kind
                             GATE: bun test -t action_map -> the 4 kinds
  D7 the entry               register the 4 hooks + session_start + agent_end; NO band math
                             GATE: grep -c 'pi.on(' src/index.ts -> >= 4
```

## THE RISK REGISTER (what is most likely to go wrong, and the mitigation)

```
| the risk | the likelihood | the mitigation (already in the spec) |
| the two halves drift from the seam | LOW | the seam is frozen + the merge gate checks its sha |
| W1 reimplements abide instead of vendoring | MEDIUM | §W5's detection: diff the vendored file vs the source |
| W2 recomputes the band | MEDIUM | §W5's detection: grep -rc "bandOf\|confidence" src/ |
| the corpus sweep cannot produce a labeled set | MEDIUM | the pin's HARD STOP names it; the worker reports, never invents a band |
| the band vocabulary mistranslates on migration | HIGH | W2 §W11 carries the map BEFORE the port |
| a worker merges its own PR | LOW | the pre-push hook + the IMMUTABLE todo row |
| the abort storm (no dedupe) | MEDIUM | §W3 S4 + the mutation S7 |
| a green suite that tests a fixture | MEDIUM | §W5's detection: grep "from '../src" tests/ |
```

## THE DEFINITION OF DONE FOR THIS BUILD

```
ALL of:
  the 8 target criteria (T-1..T-8) carry their producing command's output
  the 15 oracle rows carry a measured value
  the merge gate PASSES on the combined tree (not just per branch)
  the canon's 5 read-first docs agree on the merged dist's sha
  the live round recorded .trident/container-test-results.json with per-scenario verdicts
  the migration is complete and the live extension is superseded only after the audit is green
  the residual is NAMED (what could not be tested, and why)
ANYTHING LESS IS OPEN.
```

## THE PROMPT FOR THE NEXT ACTION (paste-ready for N-1)

```
# THE TASK
Re-mint BOTH create pins against the worker topology. The two files
PACKAGE_A_CREATE_PROMPT.md and PACKAGE_B_CREATE_PROMPT.md each still describe 4 sequential
WAVES (grep -c -i wave -> 4 and 4). They must describe ONE WORKER each.

# THE AUTHORITY (read, do not restate)
  .trident/worker-plan.md              WORKERS: 2 · the 15 oracle rows · the §A audit
  wt-engine/WORKER_SPEC.md             W1's contract (§W0-§W10)
  wt-surfaces/WORKER_SPEC.md           W2's contract (§W0-§W11)
  wt-engine/WORKER_GOAL.md             W1's behavior program (the 7 slots)
  wt-surfaces/WORKER_GOAL.md           W2's behavior program
  ~/.omp/agent/skills/create/references/11-goal-pin-template.md   the 15-section map

# THE ACCEPTANCE
  grep -c -i wave PACKAGE_*_CREATE_PROMPT.md   -> 0 and 0
  each pin carries: GOAL · BASELINE (measured) · the BUILD PACKAGE · PHASES · the WORKER
  (not waves) · LAWS (with ripwire named) · the PROOF CONTRACT (tool-result-bound tokens) ·
  the RUNTIME SEAT · the ADVERSARIAL LOOP · the DOC CONTRACT · the CHECKPOINT · HARD STOPS ·
  STOP · ANTI-DERAIL · RESUME POINTERS
  python3 validate-goal-prompt.py <draft>   -> PASS
```

## THE ORDERING LAW (why N-1 precedes N-2)

```
the pin is the worker's DISPATCH CONTRACT. Dispatching a worker with a pin that describes
waves would tell it to run 4 sequential phases inside a single worktree — the exact
anti-pattern (W1, a wave in costume) the architecture exists to kill.

THEREFORE: the pins are re-minted BEFORE any dispatch. This is not a documentation chore; it
is the dispatch's precondition.
```

## THE COMPACTION NOTE (what the next agent must not re-derive)

```
- the seam is FROZEN at sha 66b66a7f10c7c6e7 — do not edit it; the merge gate checks it
- the 2 worktrees exist and are committed; do not recreate them
- the 4 predicates pass; re-run them rather than trusting this doc
- the gate FIRES on the builder's own prose by design — do not fight it; change the prose
- the rules reload in-process at session_start; the CODE needs a new process
- the 14 c=0.000 ledger rows are a known defect with a designed fix (D-111); do not "discover" it
```

## THE DEFINITION OF "DONE" FOR N-1 (the immediate task, in full)

```
THE TARGET   both CREATE_PROMPTs re-minted against the worker topology
THE FILES    PACKAGE_A_ENGINE/PACKAGE_A_CREATE_PROMPT.md   (112 L, 4 wave mentions)
             PACKAGE_B_SURFACES/PACKAGE_B_CREATE_PROMPT.md (113 L, 4 wave mentions)
THE CHANGE   each becomes ONE worker's pin: the 15-section map from
             ~/.omp/agent/skills/create/references/11-goal-pin-template.md, filled from the
             measured state, referencing .trident/worker-plan.md + that worker's
             WORKER_SPEC.md + WORKER_GOAL.md + TODOS.md.
THE GATES    grep -c -i wave -> 0 and 0
             python3 validate-goal-prompt.py <draft> -> PASS (7/7 slots, no placeholders)
THE HONEST NOTE   the pin is <= 200 lines; the depth lives in the worker spec (333/343 L) on
             disk. A pin that tries to carry the spec is a pin that rots.
```

## THE FIRST-REPLY CONTRACT FOR THE NEXT AGENT (what it must do before acting)

```
1  re-measure the baseline: git worktree list · the 4 predicates · the seam's sha
2  post the diff against this doc's numbers
3  run the merge gate and observe it FAIL on the empty branches (the control)
4  THEN act on N-1
```

---

## THE FINAL STATE — 31c2a8f (2026-09-23T15:35+04:00)

**THE GOAL IS AT 4/6 STOP CONDITIONS.** The 2 remaining are BLOCKED with named resume conditions.

```
MET:
  v 1. the 6 actionable bugs FIXED + re-proven (HT-BUG-3,-4,-5,-6,-10,-15 + HT-BUG-14)
  v 4. the tree clean (0 wave mentions · 0 wave plans · 1 worktree)
  v 5. the canon + ship docs current (11/11 canon · 6/6 ship · the 5 read-first agree on the artifact)
  v 6. the seal written (Checkpoints/pbk-v3-ship-grade-fixes · Mode B · 8/8 self-check green)

BLOCKED (named resume conditions):
  x 2. THE AUDIT GATE: the ocr provider chain is quota-dead. RESUME: a fresh scan when the lane
       recovers, or a non-rate-limited lane. HT-BUG-10 is CONFIRMED LIVE (the tool returned
       GATE: PASS on a run where all 15 files failed). NEVER upgraded to PASS.
  x 3. THE DEPLOY: the operator runs W6_DEPLOY_HANDOFF.md, then the live round (L4).
```

**THE BUG LEDGER (8 fixed, 2 blocked):**
```
FIXED   HT-BUG-3,-4 (the scorer) · HT-BUG-5,-6 (the live rules) · HT-BUG-10 (the blind-pass
        guards, in source) · HT-BUG-14 (the loader) · HT-BUG-15 (the default export) ·
        HT-BUG-16 (the stale handoff hash)
BLOCKED HT-BUG-7 (the Jev 402 — an external account) · HT-BUG-13 (the GI graph gate — external)
```

**THE NEXT SESSION'S FIRST ACTIONS:**
1. Read W6_DEPLOY_HANDOFF.md (the operator's deploy — the artifact is 74 L, sha16 6e3b6215d0b2175f).
2. Re-run the audit scan (if the lane recovered): `ocr scan --path src --concurrency 1`.
3. W2_FIX_REPORT.md (the W2 verification seat, in flight at this writing).

