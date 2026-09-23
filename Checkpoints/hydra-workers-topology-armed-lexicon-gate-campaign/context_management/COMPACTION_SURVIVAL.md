# COMPACTION SURVIVAL — PBK v3 HYDRA

Overwrite semantics for the state block; the operating laws section is kept verbatim.

## STATE AT A GLANCE (read this first after a compaction)

```
THE PROJECT   /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA  (its own git repo)
THE TOPOLOGY  2 workers · 2 worktrees · 2 branches · the frozen seam between them
  master          26fa25a   the worker-plan + the merge gate + the pre-push deny
  worker/engine   9049e83   W1's anchors (spec 333 L · pin 57 L · todos 16 L)
  worker/surfaces df915cd   W2's anchors (spec 343 L · pin 60 L · todos 17 L)
THE SEAM      SEAM/seam.ts · 192 L · sha 66b66a7f10c7c6e7 · tsc exit 0 · FROZEN
THE BUILD     wt-engine/src/ 0 entries · wt-surfaces/src/ 0 entries  -> UNBUILT
THE LIVE ENF. ~/.omp/agent/extensions/lexicon-gate (689 L, 5/5 green) · 9 rules · 56 ledger rows
THE NEXT ACT  N-1: re-mint both CREATE_PROMPTs against the worker topology (they still say "wave")
```

## THE OPERATING LAWS (verbatim — these do not decay)

```
1  THE SEAM IS FROZEN. sha 66b66a7f10c7c6e7. Editing it invalidates BOTH workers. The merge
   gate checks it before any merge.
2  THE WORKER OWNS ITS WORKTREE. One worker, one worktree, one branch. Never share.
3  THE WORKER CANNOT MERGE ITS OWN PR. W1-T11 / W2-T12 are IMMUTABLE and belong to the
   orchestrator.
4  THE ORACLES STAY IN THE PLAN. Never in a dispatch prompt — a worker that fits to the
   expected answer proves nothing.
5  THE ARTIFACT IS THE EVIDENCE. A claim carries its producing command. Prose is never proof.
6  THE GATE FIRES ON THE BUILDER'S OWN PROSE BY DESIGN. Change the prose; never fight the gate.
7  RULES RELOAD IN-PROCESS AT session_start; CODE NEEDS A NEW PROCESS. The load line is the
   only proof of a reload.
8  THE CANON IS THE COMPACTION KIT. A stale canon makes the next agent rebuild the wrong thing.
9  LOUD FAIL OR CLEAR PASS. A missing `use:` THROWS. A Jev failure is a NAMED error, never a
   silent null.
10 NO STUBS. Working machinery is ported with its dependency tree, never replaced by a
   placeholder.
```

## THE READ-FIRST ORDER (a fresh agent's entry sequence)

```
1  context_management/COMPACTION_SURVIVAL.md      (this file — the state + the laws)
2  context_management/POST-COMPACTION_PROMPT.md   (the entry sequence)
3  .trident/worker-plan.md                        (the topology + the 15 oracles + §A)
4  wt-engine/WORKER_SPEC.md  ·  wt-surfaces/WORKER_SPEC.md     (the two contracts)
5  SEAM/seam.ts + SEAM/SEAM_CONTRACT.md           (the frozen contract)
6  git worktree list ; git log --oneline -1 <each branch>
7  the predicates (run them; do not trust the docs):
     bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
     bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
     bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md
     bash gates/merge-gate.sh worker/engine wt-engine
```

## THE TRAPS THIS SESSION PAID FOR (do not re-pay)

```
TRAP 1  WRITING A SPEC FROM MEMORY. W1's first draft invented the weights (+2/+3/+3/-3),
        contradicting the frozen seam (neg+=1 / pos+=2 / pos+=2 / neg+=3). Read the CONTRACT,
        never the memory of it.
TRAP 2  ASSUMING A CAUSAL STORY FROM ONE WINDOW. `ui.loop-blocked` appeared seconds after the
        extension loaded — and 8 pids block with ZERO fires. Run the A/B before the claim.
TRAP 3  ASSUMING A RELOAD. The rules reload at session_start; the CODE does not reload at all
        without a new process. The load line is the proof.
TRAP 4  EDITING LIVE ENFORCEMENT WITHOUT A TEST ROUND. The 14 c=0.000 rows have a designed
        fix (a sentinel -> classifySource `doc`); it is NOT applied because a live change
        needs its own test round.
TRAP 5  INFERRING AUTHORISATION. 0 remotes; creating one on the operator's account is an
        external side effect. Report the blocker; do not infer the order.
TRAP 6  MISTAKING A DENSE CANON FOR A BUILT SYSTEM. The canon is dense and accurate about the
        topology; the code is UNBUILT.
```

