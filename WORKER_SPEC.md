# WORKER SPEC — W2 THE SURFACES

```
Master spec:  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md  (259 L)
Worker-plan:  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/.trident/worker-plan.md  (WORKERS: 2)
Worker:       W2
Worktree:     /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-surfaces
Branch:       worker/surfaces
SME domain:   the OMP host surfaces + the streaming interrupt (abide has NO equivalent)
```

**This is the FIRST LIVE RUN of the hydra-workers architecture.** This spec is W2's
executable contract. The master spec (Package B) is the SHARED authority; this document
REFERENCES its sections and EXPANDS only what is W2's own.

---

## §W0 SCOPE (what THIS worker owns)

**The deliverables, verbatim from the worker-plan:**

```
D1  the source-kind gate      (PACKAGE_B §2.2)   the FP shield — owned here
D2  the quote-state machine   (PACKAGE_B §2.2)   the quote walk — owned here
D3  the four hooks            (PACKAGE_B §2.3)   prose · tool-call · tool-result · post-tool-use
D4  the delta accumulator     (PACKAGE_B §2.3)   the streaming buffer (abide has 0 delta hits)
D5  the abort dedupe          (PACKAGE_B §2.4)   the loop guard
D6  the action dispatch       (PACKAGE_B §2.5)   the 4-row mapping
D7  the entry                 (PACKAGE_B §2.6)   the 4+ hooks registered; NO band computed
```

**The file paths W2 owns (disjoint from W1 by construction):**

```
wt-surfaces/src/gate/**        source-kind.ts · quote.ts
wt-surfaces/src/surfaces/**    prose.ts · tool.ts · result.ts · post.ts · stream.ts
wt-surfaces/src/action/**      dispatch.ts
wt-surfaces/src/index.ts       the extension entry (pi.on registrations)
wt-surfaces/tests/**           W2's own suite
wt-surfaces/WORKER_SPEC.md · WORKER_GOAL.md · TODOS.md
```

**The explicit NON-GOALS — W2 MUST NOT touch:**

```
✗ SEAM/seam.ts                    FROZEN. sha 66b66a7f10c7c6e7. Editing it breaks W1.
✗ wt-engine/**                    W1's worktree. A cross-worktree write is a scope breach.
✗ ~/.omp/agent/extensions/**      the LIVE extension (689 L, 5/5). MIGRATION is the merge phase.
✗ bandOf / confidence / the score W2 COMPUTES NO BAND (T-6). The engine's check() returns it.
✗ the lexicon weights             those live in the seam + W1's scorer.
```

## §W1 THE MASTER-SPEC SLICES (references, not copies)

**The Package B sections this worker implements — read them in the tree, do not restate:**

```
PACKAGE_B §2.1 THE FOUR SURFACES (G-4)       -> D3, D6  (the mapping, owned here)
PACKAGE_B §2.2 THE SOURCE-KIND GATE (G-2)    -> D1, D2  (the FP shield)
PACKAGE_B §2.3 THE STREAM BUFFER (G-1)       -> D4
PACKAGE_B §2.4 THE ABORT DEDUPE              -> D5
PACKAGE_B §2.5 THE ERROR RULES               -> D6
PACKAGE_B §1   THE FAILURE INVENTORY         the EVIDENCE the deliverables answer
PACKAGE_B §4   THE TESTING TIERS             §W3 expands these for W2
```

**The GLOBAL LAWS that bind W2:**

```
L1  THE SEAM IS FROZEN — W2 calls check() and ACTS on the Decision; it never re-scores
L2  LOUD FAIL OR CLEAR PASS — a missing correction THROWS; never a silent abort with no text
L3  THE ARTIFACT IS THE EVIDENCE — a claim carries sha256sum + the symbol grep
L4  NO BAND IN THE SURFACES — W2 computes no confidence; T-6 is the invariant
L5  THE HOST IS W2'S — ctx.abort() + pi.sendUserMessage are W2's alone; the engine never sees them
```

**The interfaces W2 CONSUMES (must exist first — they do):**

