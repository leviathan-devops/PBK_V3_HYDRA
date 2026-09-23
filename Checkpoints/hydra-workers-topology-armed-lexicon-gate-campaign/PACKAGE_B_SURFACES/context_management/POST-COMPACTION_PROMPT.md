# POST-COMPACTION_PROMPT — PACKAGE B (THE SURFACES)

**Read this FIRST after a compaction.**

## WHERE YOU ARE

Building **THE SURFACES** (Desk B of 2) for the PBK v3 hydra build. The seam is frozen and
type-checks; your 4 waves are planned; nothing is built yet. **Your deliverable that matters: the
STREAMING INTERRUPT** — the hook abide has no equivalent for.

## THE READ ORDER

```
1  ../SEAM/SEAM_CONTRACT.md              the boundary
2  PACKAGE_B_DPL1_SPEC.md                the contract (G-1..G-6)
3  PACKAGE_B_WAVE_PLAN.md                WAVES: 4
4  PACKAGE_B_MASTER_BLUEPRINT.md         the design authority
5  context_management/CURRENT_STATE.md   the live state
6  context_management/DECISION_CHAIN.md  B101-B108
```

## THE SEVEN FACTS YOU MUST NOT RE-DERIVE

```
F1  THE SEAM IS FROZEN. You call check(req: CheckRequest) -> Promise<CheckResult>.
    sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0. A change invalidates BOTH packages.
F2  YOU COMPUTE NO BAND. Desk B supplies sourceKind; it receives band.
    grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> empty.
F3  THE QUOTE CHECK IS PROSE-ONLY. tool_call passes quoteCheck=false.
    THE D-3 DEFECT: applying it to tool_call classified the shell quotes as a quotation and
    THE BLOCK STOPPED FIRING.
F4  THE ABORT IS DEDUPED. `${ruleId}:${span}`. Without it: abort -> regenerate -> re-assert -> LOOP.
F5  NOTHING IS DELETED. ctx.abort() + pi.sendUserMessage(steer). Interrupted in place.
F6  THE GATE IS PURE. Only src/surfaces/** and src/action/** touch ctx/pi.
F7  THE EXISTING GATE MIGRATES (B108): lib.ts:79, :282 -> src/gate/. Never rewritten.
```

## THE HARD STOPS

```
- NO SECRETS in the repo, the chat, or the ledger rows. Reference the key PATH only.
- THE RIG IS NOT THE SHIP. A test verdict is evidence, not a ship.
- A DEAD CARRIER IS NAMED (RIPWIRE_MISSING · OPENGROK_DOWN · GI_NO_STORE) — never fall back.
- NO UNLISTED MODEL.
- THE SEAM IS FROZEN — report a needed change, never edit.
- DESK A'S FILES ARE OFF LIMITS (src/lexicon/** · src/engine/** · src/lint/** · src/ledger/**).
  Use the seam-shaped stub until Desk A lands.
```

## THE SEAM'S CONTRACT (paste-ready)

```ts
check(req: { surface, phase, text, sourceKind, file?, task? })
  -> { decisions: Decision[], jevCalls: number, total: number, errors: string[] }
Decision = { ruleId, band, probability, decidedBy, sourceKind, span, correction, capped }
ActionCall = { kind: "abort+inject"|"block"|"isError"|"notice"|"silent", text, deliverAs? }
```

## THE FIRST THREE COMMANDS

```bash
bunx tsc --noEmit -p tsconfig.json       # exit 0 — the seam is intact
bun test -t source_kind_gate             # B-1's gate
grep -rc "bandOf\|confidence" src/ | grep -v ':0' || echo "I1 HOLDS"
```

## THE STOP

```
ALL of: the 8 success criteria green with their output quoted · every wave's gate met in order ·
the invariant grep reads empty · the seam unchanged · the ledger rows present · the docs updated.
Anything less is OPEN.
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
