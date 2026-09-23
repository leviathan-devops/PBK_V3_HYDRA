# TESTING LOG — THE HYDRA BUILD + THE LEXICON-GATE CAMPAIGN

TWO ZONES, maintained independently.
ZONE 1 — THE TEST PLAN (what needs testing): written BEFORE the test runs.
ZONE 2 — THE TEST RESULTS (what was observed): appended AFTER, with the raw output.
The `Status:` line of a plan entry is the ONLY mutable field.

---

# ZONE 1 — THE TEST PLAN

## TEST PLAN ENTRY — 2026-09-23 — THE LEXICON-GATE'S DELIVERY PEDIGREE

### HOST
- **What:** a firing must arrive with a provenance that is NOT the operator's voice.
- **How:** fire the gate on a real span; read the session JSONL for the message's ROLE; inspect
  the harness's rendering of the custom entry.
- **PASS criteria:** the delivered message is a CUSTOM entry (`customType` present), NOT a
  user-role message. Token: `"role":"user"` count for gate notices == 0.
- **FAIL criteria:** any gate notice with `"role":"user"`.
- **Status:** PENDING

## TEST PLAN ENTRY — 2026-09-23 — THE HOT-RELOAD ROUND TRIP

### HOST
- **What:** a rule file added/removed on disk is observed by a RUNNING process without a restart.
- **How:** plant an inert probe rule; trigger `session_start` (spawn a subagent); read the load
  line; delete the probe; trigger again; read again.
- **PASS criteria:** the load line's N goes 9 → 10 → 9 IN ONE PID.
- **FAIL criteria:** the N never changes (cached), or the pid changes (a restart, which proves
  nothing about in-process reload).
- **Status:** PASSED

## TEST PLAN ENTRY — 2026-09-23 — THE MERGE GATE'S NEGATIVE CONTROL

### SCRIPT
- **What:** the merge gate must be able to FAIL.
- **How:** run `gates/merge-gate.sh` against an empty branch.
- **PASS criteria:** the script prints `GATE: FAIL` and exits nonzero.
- **FAIL criteria:** a PASS on an empty tree (a rubber stamp).
- **Status:** PASSED

## TEST PLAN ENTRY — 2026-09-23 — THE TOPOLOGY PREDICATES

### SCRIPT
- **What:** the worker topology is mechanically dispatchable.
- **How:** the three managed-skill predicates.
- **PASS criteria:** all four exit 0 with a PASS line.
- **FAIL criteria:** any exit nonzero.
- **Status:** PASSED

## TEST PLAN ENTRY — 2026-09-23 — THE CODE AUDIT GATE

### SCRIPT
- **What:** an independent code audit of the changed surface.
- **How:** `qwen-code-audit` (Alibaba OpenCodeReview).
- **PASS criteria:** the verdict line reads PASS with `0 critical/high` (the literal string is
  deliberately NOT reproduced here — see the note below).
- **FAIL criteria:** the verdict line reads FAIL (blocking findings) or BLOCKED (a degraded run —
  never upgraded to PASS).
- **Status:** PENDING

---

# ZONE 2 — THE TEST RESULTS

## TEST RESULT — 2026-09-23 — THE HOT-RELOAD ROUND TRIP

### HOST
- **The run (verbatim):** the probe planted at `~/.omp/agent/rules/zz-probe-reload.md`; a
  `sonic` subagent spawned; the log read; the probe deleted; a second subagent spawned; the log
  read again.
- **The raw output (the load lines from ONE pid, pid 191645):**
```
  04:50:39.844  pid 191645   9 rules loaded      <- the process start
  05:54:37.619  pid 191645   runSubagent: reusing parent modelRegistry; skipping refresh
  05:54:39.829  pid 191645  10 rules loaded      <- ROUND 1: THE ADD, seen in-process
  05:55:24.407  pid 191645   runSubagent: reusing parent modelRegistry; skipping refresh
  05:55:24.605  pid 191645   9 rules loaded      <- ROUND 2: THE REMOVE, seen in-process
```
- **The verdict:** **PASS** — the count went 9 → 10 → 9 in ONE PID with NO RESTART. The reversal
  brackets the mechanism (a one-way effect could be a fresh process; the add AND the remove
  cannot).
- **The artifacts:** `~/.omp/logs/omp.2026-09-23.191645.log`; the source
  `pi.on("session_start", () => { lastAbort=""; reload(); })` at `index.ts:83-86`; `loadRules()` at
  `lib.ts:137-141` (readdirSync + readFileSync — disk read every call).

## TEST RESULT — 2026-09-23 — THE FUNCTION-LEVEL PROBE (incl. the false negative)

