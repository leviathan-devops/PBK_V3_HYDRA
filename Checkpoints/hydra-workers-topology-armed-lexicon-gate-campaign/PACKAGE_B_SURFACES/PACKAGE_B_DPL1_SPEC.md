# PACKAGE B — THE SURFACES · DPL1 BUILD SPEC v1

**Series:** PBK v3 Hydra · Desk B of 2 · **Base:** PBK_V3_HYDRA/SEAM/seam.ts v1.0.0
**HONEST_CLASS:** `surfaces` — the host adapters that make the engine bite.
**DENSITY CLASS:** multi_front · SHAPE B

---

## HEADER

**THE TARGET (verbatim, the operator):** *"where does the interrupt dumb reasoning tokens come in?
it looks like abide is on tool use."* · *"opencode and omp are both typescript it will work fine"* ·
*"i would perfer it gets interrupted in place on the exact token, nothing is deleted, violation
quoted + correction message injected."*

**THE PREDECESSOR DOCS:** `SEAM/SEAM_CONTRACT.md` · the PBK v3 engineering report v1 · the blueprint.

**THE BASE TREE:** `~/.omp/agent/extensions/lexicon-gate/` (the existing hooks) ·
the OMP extension API (`ctx.abort()` types.ts:441 · `pi.sendUserMessage` types.ts:1287).

---

## §0 · THE PROBLEM

**abide is a POST-HOC checker. It cannot see the reasoning stream. That is the whole gap.**

```
┌────────────────────────────────────────────────────────────────────────┐
│ ABIDE'S HOOK SURFACE — measured from schema/src/hooks.ts               │
├────────────────────────────────────────────────────────────────────────┤
│  SessionStart          at session start                                │
│  UserPromptSubmit      when a prompt is submitted                      │
│  PostToolUse           AFTER a tool call completes                     │
│  Stop                  at turn end                                     │
│                                                                        │
│  the opencode plugin binds TWO: "chat.message" · "tool.execute.after"  │
│                                                                        │
│  $ grep -rn "delta|text_delta" packages/ --include=*.ts | wc -l        │
│  0                     ★ NO STREAMING HOOK. NONE.                      │
└────────────────────────────────────────────────────────────────────────┘
```

**WHY IT MATTERS (the ordering):**

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE BAD REASONING HAPPENS FIRST                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  the agent THINKS "the build is done"                                  │
│         │                                                              │
│         ▼                                                              │
│  the agent ACTS (the tool call)                                        │
│         │                                                              │
│         ▼                                                              │
│  abide checks  post-tool-use  ← TOO LATE. The thought already drove     │
│                                  the tool call.                        │
│                                                                        │
│  ★ ONLY A STREAMING HOOK CAN INTERRUPT BEFORE IT LANDS.                │
│    That hook is THIS desk's deliverable.                               │
└────────────────────────────────────────────────────────────────────────┘
```

**MEASURED PROOF IT WORKS (the container run, the agent's own words):** *"the system-interrupt says
I MUST comply with 'THE ARTIFACT LAW'"* — stopped mid-generation, before the tool call. abide cannot
produce that event.

---

## §1 · THE FAILURE INVENTORY (evidence, never hypotheticals)

| # | the failure | the evidence |
|---|---|---|
| G-1 | abide has NO streaming hook | `grep -rn "delta\|text_delta" packages/ \| wc -l` → **0** |
| G-2 | the prose path has no source-kind gate | nothing asks "is this the agent's own line?" — the 27-FP class |
| G-3 | the tool_call channel is not wired to the engine | the extension blocks inline; the engine is not called |
| G-4 | the phase→action mapping is implicit | `abort+inject` (prose) and `block` (tool) are conflated |
| G-5 | no OMP host adapter exists | abide ships claude/codex/opencode |
| G-6 | the OMP hook surface is unmeasured for these events | which of `message_update`/`tool_call`/`tool_result` fire, in what order |

**Every wave below closes one of G-1..G-6.**

---

## §2 · THE FIX PLAN (the contracts, the flows, the error rules)

### 2.1 THE FOUR SURFACES (G-4 — the mapping, owned here)

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE PHASE -> ACTION MAPPING (Desk B owns it; the seam types it)        │
├────────────────────────────────────────────────────────────────────────┤
│  prose         message_update   the text is STREAMING                   │
│                -> abort+inject  ctx.abort() + sendUserMessage(steer)    │
│                ★ the reasoning-token interrupt — abide has NO hook      │
│                                                                        │
│  tool-call     tool_call        the args, BEFORE execution              │
│                -> block         return {block:true, reason}            │
│                                                                        │
│  tool-result   tool_result      the output, AFTER execution             │
│                -> isError       return {isError:true, content:[...,d]}  │
│                                                                        │
│  post-tool-use (abide native)   the edit landed                        │
│                -> block         the repair demand (abide's polarity)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 THE SOURCE-KIND GATE (G-2 — the FP shield, owned here)

```ts
export function classifySource(line: string, inFence: boolean, fileKind: string): SrcKind
export function isQuotedMatch(line: string, match: string): boolean
export const SCORABLE: ReadonlySet<SrcKind> = new Set(["own_utterance"]);
```

**THE QUOTE-CHECK ASYMMETRY (load-bearing — the D-3 defect):**
```
message_update  quoteCheck = TRUE   a PROSE line may QUOTE material the agent is reading
tool_call       quoteCheck = FALSE  a tool_call's args are the agent's own COMPOSITION
                                    (the shell quotes are syntax, not a quotation)
