# META-OBSERVATIONS — THE HYDRA-WORKERS / LEXICON-GATE CAMPAIGN

**Mode:** pattern extraction (the build is believed; harvest the lessons).
**Sources:** the 6 ship docs · `git log` · the corpus · the 24-firing census · the probes.
**Date:** 2026-09-23.

---

## §1 · THE SUCCESSFUL LOOP (what actually worked, in order)

```
1  THE ANOMALY ENTRY        a 3-loads-in-8ms burst was treated as a FINGERPRINT, not noise
2  THE CORRELATION          the log named the trigger (`runSubagent` x3 -> `N rules loaded` x3)
3  THE ROUND TRIP           plant -> trigger -> observe -> REMOVE -> trigger -> observe
                            ★ the REVERSAL is the proof; a one-way effect could be a fresh process
4  THE INSTRUMENT CONTROL   Test A's "CACHED" verdict was refuted by Test A-2 (the frontmatter)
5  THE PROVENANCE CHECK     the delivery channel was read: sendUserMessage = "as if typed by the user"
6  THE FIRING CENSUS        the session JSONL walked for the DELIVERY form -> 24, line-numbered
7  THE SCOPE DECLARATION    every test result labelled source / unit / runtime
8  THE HONEST VERDICT       WITNESSED / PINNED / FRONTIER — never "100%"
```

## §2 · WHAT FAILED (the patterns that drew a correction)

```
F-1  AN INFERENCE PUBLISHED AS A MEASUREMENT       the census stood in for the experiment
F-2  A NULL FROM AN UNVALIDATED PROBE              the probe measured an unread field
F-3  A CORRELATION READ AS A MECHANISM             the ui.loop-blocked story (disproven)
F-4  A GATE SPEAKING AS THE PRINCIPAL              sendUserMessage (operator-caught)
F-5  A GREEN SUITE WITH AN UNSTATED SCOPE          it tests lib.ts, not the runtime
F-6  A SOURCE FIX REPORTED AS LIVE                 the process predates the edit
F-7  A MEASUREMENT IN THE WRONG DIRECTORY          a persisted `cd`
F-8  A NEAR-DUPLICATE SKILL MINTED WITHOUT CHECKING  the sibling already covered the mechanism
```

## §3 · WHAT RECURS (needs a systemic fix — the countermeasures)

```
R-1  THE FORM-WITHOUT-SUBSTANCE PATTERN
     Seven of the eight theatricality entries are ONE mechanism: the SHAPE of verification
     produced without its SUBSTANCE, convincing because the shape is right.
     ★ THE COUNTERMEASURE (belongs in the standing rules):
       FOR EVERY VERIFICATION ARTIFACT, ASK: "what would this look like if the thing it claims
       were FALSE?" If it would look the SAME, it is a form, not a proof.

R-2  THE CHANNEL-BLIND FIX
     The tool_result fix solved a class and missed the sibling channel (sendUserMessage).
     ★ THE COUNTERMEASURE: after fixing a class at one channel, ENUMERATE THE SIBLINGS.

R-3  THE SELF-REFERENCE LOOP
     A rule that fires on the agent's meta-commentary about the rule. Reproduced live: the
     failure log's own write was blocked by the gate.
     ★ THE COUNTERMEASURE: the split-string encoding for any record of a trigger shape.

R-4  THE TWO-VALUE "CONFIDENCE"
     Two suggestive members share a tail -> the confidence takes only 0.667 or 0.800.
     ★ THE COUNTERMEASURE: deduplicate overlapping matches; a confidence that does not vary
       with severity is a label.
```

## §4 · THE CLASSIFICATION (per the taxonomy)

```
BUG CLASSES FOUND (the code-defect axis)
  | the class                | the instance                                    | the fix |
  | PROVENANCE-ABSENT        | the delivery channel (HT-BUG-1)                  | sendMessage+customType |
  | SAME-CLASS-NEW-DOOR      | the correction re-score (HT-BUG-2)               | the same edit + the sweep |
  | EXEMPTOR-INFLECTION-GAP  | \bexit\b misses "exits" (HT-BUG-3)              | expand the bank |
  | SCORE-INFLATION          | the overlapping members (HT-BUG-4)               | deduplicate |
  | TARGET-CLASS DRIFT       | the rule fires on narration (HT-BUG-5)           | split the frame |
  | EVIDENCE-QUOTING RECURSION | the self-reference loop (HT-BUG-6)             | the meta-frame exemptor |
  | SUBSTRATE-ABSENT         | jev 402 on all 102 rows (HT-BUG-7)               | operator action |
  | DEPLOYED-IS-NOT-SOURCE   | the fix is not live (HT-BUG-8)                   | a new process |

PROCESS PATTERNS FOUND (the methodology axis)
  | the pattern              | the instance                                     | the prevention |
  | PROVENANCE CONFUSION     | a census read as a measurement (F-1)             | label INFERRED vs MEASURED |
  | INSTRUMENT UNVALIDATED   | the false-negative probe (F-2)                   | the known-effect control |
  | CAUSAL-ON-ONE-WINDOW     | the ui.loop-blocked story (F-3)                  | the A/B before the claim |
  | SCOPE INFERENCE          | the near-duplicate skill (F-8)                   | grep the skill catalog first |
  | CWD DRIFT                | the wrong-directory measurement (F-7)            | assert `pwd` before measuring |
  | DOCTRINE INHERITANCE     | the invented weights (EN-9)                      | read the CONTRACT, not the memory |
```

## §5 · NOTES FOR FUTURE AGENTS (the durable handoff)

```
1  THE RUNNING PROCESS IS THE SUBJECT. Its log line is the only proof. The source is a claim.
2  A ROUND TRIP BEATS AN OBSERVATION. The reversal brackets the mechanism.
3  CLASSIFY BEFORE COUNTING. grep -c counts MENTIONS. MECHANICAL vs PROSE-ONLY is the law.
4  STATE THE SCOPE OF EVERY TEST. source / unit / runtime — a green suite is silent on the rest.
5  A `cd` PERSISTS. Print `pwd` before any git/count measurement.
6  THE GATE IS RIGHT WHEN IT FIRES ON YOUR PROSE. Change the prose; never argue with the gate.
7  THE OPERATOR'S QUESTION ("how did you verify it") IS THE COUNTERMEASURE for the one class
   the mechanical checks cannot reach: a claim about METHOD whose artifact looks complete.
8  THE SCAFFOLD IS NOT THE PRODUCT. 2,556 lines of canon; 0 lines of the engine.
```
