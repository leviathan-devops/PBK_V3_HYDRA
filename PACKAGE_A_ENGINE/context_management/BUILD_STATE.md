# BUILD_STATE — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23 · **Wave:** W0 complete · the engine UNBUILT

## THE ARTIFACTS + THEIR SHAs

```
SEAM/seam.ts                       192 L · sha256 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0
SEAM/SEAM_CONTRACT.md              the boundary doc
PACKAGE_A_DPL1_SPEC.md             251 L   the contract (F-1..F-8)
PACKAGE_A_WAVE_PLAN.md             97 L    WAVES: 4
PACKAGE_A_MASTER_BLUEPRINT.md      113 L   the design authority
PACKAGE_A_CREATE_PROMPT.md         112 L   the /create pin
context_management/                11 docs (this set)
tsconfig.json                      the seam's type-check config
```

**THE ENGINE'S ARTIFACTS (once built — currently ABSENT):**
```
vendor/abide/{schema,band,jev,reason}    A-1   the vendored engine (sha per file in VENDOR.md)
src/lexicon/                             A-2   the lexicon type + the scorer
src/engine/check.ts                      A-2   the runner order
src/lint/                                A-3   abide's dead half, executed
src/ledger/                              A-3   the row writer
src/index.ts                             A-4   check(req) -> CheckResult
```

## THE SHA CHAIN

```
the seam (frozen)           66b66a7f10c7c6e737a491b6e0f63903    192 L
the vendored abide          PENDING          A-1 records a sha per file
the engine bundle           PENDING          A-4's build
the existing extension      228d2fc1e06dc0ee  (the OLD architecture — lib.ts)
the deployed extension      8186c9770bc088bc  (the TTSR-carrier build, superseded)
```

**THE RULE:** every artifact's sha appears in VENDOR.md (for the vendor) or in this doc (for the
build). A doc that names an artifact without its sha is incomplete.

## THE MODULE INVENTORY (the planned shape)

```
┌──────────────────────────────┬──────┬────────────────────────────────────┐
│ FILE (planned)               │ WAVE │ WHAT IT IS                         │
├──────────────────────────────┼──────┼────────────────────────────────────┤
│ vendor/abide/schema/index.ts │ A-1  │ the rubric + question + hook schem │
│ vendor/abide/band.ts         │ A-1  │ violationProbability + bandFor     │
│ vendor/abide/jev.ts          │ A-1  │ checkWithModel (the wire)          │
│ vendor/abide/reason.ts       │ A-1  │ repairReason + flagNotice          │
│ src/lexicon/schema.ts        │ A-2  │ lexiconCheckSchema (the NEW type)  │
│ src/lexicon/score.ts         │ A-2  │ scoreSignals + confidence          │
│ src/lexicon/load.ts          │ A-2  │ loadRules (THROWS) + the derive    │
│ src/engine/check.ts          │ A-2  │ the runner order + check()         │
│ src/lint/runner.ts           │ A-3  │ abide's pattern, EXECUTED          │
│ src/ledger/writer.ts         │ A-3  │ the LedgerRow append               │
│ src/index.ts                 │ A-4  │ the public surface                 │
└──────────────────────────────┴──────┴────────────────────────────────────┘
```

## THE BUILD COMMANDS

```bash
# the seam (W0 — PASSES)
bunx tsc --noEmit -p tsconfig.json

# the engine (once built)
bunx tsc --noEmit
bun test
bun test -t lexicon_sweep
bun test -t lint_runner
grep -rc "ctx\|pi\." src/ | grep -v ':0' || echo "I2 HOLDS"
```

## THE ENVIRONMENT FACTS (load-bearing, measured)

```
bun 1.4.2                    Bun.YAML.parse available — no yaml dependency
the vendor source            /tmp/abide-repo/packages/{schema,cli}/src
abide's constants            EDIT_CHECK_TIMEOUT_MS 8000 · MAX_BLOCKS_PER_RULE_PER_TURN 2
abide's thresholds           { act: 0.8, flag: 0.5 }  (rubric.ts:179)
abide's lint schema          lintCheckSchema.pattern (rubric.ts:74-87)
the seam version             1.0.0 — a change invalidates BOTH packages
the resolution trap          @typesafe-ai/sdk resolves from ~/.omp/agent but NOT from a
                             subdirectory -> the wire must be vendored or fetched, never
                             resolved from the extension's own path
```

## THE REBUILD RECIPE (a fresh agent, zero context)

```
1  read ../SEAM/SEAM_CONTRACT.md (the boundary)
2  run bunx tsc --noEmit -p tsconfig.json  -> exit 0 confirms the seam is intact
3  execute A-1 -> A-2 -> A-3 -> A-4, each gate green before the next
4  the engine is COMPLETE when the 8 success criteria in the spec are green
```

---

## THE BUILD'S ORDERING (why A-1 is alone)

```
A-1 (the vendor) is a PREREQUISITE, not a parallel step: A-2 imports abide's bandFor; A-3 imports
its schemas; A-4 exports check(). Without the vendor, every later wave's import fails.

A-2 -> A-3 -> A-4 are SEQUENTIAL because each builds on the prior's exports:
  A-2 defines the lexicon type + the scorer -> A-3's lint runner reads the same rule objects
  A-3 defines the ledger writer            -> A-4's check() writes through it
  A-4 exports the surface                  -> Desk B imports it

THE PARALLELISM IS ACROSS DESKS, NOT WITHIN ONE: Desk A's 4 waves run in sequence while Desk B's
4 waves run in sequence, CONCURRENTLY. The two chains meet only at the merge.
```

## THE VENDOR'S EXACT SOURCE SET

```
/tmp/abide-repo/packages/schema/src/rubric.ts   -> vendor/abide/schema/rubric.ts
/tmp/abide-repo/packages/schema/src/hooks.ts    -> vendor/abide/schema/hooks.ts
/tmp/abide-repo/packages/schema/src/index.ts    -> vendor/abide/schema/index.ts
/tmp/abide-repo/packages/cli/src/lib/band.ts    -> vendor/abide/band.ts
/tmp/abide-repo/packages/cli/src/lib/jev.ts     -> vendor/abide/jev.ts
/tmp/abide-repo/packages/cli/src/lib/reason.ts  -> vendor/abide/reason.ts

THE VENDOR.md RECORDS: the upstream repo, the commit, and a sha256 PER FILE.
THE LAW: a vendored file is NEVER edited. A needed change is a PATCH FILE beside it.
```

## THE TYPES THE SEAM DECLARES (A-1 must satisfy them)

```
Band          "act" | "flag" | "clear"          abide's band.ts:56-57 returns these
CheckPhase    "edit" | "turn"                    abide's ruleWhenSchema
Thresholds    { act: number, flag: number }      abide's rubric.ts:173-174
Rule          { id, text, source, scope?, when?, status }   abide's ruleSchema
Verdict       { ruleId, probability, band, answer? }         abide's Verdict type
```

---

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
