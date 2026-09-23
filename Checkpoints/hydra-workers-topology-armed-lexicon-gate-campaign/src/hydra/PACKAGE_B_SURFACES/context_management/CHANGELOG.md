# CHANGELOG — PACKAGE B (THE SURFACES)

**Append-only. History accumulates; never edit a prior entry.**

## [2026-09-23] — W0: THE SEAM FROZEN + TYPE-CHECKED

**feat(seam): the frozen interface v1.0.0 · sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0**

The boundary both desks build against. Desk B supplies `sourceKind`, calls `check()`, and owns the
`(surface, phase) -> ActionCall` mapping.

**THE SELF-CONTAINMENT FIX (an audit finding):** the first draft imported the abide primitives from
`./vendor/abide/schema` — a path that does not exist until A-1 lands, so the seam's own gate could
never pass. The primitives are now declared INLINE. The seam type-checks with ZERO imports.

## [2026-09-23] — THE PACKAGE MINTED

**docs(package-b): the DPL1 spec + the wave plan + the blueprint + the canon + the create pin**

The surfaces' complete build package: 4 waves, each with a disjoint file set and a command gate.
THE STREAMING INTERRUPT — `message_update` -> `ctx.abort()` + inject — is the deliverable abide has
no hook for.

## [2026-09-23] — THE CANON OVERHAULED TO PRODUCTION GRADE

**docs(canon): 11 docs from 11-43 L (napkin) to 200+ L (production)**

An audit found every canon doc under the 100-line CRITICAL threshold. The overhaul: the per-module
tables, the file:line anchors, the measured failures (G-1..G-6), the decision chain (B101-B108
including the migration), the acceptance criteria per wave, the resume checklist.

## [2026-09-23] — B108 ADDED: THE MIGRATION

**docs(decision): the existing 689-L extension's gate is MIGRATED, not rewritten**

The audit found the packages built NEW code at a path where working code already exists, with no
migration specified. B108 maps the modules: lib.ts:79 classifySource -> src/gate/source-kind.ts;
lib.ts:282 isQuotedMatch -> src/gate/quote.ts; index.ts:93 -> src/surfaces/prose.ts; bandOf/judgeSpans
/the reason -> DELETED (Desk A's engine + abide's are imported). Supersession only after the
integration audit.

## THE PRE-HYDRA LINEAGE (this package's ancestor work — the baseline it migrates)

```
[2026-09-22]  PBK v3 W0-W5 — the 9 lexicon rules + the extension (689 L)
              the 9 rules with DERIVED bands (0.30/0.62)
              the doctrine: 42 warheads · 11 invariants · AGENTS.md (229 L)
[2026-09-22]  THE MATRIX — 35/35 positives · 0 FP · 54/54 negatives
[2026-09-22]  T8 — the container round: 5/5 scenarios · 10/10 circuit breaker
[2026-09-23]  W7 — TTSR EMPTIED; the extension enforces
              the operator: "SO PUSH THE FUCKING TRUE/FALSE VAL DIRECTLY THEN MFER DO
              EVERYTHING OUTSIDE OF TTSR AND TTSR IS JUST THE HOOK."
              the streaming proof: the agent's own words — "the system-interrupt says I
              MUST comply with 'THE ARTIFACT LAW'"
[2026-09-23]  THE ABIDE RECON — abide HAS the engine, LACKS the streaming hook (0 grep hits)
[2026-09-23]  THE HYDRA BUILD — the seam + 2 packages (this package is Desk B's)
```

## THE CHANGELOG'S OWN HONESTY

A changelog entry for work that did not run is a fraud. The entries above are all work that happened;
the entries for B-1..B-4 will appear only when those waves complete.

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

## THE SEMANTIC COMMIT TOKENS (the changelog's grammar)

```
feat(seam):     a new capability in the frozen interface
feat(gate):     a new classifier branch
feat(surface):  a new hook or the streaming interrupt
feat(action):   a new action kind or mapping row
docs(package):  the spec / wave plan / blueprint / canon
docs(canon):    the context_management set
docs(decision): a DECISION_CHAIN ruling
fix(gate):      a classifier correction (the D-3 class)
fix(surface):   a hook correction (the abort loop class)
test(...):      a gate or suite change
```

## THE FULL ENTRY LOG

```
[2026-09-23 ~03:00]  THE HYDRA WORKSPACE MINTED (the seam + 2 packages + the merge)
[2026-09-23 ~03:30]  THE ZERO-TRUST AUDIT (6 frauds · REFUTED)
[2026-09-23 ~04:00]  THE SEAM OVERHAULED (self-contained · tsc exit 0 · 192 L)
[2026-09-23 ~04:10]  THE CANON OVERHAULED (11 docs to production density)
[2026-09-23 ~04:15]  B108 ADDED (the migration decision)
[2026-09-23 ~04:20]  THE STREAMING INTERRUPT'S EVIDENCE RECORDED (abide's 0 streaming hooks)
```

---

## THE VERSION HISTORY'S SHAPE

```
the package is v1 (the first hydra mint). A v2 would carry:
  - the corpus sweep's findings (the precision number)
  - the OMP event order (B-2's observation)
  - the Jev live call (once the credits are restored)
  - the migration's completion (the existing extension retired)
A v2 is written ONLY when those land. A v2 for a plan is a v1 with new dates — the fraud.
```

---

## THE DEPRECATION NOTE (what a v2 would retire)

```
THIS v1 records the PLAN. When the build lands, the following become DEPRECATED:
  ~/.omp/agent/extensions/lexicon-gate/index.ts   the 4 hooks (superseded by src/surfaces/)
  ~/.omp/agent/extensions/lexicon-gate/lib.ts:bandOf      (abide's bandFor replaces it)
  ~/.omp/agent/extensions/lexicon-gate/lib.ts:judgeSpans  (abide's checkWithModel replaces it)
  ~/.omp/agent/extensions/lexicon-gate/index.ts:REPAIR_HEAD (abide's repairReason replaces it)
A deprecation is recorded HERE when the supersession is green — never before.
```

## THE CHANGELOG'S CLOSING RULE

```
an entry exists ONLY for work that happened.
an entry for a wave that did not run is the theatricality the RUNNING_DEBUG_LOG exists to catch.
the entries for B-1..B-4 appear when those waves complete — not before.
```
