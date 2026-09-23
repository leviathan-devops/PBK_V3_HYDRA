# BUILD STATE — PBK v3 HYDRA

Overwrite semantics; the SHA chain grows by append.

## THE SHA CHAIN (the baseline history)

```
88e4f3b   the topology baseline — the seam + both packages + the merge plan committed
26fa25a   master  — the worker-plan (264 L) + gates/merge-gate.sh + .git/hooks/pre-push
9049e83   worker/engine   — W1's anchors (WORKER_SPEC 333 L · WORKER_GOAL 57 L · TODOS 16 L)
df915cd   worker/surfaces — W2's anchors (WORKER_SPEC 343 L · WORKER_GOAL 60 L · TODOS 17 L)
```

## THE ARTIFACT SHAS (the frozen things)

```
SEAM/seam.ts              66b66a7f10c7c6e7... (the first 16 hex) · 192 L · tsc exit 0
lexicon-gate/index.ts     8652 bytes · mtime 2026-09-23 03:35:49
lexicon-gate/lib.ts      12626 bytes · mtime 2026-09-23 03:36:15
lexicon-gate/lib.test.ts  9373 bytes · mtime 2026-09-23 02:00
the rules (9)             mtime 2026-09-23 03:34 · 1266-2008 bytes each
```

## THE MODULE INVENTORY

```
THE SEAM (frozen — both workers build against it)
  SEAM/seam.ts              192 L   the 12 exports + the compile-time exhaustiveness asserts
  SEAM/SEAM_CONTRACT.md      83 L   the boundary document

W1 · THE ENGINE (wt-engine — UNBUILT)
  vendor/abide/**           ABSENT  the vendored engine (abide: schema 8 .ts/530 L · cli 54 .ts/5,581 L)
  src/lexicon/{schema,score,load}.ts   ABSENT
  src/engine/check.ts       ABSENT  the runner order
  src/lint/runner.ts        ABSENT  abide's "Never executed" pattern, executed
  src/ledger/writer.ts      ABSENT  the decidedBy-carrying row
  src/index.ts              ABSENT  check(req) — the public surface

W2 · THE SURFACES (wt-surfaces — UNBUILT)
  src/gate/{source-kind,quote}.ts      ABSENT  the FP shield + the quote-state walk
  src/surfaces/{prose,tool,result,post,stream}.ts  ABSENT  the 4 hooks + the accumulator + the dedupe
  src/action/dispatch.ts    ABSENT  the 4-surface -> the action-kind map
  src/index.ts              ABSENT  the pi.on registrations

THE LIVE EXTENSION (the migration source — NOT a worker's to edit)
  ~/.omp/agent/extensions/lexicon-gate/index.ts  203 L · 6 pi.on registrations
  ~/.omp/agent/extensions/lexicon-gate/lib.ts    307 L · classifySource:81 · isQuotedMatch:288 ·
                                                          SCORABLE:71 · bandOf:127 · loadRules:137
  ~/.omp/agent/extensions/lexicon-gate/lib.test.ts 179 L · 5 pass / 0 fail

THE CANON (this tree)
  context_management/       11 docs (this set)
```

## THE BATTERY NUMBERS (measured this session)

```
the extension suite        bun test (from the extension dir) -> 5 pass / 0 fail · 12 expect()
                           Ran 5 tests across 1 file. [329.00 ms]
the seam                   bunx tsc --noEmit -p tsconfig.json -> exit 0
the merge gate (negative)  bash gates/merge-gate.sh worker/engine wt-engine ->
                           6 checks: tsc PASS · bun test FAIL · 4 PASS -> GATE: FAIL (the control)
the predicates             worker-planning PASS · hydra-workers PASS · worker-spec ×2 PASS
the latency probe          bun run latency-probe.ts -> 0.024 / 0.015 / 0.179 / 0.013 ms per call
```

## THE ORACLE LEDGER (the 15 rows from the worker-plan; each names its producer)

