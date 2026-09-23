# COMPACTION_SURVIVAL — PACKAGE B (THE SURFACES)

**The resume point. Read after CURRENT_STATE + NEXT_STEPS.**

## THE READ ORDER

```
1  CURRENT_STATE.md      the state + the per-module table + the gates
2  NEXT_STEPS.md         the entry + the 4 waves + the migration + the risks
3  DECISION_CHAIN.md     B101-B108
4  EVIDENCE_STATE.md     G-1..G-6 (VERIFIED) + the proof chain (W0 green, B-1..B-4 PENDING)
5  BUILD_STATE.md        the shas + the module inventory + the rebuild recipe
```

## THE SURVIVAL FACTS

```
S1  THE SEAM IS FROZEN AND TYPE-CHECKS. sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0.
    Desk A builds against it too. A change invalidates BOTH packages.
S2  THE SURFACES ARE UNBUILT. This package is the plan.
S3  THE INVARIANT I1: grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> empty.
S4  THE DIFFERENTIATOR: the streaming interrupt — abide has 0 streaming hooks (measured).
S5  THE 8 SUCCESS CRITERIA are in the spec's §6.
S6  THE MIGRATION (B108): the existing gate's modules move; the duplicated half is deleted.
S7  THE SEAM IS SELF-CONTAINED (zero imports) — it type-checks BEFORE any vendor lands.
S8  THE D-3 DEFECT is the sharpest trap: the quote check on tool_call STOPS THE BLOCK.
```

## THE SURVIVAL CHECKLIST (tick each after a compaction)

```
[ ] the seam is intact:        bunx tsc --noEmit -p tsconfig.json -> exit 0
[ ] the seam's sha matches:    sha256sum SEAM/seam.ts -> 66b66a7f10c7c6e737a491b6e0f63903
[ ] the gate exists:           ls src/gate/
[ ] the surfaces exist:        ls src/surfaces/
[ ] the action exists:         ls src/action/
[ ] the entry exists:          grep -c 'export default' src/index.ts
[ ] the invariant holds:       grep -rc "bandOf\|confidence" src/ | grep -v ':0' -> empty
[ ] the existing ext is intact: cd ~/.omp/agent/extensions/lexicon-gate && bun test .
[ ] the hooks are registered:  grep -c 'pi.on(' src/index.ts   # >= 4
```

## THE RECOVERY DECISION TREE

```
the seam fails tsc?
  -> the file was edited (it is FROZEN). Restore from the checkpoint or re-derive from this doc.
src/gate/ is absent?
  -> B-1 has not run. The seed is ~/.omp/agent/extensions/lexicon-gate/lib.ts:79, :282.
src/surfaces/ is absent?
  -> B-2 has not run. The seed is index.ts:93. Read the spec's §2.3 for the delta accumulator.
a test fails?
  -> the FIRST failing test names the wave. Read its gate in the wave plan.
the invariant grep returns a hit?
  -> a band leaked into Desk B. Remove it; the band is Desk A's.
the block stops firing?
  -> THE D-3 DEFECT. Check whether the quote check is applied to tool_call (it must NOT be).
```

## THE PACKAGE'S OWN LAWS (restated for the resume)

```
LAW 1  the seam is the only serial artifact — report a change, never edit
LAW 2  Desk B computes no band (I1)
LAW 3  the phase determines the action, and Desk B owns the mapping
LAW 4  the quote check is PROSE-ONLY (the D-3 defect)
LAW 5  the abort is deduped by signature
LAW 6  nothing is deleted — abort + inject
LAW 7  the gate is pure; only the surfaces touch ctx/pi
LAW 8  the existing gate migrates (B108), never rewritten
LAW 9  a fixture is labelled FIXTURE; the corpus sweep is the only live rate
LAW 10 the engine's absence is a seam-shaped stub, never a second implementation
```

## THE FILE INVENTORY (what a resumed agent must locate)

```
PBK_V3_HYDRA/
  SEAM/seam.ts                        192 L · the frozen interface · sha 66b66a7f10c7c6e737a491b6e0f63903
  SEAM/SEAM_CONTRACT.md               the boundary doc
  PACKAGE_B_SURFACES/                 THIS package
    PACKAGE_B_DPL1_SPEC.md            259 L · the contract
    PACKAGE_B_WAVE_PLAN.md            100 L · WAVES: 4
    PACKAGE_B_MASTER_BLUEPRINT.md     112 L · the design authority
    PACKAGE_B_CREATE_PROMPT.md        113 L · the /create pin
    context_management/               11 docs (this set)
  PACKAGE_A_ENGINE/                   Desk A's package (the sibling)
  MERGE/THE_MERGE.md                  the integrator (one import)

~/.omp/agent/extensions/lexicon-gate/ 689 L — the migration baseline (the gate to inherit)
/tmp/abide-repo/                      abide (the engine Desk B calls; NO streaming hook)
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
