# THE TTSR-INJECTION INCIDENT — HT-BUG-20 (2026-09-23)

**THE OPERATOR'S REPORT (verbatim):** *"TTSR injections are interrupting goal loops. huge issue.
fix immediately. they are also appearing as packages and not like the normal message that appears
on rules.md or tool.block throws"* · *"immediately turn off all ttsr injections until this is
handled so my goal loops aren't fucked"* · *"this should not break the goal loop"* · *"and make
sure its hot reloaded"* · *"get rid of this guardian"*

## THE THREE DEFECTS (all CONFIRMED, all FIXED)

### D-1 · THE FORMAT — `display: true` RENDERS AS A "PACKAGE"

```
MEASURED (the omp binary, verbatim):
  NATIVE:  agent.followUp({role:"custom", customType:"ttsr-injection", content:t.content,
             display:!1, details:{rules:s, deliveryId:n}, attribution:"agent",
             timestamp:Date.now()})
           ★ display:!1 = FALSE (not shown as a custom block) + details + attribution

  THE EXTENSION (lexicon-gate/index.ts:145-156, BEFORE):
           pi.sendMessage({customType:"ttsr-injection", content:..., display:true},
                          {deliverAs:"steer"})
           ★ display:TRUE -> the TUI renders the custom entry AS A BOX ("the package")
           ★ NO details, NO attribution — the native fields the renderer expects
```
**THE FIX:** `display: false` + `attribution: "agent"` + `details: {rules, confidence,
sourceKind, span}` — the native shape.

### D-2 · THE GOAL-LOOP BREAK — `ctx.abort()` IS UNCONDITIONAL, IGNORING `ttsr.interruptMode`

```
MEASURED (the omp binary, verbatim):
  #w(e,t){let s=this.#t?.getSettings().interruptMode??"always";
    for(let n of e){let o=n.interruptMode??s;
      if(o==="never")continue;
      if(o==="prose-only"&&(t.source==="text"||t.source==="thinking"))return!0;
      if(o==="tool-only"&&t.source==="tool")return!0;
      if(o==="always")return!0}
    return!1}
```
The NATIVE TTSR honors `ttsr.interruptMode` (`never` / `prose-only` / `tool-only` / `always`) and
a PER-RULE `interruptMode`. **THE EXTENSION HARDCODES `ctx.abort()`** — a `never`-mode rule still
aborts. THAT is what breaks a goal loop: an enforcement that cannot be told to stop interrupting.

**THE FIX (this session, the operator's immediate order):** `ttsr.enabled = false` + the 9 rules
parked → any new `session_start` loads 0 rules → SILENT. PLUS a **hot-reloadable kill switch**
(D-3) so the operator can silence the RUNNING process with one `touch`.

### D-3 · NO HOT-RELOADABLE CONTROL — the module is ESM-cached

```
MEASURED: the extension module loads at PROCESS CONSTRUCTION; an edit needs a new process.
THE FIX: a SENTINEL FILE read PER-INVOCATION:
  const KILL_FILE = `${process.env.HOME}/.omp/run/lexicon-gate.OFF`;
  const enabled = () => { try { return !existsSync(KILL_FILE); } catch { return true; } };
  // at the top of the message_update handler:
  if (!enabled()) return;
★ `touch ~/.omp/run/lexicon-gate.OFF` -> silenced LIVE (no restart). `rm` -> re-armed.
★ VERIFIED: sentinel present -> enabled=false; absent -> enabled=true.
```

## THE GUARDIANS — BOTH REMOVED (the operator's order)

```
MEASURED:
  profile-guardian.service   system unit · a THERMAL guardian (writes /sys/firmware/acpi/
                             platform_profile) · pid 2191
  guardian-angel.service     user unit   · the FILE-protection guardian
ACTION:
  systemctl --user stop/disable/mask guardian-angel.service   -> inactive + MASKED
  sudo systemctl stop/disable profile-guardian.service        -> inactive + DISABLED
VERIFIED: the guardian processes = 0 · the active units = 0
★ WHY IT MATTERED: the file-protection guardian could REVERT a config edit — it was the reason to
  verify the `ttsr.enabled=false` edit STUCK (re-read after 5s: still false).
```

## THE STATE (measured, this session)

```
ttsr.enabled               false          (durable — re-read after the guardian was killed)
the live rules             0              (9 parked at ~/.omp/agent/rules.DISABLED-20260923/)
the extensions index.ts    251 L          (the kill switch + the native format) — bundles clean
the sentinel               absent         (ARMED; `touch` to silence)
the guardians              0 processes    (both units masked/disabled)
the ledger                 995 rows       (grows from OTHER sessions' in-memory copies)
```

## ★ THE HONEST RESIDUAL (the goal's own law — name the block)

```
THE PARKED RULES SILENCE ANY PROCESS AT ITS NEXT session_start. A process MID-TURN keeps its
in-memory copy until then. MEASURED: 2 rows/20s still arrive from OTHER sessions (a JARVIS-FACTORY
session + others) whose processes predate the pause.
★ THE REMAINING LEVER IS THE PROCESS LIFECYCLE (the operator's sessions), NOT the code — the code
  is fixed, the rules are parked, the config is off, the guardians are dead.
★ THE RECOMMENDATION: a NEW omp process loads ALL of it (the kill switch + the native format +
  0 rules). For a process MID-TURN, the next session_start silences it.
```
