# CURRENT STATE — PBK v3 HYDRA

The truth as of 2026-09-23T05:10+04:00. Overwrite semantics — stale content is REMOVED.

## THE ONE-SENTENCE STATE (re-measured 2026-09-23T15:45)

```
★ SHIP-GRADE EXCEPT FOR TWO OPERATOR/PROVIDER-GATED BLOCKERS.

master       56c55e2   the ship-grade tree: 6 bugs FIXED + re-proven · the cleanup done
the src      15 .ts · tests 3 · vendor 16 · the seam 66b66a7f10c7c6e7 (unchanged)
the gate     bunx tsc --noEmit -> exit 0 · bun test ./tests/ -> 24 pass 0 fail
             ★ THE HONEST COUNT IS 24. A pattern-matched `bun test tests/...` inflates it by
               matching the Checkpoints copies — always measure with the ./ prefix.
the bugs     13 found · 6 FIXED (HT-BUG-3,-4,-5,-6,-10,-15) · HT-BUG-14 found+fixed · 2 BLOCKED

THE FIXES (each re-proven on the real path)
  HT-BUG-3  the exemptor inflection   neg=3 flag   HT-BUG-4  the double-match  2 vs 2
  HT-BUG-5  the process narration     flag         HT-BUG-6  the self-reference  flag
  HT-BUG-10 the audit gate's blind pass  (in source, NOT live)
  HT-BUG-14 the loader read the live rules  9 of 9     HT-BUG-15 the default export  7 hooks
  PRESERVED: the DESIGN instruction still act · the sacred overlap still 0.000

THE TWO BLOCKERS (both OUTSIDE the code)
  B-1 THE AUDIT GATE: (a) its fix needs a NEW process (ESM-cached); (b) the ocr scan is
      RATE-LIMITED (429 on every file). A BLOCKED gate is never upgraded to PASS.
  B-2 THE DEPLOY: the operator's act — W6_DEPLOY_HANDOFF.md. The entry now carries the DEFAULT
      EXPORT, so it CAN load.
```

## THE TOPOLOGY (committed, verified)

```
master          26fa25a   the worker-plan (264 L) + the merge gate + the pre-push deny
worker/engine   9049e83   W1: WORKER_SPEC.md 333 L · WORKER_GOAL.md 57 L · TODOS.md 16 L
worker/surfaces df915cd   W2: WORKER_SPEC.md 343 L · WORKER_GOAL.md 60 L · TODOS.md 17 L

wt-engine    /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-engine    [worker/engine]
wt-surfaces  /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-surfaces  [worker/surfaces]
```

## THE FROZEN SEAM (the contract both workers build against)

```
SEAM/seam.ts              192 L · sha256 66b66a7f10c7c6e7... · `bunx tsc --noEmit` exit 0
SEAM/SEAM_CONTRACT.md     83 L
the 12 exports            Band · CheckPhase · Thresholds · RuleStatus · Verdict · Rule ·
                          SrcKind · Surface · PatternFamily · LexiconRule · CheckRequest ·
                          Decision (+ CheckResult, BandFn)
THE CRITICAL TYPES:
  Band            = "act" | "flag" | "clear"                       (seam.ts:26)
  SrcKind         = own_utterance | quotation | table | doc | rule_source   (seam.ts:61)
  Surface         = prose | tool-call | tool-result | post-tool-use          (seam.ts:64)
  Decision        = {ruleId, band, probability, decidedBy, sourceKind,
                     span, correction, capped}                     (seam.ts:105)
  CheckResult     = {decisions, jevCalls, total, errors}            (seam.ts:120)
THE WEIGHTS (seam.ts:71-77): descriptive neg+=1 · suggestive pos+=2 (or +1 w/o \b) ·
  substitute pos+=2 · use neg+=3 · confidence = pos/(pos+neg+1)
```

## THE LIVE ENFORCEMENT (the measured runtime)

```
the extension    ~/.omp/agent/extensions/lexicon-gate/   index.ts 203 L · lib.ts 307 L ·
                 lib.test.ts 179 L · suite 5 pass / 0 fail / 12 expect() calls
the wiring       ~/.omp/agent/config.yml -> extensions: - .../lexicon-gate/index.ts
the rules        9 files in ~/.omp/agent/rules/ (mtime 03:34) — dist-not-built · fallback-slop ·
                 instruction-not-predicate · phantom-and-claim · record-anchor · scope-shrink ·
                 stale-substrate · theatrical-verification · unwired-edge
the ledger       ~/.omp/run/lexicon-ledger.jsonl — 56 rows
the hooks        6 registered: session_start · message_update · ttsr_triggered · tool_call ·
                 tool_result · agent_end
the Jev wire     LIVE but the account is EMPTY (402) — the designed path is jev:null + a NAMED error
```

