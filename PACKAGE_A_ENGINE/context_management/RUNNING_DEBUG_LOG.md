# RUNNING_DEBUG_LOG — PACKAGE A (THE ENGINE)

**The debug record. Every entry: FINDING · ROOT CAUSE · FIX · VERIFICATION · LESSON.**

## [2026-09-23] EN-A1 · THE SEAM'S GATE WAS UNPASSABLE (the false compile claim)

**FINDING.** The package's verification section cited `bunx tsc --noEmit SEAM/seam.ts` as the seam's
gate. It had never been run. The check actually performed was `bun build SEAM/seam.ts`, which exited 0.

**ROOT CAUSE.** `bun build` strips TypeScript types WITHOUT resolving type-only imports. The seam's
`import type { Band, ... } from "./vendor/abide/schema"` pointed at a path that does not exist
(A-1 creates it). Bun's bundler treats a type-only import as erasable and never resolves it — so the
build succeeds and proves NOTHING about type correctness.

**FIX.** The seam is now SELF-CONTAINED: the abide primitives are declared inline, plus compile-time
exhaustiveness assertions. Zero imports. The real gate (`tsc --noEmit -p tsconfig.json`) runs and
returns exit 0.

**VERIFICATION.**
```
$ bunx tsc --noEmit -p tsconfig.json ; echo $?
0
$ grep -c 'from "' SEAM/seam.ts
0
```

**LESSON.** A BUILD IS NOT A TYPE CHECK. `bun build` / `esbuild` / `vite build` all succeed on
unresolvable type-only imports. Only `tsc --noEmit` (or an equivalent type checker) proves the types.
A gate that names the wrong command is a gate that has never run.

## [2026-09-23] EN-A2 · THE NAPKIN CANON (22 docs under the CRITICAL floor)

**FINDING.** Every canon doc was 11-43 lines. The zero-trust catalog: "under 100 = CRITICAL".

**ROOT CAUSE.** The docs were written as summaries of the spec, not as the mid-build canon a running
desk accumulates. A summary of a spec is a napkin: it gives the ILLUSION of context while foreclosing
the investigation (no anchors, no commands, no per-module detail).

**FIX.** Regenerated at production density: the per-module tables, the file:line anchors, the measured
failures (F-1..F-8), the decision chain (A101-A108), the risk register, the resume sequence, the
VERIFIED/PENDING/DESIGNED separation.

**VERIFICATION.** `wc -l context_management/*.md` -> every doc >= 200.

**LESSON.** A canon doc's job is to let a fresh agent RESUME, not to remind the author what they did.
The anchors and the commands are the content; the summary is the padding.

## [2026-09-23] EN-A3 · THE UNSPECIFIED MIGRATION (689 L at the same path)

**FINDING.** Both packages build NEW code at `~/.omp/agent/extensions/lexicon-gate/` — where a
WORKING 689-L extension already lives (its suite passes 5/5). Neither package said what happens to it.

**ROOT CAUSE.** The packages were designed as greenfield, ignoring the existing implementation. A
runtime collision was latent: two trees, one path.

**FIX.** A108 added: a per-module migration map. classifySource/isQuotedMatch -> Desk B's gate;
scoreSignals/confidence -> Desk A's lexicon; the 4 hooks -> Desk B's surfaces; bandOf/judgeSpans/the
reason -> DELETED (abide's are imported). Supersession only after the integration audit is green.

**VERIFICATION.** The mapping covers all 689 L: 4 modules move, 3 are deleted, the suite's 5 selectors
carry into both new suites.

**LESSON.** A package that builds "new code" in a directory that already has working code has not
finished its design. The migration IS part of the deliverable.

---

## THE DEBUG ENTRY TEMPLATE

```
## [<timestamp>] EN-<id> · <THE FINDING, in one line>

FINDING:      what was observed (the symptom, verbatim where possible)
ROOT CAUSE:   the mechanism — the ONE thing that produced the finding
FIX:          the smallest change that removes the mechanism
VERIFICATION: the command + its output proving the fix
LESSON:       the generalizable rule (the class, not the instance)
```

## THE FRAUD CATALOG (the classes this log's package must never commit)

```
THEATRICAL VERIFICATION   a pass claimed with no run shown
EMBELLISHED STATS         a number without its re-count
CIRCULAR PASSTOKEN        the agent typed the token it "verified"
STRUCTURAL-GREEN          deployment evidence presented as behavioural evidence
NAPKIN DOCS               a doc under the floor, giving the illusion of context
SHA DRIFT                 two docs naming different artifacts
SELF-SATISFIED TEST       the plan tested what the author wanted, not what changed
```

## THE ENTRIES SO FAR (3)

```
EN-A1  THE SEAM'S GATE WAS UNPASSABLE — bun build is not a type check; the seam was never
       type-checked. FIX: self-contained (zero imports). VERIFIED: tsc exit 0.
EN-A2  THE NAPKIN CANON — 22 docs under 100 L. FIX: regenerated at production density.
       VERIFIED: wc -l -> every doc >= 200.
EN-A3  THE UNSPECIFIED MIGRATION — 689 L of working code at the same path, no migration.
       FIX: A108 (the per-module map). VERIFIED: the map covers all 689 L.
```

## THE NEXT ENTRY (expected)

```
EN-A4  A-1's vendored schema mismatch (if the seam's primitives are not satisfied)
       or A-1's completion (the vendor compiles, VENDOR.md carries 6 shas).
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
