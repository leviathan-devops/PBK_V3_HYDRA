# W2_FIX_REPORT — THE LIVE RULE (HT-BUG-5 + HT-BUG-6)

```
MISSION      W2 of the PBK v3 ship-grade wave: the two rule-side exemptors — the meta-correction
             exemptor (HT-BUG-6) and the process-hedge exemptor (HT-BUG-5) — verified against
             the LIVE rule file through the engine's own loader, plus the battery and the diff.
TREE         /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA (branch master)
STATE        the battery ran at 1b395e3. The brief pinned 1890262; exactly two commits landed
             between the pin and the run (1890262..1b395e3), BOTH docs-only — measured:
               1890262  fix(W6): HT-BUG-16 — W6_DEPLOY_HANDOFF.md (+12/-2),
                        context_management/RUNNING_DEBUG_LOG.md (+20)
               1b395e3  docs(P9): context_management/CURRENT_STATE.md (+44)
             No source file, no test file, no rule file changed: the source state under test is
             byte-identical to 1890262's.
ARTIFACT     THE SUBJECT is a file OUTSIDE the repo:
             /home/leviathan/.omp/agent/rules/instruction-not-predicate.md
             sha256 7b5e5ceb9f8ab74c6b3fc22c051f90edf9009ff8f3d9d77d75f8eb5230833944 (39 lines,
             measured this session). Symbol counts (grep -c, measured): "use:" 1;
             "THE META-CORRECTION EXEMPTOR" 1; "THE PROCESS-HEDGE EXEMPTOR" 1;
             "banned phrase" 2 (once in the use[1] comment, once in the use[1] pattern).
SEAM         SEAM/seam.ts sha256 66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d
             (re-measured THIS session at verification start — UNCHANGED, the frozen contract holds).
VERDICT      BOTH BUGS FIXED ON THE LIVE RULE — every number below was measured in THIS session,
             most of them through the engine's own loadRules -> scoreSignals -> bandOfLexicon
             pipeline pointed at the live rules directory.
AUTHORSHIP   THE AUTHORSHIP CORRECTION (as ordered): the W2 fixes — the 2 new use: members —
             were authored by the ORCHESTRATOR (Main) at f93e34a, NOT by a prior W2 seat. The
             original W2Rules worker was infra-cut after ~4 minutes having made ZERO file
             changes (recorded in W1_FIX_REPORT.md's header), and Main landed the scorer, the
             loader, and the rule-side exemptors together in the combined commit f93e34a
             ("fix(W1+W2): ..."). This report's author (the W2 seat, a fresh instance) is the
             THIRD entity in the chain: it authored nothing under review; it independently
             re-verified every mechanism and number in-session. Nothing here is inherited
             without provenance — §5.2 names the source of every number this report did not
             produce itself.
```

---

## 0 · THE ONE-PARAGRAPH VERDICT

