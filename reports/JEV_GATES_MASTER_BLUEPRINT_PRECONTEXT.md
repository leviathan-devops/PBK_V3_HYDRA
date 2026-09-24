# JEV GATES — MASTER BLUEPRINT PRE-CONTEXT

**The pre-context for the Jev Gates Master Blueprint.** The content below is the session's
delivered cards, preserved verbatim per the operator order. The master blueprint is authored
AFTER this — this file is its input, not its replacement.

**The subject:** the Jev Gates machine — a ticket-authorization gate whose spec is compressed
into 255 Choice nodes, enforced by Noul, with two Jev scoring tools (accuracy + density).
**The built source (this session):** `src/jev/ticket.ts` (142L) · `src/jev/gate.ts` (180L) ·
`src/jev/lifecycle.ts` (173L) · `tests/jev.test.ts` (233L, 24 pass).
**The forensic inputs:** `PLUTUS/V6_BUILD/forensic/JEV_DERAILMENT_FIREWALLS.md` (723L) ·
`JEV_AUDIT_TOOLS_BLUEPRINT.md` (752L) · `MACRO_FAILURE_PATTERNS.md`.

---

## §0 THE DELIVERED CARDS (2026-09-24, preserved verbatim per the operator order)

┌────────────────────────────────────────────────────────────────────────────────────┐
│  ★ THE SUBSTRATE MEASUREMENT (this is the first thing you need to know)             │
│                                                                                     │
│  REAL JEV:   the key exists at ~/.config/typesafe/key  →  the API returns:          │
│              {"error_type":"billing_error",                                         │
│               "message":"Your organization has no available TypeSafe API credits"}  │
│              ★ THE ENTIRE DESIGN IS BLOCKED AT THE SUBSTRATE. HT-BUG-7's class.     │
│                                                                                     │
│  LOCAL KEV:  ~/.cache/huggingface/hub/models--jaredpalmer--kev-0.6b   PRESENT       │
│              ~/node_modules/@huggingface/transformers                 INSTALLED     │
│              ★ KEV SPEAKS THE IDENTICAL CONTRACT (choice/score/noul, one state +    │
│                N typed questions, one probability per option). NO credits, NO       │
│                network. THE DESIGN IS BUILT ON KEV AND SWAPPED TO JEV WHEN CREDITS  │
│                LAND — one type, two implementations.                                │
└────────────────────────────────────────────────────────────────────────────────────┘

## §1 · WHAT I UNDERSTAND — the machine, restated

**THE TWO MACHINES, exactly as you described them:**

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  MACHINE A · THE MACRO INTELLIGENCE          (built, tested, on disk)               │
│                                                                                     │
│   the agent WANTS an act                                                            │
│        │                                                                            │
│        ▼                                                                            │
│   ┌──────────────────────────────────────────────────────────────┐                  │
│   │  THE JEV GATE — authored by the SPEC                          │                  │
│   │  STEP 1 the deterministic pre-filter (FREE: verb, scope,      │                  │
│   │         budget, the escape check)                             │                  │
│   │  STEP 2 the spec check (FREE: the anchor's quote must APPEAR  │                  │
│   │         in the spec text — a fabricated anchor dies here)     │                  │
│   │  STEP 3 the JUDGE (choice/score/noul over the 255 nodes)      │                  │
│   │  STEP 4 the ISSUANCE — a TICKET, one-shot, target-bound       │                  │
│   └──────────────────────────────────────────────────────────────┘                  │
│        │                                                                            │
│        ▼                                                                            │
│   THE TOOL RUN — the run PRESENTS the ticket.                                       │
│   ★ NO TICKET = NO ACT. THE ABSENCE IS THE REJECTION.                               │
│   ★ A WRONG TARGET = UNTICKETED DRIFT. THE BINDING IS THE TARGET.                   │
└────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────┐
│  MACHINE B · THE 255-NODE MASTER CONTEXT     (the spec, compressed, at decision time)│
│                                                                                     │
│   THE APPROVED BUILD PACKAGE                                                        │
│        │                                                                            │
│        ├──> SEMANTICA (the DECISION graph — the MCP is mounted)                     │
│        └──> ARSUMBRIS (the KNOWLEDGE graph — ~/arsumbris is on disk)                │
│        │        ★ BOTH built by agents FROM THE APPROVED PACKAGE, in FULL detail     │
│        │                                                                            │
│        ▼                                                                            │
│   ★ JEV-ACCURACY-SCORING   target vs reference → is the graph TRUE to the spec?     │
│   ★ JEV-DENSITY-SCORING    target vs reference → is the graph FULL? nothing dropped?│
│        ★ BOTH must read ≥ 0.96 or the graph is REJECTED and rebuilt.                │
│        │                                                                            │
│        ▼                                                                            │
│   THE GRAPH (1,000 — 50,000 nodes)                                                  │
│        │        ★ compressed, with BOTH scorers policing the compression            │
│        ▼                                                                            │
│   ★ THE 255 MASTER CONTEXT NODES  →  THE CHOICE ARRAY                              │
│        │        ★ accuracy-scored (is each node TRUE?)                              │
│        ★ density-scored  (is the graph represented, or is 85% gone?)                │
│        ▼                                                                            │
│   THE DECISION ENGINE — every act is matched against the 255 nodes                  │
│        ▼                                                                            │
│   YES → the ticket is issued, the act proceeds                                      │
│   NO  → the act is KICKED BACK to the start with more intelligence                  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**THE MANDATORY LIFECYCLE NOW (your new step 0):**
```
blueprint with the operator
   → GENERATE the build package
   → ★ YOU APPROVE IT
   → ★★ POPULATE THE JEV GATES  (mandatory, mechanically gated — NOTHING proceeds without it)
        ① the two graphs minted from the package
        ② accuracy + density scored ≥ 0.96 (else rebuild)
        ③ the graphs compressed → 255 nodes
        ④ the 255 nodes accuracy + density scored ≥ 0.96 (else rebuild)
        ⑤ the 255 nodes loaded into the choice array
   → pin the goal prompt
   → GO  (every tool call, commit, test, PR, checkpoint, ship claim audited against the 255)
```
**★ AND YOU SAID THE SCAFFOLDING COMES LATER to make that gate mechanical — no tool execution until the gates are populated.** Understood: **build the working infrastructure now**, add the middleware gate after.

