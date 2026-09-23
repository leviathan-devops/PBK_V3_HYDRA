# DECISION_CHAIN — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23 · every decision below is a RULING with its basis.

```
B101  THE STREAMING INTERRUPT IS THIS DESK'S REASON TO EXIST.
      THE RULING: `message_update` -> `ctx.abort()` + `pi.sendUserMessage(steer)`.
      THE BASIS (measured): abide's 4 hooks are ALL boundary events (hooks.ts:21,29,81,105);
      its streaming hits are 0 (grep -rn "delta|text_delta" -> 0). Bad reasoning precedes the
      tool call — only a streaming hook catches it BEFORE it lands.
      THE EVIDENCE IT WORKS: the container run — the agent's own words: "the system-interrupt
      says I MUST comply with 'THE ARTIFACT LAW'" — stopped mid-generation, before the tool call.

B102  THE PHASE DETERMINES THE ACTION, AND DESK B OWNS THE MAPPING.
      THE RULING: `dispatchAction(surface, phase, decisions) -> ActionCall | null`.
      THE BASIS: only Desk B knows what each host surface can do. Desk A returns a verdict;
      B decides the wire. The seam types the contract (ActionCall, the 5 kinds).
      THE MAPPING: prose -> abort+inject · tool-call -> block · tool-result -> isError ·
                   post-tool-use -> block.

B103  THE QUOTE CHECK IS PROSE-ONLY.
      THE RULING: `message_update` passes quoteCheck=true; `tool_call` passes quoteCheck=false.
      THE BASIS (MEASURED — the D-3 defect): applying the check to tool_call classified the
      shell quotes in `echo "the build is done"` as a QUOTATION, and THE BLOCK STOPPED FIRING.
      A tool_call's args are the agent's own COMPOSITION; the quotes are shell syntax.
      THE CONSEQUENCE: the asymmetry is load-bearing and must be tested (the suite asserts both).

B104  THE ABORT IS DEDUPED BY SIGNATURE.
      THE RULING: the `${ruleId}:${span}` signature guards the abort; a repeat does not re-abort.
      THE BASIS: abort -> re-generate -> re-assert -> abort is a REAL loop; the abort stops the
      generation, the model re-emits the phrase, the band fires again.
      THE CONSEQUENCE: `lastAbort` resets at session_start; the dedupe limits one abort per span.

B105  NOTHING IS DELETED.
      THE RULING: abort + inject; the text is interrupted IN PLACE.
      THE OPERATOR'S WORDS, verbatim: "i would perfer it gets interrupted in place on the exact
      token, nothing is deleted, violation quoted + correction message injected."
      THE BASIS: the extension surface has 0 hits for `replaceMessages` — a rewind is unavailable
      to an extension. Stop + inject is the achievable equivalent, and it is the operator's
      stated preference.

B106  DESK B COMPUTES NO BAND.
      THE RULING: Desk B supplies `sourceKind`; it receives `band` (invariant I1).
      THE BASIS: a band in Desk B is the second-source-of-truth defect (kernel-judge.ts).
      THE ENFORCEMENT: grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> empty.

B107  A SEAM-SHAPED STUB COVERS THE ENGINE'S ABSENCE.
      THE RULING: B-2 builds against the seam, not against Desk A's implementation.
      THE BASIS: the desks run in PARALLEL; Desk B cannot wait for Desk A.
      THE CONSEQUENCE: the stub returns `{decisions:[], jevCalls:0, total:0, errors:[]}`; the
      merge replaces it with the real `check()` — one import.

B108  THE EXISTING EXTENSION'S GATE IS MIGRATED, NOT REWRITTEN.
      THE RULING: `lib.ts:79 classifySource` and `lib.ts:282 isQuotedMatch` move to src/gate/.
      THE BASIS (measured): the existing suite passes 5/5; the gate's 5 FP controls are proven.
      THE CONSEQUENCE: the gate's semantics are preserved; the migration is A108's mirror on
      Desk A's side.
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
┌───────────────┬─────────────────┬──────────────┬────────────────────────┐
│ SURFACE       │ THE OMP EVENT   │ THE ACTION   │ THE WIRE               │
├───────────────┼─────────────────┼──────────────┼────────────────────────┤
│ prose         │ message_update  │ abort+inject │ ctx.abort() +          │
│               │ (text_delta /   │              │ sendUserMessage(steer) │
│               │ thinking_delta) │              │                        │
│ tool-call     │ tool_call       │ block        │ return {block, reason} │
│ tool-result   │ tool_result     │ isError      │ return {isError,       │
│               │                 │              │ content:[..., demand]} │
│ post-tool-use │ (abide native)  │ block        │ the repair demand      │
└───────────────┴─────────────────┴──────────────┴────────────────────────┘
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
