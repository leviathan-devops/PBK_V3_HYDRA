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
- **PASS criteria:** `AUDIT GATE: PASS (0 critical/high)`.
- **FAIL criteria:** `AUDIT GATE: FAIL` (blocking findings) or `BLOCKED` (a degraded run — never
  upgraded to PASS).
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
AUDIT GATE: BLOCKED (PROVIDER_QUOTA_EXHAUSTED + OCR_JSON_ABSENT)

THE RUNS (verbatim)
  1  action=scan  -> `GATE: PASS (0 critical/high)`  scope=workspace  filesReviewed=?  findings=0
     ★ A FALSE PASS. `filesReviewed=?` is a literal unparsed count; 0 findings on 707 lines of
       code carrying MEASURED defects (the double-match, the inflection gap, the re-score) is
       not a clean bill — it is an UNOBSERVED run wearing a PASS.
  2  action=review 6d2b7b2..4af8570 -> `GATE: BLOCKED (PROVIDER_QUOTA_EXHAUSTED)`
     the engine log: repeated `status_code: 429, error_class: rate_limited`, then
     `PROVIDER_QUOTA_EXHAUSTED`; also `file_read failed` on a checkpoint doc.
  3  action=review (provider=poolside) -> `GATE: BLOCKED (OCR_JSON_ABSENT)`

THE RETRY CONDITION: quota reset on the openrouter-laguna-s-free lane, or a credentialed
alternative lane. Until then the gate is BLOCKED and every ship-ready / production-grade /
merge claim is WITHHELD.

★ THE FINDING (recorded as HT-BUG-10): the gate returned a PASS-SHAPED result from a run that
  reviewed nothing. A gate that can pass without observing is the "a gate that cannot fail is
  documentation" class — here it is worse: it can pass while BLIND.
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
