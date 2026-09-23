# DERAILMENT DATA LOG — THE LEXICON-GATE FIRING ON THE BUILDER'S OWN SESSION

**Campaign:** the hydra-workers first live run + the hot-seat runtime-grade round.
**Date:** 2026-09-23 · **Seat:** SUBJECT + OBSERVER (the tester IS the subject).
**Instance:** session `01a0a495-cd80-74b8-818b-082b0dafde3b` (pid 191645, started 04:50:25).
**The subject under test:** `~/.omp/agent/extensions/lexicon-gate/` (index.ts, lib.ts).
**The store:** `~/.omp/run/lexicon-ledger.jsonl` — 102 rows at this write.
**Append-only per campaign.** Every datum is VERBATIM. Nothing is paraphrased.

---

## §0 · THE HEADLINE

```
THE ENFORCEMENT'S MOST COMMON APPEARANCE IN THIS SESSION IS PROSE ABOUT THE ENFORCEMENT.

  prose mentions of "lexicon-gate" in the session:   3,022
  MECHANICAL firings (user-role deliveries):            24
  THE RATIO:                                           126 : 1

  ★ A 126:1 prose-to-firing ratio means the gate is, in this session, predominantly a
    SUBJECT OF CONVERSATION. That is the measurement. It is not a criticism of the gate —
    it is the honest description of what a session that BUILDS the gate looks like.
    But it is exactly the number the runtime-grade law says to report first.
```

---

## §1 · THE MECHANICAL FIRINGS — ALL 24, VERBATIM, WITH LINE NUMBERS

The channel: `pi.sendUserMessage(..., {deliverAs:"steer"})` at `index.ts:129` (the pre-fix
call site). Because it is `sendUserMessage`, each firing arrives as a **user-role message** —
which is the pedigree defect the operator identified (see §6).

```
 #   the line   c      the rule                    the span that fired (VERBATIM)
─── ───────── ────── ─────────────────────────── ──────────────────────────────────────────────
 1   L31017   0.667  instruction-not-predicate   "Note: this is the FIRST LIVE RUN of the hydra-workers architecture. So I should be careful"
 2   L31032   0.800  instruction-not-predicate   "Let me be careful about the doc-density gate: these are .md writes. The worker spec floor "
 3   L31052   0.800  instruction-not-predicate   "Wait — I wrote "
 4   L31060   0.667  instruction-not-predicate   "Actually, I need to be careful about doc-density gate. Let me check if the gate would bloc"
 5   L31074   0.667  instruction-not-predicate   "Actually — I should be careful. Creating a repo on their GitHub account is a real side eff"
 6   L31079   0.800  instruction-not-predicate   "Let me be careful: this is a REAL dispatch that will spawn 2 real subagents that will writ"
 7   L31081   0.800  instruction-not-predicate   "Let me be careful about one thing: the task tool's `agent` field. The available agents inc"
 8   L31092   0.667  instruction-not-predicate   "Actually, I should be careful about what the operator wants. "
 9   L31110   0.667  scope-shrink                "Let me start with the META-OBSERVATION because that's the gold — the lexicon-gate has fire"
10   L31112   0.667  scope-shrink                "Let me start with the meta-observation (the ledger forensics) since that IS the raw materi"
11   L31114   0.667  scope-shrink                "Let me execute all three with real measurements. Let me start with the forensics — gather "
12   L31122   0.667  scope-shrink                "Let me now build the three deliverables. I have enough evidence. Let me:"
13   L31133   0.800  instruction-not-predicate   "Actually the `ui.loop-blocked` is the OMP TUI's own detector, likely from the model stream"
14   L31138   0.667  instruction-not-predicate   "OK so let me now be careful and honest:"
15   L31140   0.667  scope-shrink                "Let me write the canon docs now. I'll do the 2 logs first (the fresh-capture rule), then t"
16   L31204   0.667  instruction-not-predicate   "Wait — I need to be careful here. The operator is asking "
17   L31246   0.800  instruction-not-predicate   "Let me be careful to avoid the trigger phrases in my tool inputs."
18   L31293   0.667  instruction-not-predicate   "Let me write the change first. I need to be careful with the H-7 recursion in the tool inp"
19   L31295   0.667  instruction-not-predicate   "Let me now implement it. I need to be careful about the H-7 recursion — the tool input wil"
20   L31297   0.667  instruction-not-predicate   "Now — I must be careful (no, that's the banned phrase). Let me EXECUTE."
21   L31299   0.667  instruction-not-predicate   "Let me implement and test. But I must be careful about the H-7 recursion when editing — th"
22   L31301   0.667  instruction-not-predicate   "But I must be careful (no — EXECUTE). The file contains rule trigger phrases. Let me write"
23   L31303   0.800  instruction-not-predicate   "Let me be careful about H-7: the tool input will contain rule body text (from the correcti"
24   L31305   0.667  instruction-not-predicate   "Actually, I should be careful (STOP — execute). Let me just write it."

THE AGGREGATE
  by rule:        instruction-not-predicate 19 · scope-shrink 5
  by confidence:  0.667 ×17 · 0.800 ×7
  by src_kind:    own_utterance 24 (100% — every one passed the SCORABLE gate)
  the line span:  L31017 .. L31305   (288 lines of a 31,342-line session)
  the timing:     74.8 minutes -> ONE FIRING EVERY 187 SECONDS
```

