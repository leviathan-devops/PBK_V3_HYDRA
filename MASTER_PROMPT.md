# MASTER PROMPT — THE PBK v3 HYDRA WORKER BUILD

The depth document. The PIN (<=200 lines) points here. A fresh session reads THIS after the pin.

---

## §1 · WHAT THIS IS

Build PBK v3 — a deterministic enforcement pipeline — using the hydra-workers topology. TWO
workers, each owning ONE git worktree, building in PARALLEL against a FROZEN SEAM.

★ THE PRODUCT NOW EXISTS AND IS GREEN. The two workers built; the orchestrator MERGED them.
THE OPERABLE TARGET IS THE REPO ROOT, not the worktrees:

```
the merged tree     /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
  src/              15 .ts — the engine + the surfaces + the merged entry
  vendor/abide/     16 .ts (the vendored engine)
  tests/            the suite
  SEAM/seam.ts      the FROZEN contract
the acceptance commands (run FROM THE REPO ROOT):
  bunx tsc --noEmit        -> exit 0
  bun test tests/          -> 40 pass 0 fail
  the 8 named selectors    -> lexicon_sweep · lint_runner · lexicon_load_throws · source_kind_gate
                              · quote_state · abort_dedupe · action_map · delta_accumulator
```
The worktrees (`wt-engine/`, `wt-surfaces/`) still exist and their branches are intact — they are
the HISTORY of the build, not the runnable target.

**The mission in one sentence:** make `check(req: CheckRequest): Promise<Decision>` exist in
`wt-engine` and make it REACHABLE on the OMP host from `wt-surfaces`, then merge the halves and
prove the enforcement fires on a live session.

## §2 · THE FROZEN CONTRACT (the only shared surface)

```
SEAM/seam.ts              192 L · sha256 66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d · `bunx tsc --noEmit` exit 0
                           FROZEN — neither worker edits it; the merge gate checks its sha

THE 12 EXPORTS
  Band         = "act" | "flag" | "clear"                       (seam.ts:26)
  CheckPhase   = "edit" | "turn"                                (seam.ts:29)
  Thresholds · RuleStatus · Verdict · Rule                      (seam.ts:32,38,41,49)
  SrcKind      = own_utterance | quotation | table | doc | rule_source   (seam.ts:61)
  Surface      = prose | tool-call | tool-result | post-tool-use          (seam.ts:64)
  PatternFamily { descriptive · suggestive · substitute? · use? }       (seam.ts:71)
  LexiconRule { id · body · description · scope · lexicon · threshold · band }  (seam.ts:79)
  CheckRequest { surface · phase · text · sourceKind · file? · task? }  (seam.ts:90)
  Decision     { ruleId · band · probability · decidedBy · sourceKind · span ·
                 correction · capped }                         (seam.ts:105)
  CheckResult  { decisions · jevCalls · total · errors }       (seam.ts:120)
  BandFn                                                        (seam.ts:136)

THE WEIGHTS (seam.ts:71-77) — THE ONLY PLACE A SCORE IS DEFINED
  descriptive  neg += 1        the legitimate co-context
  suggestive   pos += 2        (or +1 without \b)  the violation shape
  substitute   pos += 2        the theatrical tell
  use          neg += 3        THE EXEMPTOR — mandatory
  confidence = pos / (pos + neg + 1)
  the band { low, high } is DERIVED from a labeled corpus, NEVER inherited
```

## §3 · THE TWO WORKERS (the topology, committed)

```
master           343dbb7   THE MERGED TREE (the engine + the surfaces in ONE src/)
worker/engine    9049e83   W1: WORKER_SPEC.md 333 L · WORKER_GOAL.md 57 L · TODOS.md 12 rows
worker/surfaces  df915cd   W2: WORKER_SPEC.md 343 L · WORKER_GOAL.md 60 L · TODOS.md 13 rows

wt-engine    /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-engine    [worker/engine]
wt-surfaces  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-surfaces  [worker/surfaces]

NO EDGE BETWEEN THEM. Both build against the seam. The merge is the orchestrator's act.
```

**W1 · THE ENGINE** — SME: the abide-vendored decision engine + the lexicon pre-gate.
Owns `vendor/abide/**` · `src/{lexicon,engine,lint,ledger}/**` · `src/index.ts`.
D1 the vendored abide · D2 the lexicon check type · D3 the scorer · D4 the runner order ·
D5 the lint runner · D6 the ledger writer · D7 the public surface (`check(req)`).
Gate: `tsc` exit 0 · `F1=1.000` · the lint REFUSED · `grep -rc "ctx\|pi\." src/` EMPTY.