## THE LEDGER, MEASURED (the enforcement's own record)

```
by rule:        instruction-not-predicate 23 · scope-shrink 13 · theatrical-verification 9 ·
                record-anchor 8 · dist-not-built 3
by src_kind:    own_utterance 42 · quotation 14     ← the exemptor suppressed 25% of hits
by confidence:  0.67 ×19 · 0.80 ×10 · 0.33 ×9 · 0.00 ×14 · 0.50 ×2 · 0.29 ×2
FIRE events:    14, across 3 pids (191645 ×12, 2458725 ×1, 3993067 ×1)
```

## THE MEASURED GATE COST (latency, 200 iterations × 9 rules)

```
prose (message_update)     0.024 ms/call
tool-input (tool_call)     0.015 ms/call
tool-result (tool_result)  0.179 ms/call   (4 KB — the largest input)
the injected correction    0.013 ms/call
→ at ~1000 deltas/turn the gate costs ~24 ms/turn. NOT a latency source.
```

## THE HOT-RELOAD METHOD (EXPERIMENTALLY PROVEN — the round trip, 2026-09-23 05:54-05:55)

```
THE CORRECTION: the first version of this section INFERRED the mechanism from log correlation
it did not EXPERIMENT. An inference recorded as a measurement is the theatrical class. The
experiment has now been run; this section carries its results.

═══════════════════════════════════════════════════════════════════════════════
THE TWO CHANNELS
═══════════════════════════════════════════════════════════════════════════════

A · RULES (.md files in ~/.omp/agent/rules/) — RELOAD IN-PROCESS, NO RESTART
    THE WIRE       pi.on("session_start", async () => { lastAbort = ""; reload(); })
                   index.ts:83-86
    THE RELOAD     reload() -> loadRules() -> readdirSync(RULES_DIR) + readFileSync per file
                   lib.ts:137-141   ★ DISK IS READ EVERY CALL — nothing is cached
    THE EVIDENCE   `[lexicon-gate] N rules loaded` (index.ts:51)

    ★ THE EXPERIMENT (the round trip, one pid, no restart):
        04:50:39.844  pid 191645  9 rules loaded       ← the process start
        --- plant ~/.omp/agent/rules/zz-probe-reload.md → 10 files on disk ---
        05:54:37.619  pid 191645  runSubagent: reusing parent modelRegistry
        05:54:39.829  pid 191645  10 rules loaded      ← ROUND 1: the ADD was seen
        --- delete the probe → back to 9 files on disk ---
        05:55:24.407  pid 191645  runSubagent: reusing parent modelRegistry
        05:55:24.605  pid 191645  9 rules loaded       ← ROUND 2: the REMOVE was seen
      THE COUNT WENT 9 -> 10 -> 9 IN ONE PID. The reversal brackets the mechanism.

    ★ THE FUNCTION-LEVEL PROOF (same process, no session):
        mutate the frontmatter threshold: 0.3 -> 0.4242 -> 0.3
        loadRules() returned 0.3 -> 0.4242 -> 0.3   ← the re-read saw both
        (Test A, which appended to the BODY, gave a FALSE NEGATIVE — the loader parses only
         the frontmatter, lib.ts:142-147. A probe over an unread field reports "nothing
         happened" and is indistinguishable from a broken loader. See the DEBUG_LOG.)

    ★ THE TRIGGER: session_start fires PER SESSION IN THE PROCESS — not only at process start.
        A SUBAGENT constructs a session in the PARENT process → session_start fires → reload().
        MEASURED: pid 2458725 emitted FIVE load lines, THREE within 8 ms (04:13:04.657/.662/.665),
        immediately after three `runSubagent` lines at 04:13:02. That cluster was the origin of
        this whole investigation — a 3-loads-in-one-second burst is not a user restarting.

B · CODE (index.ts / lib.ts) — NEEDS A NEW PROCESS
    The module is ESM-cached after import. An edit does not reach a running process.
    PROOF: the 03:35-03:36 edits did not appear until pid 191645 started at 04:50:39.
    ★ NOTE: this half was NOT experimentally isolated (running a live code-mutation test was
      not warranted). It is INFERRED from the load-line census: no pid that started before an
      edit reports the post-edit behaviour. Recorded as inferred, not as measured.

═══════════════════════════════════════════════════════════════════════════════
THE OPERATING PROCEDURE
═══════════════════════════════════════════════════════════════════════════════
  a RULE edit takes effect at the NEXT session construction:
     - a new omp process, OR
     - a SUBAGENT spawn in the same process (measured)
     → practical: edit a rule, spawn any trivial subagent, read the load line.
  a CODE edit takes effect ONLY in a NEW process.
  THE LOAD LINE IS THE ONLY PROOF. Grep for it; never assume a reload happened.
```

