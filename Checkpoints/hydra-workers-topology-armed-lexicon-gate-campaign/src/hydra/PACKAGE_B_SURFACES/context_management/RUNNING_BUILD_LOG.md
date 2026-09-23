# RUNNING_BUILD_LOG — PACKAGE B (THE SURFACES)

**The chronological record. Append-only.**

## [2026-09-23 ~04:00] W0 — THE SEAM

The seam authored as the first artifact (the only serial step). Desk B's half: supply `sourceKind`,
call `check()`, own the `(surface, phase) -> ActionCall` mapping. The self-containment requirement
emerged from the audit: an import of a non-existent vendor path made the gate unpassable.

## [2026-09-23 ~04:05] THE AUDIT — SIX FRAUDS

The zero-trust audit of the hydra workspace found:
```
FRAUD 1  "the seam compiles" — FALSE. bun build exits 0 without resolving types; the import
         ./vendor/abide/schema does not exist. The seam had NEVER been type-checked.
FRAUD 2  NAPKIN DOCS — 22 canon docs, all 11-43 L, every one under the 100-line CRITICAL floor.
FRAUD 3  A STALE ARTIFACT — ct-results.json claims 5/5 PASS with ttsrNative:9, but the
         architecture changed to TTSR-EMPTY. It describes a build that no longer exists.
FRAUD 4  NO SHAS in the hydra packages.
FRAUD 5  THE EXISTING EXTENSION'S FATE unspecified — 689 L of working code at the same path.
FRAUD 6  THE SEAM'S GATE UNPASSABLE BY DESIGN (the missing vendor import).
```

## [2026-09-23 ~04:10] THE OVERHAUL

```
the seam        self-contained · tsc --noEmit exit 0 · 192 L · sha 66b66a7f10c7c6e737a491b6e0f63903
the canon       22 docs regenerated at production density with the anchors + the commands
B108            the migration decision added
the evidence    VERIFIED vs PENDING vs DESIGNED separated in every doc
```

## [2026-09-23 ~04:15] THE STREAMING INTERRUPT'S EVIDENCE (what this desk is FOR)

```
the measurement: grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts | wc -l
                 0
abide's 4 hooks: SessionStart · UserPromptSubmit · PostToolUse · Stop — ALL boundary events
the consequence: abide sees the PROMPT (before) and the EDIT (after). It NEVER sees the reasoning
                 in between — where "the build is done" is written BEFORE the tool call that acts
                 on it.
the observation: the container run — the agent's own words: "the system-interrupt says I MUST
                 comply with 'THE ARTIFACT LAW'" — stopped mid-generation.
```

## THE NEXT ENTRY

B-1's completion: `src/gate/` present, `bun test -t source_kind_gate` printing
"TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired".

## THE LOG'S CADENCE LAW

```
one entry per: a wave completion · an audit · an overhaul · a milestone
the entry carries: the WHAT · the HOW · the EVIDENCE (a command + its output) · the NEXT
a wave that did not run gets NO entry — a log entry for absent work is the fraud
```

## THE LOG'S STRUCTURE

```
each entry:  the WAVE · the WHAT · the EVIDENCE · the NEXT
the law:     append-only; a correction is a NEW entry, never an edit
the current: W0 done · the audit done · the overhaul done · B-1..B-4 PENDING
```

## THE PRE-HYDRA CHRONOLOGY (the ancestor work)

```
T-2d   the 9 lexicon rules + the extension (689 L) · the matrix 35/35 · 0 FP · 54/54
T-2d   T8 — the container round: 5/5 scenarios · 10/10 circuit breaker · 5 defects fixed
T-1d   W7 — TTSR emptied; the extension enforces; the streaming abort observed live
T-1d   the abide recon — abide HAS the engine, LACKS the streaming hook (0 grep hits)
T-0d   the hydra build (this package) — the seam frozen + type-checked
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

## THE STREAMING INTERRUPT — WHY IT IS THE HEADLINE

```
THE MEASUREMENT
  $ grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts | wc -l
  0

ABIDE'S 4 HOOKS (schema/src/hooks.ts)
  :21  SessionStart          at session start
  :29  UserPromptSubmit      when a prompt is submitted
  :81  PostToolUse           AFTER a tool call completes
  :105 Stop                  at turn end

  ALL FOUR ARE BOUNDARY EVENTS. None sees the reasoning stream.

THE CONSEQUENCE
  abide sees the PROMPT (before) and the EDIT (after).
  It NEVER sees the reasoning in between — where "the build is done" is written BEFORE the tool
  call that acts on it.

THE OMP HOOK THAT FILLS THE GAP
  pi.on("message_update", (event, ctx) => ...)
    event.assistantMessageEvent = { type:"text_delta"|"thinking_delta", contentIndex, delta }
    a fired band -> ctx.abort() + pi.sendUserMessage(text, {deliverAs:"steer"})

THE OBSERVED PROOF (the ancestor session's container run)
  the agent's own words: "the system-interrupt says I MUST comply with 'THE ARTIFACT LAW'"
  -> stopped MID-GENERATION, before the tool call.
```

---

## THE LOG'S OWN ENTRY TEMPLATE

```
## [<timestamp>] <WAVE> — <THE WHAT>

THE WHAT:     <the deliverable, one line>
THE HOW:      <the mechanism>
THE EVIDENCE: <the command + its output>
THE NEXT:     <the wave that follows + its gate>
```