The live rule `~/.omp/agent/rules/instruction-not-predicate.md` carried two measured defects from
the 2026-09-23 hot-seat campaign (host-test-failure-log.md, HT-BUG-5 and HT-BUG-6): the rule fired
band=act on the agent's own PROCESS narration ("let me be careful …" — 19 of 24 census firings on
legitimate planning prose), and it fired on the agent ATTEMPTING COMPLIANCE (a meta-correction
that names the banned phrase re-fired the rule — the record of the loop was blocked by the loop).
Both are fixed in the rule's `use:` bank (THE EXEMPTOR — each matching member subtracts neg += 3):
f93e34a added two members, the meta-correction exemptor and the process-hedge exemptor. This
session loaded the LIVE rules directory through the engine's own `loadRules` (9 of 9 rules load;
instruction-not-predicate carries 3 use: members as loaded, JSON-verified), re-derived the pre-W2
bank shape from the loaded rule (use truncated to its single pre-f93e34a member), and measured all
three contract probes on both shapes: HT-BUG-5 `pos=2 neg=0 c=0.667 band=act` BEFORE ->
`pos=2 neg=3 c=0.333 band=flag` AFTER; HT-BUG-6 identical BEFORE -> AFTER; the DESIGN instruction
(a genuine prevention, the rule's real target) reads `pos=2 neg=0 c=0.667 band=act` on BOTH shapes
— THE TARGET PRESERVED. The gate is green: `bunx tsc --noEmit` exit 0; the tree's own suite
(engine 9 + surfaces 8 + adversarial 7) 24 pass / 0 fail / 101 expect() calls, with the suite's
own live-rule lines reading `HT-BUG-5 the real span pos=2 neg=3 band=flag`, `HT-BUG-6 the
meta-correction pos=2 neg=3 band=flag`, `the design instruction: pos=2 band=act`, and `the sacred
overlap: pos=0 neg=4 band=clear`. The verification also CAPTURED LIVE FIRE: the deployed
lexicon-gate interrupted this seat's own reasoning twice mid-verification — primary failure data
that bounds the fix (§5.4): the deployed scorer still runs pre-W1 arithmetic (0.800 = the pos=4
double-match signature where the repo scorer reads 0.667 on the same window), and the fired span
was a BARE process hedge, which the preposition-keyed exemptor does not cover — the fix is a
subset of the HT-BUG-5 census class, measured.

---

## 1 · THE GATE — REAL OUTPUTS, THIS SESSION, AT 1b395e3

The sanctioned single run (orchestrator-ordered: run ONCE, paste raw). Invocation note, inherited
from W1 §1 and honored here: `bun test` positional arguments are SUBSTRING PATTERNS, not paths —
a bare `bun test tests/engine.test.ts` also matches the Checkpoints copies and inflates the count.
The tree's own suite must be invoked with explicit file paths, which is what GATE 2 does.

```
$ cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
$ git rev-parse --short HEAD && git log --oneline -3
1b395e3
1b395e3 docs(P9): the final state — HT-BUG-16 in the canon, the artifact hash re-measured
1890262 fix(W6): HT-BUG-16 — the handoff carried a STALE artifact hash (the pre-fix 58L entry)
7e16bc3 docs(W1): the R-2 residual adjudicated — MEASURED (it was understated, then correctly bounded)

$ git status --porcelain
(empty — the tree is clean)
```

The sha-honesty check the brief's pin demands (measured):

```
$ git show --stat --oneline 1890262 | cat
1890262 fix(W6): HT-BUG-16 — the handoff carried a STALE artifact hash (the pre-fix 58L entry)
 W6_DEPLOY_HANDOFF.md                    | 12 ++++++++++--
 context_management/RUNNING_DEBUG_LOG.md | 20 ++++++++++++++++++++
 2 files changed, 30 insertions(+), 2 deletions(-)

$ git show --stat --oneline 1b395e3 | cat
1b395e3 docs(P9): the final state — HT-BUG-16 in the canon, the artifact hash re-measured
 context_management/CURRENT_STATE.md | 44 +++++++++++++++++++++++++++++++++++++
 1 file changed, 44 insertions(+)
```

```
$ sha256sum SEAM/seam.ts /home/leviathan/.omp/agent/rules/instruction-not-predicate.md
66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d  SEAM/seam.ts
7b5e5ceb9f8ab74c6b3fc22c051f90edf9009ff8f3d9d77d75f8eb5230833944  /home/leviathan/.omp/agent/rules/instruction-not-predicate.md

$ grep -c 'THE PROCESS-HEDGE EXEMPTOR' /home/leviathan/.omp/agent/rules/instruction-not-predicate.md
1
$ grep -c 'THE META-CORRECTION EXEMPTOR' /home/leviathan/.omp/agent/rules/instruction-not-predicate.md
1
$ grep -c 'HT-BUG-5\|HT-BUG-6' /home/leviathan/.omp/agent/rules/instruction-not-predicate.md
2
```

```
== GATE 1: bunx tsc --noEmit ==
tsc exit: 0
```

```
== GATE 2: bun test ./tests/engine.test.ts ./tests/surfaces.test.ts ./tests/adversarial.test.ts ==

  lexicon_sweep: tp=2 fp=0 fn=0 precision=1.000 recall=1.000 F1=1.000
  the derived band: {"low":0.6566666666666666,"high":0.6666666666666666}

  HT-BUG-3 inflected: pos=2 neg=3 c=0.333 band=flag
  HT-BUG-3 STATUS FIXED: the exemptor expands the inflection (neg>0)
  HT-BUG-4 short pos=2 c=0.667 band=act
  HT-BUG-4 long  pos=2 c=0.667 band=act
  HT-BUG-4 STATUS FIXED: overlapping matches are counted once
  HT-BUG-5 the real span pos=2 neg=3 band=flag
  HT-BUG-5 STATUS FIXED: a process hedge drops off act on the live rule
  HT-BUG-6 the meta-correction pos=2 neg=3 band=flag
  HT-BUG-6 STATUS FIXED: the meta-correction drops off act on the live rule
  HT-BUG-10 the guard present: OCR_RUN_DEGRADED -> true
  HT-BUG-10 the guard present: OCR_NO_FILES_REVIEWED -> true
  HT-BUG-10 the guard present: OCR_COUNT_MISMATCH -> true
  HT-BUG-10 STATUS FIXED: the 3 blind-pass guards are on disk (see gate-verdict-proof.mjs)
  rule_precision HT-BUG-6: pos=2 neg=3 band=flag
  rule_precision HT-BUG-5: pos=2 neg=3 band=flag
  rule_precision the design instruction: pos=2 band=act
  rule_precision the sacred overlap: pos=0 neg=4 band=clear

 24 pass
 0 fail
 101 expect() calls
Ran 24 tests across 3 files. [23.00ms]
```

```
THE GATE VERDICT: GREEN — tsc exit 0 · 24 pass / 0 fail / 101 expect() · F1=1.000 (no regression)
The suite's own HT-BUG-5/-6 lines match this report's §2 probe numbers EXACTLY — and since commit
35c8f48 those tests read the LIVE rule (see §2.7), so the suite and this report's probe are two
independent instruments measuring the same subject and agreeing.
```

Scope note (the same one W1 recorded): per-file `test()` block counts on disk are the cross-check
for the 24 (engine 9 + surfaces 8 + adversarial 7); the battery was NOT re-run mid-task — it ran
once, after the probes were recorded, per the assignment contract.

---

## 2 · THE PROBES — BEFORE / AFTER, ALL MEASURED IN THIS SESSION

### 2.1 · THE REPRODUCTION RIG

Two instruments, both in /tmp (the repo untouched):

```
/tmp/w2-probe.ts      the contract probe: loads the LIVE rules directory through the ENGINE's
                      own loadRules (src/lexicon/load.ts), finds instruction-not-predicate,
                      scores three inputs through scoreSignals + confidence + bandOfLexicon,
                      prints pos/neg/c/band per input on TWO shapes:
                        BEFORE = the live family with its use: bank truncated to the single
                                 pre-f93e34a member (the pre-W2 bank shape, reconstructed from
                                 the LOADED rule — the live file is read-only to this seat, so
                                 the reconstruction is the only honest way to re-measure the
                                 before-state on the engine path; its provenance is §5.2),
                        AFTER  = the live family, byte-for-byte as loaded.
                      plus: the per-rule use: member census (substrate freshness), the
                      per-member isolation (which member fires), and residuals R1-R4.
/tmp/w2-livefire.ts   the live-fire comparison (§5.4): the gate's own interrupted window
                      re-scored through the repo scorer, plus two bare-hedge controls.
```

The probe strings are the EXACT strings the tree's adversarial tests use (tests/adversarial.test.ts,
P7-HT-BUG-5/-6 and the rule_precision block) — SHORT = "be careful", LONG = "let me be careful",
composed at runtime with string concatenation so the literals never appear raw in the source.

### 2.2 · THE SUBSTRATE — THE LIVE RULE AS LOADED (not as remembered)

`bun /tmp/w2-probe.ts`, first block, verbatim:

```
loaded rules: 9
live band: {"low":0.3,"high":0.62}
live use bank: 3 members (loaded through loadRules):
  use[0] = "\\b(exit|predicate|nonzero|throws?|fails?|asserts?)\\b"
  use[1] = "\\b(banned phrase|no,? that is|no \\u2014 that is|avoid the trigger|the trigger phrases?)\\b"
  use[2] = "\\b(let me|i.?ll|i should|we should|let.?s)\\b[^.]{0,40}?\\b(about|regarding|concerning)\\b"
live suggestive bank: 3 members
live descriptive bank: 1 members
live substitute bank: 0 members

== PER-RULE use: MEMBER CENSUS (all loaded rules) ==
 - dist-not-built               | use members: 2
 - fallback-slop                | use members: 2
 - instruction-not-predicate    | use members: 3
 - phantom-and-claim            | use members: 2
 - record-anchor                | use members: 1
 - scope-shrink                 | use members: 2
 - stale-substrate              | use members: 1
 - theatrical-verification      | use members: 2
 - unwired-edge                 | use members: 1
```

Three facts this block settles, all measured, none inherited:

```
1. loadRules("/home/leviathan/.omp/agent/rules") returns 9 rules. (The brief's claim — measured.)
2. The fix IS in the loaded substrate: use[1] and use[2] are the two new members, serialized from
   the LOADED rule object (JSON.stringify), not quoted from the file text. The engine sees them.
3. instruction-not-predicate is the ONLY rule with 3 use members (the others: 2/2/2/1/2/1/2/1) —
   the W2 fix touched exactly one rule file. Also measured: this rule's substitute bank is EMPTY
   (0 members — the bank key is absent from the file), and theatrical-verification.md loads 2 use
   members (its 3 substitute members were W1 §5.2's corrected finding; both rules agree with the
   W1 report's final state).
```

### 2.3 · HT-BUG-5 — THE PROCESS NARRATION FIRING

THE BUG (host-test-failure-log.md, HT-BUG-5): the rule fired on the agent's PROCESS NARRATION —
19 of 24 census firings on "be careful" / "I should be careful" / "let me be careful" inside
legitimate planning prose. The rule's own body states its target: "a prevention is a MECHANICAL
PREDICATE" — a claim about a SYSTEM. The caught spans were hedges about a TURN. Root cause: the
suggestive frame is verb-anchored and object-blind. Class: TARGET-CLASS DRIFT / OVER-BREADTH.

