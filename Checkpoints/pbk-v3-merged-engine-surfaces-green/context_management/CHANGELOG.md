# CHANGELOG — PBK v3 HYDRA

Append semantics. One entry per session/accomplishment, with evidence and honest disclosures.

## [2026-09-23] — THE WORKER TOPOLOGY: FROM WAVES TO WORKERS

**ACCOMPLISHED**

- read `worker-planning` and `worker-spec` (the two new skills) and the `hydra-workers` skill
- converted `PBK_V3_HYDRA/` into its own git repo (baseline `88e4f3b`) and created TWO worker
  worktrees: `wt-engine` (`worker/engine`) and `wt-surfaces` (`worker/surfaces`), each seeing
  the frozen seam at sha `66b66a7f10c7c6e7`
- authored `.trident/worker-plan.md` (264 L): `WORKERS: 2`, 15 oracle rows, 32 T-refs, the
  backward map, the pre-written audit §A, the coverage map, the bridge diagram
- authored `wt-engine/WORKER_SPEC.md` (333 L, §W0-§W10) and `wt-surfaces/WORKER_SPEC.md`
  (343 L, §W0-§W11) — each with §W3 testing (tool-result-bound pass/fail tokens), §W4 mechanical
  criteria, §W5 anti-patterns WITH detections, §W6 the gate, §W7 the todo anchor, §W9 the audit
- authored both goal pins (57 L / 60 L, the 7 slots + ONE `/goal` line) and both todo anchors
  (12 / 13 rows, every row naming its gate, 2 IMMUTABLE rows each)
- wired Anchor 1: `gates/merge-gate.sh` (6 predicates) + `.git/hooks/pre-push` (the direct-push
  deny to master)
- committed all three anchor sets: master `26fa25a`, `worker/engine` `9049e83`,
  `worker/surfaces` `df915cd`

**EVIDENCE**

```
bash worker-planning/scripts/check.sh .trident/worker-plan.md
  -> PASS: worker-plan dispatchable (WORKERS=2, oracle rows=15, T-refs=32)     exit 0
bash worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md    -> PASS: armable  exit 0
bash worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md  -> PASS: armable  exit 0
bash hydra-workers/scripts/check.sh                            -> PASS: verified  exit 0
bash gates/merge-gate.sh worker/engine wt-engine  -> GATE: FAIL — DO NOT MERGE (the control)
sha256sum SEAM/seam.ts -> 66b66a7f10c7c6e7...
```

**DECISIONS (verbatim, full text in DECISION_CHAIN.md)**

- D-101 the unit is the worktree, not the file set
- D-102 the seam is frozen and is the only shared surface
- D-103 the weights are the seam's, not invented (a self-correction)
- D-104 the band function is abide's `bandFor`; the extension's `bandOf` is an outlier
- D-105 Anchor 1 is local until a remote is explicitly authorised

**FAILURES + ROOT CAUSE**

- W1's spec's first draft carried INVENTED weights (`descriptive +2, suggestive +3, substitute
  +3, use -3`) contradicting the frozen seam. ROOT CAUSE: the draft was written from memory of
  the earlier package rather than read from the seam. FIX: corrected to the seam's verbatim
  values with its line numbers. LESSON: a spec that contradicts its contract surfaces only at
  the merge — read the contract, never the memory.

**HONEST DISCLOSURES**

- the engine and the surfaces are UNBUILT (both `src/` trees are empty). This session built the
  TOPOLOGY and the CANON, not the product.
- the create-pin overhaul is INCOMPLETE: both CREATE_PROMPTs still describe 4 sequential waves.
- 0 git remotes; Anchor 1's GitHub half is OPEN.
- the 14 c=0.000 ledger rows (the correction re-score) are a CONFIRMED defect with a designed
  fix, NOT applied — a live enforcement change requires its own test round.
- the corpus sweep that would prove F1=1.000 has not run; the number is unproven.
- no worker has been dispatched; no subagent has run in this topology.

