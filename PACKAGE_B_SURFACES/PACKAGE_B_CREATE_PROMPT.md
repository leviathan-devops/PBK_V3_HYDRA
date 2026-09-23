# /goal — W2 THE SURFACES (the worker pin)

## GOAL
Build the PBK v3 SURFACES in the git worktree `wt-surfaces` (branch `worker/surfaces`): the
source-kind gate, the quote-state machine, the 4 host hooks, the delta accumulator, the abort
dedupe, and the action dispatch — computing NO band. DONE when `wt-surfaces/WORKER_SPEC.md`
§W6's gate passes.

## BASELINE (re-measure THIS turn)
```
the seam      SEAM/seam.ts · 192 L · sha256 66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d
the worktree  wt-surfaces · branch worker/surfaces
the spec      wt-surfaces/WORKER_SPEC.md (343 L) · wt-surfaces/WORKER_GOAL.md · wt-surfaces/TODOS.md
the migration ~/.omp/agent/extensions/lexicon-gate/ (a WORKING 689-L system):
                lib.ts:81 classifySource · lib.ts:71 SCORABLE · lib.ts:288 isQuotedMatch ·
                lib.ts:59 stripInlineFlags · index.ts:83-199 the 6 pi.on registrations
```

## THE WORKER (one worktree, the whole lifecycle)
```
WORKTREE   wt-surfaces          BRANCH   worker/surfaces
SME DOMAIN the OMP host surfaces + the streaming interrupt (abide has NO equivalent — 0 delta hits)
D1 the source-kind gate · D2 the quote-state machine · D3 the four hooks · D4 the delta
accumulator · D5 the abort dedupe · D6 the action dispatch · D7 the entry
GATE  bunx tsc --noEmit -> exit 0 · bun test -> 0 fail · bun test -t source_kind_gate -> 0 FP +
      5/5 controls · bun test -t abort_dedupe -> abort=1 · grep -rc "bandOf\|confidence" src/ EMPTY
```

## THE LAWS
- THE SEAM IS FROZEN — call `check()`; never edit it.
- NO BAND IN THE SURFACES (T-6) — the engine returns the band; the surfaces act on it.
- ★ THE PEDIGREE: `pi.sendMessage({customType: "ttsr-injection", display: true}, {deliverAs:
  "steer"})` — NEVER `pi.sendUserMessage` (documented as "appears as if typed by the user"; a
  gate must never impersonate the operator).
- RIPWIRE FIRST-CLASS — map structure before every coding edit.
- THE MIGRATION VOCABULARY (§W11): the seam + abide say `act|flag|clear`; the live extension says
  `silent|gray|fire`. Translate: fire->act · gray->flag · silent->clear.
- THE WORKER CANNOT MERGE ITS OWN PR — the orchestrator merges.

## THE STOP
All of: §W6's gate green with the command output quoted · every §A hunk verdict-bearing · the PR
open. The orchestrator merges. ANYTHING LESS IS OPEN.

## RESUME POINTERS
`wt-surfaces/WORKER_SPEC.md` · `wt-surfaces/WORKER_GOAL.md` · `wt-surfaces/TODOS.md` ·
`.trident/worker-plan.md` · `PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md` · `SEAM/seam.ts`