```
the frozen seam            SEAM/seam.ts (192 L, sha 66b66a7f10c7c6e7, tsc exit 0)
                           CheckRequest (surface, phase, text, sourceKind, file?, task?)
                           Decision (ruleId, band, probability, decidedBy, sourceKind,
                                     span, correction, capped)
                           CheckResult (decisions, jevCalls, total, errors)
the engine's check()       W1 produces it (wt-engine/src/index.ts) — W2 builds against the
                           SEAM's signature; the real impl arrives at the MERGE
```

**The interfaces W2 PRODUCES (the merge consumes):**

```
the registered hooks       pi.on("session_start"|"message_update"|"ttsr_triggered"|
                           "tool_call"|"tool_result"|"agent_end", ...)
the abort path             ctx.abort() + pi.sendUserMessage(the correction)
the action rows            the 4-surface -> the action-kind mapping
```

## §W2 THE TASKS (per-task WHAT / HOW / WHY / EXPECTED)

### W2-D1 · THE SOURCE-KIND GATE (PACKAGE_B §2.2 — the FP shield)

```
WHAT     the deterministic pre-gate: classifySource(line, inFence, fileKind) -> SrcKind
HOW      port the PROVEN classifySource from lib.ts:81 (the live 5/5 extension); SCORABLE is
         {own_utterance} ONLY (lib.ts:71); a rule_source / quotation / table / doc line NEVER
         reaches the score
WHY      G-2: the FP class. The live extension's 5 control cases prove the gate suppresses
         them; the port keeps the proof. Without it the lexicon fires on its own rule text.
EXPECTED `bun test -t source_kind_gate` -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
```

### W2-D2 · THE QUOTE-STATE MACHINE (PACKAGE_B §2.2)

```
WHAT     isQuotedMatch(line, match) — a quote-STATE walk (not an index check)
HOW      port the PROVEN walk from lib.ts:288; track open backtick / double-quote /
         single-quote regions; the match is quoted iff its START falls inside an open region
WHY      the class that produced the original FP on "the user asked me to run ...". The first
         version checked only the index; the walk is the fix. A regression here re-opens the FP.
EXPECTED `bun test -t quote_state` -> the 5 cases (open/closed/nested/escaped/absent) correct
```

### W2-D3 · THE FOUR HOOKS (PACKAGE_B §2.3 — G-4 the mapping)

```
WHAT     the 4 surface handlers, each calling check() with the right Surface + acting
HOW      prose -> message_update(event, ctx) -> ctx.abort() + pi.sendUserMessage(correction)
         tool-call -> tool_call -> return {block: true, reason}
         tool-result -> tool_result -> return {isError: true, content}
         post-tool-use -> the edit landed -> the repair demand
WHY      G-4: the surfaces are the host's real interception points. abide has NONE of them
         (0 streaming hits). This is the deliverable that makes the engine reachable.
EXPECTED `bun test -t abort_dispatch` -> 2 positives abort (ctx.abort called), 3 negatives silent
```

### W2-D4 · THE DELTA ACCUMULATOR (PACKAGE_B §2.3)

```
WHAT     buffer streaming deltas so a line split across message_update events assembles
HOW      accumulate the delta text; on a newline boundary, test the assembled line; reset the
         buffer; cap the buffer at a max to bound memory
WHY      G-1: message_update fires PER DELTA, not per line. A pattern spanning two deltas is
         invisible without the accumulator. abide has 0 delta handling — this is net-new.
EXPECTED `bun test -t delta_accumulator` -> a split-across-deltas line assembles + fires
```

### W2-D5 · THE ABORT DEDUPE (PACKAGE_B §2.4 — the loop guard)

```
WHAT     the same rule signature aborts ONCE per turn, not per delta
HOW      keep a per-turn Set of fired signatures; skip a repeat; reset at session_start /
         agent_end
WHY      the loop guard: without it every delta re-fires the same rule and the session
         abort-loops. The measured cost of the missing guard is an unusable session.
EXPECTED `bun test -t abort_dedupe` -> the same signature fires ONCE across 10 deltas
```

