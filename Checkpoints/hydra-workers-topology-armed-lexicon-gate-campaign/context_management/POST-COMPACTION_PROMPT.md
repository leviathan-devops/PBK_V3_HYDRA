# POST-COMPACTION PROMPT — PBK v3 HYDRA

Overwrite semantics — regenerated fully from the current state. This IS the next agent's entry
sequence.

## YOUR ENTRY SEQUENCE (do these in order, before any action)

```
1  READ context_management/COMPACTION_SURVIVAL.md         the state + the 10 operating laws
2  READ context_management/CURRENT_STATE.md               the measured truth + the honest gaps
3  RUN the 4 predicates (do NOT trust the docs' claims):
     bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
     bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
     bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md
     bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md
4  RUN the merge gate on the empty branches — observe it FAIL (the negative control)
     bash gates/merge-gate.sh worker/engine wt-engine
5  READ .trident/worker-plan.md  (WORKERS: 2 · the 15 oracle rows · §A the audit table)
6  READ the two worker specs (wt-*/WORKER_SPEC.md) — the executable contracts
7  THEN act on TASK_QUEUE.md's ACTIVE row: N-1 the create-pin overhaul
```

## WHAT THIS BUILD IS (the one-paragraph brief)

```
PBK v3 HYDRA is a two-worker build of a deterministic enforcement pipeline against a FROZEN
SEAM. W1 (wt-engine) builds the engine: abide vendored in-tree, a NEW `lexicon` check type
(the deterministic pre-gate), abide's never-executed lint pattern made to RUN, and
`check(req): Promise<Decision>` exported with NO host reference. W2 (wt-surfaces) builds the
OMP host surfaces: the source-kind gate, the quote-state walk, the 4 hooks (prose/tool-call/
tool-result/post-tool-use), the streaming delta accumulator, the abort dedupe, and the action
dispatch — computing NO band. They build in PARALLEL, in separate git worktrees, against the
same frozen seam. The merge is the ORCHESTRATOR's act.
```

## THE CURRENT STATE IN FIVE LINES

```
1  the topology is ARMED and committed (4 predicates green)
2  the engine and the surfaces are UNBUILT (both src/ trees empty)
3  the live extension (689 L, 5/5 green) is the MIGRATION SOURCE, not a worker's to edit
4  the create pins still describe WAVES — N-1 fixes that before any dispatch
5  0 git remotes; Anchor 1's GitHub half is OPEN and operator-gated
```

## THE LAW YOU MUST NOT VIOLATE (the five that bite hardest)

```
1  NEVER EDIT SEAM/seam.ts. It is frozen at sha 66b66a7f10c7c6e7.
2  NEVER DISPATCH A WORKER WITH A PIN THAT DESCRIBES WAVES. N-1 precedes N-2.
3  NEVER CLAIM WITHOUT THE PRODUCING COMMAND. The docs are claims; the commands are evidence.
4  NEVER APPLY A LIVE-ENFORCEMENT EDIT WITHOUT ITS OWN TEST ROUND (D-111).
5  NEVER INFER AUTHORISATION FROM THE ARCHITECTURE. Report the blocker; the operator decides.
```

## THE THREE DELIVERABLES THIS SESSION PRODUCED (for continuity)

```
1  THE META-OBSERVATION   the lexicon-gate firing on the builder's own session — 56 ledger
                          rows, 14 FIRE events, 42 own_utterance vs 14 quotation (the exemptor),
                          the latency probe (0.024/0.015/0.179/0.013 ms per call)
2  THE CANON SET          11 docs, the 2 logs first, the hot-reload method documented verbatim
3  THE HOT-SEAT ROUND     the deep-host-testing pass — the verdicts, the 2 defects, the 1
                          disproven hypothesis
```

## THE HONEST HANDOFF (what a fresh agent should NOT assume)

```
- do NOT assume any worker has run. None has.
- do NOT assume the engine exists. It does not.
- do NOT assume the F1=1.000 number. It is unproven; no scorer exists.
- do NOT assume the merge works. It has never been attempted.
- do NOT assume the GitHub gate exists. There is no remote.
- DO assume the gate will fire on your prose. It is running, and it is correct.
```