## THE RESUME COMMAND BLOCK (copy-paste)

```bash
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
git worktree list
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
wc -l context_management/*.md
grep -c -i wave PACKAGE_A_ENGINE/PACKAGE_A_CREATE_PROMPT.md PACKAGE_B_SURFACES/PACKAGE_B_CREATE_PROMPT.md
```

## THE ANCHOR MAP (every load-bearing path + line, so a fresh agent can verify fast)

```
THE SEAM (frozen)
  SEAM/seam.ts:26        Band = "act" | "flag" | "clear"
  SEAM/seam.ts:29        CheckPhase = "edit" | "turn"
  SEAM/seam.ts:32        Thresholds
  SEAM/seam.ts:38        RuleStatus = active | weak | noisy | disabled
  SEAM/seam.ts:41        Verdict
  SEAM/seam.ts:49        Rule
  SEAM/seam.ts:61        SrcKind = own_utterance | quotation | table | doc | rule_source
  SEAM/seam.ts:64        Surface = prose | tool-call | tool-result | post-tool-use
  SEAM/seam.ts:71        PatternFamily { descriptive · suggestive · substitute? · use? }
  SEAM/seam.ts:79        LexiconRule { id · body · description · scope · lexicon · threshold · band }
  SEAM/seam.ts:90        CheckRequest { surface · phase · text · sourceKind · file? · task? }
  SEAM/seam.ts:105       Decision { ruleId · band · probability · decidedBy · sourceKind ·
                         span · correction · capped }
  SEAM/seam.ts:120       CheckResult { decisions · jevCalls · total · errors }
  SEAM/seam.ts:136       BandFn

THE LIVE EXTENSION (the migration source)
  lexicon-gate/index.ts:83     pi.on("session_start", ...) -> reload()
  lexicon-gate/index.ts:93     pi.on("message_update", async (event, ctx) => ... ctx.abort())
  lexicon-gate/index.ts:129    pi.sendUserMessage(...)          ← the correction channel
  lexicon-gate/index.ts:161    pi.on("ttsr_triggered", ...)
  lexicon-gate/index.ts:170    pi.on("tool_call", ...)  -> {block: true, reason}
  lexicon-gate/index.ts:184    pi.on("tool_result", ...) -> {isError: true, content}
  lexicon-gate/index.ts:199    pi.on("agent_end", ...)
  lexicon-gate/lib.ts:51       FROZEN (the marker string)
  lexicon-gate/lib.ts:59       stripInlineFlags
  lexicon-gate/lib.ts:64       compileLexiconPattern
  lexicon-gate/lib.ts:71       SCORABLE = Set(["own_utterance"])
  lexicon-gate/lib.ts:73       RULES_DIR = ~/.omp/agent/rules
  lexicon-gate/lib.ts:74       LEDGER_PATH = ~/.omp/run/lexicon-ledger.jsonl
  lexicon-gate/lib.ts:81       classifySource(line, inFence, fileKind)
  lexicon-gate/lib.ts:93       scoreSignals(text, f) -> {pos, neg, hit}
  lexicon-gate/lib.ts:123      confidence(pos, neg)
  lexicon-gate/lib.ts:127      bandOf(c, {low,high}) -> silent | gray | fire
  lexicon-gate/lib.ts:137      loadRules(dir) — THROWS on invalid regex / no use: / empty condition
  lexicon-gate/lib.ts:179      resolveKey()
  lexicon-gate/lib.ts:195      appendLedger(row, ledgerPath)
  lexicon-gate/lib.ts:210      TYPESAFE_URL
  lexicon-gate/lib.ts:288      isQuotedMatch(line, match) — the quote-STATE walk

THE VENDORING SOURCE
  /tmp/abide-repo/packages/schema/src/verdict.ts:4    bandSchema = z.enum(["act","flag","clear"])
  /tmp/abide-repo/packages/cli/src/lib/band.ts:48     bandFor(probability, thresholds) -> Band
  /tmp/abide-repo/packages/cli/src/lib/band.ts:11     violationProbability
  /tmp/abide-repo/packages/schema/src/rubric.ts       the ONE "Never executed" hit
  /tmp/abide-repo/packages/cli/src/lib/jev.ts:11      imports bandFor
  /tmp/abide-repo/packages/cli/src/lib/jev.ts:216     band: bandFor(probability, thresholds)

THE TOPOLOGY
  .trident/worker-plan.md         WORKERS: 2 · 15 oracle rows · §A the audit
  wt-engine/WORKER_SPEC.md        §W0-§W10
  wt-surfaces/WORKER_SPEC.md      §W0-§W11 (incl. §W11 the migration vocabulary)
  wt-engine/WORKER_GOAL.md        the 7 slots + ONE /goal
  wt-surfaces/WORKER_GOAL.md      the 7 slots + ONE /goal
  wt-engine/TODOS.md              12 rows · wt-surfaces/TODOS.md 13 rows
  gates/merge-gate.sh             6 predicates · .git/hooks/pre-push the direct-push deny
```