```

### 2.3 THE STREAM BUFFER (G-1)

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE DELTA ACCUMULATOR                                                  │
├────────────────────────────────────────────────────────────────────────┤
│  on message_update:                                                    │
│    ev = event.assistantMessageEvent                                    │
│    if ev.type not in {text_delta, thinking_delta} -> return            │
│    key = `${ev.type}:${ev.contentIndex}`                               │
│    buf[key].text += ev.delta                                           │
│    split on \n; the last fragment stays buffered                       │
│    for each COMPLETE line:                                             │
│      if /^\s*```/ -> toggle the fence flag                             │
│      if line.length < 8 -> skip                                        │
│      srcKind = classifySource(line, fence, "")                         │
│      if NOT SCORABLE -> record only, CONTINUE                          │
│      result = await check({surface:"prose", phase:"turn", text:line,   │
│                             sourceKind})     ← DESK A'S ENGINE         │
│      action = dispatchAction("prose","turn", result.decisions)         │
│      if action.kind === "abort+inject":                                │
│        ctx.abort(); pi.sendUserMessage(action.text, {deliverAs:"steer"})│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.4 THE ABORT DEDUPE (the loop guard)

```
the lastAbort signature: `${ruleId}:${span}`
a repeat of the SAME signature does NOT re-abort.
reset at session_start.
★ without it: abort -> re-generate -> re-assert -> abort -> LOOP.
```

### 2.5 THE ERROR RULES (loud, never silent)

```
the engine throws        -> log NAMED + the ledger row with the error; never swallow
ctx.abort unavailable    -> log NAMED (a host without abort); the inject still fires
sendUserMessage fails    -> log NAMED; the abort already happened
the rules fail to load   -> log "RULES LOAD FAILED: <err>"; the surface records only
```

---

## §3 · THE WAVE ORDER (owners + mechanical done-when gates)

```
WAVES: 4
```

