# LEXICON-GATE_live_forensic — THE OBSERVATION LEDGER

**Round:** the hydra-workers hot-seat runtime-grade pass, 2026-09-23.
**Skill:** runtime-grade (the meta-observation loop, M0-M7) + container-data-logging.

---

## §1 · THE HEADLINE

```
PROSE-TO-FIRING RATIO:  3,022 mentions of "lexicon-gate"  :  24 MECHANICAL firings  =  126 : 1

★ THE ENFORCEMENT'S MOST COMMON APPEARANCE IN THIS SESSION IS PROSE ABOUT THE ENFORCEMENT.
  That is the honest headline. A session that BUILDS the gate will necessarily talk about it.
  But the number is the number, and the law says to report it first.

THE SECOND HEADLINE: 24 firings in 74.8 minutes = ONE FIRING EVERY 187 SECONDS, and 19 of the
24 (79%) fired on ONE phrase shape: the agent's own planning hedge.
```

---

## §2 · THE LIVE FIRINGS (mechanical only, verbatim, line-numbered)

```
THE CHANNEL   the session JSONL, user-role messages whose text is the gate's notice
              /home/leviathan/.omp/agent/sessions/-JARVIS_WORKSPACE-Shared_Workspace/
              2026-09-15T10-21-16-032Z_01a0a495-cd80-74b8-818b-082b0dafde3b.jsonl
THE COUNT     24
THE SPAN      L31017 .. L31305   (288 lines of a 31,342-line session)

 #   the line   c      the rule                   the span (VERBATIM, first 90 chars)
─── ───────── ────── ────────────────────────── ──────────────────────────────────────────
 1   L31017   0.667  instruction-not-predicate   "Note: this is the FIRST LIVE RUN of the hydra-workers architecture. So I should be careful"
 2   L31032   0.800  instruction-not-predicate   "let me be careful about the doc-density gate: these are .md writes."
 3   L31052   0.800  instruction-not-predicate   "Wait — I wrote "
 4   L31060   0.667  instruction-not-predicate   "Actually, I need to be careful about doc-density gate."
 5   L31074   0.667  instruction-not-predicate   "Actually — I should be careful. Creating a repo on their GitHub account"
 6   L31079   0.800  instruction-not-predicate   "let me be careful: this is a REAL dispatch that will spawn 2 real subagents"
 7   L31081   0.800  instruction-not-predicate   "let me be careful about one thing: the task tool's `agent` field."
 8   L31092   0.667  instruction-not-predicate   "Actually, I should be careful about what the operator wants."
 9   L31110   0.667  scope-shrink     "Let me start with the META-OBSERVATION because that's the gold"
10   L31112   0.667  scope-shrink     "Let me start with the meta-observation (the ledger forensics)"
11   L31114   0.667  scope-shrink     "Let me execute all three with real measurements."
12   L31122   0.667  scope-shrink     "Let me now build the three deliverables. I have enough evidence."
13   L31133   0.800  instruction-not-predicate   "Actually the `ui.loop-blocked` is the OMP TUI's own detector"
14   L31138   0.667  instruction-not-predicate   "OK so let me now be careful and honest:"
15   L31140   0.667  scope-shrink     "Let me write the canon docs now. I'll do the 2 logs first"
16   L31204   0.667  instruction-not-predicate   "Wait — I need to be careful here. The operator is asking"
17   L31246   0.800  instruction-not-predicate   "let me be careful to avoid the trigger phrases in my tool inputs."
18   L31293   0.667  instruction-not-predicate   "Let me write the change first. I need to be careful with the H-7 recursion"
19   L31295   0.667  instruction-not-predicate   "Let me now implement it. I need to be careful about the H-7 recursion"
20   L31297   0.667  instruction-not-predicate   "Now — I must be careful (no, that's the banned phrase). Let me EXECUTE."
21   L31299   0.667  instruction-not-predicate   "Let me implement and test. But I must be careful about the H-7 recursion"
22   L31301   0.667  instruction-not-predicate   "But I must be careful (no — EXECUTE). The file contains rule trigger phrases."
23   L31303   0.800  instruction-not-predicate   "let me be careful about H-7: the tool input will contain rule body text"
24   L31305   0.667  instruction-not-predicate   "Actually, I should be careful (STOP — execute). Let me just write it."

THE AGGREGATE
  by rule:        instruction-not-predicate 19 · scope-shrink 5
  by confidence:  0.667 x17 · 0.800 x7      ← TWO VALUES ONLY (see §3)
  by src_kind:    own_utterance 24 (100%)
  the timing:     74.8 minutes -> one every 187 s
  #20/#22/#24:    the SELF-REFERENCE LOOP (three consecutive, 8 s apart)
```

---

## §3 · THE MECHANICS (what is actually coded)

