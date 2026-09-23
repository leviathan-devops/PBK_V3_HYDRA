# EVIDENCE_STATE — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23 · every line below is a tool result from this session or a named PENDING gate.

## THE MEASURED BASIS (the failures this package closes)

```
G-1  abide has NO streaming hook
     $ grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts | wc -l
     0                                    ★ VERIFIED THIS SESSION
     abide's hooks are ALL boundary: hooks.ts:21 (SessionStart) · :29 (UserPromptSubmit) ·
     :81 (PostToolUse) · :105 (Stop). NONE sees the reasoning stream.

G-2  no source-kind gate exists anywhere
     nothing asks "is this the agent's own utterance, or a quotation / a table / a rule file?"
     -> the 27-FP class. The existing lib.ts:79 classifySource is the seed; it is not
        wiredto any engine.                    ★ VERIFIED (the file was
          read)

G-3  the tool_call channel is not wired to an engine
     the existing extension blocks INLINE (index.ts:129-140); no engine call.
                                                ★VERIFIED (the file was
                                                  read)

G-4  the phase -> action mapping is implicit
     abort+inject (prose) and {block} (tool) were conflated in one handler.
                                                ★VERIFIED (index.ts was
                                                  read)

G-5  no OMP adapter exists
     abide ships claude/codex/opencode (hosts.ts:12,14,16). OMP is a 4th host.
                                                ★VERIFIED (hosts.ts was
                                                  read)

G-6  the OMP event ORDER is unmeasured
     does tool_call precede the text_delta?     UNMEASURED — B-2 observes it.
```

## THE PROOF CHAIN (W0 green; B-1..B-4 PENDING)

```
W0  THE SEAM
    $ bunx tsc --noEmit -p tsconfig.json
    exit 0                               ★ VERIFIED
    $ sha256sum SEAM/seam.ts | cut -c1-32
    66b66a7f10c7c6e737a491b6e0f63903                              ★ VERIFIED
    the seam is SELF-CONTAINED           ★ VERIFIED — grep 'from "' -> 0

B-1  $ bun test -t source_kind_gate -> 0 FP + 5/5 controls      PENDING
B-2  $ bun test -t abort_dispatch -> 2 abort, 3 silent          PENDING
B-2  $ bun test -t delta_accumulator -> a split line assembles  PENDING
B-2  $ bun test -t abort_dedupe -> the same signature ONCE      PENDING
B-3  $ bun test -t action_map -> the 4 rows correct             PENDING
B-4  $ grep -c "bandOf\|confidence" src/ -> 0                   PENDING
```

## THE INVARIANT EVIDENCE

```
I1  DESK B NEVER COMPUTES A BAND
    the proof: grep -rc "bandOf\|confidence" src/ | grep -v ':0'  ->  (empty)
    STATUS: PENDING (src/ does not exist yet). The gate is defined; it has not run.

I3  THE GATE IS PURE
    the proof: grep -c "ctx\|pi\." src/gate/  ->  0
    STATUS: PENDING. The gate must not touch a host; only the surfaces do.
```

## THE VERIFICATION STATUS OF EVERY CLAIM (the anti-embellishment table)

| the claim | the status | the evidence |
|---|---|---|
| the seam type-checks | **VERIFIED** | `bunx tsc --noEmit -p tsconfig.json` → exit 0 |
| abide has NO streaming hook | **VERIFIED** | `grep -rn "delta\|text_delta" … \| wc -l` → 0 |
| abide's 4 hooks are boundary events | **VERIFIED** | hooks.ts:21,29,81,105 |
| the opencode plugin binds 2 hooks | **VERIFIED** | abide.mjs:115, :169 |
| the existing gate is real | **VERIFIED** | lib.ts:79 classifySource · :282 isQuotedMatch |
| the existing suite is green | **VERIFIED** | `bun test .` → 5 pass / 0 fail |
| TTSR is the empty hook | **VERIFIED** | `omp ttsr list \| grep -c native` → 0 |
| the abort chain reaches agent.abort() | **VERIFIED** | the 5 hops, each read |
| the streaming interrupt FIRES live | **PARTIAL** | one container observation (the agent's own words) |
| the gate suppresses 5 FP controls | **PENDING** | B-1's gate |
| 2 positives abort / 3 negatives silent | **PENDING** | B-2's gate |
| the surfaces load in a container | **PENDING** | B-4 + the integration |
| the precision on real data | **UNKNOWN** | no corpus sweep |

**THE RULE:** a claim in PENDING/PARTIAL/UNKNOWN presented as VERIFIED is the fraud this table exists
to prevent. The streaming interrupt's "PARTIAL" is honest: ONE observation is an existence proof, not
a reliability proof.

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
