# THE ADVERSARIAL CORPUS PLAN (P7) — the surface map IS the probe plan

## STEP 1 — MAP EVERY EXPORTED DECISION FUNCTION (the surface map)
```
W1 · THE ENGINE (wt-engine/src/)
  check(req): Promise<Decision>          THE entry — probe with every CheckRequest shape
  the scorer (scoreSignals-equivalent)   probe: the weights, the exemptor, the band derivation
  the band derivation                    probe: the corpus that DERIVES {low, high}
  the lint runner                        probe: the known-bad REFUSED, the known-good accepted
  the ledger writer                      probe: the row shape, the decidedBy field, the jev:null reason
  the loader                             probe: a missing `use:` THROWS; an invalid regex THROWS

W2 · THE SURFACES (wt-surfaces/src/)
  classifySource(line, inFence, fileKind) probe: the 5 kinds + the fence/table/quote/heading cases
  isQuotedMatch(line, match)              probe: the quote-STATE walk (open/closed/nested/escaped/absent)
  the delta accumulator                   probe: a line split across 2 deltas; the buffer cap
  the abort dedupe                        probe: the same (rule, span) N times -> 1 abort
  the action dispatch                     probe: the 4 rows x the bands -> the right action kind
  the entry (pi.on registrations)         probe: every hook present; NO band math
```

## STEP 2 — THE CORPUS PER FUNCTION (positive + negative + edge + the FULL evasion family)
```
★ NEVER the one example in a comment. Probe the WHOLE family.
★ THE FOUR CLASSES per function:
   POSITIVE  the attack shapes it exists to catch        -> each fires its SPECIFIC token
   NEGATIVE  the legit operations it must allow          -> each passes with ZERO misfire
   EDGE      empty · null · whitespace · unicode · huge · repeated calls · boundaries
   EVASION   the bypass family (the FULL member list, not one example)

THE EVASION FAMILIES FOR THIS SYSTEM (measured from the live extension's history):
  - the quoted mention:  a rule's text inside "..." or `...` or a fence
  - the table row:       a rule's text inside a | ... | markdown table
  - the doc line:        a rule's text inside a .md file's prose
  - the split delta:     a trigger phrase split across two message_update events
  - the inflection:      "exits" / "asserted" / "blocked" (the exemptor's inflection gap)
  - the meta-correction: the agent quoting a banned phrase IN ORDER TO AVOID IT
  - the self-reference:  the agent describing the rule that just fired on it
  - the correction echo: the gate's OWN injected text re-entering the stream
```

## STEP 3 — THE ADJUDICATION (every failure, BOTH ways, BEFORE any verdict)
```
SIDE A — was MY probe wrong?  (the wrong expectation, the wrong arg shape, the wrong enum,
                              the wrong call sequence, the missing required field)
SIDE B — is the observed behavior a REAL contract violation?
★ THE MEASURED LESSON FROM THE PRIOR ROUND: 14 of 15 "fails" in one sweep were the TESTER'S
  own wrong expectations. The expectation check comes FIRST.
★ Only CONFIRMED Side-B defects are findings. A probe-error is recorded as a probe-error.
```

## STEP 4 — THE KNOWN DEFECTS TO RE-PROBE (they are the regression pins)
```
HT-BUG-3  the exemptor misses inflections       probe: "let me be careful: the check exits 1"
HT-BUG-4  the double-match -> two-value conf    probe: "be careful" vs "let me be careful"
HT-BUG-5  the rule fires on process narration   probe: "Let me start with X" (a sequencing hedge)
HT-BUG-6  the self-reference loop               probe: "I must be careful (no, that's banned)"
HT-BUG-10 the audit gate's blind PASS           probe: run the audit on a KNOWN-DEFECT corpus;
                                                 if it reports 0, the GATE is broken
★ EACH RE-PROBE IS THE ACCEPTANCE CRITERION: the defect's exact scenario must now behave
  correctly (or be recorded as still-OPEN with the reason).
```

## STEP 5 — THE TERMINATION
```
The loop terminates ONLY when:
  [ ] a FULL pass returns ZERO confirmed defects
  [ ] the docs sweep is clean (no stale SHA markers)
  [ ] the unswept frontier is EXPLICITLY NAMED (the honest remainder)
★ NEVER "100% clean" without the sweep that proves it; NEVER "nothing left" without naming
  what was NOT swept.
```
