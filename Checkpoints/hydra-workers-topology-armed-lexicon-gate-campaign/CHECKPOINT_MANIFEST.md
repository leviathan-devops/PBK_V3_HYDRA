# CHECKPOINT MANIFEST — hydra-workers-topology-armed-lexicon-gate-campaign

**The unique token:** `hydra-workers-topology-armed-lexicon-gate-campaign` (hyphens only, no spaces)
**The date:** 2026-09-23
**The state:** THE TOPOLOGY IS ARMED (the engine + the surfaces are UNBUILT)
**The seal:** MODE B — NO LOCK (a mutable working snapshot; the operator's default for a
checkpoint that will receive follow-up fixes). NOT Mode A. See the SEAL section.

---

## THE DIST + ITS SHA (STEP 4)

```
the live artifact under test:
  src/lexicon-gate/index.ts   221 L   sha256 1122308d41ba11a8...
  src/lexicon-gate/lib.ts     307 L   sha256 4530b5f1ca9e046a...
  src/lexicon-gate/lib.test.ts 179 L
the checkpoint's copy:
  dist/index.ts               sha256 1122308d41ba11a8...
★ THE SHA MATCHES: 1122308d41ba11a8 == 1122308d41ba11a8  ->  ZERO DRIFT
★ mtime of the source: 2026-09-23 06:08:08 (the pedigree fix)
★ THE RUNNING PROCESS STARTED 04:50:25 — THE FIX IS NOT LIVE (ESM-cached).
```

## THE BATTERY + THE TSC (the verification, WITH ITS SCOPE)

```
cd ~/.omp/agent/extensions/lexicon-gate && bun test .
  -> 5 pass 0 fail
  ★ SCOPE: this suite imports lib.ts (the SOURCE module). It does NOT import a deployed
    bundle (omp loads the .ts directly; there is no compiled artifact). It proves the PURE
    FUNCTIONS behave. It proves NOTHING about the hooks' runtime behaviour or the rendering.

the predicates (the topology):
  worker-planning/scripts/check.sh .trident/worker-plan.md   -> PASS (WORKERS=2, oracles=15, T-refs=32)
  worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md      -> PASS: worker-spec armable
  worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md    -> PASS: worker-spec armable
  hydra-workers/scripts/check.sh                             -> PASS: worker topology verified

the merge gate (the NEGATIVE CONTROL):
  bash gates/merge-gate.sh worker/engine wt-engine           -> GATE: FAIL (bun test on the empty tree)
  ★ THE GATE BIT. A gate never observed failing is untested.
```

## THE STATE (what is validated vs what is pending)

```
VALIDATED (mechanically, this session)
  the seam                  192 L · sha 66b66a7f10c7c6e7... · `bunx tsc --noEmit` exit 0 · FROZEN
  the topology              3 worktrees · 4 commits · 4 predicates exit 0
  the hot-reload ROUND TRIP 9 -> 10 -> 9 in ONE pid (pid 191645), no restart
  the firing census         24 MECHANICAL firings · line-numbered · 126:1 prose ratio
  the latency               prose 0.024 ms/call · tool-input 0.015 · tool-result 0.179
  the extension's suite     5 pass / 0 fail / 12 expect() (SOURCE scope)
  the pedigree fix          the unit proof passed (sendMessage + customType, no sendUserMessage)

PENDING / UNBUILT
  wt-engine/src/**          0 entries — D1-D7 unbuilt
  wt-surfaces/src/**        0 entries — D1-D7 unbuilt
  the merge                 never attempted
  the oracles               5 of 15 have values; 10 read PENDING
  the create-pin overhaul   both CREATE_PROMPTs still describe 4 WAVES each (N-1)
```

## THE COMPLETE CONTENTS (the file counts)

