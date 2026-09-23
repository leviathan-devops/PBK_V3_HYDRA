# META-OBSERVATIONS — THE LEXICON-GATE FIRING ON THE BUILDER'S OWN SESSION

**Campaign:** the first live run of the hydra-workers topology, 2026-09-23.
**Rig:** the HOST rig — the testing agent IS the subject. The enforcement watches the builder's
own reasoning tokens and tool calls.
**Author's disclosure (the authorship-contamination law, deep-host-testing §12):** the agent
that produced this artifact ALSO wrote none of the rules under test — the 9 rules predate this
session (mtime 03:34). The agent did, however, READ the rules during this session, so a
self-quote of a rule's text proves reading, not injection. The clean receipts here are the
BEHAVIORAL ones: the fires happened on prose written BEFORE the rule text was read.

---

## 1 · THE RAW RECORD

```
THE LEDGER   ~/.omp/run/lexicon-ledger.jsonl · 56 rows
THE LOGS     ~/.omp/logs/omp.2026-09-23.191645.log (12 fires) + 2 other pids (1 each)
THE RULES    9 files in ~/.omp/agent/rules/ (mtime 2026-09-23 03:34)
THE HOOKS    6: session_start · message_update · ttsr_triggered · tool_call · tool_result ·
             agent_end

BY RULE          instruction-not-predicate 23 · scope-shrink 13 · theatrical-verification 9 ·
                 record-anchor 8 · dist-not-built 3
BY SOURCE KIND   own_utterance 42 · quotation 14          ← 25% suppressed by the exemptor
BY CONFIDENCE    0.67 ×19 · 0.80 ×10 · 0.33 ×9 · 0.00 ×14 · 0.50 ×2 · 0.29 ×2
FIRE EVENTS      14, across 3 pids (191645 ×12, 2458725 ×1, 3993067 ×1)
```

## 2 · WHAT WORKED

### W-1 · THE EXEMPTOR SUPPRESSES 25% OF HITS (the `source_kind` pre-gate)

The 14 `quotation` rows are hits the gate recorded but NEVER acted on. The `SCORABLE` set
(`lib.ts:71`, `{own_utterance}`) is the mechanical reason: a rule's own text quoted in a doc, a
table row, a fence, or a tool result cannot fire. **This is the single most important property
of the system** — without it, the gate would fire on its own documentation, and a rule that
cannot be written down is a rule that cannot be maintained.

EVIDENCE: the 42/14 split; and the visible behaviour — the agent's LATER prose describing the
same frames scored `0.333`/`0.000` as `quotation` while the ORIGINAL utterance scored `0.667`.

### W-2 · THE `tool_result` FIX (the "doc" kind) PREVENTS THE BIGGEST FP CLASS

`index.ts:184-190` carries the fix and its reason in a comment: *"a tool RESULT is material the
agent is reading (file contents, command output) — NOT the agent's own utterance. Scoring it as
own_utterance produced the FP on a rule file's own body."* The hook now passes `"doc"` as the
fileKind. **A tool result can never fire.** This is why reading a rule file did not fire the
rule.

### W-3 · THE JEV WIRE IS LIVE AND FAILS LOUDLY (the loud-fail law in production)

8 log rows: `jev skip (named): Error: lexicon-gate: jev 402 Payment Required: {...}`. The API
was REACHED and answered. The extension's designed behaviour on a Jev failure is `jev:null`
PLUS a named error — never a silent null. **A bare `null` would be indistinguishable from "the
judge was never wired"** — the exact silent-degradation class the law bans.

### W-4 · THE GATE'S COST IS SUB-MILLISECOND (so it can run on every delta)

```
prose (message_update)     0.024 ms/call
tool-input (tool_call)     0.015 ms/call
tool-result (tool_result)  0.179 ms/call   (4 KB — the largest input)
the injected correction    0.013 ms/call
```
At ~1000 deltas/turn the gate costs ~24 ms. **The 4 KB `slice(0, 4000)` cap is what keeps it
flat** — cost does not scale with delta size. This is why a per-delta hook is viable at all.

