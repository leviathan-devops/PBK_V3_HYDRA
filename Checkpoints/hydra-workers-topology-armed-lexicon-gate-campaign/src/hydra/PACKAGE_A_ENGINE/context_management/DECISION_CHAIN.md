# DECISION_CHAIN — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23 · every decision below is a RULING with its basis.

```
A101  VENDOR, DO NOT DEPEND.
      THE RULING: abide's engine is copied into vendor/abide/ with a sha per file.
      THE BASIS (measured): @typesafe-ai/sdk resolves from ~/.omp/agent but NOT from a
      subdirectory — the same resolution trap would hit @coldtea/abide at the extension's
      own path. A vendored copy has no resolution dependency.
      THE COST: we own the copy; upstream fixes do not arrive automatically.
      THE MITIGATION: VENDOR.md records the pinned upstream sha; a re-vendor check is a
      future instrument.

A102  THE LEXICON IS A CHECK TYPE, NOT A SEPARATE SYSTEM.
      THE RULING: `check.type:"lexicon"` joins abide's discriminated union
      (lint | model | deferred | unenforceable -> + lexicon).
      THE BASIS: one artifact, one schema, abide's own zod validation. A separate lexicon
      system would be the second-source-of-truth defect that produced kernel-judge.ts.
      THE CONSEQUENCE: a lexicon rule is a first-class abide rule; the runner sees it, the
      ledger records it, the reason names it.

A103  THE BAND IS ABIDE'S (bandFor), NEVER RE-IMPLEMENTED.
      THE RULING: import `bandFor` and `violationProbability` from the vendor.
      THE BASIS (measured): kernel-judge.ts re-implemented them (F-8) — 929 L, an invented
      type, never ran. The second implementation IS the anti-pattern.
      THE ENFORCEMENT: grep -c 'bandFor' src/lexicon/ -> >= 1; a hand-rolled
      pos/(pos+neg+1) in src/ is a defect.

A104  THE LINT RUNNER IS BUILT.
      THE RULING: execute abide's lintCheckSchema.pattern against the file.
      THE BASIS (measured): abide's own comment says "Never executed" (F-3); the runner
      dispatches model-only (F-4). That is an EMPTY CELL — a real gap.
      THE COST: zero (a regex, $0, no model call).

A105  THE ENGINE TOUCHES NO HOST.
      THE RULING: check() is a pure function of its CheckRequest (invariant I2).
      THE BASIS: a host call in the engine is untestable and breaks the seam.
      THE ENFORCEMENT: grep -rc "ctx\|pi\." src/ | grep -v ':0' -> empty.

A106  A MISSING use: BANK THROWS.
      THE RULING: loadRules refuses a rule with no exemptor.
      THE BASIS (measured): the 27-FP class came from rules with no exemptor; the use: bank
      is what makes a lexicon a lexicon rather than a regex.
      THE CONSEQUENCE: the engine refuses to load half a rubric — a loud refusal, never a
      silent drop.

A107  THE SEAM IS THE ONLY SERIAL ARTIFACT.
      THE RULING: a change to SEAM/seam.ts invalidates BOTH packages.
      THE BASIS: kernel-judge.ts (929 L) was a merge-later re-implementation. A frozen
      interface makes the merge one import.
      THE CONSEQUENCE: a desk that needs a seam change REPORTS it; it never edits.

A108  THE EXISTING 689-L EXTENSION IS MIGRATED, NOT DELETED.
      THE RULING: ~/.omp/agent/extensions/lexicon-gate/{lib,index,test}.ts (689 L) carries
      working code — the source-kind gate, the scorer, the abort+inject wire, the 5-selector
      suite. The new engine ABSORBS those modules; the duplicated half (the hand-rolled band,
      the Jev wire, the reason string) is DELETED.
      THE BASIS: the existing suite passes 5/5 (VERIFIED this session) and the TTSR-empty
      abort+inject was observed live in the container.
      THE MAPPING:
        lexicon-gate/lib.ts  classifySource   -> PACKAGE_B/src/gate/
        lexicon-gate/lib.ts  isQuotedMatch    -> PACKAGE_B/src/gate/
        lexicon-gate/lib.ts  scoreSignals     -> PACKAGE_A/src/lexicon/score.ts
        lexicon-gate/lib.ts  confidence       -> PACKAGE_A/src/lexicon/score.ts
        lexicon-gate/lib.ts  bandOf           -> DELETE (use abide's bandFor)
        lexicon-gate/lib.ts  judgeSpans       -> DELETE (use abide's checkWithModel)
        lexicon-gate/index.ts the 4 hooks     -> PACKAGE_B/src/surfaces/
        lexicon-gate/index.ts the reason text -> DELETE (use abide's repairReason)
        lexicon-gate/lib.test.ts the 5 selectors -> carried into both suites
      THE CONSEQUENCE: no runtime collision — the new tree SUPERSEDES at the same path only
      after both desks land and the merge's integration audit is green.

---

## THE DECISION ANATOMY (what each ruling cost)

```
A101 VENDOR vs DEPEND
  THE COST of choosing wrong: an unresolvable import at the extension's own path — the exact
  trap already measured with @typesafe-ai/sdk. A vendored copy has no resolution dependency.
  THE TRADE ACCEPTED: we own the copy; upstream fixes are manual.

A102 THE LEXICON AS A CHECK TYPE
  THE COST of choosing wrong: a SECOND rule system beside abide's — the second-source-of-truth
  defect that produced kernel-judge.ts.
  THE TRADE ACCEPTED: abide's union grows by one member; its zod validation covers the new type.

A103 ABIDE'S BAND, NOT OURS
  THE COST of choosing wrong (MEASURED): kernel-judge.ts — 929 L, the same constants, an
  invented type, never ran.
  THE TRADE ACCEPTED: the band's semantics are abide's; we add only the lexicon's SCORE.

A104 THE LINT RUNNER
  THE COST of choosing wrong: leaving an empty cell (abide's own comment admits it).
  THE TRADE ACCEPTED: a regex executes per file; $0, no model call.

A105 NO HOST IN THE ENGINE
  THE COST of choosing wrong: an untestable engine; the seam broken; Desk B's tree unreachable.
  THE TRADE ACCEPTED: the engine is a pure function; Desk B owns every side effect.

A106 A MISSING use: THROWS
  THE COST of choosing wrong (MEASURED): the 27-FP class — rules with no exemptor firing on
  legitimate work, including RULES.md's own prohibition line.
  THE TRADE ACCEPTED: a rule that lacks an exemptor cannot load; the rubric is all-or-nothing.

A107 THE SEAM IS SERIAL
  THE COST of choosing wrong (MEASURED): kernel-judge.ts — a merge-later re-implementation.
  THE TRADE ACCEPTED: a change to seam.ts invalidates both packages; a desk reports, never edits.

A108 THE MIGRATION, NOT THE DELETE
  THE COST of choosing wrong: 689 L of working, tested code (5/5 green) discarded, and a latent
  runtime collision at the same path.
  THE TRADE ACCEPTED: a per-module migration map; supersession only after the integration audit.
```

---

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