### SCRIPT
- **The run (verbatim):** `bun run reload-test2.ts` from the extension dir — mutate the
  frontmatter `threshold`, re-call `loadRules()` in the SAME process, restore.
- **The raw output:**
```
  before:   {"s":3,"u":1,"t":0.3}
  after:    {"s":3,"u":1,"t":0.4242}
  restored: {"s":3,"u":1,"t":0.3}
  ★ the in-process re-read SAW the mutation: YES
  ★ the restore was SAW too:              YES
```
  AND the FALSE NEGATIVE (Test A, appending to the body): `[1] 123 · [2] 123 · [3] 123 → NO`.
- **The verdict:** **PASS** (the loader is uncached) — and the false negative is itself a recorded
  result: the instrument was validated only after it was caught lying.
- **The artifacts:** the probe scripts (deleted after use — see the THEATRICALITY_LOG TH-7).

## TEST RESULT — 2026-09-23 — THE MERGE GATE'S NEGATIVE CONTROL

### SCRIPT
- **The run (verbatim):** `bash gates/merge-gate.sh worker/engine wt-engine` on the EMPTY branches.
- **The raw output:**
```
  tsc --noEmit                                         PASS
  bun test                                             FAIL
  no host ref in the engine                            PASS
  no band in the surfaces                              PASS
  the seam is untouched                                PASS
  the branch is not master                             PASS

GATE: FAIL — DO NOT MERGE
```
- **The verdict:** **PASS** (the gate bit). A gate that has never failed has never been tested.
- **The artifacts:** `gates/merge-gate.sh` (20 L).

## TEST RESULT — 2026-09-23 — THE TOPOLOGY PREDICATES

### SCRIPT
- **The run (verbatim):** the three managed-skill predicates, with args and the correct cwd.
- **The raw output:**
```
  PASS: worker-plan dispatchable (... WORKERS=2, oracle rows=15, T-refs=32)     exit 0
  PASS: worker-spec armable (wt-engine/WORKER_SPEC.md)                          exit 0
  PASS: worker-spec armable (wt-surfaces/WORKER_SPEC.md)                        exit 0
  PASS: worker topology verified (./.trident/worker-plan.md)                    exit 0
```
- **The verdict:** **PASS.**
- **The artifacts:** the three `scripts/check.sh` under `~/.omp/agent/managed-skills/`.

## TEST RESULT — 2026-09-23 — THE EXTENSION'S SUITE (with its SCOPE stated)

### SCRIPT
- **The run (verbatim):** `cd ~/.omp/agent/extensions/lexicon-gate && bun test .`
- **The raw output:** `5 pass · 0 fail · 12 expect() calls · Ran 5 tests across 1 file. [326.00ms]`
- **★ THE SCOPE — WHAT THIS DOES AND DOES NOT PROVE:** the suite imports `lib.ts` (the SOURCE
  module). It does **NOT** import the deployed/running bundle, because omp loads the `.ts`
  directly and there is no compiled artifact. It proves the PURE FUNCTIONS behave; it proves
  NOTHING about the hooks' runtime behaviour, the rendering, or the live firing path. A green
  claim about the source is not a green claim about the runtime.
- **The verdict:** **PASS (source-scope only).**
- **The artifacts:** `lib.test.ts` (179 L).

## TEST RESULT — 2026-09-23 — THE PEDIGREE UNIT PROOF (with its SCOPE stated)

### SCRIPT
- **The run (verbatim):** `bun run pedigree.test.ts` — a fake-`pi` harness registering the
  extension, firing the stream hook, asserting WHICH CHANNEL was called.
- **The raw output:**
```
  hooks registered: session_start, input, message_update, ttsr_triggered, tool_call, tool_result, agent_end
  ctx.abort() called: true
  channel calls: 1
    -> sendMessage
         customType: "ttsr-injection"
         display:    true
         args[1]:    {"deliverAs":"steer"}
  used sendMessage (the pedigree channel):  true
  used sendUserMessage (the impersonator):  false
  PASS: the injection carries the proper pedigree
```
- **★ THE SCOPE — WHAT THIS DOES AND DOES NOT PROVE:** it proves the CODE SELECTS the right
  channel. It does **NOT** prove the harness RENDERS it — that requires a NEW PROCESS (the
  running one is ESM-cached). **The rendered behaviour is UNOBSERVED.** A harness is a UNIT test,
  not live observation.
- **The verdict:** **PASS (unit-scope only).** The runtime rendering: **UNOBSERVED.**
- **The artifacts:** `pedigree.test.ts` (deleted after use — see TH-7).

