# NEXT_STEPS — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23 · the resume point

## THE ENTRY (a fresh agent, zero context)

```
1  ../SEAM/SEAM_CONTRACT.md            the boundary (read FIRST, always)
2  PACKAGE_A_DPL1_SPEC.md              the contract (F-1..F-8, the 4 waves, the 8 criteria)
3  PACKAGE_A_WAVE_PLAN.md              WAVES: 4 — each wave's file set + command gate
4  PACKAGE_A_MASTER_BLUEPRINT.md       the design authority (the cost law, the weights)
5  context_management/CURRENT_STATE.md this doc's sibling — the live state
```

## THE WAVES (in order, each gate green before the next)

```
A-1  THE VENDOR
     the files:  vendor/abide/{schema,band,jev,reason} + VENDOR.md
     the source: /tmp/abide-repo/packages/{schema,cli}/src
     the gate:   bunx tsc --noEmit vendor/abide/index.ts -> exit 0
     the note:   the vendored schema must SATISFY the seam's primitives
                 (Band · CheckPhase · Thresholds · Verdict · Rule).
                 A mismatch is REPORTED; the seam is never edited.

A-2  THE LEXICON
     the files:  src/lexicon/{schema,score,load}.ts · src/engine/check.ts
     the gate:   bun test -t lexicon_sweep -> F1=1.000
                 bun test -t lexicon_zero_hit -> every body scores 0 against itself
                 grep -c 'bandFor' src/lexicon/ -> >= 1
     the note:   THE DERIVED BAND IS MANDATORY. low = max(neg)+0.05 floored at 0.30;
                 high = min(pos)-0.05. An inherited band THROWS.

A-3  THE LINT + LEDGER
     the files:  src/lint/runner.ts · src/ledger/writer.ts
     the gate:   the known-bad fixture REFUSED · the known-good accepted
                 bun test -t ledger_row -> the row satisfies the seam's LedgerRow
     the note:   abide's `pattern` has never been executed. This wave executes it.

A-4  THE PUBLIC SURFACE
     the files:  src/index.ts · src/engine/check.test.ts
     the gate:   bunx tsc --noEmit exit 0 · bun test 0 fail
                 grep -c "ctx\|pi\." src/ -> 0
```

## THE BOUNDARY CHECK (before the merge)

```bash
# the engine's return type satisfies the seam
bunx tsc --noEmit ../SEAM/seam.ts src/index.ts
# the invariant
grep -rc "ctx\|pi\." src/ | grep -v ':0' || echo "I2 HOLDS"
# the engine does not re-implement abide
grep -rc 'bandFor' src/lexicon/ | grep -v ':0'   # must be >= 1
```

## THE MIGRATION (A108 — the existing extension)

```
the existing 689-L extension is NOT deleted by this package. Its modules MIGRATE:
  classifySource + isQuotedMatch   -> PACKAGE_B/src/gate/
  scoreSignals + confidence        -> PACKAGE_A/src/lexicon/score.ts
  the 4 hooks                      -> PACKAGE_B/src/surfaces/
  bandOf / judgeSpans / the reason -> DELETED (abide's are imported instead)
the supersession happens ONLY after both desks land + the merge's integration audit is green.
```

## THE RESUME

```
re-run: bunx tsc --noEmit -p tsconfig.json
if red -> the seam drifted or tsconfig changed. Report, never edit the seam.
the engine is COMPLETE when the 8 success criteria in the spec are green with their output quoted.
```

## THE RISK REGISTER

```
R1  THE VENDORED SCHEMA MISMATCHES the seam's primitives -> A-1 reports; the seam wins.
R2  A RULE HAS NO use: BANK -> loadRules THROWS; the rule does not load.
R3  THE BAND IS NOT SEPARABLE -> the rule is NOT READY; narrow the suggestive, never widen use:.
R4  THE JEV KEY IS DEAD -> the row records jev:null + a NAMED error; the band stands.
R5  THE EXISTING EXTENSION AND THE NEW TREE COLLIDE at the same path -> the migration order
    (A108) is the mitigation: supersede only after the integration audit is green.

---

## THE WAVE-BY-WAVE EXPANSION (the WHAT/HOW/WHY per wave)

```
A-1 · THE VENDOR
  WHAT:  copy abide's schema + band + jev + reason into vendor/abide/, verbatim.
  HOW:   cp each file; write VENDOR.md with the upstream path + the commit + a sha per file.
  WHY:   the engine must not re-implement abide (the 929-L anti-pattern); a vendored copy
         removes the resolution dependency that breaks npm at the extension's own path.
  EXPECTED: `bunx tsc --noEmit vendor/abide/index.ts` exit 0; VENDOR.md carries 6 shas.

A-2 · THE LEXICON
  WHAT:  the `lexicon` check type + scoreSignals + confidence + the runner order.
  HOW:   the type joins abide's discriminated union; scoreSignals applies the 4 weights;
         confidence = pos/(pos+neg+1); the runner tries lexicon -> lint -> model.
  WHY:   this IS the pre-gate. Without it, every rule reaches Jev (cost) and abide has no
         deterministic half (the empty cell).
  EXPECTED: F1=1.000 at the derived band; every rule's body scores 0 against itself.

A-3 · THE LINT + LEDGER
  WHAT:  execute abide's lintCheckSchema.pattern; write the LedgerRow.
  HOW:   new RegExp(pattern).test(fileText); the row per decision with decidedBy.
  WHY:   abide's pattern has never been executed (its own comment says so) — a real gap.
  EXPECTED: a known-bad fixture REFUSED; a known-good accepted; the row matches the seam.

A-4 · THE SURFACE
  WHAT:  export check(req: CheckRequest): Promise<CheckResult>.
  HOW:   wire the runner order behind the one entry point; the suite asserts the seam's shapes.
  WHY:   Desk B imports exactly this; nothing else crosses the boundary.
  EXPECTED: tsc exit 0; bun test 0 fail; `grep -rc "ctx\|pi\." src/` empty.
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