```
| OR-1  | the seam's sha            | sha256sum SEAM/seam.ts                       | 66b66a7f10c7c6e7 ✓ |
| OR-2  | abide has 0 lexicon hits  | grep -rn lexicon abide/packages --include=*.ts | 0 ✓ |
| OR-3  | abide's lint pattern      | grep -c "Never executed" rubric.ts           | 1 ✓ |
| OR-4  | abide has 0 streaming     | grep -rn 'delta' abide/packages --include=*.ts | 0 ✓ |
| OR-5  | the extension's suite     | bun test (extension dir)                     | 5/0 ✓ |
| OR-6  | the engine's purity       | grep -rc "ctx\|pi\." wt-engine/src/          | PENDING (unbuilt) |
| OR-7  | the surfaces' purity      | grep -rc "bandOf\|confidence" wt-surfaces/src/ | PENDING (unbuilt) |
| OR-8  | the lexicon separates     | bun test -t lexicon_sweep                    | PENDING (unbuilt) |
| OR-9  | abide's lint REFUSES      | bun test -t lint_runner                      | PENDING (unbuilt) |
| OR-10 | the gate suppresses 5 FP  | bun test -t source_kind_gate                 | PENDING (unbuilt) |
| OR-11 | the interrupt ABORTS      | the harness: 2 positives -> ctx.abort()      | PENDING (unbuilt) |
| OR-12 | the negatives stay silent | the harness: 3 negatives -> abort=0          | PENDING (unbuilt) |
| OR-13 | the payload carries it    | the harness prints the sendUserMessage payload | PENDING (unbuilt) |
| OR-14 | the combined tree checks  | bunx tsc --noEmit (both halves)              | PENDING (the merge) |
| OR-15 | the ledger records the decider | grep -c '"decidedBy"' .abide/events.jsonl | PENDING (unbuilt) |
```

## THE TEST TIERS (the worker-plan's §W3, per worker)

```
| tier | W1 THE ENGINE | W2 THE SURFACES |
| adversarial (first) | S1 empty · S2 the missing use: · S3 the all-negative · S4 the boundary · S5 the quoted input | S1 the FP control · S2 the fence · S3 the split delta · S4 the repeat storm · S5 the empty text · S6 the missing correction |
| mutation (mandatory) | S6 the ledger append dropped · S7 the weights zeroed | S7 the dedupe removed · S8 the gate bypassed |
| happy (LAST) | S8 the sweep (F1) · S9 the lint (REFUSED) | S9 the 4 surfaces · S10 the inject payload |
| static | S10 the purity (grep EMPTY) | S10 the purity (grep EMPTY) |
```

## THE PASS/FAIL TOKENS (every one bound to a TOOL RESULT, never to prose)

```
| the token | the producing command | the fail token |
| "F1=1.000" | bun test -t lexicon_sweep | "F1=0." |
| "REFUSED" | bun test -t lint_runner | "accepted" |
| "LEXICON_NO_USE" | bun test -t lexicon_load_throws | a default band |
| "decidedBy" | grep -c '"decidedBy"' .abide/events.jsonl | 0 |
| "z.literal(\"lexicon\")" | grep -c in vendor/abide/*.ts | 0 |
| "TOTAL FALSE POSITIVES: 0" | bun test -t source_kind_gate | any FP |
| "CONTROL: 5/5 fired" | bun test -t source_kind_gate | < 5 |
| "abort=1" | bun test -t abort_dedupe | "abort=10" |
| the 4 kinds | bun test -t action_map | a wrong kind |
| "grep: EMPTY" | grep -rc "ctx\|pi\." src/ | any hit |
```

## THE ANTI-PATTERN LEDGER (per worker — each with its mechanical detection)

```
W1: A SILENT ZERO (grep 'return 0') · THE MAGIC BAND (grep '0\.[0-9]\+' then trace to the
    derived band) · THE REIMPLEMENTED VENDOR (diff vs /tmp/abide-repo) · THE HOST LEAK
    (grep -rc "ctx\|pi\.") · THE SILENT FALLBACK (grep 'default\|fallback\|??') · THE UNRUN
    PATTERN (grep 'runLint\|execute') · THE STUB (grep 'TODO\|stub\|INCONCLUSIVE') ·
    THE FAKE TEST (grep "from '../src" tests/)
W2: THE RECOMPUTED BAND (grep 'bandOf\|confidence(') · THE SILENT ABORT (read the ctx.abort
    call site) · THE ABORT STORM (grep 'Set\|seen\|signature' in stream.ts) · THE INDEX-ONLY
    QUOTE CHECK (grep 'indexOf\|startsWith' in quote.ts) · THE PER-DELTA FIRING (grep
    'buffer\|accum') · THE GUESSED ACTION (grep 'surface' in dispatch.ts) · THE STUB · THE
    FAKE TEST
```

## THE MIGRATION MAP (W2 §W11 — the measured vocabulary divergence)