**W2 · THE SURFACES** — SME: the OMP host surfaces + the streaming interrupt (abide has NO
equivalent — 0 delta hits measured).
Owns `src/{gate,surfaces,action}/**` · `src/index.ts`.
D1 the source-kind gate · D2 the quote-state machine · D3 the four hooks · D4 the delta
accumulator · D5 the abort dedupe · D6 the action dispatch · D7 the entry.
Gate: `tsc` exit 0 · 0 FP + 5/5 controls · 2 abort / 3 silent · `grep -rc "bandOf\|confidence"
src/` EMPTY.

## §4 · THE 15 ORACLE ROWS (the measurement contract — they stay IN THE PLAN)

```
OR-1  the seam's sha                  66b66a7f10c7c6e7                    ✓
OR-2  abide has 0 lexicon hits        0                                    ✓
OR-3  abide's lint pattern            1 ("Never executed" in rubric.ts)    ✓
OR-4  abide has 0 streaming hits      0                                    ✓
OR-5  the extension's suite           5 pass / 0 fail (SOURCE scope)       ✓
OR-6  the engine's purity             grep -rc "ctx\|pi\." wt-engine/src/   PENDING
OR-7  the surfaces' purity            grep -rc "bandOf\|confidence" …      PENDING
OR-8  the lexicon separates           bun test -t lexicon_sweep -> F1=1.000 PENDING
OR-9  abide's lint REFUSES            bun test -t lint_runner -> exit 1     PENDING
OR-10 the gate suppresses 5 FP        bun test -t source_kind_gate          PENDING
OR-11 the interrupt ABORTS            the harness: 2 positives              PENDING
OR-12 the negatives stay silent       the harness: 3 negatives              PENDING
OR-13 the payload carries it          the harness prints the payload        PENDING
OR-14 the combined tree checks        bunx tsc --noEmit (both halves)       PENDING
OR-15 the ledger records the decider  grep -c decidedBy -> >= 1             PENDING

★ ALL 15 CARRY A VALUE NOW (the merge moved the 10 PENDING).
  OR-6 the engine's purity EMPTY · OR-7 the surfaces' purity EMPTY · OR-8 F1=1.000
  OR-9 the lint REFUSED · OR-10 the gate suppresses · OR-11 the interrupt ABORTS
  OR-12 the negatives silent · OR-13 the payload carries it · OR-14 the combined tsc exit 0
  OR-15 the ledger records decidedBy. Measured at master 343dbb7.
```

## §5 · THE MIGRATION VOCABULARY (the measured three-way divergence)

```
the seam     Band = "act" | "flag" | "clear"       (seam.ts:26)   ← the CONTRACT
abide        z.enum(["act","flag","clear"])        (verdict.ts:4)  ← the AUTHORITY
the extension Band = "silent" | "gray" | "fire"    (lib.ts:43)     ← THE OUTLIER

  "fire"   -> "act"      bandOf(c,{low,high})  -> silent|gray|fire    (lib.ts:127)
  "gray"   -> "flag"     bandFor(p,thresholds) -> act|flag|clear        (band.ts:48)
  "silent" -> "clear"    W1 imports NOTHING for the band — the engine returns it.
```

## §6 · THE LIVE ENFORCEMENT (the artifact under test + the migration source)

```
~/.omp/agent/extensions/lexicon-gate/
  index.ts      221 L · sha 1122308d41ba11a8 · mtime 2026-09-23 06:08:08 · 7 pi.on hooks
  lib.ts        307 L · sha 4530b5f1ca9e046a
  lib.test.ts   179 L
~/.omp/agent/rules/          9 rule files
~/.omp/run/lexicon-ledger.jsonl   131 rows (jev:null on ALL — the 402)
~/.omp/logs/omp.2026-09-23.191645.log   the campaign's process log

★ THE PEDIGREE FIX IS IN SOURCE AND **NOT LIVE** — the running process (started 04:50:25)
  predates the edit (mtime 06:08:08). The module is ESM-cached.
★ THE GRAY ZONE HAS NEVER BEEN JUDGED — 0 of 131 rows returned a Jev value (402, no credits).
```

## §7 · THE KNOWN DEFECTS (fix these; they are the build's own backlog)

