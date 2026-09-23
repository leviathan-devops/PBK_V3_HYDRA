# WORKER GOAL — W2 THE SURFACES

/goal Build the PBK v3 SURFACES in wt-surfaces (branch worker/surfaces) against the FROZEN
SEAM: the source-kind gate, the quote-state machine, the 4 host hooks, the delta accumulator,
the abort dedupe, and the action dispatch — computing NO band. Done when the gate passes.

## GOAL
Build D1-D7 (the source-kind gate · the quote-state machine · the four hooks · the delta
accumulator · the abort dedupe · the action dispatch · the entry) so that the engine's
`check()` becomes REACHABLE on the OMP host — the streaming interrupt fires with ctx.abort()
plus the injected correction, and the 4 surfaces map to the right actions.

## BASELINE
- the seam EXISTS, frozen: SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e7 · tsc exit 0
  Surface = "prose"|"tool-call"|"tool-result"|"post-tool-use" (seam.ts:64)
  Decision = {ruleId, band, probability, decidedBy, sourceKind, span, correction, capped}
- abide has **0 streaming hits** — the accumulator + the hooks are NET-NEW, not ported
- the LIVE extension EXISTS: index.ts 203 L (6 pi.on) · lib.ts 307 L · lib.test.ts 179 L · 5/5
  THE MIGRATION SOURCE: lib.ts:81 classifySource · lib.ts:288 isQuotedMatch · lib.ts:71 SCORABLE
  index.ts:83-199 the 6 registrations · index.ts:129 pi.sendUserMessage
- the surfaces are ABSENT: wt-surfaces/src/ -> 0 entries

## WORKERS
W2 of 2. W1 (wt-engine) builds the engine against the SAME seam, in parallel, with NO file
overlap. The merge is the orchestrator's job (W3).

## LAWS
L1  THE SEAM IS FROZEN — call check(); never edit SEAM/seam.ts
L2  LOUD FAIL OR CLEAR PASS — an abort with no correction THROWS; never a silent abort
L3  THE ARTIFACT IS THE EVIDENCE — every claim carries sha256sum + the symbol grep
L4  NO BAND IN THE SURFACES — `grep -rc "bandOf\|confidence" src/` MUST be EMPTY (T-6)
L5  THE HOST IS YOURS — ctx.abort() + pi.sendUserMessage are W2's alone; the engine never sees them
L6  THE MIGRATION VOCABULARY — the LIVE extension's silent|gray|fire maps to the seam's
    clear|flag|act; the extension's bandOf is NOT abide's bandFor (see the spec §W11)
L7  THE ACTION COMES FROM THE SURFACE — never guessed; a wrong row is the wrong instrument

## HARD STOPS
STOP and report if:
- SEAM/seam.ts's sha is NOT 66b66a7f10c7c6e7 (the contract changed under you)
- a deliverable would require editing SEAM/ or wt-engine/ (a scope breach)
- the engine's check() signature diverges from the seam's CheckRequest (name the divergence)
- ctx.abort() is not present on the host's handler ctx (name the host version; do NOT stub it)

## PROOF CONTRACT
The gate, all mechanically:
  bunx tsc --noEmit                                    -> exit 0
  bun test                                             -> 0 fail
  bun test -t source_kind_gate                         -> 0 FP + 5/5 controls
  bun test -t quote_state                              -> the 5 cases correct
  bun test -t abort_dispatch                           -> 2 abort, 3 silent
  bun test -t abort_dedupe                             -> abort=1 across 10 deltas
  grep -c 'pi.on(' src/index.ts                        -> >= 4
  grep -rc "bandOf\|confidence" src/ | grep -v ':0'    -> EMPTY
MUTATION: S7 (the dedupe removed) and S8 (the gate bypassed) MUST go RED.
THE PR: open it, arm the checks, and STOP — the orchestrator merges. NEVER merge your own PR.

## STOP
Done when the gate passes AND the §A audit table carries a verdict per hunk AND the PR is
open. Report: the gate's real output, the 5 control cases, the abort counts, the mutation red
runs, and the honest remainder (what is unproven).
