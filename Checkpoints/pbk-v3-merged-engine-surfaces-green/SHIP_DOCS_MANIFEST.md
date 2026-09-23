# SHIP DOCS MANIFEST
Project root: /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
Dist artifact: /home/leviathan/.omp/agent/extensions/lexicon-gate/index.ts  (the file the runtime loads)
Dist SHA: 1122308d41ba11a8... (sha256sum, first 16)
Supporting module: lib.ts 307 L · sha 4530b5f1ca9e046a...
Baseline SHA: 6d2b7b2  (the hydra repo HEAD at this update)
Last updated: 2026-09-23T06:30:00+04:00
Docs: BUILD_REPORT, DEBUG_LOG, FAILURE_LOG, SPEC_VIOLATION_LOG, TESTING_LOG, THEATRICALITY_LOG
Entry counters: EN-{max: 12}, F-{max: 9}, V-{max: 6}, P-{max: 4}, TH-{max: 8}

## THE TWO ARTIFACT SETS (this project has two, both recorded)

```
SET 1 · THE HYDRA BUILD (the project's own tree)
  root          /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
  the seam      SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e7
  the branches  master 6d2b7b2 · worker/engine 9049e83 · worker/surfaces df915cd
  the state     the TOPOLOGY is armed; wt-engine/src and wt-surfaces/src are BOTH EMPTY

SET 2 · THE LIVE ENFORCEMENT (the extension under test — NOT in this repo)
  path          ~/.omp/agent/extensions/lexicon-gate/
  index.ts      221 L · sha 1122308d41ba11a8 · mtime 2026-09-23 06:08:08
  lib.ts        307 L · sha 4530b5f1ca9e046a
  lib.test.ts   179 L
  the rules     9 in ~/.omp/agent/rules/
  the ledger    ~/.omp/run/lexicon-ledger.jsonl · 102 rows
```

## THE AUDIT GATE INPUT (STEP 4B)
Audit artifact: NONE at this update — see the FAILURE_LOG F-9 (BLOCKED, named retry condition).
The `AUDIT GATE:` line in TESTING_LOG.md records the actual state.
