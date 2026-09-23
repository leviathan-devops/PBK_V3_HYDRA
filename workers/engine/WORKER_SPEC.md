# WORKER SPEC — W1 THE ENGINE

```
Master spec:  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md  (251 L)
Worker-plan:  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/.trident/worker-plan.md  (WORKERS: 2)
Worker:       W1
Worktree:     /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-engine
Branch:       worker/engine
SME domain:   the abide-vendored decision engine + the lexicon pre-gate
```

**This is the FIRST LIVE RUN of the hydra-workers architecture.** This spec is W1's
executable contract. The master spec (Package A) is the SHARED authority; this document
REFERENCES its sections and EXPANDS only what is W1's own. A copy of the master spec here
would be a second source of truth that drifts — the reference is the discipline.

---

## §W0 SCOPE (what THIS worker owns)

**The deliverables, verbatim from the worker-plan:**

```
D1  the vendored abide        (PACKAGE_A §2.1)   the engine, verbatim, in-tree
D2  the lexicon check type    (PACKAGE_A §2.2)   the primary deliverable — check.type "lexicon"
D3  the scorer                (PACKAGE_A §2.3)   abide's bandFor + the 4 weights
D4  the runner order          (PACKAGE_A §2.4)   the lexicon decides; only the gray reaches Jev
D5  the lint runner           (PACKAGE_A §2.4)   abide's "Never executed" pattern EXECUTED
D6  the ledger writer         (PACKAGE_A §2.5)   the row carries decidedBy
D7  the public surface        (PACKAGE_A §2.5)   check(req) exported; NO host reference
```

**The file paths W1 owns (disjoint from W2 by construction):**

```
wt-engine/vendor/abide/**                 the vendored engine (verbatim + VENDOR.md)
wt-engine/src/lexicon/**                  schema.ts · score.ts · load.ts
wt-engine/src/engine/**                   check.ts (the runner order)
wt-engine/src/lint/**                     runner.ts (abide's pattern, executed)
wt-engine/src/ledger/**                   writer.ts (the JSONL append)
wt-engine/src/index.ts                    the public surface (check)
wt-engine/tests/**                        W1's own suite
wt-engine/WORKER_SPEC.md · WORKER_GOAL.md · TODOS.md
```

**The explicit NON-GOALS — W1 MUST NOT touch:**

```
✗ SEAM/seam.ts                    FROZEN. sha 66b66a7f10c7c6e7. Editing it breaks W2.
✗ wt-surfaces/**                  W2's worktree. A cross-worktree write is a scope breach.
✗ ~/.omp/agent/extensions/**      the LIVE extension (689 L, 5/5). MIGRATION is the merge phase.
✗ any ctx.* / pi.* host call      the engine is PURE (T-5). A host import is a FAIL.
✗ the Jev client's transport      W1 writes the CALL SITE, not the transport.
```

## §W1 THE MASTER-SPEC SLICES (references, not copies)

**The Package A sections this worker implements — read them in the tree, do not restate:**

```
PACKAGE_A §2.1 THE VENDOR (F-6, F-8)         -> D1
PACKAGE_A §2.2 THE LEXICON CHECK TYPE (F-1)  -> D2  (the primary deliverable)
PACKAGE_A §2.3 THE SCORER (F-1, F-8)         -> D3
PACKAGE_A §2.4 THE RUNNER ORDER (F-4)        -> D4, D5
PACKAGE_A §2.5 THE ERROR RULES               -> D6, D7
PACKAGE_A §1   THE FAILURE INVENTORY         the EVIDENCE the deliverables answer
PACKAGE_A §3   THE WAVE ORDER                the ORIGINAL wave mapping (now W1's D1-D7)
PACKAGE_A §4   THE TESTING TIERS             §W3 expands these for W1
```

**The GLOBAL LAWS that bind W1 (referenced verbatim from the master spec + the seam):**

```
L1  THE SEAM IS FROZEN — the seam's 12 exports are the contract; W1 implements check()
L2  LOUD FAIL OR CLEAR PASS — a missing `use:` THROWS; no silent default, no fallback
L3  THE ARTIFACT IS THE EVIDENCE — a claim carries sha256sum + the symbol grep
L4  NO HOST REFERENCE — the engine is pure; the surfaces (W2) own the host
L5  VENDOR VERBATIM — abide's code is copied, not reimplemented; VENDOR.md records shas
```

