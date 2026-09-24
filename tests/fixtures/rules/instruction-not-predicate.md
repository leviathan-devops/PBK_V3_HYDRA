---
description: 'Catches a PREVENTION stated as an instruction or a warning instead of a predicate. An ACTION frame, never a mention.'
scope: [text, thinking]
interruptMode: always
# TTSR is EMPTY (the architecture change 2026-09-23): the condition: block was removed so
# TTSR registers 0 rules. The EXTENSION is the enforcement; this lexicon IS the decision.
lexicon:
  descriptive:
    - '\b(exit 1|nonzero|asserts?|throws)\b'
  suggestive:
    - '\b(we (should|must|need to)|i.?ll|let.?s|let me) (just )?(make sure|ensure|remember to|be careful|always|never)\b'
    - '\b(add a (check|warning|reminder|note|comment) (that|to))\b'
    - '\b(be (more )?careful|pay attention to|watch out for|keep in mind)\b'
  use:
    - '\b(exit|predicate|nonzero|throws?|fails?|asserts?)\b'
    # HT-BUG-6 (2026-09-23): THE META-CORRECTION EXEMPTOR. An agent ATTEMPTING to comply by
    # naming the banned phrase ("(no, that's the banned phrase)") re-fired the rule. A phrase
    # inside a meta-correction is a mention, not a violation. The exemptor SUBTRACTS (never
    # zeroes) so the span lands at gray -> the Jev judge, not an abort.
    - '\b(banned phrase|no,? that is|no \u2014 that is|avoid the trigger|the trigger phrases?)\b'
    # HT-BUG-5 (2026-09-23): THE PROCESS-HEDGE EXEMPTOR. A hedge about the agent's OWN process
    # ("let me be careful ABOUT the gate") is not a prevention about a SYSTEM. The rule's target
    # is a design instruction ("let me just add a check"), which carries no such preposition.
    - '\b(let me|i.?ll|i should|we should|let.?s)\b[^.]{0,40}?\b(about|regarding|concerning)\b'
threshold: 0.3
band: { low: 0.3, high: 0.62 }
---

THE PREDICATE LAW. A prevention is a MECHANICAL PREDICATE, never an instruction. THE EXIT TEST: does something exit NONZERO when this is violated? If nothing fails, it is documentation.

<!--
THE DERIVED BAND — computed this turn, never inherited.
corpus: 4 positives + 6 negatives (the corpus §4.1 set).
min(positive) = 0.6667   max(negative) = 0.0   SEPARABLE = True
band = 0.3/0.62   (low = max(neg)+0.05, floored at 0.30; high = min(pos)-0.05)
source: the corpus §3.6   kills: R11,R36
POSITIVE scores: [0.6667, 0.6667, 0.6667, 0.6667]
NEGATIVE scores: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
-->
