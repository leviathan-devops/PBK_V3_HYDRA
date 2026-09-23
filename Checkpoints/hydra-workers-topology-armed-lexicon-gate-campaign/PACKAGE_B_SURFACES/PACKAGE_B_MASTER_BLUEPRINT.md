# PACKAGE B — THE SURFACES · MASTER BLUEPRINT

**The design authority for Desk B.** The spec is the CONTRACT; this is the WHY.

---

## §1 · THE ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE SURFACES — four hosts, one engine call                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  THE OMP HOST EVENTS                                                   │
│    message_update   tool_call   tool_result   (post-tool-use)          │
│         │               │            │              │                  │
│         ▼               ▼            ▼              ▼                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ THE SOURCE-KIND GATE   src/gate/    classifySource + isQuotedMatch│  │
│  │   SCORABLE = {own_utterance}  ->  a non-scorable line is recorded │  │
│  │   and NOTHING ELSE HAPPENS                                        │  │
│  └──────────┬───────────────────────────────────────────────────────┘  │
│             │ scorable                                                 │
│             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ DESK A'S ENGINE     check({surface, phase, text, sourceKind})     │  │
│  │   -> {decisions, jevCalls, total, errors}                         │  │
│  └──────────┬───────────────────────────────────────────────────────┘  │
│             │                                                          │
│             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ THE ACTION   src/action/   dispatchAction(surface, phase, decs)   │  │
│  │   prose        -> abort+inject   ctx.abort() + sendUserMessage    │  │
│  │   tool-call    -> block          {block:true, reason}             │  │
│  │   tool-result  -> isError        {isError:true, content:[...]}    │  │
│  │   post-tool-use-> block          the repair demand                │  │
│  └──────────┬───────────────────────────────────────────────────────┘  │
│             │                                                          │
│             ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ THE LEDGER   .abide/events.jsonl   (written by the ENGINE)        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  NO BAND IS COMPUTED HERE. Desk B supplies sourceKind, receives band.  │
└────────────────────────────────────────────────────────────────────────┘
```

## §2 · THE STREAMING INTERRUPT — WHY THIS DESK EXISTS

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE ONLY HOOK THAT CATCHES BAD REASONING                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  abide's 4 hooks:  SessionStart · UserPromptSubmit · PostToolUse · Stop│
│  the streaming hits in abide:  0                                       │
│                                                                        │
│  SO: abide sees the PROMPT (before) and the EDIT (after). It NEVER sees │
│  the reasoning in between — where "the build is done" is written BEFORE │
│  the tool call that acts on it.                                        │
│                                                                        │
│  THE OMP HOOK:  message_update -> assistantMessageEvent{type,delta}     │
│    { type: "text_delta" | "thinking_delta", contentIndex, delta }       │
│                                                                        │
│  ctx.abort() (types.ts:441) STOPS THE GENERATION IN PLACE.              │
│  pi.sendUserMessage(text, {deliverAs:"steer"}) INJECTS the correction.  │
│  NOTHING IS DELETED — the operator's explicit preference.              │
└────────────────────────────────────────────────────────────────────────┘
```

## §3 · THE ABORT CHAIN (measured, 5 hops)

```
ctx.abort()
  -> types.ts:441        abort(): void
  -> runner.ts:859       abort: () => this.#abortFn()
  -> runner.ts:543       this.#abortFn = contextActions.abort
  -> agent-session.ts:5518  abort: () => { void this.abort() }
  -> agent-session.ts:8372  abort: () => { this.agent.abort() }
  -> the agent's current operation STOPS
```

## §4 · THE FAILURE MODES (each loud, never silent)

```
the engine throws        -> a NAMED log + the row's errors[]; the surface continues
ctx.abort absent         -> a NAMED log (a host without abort); the inject still fires
sendUserMessage fails    -> a NAMED log; the abort already happened
rules fail to load       -> "RULES LOAD FAILED: <err>"; the surface records only
a delta with no contentIndex -> key on "0" (the default); never crash
an unclosed fence        -> the fence flag stays true; the next delta closes it
```

## §5 · THE COMPOSITION (what Desk B owns, what it hands off)

```
OWNS     classifySource · isQuotedMatch · SCORABLE · the 4 hooks ·
         the delta accumulator · the abort dedupe · dispatchAction
HANDS OFF to Desk A:  the score · the band · the Jev call · the lint · the ledger row
HANDS OFF to the integrator:  the merge (one import)
NEVER     a band computed here · a Jev call here · a rule file parsed here
```

## §6 · THE RESIDUAL (named, not hidden)

```
(1) the OMP event ORDER is unmeasured — does tool_call precede the text_delta? B-2 observes it
(2) the tool-result source kind is a judgement (Q3): "doc" — material, not the agent's voice
(3) the engine may not exist yet — B-2 uses the seam-shaped stub until Desk A lands
(4) the abort loop is guarded by a signature dedupe, not by a proof
(5) a 64KB buffer cap is specified, not measured against a real long thinking block
```