## WHAT EXISTS vs WHAT IS ABSENT

```
EXISTS (verified this session)
  the frozen seam, tsc-clean, sha 66b66a7f10c7c6e7
  the 2 worktrees + 2 branches + the 3 committed anchor sets
  the worker-plan (264 L) + the merge gate (20 L) + the pre-push deny (11 L)
  the 4 predicates: worker-planning PASS · hydra-workers PASS · worker-spec ×2 PASS
  the live extension (689 L, 5/5 green) + 9 rules + the ledger (56 rows)
  the 2 canon logs (132 L / 107 L, 7 entries each)

ABSENT (the build's remaining work)
  wt-engine/src/**        0 entries — D1-D7 unbuilt
  wt-surfaces/src/**      0 entries — D1-D7 unbuilt
  the merge               0 — the two halves have never met
  the vendored abide      not yet copied into wt-engine/vendor/
  the create-pin overhaul the 2 CREATE_PROMPTs still describe WAVES (4 wave mentions each)
  a GitHub remote         0 remotes — Anchor 1 is the local gate until a remote is authorised
```

## THE PREDICATES (run them; do not trust this doc)

```bash
bash ~/.omp/agent/managed-skills/worker-planning/scripts/check.sh .trident/worker-plan.md
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-engine/WORKER_SPEC.md
bash ~/.omp/agent/managed-skills/worker-spec/scripts/check.sh wt-surfaces/WORKER_SPEC.md
bash ~/.omp/agent/managed-skills/hydra-workers/scripts/check.sh      # from the project root
bash gates/merge-gate.sh worker/engine wt-engine                      # the negative control
```

## THE WORKER COLUMNS (the 8 per worker — a row missing any is a wave in costume)

```
| column | W1 THE ENGINE | W2 THE SURFACES |
| Worktree | wt-engine | wt-surfaces |
| Branch | worker/engine | worker/surfaces |
| SME domain | the abide-vendored decision engine + the lexicon pre-gate | the OMP host surfaces + the streaming interrupt |
| Files (disjoint) | vendor/abide/** · src/{lexicon,engine,lint,ledger}/** · src/index.ts | src/{gate,surfaces,action}/** · src/index.ts |
| Goal pin | wt-engine/WORKER_GOAL.md (57 L) | wt-surfaces/WORKER_GOAL.md (60 L) |
| Todos | wt-engine/TODOS.md (12 rows) | wt-surfaces/TODOS.md (13 rows) |
| Gate | tsc + F1=1.000 + the lint REFUSED + the purity grep | tsc + 0 FP + 2 abort/3 silent + the purity grep |
| Oracle rows | OR-2,3,5,6,8,9,15 (7) | OR-4,5,7,10,11,12,13 (7) |
```

## THE THREE ANCHORS (the mechanism that makes a worker unable to silently stop)

```
ANCHOR 1 · THE MERGE GATE — gates/merge-gate.sh (6 predicates) + .git/hooks/pre-push
  the worker opens a PR; the orchestrator merges. A direct push to master is BLOCKED.
  MEASURED: the gate FAILS on the empty branches (bun test) — a gate that can fail.
  NOTE: 0 git remotes are configured. On a real remote GitHub owns the deny; locally the
  orchestrator's script is the deny. Creating a remote on the operator's account is an
  external side effect NOT taken without an explicit order.

ANCHOR 2 · THE PINNED TODO LIST — TODOS.md in each tree, every row naming its gate
  W1-T11 (`the PR merged via the gate`) and W2-T12 are IMMUTABLE and NOT the worker's to
  complete. W1-T12 / W2-T13 (`canon + ship docs updated`) are IMMUTABLE record-loop rows.

ANCHOR 3 · THE PINNED GOAL LOOP — WORKER_GOAL.md, the 7 slots + ONE /goal line
  GOAL · BASELINE (measured) · WORKERS · LAWS (L1-L7) · HARD STOPS · PROOF CONTRACT · STOP
  the reload law: the worker re-asserts LAWS + PROOF CONTRACT every turn.
```

## THE DEPENDENCY GRAPH (no edge between the workers — the seam is the only shared surface)

```
W1 (wt-engine)  ----+                                  NO EDGE W1 <-> W2:
                    |                                  both build against the FROZEN SEAM.
                    +--> W3 THE MERGE  <----+          The merge is the FIRST time the two
                    |      (the orchestrator) |         halves meet — and it is the
W2 (wt-surfaces) ---+                         |         ORCHESTRATOR's job, not a worker's.
                                              |
   the seam (master) -------------------------+
```

