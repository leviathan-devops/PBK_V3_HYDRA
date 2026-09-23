# NEXT_STEPS — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23 · the resume point

## THE ENTRY (a fresh agent, zero context)

```
1  ../SEAM/SEAM_CONTRACT.md            the boundary (read FIRST, always)
2  PACKAGE_B_DPL1_SPEC.md              the contract (G-1..G-6, the 4 waves, the 8 criteria)
3  PACKAGE_B_WAVE_PLAN.md              WAVES: 4 — each wave's file set + command gate
4  PACKAGE_B_MASTER_BLUEPRINT.md       the design authority (the streaming interrupt, the abort chain)
5  context_management/CURRENT_STATE.md this doc's sibling — the live state
```

## THE WAVES (in order, each gate green before the next)

```
B-1  THE GATE
     the files:  src/gate/{source-kind,quote}.ts
     the seed:   ~/.omp/agent/extensions/lexicon-gate/lib.ts:79, :282
     the gate:   bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
     the note:   the 5 FP controls (a heading · a table row · a backtick bullet · a blockquote ·
                 a fenced block) must ALL be non-scorable.

B-2  THE SURFACES
     the files:  src/surfaces/{prose,stream,tool}.ts
     the seed:   ~/.omp/agent/extensions/lexicon-gate/index.ts:93
     the gate:   bun test -t abort_dispatch -> 2 positives abort, 3 negatives silent
                 bun test -t delta_accumulator -> a split-across-deltas line assembles
                 bun test -t abort_dedupe -> the same signature aborts ONCE
                 grep -c "bandOf\|confidence" src/ -> 0
     thenote:   ★ THE STREAMING INTERRUPT. message_update takes (event,
       ctx);
                 a fired band calls ctx.abort() + pi.sendUserMessage(text, {deliverAs:"steer"}).

B-3  THE ACTION
     the files:  src/action/dispatch.ts
     the gate:   bun test -t action_map -> the 4 rows each produce the right `kind`
     the note:   the mapping is owned here because only Desk B knows what each surface can do.

B-4  THE ENTRY
     the files:  src/index.ts · src/surfaces/*.test.ts
     the gate:   bunx tsc --noEmit exit 0 · bun test 0 fail
                 grep -c "bandOf\|confidence" src/ -> 0
```

## THE BOUNDARY CHECK (before the merge)

```bash
# Desk B never computes a band
grep -rc "bandOf\|confidence" src/ | grep -v ':0' || echo "I1 HOLDS: no band computed in B"
# the gate never touches a host
grep -rc "ctx\|pi\." src/gate/ | grep -v ':0' || echo "I3 HOLDS: the gate is pure"
# the seam's types are satisfied
bunx tsc --noEmit ../SEAM/seam.ts src/index.ts
```

## THE MIGRATION (B108 — the existing gate)

```
the existing 689-L extension is NOT deleted by this package. Its modules MIGRATE:
  lib.ts:79  classifySource   -> src/gate/source-kind.ts
  lib.ts:282 isQuotedMatch    -> src/gate/quote.ts
  index.ts:93 message_update  -> src/surfaces/prose.ts
  the other 3 hooks           -> src/surfaces/tool.ts
  bandOf / judgeSpans / reason -> DELETED (Desk A's engine + abide's are imported instead)
the supersession happens ONLY after both desks land + the merge's integration audit is green.
```

## THE RESUME

```
re-run: bunx tsc --noEmit -p tsconfig.json
if red -> the seam drifted. Report, never edit.
the surfaces are COMPLETE when the 8 success criteria in the spec are green with their output quoted.
```

## THE RISK REGISTER

```
R1  THE OMP EVENT ORDER differs from the assumption -> B-2 observes and records the real order.
R2  THE ABORT LOOP re-fires -> the dedupe signature guards it; if it still loops, WIDEN the
    signature (ruleId + span + a turn counter).
R3  THE ENGINE DOES NOT EXIST -> the seam-shaped stub covers B-2; the merge replaces it.
R4  A TOOL-RESULT FALSE POSITIVE -> the kind is "doc" (material, not voice); if it still fires,
    the gate's fileKind logic needs the material kind.
R5  THE EXISTING EXTENSION AND THE NEW TREE COLLIDE -> the migration order (B108) is the mitigation.
```

---


---

## THE FILE:LINE ANCHORS (every one read this session — the load-bearing set)

