# THE RUNTIME TEST — THE CONTAINER ROUND (2026-09-24)

**The goal's W1-W4:** the deployed bundle in a clean `omp-ct` container, the axis observed firing.

## W1 · THE RUNTIME PLAN — ★ DONE

```
RUNTIME_TEST_PLAN.md written (2794 chars, the 6 required sections):
  OBJECTIVE · TOOLS UNDER TEST · TEST SCENARIOS 3+ · ADVERSARIAL 1+ · EVIDENCE · PASS CRITERIA
★ THE PLAN GATE REFUSED THE FIRST DRAFT: "missing section: TEST SCENARIOS" — the gate wants the
  LITERAL header `TEST SCENARIOS 3+` (not a prose paragraph). MEASURED: the gate reads
  `SCENARIO/gi` count >= 3 + the 6 literal section names.
```

## W2 · THE CONTAINER BOOTED — ★ THE RIG WORKS

```
container-testing action=setup tui=omp modelName=opencode-go/muse-spark-1.3-contributor
  -> CT SETUP: omp-ct up image=omp-ct:master tui=omp headed=true plan=2703 hash=d3ab021e
     PROVISION openrouter-credential:inserted model:default-set
action=alive   -> CT ALIVE: container RUNNING | tmux TMUX_UP
action=deploy  -> ★ THE DEPLOY ACTION EXPECTS A FILE, NOT A DIRECTORY:
     MEASURED (the handler at dist.js:2899-2912): it runs `sha256sum ${shq(local)}`; on a
     DIRECTORY that prints "Is a directory" -> an empty sha -> "cannot read <dir> on the host".
     FIX: pass distPath=<the FILE>. Then:
       CT DEPLOY: index.js -> omp-ct:/root/.omp/agent/extensions/omp-ct/dist.js
       local 83ef26a1ae4c978d · container 83ef26a1ae4c978d · sha trio REPAIRED
action=cp      -> the 9 rules copied to /root/.omp/agent/rules/ (9 files verified)
action=exec    -> the extension copied to /root/.omp/agent/extensions/pbk-v3/index.js
                  + the config wired (the pbk-v3 path added to `extensions:`)
action=restart -> the TUI relaunched
action=exec    -> ★ THE EXTENSION LOADS IN THE CONTAINER: `import('./extensions/pbk-v3/index.js')
                  .then(m=>typeof m.default)` -> "LOADED default=function"
```

## W3/W4 · THE FIRING — BLOCKED (a named block, not a pass)

```
action=send    -> the prompt reached the agent (verified in the container session JSONL:
                  "validate the input before it writes.")
the assistant  -> content: []  (EMPTY — the container model produced no text)
the ledger     -> NO /root/.omp/run/lexicon-ledger.jsonl  (the gate never fired)
the load line  -> "rules loaded" NOT found in the session JSONL
★ THE BLOCK: the container's model (`opencode-go/muse-spark-1.3-contributor`) did not respond
  within the observed window (the assistant content stayed []). The proxy IS healthy
  ({"ok":true}). Muse at xhigh reasoning is slow; the run needs a longer budget or a faster
  container model.
★ A SECOND UNRESOLVED: the extension's load line is not visible — the omp process may not have
  registered it, OR pi.logger writes elsewhere. NOT claimed as loaded-in-omp; only
  loaded-by-import (measured).
```

## ★ THE FINDINGS (real, measured)

```
F-1  THE CONTAINER RIG WORKS: setup · alive · deploy · cp · exec · restart · read · send — all
     functioned. The rig is NOT blocked.
F-2  THE DEPLOY ACTION'S CONTRACT: distPath must be a FILE (the sha256sum on a dir fails).
     RECORDED for the next run.
F-3  THE PLAN GATE'S CONTRACT: the 6 LITERAL section headers (incl. "TEST SCENARIOS 3+").
F-4  THE EXTENSION LOADS IN THE CONTAINER (import-verified, default=function).
F-5  THE BLOCK: the container model produced no response — the firing scenarios are UNPROVEN.
```

## THE RESUME CONDITION

```
1  a LONGER budget (or a faster container model) so the agent produces a turn
2  OR drive the extension directly in the container (a bun script that calls the hooks with a
   synthetic event) — no model needed. That proves the HOOKS fire; it does not prove the host
   WIRING.
3  then: SCENARIO 1 (the "9 rules loaded" line) · 2 (aboutGate:true) · 3 (a real abort) ·
   4 (the evasion dies)
★ A BLOCKED state names its resume condition and re-fires. NOT upgraded to PASS.
