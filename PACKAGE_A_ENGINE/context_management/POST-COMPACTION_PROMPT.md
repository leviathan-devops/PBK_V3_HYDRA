# POST-COMPACTION_PROMPT — PACKAGE A (THE ENGINE)

**Read this FIRST after a compaction.**

## WHERE YOU ARE

Building **THE ENGINE** (Desk A of 2) for the PBK v3 hydra build. The seam is frozen and
type-checks; your 4 waves are planned; nothing is built yet.

## THE READ ORDER

```
1  ../SEAM/SEAM_CONTRACT.md              the boundary
2  PACKAGE_A_DPL1_SPEC.md                the contract
3  PACKAGE_A_WAVE_PLAN.md                WAVES: 4
4  PACKAGE_A_MASTER_BLUEPRINT.md         the design authority
5  context_management/CURRENT_STATE.md   the live state
6  context_management/DECISION_CHAIN.md  A101-A108 (A108 = the migration)
```

## THE SEVEN FACTS YOU MUST NOT RE-DERIVE

```
F1  THE SEAM IS FROZEN. check(req: CheckRequest) -> Promise<CheckResult>.
    sha 66b66a7f10c7c6e737a491b6e0f63903 · tsc --noEmit exit 0. A change invalidates BOTH packages.
F2  YOU TOUCH NO HOST. No ctx, no pi. grep -rc "ctx\|pi\." src/ | grep -v ':0' -> empty.
F3  YOU RE-IMPLEMENT NOTHING. abide's bandFor, checkWithModel, repairReason — IMPORT them.
    kernel-judge.ts (929 L) is the anti-pattern: a re-implementation that never ran.
F4  THE BAND IS DERIVED PER RULE. An inherited band THROWS at load.
F5  A MISSING use: BANK THROWS. The exemptor is mandatory.
F6  THE VENDOR IS NEVER EDITED. A needed change is a patch file beside it.
F7  THE EXISTING 689-L EXTENSION IS MIGRATED, NOT DELETED (A108).
```

## THE HARD STOPS

```
- NO SECRETS in the repo, the chat, or the ledger rows. Reference the key PATH only.
- THE RIG IS NOT THE SHIP. A test verdict is evidence, not a ship.
- A DEAD CARRIER IS NAMED (RIPWIRE_MISSING · OPENGROK_DOWN · GI_NO_STORE) — never fall back.
- NO UNLISTED MODEL.
- THE SEAM IS FROZEN — report a needed change, never edit.
- DESK B'S FILES ARE OFF LIMITS (src/gate/** · src/surfaces/** · src/action/**).
```

## THE FIRST THREE COMMANDS

```bash
bunx tsc --noEmit -p tsconfig.json       # exit 0 — the seam is intact
ls vendor/abide/ 2>/dev/null             # A-1's target (absent until A-1 runs)
bun test -t lexicon_sweep                # A-2's gate (fails until A-2 runs)
```

## THE STOP

```
ALL of: the 8 success criteria green with their output quoted · every wave's gate met in order ·
the invariant grep reads empty · the seam unchanged · the ledger rows present · the docs updated.
Anything less is OPEN.

---

## THE COMPACTION SURVIVAL KIT (the 5 things a fresh agent needs)

```
1  WHERE: PBK_V3_HYDRA/PACKAGE_A_ENGINE/ — Desk A's build package
2  WHAT:  the ENGINE — check(req) -> CheckResult, satisfying ../SEAM/seam.ts v1.0.0
3  WHY:   abide sends EVERY rule to Jev; the lexicon is the deterministic pre-gate that makes
          the judge the EXCEPTION handler. That is the whole point of this desk.
4  HOW:   4 waves (vendor -> lexicon -> lint+ledger -> surface), each gate green before the next
5  THE TRAP: the 929-L kernel-judge.ts re-implementation. Import abide; never re-derive.
```

## THE VERIFICATION STATE AT COMPACTION

```
the seam          FROZEN · sha __SHA__ · tsc exit 0
the vendor        ABSENT
the lexicon       ABSENT
the lint          ABSENT
the surface       ABSENT
the existing ext  689 L · 5/5 green · the migration baseline (A108)
the ttsr carrier  0 native (the empty hook)
```

## THE FIRST ACTION AFTER RESUME

```bash
cd PBK_V3_HYDRA
bunx tsc --noEmit -p tsconfig.json     # confirm the seam is intact
ls vendor/abide/ 2>/dev/null           # has A-1 run?
bun test -t lexicon_sweep 2>/dev/null  # has A-2 run?
# the FIRST failure names the wave to resume at.
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

## THE SEAM'S FULL CONTRACT (paste-ready for a fresh agent)

```ts
// the seam, verbatim (SEAM/seam.ts)
export type Band = "act" | "flag" | "clear";
export type CheckPhase = "edit" | "turn";
export type SrcKind = "own_utterance" | "quotation" | "table" | "doc" | "rule_source";
export type Surface = "prose" | "tool-call" | "tool-result" | "post-tool-use";

export interface CheckRequest {
  surface: Surface; phase: CheckPhase; text: string;
  sourceKind: SrcKind; file?: string; task?: string;
}
export interface Decision {
  ruleId: string; band: Band; probability: number;
  decidedBy: "lexicon" | "jev"; sourceKind: SrcKind;
  span: string; correction: string; capped: boolean;
}
export interface CheckResult {
  decisions: Decision[]; jevCalls: number; total: number; errors: string[];
}
export type CheckFn = (req: CheckRequest) => Promise<CheckResult>;
export interface LedgerRow {
  ruleId: string; band: Band; probability: number;
  decidedBy: "lexicon" | "jev"; sourceKind: SrcKind;
  span: string; action: "abort+inject"|"block"|"isError"|"notice"|"silent";
  capped: boolean; at: string;
}
```

## THE ANTI-PATTERNS (each with its measured cost)

```
A SECOND BAND            kernel-judge.ts re-derived pos/(pos+neg+1) — 929 L, never ran
A SECOND JEV WIRE        kernel-judge.ts re-implemented checkWithModel
AN INVENTED TYPE         kernel-judge.ts: toApiPrimitive('noul') — abide has boolean|choice|score
A COPIED CONSTANT        kernel-judge.ts:53-63 re-declares abide's 8000/2/0.8/0.5
A HOST IMPORT            untestable; breaks the seam
A SILENT SKIP            the #4796 class — a rule that never fires, reporting nothing
AN INHERITED BAND        a fabricated band; the rule's own sweep is the only source
AN EDITED VENDOR         a patch file beside it, with the reason
```

## THE DENSITY NOTE (why this doc is 200+ lines)

A post-compaction prompt's job is to make a fresh agent OPERATIONAL without the prior context. A
50-line prompt leaves gaps the agent fills by guessing — which is how a resumed build drifts. The
length here is the CONTENT (the seam's verbatim types, the anchors, the anti-patterns), not padding.
