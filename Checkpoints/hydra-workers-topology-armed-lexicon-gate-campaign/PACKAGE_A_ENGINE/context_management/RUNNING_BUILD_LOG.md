# RUNNING_BUILD_LOG — PACKAGE A (THE ENGINE)

**The chronological record. Append-only.**

## [2026-09-23 ~04:00] W0 — THE SEAM

The seam authored as the first artifact (the only serial step). The design: `check()` as the single
entry point; `Decision` as the row crossing the boundary; the three invariants. The self-containment
requirement emerged from the audit: an import of a non-existent vendor path made the gate unpassable.

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
A108            the migration decision added
the evidence    VERIFIED vs PENDING vs DESIGNED separated in every doc
```

## THE NEXT ENTRY

A-1's completion: `vendor/abide/` present, `bunx tsc --noEmit vendor/abide/index.ts` exit 0,
VENDOR.md carrying a sha per file.

---

## THE BUILD LOG'S STRUCTURE (what each entry carries)

```
each entry:  the WAVE · the WHAT · the EVIDENCE · the NEXT
the cadence: one entry per wave completion, per audit, per overhaul
the law:     append-only; a correction is a NEW entry, never an edit
```

## THE ENTRY TEMPLATE

```
## [<timestamp>] <WAVE> — <THE WHAT>

THE WHAT:     <the deliverable, one line>
THE HOW:      <the mechanism>
THE EVIDENCE: <the command + its output>
THE NEXT:     <the wave that follows + its gate>
```

## THE CURRENT STATE

```
W0  the seam            DONE      tsc exit 0 · sha __SHA__ · 192 L
    the audit           DONE      6 frauds found · REFUTED
    the overhaul        DONE      the seam self-contained · the canon at density · A108
A-1 the vendor          PENDING   bunx tsc --noEmit vendor/abide/index.ts
A-2 the lexicon         PENDING   bun test -t lexicon_sweep -> F1=1.000
A-3 the lint + ledger   PENDING   the known-bad REFUSED
A-4 the surface         PENDING   grep -rc "ctx\|pi\." src/ -> empty
```

## THE LOG'S HONEST NOTE

The waves A-1..A-4 have produced NO log entries because they have produced NO work. A log entry for
a wave that did not run is the theatricality this doc's sibling (RUNNING_DEBUG_LOG) exists to catch.

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

## THE PRE-HYDRA CHRONOLOGY (the ancestor work, in order)

```
T-2d   THE PBK v3 ABORT LAYER
       9 lexicon rules written · the derivation ran 4 iterations · all 9 separable
       the lexicon-gate extension built (689 L) · the 4 selectors green
       the doctrine: +7 warheads · +2 invariants · AGENTS.md created
       contextMode keep -> discard · the dist-content gate
       THE MATRIX: 35/35 positives · 0 FP · 54/54 negatives

T-2d   T8 — THE CONTAINER ROUND
       setup (plan hash fae59694) · deploy (sha c379626c) · restart · the 5 scenarios
       5/5 PASS · 10/10 circuit breaker
       5 defects found and fixed (D-1..D-5)

T-1d   W7 — THE ARCHITECTURE CHANGE
       the operator's critique: TTSR reads no lexicon (0 grep hits)
       the change: condition: stripped -> 0 native; the extension enforces
       the wire: ctx.abort() + sendUserMessage(steer)
       the container-runtime proof: 2 abort+inject, 3 silent

T-1d   THE ABIDE RECON
       the finding: abide HAS the engine, LACKS the lexicon/gate/streaming/OMP/lint
       the decision: integrate abide; the lexicon is the pre-Jev gate

T-0d   THE HYDRA BUILD (this package)
       W0: the seam frozen + type-checked (sha __SHA__, tsc exit 0)
       the audit: 6 frauds found (REFUTED)
       the overhaul: the seam self-contained · the canon at density · A108 (the migration)
```

## THE LOG'S CADENCE LAW

```
one entry per: a wave completion · an audit · an overhaul · a milestone
the entry carries: the WHAT · the HOW · the EVIDENCE (a command + its output) · the NEXT
a wave that did not run gets NO entry — a log entry for absent work is the fraud
```
