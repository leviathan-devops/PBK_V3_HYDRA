# CURRENT_STATE — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23 · **Wave:** W0 COMPLETE (the seam frozen + type-checked) · B-1..B-4 PENDING
**HONEST_CLASS:** `surfaces` · **Owner:** Desk B · **The seam:** v1.0.0 (sha 66b66a7f10c7c6e737a491b6e0f63903)

## THE ONE-LINE STATE

The seam is frozen and **type-checks clean** (`tsc --noEmit` exit 0). The surfaces are **NOT BUILT** —
this package is the complete plan: 4 waves, each with a disjoint file set and a command gate. The
surfaces' job: make the engine BITE — and the deliverable that matters is the **STREAMING INTERRUPT**,
the one hook abide has no equivalent for.

## THE MEASURED BASELINE (before any wave)

```
the seam          SEAM/seam.ts 192 L · sha256 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit -> exit 0
src/gate/         ABSENT — B-1 creates classifySource + isQuotedMatch
src/surfaces/     ABSENT — B-2 creates the 4 hooks + the delta accumulator
src/action/       ABSENT — B-3 creates the 4-row dispatch
src/index.ts      ABSENT — B-4 exports the extension
the existing ext  ~/.omp/agent/extensions/lexicon-gate/ 689 L (the migration baseline)
abide's hooks     4, all BOUNDARY events · 0 streaming hooks
```

## THE PER-MODULE STATUS

```
┌─────────────────────┬─────────┬──────────────────────────────────────────┐
│ MODULE              │ STATUS  │ THE EVIDENCE                             │
├─────────────────────┼─────────┼──────────────────────────────────────────┤
│ SEAM/seam.ts        │ FROZEN  │ tsc --noEmit exit 0 · sha 66b66a7f10c7c6 │
│ src/gate/ (B-1)     │ UNBUILT │ the existing lib.ts:79,282 is the seed   │
│ src/surfaces/ (B-2) │ UNBUILT │ the existing index.ts:93 is the seed     │
│ src/action/ (B-3)   │ UNBUILT │ the seam's ActionCall is the shape       │
│ src/index.ts (B-4)  │ UNBUILT │ the 4 hooks registered                   │
└─────────────────────┴─────────┴──────────────────────────────────────────┘
```

## THE 4 WAVES AND THEIR GATES

```
B-1  THE GATE        classifySource + isQuotedMatch + SCORABLE
                     GATE: bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0"
                                                          + "CONTROL: 5/5 fired"

B-2  THE SURFACES    the 4 hooks + the delta accumulator + the abort dedupe
                     ★THE STREAMING INTERRUPT (message_update ->
                       ctx.abort()+ inject)
                     GATE: bun test -t abort_dispatch -> 2 positives abort, 3 negatives silent
                           bun test -t delta_accumulator -> a split line assembles
                           bun test -t abort_dedupe -> the same signature aborts ONCE
                           grep -c "bandOf\|confidence" src/ -> 0

B-3  THE ACTION      dispatchAction(surface, phase, decisions) -> ActionCall | null
                     GATE: bun test -t action_map -> the 4 rows each produce the right kind

B-4  THE ENTRY       the extension default export + the suite
                     GATE: bunx tsc --noEmit exit 0 · bun test 0 fail
                           grep -c "bandOf\|confidence" src/ -> 0
```

## WHAT IS PROVEN vs PENDING

```
PROVEN (this session, mechanically)
  the seam type-checks          bunx tsc --noEmit -p tsconfig.json -> exit 0
  the seam is self-contained    zero imports
  the seam's sha is recorded    66b66a7f10c7c6e737a491b6e0f63903
  abide has NO streaming hook   grep -rn "delta|text_delta" packages/ -> 0
  abide's 4 hooks are boundary  hooks.ts:21,29,81,105
  the existing gate is real     lib.ts:79 classifySource · :282 isQuotedMatch · 5/5 green
  TTSR is the empty hook        omp ttsr list | grep -c native -> 0

PENDING (the 4 waves — every gate above is PENDING)
  the gate · the surfaces · the action · the entry
```

## THE HONEST GAPS

```
(1) THE SURFACES ARE UNBUILT. Every gate in B-1..B-4 is PENDING.
(2) THE OMP EVENT ORDER IS UNMEASURED — does tool_call precede the text_delta? B-2 observes it.
(3) THE TOOL-RESULT SOURCE KIND is a JUDGEMENT ("doc"), not a measurement (open question Q3).
(4) THE ABORT LOOP is guarded by a signature dedupe, not by a proof.
(5) THE 64KB BUFFER CAP is specified, not measured against a real long thinking block.
(6) THE ENGINE MAY NOT EXIST YET — B-2 uses a seam-shaped stub until Desk A lands.

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

## THE ABORT CHAIN — THE 5 HOPS (every one read this session)

```
  ctx.abort()                                    <- the handler's second argument
    |
    v
  .../extensibility/extensions/types.ts:441
    /** Abort the current agent operation */
    abort(): void;
    |
    v
  .../extensibility/extensions/runner.ts:859
    abort: () => this.#abortFn(),
    |
    v
  .../extensibility/extensions/runner.ts:543
    this.#abortFn = contextActions.abort;
    |
    v
  .../session/agent-session.ts:5518
    abort: () => { void this.abort(); },
    |
    v
  .../session/agent-session.ts:8372
    abort: () => { this.agent.abort(); },
    |
    v
  the agent's current operation STOPS
```

**WHY THIS CHAIN MATTERS.** An earlier design asserted *"an extension CANNOT abort prose"* — a claim
written in a comment and never measured. It was HALF-wrong: `message_update` carries no RESULT type
(true), but the handler's SECOND argument is an imperative handle, and `abort()` on it needs no
return channel. The 5 hops above are the measurement that corrected the claim.

## THE FOUR SURFACES (the phase -> action table)

```
┌───────────────┬──────────────────┬──────────────────┬─────────────────────────┐
│ SURFACE       │ THE OMP EVENT    │ THE ACTION       │ THE WIRE                │
├───────────────┼──────────────────┼──────────────────┼─────────────────────────┤
│ prose         │ message_update   │ abort+inject     │ ctx.abort() +           │
│               │ (text_delta /    │                  │ sendUserMessage(steer)  │
│               │  thinking_delta) │                  │                         │
│ tool-call     │ tool_call        │ block            │ return {block, reason}  │
│ tool-result   │ tool_result      │ isError          │ return {isError,        │
│               │                  │                  │   content:[..., demand]}│
│ post-tool-use │ (abide native)   │ block            │ the repair demand       │
└───────────────┴──────────────────┴──────────────────┴─────────────────────────┘
```

## THE DELTA SHAPE (the streaming input)

```
{ type: "text_delta" | "thinking_delta",
  contentIndex: number,
  delta: string,          <- the incremental text
  partial: AssistantMessage }
```

**THE ACCUMULATOR'S JOB.** A `delta` is a FRAGMENT — a line may arrive split across several deltas.
The accumulator buffers per `(type, contentIndex)`, splits on `\n`, and only scores a COMPLETE line.
The trailing fragment stays buffered until the next delta completes it.
