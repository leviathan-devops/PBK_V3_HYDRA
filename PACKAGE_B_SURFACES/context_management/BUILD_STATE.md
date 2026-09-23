# BUILD_STATE — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23 · **Wave:** W0 complete · the surfaces UNBUILT

## THE ARTIFACTS + THEIR SHAs

```
SEAM/seam.ts                       192 L · sha256 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0
SEAM/SEAM_CONTRACT.md              the boundary doc
PACKAGE_B_DPL1_SPEC.md             259 L   the contract (G-1..G-6)
PACKAGE_B_WAVE_PLAN.md             100 L   WAVES: 4
PACKAGE_B_MASTER_BLUEPRINT.md      112 L   the design authority
PACKAGE_B_CREATE_PROMPT.md         113 L   the /create pin
context_management/                11 docs (this set)
tsconfig.json                      the seam's type-check config
```

**THE SURFACES' ARTIFACTS (once built — currently ABSENT):**
```
src/gate/{source-kind,quote}.ts      B-1   classifySource + isQuotedMatch + SCORABLE
src/surfaces/{prose,tool,stream}.ts  B-2   the 4 hooks + the delta accumulator + the dedupe
src/action/dispatch.ts               B-3   the (surface, phase) -> ActionCall map
src/index.ts                         B-4   the extension's default export
```

## THE SHA CHAIN

```
the seam (frozen)           66b66a7f10c7c6e737a491b6e0f63903         192 L
the surfaces bundle         PENDING          B-4's build
the existing extension      228d2fc1e06dc0ee (lib.ts — the migration baseline)
the deployed extension      8186c9770bc088bc (the TTSR-carrier build, superseded)
```

**THE RULE:** every artifact's sha appears in this doc. A doc naming an artifact without its sha is
incomplete.

## THE MODULE INVENTORY (the planned shape)

```
┌─────────────────────────┬──────┬─────────────────────────────────────────┐
│ FILE (planned)          │ WAVE │ WHAT IT IS                              │
├─────────────────────────┼──────┼─────────────────────────────────────────┤
│ src/gate/source-kind.ts │ B-1  │ classifySource + SCORABLE               │
│ src/gate/quote.ts       │ B-1  │ isQuotedMatch (the quote-state machine) │
│ src/surfaces/prose.ts   │ B-2  │ message_update -> abort+inject          │
│ src/surfaces/stream.ts  │ B-2  │ the delta accumulator + the dedupe      │
│ src/surfaces/tool.ts    │ B-2  │ tool_call + tool_result + post-tool-use │
│ src/action/dispatch.ts  │ B-3  │ dispatchAction (the 4-row map)          │
│ src/index.ts            │ B-4  │ the extension default export            │
└─────────────────────────┴──────┴─────────────────────────────────────────┘
```

## THE BUILD COMMANDS

```bash
# the seam (W0 — PASSES)
bunx tsc --noEmit -p tsconfig.json

# the surfaces (once built)
bunx tsc --noEmit
bun test
bun test -t source_kind_gate
bun test -t abort_dispatch
grep -rc "bandOf\|confidence" src/ | grep -v ':0' || echo "I1 HOLDS"
```

## THE ENVIRONMENT FACTS (load-bearing, measured)

```
the OMP hook surface      message_update · tool_call · tool_result · ttsr_triggered · agent_end
the delta shape           {type:"text_delta"|"thinking_delta", contentIndex, delta, partial}
ctx.abort()               types.ts:441 -> runner.ts:859 -> :543 -> agent-session.ts:5518 -> :8372
pi.sendUserMessage        types.ts:1287 (content, {deliverAs:"steer"|"followUp"})
the extension loader      extensions/<name>/index.ts (a subdir — ONLY index.ts loads)
                          a *.test.ts in a subdir is NEVER auto-loaded (loader.ts:562-571)
abide's hooks             4, all BOUNDARY: SessionStart · UserPromptSubmit · PostToolUse · Stop
abide's streaming hooks   0 (grep -rn "delta|text_delta" packages/ -> 0)
the seam version          1.0.0 — a change invalidates BOTH packages
```

## THE REBUILD RECIPE (a fresh agent, zero context)

```
1  read ../SEAM/SEAM_CONTRACT.md (the boundary)
2  run bunx tsc --noEmit -p tsconfig.json  -> exit 0 confirms the seam is intact
3  execute B-1 -> B-2 -> B-3 -> B-4, each gate green before the next
4  the surfaces are COMPLETE when the 8 success criteria in the spec are green
5  the merge (MERGE/THE_MERGE.md) wires Desk A's check() into B's dispatch
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

## THE VENDOR'S SOURCE SET (Desk B's dependency: Desk A's vendor)

```
Desk B imports check() from Desk A's engine. It does NOT import abide directly.
THE SEAM TYPES THE BOUNDARY: Desk B supplies `sourceKind`, receives `band` + `decision`.
THE STUB (until Desk A lands): {decisions:[], jevCalls:0, total:0, errors:[]}
THE MERGE: one import replaces the stub.
```

## THE SURFACES' EXACT FILE PLAN

```
src/gate/source-kind.ts    classifySource(line, inFence, fileKind) -> SrcKind
                           SCORABLE: ReadonlySet<SrcKind> = new Set(["own_utterance"])
src/gate/quote.ts          isQuotedMatch(line, match) -> boolean   (a quote-state machine)
src/surfaces/prose.ts      pi.on("message_update", (event, ctx) => ...)  <- THE STREAMING INTERRUPT
src/surfaces/stream.ts     the delta accumulator + the abort dedupe (lastAbort)
src/surfaces/tool.ts       pi.on("tool_call") + pi.on("tool_result") + the post-tool-use shape
src/action/dispatch.ts     dispatchAction(surface, phase, decisions) -> ActionCall | null
src/index.ts               export default function (pi) { ... }  the 4 hooks registered
```

---

## THE BUILD'S ORDERING (why B-1 is alone)

```
B-1 (the gate) is a PREREQUISITE, not a parallel step: B-2's surfaces call classifySource on every
line BEFORE the engine sees it. Without the gate, every line reaches the engine — the 27-FP class.

B-2 -> B-3 -> B-4 are SEQUENTIAL because each builds on the prior's exports:
  B-2 defines the hooks + the accumulator  -> B-3's dispatch consumes the decisions
  B-3 defines the mapping                  -> B-4's entry wires it into the hooks
  B-4 exports the extension                -> the loader discovers it

THE PARALLELISM IS ACROSS DESKS: Desk B's 4 waves run in sequence while Desk A's 4 run in
sequence, CONCURRENTLY. The two chains meet only at the merge (MERGE/THE_MERGE.md).
```