```
THE SEAM + THE BOUNDARY
  SEAM/seam.ts:1-192                  the frozen interface (sha 66b66a7f10c7c6e737a491b6e0f63903)
  SEAM/seam.ts:58-160                 the seam's own types (SrcKind..LedgerRow)
  SEAM/seam.ts:118-124                ActionCall (the 5 kinds)
  SEAM/seam.ts:150-160                LedgerRow (the shared record shape)
  SEAM/SEAM_CONTRACT.md               the boundary + the 3 invariants

THE OMP RUNTIME (the host Desk B owns)
  .../extensibility/extensions/types.ts:441     abort(): void — THE STREAMING STOP
  .../extensibility/extensions/types.ts:1122    the handler signature (event, ctx)
  .../extensibility/extensions/types.ts:1287    sendUserMessage(content, opts)
  .../extensibility/extensions/loader.ts:478    isExtensionFile (.ts | .js)
  .../extensibility/extensions/loader.ts:504-508  the subdir index.ts loads
  .../extensibility/extensions/loader.ts:562-571  the discovery walk
  packages/ai/src/types.ts:1223                 { type:"text_delta", contentIndex, delta }
  packages/ai/src/types.ts:1226                 { type:"thinking_delta", contentIndex, delta }
  .../session/agent-session.ts:5518             abort: () => void this.abort()
  .../session/agent-session.ts:8372             abort: () => this.agent.abort()
  .../extensibility/extensions/runner.ts:859    abort: () => this.#abortFn()
  .../extensibility/extensions/runner.ts:543    this.#abortFn = contextActions.abort

ABIDE (the engine Desk B calls — and the hooks it does NOT have)
  schema/src/hooks.ts:21                        hook_event_name: "SessionStart"
  schema/src/hooks.ts:29                        hook_event_name: "UserPromptSubmit"
  schema/src/hooks.ts:81                        hook_event_name: "PostToolUse"
  schema/src/hooks.ts:105                       hook_event_name: "Stop"
  opencode/abide.mjs:115                        "chat.message" (UserPromptSubmit)
  opencode/abide.mjs:169                        "tool.execute.after" (PostToolUse)
  * grep -rn "delta|text_delta" packages/ --include=*.ts | wc -l  ->  0
    ABIDE HAS NO STREAMING HOOK. That absence IS this desk's reason to exist.

THE EXISTING EXTENSION (the migration baseline — Desk B inherits its gate)
  ~/.omp/agent/extensions/lexicon-gate/lib.ts      307 L (classifySource:79, isQuotedMatch:282)
  ~/.omp/agent/extensions/lexicon-gate/index.ts    203 L (message_update:93)
  ~/.omp/agent/extensions/lexicon-gate/lib.test.ts 179 L (the 5 selectors)

THE MEASURED DEFECTS (Desk B's anti-patterns)
  the D-3 defect    the quote check applied to tool_call -> the block STOPPED FIRING
  the abort loop    abort -> re-generate -> re-assert -> abort (the dedupe guards it)
  the tool_result kind  a tool OUTPUT scored as own_utterance (fixed: the material kind "doc")
```


---


---

## THE COMMANDS (every claim in this package traces to one)

```bash
# -- THE SEAM (W0 - PASSES) ---------------------------------------------
cd PBK_V3_HYDRA
bunx tsc --noEmit -p tsconfig.json               # exit 0 - the seam type-checks
sha256sum SEAM/seam.ts | cut -c1-32              # 66b66a7f10c7c6e737a491b6e0f63903

# -- THE SURFACES (Desk B, once built) ----------------------------------
bunx tsc --noEmit                                # exit 0
bun test                                         # 0 fail
bun test -t source_kind_gate                     # 0 FP + 5/5 controls
bun test -t abort_dispatch                       # 2 positives abort, 3 negatives silent
bun test -t delta_accumulator                    # a split-across-deltas line assembles
bun test -t abort_dedupe                         # the same signature aborts ONCE
bun test -t action_map                           # the 4 rows each produce the right kind
grep -rc "bandOf\|confidence" src/ | grep -v ':0' || echo "I1 HOLDS"

# -- THE EXISTING EXTENSION (the migration baseline) --------------------
cd ~/.omp/agent/extensions/lexicon-gate && bun test .   # 5 pass / 0 fail
omp ttsr list | grep -c '\[native\]'             # 0 - TTSR is the empty hook
grep -n 'classifySource\|isQuotedMatch' lib.ts   # :79 :282 - the gate to migrate

# -- THE ABIDE HOOK SURFACE (the absence Desk B fills) ------------------
grep -n 'hook_event_name' /tmp/abide-repo/packages/schema/src/hooks.ts | head -5
grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts | wc -l   # 0
grep -n '"chat.message"\|"tool.execute.after"' /tmp/abide-repo/packages/cli/opencode/abide.mjs
```

---

## THE D-3 DEFECT — THE ANATOMY (the sharpest trap Desk B inherits)

```
THE DEFECT (from the ancestor session, measured):
  1. the quotation check was added (a phrase the agent QUOTES is material, not its own claim)
  2. the check was applied to ALL paths, including tool_call
  3. the S1 tool_call was `echo "the build is done"` — the shell quotes
  4. the check saw an open quote -> classified the line `quotation`
  5. `SCORABLE = {own_utterance}` -> a quotation is NON-scorable
  6. THE BLOCK STOPPED FIRING. The primary function was silently disabled.

WHY IT WAS INVISIBLE: the unit tests stayed green. The suite tested the FUNCTION's contract, not
the SYSTEM's behaviour. Only the live container ROUND caught it — the block that should have
fired did not.

THE FIX: `decide(..., quoteCheck=false)` on the tool_call path.
  a PROSE line may QUOTE material the agent is reading
  a tool_call's args are the agent's own COMPOSITION (the quotes are shell syntax)

THE TEST THAT GUARDS IT: B-2's gate asserts BOTH halves —
  2 positives ABORT (including a tool_call with shell quotes)
  3 negatives stay SILENT (including a prose line that quotes the same phrase)
```

---

## THE ACCEPTANCE CRITERIA (the exact assertion per wave)

```
B-1  DONE = "TOTAL FALSE POSITIVES: 0" AND "CONTROL: 5/5 fired" in the gate's output
           AND the 5 FP controls are ALL non-scorable
           AND grep -c "ctx\|pi\." src/gate/ is 0   (the gate is pure)

B-2  DONE = 2 positives abort AND 3 negatives silent (in a TOOL RESULT, not prose)
           AND a split-across-deltas line assembles
           AND the same signature aborts ONCE
           AND grep -rc "bandOf\|confidence" src/ | grep -v ':0' is EMPTY

B-3  DONE = the 4 rows each produce the right kind, with a snapshot per row

B-4  DONE = tsc exit 0 AND bun test 0 fail AND the 4 hooks registered
           AND the invariant grep is EMPTY

NOT DONE = any criterion met without its output quoted.
```