**The interfaces W1 CONSUMES (must exist first — they do):**

```
the frozen seam            SEAM/seam.ts (192 L, sha 66b66a7f10c7c6e7, tsc exit 0)
                           the 12 exports: Band · CheckPhase · Thresholds · RuleStatus ·
                           Verdict · Rule · SrcKind · Surface · PatternFamily ·
                           LexiconRule · CheckRequest · Decision
abide's engine             /tmp/abide-repo/packages/schema/src/*.ts (8 files, 527 L)
                           rubric.ts (204 L) — the "Never executed" pattern's home
                           bandFor (10 band-related hits) — the band function W1 imports
```

**The interfaces W1 PRODUCES (W2 + the merge consume):**

```
check(req: CheckRequest): Promise<Decision>    the public surface (D7) — the seam's shape
the ledger row                                 { Pattern, State{confidence, source_kind,
                                               decidedBy}, Evidence{span, jev} }
the lexicon rule set                           the 9 rules' source (the derived bands)
```

## §W2 THE TASKS (per-task WHAT / HOW / WHY / EXPECTED)

### W1-D1 · THE VENDOR (PACKAGE_A §2.1)

```
WHAT     copy abide's engine into wt-engine/vendor/abide/ + write VENDOR.md
HOW      cp -r /tmp/abide-repo/packages/schema/src/*.ts vendor/abide/ ; record the sha of
         every copied file in VENDOR.md; fix the intra-abide imports to relative paths
WHY      F-6/F-8: abide is a LIBRARY with green tests and ZERO consumers. Vendoring makes it
         the engine's spine instead of a decorative dependency. VENDOR.md is the provenance.
EXPECTED `bunx tsc --noEmit vendor/abide/index.ts` -> exit 0
         VENDOR.md carries a sha256sum line per copied file
```

### W1-D2 · THE LEXICON CHECK TYPE (PACKAGE_A §2.2 — THE PRIMARY DELIVERABLE)