BEFORE — measured THIS session on the reconstructed pre-W2 shape (the method, §2.1; the
provenance of the reconstruction, §5.2), with two independent inherited corroborations:

```
$ bun /tmp/w2-probe.ts
HT-BUG-5 the process hedge    "let me be careful about the doc-density gate: these are .md writes."
  BEFORE pos=2 neg=0 c=0.667 band=act
  AFTER  pos=2 neg=3 c=0.333 band=flag
```

```
CORROBORATION 1 (prior session, the census): 19 of 24 live firings were exactly this class, all
  at band=act (the abort tier) — host-test-failure-log.md HT-BUG-5 EVIDENCE block.
CORROBORATION 2 (the fix commit's own message, f93e34a): "THE PROBES: ... HT-BUG-5 pos=2 neg=3
  band=flag (was act)". The was-state and the after-state in the message match this session's
  BEFORE and AFTER rows value-for-value.
```

```
TARGET (the brief):  the HT-BUG-5 probe reads pos=2 neg=3 band=flag (was band=act pre-fix).
MEASURED:            BEFORE pos=2 neg=0 c=0.667 band=act -> AFTER pos=2 neg=3 c=0.333 band=flag. MET.
```

### 2.4 · HT-BUG-6 — THE SELF-REFERENCE LOOP

THE BUG (log, HT-BUG-6): the agent ATTEMPTING COMPLIANCE by naming the banned phrase re-fired the
rule — three consecutive firings in 8 seconds ("Now — I must be careful (no, that's the banned
phrase). Let me EXECUTE." et al.), and ★ the first write of the failure-log file itself was
blocked by the gate for containing a trigger phrase: the record of the loop was blocked by the
loop. The rule had no exemption for a phrase inside a META-CORRECTION.

```
$ bun /tmp/w2-probe.ts
HT-BUG-6 the meta-correction  "Now I must be careful (no, that is the banned phrase). Let me EXECUTE."
  BEFORE pos=2 neg=0 c=0.667 band=act
  AFTER  pos=2 neg=3 c=0.333 band=flag
```

```
TARGET (the brief):  the HT-BUG-6 probe reads pos=2 neg=3 band=flag (was band=act pre-fix).
MEASURED:            BEFORE pos=2 neg=0 c=0.667 band=act -> AFTER pos=2 neg=3 c=0.333 band=flag. MET.
```

### 2.5 · THE DESIGN INSTRUCTION — THE TARGET PRESERVED (the hard invariant)

THE INVARIANT: the exemptors must not neuter the rule's REAL target — a genuine design
instruction ("let me just add a check"). The failure log's own MISFIRE-CONTROL note for HT-BUG-5
names this exact risk: "narrowing loses the 'let me just add a check' catch."

```
$ bun /tmp/w2-probe.ts
DESIGN   the real target      "let me just add a check that validates the input"
  BEFORE pos=2 neg=0 c=0.667 band=act
  AFTER  pos=2 neg=0 c=0.667 band=act
```

```
TARGET (the brief):  the DESIGN instruction still reads pos=2 band=act — THE TARGET PRESERVED.
MEASURED:            pos=2 neg=0 c=0.667 band=act on BOTH shapes. MET — the fix did not touch it.
```

The suite corroborates independently (battery, §1): `rule_precision the design instruction:
pos=2 band=act` — and that test ASSERTS band === "act" (a red suite if the exemptors over-fire).

### 2.6 · THE PER-MEMBER ISOLATION — WHICH MEMBER ACTUALLY FIRES

Single-member families (each member scored alone against each probe, AFTER state):

```
HT-BUG-5 the process hedge    "let me be careful about the doc-density gate: these are .md writes."
  suggestive[0] -> pos=2 neg=0        ("let me be careful" — the (let me) (just )?(be careful) frame)
  suggestive[2] -> pos=2 neg=0        ("be careful" — fires ALONE, DEDUPED in the full scoring)
  use[2]        -> pos=0 neg=3        (THE PROCESS-HEDGE EXEMPTOR fires — this is the fix working)
HT-BUG-6 the meta-correction  "Now I must be careful (no, that is the banned phrase). Let me EXECUTE."
  suggestive[2] -> pos=2 neg=0        ("be careful" — suggestive[0] does NOT fire: "I must" is not
                                       in its frame's subject alternation)
  use[1]        -> pos=0 neg=3        (THE META-CORRECTION EXEMPTOR fires)
DESIGN   the real target      "let me just add a check that validates the input"
  suggestive[1] -> pos=2 neg=0        ("add a check that" — the ONLY member that fires)
                                       NO use member fires. The exemptors are silent on the target.
```

Two composition facts visible here, both measured:

```
1. On HT-BUG-5, suggestive[0] and suggestive[2] BOTH match in isolation, but the full scoring
   reads pos=2, not 4 — W1's per-bank span dedupe (score.ts) collapses the shared-tail pair.
   W2's exemptor composes with W1's dedupe: 2/(2+3+1) = 0.333.
2. On HT-BUG-6 the positive comes from suggestive[2] alone (the bare "be careful" member), so the
   dedupe is not even exercised there — the exemptor alone drops the span: 2/(2+3+1) = 0.333.
```

### 2.7 · THE SUITE'S OWN LIVE-RULE LINES — THE AUTHORITY LINK

The battery's HT-BUG-5/-6 lines are not a re-implementation of the probe: since commit 35c8f48
("fix(test): HT-BUG-5/-6 probes read the LIVE rule (the authority for W2's fix)") the tests do
`loadRules("/home/leviathan/.omp/agent/rules").find((x) => x.id === "instruction-not-predicate")`
and score against `live.lexicon` with `bandOfLexicon(c, live.band)`. Measured (§1, verbatim):

```
  HT-BUG-5 the real span pos=2 neg=3 band=flag
  HT-BUG-6 the meta-correction pos=2 neg=3 band=flag
  rule_precision HT-BUG-6: pos=2 neg=3 band=flag
  rule_precision HT-BUG-5: pos=2 neg=3 band=flag
  rule_precision the design instruction: pos=2 band=act
  rule_precision the sacred overlap: pos=0 neg=4 band=clear
```