### W2-D6 · THE ACTION DISPATCH (PACKAGE_B §2.5)

```
WHAT     map (surface, phase, decidedBy, band) -> the action kind
HOW      the 4-row table: prose+lexicon+act -> abort; prose+jev+flag -> flag; tool-call -> block;
         tool-result -> isError; a missing correction THROWS
WHY      G-4: the action must be chosen from the surface, not guessed. A wrong row = a block
         where an abort belongs (or vice versa) — the wrong instrument on the wrong surface.
EXPECTED `bun test -t action_map` -> the 4 rows produce the 4 kinds
```

### W2-D7 · THE ENTRY (PACKAGE_B §2.6)

```
WHAT     src/index.ts registering the hooks via pi.on(...)
HOW      port the entry's shape from the live index.ts:83-199 (6 pi.on registrations);
         register the 4 surface hooks + session_start + agent_end; NO band math anywhere
WHY      T-6/T-7: the entry is where the host binds. The purity of the engine is only
         meaningful if SOMETHING owns the host — that something is this file.
EXPECTED `grep -c 'pi.on(' src/index.ts` -> >= 4
         `grep -rc "bandOf\|confidence" src/ | grep -v ':0'` -> EMPTY
```

## §W3 TESTING (the worker's own proof obligation)

**Every scenario declares a passToken in a TOOL RESULT and a failToken that MUST NOT appear.
The adversarial cases come FIRST; the happy path LAST.**