```
WHAT     add `check.type: "lexicon"` to abide's check schema + the LexiconRule handling
HOW      extend the schema's discriminated union with a "lexicon" variant; the variant
         carries PatternFamily + the thresholds; a missing `use:` on a family THROWS
WHY      F-1: the lexicon is the DETECTOR layer. abide has 0 lexicon hits — the type does not
         exist. Without it the engine cannot express a scored rule and the gate is impossible.
EXPECTED `grep -c 'z.literal("lexicon")' vendor/abide/*.ts` -> >= 1
         a lexicon check with no `use:` -> THROWS (never a silent default)
```

### W1-D3 · THE SCORER (PACKAGE_A §2.3)

```
WHAT     the scoreSignals implementation using abide's bandFor + the 4 weights
HOW      import bandFor from the vendored abide (packages/cli/src/lib/band.ts:48 —
         bandFor(probability, thresholds) -> "act"|"flag"|"clear"); THE WEIGHTS ARE THE
         SEAM'S (seam.ts:71-77), NOT INVENTED: descriptive neg += 1 · suggestive pos += 2
         (or +1 without \b) · substitute pos += 2 · use neg += 3;
         confidence = pos/(pos+neg+1); the band {low, high} is DERIVED from the labeled
         corpus, never inherited. THE VOCABULARY: the seam + abide agree on act|flag|clear.
         The LIVE extension's lib.ts:43 uses silent|gray|fire — an OUTLIER. W1 aligns to the
         SEAM; the migration map lives in W2's spec §W11.
WHY      F-8: abide's band function exists (10 hits) but has no caller. Wiring it makes the
         band a MEASURED threshold instead of a magic number.
EXPECTED `bun test -t lexicon_sweep` -> F1=1.000 at the derived band
         `grep -c 'bandFor' src/lexicon/score.ts` -> >= 1 (imported, not reimplemented)
```

### W1-D4 · THE RUNNER ORDER (PACKAGE_A §2.4)

```
WHAT     the check pipeline: source-kind gate -> lexicon score -> the band -> the action
HOW      the deterministic pre-gate FIRST (own_utterance only), then the score, then the
         band: act -> the action; flag -> the flag; clear -> nothing. Only the GRAY reaches Jev.
WHY      F-4: the lint half is dead. The runner order is what makes the lint a real stage
         rather than a function nobody calls.
EXPECTED `bun test -t runner_order` -> the 4 cases produce the right stage transition
```

### W1-D5 · THE LINT RUNNER (PACKAGE_A §2.4 — the lint half comes alive)

```
WHAT     execute abide's rubric pattern (`"Never executed"` — 1 hit in rubric.ts:204L)
HOW      load the rubric, evaluate the pattern against a fixture that contains the phrase,
         and REFUSE the fixture; accept a fixture that does not contain it
WHY      F-4: abide's lint pattern has never run. A pattern that never executes is
         documentation. This is the deliverable that makes it bite.
EXPECTED `bun test -t lint_runner` -> the known-bad REFUSED, the known-good accepted
```

### W1-D6 · THE LEDGER WRITER (PACKAGE_A §2.5)

```
WHAT     the JSONL append carrying { Pattern, State{confidence, source_kind, decidedBy},
         Evidence{span, jev} }
HOW      append-only; the decidedBy field names WHICH layer decided (lexicon|jev|gate);
         a jev:null carries the NAMED reason, never a silent null
WHY      F-5: the live ledger has 37 rows and NO decidedBy field — the decision's author is
         unrecorded. Without it an audit cannot attribute a firing.
EXPECTED `grep -c '"decidedBy"' .abide/events.jsonl` -> >= 1
```

### W1-D7 · THE PUBLIC SURFACE (PACKAGE_A §2.5)

```
WHAT     src/index.ts exporting `check(req: CheckRequest): Promise<Decision>`
HOW      the exported function satisfies the seam's CheckRequest/Decision shapes EXACTLY;
         the engine imports NOTHING from the host
WHY      T-2/T-5: the seam is the contract; purity is what lets W2 own the host without the
         engine knowing it exists.
EXPECTED `grep -c 'export.*check' src/index.ts` -> >= 1
         `grep -rc "ctx\|pi\." src/ | grep -v ':0'` -> EMPTY (the purity invariant)
```

## §W3 TESTING (the worker's own proof obligation)

**The rule: every scenario declares a passToken that MUST appear IN A TOOL RESULT and a
failToken that MUST NOT. The adversarial cases come FIRST; the happy path LAST.**

```
| the scenario | the input | the passToken (in a tool result) | the failToken | the tier |
| S1 adversarial · empty | a check with zero signals | "confidence":0 | "band":"act" | unit |
| S2 adversarial · the missing use: | a family with no use bank | "LEXICON_NO_USE" | a default band | unit |
| S3 adversarial · the all-negative | 3 negatives, 0 positives | "band":"clear" | "abort" | unit |
| S4 adversarial · the boundary | conf exactly at the derived band | the band fires | a miss | unit |
| S5 adversarial · the quoted input | a rule quoted in a doc | "source_kind":"quotation" | "act" | unit |
| S6 mutation · the append dropped | comment out the ledger append | the S6 test MUST go RED | green | unit |
| S7 mutation · the weights zeroed | set every weight to 0 | the S3 test MUST go RED | green | unit |
| S8 happy · the sweep | the labeled corpus | "F1=1.000" | "F1=0." | script |
| S9 happy · the lint | the known-bad fixture | "REFUSED" | "accepted" | script |
| S10 the purity | the whole src/ tree | "grep: EMPTY" | any ctx/pi hit | static |
```

**The mutation check is MANDATORY (S6, S7): a test that does not go red on wrong code proves
nothing. Record the red run's output — a green mutation check is a FAILED mutation check.**

## §W4 SUCCESS CRITERIA (mechanical, per deliverable)

```
| the criterion | the command | the expected output | the oracle |
| SC-1 the vendor compiles | bunx tsc --noEmit vendor/abide/index.ts | exit 0 | OR-2 |
| SC-2 the lexicon type exists | grep -c 'z.literal("lexicon")' vendor/abide/*.ts | >= 1 | OR-8 |
| SC-3 the scorer separates | bun test -t lexicon_sweep | F1=1.000, 0 fail | OR-8 |
| SC-4 the band is abide's | grep -c 'bandFor' src/lexicon/score.ts | >= 1 | OR-8 |
| SC-5 the lint RUNS | bun test -t lint_runner | the known-bad REFUSED | OR-9 |
| SC-6 the ledger attributes | grep -c '"decidedBy"' .abide/events.jsonl | >= 1 | OR-15 |
| SC-7 the surface exports | grep -c 'export.*check' src/index.ts | >= 1 | OR-6 |
| SC-8 the purity holds | grep -rc "ctx\|pi\." src/ \| grep -v ':0' | EMPTY | OR-6 |
| SC-9 the tree type-checks | bunx tsc --noEmit | exit 0 | OR-14 |
| SC-10 no silent default | bun test -t lexicon_load_throws | the throw observed | OR-8 |
```

## §W5 ANTI-PATTERNS (this worker's failure classes, each with its mechanical detection)

```
| the anti-pattern | the mechanical detection | why it is banned here |
| A SILENT ZERO — a count claiming 0 without a scope assertion | grep -n 'return 0\|: 0' src/ then read the call site | the empty-result trap: 0 hits and wrong-scope are the same bytes |
| THE MAGIC BAND — a hardcoded threshold | grep -n '0\.[0-9]\+' src/lexicon/score.ts -> each MUST trace to the derived band | an inherited band is uncalibrated |
| THE REIMPLEMENTED VENDOR — abide's logic rewritten | diff the vendored file against /tmp/abide-repo | F-6: vendoring is COPYING, not paraphrasing |
| THE HOST LEAK — ctx/pi in the engine | grep -rc "ctx\|pi\." src/ | T-5: the engine is pure by contract |
| THE SILENT FALLBACK — a missing use: defaulting | grep -n 'default\|fallback\|??' src/lexicon/load.ts | L2: loud fail, never a substitute |
| THE UNRUN PATTERN — a lint rule defined but never invoked | grep -c 'runLint\|execute' src/lint/runner.ts | F-4: a pattern that never executes is documentation |
| THE STUB — a placeholder standing in for working machinery | grep -rn 'TODO\|stub\|not implemented\|INCONCLUSIVE' src/ vendor/ | the no-stub law: working machinery is ported, never stubbed |
| THE FAKE TEST — a green suite that never imports the artifact | grep -c "from '../src\|from '../../src" tests/*.ts | a test that tests a fixture proves nothing about the engine |
```

## §W6 THE GATE (the worker's done-when)

```
THE WORKER'S GATE — every line must pass, mechanically:

  bunx tsc --noEmit                                  -> exit 0
  bun test                                           -> 0 fail
  bun test -t lexicon_sweep                          -> F1=1.000
  bun test -t lint_runner                            -> the known-bad REFUSED
  bun test -t lexicon_load_throws                    -> the throw observed
  grep -rc "ctx\|pi\." src/ | grep -v ':0'           -> EMPTY
  grep -c '"decidedBy"' .abide/events.jsonl          -> >= 1
  grep -c 'z.literal("lexicon")' vendor/abide/*.ts   -> >= 1

THE PR REQUIRED CHECKS — armed by the orchestrator:
  gates/tsc      bunx tsc --noEmit
  gates/test     bun test
  gates/purity   grep -rc "ctx\|pi\." src/ | grep -v ':0' -> EMPTY

ANCHOR 1 — THE WORKER CANNOT MERGE ITS OWN PR. The branch worker/engine opens a PR into
master; the orchestrator reviews and merges. The worker's last action is the PR, never the
merge. A worker that merges its own branch has bypassed the deny.
```

## §W7 THE TODO ANCHOR (the pinned todo list — Anchor 2)

**These are pinned BEFORE the first action. A todo completes ONLY when its gate lands.**

```
[ ] W1-T1   worktree + branch verified        -> git branch --show-current == worker/engine
[ ] W1-T2   worker spec + goal pin on disk    -> ls WORKER_SPEC.md WORKER_GOAL.md
[ ] W1-T3   D1 the vendored abide             -> bunx tsc --noEmit vendor/abide/index.ts -> 0
[ ] W1-T4   D2 the lexicon check type         -> grep -c 'z.literal("lexicon")' -> >= 1
[ ] W1-T5   D3 the scorer                     -> bun test -t lexicon_sweep -> F1=1.000
[ ] W1-T6   D4+D5 the runner + the lint       -> bun test -t lint_runner -> REFUSED
[ ] W1-T7   D6 the ledger writer              -> grep -c '"decidedBy"' -> >= 1
[ ] W1-T8   D7 the public surface + purity    -> grep -rc "ctx\|pi\." src/ -> EMPTY
[ ] W1-T9   the self-audit §A table executed  -> every row carries a verdict
[ ] W1-T10  the PR opened                     -> the required checks armed
[ ] W1-T11  the PR merged via the gate        -> the orchestrator merges, NOT W1
[ ] W1-T12  canon + ship docs updated         -> the record loop
```

**W1-T11 is IMMUTABLE and NOT the worker's to complete: the orchestrator owns the merge.**
**W1-T12 is IMMUTABLE: a milestone without its record is an unfinished milestone.**

## §W8 THE GOAL PIN (the behavior program — Anchor 3)

```
the pinned goal:  wt-engine/WORKER_GOAL.md
the behavior program: the 7 slots (GOAL · BASELINE · WORKERS · LAWS · HARD STOPS ·
                      PROOF CONTRACT · STOP) + the ONE /goal line
the reload law:   W1 re-asserts the pin's LAWS + PROOF CONTRACT every turn; on compaction
                  W1 reads §W10's pointers and continues — the spec + todos + pin ARE the kit
```

## §W9 THE SELF-AUDIT TABLE (§A from the worker-plan — executed, NEVER improvised)

```
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| vendor/abide/* | vendored verbatim | sha256sum each vs /tmp/abide-repo | OR-2 | _ |
| src/lexicon/schema.ts | the lexicon variant | grep -c 'z.literal("lexicon")' | OR-8 | _ |
| src/lexicon/score.ts | abide's bandFor imported | grep -c 'bandFor' -> >= 1 | OR-8 | _ |
| src/lexicon/load.ts | a missing use: THROWS | bun test -t lexicon_load_throws | OR-8 | _ |
| src/engine/check.ts | the runner order | bun test -t runner_order | OR-8, OR-9 | _ |
| src/lint/runner.ts | abide's pattern EXECUTED | bun test -t lint_runner | OR-9 | _ |
| src/ledger/writer.ts | the row carries decidedBy | grep -c decidedBy | OR-15 | _ |
| src/index.ts | check(req) exported | grep -c 'export.*check' | OR-6 | _ |
| EVERY src file | NO host reference | grep -rc "ctx\|pi\." src/ | OR-6 | _ |
```

**§A is composed AT PLAN TIME and EXECUTED at W1-T9. Composing it after the returns land is
fitting to the evidence — the audit must be able to FAIL.**

## §W10 RESUME POINTERS (compaction survival)

```
READ FIRST on any resume, in this order:

1. wt-engine/WORKER_SPEC.md                 (this file — §W0 scope, §W7 todos)
2. wt-engine/TODOS.md                       (the pinned board; re-derive from §W7 if stale)
3. wt-engine/WORKER_GOAL.md                 (the behavior program)
4. .trident/worker-plan.md                  (the topology; §O the oracles; §A the audit)
5. PACKAGE_A_ENGINE/PACKAGE_A_DPL1_SPEC.md  (§1 the failures, §2.1-2.5 the contracts)
6. SEAM/seam.ts + SEAM/SEAM_CONTRACT.md     (the frozen contract — 192 L, sha 66b66a7f)
7. /tmp/abide-repo/packages/schema/src/     (the vendoring source)

THE RULE: on resume, re-derive the todo list from §W7 — NEVER trust a stale board over the
spec. The spec is the authority; the board is the tracker.
```