## §2 · ★ THE CHOICE MECHANIC — the full data you asked for

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  A CHOICE PICKS ONE OPTION FROM A FIXED SET. THE ANSWER IS A DISTRIBUTION.          │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**THE REQUEST:**
```json
{
  "state": "<the content to evaluate — string | object | array>",
  "model": "jev-latest",
  "questions": {
    "<your id>": {
      "type": "choice",
      "instructions": "<what to decide — string | object | array (refer to state fields by `backticked` name)>",
      "criteria": { "<option>": "<description>", "<option2>": null, "...": "..." }
    }
  }
}
```

**THE RESPONSE (every field, verbatim from the API doc):**
```json
{
  "model": "jev-1.13.0",
  "answers": {
    "<your id>": {
      "type": "choice",
      "choice": "billing",                                    // ★ THE ARGMAX
      "probabilities": {"billing":0.88,"technical":0.12,"sales":0.0},  // ★ THE FULL DISTRIBUTION (sums to 1)
      "confidence": 0.81                                      // ★ DERIVED FROM THE SPREAD
    }
  },
  "usage": {"input_tokens":318,"output_tokens":34}
}
```

**★ THE FIVE FACTS THAT MATTER FOR YOUR 255-NODE DESIGN:**

| # | the fact | the consequence for our machine |
|---|---|---|
| **1** | **MAX 255 OPTIONS PER CHOICE** (API doc, verbatim: *"You can have a maximum of 255 options per Choice"*) | **your 255 is EXACTLY the ceiling.** The master context becomes ONE Choice question with 255 options — the max, as you said |
| **2** | **`probabilities` is the FULL distribution** — not just the winner | ★ this is why it is ungameable: you get the SECOND-BEST, THIRD-BEST too. A 0.35/0.33/0.32 split is a LOUD ambiguity the gate can see |
| **3** | **`confidence` is DERIVED FROM the spread** | ★ a SECOND independent signal: `choice` + `confidence` + the full `probabilities` = three ways to catch a weak decision |
| **4** | **QUESTIONS RUN IN PARALLEL — many per call, barely any added latency** | ★ 50 Choice questions × 255 options each = ONE request. **THE CAPACITY IS N×255, NOT 255.** The 255 is per-question |
| **5** | **THE QUESTION ID IS NEVER SENT TO THE MODEL** | ★ we can name ids anything (a graph node id, a spec section id) without polluting the judgment |