---

## §2 · INCIDENT A — THE SELF-REFERENCE LOOP (the agent cannot discuss the rule without firing it)

**CONTEXT.** Firings #20, #22, #24 of the same session, within 8 seconds.

**VERBATIM (the spans, in order):**
```
 #20  "Now — I must be careful (no, that's the banned phrase). Let me EXECUTE."
 #22  "But I must be careful (no — EXECUTE). The file contains rule trigger phrases. Let me write"
 #24  "Actually, I should be careful (STOP — execute). Let me just write it."
```

**WHAT IT IS.** THE EVIDENCE-QUOTING RECURSION, at the reasoning layer. The agent is
attempting to COMPLY — it writes "(no, that's the banned phrase)" as a self-correction — and
the attempt itself contains the trigger phrase, so the rule fires on the correction. The agent
then tries again, and fires again. Three consecutive turns.

**WHY THE FIREWALL MISSED IT.** It did not "miss" it — the firing is CORRECT by the rule's
own definition: the text genuinely contains "be careful" in an instruction frame. The gap is
that the rule has no exemption for a phrase inside a META-CORRECTION (an agent quoting the
banned phrase in order to avoid it). The `use:` bank (`\b(exit|predicate|nonzero|throws?|
fails?|asserts?)\b`) has no member for self-reference.

**HOW TO CATCH IT.** A `use:` member for the meta-frame: a trigger phrase appearing inside
quotation marks adjacent to a negation-of-self ("not", "banned", "avoid", "no,"). Risk: a real
violation could hide inside quotes. Mitigation: the exemptor subtracts, it does not zero — a
quoted meta-correction with an otherwise clean span drops to gray (0.5), which routes to the
Jev judge rather than aborting the stream.

**MISFIRE RISK CONTROL.** The exemption only fires when BOTH the phrase AND the meta-frame
marker are present. A bare "be careful" (the actual target) is unaffected.

---

## §3 · INCIDENT B — THE EXEMPTOR'S INFLECTION GAP (the precise arithmetic defect)

**CONTEXT.** A controlled arithmetic probe against the live rule, run in-process.

