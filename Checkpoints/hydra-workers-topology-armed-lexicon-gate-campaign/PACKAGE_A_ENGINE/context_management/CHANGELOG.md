# CHANGELOG — PACKAGE A (THE ENGINE)

**Append-only. History accumulates; never edit a prior entry.**

## [2026-09-23] — W0: THE SEAM FROZEN + TYPE-CHECKED

**feat(seam): the frozen interface v1.0.0 · sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0**

The boundary both desks build against. `check(req: CheckRequest) -> Promise<CheckResult>`; the
`Decision` row; the `ActionCall`; the `LedgerRow`. The three invariants: I1 (Desk B never computes
a band), I2 (Desk A never touches a host), I3 (the phase determines the action).

**THE SELF-CONTAINMENT FIX (an audit finding):** the first draft imported the abide primitives from
`./vendor/abide/schema` — a path that does not exist until A-1 lands, so the seam's own gate could
never pass. The primitives (`Band` · `CheckPhase` · `Thresholds` · `Verdict` · `Rule`) are now
declared INLINE, plus compile-time exhaustiveness assertions. The seam type-checks with ZERO
imports; A-1's vendored schema must satisfy these shapes or report the mismatch.

## [2026-09-23] — THE PACKAGE MINTED

**docs(package-a): the DPL1 spec + the wave plan + the blueprint + the canon + the create pin**

The engine's complete build package: 4 waves, each with a disjoint file set and a command gate.
The anti-patterns name the 929-L re-implementation explicitly.

## [2026-09-23] — THE CANON OVERHAULED TO PRODUCTION GRADE

**docs(canon): 11 docs from 11-43 L (napkin) to 200+ L (production)**

An audit found every canon doc under the 100-line CRITICAL threshold. The overhaul: real per-module
tables, the file:line anchors, the measured failures (F-1..F-8), the decision chain (A101-A108
including the migration), the risk register, the resume sequence.

## [2026-09-23] — A108 ADDED: THE MIGRATION

**docs(decision): the existing 689-L extension is MIGRATED, not deleted**

