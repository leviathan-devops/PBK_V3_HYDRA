# TASK_QUEUE — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23

```
[DONE]     W0   THE SEAM FROZEN + TYPE-CHECKED
                SEAM/seam.ts 192 L · sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0
                the seam is self-contained (zero imports)

[DONE]     --   THE PACKAGE MINTED
                the spec (251 L) · the wave plan (97 L) · the blueprint (113 L) ·
                the create prompt (112 L) · the canon (11 docs)

[READY]    A-1  THE VENDOR
                the files: vendor/abide/{schema,band,jev,reason} + VENDOR.md
                the gate:  bunx tsc --noEmit vendor/abide/index.ts -> exit 0
                the note:  the vendored schema must satisfy the seam's primitives

[BLOCKED-A-1] A-2  THE LEXICON
                the files: src/lexicon/{schema,score,load}.ts · src/engine/check.ts
                the gate:  F1=1.000 · the zero-hit test clean · bandFor imported
                the note:  the band is DERIVED per rule; an inherited band THROWS

[BLOCKED-A-2] A-3  THE LINT + THE LEDGER
                the files: src/lint/runner.ts · src/ledger/writer.ts
                the gate:  the known-bad REFUSED · the ledger row satisfies the seam
                the note:  abide's `pattern` has never been executed — this closes F-3

[BLOCKED-A-3] A-4  THE PUBLIC SURFACE
                the files: src/index.ts · src/engine/check.test.ts
                the gate:  tsc exit 0 · bun test 0 fail · grep ctx -> 0

[QUEUED]   --   THE MIGRATION (A108)
                the existing extension's modules move; the duplicated half is deleted
                TRIGGER: both desks land + the integration audit green

[QUEUED]   --   THE CORPUS SWEEP (the integration tier)
                a real transcript · every firing hand-adjudicated · THE precision number

[QUEUED]   --   THE JEV LIVE CALL
                blocked on 402 billing_error · the wire's live behaviour is UNOBSERVED

---

## THE DEPENDENCY GRAPH

```
        W0 (the seam, FROZEN)
              |
              +-------------------+
              v                   v
          DESK A              DESK B
              |                   |
           A-1 vendor          B-1 gate
              |                   |
           A-2 lexicon         B-2 surfaces
              |                   |
           A-3 lint+ledger     B-3 action
              |                   |
           A-4 surface         B-4 entry
              |                   |
              +---------+---------+
                        v
                  W2 THE MERGE (one import)
                        |
                        v
                  W3 THE INTEGRATION (6 steps)
```

## THE GATE TABLE

| wave | the gate command | the expected | the status |
|---|---|---|---|
| W0 | `bunx tsc --noEmit -p tsconfig.json` | exit 0 | **PASS** |
| A-1 | `bunx tsc --noEmit vendor/abide/index.ts` | exit 0 | PENDING |
| A-2 | `bun test -t lexicon_sweep` | F1=1.000 | PENDING |
| A-2 | `bun test -t lexicon_zero_hit` | all bodies clean | PENDING |
| A-3 | `bun test -t lint_runner` | the known-bad REFUSED | PENDING |
| A-3 | `bun test -t ledger_row` | the seam's shape | PENDING |
| A-4 | `bunx tsc --noEmit` | exit 0 | PENDING |
| A-4 | `grep -rc "ctx\|pi\." src/` | empty | PENDING |
| W2 | `bunx tsc --noEmit` (combined) | exit 0 | BLOCKED on A+B |
| W3 | the 6-step integration audit | all green | BLOCKED on W2 |

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
  SEAM/seam.ts:15                     "── FROZEN INTERFACE ABOVE — DO NOT EDIT ──"
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

## THE ACCEPTANCE CRITERIA (what DONE means per wave — the exact assertion)

```
A-1 · THE VENDOR
  DONE = `bunx tsc --noEmit vendor/abide/index.ts` exits 0
       AND VENDOR.md carries a sha256 for every vendored file
       AND the vendored schema satisfies the seam's primitives
           (Band · CheckPhase · Thresholds · Verdict · Rule)
  NOT DONE = the vendor exists but does not compile, or a sha is missing

A-2 · THE LEXICON
  DONE = `bun test -t lexicon_sweep` prints F1=1.000 at the DERIVED band
       AND `bun test -t lexicon_zero_hit` shows every body scoring 0 against itself
       AND `grep -c 'bandFor' src/lexicon/` >= 1  (abide's, imported)
       AND no hand-rolled `pos / (pos + neg + 1)` exists in src/
  NOT DONE = a band inherited from the reference, or a re-derived confidence formula

A-3 · THE LINT + LEDGER
  DONE = a known-bad fixture is REFUSED and a known-good is accepted
       AND the emitted row satisfies the seam's LedgerRow
       AND `decidedBy` is recorded on every row
  NOT DONE = the pattern executes but the row lacks decidedBy (the cost metric is lost)

A-4 · THE SURFACE
  DONE = `bunx tsc --noEmit` exits 0
       AND `bun test` is 0 fail
       AND `grep -rc "ctx\|pi\." src/ | grep -v ':0'` is EMPTY
       AND `check(req: CheckRequest): Promise<CheckResult>` is exported
  NOT DONE = a host reference anywhere in src/ (invariant I2 broken)
```

## THE QUEUE'S GOVERNING RULE

```
a task moves to [DONE] ONLY when its acceptance criteria are met WITH THEIR OUTPUT QUOTED.
a green suite without the criteria's output is an effort receipt, not a completion.
a BLOCKED task names its blocker AND its unblock condition.
```
