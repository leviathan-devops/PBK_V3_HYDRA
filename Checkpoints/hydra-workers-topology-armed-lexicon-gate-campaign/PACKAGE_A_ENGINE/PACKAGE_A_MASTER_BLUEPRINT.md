# PACKAGE A — THE ENGINE · MASTER BLUEPRINT

**The design authority for Desk A.** The spec is the CONTRACT; this is the WHY.

---

## §1 · THE ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE ENGINE — one entry point, four internal layers                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  check(req: CheckRequest) -> Promise<CheckResult>     src/index.ts     │
│         │                                                              │
│         ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ THE RUNNER ORDER          src/engine/check.ts                    │  │
│  │   lexicon -> the band -> act? DECIDED   gray? -> Jev   clear? -> │  │
│  │   lint    -> the pattern executed -> a verdict                   │  │
│  │   model   -> abide's checkWithModel                              │  │
│  └──────────┬───────────────────────────────────────────────────────┘  │
│             │                                                          │
│     ┌───────┼────────────┬──────────────┐                              │
│     ▼       ▼            ▼              ▼                              │
│  ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐                  │
│  │src/  │ │src/lint/ │ │src/ledger│ │vendor/abide/ │                  │
│  │lexic │ │the runner│ │the writer│ │band·jev·reas │                  │
│  │on/   │ │          │ │          │ │(VENDORED)    │                  │
│  └──────┘ └──────────┘ └──────────┘ └──────────────┘                  │
│                                                                        │
│  ★ NO HOST. NO ctx. NO pi. The engine is a pure function of its        │
│    request. That is invariant I2, and the grep enforces it.            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## §2 · THE LEXICON — WHY IT IS THE WHOLE POINT

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE COST LAW                                                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  abide TODAY:                                                          │
│    every model rule -> Jev. N rules = N model calls.                   │
│    the deterministic half (lint) is DEAD.                              │
│                                                                        │
│  THE ENGINE:                                                           │
│    every rule -> the lexicon (deterministic, $0, ~0ms)                 │
│      act   -> DECIDED. 0 model calls.                                  │
│      gray  -> Jev. THE ONLY MODEL CALL.                                │
│      clear -> recorded. 0 model calls.                                 │
│                                                                        │
│  MEASURED (the 14-case corpus, band 0.30/0.62): 0 of 14 fell in the     │
│  gray zone. THE LEXICON DECIDED EVERYTHING. Cost: $0.                   │
│                                                                        │
│  ★ THAT IS WHY THE PRE-GATE EXISTS. Not for accuracy alone — for the    │
│    cost curve. The judge becomes the EXCEPTION handler.                 │
└────────────────────────────────────────────────────────────────────────┘
```

## §3 · THE SCORE (the weights, and why each exists)

```
┌────────────────────────────────────────────────────────────────────────┐
│ confidence = pos / (pos + neg + 1)                                     │
├────────────────────────────────────────────────────────────────────────┤
│  suggestive  pos += 2   \b-anchored  the violation SHAPE                │
│              pos += 1   unanchored   a weaker signal                   │
│  substitute  pos += 2                only-ever-a-lie vocabulary         │
│  descriptive neg += 1                the legitimate co-context         │
│  use         neg += 3                THE EXEMPTOR (heaviest)           │
│                                                                        │
│  THE +1 IN THE DENOMINATOR: without it, pos=1 neg=0 gives 1.0 (a        │
│  single hit = certainty). With it, 0.5 — a single hit is a HINT.        │
│  THE use: WEIGHT (3): an exemptor must OUTWEIGH a suggestive (2).       │
│  A rule without a use: bank is a regex, not a lexicon.                  │
└────────────────────────────────────────────────────────────────────────┘
```

## §4 · THE FAILURE MODES (each loud, never silent)

```
loadRules      THROWS on: a bad regex · a missing use: bank · an empty suggestive
               ★ a silent drop is the #4796 class — the rule never fires
               and reports nothing. The engine refuses to load half a rubric.
check()        a Jev failure -> the row records jev:null + a NAMED error;
               the lexicon band STANDS. The engine never blocks on a timeout.
the ledger     an append failure is caught; a ledger write never breaks a decision
               (but the failure is logged, never swallowed)
the vendor     a vendored file's sha mismatch -> a WARNING at load, naming the file
```

## §5 · THE COMPOSITION (what Desk A owns, what it hands off)

```
OWNS     the lexicon type · the scorer · the band call · the Jev call ·
         the lint runner · the ledger writer · the vendored engine
HANDS OFF to Desk B:  classifySource · ctx.abort() · sendUserMessage ·
         the OMP event mapping · the surface->action dispatch
HANDS OFF to the integrator:  the merge (one import)
NEVER     a band computed outside src/lexicon · a Jev call outside src/engine
```

## §6 · THE RESIDUAL (named, not hidden)

```
① the Jev live call may still be blocked (402) — the engine handles it (jev:null)
② the corpus sweep is Desk B's integration concern, not the engine's
③ the vendored abide may drift upstream — VENDOR.md records the pinned sha
④ the lint `scope` semantics are abide-unspecified — A-3 measures and records them
```