**★ THE HIERARCHICAL PATTERN — HOW TO GO BEYOND 255 NODES (from the docs):**
> *"To classify documents through a deep hierarchy or large taxonomy, chain Choice questions level by level. The **Hierarchical Classification cookbook** shows how to run a **beam search over Choice probabilities, keeping the best K candidate paths at each level** instead of committing to a single greedy path."*

```
   A 50,000-NODE GRAPH DOES NOT NEED TO FIT IN ONE CHOICE.
   LEVEL 1: which DOMAIN?        (20 options)  → beam-keep the top 3
   LEVEL 2: within that domain, which SECTION? (40 options) → beam-keep the top 3
   LEVEL 3: within that section, which NODE?   (255 options) → THE DECISION
   ★ 3 QUESTIONS, ~315 options total, ONE request, and it addresses 20×40×255 = 204,000
     distinct leaf paths. THE 255 CEILING IS PER-QUESTION, NOT PER-SYSTEM.
```

**★ THE SCORE CEILING — a constraint you need to know:**
```
SCORE: "A Score should have at least two levels; the API accepts up to 10."
★ TEN LEVELS PER SCORE QUESTION — that is the ceiling.
★ SO "score for all mathematical computation" means: a 0-100 accuracy needs a 10-LEVEL
  rubric (0,11,22,...,100) OR a hierarchy of Score questions (tens / units / tenths).
★ AND the Score answer carries `score` (the probability-weighted position, may land BETWEEN
  levels) + `legend` (level → description) + `probabilities` + `confidence`.
```

**★ NOUL — your enforcement arm, exactly as you said:**
```
NOUL returns ONE number: noul, 0..1 (0 = no, 1 = yes). No distribution, no confidence field.
★ THE BINARY YES/NO IS THE CLEANEST ENFORCEMENT — one threshold, one token, one action.
```

## §3 · YOUR THREE-STRUCTURE MAPPING — CONFIRMED + one refinement

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  YOUR MAPPING                              THE REFINEMENT                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│  CHOICE = the decision-making engine        ✓ HOLDS. 255 options, the full        │
│                                              distribution, the beam-search        │
│  SCORE  = all mathematical computation      ✓ HOLDS, but 10 LEVELS MAX — a        │
│                                              computation needing finer resolution │
│                                              chains Score questions                │
│  NOUL   = the enforcement arm (the binary)  ✓ HOLDS. The cleanest primitive:       │
│                                              one number, one threshold, one token  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**★ AND YOUR LEXICON REPLACEMENT, which is the sharpest part of what you said:**
```
THE LEXICON TODAY (broken):
   the regex DETECTS  →  the regex DECIDES  →  fires.   ★ math wrong, detection theatrical.

THE LEXICON YOU WANT:
   ┌─ THE ALGORITHM (code) ────────────────────────────────────────────────┐
   │  1  DETECT from DURABLE FACTS  (the diff, the callers, the sha, the   │
   │     test exit — never a phrase)                                       │
   │  2  COMPUTE the number with SCORE  (Jev does the math — the 10-level  │
   │     rubric, or a chain)                                               │
   │  3  MATCH the detection against the 255 CHOICE nodes → a decision     │
   │  4  EMIT the NOUL yes/no → the enforcement                            │
   └───────────────────────────────────────────────────────────────────────┘
   ★ NO REGEX DECIDES ANYTHING. THE ALGORITHM DETECTS; JEV DECIDES; CODE FIRES.
   ★ "scope-shrink" becomes: FACTS (the spec's item count vs the delivered) → SCORE (how
     far short) → CHOICE (does this match the 255 master nodes?) → NOUL (fire / don't).
```

## §4 · MY QUESTIONS — the ones that change the build