Six lines, two instruments (the /tmp probe and the tree's suite), one subject (the LIVE rule),
zero disagreement. The sacred overlap line is W1's invariant re-verified on the W2-updated rule:
the two new exemptors did not disturb the descriptive+use double-subtraction (§3.7).

---

## 3 · THE MECHANISM — WHAT THE FIX ACTUALLY DOES

### 3.0 · THE SUBJECT — THE LIVE RULE'S FOUR BANKS, VERBATIM

The complete lexicon block of `~/.omp/agent/rules/instruction-not-predicate.md` (lines 1-24 of
39, transcribed from the file read this session; line numbers on the right are this session's
grep -n measurements):

```
1   ---
2   description: 'Catches a PREVENTION stated as an instruction or a warning instead of a predicate. An ACTION frame, never a mention.'
3   scope: [text, thinking]
4   interruptMode: always
5   # TTSR is EMPTY (the architecture change 2026-09-23): the condition: block was removed so
6   # TTSR registers 0 rules. The EXTENSION is the enforcement; this lexicon IS the decision.
7   lexicon:
8     descriptive:
9       - '\b(exit 1|nonzero|asserts?|throws)\b'
10    suggestive:
11      - '\b(we (should|must|need to)|i.?ll|let.?s|let me) (just )?(make sure|ensure|remember to|be careful|always|never)\b'
12      - '\b(add a (check|warning|reminder|note|comment) (that|to))\b'
13      - '\b(be (more )?careful|pay attention to|watch out for|keep in mind)\b'
14    use:
15      - '\b(exit|predicate|nonzero|throws?|fails?|asserts?)\b'
16      # HT-BUG-6 (2026-09-23): THE META-CORRECTION EXEMPTOR. An agent ATTEMPTING to comply by
17      # naming the banned phrase ("(no, that's the banned phrase)") re-fired the rule. A phrase
18      # inside a meta-correction is a mention, not a violation. The exemptor SUBTRACTS (never
19      # zeroes) so the span lands at gray -> the Jev judge, not an abort.
20      - '\b(banned phrase|no,? that is|no \u2014 that is|avoid the trigger|the trigger phrases?)\b'
21      # HT-BUG-5 (2026-09-23): THE PROCESS-HEDGE EXEMPTOR. A hedge about the agent's OWN process
22      # ("let me be careful ABOUT the gate") is not a prevention about a SYSTEM. The rule's target
23      # is a design instruction ("let me just add a check"), which carries no such preposition.
24      - '\b(let me|i.?ll|i should|we should|let.?s)\b[^.]{0,40}?\b(about|regarding|concerning)\b'
```

THE FIX BY LINE: the two new members are LINES 20 and 24, each introduced by its own dated
comment block (lines 16-19 and 21-23). Line 15 is the pre-existing exemptor (the W1-era bank in
full). The banks as loaded (§2.2, JSON-serialized) are byte-identical to these file lines after
YAML single-quote unwrapping — the loader's block-style parser reads them in load order:
descriptive 1, suggestive 3, use 3. The fourth bank (substitute) is ABSENT from this file —
measured 0 members as loaded; `scoreSignals` treats a missing bank as empty (`family.substitute
?? []`).

### 3.1 · use[1] — THE META-CORRECTION EXEMPTOR (line 20)

Verbatim from the live file:

```
- '\b(banned phrase|no,? that is|no \u2014 that is|avoid the trigger|the trigger phrases?)\b'
```

Why it exempts — the chain, each step anchored:

```
1. The use: bank is THE EXEMPTOR: scoreSignals adds neg += 3 for each non-overlapping matching
   use member (src/lexicon/score.ts, the takenUse loop — W1's version, per-bank span ledger).
2. The census's HT-BUG-6 spans contain "banned phrase" AND "no, that is(the banned phrase)".
   Both live inside ONE alternation member; RegExp.exec finds at most one match per pattern, so
   the member contributes neg += 3 exactly ONCE (the per-member counting law, W1 §3.4).
3. Confidence: pos=2 (suggestive[2], "be careful") -> 2/(2+3+1) = 0.333.
4. bandOfLexicon maps the derived band {low: 0.3, high: 0.62} onto abide's thresholds
   (high -> act, low -> flag): 0.3 < 0.333 <= 0.62 -> flag. NOT act. The abort does not fire.
```

Two details of the member worth putting on record:

```
- The \u2014 alternative: the YAML scalar is single-quoted, so the FILE bytes are the six
  characters \u2014 (measured in the loaded JSON: "no \\u2014 that is"). JS RegExp compiles that
  sequence as the UNICODE ESCAPE for the em dash — so the regex matches the em-dash form
  "no — that is" (the exact character the census evidence used: "Now — I must be careful").
  It is a regex escape surviving YAML, not a typo.
- The plain-apostrophe gap: the census's actual spans wrote "that's" (contraction). The
  alternative `no,? that is` does NOT match "no, that's" (after "that" comes "'", not " is").
  Those census spans were saved by the "banned phrase" alternative, NOT by the "that is"
  alternative. A meta-correction phrased "(no, that's a design instruction)" carries neither —
  MEASURED re-fire: R2 in §5.3.
```

### 3.2 · use[2] — THE PROCESS-HEDGE EXEMPTOR (line 24)

Verbatim from the live file:

```
- '\b(let me|i.?ll|i should|we should|let.?s)\b[^.]{0,40}?\b(about|regarding|concerning)\b'
```

Why it exempts:

```
1. Frame: the SAME subject vocabulary as the suggestive frame (let me / i'll / i should /
   we should / let's) — written as its own alternation so the exemptor is independent of the
   detection frame's exact shape.
2. Window: [^.]{0,40}? — a LAZY window of up to 40 characters that cannot contain a literal dot.
   Lazy = the shortest window that reaches the preposition. Two consequences, both from the
   pattern itself:
   - a hedge in one sentence cannot exempt a frame in the NEXT sentence (the '.' is excluded
     from the window class, so the match cannot cross a sentence boundary);
   - the hedge must be ABOUT something stated nearby (within 40 chars) using one of the three
     prepositions — the "object of the verb" discrimination the failure log's HT-BUG-5 ROOT
     CAUSE asked for ("the frame is verb-anchored and object-blind"), approximated by
     preposition-marking rather than by a system-object list.
3. Compile: the engine compiles every bank member with the case-insensitive flag (score.ts
   compile(p) -> new RegExp(stripInlineFlags(p), "i")), so "Let me" in sentence-initial position
   matches \blet me\b — measured in the live-fire window (§5.4), which begins "Let me now write."
4. Arithmetic on the HT-BUG-5 probe: "let me be careful about the doc-density gate" — the frame
   "let me" at [0,6), the window " be careful " (11 chars, dot-free), then "about". One match,
   neg += 3, pos stays 2 (suggestive[0]; suggestive[2] deduped by W1's ledger) -> 2/(2+3+1) =
   0.333 -> flag. The abort does not fire.
```

### 3.3 · THE ARITHMETIC WALKTHROUGH — ALL THREE PROBES, ONE TABLE

confidence = pos / (pos + neg + 1), the seam's formula. Band cuts: act iff c > 0.62, flag iff
0.3 < c <= 0.62, clear iff c <= 0.3 (bandOfLexicon mapping high->act, low->flag).

```
PROBE      pos  neg  c      band   pos from          neg from
HT-BUG-5     2    3  0.333  flag   suggestive[0]     use[2]  (the hedge exemptor)
HT-BUG-6     2    3  0.333  flag   suggestive[2]     use[1]  (the meta exemptor)
DESIGN       2    0  0.667  act    suggestive[1]     NOTHING — no use member fires
```

The design column is the invariant: both new members are SILENT on the rule's intended target.
The exemptors key on (meta-correction vocabulary | hedge+preposition) shapes; "let me just add a
check that validates the input" carries neither (no "about" within reach of any frame; none of
use[1]'s vocabulary; use[0]'s alternatives — exit/predicate/nonzero/throws/fails/asserts with
inflections — do not include "validates"; measured, §2.6).