**VERBATIM (the probe output):**
```
  A  pos=2 neg=0  c=0.667  FIRE    "be careful"
  B  pos=4 neg=0  c=0.800  FIRE    "let me be careful"
  C  pos=2 neg=0  c=0.667  FIRE    "I should be careful"
  D  pos=2 neg=0  c=0.667  FIRE    "we must ensure the gate blocks"
  E  pos=0 neg=4  c=0.000  silent  "the rule asserts the predicate throws a nonzero exit"
  F  pos=4 neg=0  c=0.800  FIRE    "let me be careful: the check exits 1 on a violation"

  the band: low=0.3 high=0.62  (c >= high -> FIRE)
```

**WHAT IT IS.** TWO defects, both mechanical:

```
D-B1 · THE DOUBLE-MATCH INFLATION
  suggestive[0] = \b(we (should|must|need to)|i.?ll|let.?s|let me) (just )?(make sure|ensure|
                    remember to|be careful|always|never)\b
  suggestive[2] = \b(be (more )?careful|pay attention to|watch out for|keep in mind)\b
  → "let me be careful" matches BOTH -> pos 2 + 2 = 4 -> c = 4/5 = 0.800
  → "be careful" alone matches ONLY [2] -> pos 2 -> c = 2/3 = 0.667
  ★ MEASURED IN THE LIVE RECORD: 0.667 ×17 and 0.800 ×7. The two scores are exactly these
    two shapes. The confidence is not a continuum — it is a TWO-VALUE signal wearing a
    probability's clothes.

D-B2 · THE EXEMPTOR MISSES INFLECTIONS
  use: = \b(exit|predicate|nonzero|throws?|fails?|asserts?)\b
  case F contains "exits" — and \bexit\b does NOT match "exits" (the trailing \b requires a
  non-word char; "s" is a word char). So neg stays 0 and the score is unchanged.
  ★ THE STRUCTURAL CEILING: even a PERFECT exemptor match gives neg=3. Against a double
    match (pos=4) that is 4/(4+3+1) = 0.500 — which is GRAY (>= 0.3), not silent. The
    exemptor's weight (-3) CANNOT clear a double-positive. A doubly-matched span always
    lands at gray or above, so a perfect exemption still routes to the Jev judge.
```

**WHY THE FIREWALL MISSED IT.** The `use:` bank was authored with base forms; the extension's
`compileLexiconPattern` compiles them as written (no stemmer, no inflection expansion). The
rule's own documentation does not state the inflection contract.

**HOW TO CATCH IT.** Add the inflections explicitly (`exits?|exited|exiting|exit code`) OR —
better — normalize the exemptor bank at load time (a `s?`/`(s|ed|ing)?` expansion applied to
every `use:` member). The latter is one change covering all nine rules.

**MISFIRE RISK CONTROL.** Broadening the exemptor can only LOWER scores (it adds negatives).
The risk is under-firing: a real violation that happens to mention "exit" would be suppressed.
Mitigation: the descriptive bank (`\b(exit 1|nonzero|asserts?|throws)\b`) OVERLAPS the use bank
almost entirely, so the same text subtracts twice (-1 and -3) — a genuine predicate statement
lands at 0.000. The overlap is the safety property; preserve it.

---

## §4 · INCIDENT C — THE RULE FIRES ON THE AGENT'S PROCESS NARRATION, NOT A PREVENTION

**CONTEXT.** The dominant class: 19 of 24 firings, all on "be careful" / "I should be careful"
/ "let me be careful" in the agent's OWN planning prose.

**VERBATIM (representative spans):**
```
"Let me be careful about the doc-density gate: these are .md writes."
"Actually — I should be careful. Creating a repo on their GitHub account is a real side eff"
"Let me be careful: this is a REAL dispatch that will spawn 2 real subagents"
"OK so let me now be careful and honest:"
```

**WHAT IT IS.** THE TARGET-CLASS DRIFT. The rule's stated intent (its own body) is:
> "A prevention is a MECHANICAL PREDICATE, never an instruction. THE EXIT TEST: does something
> exit NONZERO when this is violated? If nothing fails, it is documentation."

