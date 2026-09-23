# SUGGESTED IMPROVEMENTS — EACH WITH ITS COST-IF-WRONG

## S-1 · THE DELIVERY-CHANNEL FIX (the pedigree + the re-score, one edit) — HIGHEST VALUE

```
THE PROBLEM   sendUserMessage impersonates the operator AND re-enters the scoring path.
WHY WORTH IT  it fixes HT-BUG-1 (authority-spoof) and HT-BUG-2 (ledger pollution) at once,
              and it is the same class the tool_result channel already solved.
THE CHANGE    pi.sendMessage({{customType: "<native type>", content, display:true}},
              {{deliverAs:"steer"}}) + an `input` hook routing event.source === "extension".
COST IF WRONG minimal — identical delivery semantics; only the provenance changes.
STATUS        APPLIED IN SOURCE. Not live (the process predates it).
```

## S-2 · THE SIBLING-CHANNEL SWEEP (mechanical) — HIGH VALUE

```
THE PROBLEM   a defect class fixed at one channel survives at its siblings (the tool_result
              fix missed the delivery channel).
WHY WORTH IT  it converts the highest-value finding of the campaign into a mechanism.
THE CHANGE    a test that enumerates every call site of the scoring function and asserts each
              declares its source kind explicitly — so a new channel cannot be added silently.
COST IF WRONG a false failure when a call site legitimately relies on the default; make the
              default explicit at each site.
```

## S-3 · THE EXEMPTOR NORMALIZATION — HIGH VALUE

```
THE PROBLEM   \bexit\b misses "exits"; the exemptor fired on 0 of 24 live firings.
WHY WORTH IT  it directly lowers the false-positive rate on any text using an inflected
              predicate word.
THE CHANGE    normalize the `use:` bank at load: (s|ed|ing)? on every member. ONE change
              covering all nine rules.
COST IF WRONG under-firing (a real violation mentioning "exit" is suppressed).
CONTROL       the descriptive bank OVERLAPS the use bank -> a genuine predicate statement
              subtracts twice (-1 and -3) and lands at 0.000. PRESERVE THE OVERLAP.
```

## S-4 · THE META-CORRECTION EXEMPTOR — MEDIUM VALUE

```
THE PROBLEM   the self-reference loop: an agent quoting a banned phrase to avoid it fires.
WHY WORTH IT  it removes a loop the agent can only exit by going silent.
THE CHANGE    a `use:` member for the meta-frame (a trigger phrase adjacent to a self-negation:
              "not", "banned", "avoid", "no,").
COST IF WRONG a real violation hiding inside quotes. CONTROL: the exemptor SUBTRACTS, never
              zeroes — a quoted meta-correction lands at gray, routing to the judge, not an abort.
```

## S-5 · THE CANON'S MANDATORY STATUS LINE — HIGH VALUE, ZERO RISK

```
THE PROBLEM   a 2,556-line canon over a 0-line product reads as progress.
WHY WORTH IT  it is the cheapest fix for the highest-frequency misread.
THE CHANGE    a mandatory first-line status on CURRENT_STATE: BUILT | UNBUILT | PARTIAL.
COST IF WRONG none — it is a label.
```

## S-6 · THE CWD ASSERTION IN EVERY MEASUREMENT — MEDIUM VALUE, ZERO RISK

```
THE PROBLEM   a persisted `cd` made a measurement report another repo's numbers.
WHY WORTH IT  a measurement without a cwd assertion measures an unknown subject.
THE CHANGE    print `pwd` + `git rev-parse --show-toplevel` before any git/count measurement.
COST IF WRONG none — two lines of output.
```

## S-7 · THE ROUND-TRIP STANDARD FOR ANY RELOAD/REFRESH CLAIM — HIGH VALUE

```
THE PROBLEM   a reload mechanism was published as measured from a census.
WHY WORTH IT  it makes the one-way-effect ambiguity impossible.
THE CHANGE    require the ADD and the REMOVE in the SAME process before any reload claim.
COST IF WRONG none — it is one extra trigger.
```
