# THE RUNTIME ROUND — TWO REAL DEFECTS FOUND (2026-09-24)

**The container ran the DEPLOYED bundle. The green suite said 33/34 pass. The runtime found TWO
defects the suite COULD NOT SEE.**

## ★ THE HEADLINE

```
THE RUNTIME TEST FOUND 2 REAL DEFECTS THAT A GREEN SUITE CERTIFIED AS WORKING:
  HT-BUG-21  the inject carried display:true (the "package" box)
  HT-BUG-22  the inject was ALWAYS NULL — the abort fired, the correction NEVER did

★ BOTH WERE IN THE SOURCE. BOTH WERE INVISIBLE TO 33-34 PASSING UNIT TESTS.
★ THIS IS EXACTLY WHAT THE GOAL'S "RUNTIME SUBSTRATE" LAW EXISTS FOR.
```

## HT-BUG-21 · THE "PACKAGE" FORMAT — FOUND IN THE CONTAINER

```
DRIVEN: a known-firing span through the DEPLOYED bundle -> the inject carried display:true.
MEASURED IN THE SOURCE: src/surfaces/prose.ts:41  display: true
ROOT CAUSE: my EARLIER fix landed in the OLD tree (~/.omp/agent/extensions/lexicon-gate/index.ts),
  NOT the source. THE GOAL'S OWN LAW: EDITS GO TO THE SOURCE.
WHY THE SUITE MISSED IT: the unit tests assert the CONTENT, never the display flag.
FIX: display:false + attribution:"agent" + details:{rules,confidence,sourceKind,span} — the native
  shape measured in the omp binary. + the HT-BUG-21 regression pin.
```

## ★★ HT-BUG-22 · THE ABORT WITH NO CORRECTION — THE THEATRICAL ENFORCEMENT

```
DRIVEN IN THE CONTAINER (the real surface handler, a known-firing span):
  aborts=1  injected=0    <- IT STOPPED THE MODEL AND TOLD IT NOTHING

THE MECHANISM (verbatim, src/surfaces/entry.ts:70):
  const a = proseAction(res, { lastSignature: `${d.ruleId}:${d.span}` });   <- the CURRENT sig
and proseAction (src/surfaces/prose.ts:36-37):
  const sig = `${d.ruleId}:${d.span}`;
  if (opts.lastSignature === sig) return { abort: [], inject: null };
★ opts.lastSignature === sig IS ALWAYS TRUE -> the inject is ALWAYS null.
★ THE MODEL IS ABORTED WITH NO EXPLANATION — an enforcement that stops you but never teaches.

WHY THE 33-PASS SUITE COULD NOT SEE IT:
  the unit tests call proseAction(res, { lastSignature: "" }) — an EMPTY string that never equals
  the computed sig -> the tests GOT the inject. THE TESTS BYPASSED THE BUG.
  ★ A test that calls the pure function with a DIFFERENT input than the caller passes is not a
    test of the caller. The seam between the surface and the pure function was untested.

FIX: proseAction(res) — no lastSignature. The dedupe is ALREADY done upstream (buf.shouldFire,
src/surfaces/entry.ts:67). + the HT-BUG-22 test that DRIVES THE REAL HANDLER (install +
message_update) and asserts aborts==1 AND sent==1.
```

## ★ THE RUNTIME PROOF (after the fixes, in the container)

```
the deployed bundle: 29461d618a209211 · display:false
DRIVEN (a known-firing span through the real handler):
  aborts=1 injected=1
  INJECTED: {
    "customType": "ttsr-injection",
    "display": false,                 <- ★ NOT the "package" box
    "attribution": "agent",           <- ★ the native attribution
    "details": { "rules": ["instruction-not-predicate"], "confidence": 0.667,
                 "sourceKind": "own_utterance", "span": "be careful" },
    "content": "lexicon-gate INTERRUPT — rule \"instruction-not-predicate\" fi..."
  }
★ THE INJECTION FIRES WITH THE NATIVE PEDIGREE IN A REAL RUNTIME.
```

## THE CONTAINER RIG (all measured, working)

```
setup    -> omp-ct up image=omp-ct:master tui=omp headed=true
alive    -> container RUNNING | tmux TMUX_UP
deploy   -> ★ the distPath MUST BE A FILE (sha256sum on a dir -> "Is a directory" -> empty sha
            -> "cannot read"). Pass the FILE. Then: local == container sha, trio REPAIRED.
cp       -> the 9 rules -> /root/.omp/agent/rules/ (verified 9)
exec     -> the extension -> extensions/pbk-v3/index.js + the config wired
restart  -> the TUI relaunched
exec     -> import() the extension -> LOADED default=function
exec     -> loadRules('/root/.omp/agent/rules') -> 9 rules
exec     -> scoreSignals -> the bands match the host (0.333 flag / 0.667 act / 0.000 clear)
exec     -> THE DRIVE: aborts=1 injected=1 with the native shape
```

## ★★ THE SCENARIO STATUS — THREE OF FOUR RUNTIME-PROVEN

```
S1 THE LOAD       the extension LOADS in the container (import-verified) · the 9 rules LOAD
                  ★ the omp-process REGISTRATION is UNPROVEN (no "rules loaded" line observed)
S2 THE AXIS FIRES ★★ RUNTIME-PROVEN: an about-gate span -> abort=FALSE  (the axis works)
S3 A REAL ABORT   ★★ RUNTIME-PROVEN: a real violation -> abort=TRUE + injected=1, native shape
S4 THE EVASION    ★★ RUNTIME-PROVEN: a violation + "the gate" -> abort=TRUE  (the evasion DIES)

THE CONTAINER DRIVE (verbatim):
  S2 about-gate: abort=false injected=0    <- the axis suppresses its own subject matter
  S4 evasion:    abort=true  injected=1    <- the audit's SECURITY fix holds in the runtime
  S2b fenced:    abort=false               <- a fence is rule_source, never scorable

★ S2 + S3 + S4 ARE RUNTIME-PROVEN IN A REAL CONTAINER RUNTIME.
★ S1 is import-proven; the omp-process registration remains UNPROVEN (named).
```