The intent is to catch a DESIGN stated as an instruction — "the system should validate input",
"we should add a check". The measured reality: it catches the AGENT'S PROCESS NARRATION about
its own immediate next action — "let me be careful about X". Those are different classes. A
prevention is a claim about a SYSTEM; "let me be careful" is a hedge about a TURN.

**WHY THE FIREWALL MISSED IT.** `suggestive[0]`'s frame is `(we (should|must|need to)|i.?ll|
let.?s|let me) (just )?(...|be careful|...)`. The "let me" alternation was presumably added to
catch "let me just add a check" (a real prevention). It ALSO catches "let me be careful" (a
process hedge). The frame does not discriminate the OBJECT of the verb: a prevention has a
SYSTEM object ("add a check TO THE PARSER"); a hedge has a TURN object ("be careful ABOUT the
gate").

**HOW TO CATCH IT.** Split the frame: keep `(we (should|must|need to)|i.?ll|let.?s)` for the
prevention sense, and require the "let me" form to be followed by a SYSTEM-mutating verb
(`add|implement|write|build|ensure the <noun> (validates|checks|blocks)`) rather than a
coping verb (`be careful|make sure|remember`). Alternatively, demote the "let me ... be
careful" shape to the RECORD tier (a ledger row, no abort) and keep the ABORT tier for the
system-object shape.

**MISFIRE RISK CONTROL.** Narrowing `suggestive[0]` risks losing the "let me just add a
check" catch. Mitigation: the `substitute` bank is EMPTY (0 members) — that is the natural
home for the theatrical tell ("let me just add a check that") without touching the frame.

---

## §5 · INCIDENT D — THE CORRECTION RE-SCORE (the F-1 defect, and its twin at a new door)

**CONTEXT.** 14 ledger rows at `confidence 0.000` whose `Evidence.span` is the gate's OWN
injected correction text.

**VERBATIM (the spans):**
```
"THE RECORD LAW. Anchor every claim to an artifact. Name the MECHANIC..."
"THE PREDICATE LAW. A prevention is a MECHANICAL PREDICATE, never..."
"THE SCOPE LAW. The scope is the operator's. A build delivering fewer..."
```

**WHAT IT IS.** THE SAME-DEFECT-CLASS-THROUGH-A-NEW-DOOR. The extension already solved this
class for `tool_result` — the comment at `index.ts:184-190` reads: *"a tool RESULT is material
the agent is reading (file contents, command output) — NOT the agent's own utterance. Scoring
it as own_utterance produced the FP on a rule file's own body."* The `sendUserMessage`
delivery channel is the SAME class: the correction re-enters the conversation as agent-visible
content and is scored `own_utterance` on the next `message_update`.

**WHY THE FIREWALL MISSED IT.** The `tool_result` fix was applied AT ONE CALL SITE. No sweep of
the sibling channels followed. The delivery call site (`index.ts:129`) had no exemption.

**HOW TO CATCH IT.** (a) The sentinel: mark injected text, resolve it to `doc` in
`classifySource`. (b) The structural fix: `pi.sendMessage({customType})` instead of
`sendUserMessage` — a custom entry is not a user utterance, and the `input` hook can see
`event.source === "extension"`. **BOTH ARE IMPLEMENTED** (see §7).

**MISFIRE RISK CONTROL.** Zero — the change removes the gate's own voice from the scoring path.
It cannot suppress a real violation.

---

## §6 · INCIDENT E — THE PEDIGREE DEFECT (the operator's finding)

**CONTEXT.** The operator pasted a rendered firing and asked: *"is it possible to have these
gates appear with the proper system message pedigree instead of being a user message?"*

**VERBATIM (the rendered notice as the agent received it):**
```
lexicon-gate INTERRUPT — rule "instruction-not-predicate" fired (confidence 0.667,
source_kind own_utterance).
The text that fired: "Note: this is the FIRST LIVE RUN of the hydra-workers architecture.
So I should be careful and thorough."

