# EVIDENCE_STATE — PACKAGE A (THE ENGINE)

**As of:** 2026-09-23 · every line below is a tool result from this session or a named PENDING gate.

## THE MEASURED BASIS (the failures this package closes)

```
F-1  abide has NO lexicon
     $ grep -rn "lexicon" /tmp/abide-repo/packages/ --include=*.ts | wc -l
     0                                    ★ VERIFIED THIS SESSION

F-2  abide has NO source-kind gate
     $ grep -rn "own_utterance\|source_kind" /tmp/abide-repo/packages/ --include=*.ts | wc -l
     0                                    ★ VERIFIED THIS SESSION

F-3  abide's lint half is DEAD
     /tmp/abide-repo/packages/schema/src/rubric.ts:79-80, verbatim:
       /** A grep-shaped hint for the reader, when one exists. Never executed. */
     $ grep -c "Never executed" .../rubric.ts
     1                                    ★ VERIFIED THIS SESSION

F-4  the runner dispatches model-only
     /tmp/abide-repo/packages/cli/src/lib/checkRunner.ts:24-25:
       rule.status === "active" && rule.check.type === "model" && rule.when === phase
     $ grep -c 'check.type === "model"' .../checkRunner.ts
     1                                    ★ VERIFIED THIS SESSION

F-5  kernel-judge.ts invents a question type
     pbk-v2/src/ext/kernel-judge.ts: toApiPrimitive('noul')
     abide'sunion: boolean | choice | score        ★ VERIFIED (the file was
       read)

F-6  the constants were copied, not imported
     kernel-judge.ts:53-63  vs  abide's constants.ts
     EDIT_CHECK_TIMEOUT_MS 8000 · MAX_ACT_APPENDS_PER_RULE_PER_TURN 2 · 0.8 · 0.5
     ★ VERIFIED — the values match abide's, and the file re-declares them

F-7  the Jev live call has never run
     402 billing_error on the host · no key in the container
     ★ VERIFIED — the error body was read verbatim

F-8  the band was hand-rolled
     kernel-judge.ts re-derives pos/(pos+neg+1) instead of importing abide's
     violationProbability(band.ts:17-58)          ★ VERIFIED (the file was
       read)
```

## THE PROOF CHAIN (W0 green; A-1..A-4 PENDING)

```
W0  THE SEAM
    $ bunx tsc --noEmit -p tsconfig.json
    exit 0                               ★ VERIFIED
    $ sha256sum SEAM/seam.ts | cut -c1-32
    66b66a7f10c7c6e737a491b6e0f63903                          ★ VERIFIED
    theseam is SELF-CONTAINED (zero imports)  ★ VERIFIED — grep "from \""
      returns0

A-1  $ bunx tsc --noEmit vendor/abide/index.ts      PENDING
A-2  $ bun test -t lexicon_sweep -> F1=1.000        PENDING
A-3  $ bun test -t lint_runner -> the known-bad REFUSED   PENDING
A-4  $ grep -c "ctx\|pi\." src/ -> 0                PENDING
```

## THE INVARIANT EVIDENCE

```
I2  DESK A NEVER TOUCHES A HOST
    the proof: grep -rc "ctx\|pi\." src/ | grep -v ':0'  ->  (empty)  = I2 HOLDS
    STATUS: PENDING (src/ does not exist yet). The gate is defined; it has not run.

I1  DESK B NEVER COMPUTES A BAND
    the proof: grep -rc "bandOf\|confidence" PACKAGE_B/src/ | grep -v ':0'  ->  (empty)
    STATUS: PENDING (Desk B's tree does not exist yet).
```

## THE HONEST GAPS

```
★THE ENGINE IS UNBUILT — every A-wave gate is PENDING. This doc reports a
  PLAN+ a VERIFIED basis.
★THE JEV LIVE CALL is blocked (402). The engine's handling (jev:null + a
  NAMEDerror) is designed,
  not observed.
★ NO CORPUS SWEEP — the precision on real data is UNKNOWN.
★THE VENDORED SCHEMA'S COMPATIBILITY with the seam's primitives is
  unverified(A-1's gate).
★THE SEAM'S GATES ARE DEFINED BUT UNRUN for A-1..A-4 — only W0's gate has
  actuallyexecuted.
```

## THE ANTI-EMBELLISHMENT NOTE

This doc distinguishes, for every claim: **VERIFIED THIS SESSION** (a command was run, its output
read), **PENDING** (a gate is defined, not yet run), and **DESIGNED** (a mechanism is specified, no
code exists). A claim in the third category presented as the first is the fraud this section exists
to prevent.

---

## THE VERIFICATION STATUS OF EVERY CLAIM (the anti-embellishment table)

| the claim | the status | the evidence |
|---|---|---|
| the seam type-checks | **VERIFIED** | `bunx tsc --noEmit -p tsconfig.json` → exit 0 |
| the seam is self-contained | **VERIFIED** | `grep -c 'from "' SEAM/seam.ts` → 0 |
| the seam's sha | **VERIFIED** | `sha256sum` → __SHA__ |
| abide has no lexicon | **VERIFIED** | `grep -rn lexicon … \| wc -l` → 0 |
| abide has no source-kind gate | **VERIFIED** | `grep -rn own_utterance\|source_kind … \| wc -l` → 0 |
| abide's lint is never executed | **VERIFIED** | rubric.ts:79-80, verbatim |
| the runner is model-only | **VERIFIED** | checkRunner.ts:24-25, verbatim |
| kernel-judge invents `noul` | **VERIFIED** | kernel-judge.ts:271-276, read |
| the existing extension's suite | **VERIFIED** | `bun test .` → 5 pass / 0 fail |
| TTSR is empty | **VERIFIED** | `omp ttsr list \| grep -c native` → 0 |
| the file sets are disjoint | **VERIFIED** | A:{lexicon,engine,lint,ledger} ∩ B:{gate,surfaces,action} = ∅ |
| the vendor compiles | **PENDING** | A-1's gate — not run |
| the lexicon separates | **PENDING** | A-2's gate — not run |
| the lint refuses the known-bad | **PENDING** | A-3's gate — not run |
| `check()` satisfies the seam | **PENDING** | A-4's gate — not run |
| the Jev wire works live | **UNOBSERVED** | 402 — the account, not the code |
| the engine's precision on real data | **UNKNOWN** | no corpus sweep |

**THE RULE:** a claim in the PENDING/UNOBSERVED/UNKNOWN rows presented as VERIFIED is the fraud this
table exists to prevent.

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