## THE HONEST GAPS (what is NOT true yet)

```
- the engine and the surfaces are UNBUILT — both src/ trees are empty
- the vendored abide has not been copied; VENDOR.md does not exist
- the corpus sweep that DERIVES the band has not run — the F1=1.000 claim is unproven
- abide's lint pattern has still never executed
- the merge has never been attempted; the two halves have never been type-checked together
- the create-pin overhaul is INCOMPLETE: both CREATE_PROMPTs still describe WAVES
- no GitHub remote exists; Anchor 1 is local-only
- the 14 c=0.000 ledger rows (the gate re-scoring its own correction) are UNFIXED — a
  proposed source edit, deliberately not applied to live enforcement without a test round
```

## THE HOST ENVIRONMENT (the runtime this build lands on)

```
the harness      omp (oh-my-pi) · the TUI at Orca 1.4.205 · the model verboo/deepseek-v4.1-flash
the omp home     /home/leviathan/.omp/agent/
the extensions   config.yml `extensions:` lists 7 entries; lexicon-gate/index.ts is the 7th
the loader law   a DIRECT *.ts/*.js in extensions/ loads; a SUBDIRECTORY loads its index.ts;
                 there is NO recursion beyond one level (a nested package needs its own manifest)
the hot-reload   rules in-process at session_start; code only with a new process
the ledger       ~/.omp/run/lexicon-ledger.jsonl (the decision record)
the logs         ~/.omp/logs/omp.<date>.<pid>.log (one per process)
the rules dir    ~/.omp/agent/rules/*.md (9 files; the discovery provider `native` reads
                 getAgentDir()/rules — a rule written anywhere else is INERT)
```

## THE EXISTING EXTENSION, LINE BY LINE (the migration source W2 ports from)

```
index.ts:83     pi.on("session_start", async () => { lastAbort = ""; reload(); })
index.ts:93     pi.on("message_update", async (event, ctx) => { ... ctx.abort() ... })
index.ts:129    pi.sendUserMessage(...)   ← the correction delivery channel
index.ts:161    pi.on("ttsr_triggered", ...)
index.ts:170    pi.on("tool_call", ...)   ← returns {block: true, reason} on a fire hit
index.ts:184    pi.on("tool_result", ...) ← returns {isError: true, content}; the "doc" fix
index.ts:199    pi.on("agent_end", ...)

lib.ts:51       FROZEN = "// ── FROZEN INTERFACE ABOVE — DO NOT EDIT ──"
lib.ts:59       stripInlineFlags(p)
lib.ts:64       compileLexiconPattern(p)
lib.ts:71       SCORABLE = new Set(["own_utterance"])          ← the FP shield
lib.ts:73       RULES_DIR = ~/.omp/agent/rules
lib.ts:74       LEDGER_PATH = ~/.omp/run/lexicon-ledger.jsonl
lib.ts:81       classifySource(line, inFence, fileKind): SrcKind
lib.ts:93       scoreSignals(text, f): {pos, neg, hit}
lib.ts:123      confidence(pos, neg) = pos/(pos+neg+1)
lib.ts:127      bandOf(c, {low,high}): silent | gray | fire    ← the OUTLIER vocabulary
lib.ts:137      loadRules(dir) — THROWS on an invalid regex, a missing use:, or empty condition
lib.ts:179      resolveKey()
lib.ts:195      appendLedger(row, ledgerPath)
lib.ts:288      isQuotedMatch(line, match) — the quote-STATE walk (not an index check)
```

## THE DANGERS THIS SESSION MEASURED (read before touching the extension)

```
1  THE EVIDENCE-QUOTING RECURSION — writing the record of a blocked shape re-contains the
   trigger phrase. The gate scores tool INPUTS (index.ts:170), so a doc or a test file that
   quotes a banned frame can be scored. MITIGATION: describe shapes in prose; never paste a
   literal trigger frame into a tool input that is not itself a test fixture.
2  THE CORRECTION RE-SCORE — the gate's own injected correction re-enters as own_utterance
   (14 rows at c=0.000). PROPOSED FIX: a sentinel marking injected text, resolved by
   classifySource to `doc`. NOT YET APPLIED.
3  THE VOCABULARY DIVERGENCE — silent|gray|fire vs act|flag|clear. A port that ignores it
   silently mistranslates every band.
4  THE PER-DELTA COST — message_update fires per delta; the 4 KB slice(0,4000) cap is what
   keeps the cost flat (0.024 ms). Removing the cap would scale with delta size.
```