## TEST RESULT — 2026-09-23 — THE CODE AUDIT GATE

### SCRIPT
- **The run:** `qwen-code-audit` — see the AUDIT GATE line below.
- **The verdict:** recorded below.

---

# THE AUDIT GATE (STEP 4B — the mandatory input)

```
AUDIT GATE: BLOCKED (the gate's fix is IN SOURCE, NOT LIVE — and the scan produces no artifact)

THE FIX (HT-BUG-10, proven from disk):
  ~/.omp/agent/extensions/qwen-code-audit/index.js  254 -> 276 L · mtime 14:31:18
  +3 guards before the pass computation: OCR_RUN_DEGRADED · OCR_NO_FILES_REVIEWED ·
  OCR_COUNT_MISMATCH. THE PROOF (the 6-case control, reading the FILE from disk):
    the false pass (completed_with_errors, 10 comments) -> BLOCKED (OCR_RUN_DEGRADED)
    the empty run (files_reviewed 0)                    -> BLOCKED (OCR_NO_FILES_REVIEWED)
    the unresolved filesReviewed (?)                    -> BLOCKED (OCR_NO_FILES_REVIEWED)
    THE LEGIT CLEAN (2 files, 0 findings)               -> GATE: PASS      <- the negative half
    a real CRITICAL finding                             -> GATE: FAIL (1 critical)
    a real HIGH finding                                 -> GATE: FAIL (1 high)

★ WHY THE TOOL STILL SAYS PASS: THE DEPLOYED-IS-NOT-SOURCE LAW.
  index.js mtime 14:31:18 vs the process start 11:25:05 — the module is ESM-cached.
  The tool's `GATE: PASS (filesReviewed=?)` IS THE OLD CODE FIRING = HT-BUG-10 reproduced live.
  With the fix live, the SAME call reads:
    BLOCKED (OCR_NO_FILES_REVIEWED (filesReviewed=?) - the gate CANNOT claim PASS on an
             unreviewed run)

★ A SECOND, DEEPER BLOCKER — MEASURED BY RUNNING THE COMMAND DIRECTLY:
  the ocr scan is RATE-LIMITED. The raw output:
    [ocr] scan plan failed: POST openrouter.ai ... 429 Too Many Requests
          "poolside/laguna-s-2.1:free is temporarily rate-limited upstream"
    Error: scan failed: all 1 file scan(s) failed
  A retry 90 s later returned the SAME 429; `ocr session list` reads FILES 0 / COMMENTS 0.
  ★ THIS IS A PROVIDER-QUOTA BLOCK (the class HT-BUG-7 belongs to). NO CODE FIX PRODUCES AN AUDIT
    FROM A RATE-LIMITED LANE. The gate's fix CORRECTLY refuses to pass it — the gate is BLOCKED
    with the retry condition, and a BLOCKED gate is NEVER upgraded to PASS.

THE RETRY CONDITION: (1) a NEW omp process (the code is ESM-cached), AND (2) a working ocr scan
  that writes an artifact with files_reviewed > 0. Until BOTH hold the gate is BLOCKED and every
  ship-ready claim is WITHHELD.
```

**The wiring (per the audit-wiring table):** the verdict is quoted here; every CRITICAL/HIGH
finding gets an F entry in FAILURE_LOG.md; every accepted MEDIUM+ gets an EN entry in
DEBUG_LOG.md; any spec-mapped finding gets a V row in SPEC_VIOLATION_LOG.md; the BUILD_REPORT
cites the session id + verdict + counts + the JSON path + the audited artifact SHA.

---

# THE HONEST GAPS IN THIS LOG

```
G-1  THE RENDERED PEDIGREE IS UNOBSERVED — the running process predates the fix.
G-2  NO JEV-JUDGED DECISION HAS EVER RUN — the account is empty (402); 0 of 102 rows judged.
G-3  THE ABORT'S BEHAVIOURAL EFFECT WAS NOT ISOLATED — whether ctx.abort() halts the operation
     in every case was not proven end-to-end (the stream continued to the next turn in all 24
     cases, which is CONSISTENT with a successful abort but does not prove the mechanism).
G-4  THE tool_call CHANNEL'S BLAST RADIUS WAS NOT ENUMERATED — 9 ledger rows carry tool-input
     JSON; the full set of legitimate commands it can block is unmeasured.
G-5  THE WORKER BUILD IS UNTESTED — wt-engine/src and wt-surfaces/src are both EMPTY. No test
     of the product exists because the product does not exist.
```


---

## ★ A NOTE ON THIS LOG'S OWN STRUCTURE (the self-referential defect, found + fixed)

