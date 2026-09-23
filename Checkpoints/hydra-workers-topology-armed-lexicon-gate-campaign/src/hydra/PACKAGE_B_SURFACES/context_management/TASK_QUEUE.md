# TASK_QUEUE — PACKAGE B (THE SURFACES)

**As of:** 2026-09-23

```
[DONE]     W0   THE SEAM FROZEN + TYPE-CHECKED
                SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0
                the seam is self-contained (zero imports)

[DONE]     --   THE PACKAGE MINTED
                the spec (259 L) · the wave plan (100 L) · the blueprint (112 L) ·
                the create prompt (113 L) · the canon (11 docs)

[READY]    B-1  THE GATE
                the files: src/gate/{source-kind,quote}.ts
                the seed:  the existing lib.ts:79, :282
                the gate:  bun test -t source_kind_gate -> 0 FP + 5/5 controls

[BLOCKED-B-1] B-2  THE SURFACES
                the files: src/surfaces/{prose,stream,tool}.ts
                ★THE STREAMING INTERRUPT (message_update -> ctx.abort() +
                  inject)
                the gate:  2 positives abort, 3 negatives silent · the delta assembles ·
                           the dedupe holds · grep bandOf -> 0

[BLOCKED-B-2] B-3  THE ACTION
                the files: src/action/dispatch.ts
                the gate:  the 4-row mapping snapshot

[BLOCKED-B-3] B-4  THE ENTRY
                the files: src/index.ts · src/surfaces/*.test.ts
                the gate:  tsc exit 0 · bun test 0 fail · grep bandOf -> 0

[QUEUED]   --   THE MIGRATION (B108)
                the existing gate's modules move; the duplicated half is deleted
                TRIGGER: both desks land + the integration audit green

[QUEUED]   --   THE MERGE (MERGE/THE_MERGE.md)
                one import: Desk A's check() into B's dispatch

[QUEUED]   --   THE CORPUS SWEEP (the integration tier)
                a real transcript · every firing hand-adjudicated · THE precision number
```

## THE ACCEPTANCE CRITERIA (what DONE means per wave — the exact assertion)

```
B-1 · THE GATE
  DONE = `bun test -t source_kind_gate` prints "TOTAL FALSE POSITIVES: 0" AND "CONTROL: 5/5 fired"
       AND the 5 FP controls (a heading · a table row · a backtick bullet · a blockquote · a
           fenced block) are ALL non-scorable
       AND `grep -c "ctx\|pi\." src/gate/` is 0   (the gate is pure)
  NOT DONE = a control is scorable, or the gate touches a host

B-2 · THE SURFACES
  DONE = `bun test -t abort_dispatch` shows 2 positives aborting and 3 negatives silent
       AND `bun test -t delta_accumulator` shows a split-across-deltas line assembling
       AND `bun test -t abort_dedupe` shows the same signature aborting ONCE
       AND `grep -rc "bandOf\|confidence" src/ | grep -v ':0'` is EMPTY
  NOT DONE = a band computed in Desk B (invariant I1 broken), or an abort loop

B-3 · THE ACTION
  DONE = the 4 rows each produce the right `kind`
         (prose -> abort+inject · tool-call -> block · tool-result -> isError ·
          post-tool-use -> block)
       AND a snapshot per row exists (the kind + the text)
  NOT DONE = the rows conflated (the G-4 defect)

B-4 · THE ENTRY
  DONE = `bunx tsc --noEmit` exits 0 AND `bun test` is 0 fail
       AND the extension's default export registers the 4 hooks
       AND `grep -rc "bandOf\|confidence" src/ | grep -v ':0'` is EMPTY
  NOT DONE = a hook missing, or the invariant broken
```

## THE DEPENDENCY GRAPH

```
        W0 (the seam, FROZEN)
              |
              +-------------------+
              v                   v
          DESK B              DESK A
              |                   |
           B-1 gate            A-1 vendor
              |                   |
           B-2 surfaces        A-2 lexicon
              |                   |
           B-3 action          A-3 lint+ledger
              |                   |
           B-4 entry           A-4 surface
              |                   |
              +---------+---------+
                        v
                  W2 THE MERGE (one import)
                        v
                  W3 THE INTEGRATION (6 steps)
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

## THE PER-WAVE FILE PLAN (the exact targets)

```
B-1  src/gate/source-kind.ts      the 8-branch classifier
     src/gate/quote.ts            the quote-state machine (the D-3 fix's home)
     the seed: ~/.omp/agent/extensions/lexicon-gate/lib.ts:79, :282

B-2  src/surfaces/prose.ts        pi.on("message_update", (event, ctx) => ...)
     src/surfaces/stream.ts       the delta accumulator + lastAbort
     src/surfaces/tool.ts         pi.on("tool_call") + pi.on("tool_result")
     the seed: ~/.omp/agent/extensions/lexicon-gate/index.ts:93

B-3  src/action/dispatch.ts       the (surface, phase) -> ActionCall map

B-4  src/index.ts                 export default function (pi) { ... }
     src/surfaces/prose.test.ts   the harness: 2 abort, 3 silent
```

## THE GATE TABLE

| wave | the gate command | the expected | the status |
|---|---|---|---|
| W0 | `bunx tsc --noEmit -p tsconfig.json` | exit 0 | **PASS** |
| B-1 | `bun test -t source_kind_gate` | 0 FP + 5/5 controls | PENDING |
| B-2 | `bun test -t abort_dispatch` | 2 abort, 3 silent | PENDING |
| B-2 | `bun test -t delta_accumulator` | a split line assembles | PENDING |
| B-2 | `bun test -t abort_dedupe` | one abort per signature | PENDING |
| B-3 | `bun test -t action_map` | the 4 rows correct | PENDING |
| B-4 | `grep -rc "bandOf\\|confidence" src/` | empty | PENDING |
| W2 | `bunx tsc --noEmit` (combined) | exit 0 | BLOCKED on A+B |
| W3 | the 6-step integration audit | all green | BLOCKED on W2 |
