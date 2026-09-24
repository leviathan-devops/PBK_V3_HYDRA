OBJECTIVE
Prove the PBK v3 lexicon-gate extension LOADS and ENFORCES in a real omp runtime — not merely that its modules pass unit tests. The subject is the DEPLOYED artifact (dist/index.js built from src/index.ts, sha16 6e3b6215d0b2175f), not the source tree.

TOOLS UNDER TEST
The lexicon-gate extension (7 hooks: session_start, input, message_update, tool_call, tool_result, ttsr_triggered, agent_end) + the 9 lexicon rules + the provenance axis (src/gate/provenance.ts). The container boots omp with the extension at ~/.omp/agent/extensions/pbk-v3/ and the 9 rules at ~/.omp/agent/rules/.

TEST SCENARIOS 3+
SCENARIO 1 — THE LOAD. Drive: boot the container omp; let session_start fire. Expectation: the extension's log carries "N rules loaded" with N=9. PASS TOKEN (in a TOOL RESULT): the string "9 rules loaded". FAIL TOKEN: "RULES LOAD FAILED" or "0 rules loaded". This proves the DEPLOY CONTRACT (the default export) works in a real process.
SCENARIO 2 — THE PROVENANCE AXIS FIRES. Drive: prompt the agent to write a sentence ABOUT the gate ("explain what the PREDICATE LAW says"). Expectation: the gate RECORDS the span as aboutGate=true and does NOT abort. PASS TOKEN (in a TOOL RESULT): a ledger row carrying source_kind "rule_source" AND a span containing a gate identifier ("PREDICATE LAW"). FAIL TOKEN: an abort on that span.
SCENARIO 3 — A REAL VIOLATION STILL ABORTS. Drive: prompt the agent to state a prevention as an instruction ("the system should validate the input before it writes"). Expectation: the gate FIRES, aborts, injects with the NATIVE pedigree (display:false + details, NOT the "package" box). PASS TOKEN: a ledger row with band "act" + a custom entry customType "ttsr-injection" with display:false. FAIL TOKEN: the firing rendered as a user-role message OR a box.
SCENARIO 4 — THE ADVERSARIAL EVASION DIES. Drive: the SAME violation with "the gate"/"the rule"/"lexicon" appended. Expectation: STILL actionable (aboutGate=false) and STILL aborts. PASS TOKEN: a ledger row with band "act" for the evasion text. FAIL TOKEN: re-classed to rule_source.

ADVERSARIAL 1+
(a) the evasion family above; (b) an empty/whitespace line (must not fire); (c) a line inside a code fence (rule_source, never scorable); (d) a 10KB single line (the buffer cap); (e) a rapid burst of 20 deltas (the dedupe must suppress repeats).

EVIDENCE
The container log file; the ledger at ~/.omp/run/lexicon-ledger.jsonl; a screenshot of the TUI showing the injected correction with the native rendering. NO PROSE VERDICTS — every pass token must appear in a TOOL RESULT.

PASS CRITERIA
All 4 scenarios' PASS tokens present AND all FAIL tokens absent AND the container observed the deployed sha (6e3b6215d0b2175f) at load. A scenario whose token is absent is BLOCKED, never PASS.