## THE ARCHITECTURE IN ONE DIAGRAM (the shape you are resuming)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ THE FROZEN SEAM — SEAM/seam.ts · 192 L · sha 66b66a7f10c7c6e7            │
│ the 12 exports: Band · CheckPhase · Thresholds · RuleStatus · Verdict ·   │
│ Rule · SrcKind · Surface · PatternFamily · LexiconRule · CheckRequest ·   │
│ Decision (+ CheckResult, BandFn)                                          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │  both workers build against it
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
┌──────────────────────────────┐   ┌──────────────────────────────────────┐
│ W1 · THE ENGINE              │   │ W2 · THE SURFACES                     │
│ wt-engine / worker/engine    │   │ wt-surfaces / worker/surfaces         │
│ SME: the abide-vendored      │   │ SME: the OMP host surfaces + the      │
│      decision engine + the   │   │      streaming interrupt              │
│      lexicon pre-gate        │   │                                       │
│ D1 vendor/abide              │   │ D1 src/gate/source-kind.ts            │
│ D2 src/lexicon/schema.ts     │   │ D2 src/gate/quote.ts                  │
│ D3 src/lexicon/score.ts      │   │ D3 src/surfaces/{prose,tool,result,   │
│ D4 src/engine/check.ts       │   │      post}.ts                          │
│ D5 src/lint/runner.ts        │   │ D4 src/surfaces/stream.ts (the accum.) │
│ D6 src/ledger/writer.ts      │   │ D5 src/surfaces/stream.ts (the dedupe) │
│ D7 src/index.ts              │   │ D6 src/action/dispatch.ts              │
│                              │   │ D7 src/index.ts (the pi.on registrations)│
│ gate: tsc + F1=1.000 +       │   │ gate: tsc + 0 FP + 2 abort/3 silent +  │
│       the lint REFUSED +     │   │       the purity grep                  │
│       the purity grep        │   │                                       │
│ purity: grep -rc "ctx\|pi\." │   │ purity: grep -rc "bandOf\|confidence"  │
└──────────────┬───────────────┘   └────────────────┬─────────────────────┘
               │                                    │
               └────────────────┬───────────────────┘
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ W3 · THE MERGE (the ORCHESTRATOR's act — never a worker's)                │
│ gates/merge-gate.sh per branch · the combined tsc · both suites           │
│ then the migration (A108/B108) then the live round                        │
└──────────────────────────────────────────────────────────────────────────┘
```

## THE ENFORCEMENT YOU WILL BE RUNNING UNDER (know it before you act)

```
the extension   ~/.omp/agent/extensions/lexicon-gate/ — index.ts 203 L · lib.ts 307 L
the hooks       6: session_start · message_update · ttsr_triggered · tool_call · tool_result ·
                agent_end
the rules       9 in ~/.omp/agent/rules/: dist-not-built · fallback-slop ·
                instruction-not-predicate · phantom-and-claim · record-anchor · scope-shrink ·
                stale-substrate · theatrical-verification · unwired-edge
what it does    scores the agent's PROSE (message_update -> ctx.abort() + an injected
                correction) and the agent's TOOL INPUTS (tool_call -> {block: true})