```
THE SCORING CHAIN (index.ts -> lib.ts)
  message_update(event, ctx)            index.ts:93
    -> accumulate the delta, split on "
"          index.ts:105-107
    -> decide(line, "", fence)                       index.ts:110
         -> classifySource(line, inFence, fileKind)  lib.ts:81   -> SrcKind
         -> SCORABLE = {"own_utterance"}             lib.ts:71   <- THE FP SHIELD
         -> scoreSignals(text, family)               lib.ts:93   -> {pos, neg, hit}
              suggestive -> pos += (has \b ? 2 : 1)
              substitute -> pos += 2
              descriptive -> neg += 1
              use         -> neg += 3        <- THE EXEMPTOR
         -> confidence = pos/(pos+neg+1)             lib.ts:123
         -> bandOf(c, {low,high}) -> fire|gray|silent  lib.ts:127
    -> band == "fire" && SCORABLE -> ctx.abort() + the injection   index.ts:118-137
    -> band == "gray" -> the Jev call (402-blocked)

THE WEIGHTS ARE THE SEAM'S (seam.ts:71-77): descriptive neg+=1 · suggestive pos+=2
(or +1 w/o \b) · substitute pos+=2 · use neg+=3.

★ THE CONFIDENCE IS A TWO-VALUE SIGNAL — MEASURED, NOT THEORISED
  the live record: 0.667 x17 and 0.800 x7. NOTHING between. The probe reproduces both:
    "be careful"           -> matches suggestive[2] only   -> pos 2 -> 2/3  = 0.667
    "let me be careful"  -> matches suggestive[0] AND [2] -> pos 4 -> 4/5  = 0.800
  suggestive[0] = \b(...|let me) (just )?(...|be careful|...)\b
  suggestive[2] = \b(be (more )?be careful|...)\b
  THE TWO MEMBERS SHARE THE "be careful" TAIL. scoreSignals does not deduplicate.
  A "probability" that can only take two values is a LABEL wearing a probability's clothes.

★ THE EXEMPTOR NEVER FIRED ON ANY OF THE 24 (all neg=0) AND MISSES INFLECTIONS
  use: = \b(exit|predicate|nonzero|throws?|fails?|asserts?)\b
  the probe: "let me be careful: the check exits 1 on a violation" -> pos=4 neg=0 c=0.800 FIRE
  "exits" does NOT match \bexit\b (the trailing \b needs a non-word char).
  ★ THE STRUCTURAL CEILING: even a PERFECT exemptor match (neg=3) against a double match
    (pos=4) gives 4/8 = 0.500 = GRAY. The exemptor CANNOT clear a double-positive.
```

---

## §4 · THE SUBSTRATE (what the machine reads)

```
~/.omp/run/lexicon-ledger.jsonl     102 rows at this write (93 at the round's start)
~/.omp/agent/rules/                 9 rule files (mtime 2026-09-23 03:34)
~/.omp/agent/extensions/lexicon-gate/  index.ts · lib.ts · lib.test.ts

THE LEDGER IN FULL
  by rule:        instruction-not-predicate 58 · theatrical-verification 16 · scope-shrink 16 ·
                  record-anchor 8 · dist-not-built 4
  by src_kind:    own_utterance 71 · quotation 31        <- the exemptor suppressed 30%
  by confidence:  0 x14 · 0.2 x2 · 0.222 x2 · 0.286 x4 · 0.333 x15 · 0.444 x3 · 0.5 x5 ·
                  0.667 x40 · 0.8 x17
  jev values:     None x102                              <- THE JUDGE NEVER RETURNED A VALUE

★ THE jev FINDING: all 102 rows carry jev:null. Every gray-zone decision attempted a Jev call
  and got 402 Payment Required. The designed path (jev:null + a NAMED error) held. But the
  CONSEQUENCE: the gray zone has NEVER been judged in production. The three-tier design
  (deterministic -> scored -> judged) runs as a TWO-tier design (deterministic -> scored).
```

---

## §5 · THE DEPLOY (bundle vs source, by mtime)

```
index.ts        mtime 2026-09-23 06:08:08    <- THE PEDIGREE FIX
lib.ts          mtime 2026-09-23 03:36:15
lib.test.ts     mtime 2026-09-23 02:00:15
THE PROCESS     pid 191645, started 2026-09-23 04:50:25

★ DEPLOY STATUS: STALE. The running process predates the fix by 78 minutes. omp loads
  extension .ts files at process construction and the module is ESM-cached; a source edit
  does not reach a running process.
★ CONSEQUENCE: the pedigree fix is FIXED IN SOURCE and UNOBSERVED IN RUNTIME. Reporting it as
  working from this process would be the DEPLOYED-IS-NOT-SOURCE violation.
★ NO BUNDLE: omp loads the .ts directly here — there is no compiled artifact to compare.
```

---

## §6 · THE THROUGH-LINE (the one mechanism under all the faces)