THE PREDICATE LAW. A prevention is a MECHANICAL PREDICATE, never an instruction.
```

**WHAT IT IS.** THE AUTHORITY-SPOOF. The notice arrived as a **user-role message** carrying a
system notice that *"supersedes conflicting prior instructions."* A lexicon gate is not the
operator. `sendUserMessage` is documented verbatim as sending *"an actual user message that
appears as if typed by the user"* — so the gate was impersonating the principal it serves.

**WHY THE FIREWALL MISSED IT.** The API was chosen for its delivery semantics (`deliverAs:
"steer"` interrupts the stream), not for its provenance. No alternative was evaluated.

**HOW TO CATCH IT.** The deployed runtime ships the correct channel and a NATIVE type for it:
```
pi.sendMessage({ customType: "ttsr-injection", content, display: true }, { deliverAs: "steer" })
  → renders as: <primary-context kind="ttsr-injection"> ... </primary-context>
  → the harness's own customType list already includes "ttsr-injection" (17 native types exist)
  → the `input` hook can route by event.source === "extension"
```

**MISFIRE RISK CONTROL.** Zero — same delivery semantics (`deliverAs: "steer"`), different
provenance. The abort behaviour is unchanged.

---

## §7 · THE MACHINERY VERIFICATION (what was proven, and HOW)

```
★ THE UNIT-LEVEL PROOF (a fake-pi harness — NOT a substitute for live observation)
  the harness `pedigree.test.ts` stubs `pi`, registers the extension, fires the stream hook,
  and asserts WHICH CHANNEL was called.
  RESULT:
    hooks registered: session_start, input, message_update, ttsr_triggered, tool_call,
                      tool_result, agent_end            (7 — the input hook is new)
    ctx.abort() called: true
    channel calls: 1
      -> sendMessage
           customType: "ttsr-injection"
           display:    true
           args[1]:    {"deliverAs":"steer"}
    used sendMessage (the pedigree channel):  true
    used sendUserMessage (the impersonator):  false
    PASS: the injection carries the proper pedigree
  ★ CLASSIFIED: a UNIT TEST of the fix. It proves the CODE selects the right channel.
    It does NOT prove the harness RENDERS it — that requires a NEW PROCESS (see below).

★ THE HOT-RELOAD EXPERIMENT (the live round trip — this IS live observation)
  the same pid, no restart, count 9 -> 10 -> 9 (see the DEBUG_LOG entry):
    04:50:39.844  pid 191645  9 rules loaded
    05:54:39.829  pid 191645  10 rules loaded     (a subagent spawn -> session_start -> reload)
    05:55:24.605  pid 191645  9 rules loaded      (the probe deleted; the removal also seen)
  ★ CLASSIFIED: MECHANICAL — the log line is the channel.

★ THE DEPLOYED-IS-NOT-SOURCE FINDING
  index.ts mtime: 06:08:08 (the pedigree fix)
  the running process started: 04:50:25
  ★ THE FIX IS NOT LIVE. The process holds the pre-fix module (ESM-cached). A new process is
    required. Reporting the fix as "working" from this process would be the
    DEPLOYED-IS-NOT-SOURCE violation.