```
src/                         4 .ts files (SEAM/seam.ts + the lexicon-gate 3)
  src/lexicon-gate/          3 (index.ts · lib.ts · lib.test.ts)  — the LIVE enforcement
  src/hydra/                 5 dirs (SEAM · PACKAGE_A_ENGINE · PACKAGE_B_SURFACES · MERGE · gates)
dist/                        2 (index.ts · lib.ts) — the SHA-verified artifact copy
context_management/          11 docs · 2556 L (the full canon)
the ship docs                7 (BUILD_REPORT · DEBUG_LOG · FAILURE_LOG · SPEC_VIOLATION_LOG ·
                                TESTING_LOG · THEATRICALITY_LOG · SHIP_DOCS_MANIFEST)
the corpus                   2 (derailment-data-log.md · host-test-failure-log.md)
the meta artifacts           3 (META_OBSERVATIONS · SUGGESTED_IMPROVEMENTS · GUARDRAIL_SPEC)
the runtime-testing refs     4 (meta-observations · guardrail-spec · suggested-improvements ·
                                lexicon-gate_live_forensic)
rules/                       9 (the live lexicon rules)
.trident/                    the worker-plan + the host-suite results
gates/                       the merge gate + the pre-push deny
SEAM/ · PACKAGE_A_ENGINE/ · PACKAGE_B_SURFACES/ · MERGE/    the frozen contract + both packages
```

## THE HONEST GAPS (what is NOT verified)

```
H-1  THE PEDIGREE FIX IS NOT LIVE. The running process predates the edit; the RENDERED
     behaviour is UNOBSERVED. A new process is required.
H-2  THE GRAY ZONE HAS NEVER BEEN JUDGED. All 102 ledger rows carry jev:null (402 — the
     TypeSafe account has no credits). The three-tier design runs as two tiers.
H-3  THE ENGINE AND THE SURFACES DO NOT EXIST. Both src trees are empty. 10 of 15 oracles
     read PENDING. No test of the product exists because the product does not exist.
H-4  THE CREATE-PIN OVERHAUL IS INCOMPLETE. Both pins still describe 4 sequential waves.
H-5  0 GIT REMOTES. Anchor 1's GitHub half is OPEN (operator-gated).
H-6  THE ABORT'S BEHAVIOURAL EFFECT WAS NOT ISOLATED.
H-7  THE CODE AUDIT GATE — see TESTING_LOG.md's AUDIT GATE line for its actual state.
H-8  THE MERGE HAS NEVER BEEN ATTEMPTED. The two halves have never been type-checked together.
H-9  THE WORKER SUITE — the extension's 5-test suite is SOURCE-scope only.
```

## THE NEXT WORK (the ordered queue)

```
N-1  the create-pin overhaul (re-mint both pins against the worker topology)
N-2  dispatch W1 + W2 (one per worktree, in ONE batch)
N-3  the orchestrator's audit loop (per-hunk verdicts against §A)
N-4  the merge (W3) — the combined tsc + both suites
N-5  the migration (A108/B108)
N-6  the live container/host round (the runtime proof)
```

## THE SEAL (STEP 10 — Mode B, and why)

```
MODE B — NO LOCK. This checkpoint is a MUTABLE WORKING SNAPSHOT.
WHY NOT MODE A: the fix (HT-BUG-1/2) is IN SOURCE and NOT LIVE; the next session must be able
  to re-run the round trip and re-verify the rendering. A full chattr +i lock would block that.
WHY NOT MANIFEST-ONLY: a manifest-only lock is the partial-lock LIE — the manifest protected
  while the src/dist drift underneath it. It is never used.
★ the operator owns the guardian layer; if Mode A is wanted later, the operator applies it.
```

## THE PROOF-OF-STATE (reproduce this checkpoint)

```bash
CP=/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/Checkpoints/hydra-workers-topology-armed-lexicon-gate-campaign
sha256sum "$CP/dist/index.ts"        # 1122308d41ba11a8... — must equal the live artifact
sha256sum /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/SEAM/seam.ts          # 66b66a7f10c7c6e7...
find "$CP/src" -name '*.ts' | wc -l  # 10
ls "$CP/context_management" | wc -l  # 11
ls "$CP"/*.md | wc -l                # 13
cd /home/leviathan/.omp/agent/extensions/lexicon-gate && bun test .   # 5 pass / 0 fail
```
