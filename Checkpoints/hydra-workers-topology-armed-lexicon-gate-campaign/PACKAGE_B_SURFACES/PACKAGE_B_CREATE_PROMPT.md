/create

# PACKAGE B — THE SURFACES (Desk B of 2) · THE HYDRA BUILD

## THE MISSION

Build THE SURFACES of the PBK v3 enforcement pipeline: the OMP host adapters that make Desk A's
engine bite. You own `classifySource`, the 4 hooks, and the `(surface, phase) -> ActionCall`
mapping. **THE STREAMING INTERRUPT — `message_update` -> `ctx.abort()` + inject — is the
deliverable abide has NO hook for.** It catches bad reasoning BEFORE the tool call lands.

**You are Desk B. Desk A builds the engine in parallel. YOU COMPUTE NO BAND.**

## THE BUILD PACKAGE (on disk — read ALL before writing code)

```
../SEAM/SEAM_CONTRACT.md              THE BOUNDARY — read first, always
PACKAGE_B_DPL1_SPEC.md                the contract (259 L) — G-1..G-6, the 4 waves, the 8 criteria
PACKAGE_B_WAVE_PLAN.md                WAVES: 4 — each wave's file set + command gate
PACKAGE_B_MASTER_BLUEPRINT.md         the design authority (the streaming interrupt, the abort chain)
context_management/                   11 canon docs
```

## THE WAVES (each gate green before the next)

```
B-1  THE GATE       classifySource + isQuotedMatch + SCORABLE
                    GATE: bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
B-2  THE SURFACES   the 4 hooks + the delta accumulator + the abort dedupe
                    GATE: 2 positives abort, 3 negatives silent
B-3  THE ACTION     dispatchAction(surface, phase, decisions) -> ActionCall
                    GATE: the 4-row mapping snapshot
B-4  THE ENTRY      the extension default export + the suite
                    GATE: bun test -> 0 fail · grep -c "bandOf\|confidence" src/ -> 0
```

## THE THREE INVARIANTS (violating any = the build is void)

```
I1  YOU COMPUTE NO BAND. Desk A's. You supply `sourceKind`; you receive `band`.
    THE PROOF: grep -c "bandOf\|confidence" src/  ->  0
I2  THE PHASE DETERMINES THE ACTION, AND YOU OWN THE MAPPING. Desk A returns a verdict;
    you decide the wire (only you know what each host surface can do).
I3  THE GATE IS PURE. Only `src/surfaces/**` and `src/action/**` touch ctx/pi.
    A host call inside `src/gate/**` is untestable and banned.
```

## THE ANTI-PATTERNS (each one has a measured cost — do not repeat it)

```
x A BAND COMPUTED HERE      -> Desk A's. The grep enforces it.
x A JEV CALL HERE           -> Desk A's check() makes it.
x A RULE FILE PARSED HERE   -> Desk A's loadRules.
x THE QUOTE CHECK ON tool_call  THE D-3 DEFECT: it classified the shell quotes as a
                               quotation and the block STOPPED FIRING. PROSE ONLY.
x AN UNDEDUPED ABORT        abort -> re-generate -> re-assert -> LOOP. The `${ruleId}:${span}`
                            signature guards it.
x A HOST CALL IN THE GATE   the gate is pure; the surfaces are not.
```

## THE PROOF CONTRACT (the 8 criteria, each a command)

```
1  bunx tsc --noEmit                     -> exit 0
2  bun test                              -> 0 fail
3  bun test -t source_kind_gate          -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
4  bun test -t abort_dispatch            -> 2 positives abort, 3 negatives silent
5  grep -c "bandOf\|confidence" src/     -> 0            (invariant I1)
6  grep -c "classifySource" src/         -> >= 1         (the gate is wired)
7  the harness's injected payload        -> carries the violation + the correction
8  the container: the extension loads    -> "9 rules loaded" in the log
```

## THE RUNTIME SEAT

```
the INSTANCE     this host · the successor session (name its JSONL path)
the ENFORCEMENT  the extension at ~/.omp/agent/extensions/lexicon-gate/
the STORE        the ledger at .abide/events.jsonl (written by the ENGINE)
the PUSH SET     Desk A's check() is imported; the integrator wires the merge
the OBSERVATION  a live session: a fired band -> ctx.abort() + the injected correction
```

## THE HARD STOPS

```
- NO SECRETS in the repo, the chat, or the ledger rows. Reference the key PATH only.
- THE RIG IS NOT THE SHIP. A test verdict is evidence, not a ship.
- A DEAD CARRIER IS NAMED (RIPWIRE_MISSING · OPENGROK_DOWN · GI_NO_STORE) — never fall back.
- NO UNLISTED MODEL.
- THE SEAM IS FROZEN. A change to ../SEAM/seam.ts invalidates BOTH packages — report, never edit.
- DESK A'S FILES ARE OFF LIMITS. `src/lexicon/**` and `src/engine/**` are not yours.
  Report a needed change; use the seam-shaped stub until Desk A lands.
```

## THE STOP

```
ALL of: the 8 criteria green with their command output quoted · every wave's gate met
in order · the invariant grep reads 0 · the seam unchanged · the ledger rows present
at .abide/events.jsonl · the canon + ship docs updated.
Anything less is OPEN. A green suite that computes its own band is not done.
```

## THE DOC CONTRACT

```
canon (11)   context_management/: CURRENT_STATE · BUILD_STATE · CHANGELOG · EVIDENCE_STATE
             · DECISION_CHAIN · NEXT_STEPS · TASK_QUEUE · POST-COMPACTION_PROMPT ·
             COMPACTION_SURVIVAL · RUNNING_BUILD_LOG + RUNNING_DEBUG_LOG
ship (6)     BUILD_REPORT · DEBUG_LOG · FAILURE_LOG · SPEC_VIOLATION_LOG · TESTING_LOG ·
             THEATRICALITY_LOG
```
