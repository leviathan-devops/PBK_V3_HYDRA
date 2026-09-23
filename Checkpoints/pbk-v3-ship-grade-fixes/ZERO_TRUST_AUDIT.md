# ZERO-TRUST AUDIT — THE HYDRA-WORKERS BUILD + THE LEXICON-GATE FIX

**Target:** the hydra-workers topology + the lexicon-gate pedigree fix.
**Posture:** every "done" is a set of CLAIMS. Each is re-run against the artifact.
**Date:** 2026-09-23. **Auditor:** the agent that produced the work (the recursion is disclosed).

---

## THE VERDICT (first line, per the law)

# **NOT PRODUCTION GRADE.** The TOPOLOGY is production grade and mechanically proven. The
# PRODUCT DOES NOT EXIST. One CRITICAL defect was found — in the AUDIT GATE ITSELF, whose PASS
# was false in three ways at once (it hid 10 findings, a 429, and reviewed the wrong project).
# THE CODE AUDIT IS **BLOCKED** — every ship-ready claim is WITHHELD.

---

## §1 · THE CLAIMS TABLE (claim → reproduction → verdict)

| # | the claim | the evidence I cited | the reproduction (actual) | verdict |
|---|---|---|---|---|
| C-1 | the build packages are overhauled to hydra workers | the operator's directive | 3 worktrees · 2 specs (333/343 L) · 2 pins · 2 todo anchors · 4 predicates exit 0 | **VERIFIED** |
| C-2 | the worker topology is dispatchable | the predicate | `hydra-workers/scripts/check.sh` → `PASS: worker topology verified` exit 0 | **VERIFIED** |
| C-3 | the merge gate works | the gate | run on the empty branches → `GATE: FAIL` (the negative control — it BITES) | **VERIFIED** |
| C-4 | the seam is frozen + compiles | the sha + tsc | `sha256sum` → `66b66a7f10c7c6e7` · `bunx tsc --noEmit` → exit 0 | **VERIFIED** |
| C-5 | the hot-reload mechanism is real | the round trip | 9 → 10 → 9 in ONE pid, no restart, the ADD and the REMOVE both seen | **VERIFIED** |
| C-6 | the gate fires on the agent's own prose | the census | 24 MECHANICAL deliveries, line-numbered (L31017..L31305), 3 pids attributed | **VERIFIED** |
| C-7 | the pedigree fix works | the unit harness | `sendMessage` called, `sendUserMessage` NOT, `customType` carried | **PARTIAL — source only** |
| C-8 | the fix is LIVE | (nothing) | the process started 04:50:25; index.ts mtime 06:08:08 → **the process predates it** | **REFUTED** |
| C-9 | the build is production grade | (nothing) | `wt-engine/src` 0 entries · `wt-surfaces/src` 0 entries · 10/15 oracles PENDING | **REFUTED** |
| C-10 | the code audit passed | `GATE: PASS (0 critical/high)` | a second run revealed `PROVIDER_QUOTA_EXHAUSTED`; run 1 had `filesReviewed=?` → **a BLIND PASS** | **REFUTED (CRITICAL)** |
| C-11 | the test suite is green | `5 pass / 0 fail` | re-ran: `5 pass · 0 fail · 12 expect()` — ★ but the suite imports `lib.ts` (SOURCE), not a runtime | **VERIFIED, SOURCE-scope** |

---

## §2 · THE CRITICAL FINDING (HT-BUG-10 — the audit gate's FALSE PASS, wrong in THREE ways)

```
THE CLAIM   the code audit PASSED with 0 critical/high.

THE ARTIFACT READ-BACK (/tmp/sg-ocr-27fa2460.json, session_id
50fd3d1e-9a64-4bb6-b12c-f35598b81510) — THE GATE'S OWN OUTPUT FILE CONTRADICTS IT:

  THE GATE REPORTED                    THE ARTIFACT RECORDS
  ---------------------------------    ------------------------------------------------
  GATE: PASS (0 critical/high)         status: completed_with_errors     <- DEGRADED
  findings=0                           summary.comments: 10              <- 10 FINDINGS
  filesReviewed=?                      summary.files_reviewed: 2         <- NOT the 3 asked
  (silent)                             warnings: 1 x 429 rate_limited
  (silent)                             the files reviewed: tests/st-corbell-port.ts +
                                       src/hunter/graph/corbell-adapter.ts
                                       ★ NEITHER IS IN THE scanPath REQUESTED

★ THREE INDEPENDENT FAILURES COMPOSED INTO ONE PASS:
  (a) THE SCOPE DRIFT — it reviewed ANOTHER PROJECT'S files (a GI-OMP path appeared in its
      own project_summary), not the three source files I named.
  (b) THE COUNT LOSS — 10 comments produced; the summary line reported 0.
  (c) THE HIDDEN DEGRADATION — a 429 occurred; the gate's summary carried no sign of it.

★ THE ROOT CAUSE: THE SUMMARY LINE AND THE ARTIFACT ARE NOT DERIVED FROM THE SAME DATA.
  `findings=0 filesReviewed=?` is computed from a field the engine left UNRESOLVED (the `?` is
  the literal), while the artifact carries the real counts under DIFFERENT KEYS
  (`summary.comments`, `summary.files_reviewed`).

★ AND THE INSTRUMENT-VALIDITY LESSON, at the gate level: the run reported 0 findings on 707
  lines of code carrying MEASURED defects. A gate reporting ZERO on a KNOWN-DEFECT corpus is a
  RED FLAG about the INSTRUMENT — the exact law this whole session was about.
```