### 3.4 · SUBTRACT, NEVER ZERO — WHY FLAG AND NOT CLEAR

Both new members route to flag (0.333), not to clear (0.000). That is the comment block's own
stated law ("The exemptor SUBTRACTS (never zeroes) so the span lands at gray -> the Jev judge,
not an abort") and it is the failure log's prescribed routing for HT-BUG-6 ("the judge rather
than aborting the stream"). The distinction matters mechanically: a span that keeps pos=2 and
gains neg=3 still carries signal — the Jev judge sees 0.333 and decides; a zeroed span would be
invisible to the judge tier entirely. Measured consequence on the probe grid: the two fixed
classes land in the JUDGED band, the design target stays in the ABORT band, and the sacred
predicate statement stays CLEAR (§3.7) — three bands, three dispositions, no collisions.

### 3.5 · COMPOSITION WITH W1'S SCORER FIXES

W2's fix is DATA (rule bytes); it rides on W1's MACHINERY (score.ts) and on HT-BUG-14's LOADER
(load.ts). The composition was re-verified this session at every joint:

```
- The block-style bank parser (load.ts, f93e34a) is what makes the live file loadable at all —
  the banks in §3.0 are BLOCK style. 9 of 9 rules load (§2.2). Without the loader fix the W2
  verification rig would throw on the first file (the pre-fix throw is W1 §2.2a's measurement).
- The per-bank span dedupe (score.ts) is what keeps HT-BUG-5's pos at 2 (suggestive[0] +
  suggestive[2] share the "be careful" tail; §2.6). Without it the probe would read pos=4 ->
  c = 4/(4+3+1) = 0.500 — still flag, but arithmetic that tracks a duplicated tail (the exact
  defect W1 fixed). The DEPLOYED extension still shows that 0.500-class arithmetic — §5.4.
- expandInflections (score.ts) touches ONLY the use bank at compile time; the two new members
  pass through it unchanged in effect (their alternations contain non-plain-word alternatives —
  punctuation-bearing ones like "no,? that is" — which the already-inflected/plain-word guards
  leave untouched; the plain-word alternatives that DO get suffixes, e.g. "phrase" ->
  "phrase(?:s|ed|ing)?", only widen the exemption, which is the exemptor's job). Idempotence of
  the expansion was W1's measurement and is unchanged code.
```

### 3.6 · THE RULE FILE'S OWN COMMENT BLOCKS — THE FIX IS SELF-DOCUMENTING

Lines 16-19 and 21-23 (quoted in §3.0) name the bug id, the date, the mechanism ("SUBTRACTS
(never zeroes)"), and the routing ("gray -> the Jev judge, not an abort") for each member. The
landed file therefore documents its own fix in place — the next reader of the rule sees WHY line
20 and line 24 exist without opening this report. This is also the audit trail the artifact-hash
law wants: the file's sha256 (7b5e5ceb…) covers both comment blocks and both members, and the
symbol counts (§ header) prove their presence: 1 hit each for the two exemptor names, 2 hits for
the bug ids.

### 3.7 · THE SACRED OVERLAP — RE-VERIFIED ON THE W2-UPDATED RULE

W1's hard invariant: a genuine predicate statement subtracts BOTH the descriptive member (-1) and
the use exemptor (-3) and lands silent. The W2 members add two more use bank entries — the risk
was an accidental exemption of the sacred span. Measured (probe R4, canonical span; probe R3,
inflected variant):

```
R4  "the predicate throws a nonzero exit"   pos=0 neg=4 c=0.000 band=clear   (the canonical span)
R3  "the check exits 1 on a violation"      pos=0 neg=3 c=0.000 band=clear   (the inflected variant)
```

```
R4: descriptive fires ("nonzero", "throws" -> -1) AND use[0] fires (expanded alternation -> -3):
    1 + 3 = 4 -> 0/(0+4+1) = 0.000. IDENTICAL to W1's fixture and live-rule numbers — the W2
    members do not fire on this span (no meta-correction vocabulary, no hedge frame+preposition).
    THE INVARIANT HOLDS ON THE UPDATED RULE.
R3: the inflected variant reads neg=3, not 4: the DESCRIPTIVE bank has no inflection expansion
    (only use: is expanded), so "exits 1" does not match the descriptive member's literal
    "exit 1". The band is still clear (0.000) — the invariant's OBSERVABLE holds — but the
    double-subtraction degrades to single on inflected descriptive shapes. Recorded as R3, §5.3.
```

---

## 4 · THE FILES — THE FIX COMMIT'S DIFF, COUNTED

`git show --stat f93e34a` (verbatim):

```
commit f93e34a083f7202114fc0539cbaa6d7872af0b56
Author: PBK Hydra <hydra@pbk.local>
Date:   Wed Sep 23 14:39:43 2026 +0400

    fix(W1+W2): the exemptor inflection + the overlap dedupe + the rule exemptors + the loader format

    W1 (the scorer) — HT-BUG-3 + HT-BUG-4 FIXED
      src/lexicon/score.ts: expandInflections() expands the use: bank at compile time (the
        alternation group + the bare-word case) -> 'exits' now matches \bexit\b
      src/lexicon/score.ts: the per-bank span dedupe -> two members sharing a tail count ONCE
      THE PROBES: HT-BUG-3 inflected pos=2 neg=3 c=0.333 band=flag (was neg=0 act)
                  HT-BUG-4 short pos=2 · long pos=2 (was 4 vs 2)
                  the sacred overlap: pos=0 neg=4 c=0.000 clear (PRESERVED)

    W2 (the live rules) — HT-BUG-6 + HT-BUG-5 FIXED
      ~/.omp/agent/rules/instruction-not-predicate.md: +2 use: members
        the meta-correction exemptor (a phrase inside a self-correction)
        the process-hedge exemptor (a hedge about the agent's own process)
      THE PROBES: HT-BUG-6 pos=2 neg=3 band=flag (was act)
                  HT-BUG-5 pos=2 neg=3 band=flag (was act)
                  the DESIGN instruction still pos=2 band=act (the target preserved)

    HT-BUG-14 (a NEW defect found while proving W2) — the loader could not read the LIVE rules
      THREE format gaps, each measured:
        the banks are BLOCK style (-\ item), not flow ([a, b])
        the band is INLINE (band: { low, high }), not two lines
        the patterns carry a LEADING inline flag ((?i)), which JS RegExp rejects
      FIXED: the block-style bank parser + the inline-band match + stripInlineFlags (ported from
      the live extension's lib.ts:59, case-insensitive compile).
      PROOF: loadRules(~/.omp/agent/rules) -> 9 of 9 rules load.

    GATES: tsc exit 0 · 63 pass / 0 fail · F1=1.000 · the purity EMPTY

 .trident/gate-verdict-proof.mjs         | 27 +++++++++++++
 context_management/RUNNING_DEBUG_LOG.md | 46 ++++++++++++++++++++++
 src/lexicon/load.ts                     | 55 ++++++++++++++++++++------
 src/lexicon/score.ts                    | 70 +++++++++++++++++++++++++++++---
 tests/adversarial.test.ts               | 11 ++++--
 5 files changed, 189 insertions(+), 20 deletions(-)
```

THE HONEST SCOPE NOTE ABOUT §4: the W2 fix itself (the rule bytes) is NOT in this diff — the rule
file lives OUTSIDE the repo (~/.omp/agent/rules/), so no repo commit can contain it. The rule-side
change is evidenced by four independent artifacts, all measured or quoted this session:

```
(a) the live file's content — lines 16-24 quoted verbatim in §3.0, sha256 7b5e5ceb… in the header;
(b) the commit message's W2 block (above) recording the change and its probe values;
(c) the file's own comment blocks naming HT-BUG-6 and HT-BUG-5, dated 2026-09-23 (§3.6);
(d) the measured BEFORE/AFTER delta (§2.3, §2.4) — the reconstruction method in §2.1/§5.2.
```

The repo-side portions of f93e34a that W2's verification RIDES on (the loader that reads the
live format; the scorer that applies the exemptor) — the score.ts and load.ts hunks, verbatim:

```
diff --git a/src/lexicon/load.ts b/src/lexicon/load.ts
--- a/src/lexicon/load.ts
+++ b/src/lexicon/load.ts
@@ -10,6 +10,12 @@
+export function stripInlineFlags(p: string): string {
+	return p.replace(/^\(\?[a-z]+\)/, "");
+}
@@ -28,14 +34,34 @@ function parseRule(file: string, raw: string): RawRule {
 	const bank = (name: string): string[] => {
-		const bm = fm.match(new RegExp(`^\\s*${name}:\\s*\\[([^\\]]*)\\]`, "m"));
-		if (!bm) return [];
-		return bm[1].split(",").map(...).filter(...);
+		// 1 · FLOW style: name: [a, b, c]
+		const flow = fm.match(new RegExp(`^\\s*${name}:\\s*\\[([^\\]]*)\\]`, "m"));
+		if (flow) { ... }
+		// 2 · BLOCK style: name:\n  - item\n  - item
+		const block = fm.match(new RegExp(`^\\s*${name}:\\s*$`, "m"));
+		if (!block) return [];
+		const after = fm.slice(block.index! + block[0].length);
+		const out: string[] = [];
+		for (const line of after.split("\n")) {
+			if (/^\s*#/.test(line)) continue;                     // a comment
+			if (/^\s*$/.test(line)) { if (out.length) break; else continue; }
+			const m2 = line.match(/^\s*-\s*(.+?)\s*$/);
+			if (!m2) { if (out.length) break; else continue; }     // the bank ended
+			out.push(m2[1].trim().replace(/^["']|["']$/g, ""));
+		}
+		return out.filter((s) => s.length > 0);
@@ -49,19 +75,26 @@
-				new RegExp(p);
+				new RegExp(stripInlineFlags(p));
@@ the band:
-	const low = Number(fm.match(/^\s*low:\s*([\d.]+)/m)?.[1] ?? NaN);
-	const high = Number(fm.match(/^\s*high:\s*([\d.]+)/m)?.[1] ?? NaN);
+	const inline = fm.match(/^\s*band:\s*\{\s*low:\s*([\d.]+)\s*,\s*high:\s*([\d.]+)\s*\}/m);
+	const low = Number(inline?.[1] ?? fm.match(/^\s*low:\s*([\d.]+)/m)?.[1] ?? NaN);
+	const high = Number(inline?.[2] ?? fm.match(/^\s*high:\s*([\d.]+)/m)?.[1] ?? NaN);

diff --git a/src/lexicon/score.ts b/src/lexicon/score.ts
--- a/src/lexicon/score.ts
+++ b/src/lexicon/score.ts
@@ (compile)
-		return new RegExp(p);
+		return new RegExp(stripInlineFlags(p), "i");
@@ (new, the HT-BUG-4 dedupe)
+type Span = { s: number; e: number };
+const overlaps = (taken: Span[], s: number, e: number): boolean =>
+	taken.some((x) => s < x.e && e > x.s);
@@ (new, the HT-BUG-3 expansion — applied ONLY to the use bank)
+export function expandInflections(pattern: string): string { ... CASE 1 alternation, CASE 2 bare word ... }
@@ (scoreSignals)
+	const takenSuggestive: Span[] = [];
+	const takenSubstitute: Span[] = [];
 		if (m && !overlaps(takenSuggestive, ...)) { ... pos += p.includes("\\b") ? 2 : 1; ... }
 		if (m && !overlaps(takenSubstitute, ...)) { ... pos += 2; ... }
 	for (const p of family.descriptive ?? []) if (compile(p).test(text)) neg += 1;
-	for (const p of family.use ?? []) if (compile(p).test(text)) neg += 3;
+	const takenUse: Span[] = [];
+	for (const p of family.use ?? []) {
+		const m = compile(expandInflections(p)).exec(text);
+		if (m && !overlaps(takenUse, m.index, m.index + m[0].length)) {
+			takenUse.push({ s: m.index, e: m.index + m[0].length });
+			neg += 3;
+		}
+	}
```

