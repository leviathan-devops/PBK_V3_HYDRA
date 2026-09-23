# WORKER GOAL — W1 THE ENGINE

/goal Build the PBK v3 ENGINE in wt-engine (branch worker/engine) against the FROZEN SEAM:
vendor abide's engine, add the lexicon check type, wire abide's bandFor, run abide's lint
pattern, and export check(req) — pure, with NO host reference. Done when the gate passes.

## GOAL
Build D1-D7 (the vendored abide · the lexicon check type · the scorer · the runner order ·
the lint runner · the ledger writer · the public surface) so that `check(req: CheckRequest)`
returns a `Decision` satisfying the frozen seam, and abide's dead lint pattern EXECUTES.

## BASELINE
- the seam EXISTS, frozen: SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e7 · tsc exit 0
- abide EXISTS at /tmp/abide-repo: schema 8 .ts/530 L · cli 54 .ts/5,581 L
  band.ts:48 `bandFor(p, thresholds) -> "act"|"flag"|"clear"` · verdict.ts:4 the same enum
  rubric.ts:204 L carries the ONE "Never executed" hit · **0 lexicon hits** · **0 delta hits**
- the engine is ABSENT: wt-engine/src/ -> 0 entries
- the LIVE extension EXISTS: 689 L · 5/5 green (the MIGRATION baseline, NOT W1's to touch)

## WORKERS
W1 of 2. W2 (wt-surfaces) builds the OMP surfaces against the SAME seam, in parallel, with
NO file overlap. The merge is the orchestrator's job (W3).

## LAWS
L1  THE SEAM IS FROZEN — implement its 12 exports; never edit SEAM/seam.ts
L2  LOUD FAIL OR CLEAR PASS — a missing `use:` THROWS; never a silent default or a fallback
L3  THE ARTIFACT IS THE EVIDENCE — every claim carries sha256sum + the symbol grep
L4  NO HOST REFERENCE — `grep -rc "ctx\|pi\." src/` MUST be EMPTY (T-5)
L5  VENDOR VERBATIM — abide's code is COPIED, never reimplemented; VENDOR.md records the shas
L6  THE WEIGHTS ARE THE SEAM'S — descriptive neg+=1 · suggestive pos+=2 (or +1 w/o \b) ·
    substitute pos+=2 · use neg+=3; confidence = pos/(pos+neg+1)
L7  THE BAND IS abide's bandFor (band.ts:48) — DERIVED from the corpus, never inherited

## HARD STOPS
STOP and report if:
- SEAM/seam.ts's sha is NOT 66b66a7f10c7c6e7 (the contract changed under you)
- a deliverable would require editing SEAM/ or wt-surfaces/ (a scope breach)
- abide's bandFor cannot be vendored standalone (its import graph pulls the CLI package)
- the corpus sweep cannot produce a labeled set (name the blocker; do NOT invent a band)

## PROOF CONTRACT
The gate, all mechanically:
  bunx tsc --noEmit                                 -> exit 0
  bun test                                          -> 0 fail
  bun test -t lexicon_sweep                         -> F1=1.000
  bun test -t lint_runner                           -> the known-bad REFUSED
  bun test -t lexicon_load_throws                   -> the throw observed
  grep -rc "ctx\|pi\." src/ | grep -v ':0'          -> EMPTY
  grep -c '"decidedBy"' .abide/events.jsonl         -> >= 1
  grep -c 'z.literal("lexicon")' vendor/abide/*.ts  -> >= 1
MUTATION: S6 (the ledger append dropped) and S7 (the weights zeroed) MUST go RED.
THE PR: open it, arm the checks, and STOP — the orchestrator merges. NEVER merge your own PR.

## STOP
Done when the gate passes AND the §A audit table carries a verdict per hunk AND the PR is
open. Report: the gate's real output, the sha of every vendored file, the F1 number, the
mutation red runs, and the honest remainder (what is unproven).