```
| the scenario | the input | the passToken | the failToken | the tier |
| S1 adversarial · the FP control | a line quoting a rule | "source_kind":"quotation" | "act" | unit |
| S2 adversarial · the fence | text inside a ``` fence | "rule_source" | "own_utterance" | unit |
| S3 adversarial · the split delta | a pattern across 2 deltas | "assembled" + fires | silent | unit |
| S4 adversarial · the repeat storm | 10 deltas, 1 signature | "abort=1" | "abort=10" | unit |
| S5 adversarial · the empty text | message_update with "" | no throw, no abort | a crash | unit |
| S6 adversarial · the missing correction | a Decision with correction "" | "LOUD_FAIL" | a silent abort | unit |
| S7 mutation · the dedupe removed | delete the per-turn Set | the S4 test MUST go RED | green | unit |
| S8 mutation · the gate bypassed | SCORABLE = all kinds | the S1 test MUST go RED | green | unit |
| S9 happy · the 4 surfaces | one input per surface | the 4 kinds | a wrong kind | script |
| S10 the purity | the whole src/ tree | "grep: EMPTY" | any bandOf/confidence | static |
```

**The mutation check is MANDATORY (S7, S8): a test that does not go red on wrong code proves
nothing. Record the red run's output.**

## §W4 SUCCESS CRITERIA (mechanical, per deliverable)

```
| the criterion | the command | the expected output | the oracle |
| SC-1 the gate suppresses | bun test -t source_kind_gate | 0 FP + 5/5 controls | OR-10 |
| SC-2 the quote walk holds | bun test -t quote_state | the 5 cases correct | OR-10 |
| SC-3 the hooks abort | bun test -t abort_dispatch | 2 abort, 3 silent | OR-11, OR-12 |
| SC-4 the delta assembles | bun test -t delta_accumulator | the split line fires | OR-11 |
| SC-5 the dedupe holds | bun test -t abort_dedupe | abort=1 across 10 deltas | OR-11 |
| SC-6 the dispatch maps | bun test -t action_map | the 4 kinds | OR-12, OR-13 |
| SC-7 the hooks register | grep -c 'pi.on(' src/index.ts | >= 4 | OR-7 |
| SC-8 the purity holds | grep -rc "bandOf\|confidence" src/ \| grep -v ':0' | EMPTY | OR-7 |
| SC-9 the tree type-checks | bunx tsc --noEmit | exit 0 | OR-14 |
| SC-10 the inject carries the correction | bun test -t inject_payload | the payload printed | OR-13 |
```

## §W5 ANTI-PATTERNS (this worker's failure classes, each with its mechanical detection)

```
| the anti-pattern | the mechanical detection | why it is banned here |
| THE RECOMPUTED BAND — the surfaces scoring | grep -rn 'bandOf\|confidence(' src/ | T-6: the seam is the only scorer |
| THE SILENT ABORT — abort with no correction | grep -n 'ctx.abort' src/ then read the call site | an abort with no text is a hang |
| THE ABORT STORM — no dedupe | grep -c 'Set\|seen\|signature' src/surfaces/stream.ts | the loop guard is mandatory |
| THE INDEX-ONLY QUOTE CHECK — the FP regression | grep -c 'indexOf\|startsWith' src/gate/quote.ts | the state walk is the fix; the index check is the bug |
| THE PER-DELTA FIRING — no accumulator | grep -c 'buffer\|accum' src/surfaces/stream.ts | G-1: a split pattern is invisible without it |
| THE GUESSED ACTION — the surface ignored | grep -c 'surface' src/action/dispatch.ts | G-4: the action comes FROM the surface |
| THE STUB — a placeholder for working machinery | grep -rn 'TODO\|stub\|not implemented\|INCONCLUSIVE' src/ | the no-stub law |
| THE FAKE TEST — a green suite testing a fixture | grep -c "from '../src\|from '../../src" tests/*.ts | a test that never imports the artifact proves nothing |
```

## §W6 THE GATE (the worker's done-when)

```
THE WORKER'S GATE — every line must pass, mechanically:

  bunx tsc --noEmit                                    -> exit 0
  bun test                                             -> 0 fail
  bun test -t source_kind_gate                         -> 0 FP + 5/5 controls
  bun test -t quote_state                              -> the 5 cases correct
  bun test -t abort_dispatch                           -> 2 abort, 3 silent
  bun test -t abort_dedupe                             -> abort=1 across 10 deltas
  grep -c 'pi.on(' src/index.ts                        -> >= 4
  grep -rc "bandOf\|confidence" src/ | grep -v ':0'    -> EMPTY

THE PR REQUIRED CHECKS — armed by the orchestrator:
  gates/tsc      bunx tsc --noEmit
  gates/test     bun test
  gates/purity   grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> EMPTY

ANCHOR 1 — THE WORKER CANNOT MERGE ITS OWN PR. The branch worker/surfaces opens a PR into
master; the orchestrator reviews and merges. The worker's last action is the PR, never the
merge.
```

## §W7 THE TODO ANCHOR (the pinned todo list — Anchor 2)

**These are pinned BEFORE the first action. A todo completes ONLY when its gate lands.**

```
[ ] W2-T1   worktree + branch verified        -> git branch --show-current == worker/surfaces
[ ] W2-T2   worker spec + goal pin on disk    -> ls WORKER_SPEC.md WORKER_GOAL.md
[ ] W2-T3   D1 the source-kind gate           -> bun test -t source_kind_gate -> 0 FP
[ ] W2-T4   D2 the quote-state machine        -> bun test -t quote_state -> 5/5
[ ] W2-T5   D4 the delta accumulator          -> bun test -t delta_accumulator -> fires
[ ] W2-T6   D5 the abort dedupe               -> bun test -t abort_dedupe -> abort=1
[ ] W2-T7   D3 the four hooks                 -> bun test -t abort_dispatch -> 2/3
[ ] W2-T8   D6 the action dispatch            -> bun test -t action_map -> 4 kinds
[ ] W2-T9   D7 the entry + purity             -> grep -rc "bandOf\|confidence" src/ -> EMPTY
[ ] W2-T10  the self-audit §A table executed  -> every row carries a verdict
[ ] W2-T11  the PR opened                     -> the required checks armed
[ ] W2-T12  the PR merged via the gate        -> the orchestrator merges, NOT W2
[ ] W2-T13  canon + ship docs updated         -> the record loop
```

**W2-T12 is IMMUTABLE and NOT the worker's to complete: the orchestrator owns the merge.**
**W2-T13 is IMMUTABLE: a milestone without its record is an unfinished milestone.**

## §W8 THE GOAL PIN (the behavior program — Anchor 3)

```
the pinned goal:  wt-surfaces/WORKER_GOAL.md
the behavior program: the 7 slots (GOAL · BASELINE · WORKERS · LAWS · HARD STOPS ·
                      PROOF CONTRACT · STOP) + the ONE /goal line
the reload law:   W2 re-asserts the pin's LAWS + PROOF CONTRACT every turn; on compaction
                  W2 reads §W10's pointers and continues
```

## §W9 THE SELF-AUDIT TABLE (§A from the worker-plan — executed, NEVER improvised)

```
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| src/gate/source-kind.ts | classifySource + SCORABLE | bun test -t source_kind_gate | OR-10 | _ |
| src/gate/quote.ts | isQuotedMatch (the state walk) | bun test -t quote_state | OR-10 | _ |
| src/surfaces/prose.ts | message_update takes (event, ctx) | grep -c 'ctx.abort' | OR-11 | _ |
| src/surfaces/stream.ts | the delta accumulator | bun test -t delta_accumulator | OR-11 | _ |
| src/surfaces/stream.ts | the abort dedupe | bun test -t abort_dedupe | OR-11 | _ |
| src/surfaces/tool.ts | the material kind "doc" | grep -c '"doc"' | OR-12 | _ |
| src/action/dispatch.ts | the 4-row mapping | bun test -t action_map | OR-12, OR-13 | _ |
| src/index.ts | the 4 hooks registered | grep -c 'pi.on(' -> >= 4 | OR-7 | _ |
| EVERY src file | NO band computed | grep -rc "bandOf\|confidence" src/ | OR-7 | _ |
```

## §W10 RESUME POINTERS (compaction survival)

```
READ FIRST on any resume, in this order:

1. wt-surfaces/WORKER_SPEC.md               (this file — §W0 scope, §W7 todos)
2. wt-surfaces/TODOS.md                     (the pinned board; re-derive from §W7 if stale)
3. wt-surfaces/WORKER_GOAL.md               (the behavior program)
4. .trident/worker-plan.md                  (the topology; §O the oracles; §A the audit)
5. PACKAGE_B_SURFACES/PACKAGE_B_DPL1_SPEC.md (§1 the failures, §2.1-2.5 the contracts)
6. SEAM/seam.ts + SEAM/SEAM_CONTRACT.md     (the frozen contract — 192 L, sha 66b66a7f)
7. ~/.omp/agent/extensions/lexicon-gate/    (THE MIGRATION SOURCE: lib.ts:81 classifySource,
                                             lib.ts:288 isQuotedMatch, lib.ts:71 SCORABLE,
                                             index.ts:83-199 the 6 pi.on registrations)

THE RULE: on resume, re-derive the todo list from §W7 — NEVER trust a stale board over the
spec.
```

## §W11 THE MIGRATION VOCABULARY (the measured divergence — W2 MUST TRANSLATE)

**The measured defect: three band vocabularies exist. The seam + abide agree; the LIVE
extension is the outlier. W2's migration maps them.**

```
the seam     Band = "act" | "flag" | "clear"       (seam.ts:26)  ← the CONTRACT
abide        z.enum(["act","flag","clear"])        (verdict.ts:4) ← the AUTHORITY
the extension Band = "silent" | "gray" | "fire"    (lib.ts:43)   ← THE OUTLIER

THE MIGRATION MAP (when W2 ports the live extension's proven logic):
  "fire"   -> "act"
  "gray"   -> "flag"
  "silent" -> "clear"

AND THE FUNCTION: the extension's bandOf (lib.ts:127) is NOT abide's bandFor (band.ts:48).
  bandOf(c, {low, high}) -> "silent" | "gray" | "fire"
  bandFor(p, thresholds) -> "act" | "flag" | "clear"
W2 imports NOTHING for the band — the engine returns it. This table is ONLY for the migration.
```
