# COMPACTION_SURVIVAL — PACKAGE A (THE ENGINE)

**The resume point. Read after CURRENT_STATE + NEXT_STEPS.**

## THE READ ORDER

```
1  CURRENT_STATE.md      the state + the per-module table + the gates
2  NEXT_STEPS.md         the entry + the 4 waves + the migration + the risks
3  DECISION_CHAIN.md     A101-A108 (A108 = the existing extension's migration)
4  EVIDENCE_STATE.md     F-1..F-8 (VERIFIED) + the proof chain (W0 green, A-1..A-4 PENDING)
5  BUILD_STATE.md        the shas + the module inventory + the rebuild recipe
```

## THE SURVIVAL FACTS

```
S1  THE SEAM IS FROZEN AND TYPE-CHECKS. sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0.
    Desk B builds against it too. A change invalidates BOTH packages.
S2  THE ENGINE IS UNBUILT. This package is the plan.
S3  THE INVARIANT I2: grep -rc "ctx\|pi\." src/ | grep -v ':0' -> empty.
S4  THE ANTI-PATTERN: kernel-judge.ts (929 L) re-implemented abide with the same constants
    and an invented question type (`noul`), and its live call never ran.
S5  THE 8 SUCCESS CRITERIA are in the spec's §6.
S6  THE MIGRATION (A108): the existing 689-L extension's modules move; the duplicated half
    (bandOf, judgeSpans, the reason) is DELETED. Supersede only after the integration audit.
S7  THE SEAM IS SELF-CONTAINED (zero imports) — it type-checks BEFORE any vendor lands.
```

## THE ANTI-DERAIL (this package's nouns)

```
1  A SECOND BAND        -> import abide's bandFor. The grep enforces it.
2  A HOST IMPORT        -> invariant I2. The grep must read empty.
3  A SILENT SKIP        -> every skip is a NAMED error. loadRules THROWS.
4  AN INHERITED BAND    -> loadRules THROWS.
5  AN EDITED VENDOR     -> a patch file beside it, with the reason.
6  A SEAM EDIT          -> REPORT it. The seam is the only serial artifact.
7  A DELETED EXTENSION  -> MIGRATE it (A108). The working code is the baseline.
8  A FIXTURE AS A RATE  -> label it FIXTURE. The corpus sweep is the only live number.
```

## THE RESUME SEQUENCE

```
1  bunx tsc --noEmit -p tsconfig.json         # the seam
2  ls vendor/abide/                           # A-1 done?
3  bun test -t lexicon_sweep                  # A-2 done?
4  bun test -t lint_runner                    # A-3 done?
5  grep -rc "ctx\|pi\." src/ | grep -v ':0'   # A-4's invariant
the FIRST failure names the wave to resume at.
```

---

## THE SURVIVAL CHECKLIST (tick each after a compaction)

```
[ ] the seam is intact:        bunx tsc --noEmit -p tsconfig.json -> exit 0
[ ] the seam's sha matches:    sha256sum SEAM/seam.ts -> __SHA__
[ ] the vendor exists:         ls vendor/abide/
[ ] the lexicon type exists:   grep -c 'type: "lexicon"' src/lexicon/
[ ] the lint runner exists:    ls src/lint/
[ ] the entry exists:          grep -c 'export.*check' src/index.ts
[ ] the invariant holds:       grep -rc "ctx\|pi\." src/ | grep -v ':0' -> empty
[ ] the existing ext is intact: cd ~/.omp/agent/extensions/lexicon-gate && bun test .
```

## THE RECOVERY DECISION TREE

```
the seam fails tsc?
  -> the file was edited (it is FROZEN). Restore from the checkpoint or re-derive from this doc.
the vendor is absent?
  -> A-1 has not run. Its source is /tmp/abide-repo/packages/{schema,cli}/src.
the lexicon is absent?
  -> A-2 has not run. Read the spec's §2.2 for the exact schema.
a test fails?
  -> the FIRST failing test names the wave. Read its gate in the wave plan.
the invariant grep returns a hit?
  -> a host reference leaked into the engine. Remove it; the engine is a pure function.
```

## THE PACKAGE'S OWN LAWS (restated for the resume)

```
LAW 1  the seam is the only serial artifact — report a change, never edit
LAW 2  the engine touches no host (I2)
LAW 3  abide's band, jev and reason are IMPORTED, never re-derived
LAW 4  the band is DERIVED per rule; an inherited band THROWS
LAW 5  a missing use: bank THROWS
LAW 6  the vendor is never edited — a patch beside it
LAW 7  the existing extension is MIGRATED (A108), never deleted
LAW 8  a fixture is labelled FIXTURE; the corpus sweep is the only live rate
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

## THE FILE INVENTORY (what a resumed agent must be able to locate)

```
PBK_V3_HYDRA/
  SEAM/seam.ts                        192 L · the frozen interface · sha __SHA__
  SEAM/SEAM_CONTRACT.md               the boundary doc
  PACKAGE_A_ENGINE/                   THIS package
    PACKAGE_A_DPL1_SPEC.md            251 L · the contract
    PACKAGE_A_WAVE_PLAN.md            97 L  · WAVES: 4
    PACKAGE_A_MASTER_BLUEPRINT.md     113 L · the design authority
    PACKAGE_A_CREATE_PROMPT.md        112 L · the /create pin
    context_management/               11 docs (this set)
    tsconfig.json                     the seam's type-check config
  PACKAGE_B_SURFACES/                 Desk B's package (the sibling)
  MERGE/THE_MERGE.md                  the integrator (one import)
  README.md                           the workspace index

~/.omp/agent/extensions/lexicon-gate/ 689 L — THE EXISTING EXTENSION (the migration baseline)
/tmp/abide-repo/                      the vendor source (A-1's input)
~/.omp/agent/rules/*.md               9 lexicon rules (the lexicon's source)
```

## THE THREE INVARIANTS (restated for the resume)

```
I1  DESK B NEVER COMPUTES A BAND.
    the proof: grep -rc "bandOf\|confidence" PACKAGE_B/src/ | grep -v ':0' -> empty
    WHY: a band in Desk B is the second-source-of-truth defect (kernel-judge.ts).

I2  DESK A NEVER TOUCHES A HOST.
    the proof: grep -rc "ctx\|pi\." PACKAGE_A/src/ | grep -v ':0' -> empty
    WHY: an engine with a host call is untestable and breaks the seam.

I3  THE PHASE DETERMINES THE ACTION, AND DESK B OWNS THE MAPPING.
    prose -> abort+inject · tool-call -> block · tool-result -> isError · post-tool-use -> block
    WHY: only Desk B knows what each host surface can do.
```

## THE MERGE'S PRECONDITION

```
BOTH desks land AND their gates are green AND the invariant pair holds.
THEN: MERGE/THE_MERGE.md — one import, the 4 hooks wired, the integration audit.
NEVER merge a half. The seam exists so the merge is trivial; a premature merge defeats it.
```