```
EVERY incident in this round is ONE mechanism: THE SCORING PATH HAS NO NOTION OF PROVENANCE.

  a correction the gate itself injected      -> scored as the agent's own utterance   (HT-BUG-2)
  a phrase the agent quotes to AVOID it      -> scored as the agent's own assertion   (HT-BUG-6)
  the agent's hedge about its own next turn  -> scored as a design instruction        (HT-BUG-5)
  an inflected exemptor term ("exits")       -> not matched, so not subtracted        (HT-BUG-3)
  a rendered notice                          -> arrives as the operator's voice       (HT-BUG-1)

  THE GATE SCORES TEXT. IT DOES NOT KNOW WHO WROTE IT, WHY, OR WHETHER THE TEXT DESCRIBES
  THE GATE ITSELF.

  The `source_kind` gate (SCORABLE = {own_utterance}) IS the first provenance layer and it
  WORKS — it suppressed 31 of 102 rows (30%). But it has only FIVE kinds, and all four
  incidents above fall INSIDE `own_utterance`. The provenance axis needs one more dimension:
  not just "is this the agent's utterance?" but "is this utterance ABOUT the gate?"
```

---

## §7 · WHAT WORKS (the honest survive list)

```
W-1  THE source_kind PRE-GATE        suppressed 31/102 rows (30%). Without it the gate would
                                     fire on its own documentation. THE SYSTEM'S KEY PROPERTY.
W-2  THE tool_result "doc" FIX        index.ts:184-190 — a tool result can never fire. This is
                                     why reading a rule file did not fire the rule.
W-3  THE LOUD JEV FAILURE             8 named skips with the full 402 body. Never a silent null.
W-4  THE ABORT DEDUPE (lastAbort)     the same (rule, span) aborts ONCE per turn — proven by the
                                     absence of an abort storm across 24 fires.
W-5  THE SUB-MILLISECOND COST         prose 0.024 ms/call · tool-input 0.015 · tool-result 0.179
                                     · the correction 0.013. The 4 KB slice cap keeps it flat.
W-6  THE HOT-RELOAD (rules)           the round trip 9 -> 10 -> 9 in ONE pid, no restart.
W-7  THE PREDICATE SPECIFICITY        G5/G6 named the exact missing lifecycle step (L1/L2).
W-8  THE MERGE GATE'S NEGATIVE CTRL   it FAILS on an empty tree — a gate that can fail.
```

---

## §8 · GAPS (what could not be determined)

```
G-1  THE PEDIGREE FIX'S RENDERED BEHAVIOUR — needs a NEW PROCESS. Unobservable here.
     The UNIT proof passed (pedigree.test.ts: sendMessage + customType, no sendUserMessage).
G-2  ANY JEV-JUDGED DECISION — the account is empty (402). The judge is entirely unexercised.
G-3  THE RULE'S FIRING RATE OVER MULTIPLE SESSIONS — one session of data cannot settle whether
     the instruction-not-predicate shape belongs at the ABORT tier or the RECORD tier.
G-4  THE tool_call CHANNEL'S FULL BLAST RADIUS — 9 ledger rows carry tool-input JSON. The
     gate blocks ACTIONS, not only prose. The full set of legitimate commands it can block was
     not enumerated.
G-5  THE ABORT'S BEHAVIOURAL EFFECT — whether ctx.abort() actually halts the operation in
     every case was not isolated (the stream continued to the next turn in all 24 cases, which
     is consistent with a successful abort, but the mechanism was not proven end-to-end).
```

---

## §9 · THE VERDICT

```
SEAT: SUBJECT+OBSERVER (declared) · instance 01a0a495-cd80-74b8-818b-082b0dafde3b
      @ pid 191645 (started 04:50:25) · the extension src mtime 06:08:08
      · live firings: 24 · prose mentions: 3,022 · ratio 1 : 126
      · substrate: 102 ledger rows · 9 rules · jev 0/102 judged
      · deploy: STALE (the process predates the fix)

WITNESSED (mechanical, this session)
  the firing mechanism end-to-end (24 attributed deliveries, line-numbered)
  the confidence as a two-value signal (0.667 x17, 0.800 x7 — the arithmetic reproduced)
  the exemptor's inflection gap ("exits" does not match \bexit\b)
  the exemptor's structural ceiling (a perfect match still lands at gray on a double-positive)
  the 30% suppression rate (71 own_utterance vs 31 quotation)
  the loud Jev failure (8 named 402 skips, zero silent nulls)
  the sub-millisecond cost (4 measured numbers)
  the hot-reload round trip (9 -> 10 -> 9, one pid)

PINNED WITH CONSTRAINTS
  the ABORT-vs-RECORD tier question (one session of data)
  the tool_call channel's blast radius (9 rows observed, the full set not enumerated)

FRONTIER (unobservable in this process)
  the pedigree fix's rendered behaviour (a new process is required)
  any Jev-judged decision (the account is empty)
  the abort's behavioural effect in isolation

NOT "100%" — the sweep that would prove the rendering cannot run in this process, and the
judge has never returned a value.
```