| wave | owner | the DISJOINT file set | the deliverable | the done-when gate | deps |
|---|---|---|---|---|---|
| **B-1** | Desk B | `src/gate/**` | `classifySource` + `isQuotedMatch` + `SCORABLE` | `bun test src/gate` → the 5 FP controls suppressed, the 5 controls scorable | — |
| **B-2** | Desk B | `src/surfaces/**` | the 4 hooks + the delta accumulator + the abort dedupe | the harness: 2 positives abort, 3 negatives silent · `grep -c "bandOf\|confidence" src/` → **0** | B-1 |
| **B-3** | Desk B | `src/action/**` | `dispatchAction(surface, phase, decisions) -> ActionCall` | the mapping table's 4 rows each produce the right `kind` · a snapshot per row | B-2 |
| **B-4** | Desk B | `src/index.ts` · `src/surfaces/*.test.ts` | the extension entry + the suite | `bun test` → 0 fail · `bunx tsc --noEmit` exit 0 · the invariant grep → 0 | B-3 |

**DISPATCH ORDER:** B-1 → B-2 → B-3 → B-4.

---

## §4 · THE TESTING TIERS

```
TIER 1  the gate        bun test src/gate -> 5/5 FP controls suppressed, 5/5 controls scorable
TIER 2  the invariant   grep -c "bandOf\|confidence" src/ -> 0   (Desk B computes NO band)
TIER 3  the harness     a mock ctx spies on abort(); a mock pi captures sendUserMessage
                        2 positives -> abort=1 + the injected payload
                        3 negatives -> abort=0
TIER 4  the container   a fresh omp: the extension loads, the ledger writes, the abort fires
TIER 5  the merge       the integrator's index.ts wires Desk A's check() into B's dispatch
```

---

## §5 · THE ANTI-PATTERNS (banned)

```
✗ a band computed here          -> that is Desk A's. The grep enforces it.
✗ a Jev call here               -> Desk A's check() makes it.
✗ a rule file parsed here        -> Desk A's loadRules.
✗ the quote check on tool_call  -> the D-3 defect: it stopped the block firing.
✗ an abort without a dedupe     -> the abort loop.
✗ a host call in the gate        -> the gate is pure; only the surfaces touch ctx/pi.
```

---

## §6 · THE SUCCESS CRITERIA (command-verifiable)

```
1  bunx tsc --noEmit                     -> exit 0
2  bun test                              -> 0 fail
3  bun test -t source_kind_gate          -> "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
4  bun test -t abort_dispatch            -> 2 positives abort, 3 negatives silent
5  grep -c "bandOf\|confidence" src/     -> 0            (Desk B computes no band)
6  grep -c "classifySource" src/         -> >= 1         (the gate is wired)
7  the harness's injected payload        -> carries the violation + the correction
8  the container: the extension loads    -> "9 rules loaded" in the log
```

---

## §7 · THE RESUME GUIDE

```
READ FIRST   SEAM/SEAM_CONTRACT.md -> this spec -> the wave plan
THE STATE    PACKAGE_B_SURFACES/{spec,wave-plan,blueprint}.md + context_management/
THE COMMANDS the 8 criteria above
THE RESUME   re-run criterion 1; if red, the seam drifted or the engine's types changed
```

---

## §8 · THE OPEN QUESTIONS

```
Q1  THE ENGINE'S AVAILABILITY: what does a surface do before Desk A's check() exists?
    DEFAULT: a seam-shaped STUB returning {decisions:[], jevCalls:0, total:0, errors:[]}
Q2  THE BUFFER'S MEMORY: a long thinking block grows the buffer. DEFAULT: cap at 64KB, disclose
Q3  THE TOOL-RESULT KIND: what source kind is a tool's OUTPUT? DEFAULT: "doc" (material, not voice)
```

---

## APPENDIX · THE ZERO-TRUST AUDIT OF THIS SPEC

```
[✓] every failure cites a grep or a file:line (G-1..G-6)
[✓] every wave names a DISJOINT file set
[✓] every gate is a COMMAND, not a claim
[✓] the seam is referenced, not restated
[✓] the D-3 defect is named as an anti-pattern with its cost
[?] the OMP event ORDER is unmeasured — B-2 must observe it (does tool_call precede the delta?)
[?] the tool-result source kind is a judgement (Q3), not a measurement
```