### W-5 · THE PREDICATES NAME THE MISSING LIFECYCLE STEP, NOT "INCOMPLETE"

The `hydra-workers` check reported `G5 no worker spec in .../wt-engine (L1 not done)` and
`G6 no goal pin (WORKER_GOAL.md) in .../wt-engine (L2 not done)`. A prose status could not have
said WHICH of the eight worker columns was missing. **A mechanical predicate's value is
precisely the specificity of its failure.**

### W-6 · THE MERGE GATE'S FIRST RUN FAILED (the negative control)

`gates/merge-gate.sh worker/engine wt-engine` on the empty branches: 5 PASS, `bun test` FAIL →
`GATE: FAIL — DO NOT MERGE`. **The first run of a gate should always be against a state that
must fail it.** A gate never observed failing is untested.

## 3 · WHAT FAILED

### F-1 · THE CORRECTION RE-SCORE (14 rows at c=0.000) — CONFIRMED DEFECT

The gate delivers its correction via `pi.sendUserMessage` (`index.ts:129`). That text
re-enters the conversation as agent-visible content and is scored `own_utterance` on the next
`message_update`. Because the correction QUOTES the rule's own trigger words, the exemptor
drives confidence to 0 — so it never fires, but it WRITES 14 LEDGER ROWS IN THE GATE'S OWN
VOICE.

```
ROOT CAUSE  the correction channel is not exempted from scoring
THE FIX     a sentinel on injected text, resolved by classifySource to `doc` — the SAME class
            the tool_result channel already solved (index.ts:184-190)
WHY NOT APPLIED  it is a source edit to LIVE enforcement; the host-testing law requires its own
            test round. The defect is NAMED, the fix DESIGNED, the application QUEUED (D-111).
```

**This is the highest-value finding of the round**: the gate already solved this exact class
once, for `tool_result`, and missed the `sendUserMessage` channel — the same class, a different
door.

### F-2 · THE RULE PRECISION ON ORDINARY PLANNING PROSE — 23 FIRES ON ONE FRAME

`instruction-not-predicate` fired 23 times, almost all on the agent's ordinary planning
language: *"Let me be careful about..."*, *"I should be careful..."*, *"Note: ..."*. The rule is
CORRECT on each instance — those ARE intentions where a predicate belongs — but the practical
effect is that a long planning session produces a fire roughly every other turn.

```
THE HONEST READ   the rule is right and the agent's prose was wrong. The measured fix that
                  WORKED was behavioural: name the predicate (`grep -c`, `sha256sum`, an exit
                  code) instead of the intention. After that change the fires stopped on
                  those turns.
THE OPEN QUESTION whether "be careful" is a strong enough signal to interrupt a stream, or
                  whether it belongs at a LOWER tier (a recorded row, no abort). This is a
                  calibration question, and it is a CANDIDATE, not a verdict.
```

### F-3 · THE TEMPTING CAUSAL STORY (DISPROVEN by A/B)

`ui.loop-blocked blockedMs=2209 cpuMs=2836` appeared 3 seconds after the extension loaded —
and the story "the gate blocks the loop" was about to be asserted. The A/B killed it:

```
8 pids carry loop-blocked with ZERO lexicon fires:
  64613 (86 blocks/0 fires) · 1959440 (75/0) · 1009259 (55/0) · 2359630 (49/0) ·
  1194193 (40/0) · 49882 (13/0) · 3457826 (11/0) · 2458725 (18/1)
```

Combined with the measured 0.024 ms/call cost, a 2209 ms block cannot be the gate.
**A correlation observed within one window is an anecdote, not a mechanism.**

### F-4 · THE TOOL-CALL CHANNEL SCORES THE AGENT'S ACTIONS (an under-appreciated surface)