---

## §3 · THE DEFECT LEDGER (all 10, with dispositions)

```
HT-BUG-1   the delivery channel impersonated the operator        HIGH       FIXED in source, NOT live
HT-BUG-2   the gate scored its own injected correction           MEDIUM     FIXED in source, NOT live
HT-BUG-3   the exemptor misses inflections ("exits")             MEDIUM     OPEN
HT-BUG-4   the double-match made confidence two-valued           LOW-MED    OPEN
HT-BUG-5   the rule fires on process narration (19/24)           MEDIUM     OPEN (deliberate)
HT-BUG-6   the self-reference loop                               MEDIUM     OPEN
HT-BUG-7   the gray zone has never been judged (102 jev:null)    MEDIUM     BLOCKED (402)
HT-BUG-8   the fix is not live                                   INFO       KNOWN
HT-BUG-9   a harness built during a meta-observation round       LOW        CORRECTED
HT-BUG-10  the audit gate returned a blind PASS                  CRITICAL   OPEN
```

## §4 · THE THEATRICALITY LEDGER (the metric)

```
total: 8 · SELF-CORRECTED 7 · OPERATOR-CAUGHT 1 · the subagent-attributed count: 0
★ THE OPERATOR-CAUGHT COUNT: 1 (the hot-reload claim — the class the mechanical checks could
  not reach: a claim about METHOD whose artifact looked complete).
```

## §5 · WHAT ACTUALLY WORKS (the honest survive list)

```
1  THE SEAM           192 L · sha 66b66a7f10c7c6e7 · tsc exit 0 · FROZEN and unchanged all session
2  THE WORKER TOPOLOGY 3 worktrees · 2 specs · 2 pins · 2 todo anchors · 4 predicates exit 0
3  THE MERGE GATE     6 predicates · OBSERVED FAILING (the negative control)
4  THE HOT-RELOAD     the round trip 9→10→9 in ONE pid — the mechanism is MEASURED
5  THE LIVE GATE      24 firings, line-numbered, correctly attributed, correctly fired
6  THE EXEMPTOR       30% suppression measured (71 own_utterance vs 31 quotation)
7  THE COST           sub-millisecond (0.024 ms/call prose) — the gate is not a bottleneck
8  THE JEV FAILURE    LOUD and NAMED (8 skips with the full 402 body) — never a silent null
9  THE SHIP DOCS      6 docs + the manifest, the evidence wired
10 THE CHECKPOINT     the dist SHA verified == the live artifact; 8/8 gate
```

## §6 · WHAT DOES NOT (the honest fail list)

```
1  THE PRODUCT        wt-engine/src and wt-surfaces/src are BOTH EMPTY. 0 lines.
2  THE FIX'S EFFECT   fixed in source; the running process predates it. The RENDERING is UNOBSERVED.
3  THE JUDGE          the gray zone has never been judged (102 rows, all jev:null)
4  THE AUDIT          BLOCKED, and the gate produced a blind PASS (CRITICAL)
5  THE MERGE          never attempted
6  THE ORACLES        10 of 15 read PENDING
7  ANCHOR 1'S REMOTE  0 git remotes
```

## §7 · THE RECURSION (disclosed)

```
★ I AUDITED MY OWN WORK. The author is blind to the contract gaps they did not know to look
  for. The mitigations applied: (a) every claim was RE-RUN, not re-asserted; (b) the CRITICAL
  finding (HT-BUG-10) was found by the instrument-validation check, not by introspection;
  (c) the external audit was ATTEMPTED and reported BLOCKED rather than skipped.
★ THE RESIDUAL: an independent reader has not reviewed the 707 lines. That is the named gap.
```

## §8 · THE VERDICT, RESTATED

```
THE SCAFFOLD IS PRODUCTION GRADE. THE PRODUCT IS ABSENT.

  the topology      PROVEN mechanically (4 predicates + the negative control)
  the live gate     PROVEN firing (24 attributed deliveries)
  the fix           IN SOURCE, NOT LIVE — the rendered behaviour is UNOBSERVED
  the product       0 LINES. The 10 open oracle rows are the measure.
  the audit         BLOCKED — and the gate's blind pass is itself a CRITICAL finding

★ ANY "PRODUCTION GRADE" CLAIM FOR THIS BUILD IS REFUTED. The claim that CAN be made, with
  evidence, is: the WORKER TOPOLOGY is armed and mechanically dispatchable, and the LIVE
  ENFORCEMENT has been observed firing correctly with two of its defects fixed in source.
```
