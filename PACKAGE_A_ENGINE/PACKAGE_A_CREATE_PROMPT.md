# /goal — W1 THE ENGINE (the worker pin)

## GOAL
Build the PBK v3 ENGINE in the git worktree `wt-engine` (branch `worker/engine`): vendor abide's
engine in-tree, add the `lexicon` check type, wire abide's `bandFor`, run abide's dead lint
pattern, and export `check(req)`. DONE when `wt-engine/WORKER_SPEC.md` §W6's gate passes.

## BASELINE (re-measure THIS turn)
```
the seam      SEAM/seam.ts · 192 L · sha256 66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d
the worktree  wt-engine · branch worker/engine
the spec      wt-engine/WORKER_SPEC.md (333 L) · wt-engine/WORKER_GOAL.md · wt-engine/TODOS.md
the source    the vendored abide: /tmp/abide-repo/packages/{schema,cli}/src
```

## THE WORKER (one worktree, the whole lifecycle)
```
WORKTREE   wt-engine            BRANCH   worker/engine
SME DOMAIN the abide-vendored decision engine + the lexicon pre-gate
D1 the vendored abide · D2 the lexicon check type · D3 the scorer · D4 the runner order ·
D5 the lint runner · D6 the ledger writer · D7 the public surface
GATE  bunx tsc --noEmit -> exit 0 · bun test -> 0 fail · bun test -t lexicon_sweep -> F1=1.000
      bun test -t lint_runner -> the known-bad REFUSED · grep -rc "ctx\|pi\." src/ -> EMPTY
```

## THE LAWS
- THE SEAM IS FROZEN — implement its 12 exports; never edit it.
- RIPWIRE FIRST-CLASS — map structure before every coding edit.
- LOUD FAIL OR CLEAR PASS — a missing `use:` THROWS; never a silent default.
- THE WEIGHTS ARE THE SEAM'S (seam.ts:71-77): descriptive neg+=1 · suggestive pos+=2 (or +1
  without \b) · substitute pos+=2 · use neg+=3 · confidence = pos/(pos+neg+1).
- VENDOR VERBATIM — abide's code is COPIED, never reimplemented; VENDOR.md records the shas.
- THE WORKER CANNOT MERGE ITS OWN PR — the orchestrator merges.

## THE STOP
All of: §W6's gate green with the command output quoted · every §A hunk verdict-bearing · the PR
open. The orchestrator merges. ANYTHING LESS IS OPEN.

## RESUME POINTERS
`wt-engine/WORKER_SPEC.md` · `wt-engine/WORKER_GOAL.md` · `wt-engine/TODOS.md` ·
`.trident/worker-plan.md` · `PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md` · `SEAM/seam.ts`