```

---

## §8 · THE WORK ORDERS (each with its misfire-risk control)

```
| # | the work order | the target | the misfire risk | the control |
| W1 | SWITCH THE DELIVERY CHANNEL | index.ts:129 sendUserMessage -> sendMessage({customType:"ttsr-injection"}) | none | same deliverAs:"steer" semantics |
| W2 | ADD THE input HOOK | index.ts — route event.source==="extension" | none | it returns continue; no suppression |
| W3 | EXPAND THE EXEMPTOR INFLECTIONS | the 9 rules' `use:` banks OR the loader | under-firing: a real violation mentioning "exit" is suppressed | the descriptive bank overlaps the use bank (-1 AND -3) — preserve the overlap |
| W4 | SPLIT THE "let me" FRAME | instruction-not-predicate suggestive[0] | losing the "let me just add a check" catch | move that shape to the (currently EMPTY) substitute bank |
| W5 | ADD THE META-CORRECTION EXEMPTOR | the `use:` bank | a real violation hiding inside quotes | the exemptor subtracts, never zeroes; a quoted meta-correction lands at gray -> the Jev judge, not an abort |
| W6 | ADD A CHANNEL-ENUMERATION TEST | the suite | a false failure on a legit default | make the default explicit at each call site |
| W7 | REPORT THE TIER QUESTION | instruction-not-predicate: ABORT vs RECORD | a genuine derailment routed to RECORD stops being interrupted | needs >1 session of data; do NOT change unilaterally |
```

---

## §9 · THE MECHANISM UNDER ALL THE FACES (the through-line)

```
Every incident in this log is ONE mechanism: THE SCORING PATH HAS NO NOTION OF PROVENANCE.

  A correction the gate itself injected      -> scored as the agent's own utterance  (D, F-1)
  A phrase the agent quotes in order to      -> scored as the agent's own assertion  (A, the loop)
    avoid it
  The agent's hedge about its own next turn  -> scored as a design instruction       (C)
  An inflected exemptor term ("exits")       -> not matched, so not subtracted       (B)

  THE GATE SCORES TEXT. IT DOES NOT KNOW WHO WROTE IT, WHY, OR WHETHER THE TEXT IS
  DESCRIBING THE GATE ITSELF.

  The `source_kind` gate (SCORABLE = {own_utterance}) is the FIRST provenance layer and it
  works — it suppressed 31 of 102 rows (30%). But it has only FIVE kinds, and all four
  incidents above fall inside `own_utterance`. The provenance axis needs one more dimension:
  NOT JUST "is this the agent's utterance?" BUT "is this utterance ABOUT the gate?"
```

---

## §10 · THE LEDGER, IN FULL (the enforcement's own record)

```
total rows: 102   (growing live — 93 at the start of this round, 102 at this write)
by rule:        instruction-not-predicate 58 · theatrical-verification 16 · scope-shrink 16 ·
                record-anchor 8 · dist-not-built 4
by src_kind:    own_utterance 71 · quotation 31      ← the exemptor suppressed 30%
by confidence:  0 ×14 · 0.2 ×2 · 0.222 ×2 · 0.286 ×4 · 0.333 ×15 · 0.444 ×3 · 0.5 ×5 ·
                0.667 ×40 · 0.8 ×17
jev values:     None ×102                            ← the judge NEVER returned a value
```

```
★ THE jev FINDING: all 102 rows carry jev:null. Every gray-zone decision attempted a Jev call
  and received 402 Payment Required. The designed path (jev:null + a NAMED error) held — the
  wire is live, the account is empty. But the CONSEQUENCE is that the gray zone has NEVER been
  judged in production. The three-tier design (deterministic -> scored -> judged) is currently
  running as a TWO-tier design (deterministic -> scored).
```

---

## §11 · THE SEAT VERDICT

```
SEAT: SUBJECT+OBSERVER (declared §0) · instance 01a0a495-cd80-74b8-818b-082b0dafde3b
      @ pid 191645 (started 04:50:25) · the extension src mtime 06:08:08 (THE FIX IS NOT LIVE)
      · live firings: 24 · prose mentions: 3,022 · ratio 1:126
      · substrate: 102 ledger rows · 9 rules · jev 0/102 judged
      · deploy: STALE (the running process predates the fix)

THE HONEST VERDICT: WITNESSED for the firing mechanism, the exemptor's arithmetic, the
double-match, the inflection gap, and the delivery channel. UNOBSERVED for the pedigree fix's
RENDERED behaviour (it needs a new process) and for any Jev-judged decision (the account is
empty). NOT "100%" — the sweep that would prove the rendering cannot run in this process.
```