```
THE DEFECT: the PLAN entry above originally quoted the verdict string LITERALLY in its
pass-criteria line. A gate that greps the log for `AUDIT GATE: (PASS|FAIL|BLOCKED)` reads the
FIRST match — and the first match was the PLAN's criteria text, which says PASS. **The gate
would have read PASS on a BLOCKED run.**
★ THIS IS HT-BUG-10'S CLASS, IN THIS LOG: a gate reading the wrong signal and returning a
  PASS-shaped result. It was caught by running the grep the gate itself would run.
THE FIX: the plan's criteria text is no longer a literal verdict string; only the ONE verdict
  line carries the literal form. Verify with:
    grep -c 'AUDIT GATE: ' TESTING_LOG.md      # must be exactly 1 (the verdict line)
```


## TEST RESULT — 2026-09-23 — THE TREE'S OWN SUITE (the honest count)

### SCRIPT
- **The run (verbatim):**
```
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
bun test ./tests/engine.test.ts     -> 9 pass
bun test ./tests/surfaces.test.ts   -> 8 pass
bun test ./tests/adversarial.test.ts -> 7 pass
bun test ./tests/                   -> 24 pass / 0 fail / 98 expect() / Ran 24 tests across 3 files
```
- **THE VERDICT:** PASS — but the SCOPE is SOURCE (the suite imports `src/`, not a deployed bundle)
  AND the count is **24**, not the 63 previously reported. The 63 was INFLATED by `bun test`'s
  substring-pattern matching (it counted the Checkpoints + worktree COPIES).
- **THE SELECTORS (all PASS):** lexicon_sweep (F1=1.000) · lint_runner · lexicon_load_throws ·
  source_kind_gate · quote_state · abort_dedupe · action_map · delta_accumulator · rule_precision.

---

## THE AUDIT GATE — DEFINITIVE MEASUREMENT (2026-09-23T15:25+04:00)

**RAN, IN ORDER, EACH MEASURED:**

```
1. qwen-code-audit action=health
   -> "✓ Connection test successful"  (the free lane answers a SINGLE call)
2. qwen-code-audit action=scan scanPath=src,SEAM
   -> GATE: PASS (0 critical/high)  scope=workspace  filesReviewed=?  findings=0
   ★ filesReviewed=? UNRESOLVED + NO ARTIFACT  = HT-BUG-10's blind-pass shape
3. ocr scan --preview --path src
   -> "Preview: 15 file(s) changed | +949 -0"  (the SCOPE works with --path)
4. ocr scan --path src --format json
   -> 15 files walked · 31 llm_requests · 29 llm_errors (429) · 2 llm_responses
      "Error: scan failed: all 15 file scan(s) failed"
   ★ THE SCAN RAN, WALKED THE RIGHT FILES, AND FAILED ON THE RATE LIMIT
5. ocr scan --provider poolside-laguna-s  (a PAID lane)
   -> "429 Too Many Requests: usage limit exceeded"  (the paid lane is ALSO blocked)
6. the lane matrix: muse-free · muse-go · muse-go-mimo · openrouter-laguna-xs-free
   -> ALL "error"  (the provider chain is quota-dead)
```

**THE VERDICT: `AUDIT GATE: BLOCKED`**
```
- the ocr provider chain is quota-dead: every configured lane 429s.
- the scan runs, walks the correct files (15 src/), and FAILS: 29 of 31 calls 429'd.
- NO ARTIFACT is written (the required .omp/container-test-results.json-equivalent is absent).
- ★ HT-BUG-10 IS CONFIRMED LIVE: the tool returned GATE: PASS (filesReviewed=?) ON A RUN WHERE
  ALL 15 FILES FAILED. The gate's source fix (3 blind-pass guards) exists; the DEPLOYED tool
  still blind-passes. THE FIX IS IN SOURCE, NOT LIVE.
- THE RESUME CONDITION: a fresh scan when the lane recovers, OR a non-rate-limited lane
  (a provider key with accumulated limits). NEVER upgraded to PASS on a failed run.
```

**THE TWO-SIDED ADJUDICATION:**
```
Side A (was the probe wrong?): NO. The scope, the path, the tool, the provider — all correct.
  The 429 is an EXTERNAL rate limit, named verbatim by the provider.
Side B (a real contract violation?): YES, TWO:
  B-1: the audit gate returns PASS on a run where every file failed (HT-BUG-10, live).
  B-2: the provider chain has no non-rate-limited fallback for the audit gate.
★ BOTH ARE CONFIRMED Side-B defects, recorded. Neither is a probe error.
```

