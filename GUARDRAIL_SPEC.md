# GUARDRAIL SPEC — THE MECHANICAL ENFORCEMENT (G-1..G-10)

Each guardrail is a MECHANICAL PREDICATE with a named failure mode — not an instruction.

## G-1 · THE FORM-VS-SUBSTANCE QUESTION (the meta-guardrail)

```
THE PREDICATE  for every verification artifact, ask: "what would this look like if the thing it
               claims were FALSE?" If it would look the SAME, it is a form, not a proof.
THE CHECK      applied at the moment of writing any verification claim.
THE FAILURE IT PREVENTS  seven of the eight theatricality entries — the whole class.
```

## G-2 · THE KNOWN-EFFECT INSTRUMENT CONTROL

```
THE PREDICATE  a probe that reports "nothing happened" must first be validated against an input
               whose effect is KNOWN to be visible.
THE CHECK      run the probe on a known-effect input; if it reports no change, the INSTRUMENT is
               broken, not the mechanism.
THE FAILURE IT PREVENTS  the false-negative probe (Test A printed "CACHED" over the truth).
```

## G-3 · THE ROUND TRIP

```
THE PREDICATE  no reload/refresh/live-update claim without the ADD and the REMOVE observed in
               the SAME process.
THE CHECK      plant -> trigger -> observe; remove -> trigger -> observe; the count returns.
THE FAILURE IT PREVENTS  a one-way effect misread as a mechanism (it could be a fresh process).
```

## G-4 · THE MECHANICAL-OR-PROSE CENSUS

```
THE PREDICATE  a firing count is MECHANICAL (a delivery/toolResult/extension-error with a line
               number) or it is PROSE. grep -c counts MENTIONS.
THE CHECK      walk the session JSONL for the delivery form; count the prose mentions separately;
               report the RATIO.
THE FAILURE IT PREVENTS  measuring the conversation about the gate instead of the gate.
```

## G-5 · THE DEPLOYED-IS-NOT-SOURCE CHECK

```
THE PREDICATE  compare the edited file's mtime to the running process's start before claiming a
               fix is live.
THE CHECK      stat the file; ps the process; the later timestamp is the fix, the earlier is
               the runtime.
THE FAILURE IT PREVENTS  reporting a source edit as a runtime behaviour.
```

## G-6 · THE PROVENANCE CHECK ON EVERY INJECTED MESSAGE

```
THE PREDICATE  every message a system injects declares WHO it claims to be.
THE CHECK      grep the delivery call site; a user-impersonating API is a defect; a native
               customType is the fix; the consumer should see a source marker.
THE FAILURE IT PREVENTS  an authority-spoof — a gate speaking as the principal.
```

## G-7 · THE SCOPE DECLARATION ON EVERY TEST RESULT

```
THE PREDICATE  every test result names its scope: SOURCE (the module) / UNIT (a harness) /
               RUNTIME (the live system).
THE CHECK      read the result line; an unstated scope defaults to the weakest reading.
THE FAILURE IT PREVENTS  a green source suite read as a green runtime.
```

## G-8 · THE SIBLING-CHANNEL SWEEP

```
THE PREDICATE  after fixing a defect class at one channel, enumerate the sibling channels.
THE CHECK      grep every call site of the mechanism; each must declare its context explicitly.
THE FAILURE IT PREVENTS  the same class through a new door (the tool_result fix missing
               sendUserMessage).
```

## G-9 · THE CWD ASSERTION

```
THE PREDICATE  print `pwd` (and `git rev-parse --show-toplevel` for git measurements) before
               any measurement.
THE CHECK      the two lines at the head of the measurement block.
THE FAILURE IT PREVENTS  a persisted `cd` producing another subject's numbers.
```

## G-10 · THE CATALOG CHECK BEFORE MINTING A SKILL

```
THE PREDICATE  before creating a skill, grep the catalog for an existing one covering the
               mechanism.
THE CHECK      ls the managed-skills + skills dirs; read the near-matches' descriptions.
THE FAILURE IT PREVENTS  a near-duplicate (this campaign minted one; the sibling already
               covered the reload mechanism).
```