```
HT-BUG-1   the delivery channel impersonates the operator   HIGH    FIXED in source, NOT live
HT-BUG-2   the gate scores its own injected correction      MEDIUM  FIXED in source, NOT live
HT-BUG-3   the exemptor misses inflections ("exits")        MEDIUM  OPEN  (W3)
HT-BUG-4   the double-match makes confidence two-valued     LOW-MED OPEN  (W4)
HT-BUG-5   the rule fires on process narration (19/24)      MEDIUM  OPEN  (W4/W7)
HT-BUG-6   the self-reference loop                          MEDIUM  OPEN  (W5)
HT-BUG-7   the gray zone has never been judged              MEDIUM  BLOCKED (402)
HT-BUG-8   the fix is not live                              INFO    KNOWN
HT-BUG-9   a harness built during a meta-observation round  LOW     CORRECTED
HT-BUG-10  the audit gate returned a blind PASS             CRITICAL OPEN  (the gate must fail
                                                                    LOUD when filesReviewed is
                                                                    unresolved or zero)

★ HT-BUG-10 IS THE HIGHEST-SEVERITY FINDING OF THE CAMPAIGN: the audit gate returned
  `GATE: PASS (0 critical/high)` with `filesReviewed=?` while its OWN artifact recorded
  `status: completed_with_errors`, `comments: 10`, and a 429 — and it reviewed ANOTHER
  PROJECT's files. The summary line and the artifact were not derived from the same data.
```

## §8 · THE FOUR CONTINUOUS LOOPS (they run ACROSS phases, not inside one)

```
THE AUDIT LOOP    a subagent's return is a CLAIM. Per-hunk WHAT/WHY/HOW + a verdict, then
                  YOUR mechanical re-verify (tsc/battery/casts) on the combined tree.
THE DOC LOOP      canon + ship docs update at the MOMENT of work. The 2 canon logs + the 2
                  ship logs (DEBUG_LOG, FAILURE_LOG) update FIRST.
THE DEFECT LOOP   every bug fixed in place, re-proven on the REAL path, pinned as a
                  regression, logged. An unlogged fix is an un-learned lesson.
THE DERAILMENT LOOP  the pin names the known failures; the runner recognizes them instead
                  of re-living them.
```

## §9 · THE OPERATOR'S DIRECTIVE, VERBATIM

> "ok give me the prompt to pin so you can use the factory to build everything and update
> canon/ship docs regularly throughout"

**Three commitments follow, and they govern this run:**
1. **USE THE FACTORY** — the hydra-workers topology already built. Dispatch W1 and W2. Do not
   re-architect; do not build serially by hand.
2. **BUILD EVERYTHING** — all 14 deliverables (7 per worker), both halves merged, the
   migration, then the live round. Not a subset.
3. **UPDATE CANON/SHIP DOCS REGULARLY THROUGHOUT** — the record loop fires after EVERY
   completed todo, never at session end. A todo without its doc entry is an UNFINISHED todo.

## §10 · THE ORCHESTRATION LOOP (how to run the two workers)

```
1 DISPATCH   write nothing more; the specs + pins + todos are ON DISK. Spawn W1 and W2 in
             ONE batch (the task tool, two items). Each worker reads its own WORKER_SPEC.md.
2 RUN THE CO. while they work: audit returns, prep the merge, arm the gate, update the docs.
3 DECIDE     per stream-state:
               stream   -> leave alone (working)
               idle     -> kick (resume the SAME history)
               complete -> the integrity gate, then the §A per-hunk audit
               drift    -> steer (naming the file and the defect)
               frozen   -> read the stream tail BEFORE any kill
4 GATE       the PR + the required checks. THE ORCHESTRATOR MERGES, NEVER THE WORKER.
5 RECORD     canon + ship docs after EVERY milestone.
```

**The unignorable form:** a dispatched worker you are not monitoring is an abandoned worker,
and an abandoned worker is a stalled build wearing progress as a costume.

## §11 · THE RESUME POINTERS (a fresh session starts here)

```
1  THIS FILE (MASTER_PROMPT.md) — the depth
2  .trident/worker-plan.md — the topology, the 15 oracles, the §A audit table
3  wt-engine/WORKER_SPEC.md · wt-surfaces/WORKER_SPEC.md — the two contracts
4  wt-engine/WORKER_GOAL.md · wt-surfaces/WORKER_GOAL.md — the two behavior programs
5  context_management/COMPACTION_SURVIVAL.md — the state + the 10 operating laws
6  the ship docs: BUILD_REPORT · DEBUG_LOG · FAILURE_LOG · TESTING_LOG · THEATRICALITY_LOG
7  the corpus: derailment-data-log.md · host-test-failure-log.md (10 bugs)
8  the audits: ZERO_TRUST_AUDIT.md · the AUDIT GATE line in TESTING_LOG.md
9  SEAM/seam.ts — the frozen contract
10 the predicates (re-run them; do not trust the docs):
     bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
     bash gates/merge-gate.sh worker/engine wt-engine        # the negative control
```