```
the seam     Band = "act" | "flag" | "clear"       (seam.ts:26)   ← the CONTRACT
abide        z.enum(["act","flag","clear"])        (verdict.ts:4)  ← the AUTHORITY
the extension Band = "silent" | "gray" | "fire"    (lib.ts:43)     ← THE OUTLIER

  "fire"   -> "act"        bandOf(c,{low,high})  -> silent|gray|fire     (lib.ts:127)
  "gray"   -> "flag"       bandFor(p,thresholds) -> act|flag|clear       (band.ts:48)
  "silent" -> "clear"      W1 imports NOTHING for the band — the engine returns it.
```

## THE COMMANDS THAT REPRODUCE THIS DOC

```bash
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
git worktree list                                     # the topology
git log --oneline -1 worker/engine worker/surfaces    # the anchor commits
sha256sum SEAM/seam.ts                                # the frozen contract
bash gates/merge-gate.sh worker/engine wt-engine      # the negative control
bun run ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts   # the cost measurement
wc -l ~/.omp/run/lexicon-ledger.jsonl                 # the enforcement's record
```

## THE VENDORING PLAN (W1/D1 in detail — what "vendor abide" means mechanically)

```
THE SOURCE     /tmp/abide-repo/packages/{schema,cli}/src/**
THE TARGET     wt-engine/vendor/abide/
THE PROBLEM    abide's two packages must be vendored so that `bandFor` (cli/src/lib/band.ts:48)
               and the check schema (schema/src/verdict.ts) are available WITHOUT the monorepo.
               The measured fact: schema does NOT import cli (0 hits) — they are independent,
               so vendoring both as one flat dir with relative imports works.
THE STEPS      1. cp the src trees -> vendor/abide/{schema,cli}/
               2. rewrite the intra-abide imports (`@abide/schema` / `../..`) to relative paths
               3. write VENDOR.md with a sha256sum line per copied file
               4. GATE: bunx tsc --noEmit vendor/abide/index.ts -> exit 0
THE ANTI-PATTERN  re-implementing abide's logic instead of copying it. §W5's detection:
               `diff` the vendored file against /tmp/abide-repo — any difference is either a
               deliberate patch (which needs a patch file + a reason) or a reimplementation (banned).
```

## THE MIGRATION PLAN (A108/B108 — what moves where)

```
| the live source | the target | the change |
| lib.ts:81 classifySource | wt-surfaces/src/gate/source-kind.ts | port verbatim + SCORABLE |
| lib.ts:71 SCORABLE | wt-surfaces/src/gate/source-kind.ts | port verbatim |
| lib.ts:288 isQuotedMatch | wt-surfaces/src/gate/quote.ts | port verbatim (the state walk) |
| lib.ts:93 scoreSignals | wt-engine/src/lexicon/score.ts | reimplement against the SEAM's weights |
| lib.ts:123 confidence | wt-engine/src/lexicon/score.ts | the seam's formula |
| lib.ts:127 bandOf | — | DELETED; the engine uses abide's bandFor |
| lib.ts:137 loadRules | wt-engine/src/lexicon/load.ts | port + the lexicon variant |
| lib.ts:195 appendLedger | wt-engine/src/ledger/writer.ts | add the decidedBy field |
| index.ts:83-199 the 6 hooks | wt-surfaces/src/surfaces/*.ts | split into the 4 surface modules |
| the band vocabulary | — | TRANSLATED per W2 §W11 (fire->act, gray->flag, silent->clear) |

SUPERSESSION RULE: the live extension is superseded ONLY after the integration audit is green.
```

## THE COMMAND LOG (every command that produced a number in this doc)

```bash
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
git worktree list
git log --oneline -1 master worker/engine worker/surfaces
sha256sum SEAM/seam.ts ; wc -l SEAM/seam.ts
bunx tsc --noEmit -p tsconfig.json ; echo $?
cd ~/.omp/agent/extensions/lexicon-gate && bun test . && bun run latency-probe.ts
find /tmp/abide-repo/packages -name '*.ts' | wc -l
grep -rn lexicon /tmp/abide-repo/packages --include=*.ts | wc -l
grep -c 'Never executed' /tmp/abide-repo/packages/schema/src/rubric.ts
grep -rn 'delta' /tmp/abide-repo/packages --include=*.ts | wc -l
wc -l ~/.omp/run/lexicon-ledger.jsonl
grep -c FIRE ~/.omp/logs/omp.2026-09-23.191645.log
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh
bash gates/merge-gate.sh worker/engine wt-engine
```