The audit found the packages built NEW code at a path where working code already exists, with no
migration specified. A108 maps every module: classifySource/isQuotedMatch -> Desk B's gate;
scoreSignals/confidence -> Desk A's lexicon; the 4 hooks -> Desk B's surfaces; bandOf/judgeSpans/
the reason -> DELETED (abide's are imported). Supersession only after the integration audit.

---

## THE FULL ENTRY LOG (append-only — never edit a prior entry)

```
[2026-09-23 ~03:00]  THE HYDRA WORKSPACE MINTED
                     the seam (W0) + 2 packages + the merge plan
[2026-09-23 ~03:30]  THE ZERO-TRUST AUDIT
                     6 frauds found; the verdict REFUTED
[2026-09-23 ~04:00]  THE SEAM OVERHAULED
                     self-contained · tsc exit 0 · 192 L · sha __SHA__
[2026-09-23 ~04:10]  THE CANON OVERHAULED
                     11 docs from 11-43 L to 200+ L
[2026-09-23 ~04:15]  A108 ADDED
                     the migration decision for the existing 689-L extension
```

## THE SEMANTIC COMMIT TOKENS (the changelog's grammar)

```
feat(seam):     a new capability in the frozen interface
docs(package):  the spec / wave plan / blueprint / canon
docs(canon):    the context_management set
docs(decision): a DECISION_CHAIN ruling
fix(seam):      a correction to the frozen interface (invalidates BOTH packages)
test(...):      a gate or suite change
```

---

## THE COMMANDS (every claim in this package traces to one)

```bash
# ── THE SEAM (W0 — PASSES) ─────────────────────────────────────────────
cd PBK_V3_HYDRA
bunx tsc --noEmit -p tsconfig.json               # exit 0 — the seam type-checks
sha256sum SEAM/seam.ts | cut -c1-32              # 66b66a7f10c7c6e737a491b6e0f63903
grep -c 'from "' SEAM/seam.ts                    # 0 — self-contained

# ── THE ENGINE (Desk A, once built) ────────────────────────────────────
bunx tsc --noEmit                                # exit 0
bun test                                         # 0 fail
bun test -t lexicon_sweep                        # F1=1.000 at the DERIVED band
bun test -t lexicon_zero_hit                     # every body scores 0 against itself
bun test -t lint_runner                          # the known-bad REFUSED
bun test -t ledger_row                           # the row satisfies the seam
grep -rc "ctx\|pi\." src/ | grep -v ':0' || echo "I2 HOLDS: no host reference"
grep -rc 'bandFor' src/lexicon/ | grep -v ':0'   # >= 1 — abide's, imported

# ── THE EXISTING EXTENSION (the migration baseline) ────────────────────
cd ~/.omp/agent/extensions/lexicon-gate && bun test .   # 5 pass / 0 fail
omp ttsr list | grep -c '\[native\]'             # 0 — TTSR is the empty hook
wc -l lib.ts index.ts lib.test.ts                # 307 / 203 / 179 = 689 L

# ── THE ABIDE ANCHORS (the failures this package closes) ───────────────
grep -rn "lexicon" /tmp/abide-repo/packages/ --include=*.ts | wc -l              # 0 (F-1)
grep -rn "own_utterance\|source_kind" /tmp/abide-repo/packages/ | wc -l          # 0 (F-2)
grep -c "Never executed" /tmp/abide-repo/packages/schema/src/rubric.ts           # 1 (F-3)
grep -c 'check.type === "model"' /tmp/abide-repo/packages/cli/src/lib/checkRunner.ts  # 1 (F-4)
grep -rn "delta\|text_delta" /tmp/abide-repo/packages/ --include=*.ts | wc -l    # 0 (G-1)
```

---

--

## THE FILE:LINE ANCHORS (every one read this session — the load-bearing set)

```
THE SEAM + THE BOUNDARY
  SEAM/seam.ts:1-192                  the frozen interface (sha 66b66a7f10c7c6e737a491b6e0f63903)
  SEAM/seam.ts:15                    "── FROZEN INTERFACE ABOVE — DO NOT
    EDIT──"
  SEAM/seam.ts:24-56                  the abide-compatible primitives (declared inline)
  SEAM/seam.ts:58-160                 the seam's own types (SrcKind..LedgerRow)
  SEAM/seam.ts:162-190                the compile-time exhaustiveness assertions
  SEAM/SEAM_CONTRACT.md               the boundary + the 3 invariants

THE OMP RUNTIME (the host the engine never touches)
  .../extensibility/extensions/types.ts:441     abort(): void
  .../extensibility/extensions/types.ts:1122    the handler signature (event, ctx)
  .../extensibility/extensions/types.ts:1287    sendUserMessage(content, opts)
  .../extensibility/extensions/types.ts:641-645 ResourcesDiscoverResult (3 fields)
  .../extensibility/extensions/loader.ts:478    isExtensionFile (.ts | .js)
  .../extensibility/extensions/loader.ts:504-508  the subdir index.ts
  .../extensibility/extensions/loader.ts:562-571  the discovery walk
  .../session/session-manager.ts:327-350        ReadonlySessionManager (the 20-method Pick)
  .../extensibility/shared-events.ts:274-277    TtsrTriggeredEvent (no cancel)
  .../export/ttsr.ts:102-116                    #compileConditions (rule.condition only)
  .../export/ttsr.ts:293-301                    #matchesCondition -> boolean
  .../session/agent-session.ts:5518             abort: () => void this.abort()
  .../session/agent-session.ts:8372             abort: () => this.agent.abort()
  packages/ai/src/types.ts:1223,1226            the text_delta / thinking_delta shapes

ABIDE (the vendored engine)
  cli/src/lib/band.ts:17-58            violationProbability
  cli/src/lib/band.ts:56-57            bandFor(p, thresholds)
  schema/src/rubric.ts:179             DEFAULT_THRESHOLDS = { act: 0.8, flag: 0.5 }
  schema/src/rubric.ts:74-87           lintCheckSchema (the pattern)
  schema/src/rubric.ts:79-80           "A grep-shaped hint... Never executed."
  schema/src/rubric.ts:89-93           modelCheckSchema
  schema/src/rubric.ts:105-118         checkSchema (the union)
  cli/src/lib/checkRunner.ts:24-25     the model-only dispatch
  cli/src/lib/jev.ts:203-215           the Jev split (probability -> band)
  cli/src/lib/reason.ts:18-40          repairReason
  cli/src/lib/reason.ts:41-46          flagNotice
  cli/src/hooks/postToolUse.ts:163-167 the {kind:"block", reason} return
  cli/src/lib/paths.ts:9-15            the .abide paths

THE EXISTING EXTENSION (the migration baseline)
  ~/.omp/agent/extensions/lexicon-gate/lib.ts      307 L (classifySource..judgeSpans)
  ~/.omp/agent/extensions/lexicon-gate/index.ts    203 L (the 4 hooks)
  ~/.omp/agent/extensions/lexicon-gate/lib.test.ts 179 L (the 5 selectors)

THE ANTI-PATTERN (the measured cost)
  pbk-v2/src/ext/kernel-judge.ts:53-63     the copied constants
  pbk-v2/src/ext/kernel-judge.ts:271-276   toApiPrimitive('noul') — the invented type
  pbk-v2/src/ext/kernel-judge.ts          929 L — a re-implementation, never ran
```

-

---

## THE PRE-HYDRA LINEAGE (this package's ancestor work — the baseline it migrates)

```
[2026-09-22]  PBK v3 W0-W5 — THE ABORT LAYER (the 9 lexicon rules + the extension)
              omp ttsr list: 27 -> 36 rules · [native] 0 -> 9 · contextMode keep -> discard
              the 9 rules in ~/.omp/agent/rules/ with DERIVED bands (0.30/0.62)
              the lexicon-gate extension (689 L): classifySource · scoreSignals · the 4 hooks
              the doctrine: APPEND_SYSTEM.md 35 -> 42 warheads · RULES.md 9 -> 11
              AGENTS.md created (229 L) · the dist-content gate

[2026-09-22]  THE MATRIX — 35/35 positives · 0 FALSE POSITIVES · 54/54 negatives
              via `omp ttsr test` (the REAL engine matcher)

[2026-09-22]  T8 — THE CONTAINER ROUND: 5/5 scenarios · 10/10 circuit breaker
              D-1..D-5 found and fixed (the tool_result kind · the quote state machine ·
              the quote-check over-application · the denial lookbehind · the (?i) strip)

[2026-09-23]  W7 — THE ARCHITECTURE CHANGE: TTSR EMPTIED, the extension enforces
              the operator's ruling: "SO PUSH THE FUCKING TRUE/FALSE VAL DIRECTLY THEN MFER
              DO EVERYTHING OUTSIDE OF TTSR AND TTSR IS JUST THE HOOK."
              the basis: grep -rn "lexicon" src/export/ttsr.ts -> 0
              the change: the condition: key stripped from all 9 rules -> 0 native
              the wire: ctx.abort() + pi.sendUserMessage(steer)
              the proof: the container-runtime harness — 2 abort+inject, 3 silent

[2026-09-23]  THE ABIDE RECON — the operator: "why are we rebuilding this? doesnt abide
              literally have this fully built already"
              the finding: abide HAS the engine, LACKS the lexicon + the source-kind gate +
              the streaming hook + the OMP adapter + a live lint runner
              THE DECISION: integrate abide; the lexicon becomes the pre-Jev gate

[2026-09-23]  THE HYDRA BUILD — the seam + 2 packages (this package is Desk A's)
```

## THE CHANGELOG'S OWN HONESTY

A changelog entry for work that did not run is a fraud. The entries above are all work that
happened; the entries for A-1..A-4 will appear only when those waves complete.