## [2026-09-23] — THE META-OBSERVATION + THE CANON + THE HOT-SEAT ROUND

**ACCOMPLISHED**

- the META-OBSERVATION: the lexicon-gate extension was observed firing on the builder's OWN
  session — 14 FIRE events across 3 pids, 56 ledger rows (42 own_utterance, 14 quotation),
  the first at 04:53:42 (`instruction-not-predicate`, c=0.667)
- the exact HOT-RELOAD METHOD measured and documented: rules reload in-process at session_start
  (proven by pid 2458725's five load lines); code reloads only with a new process (proven by
  the 03:35-03:36 edits appearing only at pid 191645's 04:50:39 start)
- the GATE'S REAL COST measured: 0.024 ms/call (prose), 0.015 (tool-input), 0.179 (tool-result),
  0.013 (the correction) — 200 iterations × 9 rules per shape
- the CANON set written: 11 docs in `context_management/`, the 2 logs first per the
  fresh-capture rule
- TWO DEFECTS found and named: (D-1) 14 ledger rows at c=0.000 where the gate re-scores its own
  injected correction as `own_utterance`; (D-2) both CREATE_PROMPTs still describe 4 waves
- ONE HYPOTHESIS DISPROVEN: `ui.loop-blocked` is not the gate (8 pids block with ZERO fires)

**EVIDENCE**

```
wc -l ~/.omp/run/lexicon-ledger.jsonl                       -> 56
grep -c 'FIRE' ~/.omp/logs/omp.2026-09-23.191645.log        -> 14 fires, pid 191645
bun run ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts
  -> prose 0.024 ms/call · tool-input 0.015 · tool-result 0.179 · correction 0.013
the load-line census -> pid 2458725: 5 loads (02:22:33, 04:13:04 ×3, 04:28:06)
the A/B census -> 8 pids with loop-blocks and ZERO fires (the control)
```

**DECISIONS** D-115 (the three mandatory deliverables) · D-116 (the hot-reload distinction) ·
D-117 (no live-enforcement claim without the attributed ledger row) · D-118 (the logs first) ·
D-119 (three verdict classes)

**FAILURES + ROOT CAUSE**

- the agent's own reasoning produced `be careful` / `let me` frames repeatedly, each firing
  `instruction-not-predicate` (23 rows). ROOT CAUSE: the agent narrated posture instead of
  naming predicates. FIX: name the predicate (`grep -c`, `sha256sum`, an exit code) instead of
  the intention. LESSON: a rule firing on the builder's own prose is the enforcement WORKING;
  the correct response is to change the prose, never to argue with the gate.
- a causal claim (`ui.loop-blocked` = the gate) was about to be asserted on a 3-second window.
  ROOT CAUSE: correlation observed inside one window reads as mechanism. FIX: the A/B census.
  LESSON: the plausible story and the true story BOTH quiet the symptom.

**HONEST DISCLOSURES**

- the engine and the surfaces remain UNBUILT. This session produced the topology, the canon,
  the meta-observation, and the hot-seat measurement — not the product.
- the 14 c=0.000 rows are a CONFIRMED defect with a DESIGNED fix, deliberately NOT applied:
  changing live enforcement requires its own test round (D-111).
- the corpus sweep proving F1=1.000 has NOT run.
- no GitHub remote; Anchor 1's remote half is OPEN.
- the create-pin overhaul remains INCOMPLETE.

## [2026-09-23] — THE CANON SET (11 docs) — the cross-consistency record

**ACCOMPLISHED** the full canon set written to `context_management/`, the 2 logs first per the
fresh-capture rule, each doc carrying its anchors/commands rather than restated prose.

**EVIDENCE** the U-gate run (lines, refs, the 2 logs' entry counts) is recorded below in
COMPACTION_SURVIVAL.md's gate section.

**THE HONEST NOTE** the docs describe a build whose CODE does not exist yet. They are accurate
about the TOPOLOGY, the CANON, and the LIVE ENFORCEMENT; they are explicit that the engine and
the surfaces are UNBUILT. A reader must not mistake a dense canon for a built system.

## [2026-09-23] — THE CAMPAIGN ARTIFACT INDEX (where everything lives)

```
| the artifact | the path | the size |
| the meta-observation | ~/.omp/agent/managed-skills/runtime-testing/references/meta-observations.md | 204 L |
| the guardrail spec | .../references/guardrail-spec.md | 85 L |
| the improvements | .../references/suggested-improvements.md | 67 L |
| the deep-host results | PBK_V3_HYDRA/.trident/host-suite-results.json | 112 L |
| the worker plan | PBK_V3_HYDRA/.trident/worker-plan.md | 264 L |
| W1's contract | PBK_V3_HYDRA/wt-engine/WORKER_SPEC.md | 333 L |
| W2's contract | PBK_V3_HYDRA/wt-surfaces/WORKER_SPEC.md | 343 L |
| the canon set | PBK_V3_HYDRA/context_management/ | 11 docs |
| the merge gate | PBK_V3_HYDRA/gates/merge-gate.sh | 20 L |
| the latency probe | ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts | 26 L |
```

**THE SESSION IN ONE PARAGRAPH:** the operator ordered a hydra-workers overhaul of the PBK v3
build packages (the first live run of the architecture), then three follow-ups: meta-observe the
live firing, document the exact hot-reload method, and deep-host-test in the hot seat with
real-time latency. The overhaul produced a 2-worker topology (2 worktrees, 2 specs, 2 pins, 2
todo anchors, 1 merge gate, 4 predicates green). The meta-observation captured 14 fires on the
builder's own prose with the exemptor suppressing 25% and the Jev wire failing loudly. The
hot-reload method was measured to be TWO channels (rules in-process, code per-process). The
hot-seat round measured the gate at 0.024 ms/call, found 2 defects, and disproved 1 hypothesis.
The code remains UNBUILT — this session built the topology, the canon, and the evidence, not the
product.

## [2026-09-23] — THE RULINGS (D-101..D-119, one line each)

```
D-101  the unit is the worktree, not the file set
D-102  the seam is frozen and is the only shared surface
D-103  the weights are the seam's, not invented (a self-correction)
D-104  the band function is abide's bandFor; the extension's bandOf is an outlier
D-105  Anchor 1 is local until a remote is explicitly authorised
D-106  the oracles stay in the plan, never in the dispatch prompts
D-107  the canon's two logs update at the moment, not at the milestone
D-108  the A/B is mandatory before any causal claim
D-109  the pin is not emitted until the package exists
D-110  the doc-density floors apply, and the measure is lines + refs
D-111  the gate's own correction must not be scored (designed, not applied)
D-112  a disproven hypothesis is recorded as evidence
D-113  the worker's last act is the PR, never the merge
D-114  the canon docs are written before the workers are dispatched
D-115  the meta-observation is the operator's order, not an optional extra
D-116  the hot-reload distinction: rules in-process, code with a new process
D-117  no claim of live enforcement without the ledger row and its attribution
D-118  the two logs precede the milestone docs (the fresh-capture rule)
D-119  the verdict classes for a host test are three, not two
```

## [2026-09-23] — THE COMMANDS THAT REPRODUCE THIS SESSION

```bash
# THE TOPOLOGY
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
git worktree list
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md
bash gates/merge-gate.sh worker/engine wt-engine        # the negative control

# THE LIVE ENFORCEMENT
wc -l ~/.omp/run/lexicon-ledger.jsonl
grep -c FIRE ~/.omp/logs/omp.2026-09-23.191645.log
grep 'jev skip' ~/.omp/logs/omp.2026-09-23.191645.log | tail -2

# THE COST
cd ~/.omp/agent/extensions/lexicon-gate && bun run latency-probe.ts

# THE CANON
wc -l /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/context_management/*.md
```
