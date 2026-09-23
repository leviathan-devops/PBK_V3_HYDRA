/create

# PACKAGE A — THE ENGINE (Desk A of 2) · THE HYDRA BUILD

## THE MISSION

Build THE ENGINE of the PBK v3 enforcement pipeline: ONE entry point,
`check(req: CheckRequest) -> Promise<CheckResult>`, that satisfies the FROZEN SEAM at
`../SEAM/seam.ts` (v1.0.0). The engine is abide's vendored core + a NEW `lexicon` check
type (the deterministic pre-gate) + abide's never-executed lint runner, made to run.

**You are Desk A. Desk B builds the surfaces in parallel. YOU NEVER TOUCH A HOST.**

## THE BUILD PACKAGE (on disk — read ALL before writing code)

```
../SEAM/SEAM_CONTRACT.md              THE BOUNDARY — read first, always
PACKAGE_A_DPL1_SPEC.md                the contract (251 L) — F-1..F-8, the 4 waves, the 8 criteria
PACKAGE_A_WAVE_PLAN.md                WAVES: 4 — each wave's file set + command gate
PACKAGE_A_MASTER_BLUEPRINT.md         the design authority (the cost law, the weights)
context_management/                   11 canon docs
```

## THE WAVES (each gate green before the next)

```
A-1  THE VENDOR      vendor/abide/{schema,band,jev,reason} verbatim + VENDOR.md (a sha per file)
                     GATE: bunx tsc --noEmit vendor/abide/index.ts  ->  exit 0
A-2  THE LEXICON     check.type "lexicon" + scoreSignals + confidence + the runner order
                     GATE: bun test -t lexicon_sweep -> F1=1.000 · the zero-hit test clean
A-3  THE LINT+LEDGER abide's `pattern` EXECUTED + the LedgerRow writer
                     GATE: the known-bad fixture REFUSED · the known-good accepted
A-4  THE SURFACE     check() exported + the engine suite
                     GATE: bun test -> 0 fail · grep -c "ctx\|pi\." src/ -> 0
```

## THE THREE INVARIANTS (violating any = the build is void)

```
I1  YOU COMPUTE THE BAND. Desk B never does. The band is yours.
I2  YOU TOUCH NO HOST.  No ctx, no pi, no extension API. check() is a pure function.
    THE PROOF: grep -c "ctx\|pi\." src/  ->  0
I3  THE PHASE DETERMINES THE ACTION, and Desk B owns that mapping. You return the
    verdict; Desk B decides the wire. Do not import an action dispatcher.
```

## THE ANTI-PATTERNS (each one has a measured cost — do not repeat it)

```
✗ A SECOND BAND          kernel-judge.ts (929 L) re-implemented abide's engine with the
                         SAME constants and an INVENTED question type (`noul`), and its
                         live call NEVER RAN. Import abide's bandFor.
✗ A SECOND JEV WIRE      abide's checkWithModel is the proven one. Import it.
✗ A HAND-ROLLED REASON   abide's repairReason. Import it.
✗ A HOST IMPORT          untestable, and it breaks the seam. The grep enforces it.
✗ A SILENT SKIP          every skip is a NAMED error. loadRules THROWS.
✗ AN INHERITED BAND      DERIVED per rule from its own sweep, or loadRules THROWS.
✗ AN EDITED VENDOR FILE  a patch file beside it, with the reason.
```

## THE PROOF CONTRACT (the 8 criteria, each a command)

```
1  bunx tsc --noEmit                          -> exit 0
2  bun test                                   -> 0 fail
3  bun test -t lexicon_sweep                  -> F1=1.000 at the DERIVED band
4  bun test -t lexicon_zero_hit               -> every body scores 0 against itself
5  bun test -t lint_runner                    -> the known-bad REFUSED
6  grep -c "ctx\|pi\." src/                   -> 0            (invariant I2)
7  grep -c "bandFor" src/lexicon/             -> >= 1         (abide's, imported)
8  vendor/VENDOR.md                           -> a sha per vendored file
```

## THE RUNTIME SEAT

```
the INSTANCE     this host · the successor session (name its JSONL path)
the ENFORCEMENT  the engine bundle at ~/.omp/agent/extensions/lexicon-gate/engine/
the STORE        the ledger at .abide/events.jsonl
the PUSH SET     Desk B (the surfaces) imports check(); the integrator wires the merge
the OBSERVATION  the merge's index.ts calls check() and nothing else crosses the seam
```

## THE HARD STOPS

```
- NO SECRETS in the repo, the chat, or the ledger rows. Reference the key PATH only.
- THE RIG IS NOT THE SHIP. A test verdict is evidence, not a ship.
- A DEAD CARRIER IS NAMED (RIPWIRE_MISSING · OPENGROK_DOWN · GI_NO_STORE) — never fall back.
- NO UNLISTED MODEL.
- THE SEAM IS FROZEN. A change to ../SEAM/seam.ts invalidates BOTH packages — report, never edit.
- DESK B'S FILES ARE OFF LIMITS. `src/surfaces/**` is not yours. Report a needed change.
```

## THE STOP

```
ALL of: the 8 criteria green with their command output quoted · every wave's gate met
in order · the invariant grep reads 0 · the seam unchanged · the ledger rows present
at .abide/events.jsonl · the canon + ship docs updated.
Anything less is OPEN. A green suite without the seam satisfied is not done.
```

## THE DOC CONTRACT

```
canon (11)   context_management/: CURRENT_STATE · BUILD_STATE · CHANGELOG · EVIDENCE_STATE
             · DECISION_CHAIN · NEXT_STEPS · TASK_QUEUE · POST-COMPACTION_PROMPT ·
             COMPACTION_SURVIVAL · RUNNING_BUILD_LOG + RUNNING_DEBUG_LOG
ship (6)     BUILD_REPORT · DEBUG_LOG · FAILURE_LOG · SPEC_VIOLATION_LOG · TESTING_LOG ·
             THEATRICALITY_LOG
```