(The hunks are elided only where they repeat the full bodies already quoted in §3 — the added
lines are verbatim from `git show f93e34a -- src/lexicon/score.ts src/lexicon/load.ts`, run this
session; nothing is paraphrased.)

The follow-up commit that made the TESTS W2's authority:

```
$ git show --name-only --oneline 35c8f48
35c8f48 fix(test): HT-BUG-5/-6 probes read the LIVE rule (the authority for W2's fix)
tests/adversarial.test.ts
```

After f93e34a the test surface saw exactly one relevant change — 35c8f48 switched the HT-BUG-5/-6
probes from the synthetic local RULE copy to the live rule (the brief's "the authority"). The
battery at 1b395e3 therefore tests the fix where it lives.

---

## 5 · THE HONEST REMAINDER — WHAT IS PROVEN, WHAT IS NOT, AND WHAT FIRED ON ME

### 5.1 · THE SUBJECT OF EVERY GREEN

```
GREEN                              SUBJECT                                        INSTRUMENT
§2 probe rows (BEFORE/AFTER)       THE LIVE RULE FILE, via the engine's own       /tmp/w2-probe.ts
                                   loadRules -> scoreSignals -> bandOfLexicon     (repo modules)
§1 GATE 2, the 24/0 suite          THE REPO SOURCE (engine + surfaces +           bun test, explicit
                                   adversarial suites); the adversarial half      file paths
                                   ALSO reads the live rule (35c8f48)
§1 GATE 1, tsc exit 0              THE REPO SOURCE's types                        bunx tsc --noEmit
§2.2 the 9-rule load + census      THE LIVE RULES DIRECTORY                       loadRules
§3.7 R3/R4 the sacred spans        THE LIVE RULE via the repo scorer              /tmp/w2-probe.ts

NOT COVERED by any green above: the DEPLOYED extension bundle (~/.omp/agent/extensions/) —
whether the extension's OWN scorer/parser is at f93e34a's source level, and whether its parser
consumes the two new members correctly, was NOT verified this session. §5.4 measures one live
datum bearing on it (the deployed scorer's arithmetic differs from the repo's), which is
evidence OF the gap, not proof of the bundle's state. The L0/L1 deployed-bundle proof (bundle
sha match + a live firing of the NEW members) remains the orchestrator's gate — the same open
item W1 §5.1 recorded. Source-green (repo) + data-green (rule file) != deployed-green.
```

### 5.2 · THE PRE-FIX STATE'S PROVENANCE — THREE SOURCES, ALL NAMED, ALL AGREE

The BEFORE rows in §2 are a RECONSTRUCTION, not the pre-fix file. The honest chain:

```
SOURCE 1 (this session, MEASURED): the pre-W2 bank shape = the live family with use: truncated
  to its single member. WHY the reconstruction is exact: the pre-W2 use bank WAS one member —
  the file's line 15 is that member, and the commit message says "+2 use: members" (not
  "rewrote"), and the two comment blocks name the additions with today's date. The
  reconstruction therefore equals (current bank) minus (lines 20, 24) with their comments — a
  byte-level claim about WHAT was removed, anchored in the file's own structure. What the
  reconstruction CANNOT claim: that no OTHER byte of the rule changed at f93e34a. For that:
SOURCE 2 (prior session, the census — INHERITED): host-test-failure-log.md HT-BUG-5/-6 EVIDENCE
  blocks — 19/24 firings on process narration and 3 firings on meta-corrections within 8
  seconds, all band=act, measured in-process against the LIVE EXTENSION at 06:00-06:05. Quoted
  with provenance; NOT re-measurable (the pre-fix extension state is gone).
SOURCE 3 (the fix commit's message — INHERITED): "HT-BUG-6 pos=2 neg=3 band=flag (was act)";
  "HT-BUG-5 pos=2 neg=3 band=flag (was act)"; "the DESIGN instruction still pos=2 band=act".
  Authored by Main at fix time.
ALL THREE AGREE on every value: BEFORE pos=2 neg=0 band=act on both probes; AFTER pos=2 neg=3
band=flag; DESIGN unchanged act. The report's BEFORE rows rest on all three, not on memory.
```

### 5.3 · THE RESIDUALS — MEASURED, BOTH DIRECTIONS (the W1 lesson applied)

Every residual below is a tool output from this session's probes, not an assertion:

```
R1  THE "ABOUT-PHRASED" DESIGN INSTRUCTION IS INVISIBLE (pos=0, clear — not even flagged):
      "let me just add a check about the input validation" -> pos=0 neg=3 c=0.000 band=clear.
    WHY: suggestive[1] requires "add a (check|...) (that|to)" — "about" breaks the frame, so the
    detection never fires; use[2] (the hedge exemptor) DOES fire (neg=3) but on an already-zero
    span. Root cause is the FRAME's (that|to) tail, NOT the W2 exemptor — measured: the same
    string on the pre-W2 shape also reads pos=0 (the miss predates W2). But note the composed
    effect: the hedge exemptor's neg=3 on this span means IF a future suggestive member ever
    caught the about-phrasing, the exemptor would drag it to flag/clear. A detection gap wearing
    an exemption's arithmetic.
R2  THE CONTRACTION GAP IN use[1] (a meta-correction re-fires):
      "Now I must be careful (no, that's a design instruction). Let me EXECUTE."
      -> pos=2 neg=0 c=0.667 band=act (MEASURED).
    `no,? that is` does not match "no, that's". The census's own spans survived only via the
    "banned phrase" alternative (§3.1). Any self-correction phrased with the contraction and
    WITHOUT the exact vocabulary re-lands at act. Candidate one-character-class fix:
    `no,? that( i|')s` — NOT applied (this seat is read-only on the rule; and §5.5's scope).
R3  THE DESCRIPTIVE BANK HAS NO INFLECTION EXPANSION:
      "the check exits 1 on a violation" -> neg=3 (use[0] only), not neg=4 — "exits 1" misses
      the descriptive member's literal "exit 1". The band stays clear (the invariant's
      observable holds), but the double-subtraction degrades to single on inflected
      descriptive shapes. expandInflections is deliberately use-only (W1's guard-rail note);
      widening it is a W1-domain decision, recorded here as the measured boundary.
R4  THE CANONICAL SACRED SPAN HOLDS: pos=0 neg=4 c=0.000 clear — unchanged by W2 (§3.7).
R5  THE FIX IS A SUBSET OF THE HT-BUG-5 CENSUS CLASS (the big one — §5.4's live fire):
      "I should be careful about the census rate"  -> pos=2 neg=3 c=0.333 flag   (exempted —
        the preposition-marked form; note the positive comes from suggestive[2], since
        suggestive[0]'s frame does not even contain "i should")
      "I should be careful" (bare)                 -> pos=2 neg=0 c=0.667 act    (NOT exempted)
    The census's 19 firings were mostly BARE hedges ("be careful" / "I should be careful" in
    planning prose). The W2 exemptor covers only the about/regarding/concerning-marked subset.
    The bare class still aborts today — MEASURED LIVE ON THIS SEAT (§5.4, interrupt 1: "I'll be
    careful with the ≤76 col law" — "with", not "about" -> fired at act).
R6  THE SUBSTITUTION BANK OF THIS RULE IS EMPTY (0 members, measured §2.2) — so the W1 §5.2
    cross-bank dedupe limitation has NO instance in THIS rule (theatrical-verification.md's 3
    substitute members are that rule's business; its 2 use members are counted in §2.2's census).
```

### 5.4 · THE LIVE FIRE — THE RULE INTERRUPTED THIS VERIFICATION SEAT, TWICE

During the verification itself (after the battery, while drafting this report), the deployed
lexicon-gate aborted this seat's reasoning stream twice. Verbatim, both interrupts:

```
INTERRUPT 1  lexicon-gate INTERRUPT — rule "instruction-not-predicate" fired
             (confidence 0.800, source_kind own_utterance).
fired text:  "Let me now write. I'll be careful with the ≤76 col law for any fenced diagram —
             I'll use plain fences and short lines."

INTERRUPT 2  lexicon-gate INTERRUPT — rule "instruction-not-predicate" fired
             (confidence 0.667, source_kind own_utterance).
fired text:  "For my report this is gold for §5 (the honest remainder): the deployed extension's
             scorer ≠ the repo scorer; measured live THIS session by the gate's own interrupt
             (c=0.800 — the double-match signatur"   [window truncated]
```

What each datum PROVES (with the repo-side re-measurement, /tmp/w2-livefire.ts):

```
PROVEN 1 — THE DEPLOYED SCORER'S ARITHMETIC DIFFERS FROM THE REPO'S (pre-W1, no dedupe):
  c = 0.800 = pos 4 / (4+0+1) — the DOUBLE-MATCH signature: BOTH suggestive[0] ("I'll be
  careful") and suggestive[2] ("be careful") counted. The repo scorer on the same reported
  window reads pos=2 neg=0 c=0.667 (MEASURED, R5 rig). W1's per-bank dedupe makes pos=4
  IMPOSSIBLE on this window (the two spans overlap; the ledger skips the second) — so the
  deployed bundle predates the dedupe. This converts W1 §5.1's abstract caveat
  ("source-green != deployed-green") into a MEASURED live instance.
  Caveat, stated precisely: the gate scores the full utterance while "fired text" is the
  matched window; 0.800 on the utterance is the double-match signature regardless of which
  span produced it, because pos=4 requires two same-bank overlapping matches the repo scorer
  cannot produce.
PROVEN 2 — THE BARE-HEDGE CLASS STILL FIRES (R5's live confirmation): interrupt 1's span is a
  process hedge with NO about/regarding/concerning ("careful WITH the ≤76 col law") — the W2
  exemptor is preposition-keyed, the span carries no exemptor trigger, and the deployed rule
  (with or without the new members — see UNPROVEN 1) correctly/inevitably aborts it. This is
  HT-BUG-5's original census class, still live: the W2 fix bounds the class (preposition-
  marked hedges), it does not close it (bare hedges). The failure log's own WORK ORDER for
  HT-BUG-5 was W4 ("split the frame; require a system object") or W7 (demote to the RECORD
  tier) — what landed is a narrower third mechanism (preposition-marking). That is a REAL
  scoping decision to put in front of the orchestrator, not a defect claim: the 19/75-minute
  operational burden the log described is REDUCED (the about-marked subset now routes to the
  judge) but NOT eliminated.
PROVEN 3 — THE SELF-REFERENCE LOOP'S PRESSURE IS STILL LIVE (HT-BUG-6's class): interrupt 2
  fired on this seat REASONING ABOUT interrupt 1 while quoting its trigger phrase. The
  meta-correction exemptor did not save the span because the quoted reasoning carried no
  exemptor vocabulary ("no, that is..." / "banned phrase"). The loop is currently exited the
  only way it ever was: by not writing the phrase. (This report complies by quoting the fired
  WINDOWS verbatim as data — the evidence-quoting recursion the log itself hit at HT-BUG-6 —
  and these two windows did NOT re-fire: both landed as quoted data in tool results and file
  writes that the gate did not interrupt. Measured by the report existing.)
UNPROVEN 1 — whether the DEPLOYED extension has LOADED the two new members at all: both fired
  spans carry NO exemptor vocabulary, so the interrupts neither prove nor disprove the
  extension's parse of lines 20/24. The deployed-bundle proof (L0/L1: bundle sha + a live
  firing WITH exemptor vocabulary reaching flag) remains open — the orchestrator's gate.
NOTE — this seat messaged Main a three-line heads-up of the live-fire findings (hub send);
  the send's reply echoed the rule's own description rather than a delivery receipt, so
  delivery is UNCONFIRMED; the durable channel for these findings is THIS file.
```

### 5.5 · NOT PROVEN / OPEN — the list the next seat inherits

```
1. DEPLOYED-BUNDLE PARITY (L0/L1): bundle sha match + a live firing of the NEW members reaching
   flag. The one live datum this session produced (0.800 double-match) indicates the deployed
   scorer is pre-W1; the deployed PARSER's state is unknown. Orchestrator's gate.
2. THE BARE-HEDGE CLASS: still fires at act (measured live, twice, on this seat). Fix options
   on record: the log's W4 (system-object requirement) / W7 (RECORD-tier demotion), or a
   hedge-frame broadening that does not weaken the design-instruction catch. The DESIGN target
   (§2.5) is the invariant any broadening must preserve, plus the about-phrasing detection gap
   (R1) argues for fixing the FRAME, not widening the exemptor.
3. THE use[1] CONTRACTION GAP (R2): one-character-class candidate fix, unapplied (read-only
   seat; rule edits are the orchestrator's).
4. THE SINGLE-SESSION RATE DATA: the log's HT-BUG-5 STATUS stays OPEN on the firing-RATE cost
   question ("one session is not enough data"). This session adds two more firings to the
   census — both in the bare class — and zero data on the post-fix rate of the about-marked
   class. No rate claim is made.
5. THE PROBE RIGS ARE /tmp ARTIFACTS: /tmp/w2-probe.ts and /tmp/w2-livefire.ts are reproducible
   from §2.1's description and the quoted outputs, but they are session-local. If the
   orchestrator wants the BEFORE/AFTER reconstruction as a permanent instrument, it belongs in
   the tree's test surface (a pre-W2-shape fixture) — a decision above this seat's scope.
```

---

## 6 · THE COMMIT

```
THE FIX COMMIT (executed by the orchestrator, verified by this seat):
  f93e34a  fix(W1+W2): the exemptor inflection + the overlap dedupe + the rule exemptors + the
           loader format
  (the W2 payload is the RULE FILE's two use: members — outside the repo, evidenced per §4)
THE TEST AUTHORITY COMMIT:
  35c8f48  fix(test): HT-BUG-5/-6 probes read the LIVE rule (the authority for W2's fix)
THE BATTERY STATE:
  1b395e3  docs(P9)  <- the battery ran here; 1890262..1b395e3 is docs-only (§1, measured)
THE SEAM:  66b66a7f10c7c6e737a491b6e0f639039fcad6698224b9512b5be74493f7381d — re-measured
           this session, unchanged.
THE SUBJECT ARTIFACT:
  ~/.omp/agent/rules/instruction-not-predicate.md
  sha256 7b5e5ceb9f8ab74c6b3fc22c051f90edf9009ff8f3d9d77d75f8eb5230833944 (39 lines)
  symbol proof: "THE PROCESS-HEDGE EXEMPTOR" x1, "THE META-CORRECTION EXEMPTOR" x1,
  "HT-BUG-5|HT-BUG-6" x2, use: x1 (grep -c, this session)
THE REPORT COMMIT:  <filled at commit time — this file is the ONLY object in that commit;
                     see the sha in the landing message>
```

```
CLOSE-OUT CHECKLIST
  [x] the reading order read before any probe (W1_FIX_REPORT.md as the format template, the
      failure log's HT-BUG-5/-6 entries, the live rule in FULL, score.ts, load.ts, the
      adversarial tests)
  [x] the subject probed through the REAL pipeline (loadRules -> scoreSignals -> bandOfLexicon),
      not a re-implementation
  [x] all three contract probes measured on BOTH shapes (pre-W2 reconstruction vs the live rule)
  [x] the DESIGN target verified preserved on both shapes AND asserted by the tree's own suite
  [x] loadRules(~/.omp/agent/rules) -> 9 rules, measured; the use-member census recorded
  [x] the gate run ONCE, every line pasted raw, at a measured sha with the pin deviation
      accounted for (docs-only delta, §1)
  [x] the pre-fix provenance named source-by-source (§5.2) — nothing restated from memory
  [x] every residual MEASURED, both directions (§5.3), including the two the fix does NOT cover
  [x] the live-fire evidence captured verbatim and bounded (what it proves, what it does not)
  [x] the repo untouched by this seat: src/, tests/, and the live rules dir READ-ONLY;
      exactly one file authored (this report)
  [ ] L0/L1 deployed-bundle proof — OUT OF SCOPE, orchestrator's gate (§5.1, §5.5.1)
```
