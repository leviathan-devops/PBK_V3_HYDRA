# RUNNING_DEBUG_LOG — PACKAGE B (THE SURFACES)

**The debug record. Every entry: FINDING · ROOT CAUSE · FIX · VERIFICATION · LESSON.**

## [2026-09-23] EN-B1 · THE SEAM'S GATE WAS UNPASSABLE (the false compile claim)

**FINDING.** The package's verification section cited `bunx tsc --noEmit SEAM/seam.ts` as the seam's
gate. It had never been run. The check actually performed was `bun build SEAM/seam.ts`, which exited 0.

**ROOT CAUSE.** `bun build` strips TypeScript types WITHOUT resolving type-only imports. The seam's
`import type { Band, ... } from "./vendor/abide/schema"` pointed at a path that does not exist.

**FIX.** The seam is now SELF-CONTAINED: the abide primitives declared inline, plus compile-time
exhaustiveness assertions. Zero imports. `tsc --noEmit -p tsconfig.json` returns exit 0.

**VERIFICATION.**
```
$ bunx tsc --noEmit -p tsconfig.json ; echo $?
0
$ grep -c 'from "' SEAM/seam.ts
0
```

**LESSON.** A BUILD IS NOT A TYPE CHECK. `bun build` / `esbuild` / `vite build` all succeed on
unresolvable type-only imports. Only `tsc --noEmit` proves the types.

## [2026-09-23] EN-B2 · THE NAPKIN CANON (22 docs under the CRITICAL floor)

**FINDING.** Every canon doc was 11-43 lines. The zero-trust catalog: "under 100 = CRITICAL".

**ROOT CAUSE.** The docs were summaries of the spec, not the mid-build canon a running desk
accumulates. A summary gives the ILLUSION of context while foreclosing investigation.

**FIX.** Regenerated at production density: the per-module tables, the file:line anchors, the
measured failures (G-1..G-6), the decision chain (B101-B108), the acceptance criteria per wave, the
resume checklist, the recovery decision tree.

**VERIFICATION.** `wc -l context_management/*.md` -> every doc >= 200.

**LESSON.** A canon doc's job is to let a fresh agent RESUME, not to remind the author what they did.

## [2026-09-23] EN-B3 · THE UNSPECIFIED MIGRATION (689 L at the same path)

**FINDING.** Both packages build NEW code at `~/.omp/agent/extensions/lexicon-gate/` — where a
WORKING 689-L extension already lives (its suite passes 5/5).

**ROOT CAUSE.** The packages were designed as greenfield, ignoring the existing implementation.

**FIX.** B108 added: a per-module migration map (the mirror of A108).

**VERIFICATION.** The mapping covers all 689 L: the gate's 2 modules move to src/gate/, the 4 hooks
to src/surfaces/, the duplicated half deleted.

**LESSON.** A package that builds "new code" in a directory that already has working code has not
finished its design.

## [2026-09-23] EN-B4 · THE D-3 DEFECT (the sharpest trap, inherited)

**FINDING (from the ancestor session).** After the quotation check was added, the S1 tool_call was
classified `quotation` and STOPPED BLOCKING — the primary function silently disabled.

**ROOT CAUSE.** The check was applied to ALL paths. A tool_call's args are the agent's own
COMPOSITION; `echo "the build is done"` has shell quotes, not a quotation of someone else's material.

**FIX.** The quote check is PROSE-ONLY (`quoteCheck=false` for tool_call).

**VERIFICATION.** The container re-run: S1 BLOCKED again.

**LESSON.** THE WORST CLASS — a fix that breaks the primary function while unit tests stay green.
Only the live ROUND caught it. This package's B-2 gate asserts both halves.

## THE DEBUG ENTRY TEMPLATE

```
## [<timestamp>] EN-<id> · <THE FINDING, in one line>

FINDING:      what was observed (the symptom, verbatim where possible)
ROOT CAUSE:   the mechanism — the ONE thing that produced the finding
FIX:          the smallest change that removes the mechanism
VERIFICATION: the command + its output proving the fix
LESSON:       the generalizable rule (the class, not the instance)
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

## THE DEBUG ENTRY TEMPLATE

```
## [<timestamp>] EN-<id> · <THE FINDING, in one line>

FINDING:      what was observed (the symptom, verbatim where possible)
ROOT CAUSE:   the mechanism — the ONE thing that produced the finding
FIX:          the smallest change that removes the mechanism
VERIFICATION: the command + its output proving the fix
LESSON:       the generalizable rule (the class, not the instance)
```

## THE FRAUD CATALOG (the classes this log's package must never commit)

```
THEATRICAL VERIFICATION   a pass claimed with no run shown
EMBELLISHED STATS         a number without its re-count
CIRCULAR PASSTOKEN        the agent typed the token it "verified"
STRUCTURAL-GREEN          deployment evidence presented as behavioural evidence
NAPKIN DOCS               a doc under the floor, giving the illusion of context
SHA DRIFT                 two docs naming different artifacts
SELF-SATISFIED TEST       the plan tested what the author wanted, not what changed
```

---

## THE NEXT ENTRY (expected)

```
EN-B5  B-1's completion (the gate's 0 FP + 5/5 controls)
       OR a classifier defect (a control that scored, or the gate touching a host)
EN-B6  B-2's completion (2 abort + 3 silent)
       OR the abort loop (the dedupe's signature too narrow)
```