```
Q1 · THE CHARACTER OF THE 255 NODES.
     Are the 255 (a) PROPOSITIONS the act is checked against ("the lint runner MUST be
     called by the engine"), (b) DOMAINS of the build, or (c) a mix? My read: PROPOSITIONS,
     each with a spec anchor — because the gate asks "does this act CONTRADICT any of the
     255?" A domain wouldn't be checkable. CONFIRM.
     ★ AND: is ONE Choice over 255 with the option = "which node does this act violate
     (or NONE)" — or is it 255 SEPARATE Noul questions? The first is one call and gives a
     distribution; the second is 255 booleans in parallel and pinpoints ALL violations at
     once. MY DEFAULT: the 255 Nouls in ONE call (they are parallel, and you want EVERY
     violation, not the top one). CONFIRM.

Q2 · THE DEPTH OF THE GRAPH COMPRESSION.
     A 50,000-node graph → 255 nodes LOSES 99.5% of the nodes. Two readings:
     (a) each of the 255 is a SUMMARY of a cluster (the graph is clustered first), or
     (b) the 255 are the graph's MOST DECISION-RELEVANT nodes, and the rest stay in the
     substrate as the DEPTH (the gate can query the full graph when a node is hit).
     MY RECOMMENDATION: (b) — 255 at the gate for speed, the full graph behind for evidence.
     The DENSITY scorer then measures (255 nodes + the reachable full graph) vs the package.

Q3 · THE 96 THRESHOLD'S UNIT.
     "≥96 accurate" — 0.96 on WHAT scale? The Score primitive is 10 levels max, so a 0-100
     score needs a 10-level rubric (0,11,22,...100) and 96 means the 9th-to-10th level.
     ★ OR you mean 96% of the FINDINGS individually ≥ threshold. I need the unit to pick the
     rubric. MY DEFAULT: a 10-level Score (0/11/.../100) with the bar at level 9 (89-99) and
     ≥96 read from the probability-weighted position. CONFIRM.

Q4 · PER-FINDING MICRO SCORES — the shape.
     "an 86% overall with 15 findings — I want each finding's own score." So the audit emits:
       { overall: 0.86, findings: [{ id, what, score, evidence }] }
     ★ AND: is a SINGLE finding below the bar enough to reject the whole target, or is the
     OVERALL the gate? MY DEFAULT: BOTH — the overall must be ≥0.96 AND no CRITICAL finding
     below 0.96. CONFIRM.

Q5 · WHO BUILDS THE GRAPHS — which agent, which tool?
     The two graphs are built by agents from the package. Is that (a) ONE agent per graph
     (2 parallel desks), (b) a wave of agents partitioned by spec SECTION, or (c) a script?
     ★ AND: arsumbris is a typed knowledge graph (the `au` engine, ~/arsumbris) and semantica
     is the decision-graph MCP. Are those the exact two, and do they speak different schemas?
     MY DEFAULT: (b) — a wave, one agent per spec section, because the density scorer will
     catch any section that was skipped.

Q6 · THE POPULATE TOOL'S TRIGGER.
     "a specific populate-jev-gates tool or function or script or event." Is it a SLASH
     COMMAND you run after approving, a TOOL the agent calls, or a HOOK on the approval?
     MY DEFAULT: a CLI (`bun run populate-gates --package <path>`) + a host hook that
     REFUSES every tool call until its completion marker exists. CONFIRM.
```

## §5 · HOW THE TWO SCORING TOOLS WORK (the mechanism, so you can correct it)

```
JEV-ACCURACY-SCORING (target, reference):
  1 CHUNK the target into its atomic claims/nodes.
  2 for EACH chunk: a NOUL — "does `reference` support this exact claim?"
     ★ the reference is IN THE STATE, the chunk is the question
  3 the chunk's score = the noul probability. THE MICRO SCORE.
  4 the OVERALL = the probability-weighted aggregate of the chunks.
  5 ★ EVERY chunk's verdict + evidence is emitted. NOT just the number.
  ★ THE ANTI-HALLUCINATION PROPERTY: the LLM cannot produce the number — only Jev can.

JEV-DENSITY-SCORING (target, reference):
  1 ENUMERATE the reference's OWN claims (every spec item, every required element).
  2 for EACH reference claim: a NOUL — "is this claim PRESENT in `target`?"
     ★ THE DIRECTION IS REVERSED: accuracy asks "is the target true?", density asks
       "is the reference COMPLETE in the target?"
  3 the PRESENT ones / the total = the DENSITY score (the coverage ratio).
  4 ★ THE MISSING LIST is the product: every reference claim NOT in the target, named.
  ★ THE ANTI-WATERING-DOWN PROPERTY: you cannot summarize and pass — the missing list
    names what you dropped.
```

**THE ONE-LINE SUMMARY OF WHAT I UNDERSTAND:**
> **A ticket-authorization machine whose spec is compressed into 255 Choice nodes, scored for accuracy and density by two Jev tools, with the enforcement as a Noul — so the agent cannot act without authorization, cannot claim without a fact, and cannot summarize without the density scorer naming what it dropped.**
>
> **The machine is BUILT and TESTED (24 tests, the misfire proven impossible). The substrate is BLOCKED at real Jev (no credits) and AVAILABLE at local KEV (same contract, on disk).**