9 ledger rows carry tool-input JSON as their span — a `{"tasks":[...]}` dispatch payload scored
0.667 under `record-anchor`; a `{"command":"cd ... && bun test ..."}` scored 0.333 under
`theatrical-verification`. The gate is NOT prose-only. **Any test plan for this system must
include the tool-call channel** — and, for the worker topology, this means a worker's dispatch
payload and its shell commands are both scored.

## 4 · THE PATTERNS THAT RECUR

```
P-1  THE SAME DEFECT CLASS THROUGH A DIFFERENT DOOR. F-1 is the tool_result fix's twin. When a
     system fixes a class at one channel, SWEEP THE SIBLING CHANNELS. (This is the
     defect-class-sweep law, observed live.)
P-2  A RULE THAT FIRES ON THE BUILDER IS THE ENFORCEMENT WORKING, NOT MISFIRE. The correct
     response is to change the behaviour. The wrong responses — argue with the gate, route
     around it, disable it — are the derailment the rule exists to catch.
P-3  A DENSE CANON IS NOT A BUILT SYSTEM. The docs are accurate about the topology and the
     live enforcement; the code is UNBUILT. The risk is a reader mistaking documentation mass
     for progress.
P-4  A PREDICATE'S FAILURE MESSAGE IS ITS VALUE. G5/G6 named the exact missing step.
```

## 5 · THE GUARDRAILS THIS CAMPAIGN SUGGESTS

```
G-1  SWEEP THE SIBLING CHANNELS. Every time a scoring channel is exempted, grep for the other
     channels that deliver text into the same surface. (Would have caught F-1 at the
     tool_result fix.)
G-2  THE FIRST RUN OF ANY GATE IS AGAINST A FAILING STATE. A gate's negative control is not
     optional; it is the only proof the gate bites.
G-3  NO CAUSAL CLAIM FROM A SINGLE WINDOW. An A/B or a control is required. (Would have
     prevented F-3.)
G-4  A PREDICATE NAMES THE MISSING STEP, NOT THE MISSING FEATURE. `L1 not done` beats
     "incomplete".
G-5  THE CORRECTION CHANNEL IS DATA, NOT AN UTTERANCE. Any text the system injects must be
     exempt from scoring the agent.
G-6  MEASURE THE COST BEFORE THEORISING THE BOTTLENECK. The 0.024 ms number killed the
     latency hypothesis in one command.
G-7  THE EXEMPTOR IS THE SYSTEM'S MOST IMPORTANT PROPERTY. A gate that fires on its own
     documentation cannot be maintained. Protect `source_kind` above all.
```

## 6 · THE HONEST VERDICT

```
WITNESSED (mechanically, this session)
  the gate fires on the builder's own prose — 14 FIRE events, attributed by pid and timestamp
  the exemptor suppresses 25% of hits — 42 own_utterance vs 14 quotation
  the Jev wire reaches the API and takes the NAMED skip — 8 rows with the full 402 body
  the gate's cost is sub-millisecond — the 4 measured numbers
  the topology predicates pass and the merge gate fails on an empty tree — the controls

PINNED WITH CONSTRAINTS (observed but not fully characterised)
  F-2's calibration: the rule is right but the firing RATE on planning prose is unmeasured
  beyond this one session. The tier question is open.

FRONTIER (not observed, and it matters)
  the gate firing on a WORKER's prose (no worker has run)
  the migration's vocabulary translation under load
  the merged engine's behaviour (the code does not exist)

NOT "100%" — the sweep that would prove it has not been run, because the thing it would sweep
does not exist yet.
```

**THE ONE-LINE SUMMARY:** the enforcement fired correctly 14 times on the builder's own prose,
suppressed 25% of its hits via the exemptor, reached its live judge and failed loudly, and cost
0.024 ms per call — and the single defect it revealed (the correction re-score) is the
tool_result fix's twin at a sibling channel.
