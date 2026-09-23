# GUARDRAIL SPEC — THE SHELL-LEVEL ENFORCEMENT (G-1..G-8)

Derived from the 2026-09-23 hydra-workers campaign. Each guardrail is a MECHANICAL PREDICATE
with a named failure mode — not an instruction.

## G-1 · SWEEP THE SIBLING CHANNELS (the F-1 guard)

```
THE PREDICATE  every scoring channel that delivers text into a scored surface must be
               enumerated in one list, and exempting one requires checking the rest.
THE CHECK      grep -n 'classifySource\|decide(' ~/.omp/agent/extensions/lexicon-gate/index.ts
               -> every call site must name its fileKind explicitly; a call site with no kind
               defaults to own_utterance and is the F-1 door.
THE FAILURE IT PREVENTS  the tool_result fix shipped while sendUserMessage stayed open —
               14 ledger rows in the gate's own voice.
```

## G-2 · THE NEGATIVE CONTROL ON EVERY GATE

```
THE PREDICATE  a gate's first run is against a state that MUST fail it.
THE CHECK      bash gates/merge-gate.sh worker/engine wt-engine on the empty branches
               -> must print `GATE: FAIL`.
THE FAILURE IT PREVENTS  a gate that has never failed has never been tested; it is a rubber
               stamp wearing a check's name.
```

## G-3 · NO CAUSAL CLAIM FROM ONE WINDOW

```
THE PREDICATE  a causal claim carries an A/B or a control, run in the same session.
THE CHECK      the ui.loop-blocked census: count pids with blocks AND count pids with fires;
               a pid with blocks and ZERO fires is the control.
THE FAILURE IT PREVENTS  the plausible story winning over the true one — both quiet the symptom.
```

## G-4 · A PREDICATE NAMES THE MISSING STEP

```
THE PREDICATE  a check's failure message names the specific missing lifecycle step (L1/L2/G5/G6),
               never a general "incomplete".
THE CHECK      read the check.sh failure lines.
THE FAILURE IT PREVENTS  a status field that says "not ready" without saying what is missing,
               forcing a re-derivation of the whole state.
```

## G-5 · THE CORRECTION CHANNEL IS DATA

```
THE PREDICATE  any text the system INJECTS into the conversation must be exempt from scoring
               the agent — resolved to `doc`, never `own_utterance`.
THE CHECK      after a fire, count ledger rows whose span equals the injected correction text
               -> must be 0.
THE FAILURE IT PREVENTS  the gate scoring its own voice (F-1).
```

## G-6 · MEASURE THE COST BEFORE THEORISING THE BOTTLENECK

```
THE PREDICATE  a latency or cost hypothesis is preceded by a direct measurement of the
               mechanism's per-call cost.
THE CHECK      bun run ~/.omp/agent/extensions/lexicon-gate/latency-probe.ts
THE FAILURE IT PREVENTS  a 3-second correlation becoming a latency theory when the measured
               cost is 0.024 ms.
```

## G-7 · THE EXEMPTOR IS PROTECTED ABOVE ALL

```
THE PREDICATE  the SCORABLE set and the classifySource pre-gate are the LAST things edited and
               the FIRST things tested.
THE CHECK      bun test -t source_kind_gate -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
THE FAILURE IT PREVENTS  a gate that fires on its own documentation — unmaintainable, and the
               fastest route to the gate being disabled.
```

## G-8 · THE VOCABULARY IS ASSERTED AT THE SEAM

```
THE PREDICATE  every enum that crosses a boundary carries a compile-time exhaustiveness
               assertion, and a divergent implementation vocabulary is mapped BEFORE a port.
THE CHECK      grep -n 'Band' SEAM/seam.ts ~/.omp/agent/extensions/lexicon-gate/lib.ts
               -> act|flag|clear vs silent|gray|fire must be a NAMED divergence with a map.
THE FAILURE IT PREVENTS  a port that silently mistranslates every band (F-2's sibling class).
```