the exemptor    only `own_utterance` is scorable; quotation / table / doc / rule_source are not
the Jev wire    live but the account is empty (402) — the designed path is jev:null + a NAMED error
THE PRACTICAL RULE: name predicates, not intentions. "I should be careful" fires; "grep -c X"
does not. The gate is correct; change the prose.
```

## THE FIVE FILES THAT DEFINE THE WORK (read in this order)

```
1  .trident/worker-plan.md          the plan: WORKERS: 2 · the 15 oracles · §A the audit table
2  wt-engine/WORKER_SPEC.md         W1's contract: §W0 scope .. §W10 resume pointers
3  wt-surfaces/WORKER_SPEC.md       W2's contract: §W0 .. §W11 (the migration vocabulary)
4  SEAM/seam.ts                     the frozen interface both implement
5  TASK_QUEUE.md                    the ACTIVE row is N-1 (the create-pin overhaul)
```

## THE ONE-SENTENCE RESUME INSTRUCTION

```
Re-mint both CREATE_PROMPTs against the worker topology (they still say "wave"), then dispatch
W1 and W2 in ONE batch, one per worktree, each armed with its spec + its pin + its todos.
```

## THE STATE NUMBERS (re-measure; do not inherit)

```
| the number | the value at this write | the command |
| the worktrees | 3 (master + 2 workers) | git worktree list |
| the predicates | 4 of 4 PASS | the 4 check.sh runs |
| the seam's sha | 66b66a7f10c7c6e7 | sha256sum SEAM/seam.ts |
| wt-engine/src entries | 0 | ls wt-engine/src \| wc -l |
| wt-surfaces/src entries | 0 | ls wt-surfaces/src \| wc -l |
| the ledger rows | 56 | wc -l ~/.omp/run/lexicon-ledger.jsonl |
| the create-prompt wave mentions | 8 (4 + 4) | grep -c -i wave PACKAGE_*_CREATE_PROMPT.md |
| the canon docs | 11 | ls context_management/*.md \| wc -l |
```

## THE THREE-DELIVERABLE RECORD (what the operator asked for, and where it is)

```
1  "meta observe how this is firing"
   -> ~/.omp/agent/managed-skills/runtime-testing/references/meta-observations.md (204 L)
   -> the raw record: 56 ledger rows · 14 fires · the exemptor's 42/14 split · W-1..W-6 ·
      F-1..F-4 · P-1..P-4 · G-1..G-7 · the three-class verdict
2  "document the exact method you just used for hot reload"
   -> context_management/CURRENT_STATE.md § THE HOT-RELOAD METHOD
   -> two channels: rules in-process at session_start (pid 2458725's five load lines);
      code per-process (the 03:36 edit appearing only at pid 191645's 04:50 start)
3  "deep-host-testing test everything directly in the hot seat for real time latency"
   -> PBK_V3_HYDRA/.trident/host-suite-results.json (112 L) — 7 phases · 2 defects ·
      1 disproven · 5 negative controls · the residual
   -> the latency: 0.024 / 0.015 / 0.179 / 0.013 ms per call
```

## THE ONE THING TO REMEMBER

```
THE SCAFFOLD IS REAL AND THE PRODUCT IS ABSENT. The predicates pass, the canon is dense, the
merge gate bites, the live enforcement fires correctly — and wt-engine/src and wt-surfaces/src
are both empty. The next act that changes that is the DISPATCH, and it is gated on N-1.
```

## THE ANTI-DERAIL LIST (recognize these; do not re-live them)

```
1  SCOPE SHRINK UNDER PRESSURE — "let me just do the engine first". The build is BOTH workers;
   a delivered subset is a FAILED delivery. Dispatch both.
2  APPROVAL-GATING REQUIRED WORK — "should I dispatch now?" The answer is the execution. The
   only operator-gated items are B-1 (the GitHub remote) and B-2 (the Jev credits).
3  A WAVE IN COSTUME — dispatching 4 sequential phases inside one worktree. The worker owns the
   whole worktree; the phases are ITS internal structure, not separate dispatches.
4  TRUSTING A RETURN — harvesting on the worker's word. The stream gate + the mechanical
   re-verify are mandatory.
5  A GATE IN PROSE — "the worker will check...". The gate is `gates/merge-gate.sh` + the PR.
6  THEATRICAL VERIFICATION — a "PASS" naming no artifact. The passToken lives in a TOOL RESULT.
7  FIXING THE SITE NOT THE CLASS — the correction re-score is the tool_result fix's twin;
   sweep the sibling channels.
8  A CAUSAL CLAIM FROM ONE WINDOW — run the A/B. The ui.loop-blocked story died that way.
```

## THE ANTI-STOP LIST (these never close the run)

```
1  "the predicates pass"        — the predicates check the SCAFFOLD, not the product
2  "the canon is dense"         — documentation mass is not progress
3  "the live gate fires"        — the enforcement working is not the build working
4  "no workers reported errors" — no workers have RUN
5  "the merge gate is green"    — it is green on nothing (both src trees are empty)
6  a green suite without the artifact — the suite tests the fixture
7  "blocked" as done            — a block names its resume condition
8  "zero bugs found"            — a red flag about the instrument, not an achievement
```