## THE VERIFIED FACTS (measured this session — re-verify, do not trust)

```
| the fact | the value | the command |
| the seam's sha | 66b66a7f10c7c6e7... | sha256sum SEAM/seam.ts |
| the seam's size | 192 L | wc -l |
| the seam compiles | exit 0 | bunx tsc --noEmit -p tsconfig.json |
| abide's total | schema 8 .ts/530 L · cli 54 .ts/5,581 L | find + wc |
| abide's lexicon hits | 0 | grep -rn lexicon ... \| wc -l |
| abide's lint pattern | 1 hit | grep -c "Never executed" rubric.ts |
| abide's streaming | 0 hits | grep -rn 'delta' ... \| wc -l |
| the extension's suite | 5 pass / 0 fail | bun test (the extension dir) |
| the ledger | 56 rows | wc -l ~/.omp/run/lexicon-ledger.jsonl |
| the fires | 14 across 3 pids | grep -c FIRE ~/.omp/logs/*.log |
| the gate's cost | 0.024 ms/call prose | bun run latency-probe.ts |
| the predicates | 4 of 4 PASS | the 4 check.sh runs |
| the merge gate | FAIL on empty branches | gates/merge-gate.sh (the control) |
```

## THE DELIVERABLES OF THIS SESSION (what exists because of it)

```
1  THE TOPOLOGY     2 worktrees · 2 specs (333/343 L) · 2 pins (57/60 L) · 2 todo anchors
                    (12/13 rows) · 1 merge gate (20 L) · 1 pre-push deny (11 L) · 4 predicates
2  THE CANON SET    11 docs in context_management/, the 2 logs first
3  THE META-OBS.    references/meta-observations.md (204 L) + guardrail-spec.md (85 L) +
                    suggested-improvements.md (67 L)
4  THE HOT-SEAT     .trident/host-suite-results.json (112 L) — 7 phases · 2 defects ·
                    1 disproven · 5 negative controls
5  THE MEASUREMENT  the gate's cost (0.024 ms/call) + the ledger forensics (56 rows)
```

## THE STATE OF THE THREE ANCHORS (each verified this session)

```
ANCHOR 1  THE MERGE GATE      WIRED + OBSERVED FAILING (the negative control)
          gates/merge-gate.sh 6 predicates · .git/hooks/pre-push the direct-push deny
          OPEN: the GitHub remote half (0 remotes; operator-gated)
ANCHOR 2  THE TODO ANCHORS    WIRED — 12 rows (W1) and 13 rows (W2), each naming its gate
          2 IMMUTABLE rows each (the PR-merged row and the record row)
ANCHOR 3  THE GOAL PINS       WIRED — the 7 slots + ONE /goal line each, committed to the trees
```

## THE FOUR PREDICATES (the mechanical proof the topology is real)

```
bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
  -> PASS: worker-plan dispatchable (WORKERS=2, oracle rows=15, T-refs=32)
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md
  -> PASS: worker-spec armable
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md
  -> PASS: worker-spec armable
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh      # from the project root
  -> PASS: worker topology verified
```

## WHAT A FRESH AGENT MUST NOT DO

```
- do NOT edit SEAM/seam.ts (frozen; the merge gate checks its sha)
- do NOT dispatch a worker with a pin that describes waves (N-1 first)
- do NOT apply the correction-sentinel fix to live enforcement without its own test round
- do NOT create a GitHub remote without the operator's explicit order
- do NOT trust these docs' numbers — re-run the predicates and the commands
- do NOT mistake this dense canon for a built system: the code is 0 lines
```
