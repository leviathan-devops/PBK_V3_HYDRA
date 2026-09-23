# CURRENT_STATE — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23 · **Wave:** W0 COMPLETE (the seam frozen + type-checked) · A-1..A-4 PENDING
**HONEST_CLASS:** `engine` · **Owner:** Desk A · **The seam:** v1.0.0 (sha 66b66a7f10c7c6e737a491b6e0f63903)

## THE ONE-LINE STATE

The seam is frozen and **type-checks clean** (`tsc --noEmit` exit 0). The engine is **NOT BUILT** —
this package is the complete plan to build it: 4 waves, each with a disjoint file set and a command
gate. The engine's job: make abide's proven core carry a NEW `lexicon` check type (the deterministic
pre-gate) and execute abide's never-run lint half.

## THE MEASURED BASELINE (before any wave)

```
the seam          SEAM/seam.ts 192 L · sha256 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit -> exit 0
the vendor        ABSENT — A-1 creates vendor/abide/
the lexicon type  ABSENT — A-2 adds check.type "lexicon"
the lint runner   ABSENT — A-3 executes abide's "Never executed" pattern
the entry point   ABSENT — A-4 exports check()
the existing ext  ~/.omp/agent/extensions/lexicon-gate/ 689 L (the OLD architecture)
the ttsr carrier  0 native rules (the empty hook)
```

## THE PER-MODULE STATUS

```
┌───────────────────────────┬─────────┬────────────────────────────────────┐
│ MODULE                    │ STATUS  │ THE EVIDENCE                       │
├───────────────────────────┼─────────┼────────────────────────────────────┤
│ SEAM/seam.ts              │ FROZEN  │ tsc --noEmit exit 0 · sha 66b66a7f │
│ vendor/abide/ (A-1)       │ UNBUILT │ the source is at /tmp/abide-repo   │
│ src/lexicon/ (A-2)        │ UNBUILT │ the 9 rule files are the lexicon s │
│ src/engine/check.ts (A-2) │ UNBUILT │ the seam's CheckFn is the contract │
│ src/lint/ (A-3)           │ UNBUILT │ abide's lintCheckSchema.pattern    │
│ src/ledger/ (A-3)         │ UNBUILT │ the seam's LedgerRow is the shape  │
│ src/index.ts (A-4)        │ UNBUILT │ check(req) -> CheckResult          │
└───────────────────────────┴─────────┴────────────────────────────────────┘
```

## THE 4 WAVES AND THEIR GATES

```
A-1  THE VENDOR        vendor/abide/{schema,band,jev,reason} verbatim + VENDOR.md
                       GATE: bunx tsc --noEmit vendor/abide/index.ts -> exit 0
                       NOTE: the vendored schema must SATISFY the seam's primitives
                             (Band · CheckPhase · Thresholds · Verdict · Rule).
                             A mismatch is REPORTED, never a seam edit.

A-2  THE LEXICON       check.type "lexicon" + scoreSignals + confidence + the runner order
                       GATE: bun test -t lexicon_sweep -> F1=1.000
                             bun test -t lexicon_zero_hit -> every body scores 0 against itself
                             grep -c 'bandFor' src/lexicon/ -> >= 1 (abide's, imported)

A-3  THE LINT+LEDGER   abide's `pattern` EXECUTED + the LedgerRow writer
                       GATE: the known-bad fixture REFUSED · the known-good accepted
                             bun test -t ledger_row -> the row satisfies the seam

A-4  THE SURFACE       check() exported + the engine suite
                       GATE: bunx tsc --noEmit exit 0 · bun test 0 fail
                             grep -c "ctx\|pi\." src/ -> 0   (invariant I2)
```

## WHAT IS PROVEN vs PENDING

```
PROVEN (this session, mechanically)
  the seam type-checks          bunx tsc --noEmit -p tsconfig.json -> exit 0
  the seam is self-contained    zero imports · the abide primitives declared inline
  the seam's sha is recorded    66b66a7f10c7c6e737a491b6e0f63903
  the file sets are disjoint    A: {lexicon,engine,lint,ledger}  B: {gate,surfaces,action}
  the abide anchors verify      F-1 0 hits · F-2 0 hits · F-3 present · F-4 present · G-1 0 hits

PENDING (the 4 waves — every gate above is PENDING)
  the vendor · the lexicon type · the lint runner · the entry point
```

## THE HONEST GAPS

```
(1) THE ENGINE IS UNBUILT. Every gate in §A-1..A-4 is PENDING. This doc reports a PLAN, not a result.
(2) THE JEV LIVE CALL remains blocked (402 billing_error). The engine handles it (jev:null + a
    NAMED error), but the semantic layer's live behaviour is UNOBSERVED.
(3) THE VENDORED SCHEMA'S COMPATIBILITY is unverified — the seam declares abide-shaped primitives;
    A-1 must confirm the vendored schema satisfies them (or report the mismatch).
(4) NO CORPUS SWEEP. The engine's precision on real data is UNKNOWN. That is the integration tier.
(5) THE EXISTING 689-L EXTENSION is the OLD architecture. Its migration is specified in
    DECISION_CHAIN A108 and NEXT_STEPS — it is NOT deleted by this package.

---

## THE ENGINE'S FULL CONTEXT (why each layer exists)

### THE VENDOR LAYER (A-1)
abide's engine is ~673 L of proven machinery: the rubric schema, the Jev wire, the band
arithmetic, the reason text. It is vendored VERBATIM with a sha per file, because:
- the npm resolution at the extension's own path is unreliable (measured: @typesafe-ai/sdk
  resolves from ~/.omp/agent but NOT from a subdirectory);
- the semantics must not drift (a vendored file is never edited; a patch goes beside it).

### THE LEXICON LAYER (A-2) — the reason this engine exists
abide sends EVERY model rule to Jev. There is no deterministic narrowing. The lexicon is the
narrowing: a $0, ~0ms score that DECIDES the clear and act bands and leaves only the gray to Jev.
The measured basis: on the 14-case corpus at band 0.30/0.62, **0 of 14 fell in the gray zone** —
the lexicon decided everything. That is the cost curve the pre-gate buys.

### THE LINT LAYER (A-3) — the dead half made alive
abide's own schema comment: *"A grep-shaped hint for the reader, when one exists. **Never
executed.**"* And its runner: `rule.check.type === "model"` — the only branch. So a lint rule is
recorded, reported, and never run. A-3 executes the pattern. Cost: zero.

### THE LEDGER LAYER (A-3) — the record
Every decision writes a row: `{ruleId, band, probability, decidedBy, sourceKind, span, action,
capped, at}`. `decidedBy` is the COST METRIC — the lexicon's job is to make the `jev` count small.

### THE ENTRY (A-4) — the contract
`check(req: CheckRequest): Promise<CheckResult>`. Desk B calls it; nothing else crosses the seam.

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
