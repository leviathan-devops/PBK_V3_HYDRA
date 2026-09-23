# SUGGESTED IMPROVEMENTS — EACH WITH ITS COST-IF-WRONG

## S-1 · THE CORRECTION SENTINEL (the F-1 fix) — HIGH VALUE, LOW RISK

```
THE CHANGE   wrap injected corrections in a sentinel (e.g. a leading `\u0000CG\u0000` or a
             dedicated field on the event) and have classifySource resolve any text carrying it
             to `doc`.
THE COST IF WRONG   if the sentinel leaks into the model's visible context, it becomes noise in
             the transcript. Mitigation: strip it at delivery, keep it only on the scoring path.
WHY IT IS FIRST   it is the same class the tool_result channel already solved; the fix is
             known-good, and the defect pollutes the ledger's attribution.
```

## S-2 · THE RULE TIER CALIBRATION (the F-2 question) — MEDIUM VALUE, MEDIUM RISK

```
THE CHANGE   a per-rule TIER: an ABORT tier (interrupts the stream) vs a RECORD tier (writes
             the row, injects nothing). `instruction-not-predicate` is the candidate for RECORD
             on the strength of 23 fires in one session, most on ordinary planning prose.
THE COST IF WRONG   a genuine derailment routed to the RECORD tier stops being interrupted —
             the gate becomes advisory exactly where it was load-bearing.
WHY IT IS NOT DONE UNILATERALLY   the rule is CORRECT on every instance measured. The question
             is the firing RATE's cost, and that needs more than one session's data.
```

## S-3 · THE CHANNEL ENUMERATION TEST (the G-1 guard) — HIGH VALUE, LOW RISK

```
THE CHANGE   a unit test that enumerates every call site of `decide()` and asserts each passes
             an explicit fileKind — so a new hook cannot be added without declaring its kind.
THE COST IF WRONG   a false failure when a call site legitimately relies on the default. Cheap
             to fix by making the default explicit.
WHY IT MATTERS   F-1 was a NEW-ish channel (sendUserMessage delivery) that the tool_result fix
             did not cover. The enumeration makes the sibling-sweep mechanical.
```

## S-4 · THE LOAD-LINE ASSERTION (the hot-reload proof) — MEDIUM VALUE, LOW RISK

```
THE CHANGE   a post-edit check that greps the current process's log for a load line NEWER than
             the edited file's mtime — so "did my edit take?" is one command.
THE COST IF WRONG   a false negative if the log path rotates mid-session; the fallback is the
             documented manual check.
WHY IT MATTERS   the hot-reload distinction (rules in-process, code per-process) is the single
             most operationally confusing property of the system.
```

## S-5 · THE COST GUARD ON THE SCORED SLICE — LOW VALUE, LOW RISK

```
THE CHANGE   assert the `slice(0, 4000)` cap exists at every scoring call site; a change to the
             cap must be accompanied by a re-run of the latency probe.
THE COST IF WRONG   none material — the assertion is cheap and the cap is currently correct.
WHY IT MATTERS   the cap is the entire reason a per-delta hook is viable; removing it silently
             would scale cost with delta size.
```

## S-6 · THE CANON'S "UNBUILT" MARKER — HIGH VALUE, ZERO RISK

```
THE CHANGE   a mandatory first-line status on the canon's CURRENT_STATE: BUILT | UNBUILT |
             PARTIAL, so a dense canon cannot be mistaken for a built system.
THE COST IF WRONG   none — it is a label.
WHY IT MATTERS   P-3 (the recurring pattern): documentation mass reads as progress. The
             hydra canon is 2000+ lines and the code is 0 lines.
```
