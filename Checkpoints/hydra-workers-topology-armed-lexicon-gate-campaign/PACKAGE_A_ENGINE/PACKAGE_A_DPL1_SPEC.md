# PACKAGE A — THE ENGINE · DPL1 BUILD SPEC v1

**Series:** PBK v3 Hydra · Desk A of 2 · **Base:** PBK_V3_HYDRA/SEAM/seam.ts v1.0.0
**HONEST_CLASS:** `engine` — a vendored, tested, runnable decision engine.
**DENSITY CLASS:** multi_front · SHAPE B

---

## HEADER

**THE TARGET (verbatim, the operator):** *"mint LEGIT build packages FOR EACH OF THESE. 2 separate
production grade build packages so each desk has a successful build."* · *"integrate abide fully and
have lexicons as a pre-jev gate."*

**THE PREDECESSOR DOCS:** `SEAM/SEAM_CONTRACT.md` (the boundary) · the PBK v3 engineering report v1 ·
the blueprint (`reports/`).

**THE BASE TREE:** `~/.omp/agent/extensions/lexicon-gate/` (the existing 689-L extension) ·
`/tmp/abide-repo` (the vendored source) · `~/.omp/agent/rules/*.md` (the 9 lexicons).

---

## §0 · THE PROBLEM

**Four implementations of one idea exist. None is complete. Two contradict.**

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE MEASURED STATE                                                     │
├────────────────────────────────────────────────────────────────────────┤
│ abide (@coldtea/abide 0.0.5)                                           │
│   HAS  the rubric · the Jev wire · the band · the reason · the ledger  │
│   LACKS the lexicon (0 grep hits) · the source-kind gate (0 hits) ·    │
│         the lint runner (pattern is "NEVER EXECUTED") · an OMP host    │
│                                                                        │
│ pbk-v2 kernel-judge.ts (929 L)                                         │
│   A RE-IMPLEMENTATION of abide: the SAME constants                     │
│   (EDIT_CHECK_TIMEOUT_MS 8000 · MAX_ACT_APPENDS 2 · 0.8 · 0.5),        │
│   an INVENTED question type (noul — abide has boolean/choice/score),   │
│   and a live call that has NEVER RUN.                                  │
│   ★ THE ANTI-PATTERN. The second source of truth.                      │
│                                                                        │
│ pbk-v2 middleware/ (11 gates)                                          │
│   the REGEX IS THE DECISION. No score, no confidence, no band.          │
│                                                                        │
│ my lexicon-gate (689 L)                                                │
│   the lexicon + the gate — AND a hand-rolled band, Jev wire, reason.   │
│   The duplicated half must die; the lexicon half must live.            │
└────────────────────────────────────────────────────────────────────────┘
```

**The cost of the missing pre-gate:** abide sends EVERY model rule to Jev, every check. There is no
deterministic narrowing. A lexicon pre-gate makes the gray zone the ONLY thing that costs a model call.

---

## §1 · THE FAILURE INVENTORY (evidence, never hypotheticals)

| # | the failure | the evidence |
|---|---|---|
| F-1 | abide has NO lexicon | `grep -rn "lexicon" packages/ --include=*.ts \| wc -l` → **0** |
| F-2 | abide has NO source-kind gate | `grep -rn "own_utterance\|source_kind" packages/ \| wc -l` → **0** |
| F-3 | abide's lint half is DEAD | rubric.ts:79-80, verbatim: *"A grep-shaped hint for the reader… **Never executed.**"* |
| F-4 | abide's lint is never dispatched | checkRunner.ts:24-25: `rule.check.type === "model"` — the ONLY branch |
| F-5 | kernel-judge invents a question type | `toApiPrimitive('noul')` — abide's union is boolean/choice/score |
| F-6 | the constants were copied, not imported | kernel-judge.ts:53-63 vs abide's constants.ts |
| F-7 | the Jev live call has never run | `402 billing_error` on the host; no key in the container |
| F-8 | the band was hand-rolled | `pos/(pos+neg+1)` — abide has `violationProbability` |

**Every wave below closes one of F-1..F-8. A task closing none is cut.**

---

## §2 · THE FIX PLAN (the contracts, the flows, the error rules)

### 2.1 THE VENDOR (F-6, F-8)

```
┌────────────────────────────────────────────────────────────────────────┐
│ VENDOR abide's engine — verbatim, sha-pinned, NEVER edited             │
├────────────────────────────────────────────────────────────────────────┤
│  vendor/abide/schema/       the rubric + question + hook schemas       │
│  vendor/abide/band.ts       violationProbability + bandFor             │
│  vendor/abide/jev.ts        the Jev wire (checkWithModel)              │
│  vendor/abide/reason.ts     repairReason + flagNotice                  │
│  vendor/abide/VENDOR.md     the upstream commit + the sha per file     │
│                                                                        │
│  THE LAW: a vendored file is NEVER edited. A needed change is a        │
│  PATCH FILE beside it, with the reason.                                 │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2 THE LEXICON CHECK TYPE (F-1 — the primary deliverable)

```ts
// THE NEW MEMBER of abide's discriminated union
export const lexiconCheckSchema = z.object({
  type: z.literal("lexicon"),
  question: z.object({
    // the weights ARE the question
    descriptive: z.array(z.string()).default([]),
    suggestive:  z.array(z.string()).min(1),
    substitute:  z.array(z.string()).default([]),
    use:         z.array(z.string()).min(1),   // MANDATORY
  }),
  band: z.object({ low: z.number().min(0).max(1), high: z.number().min(0).max(1) })
    .refine(b => b.high > b.low, "high must exceed low"),
  /** DERIVED — recorded so an inherited band is visible as a mismatch. */
  derivedFrom: z.object({
    minPositive: z.number(), maxNegative: z.number(),
    positives: z.number().int(), negatives: z.number().int(),
  }).optional(),
});
```

### 2.3 THE SCORER (F-1, F-8)

```
┌────────────────────────────────────────────────────────────────────────┐
│ scoreSignals(text, family) -> {pos, neg, hit}   THE WEIGHTS, VERBATIM  │
├────────────────────────────────────────────────────────────────────────┤
│  descriptive   neg += 1     the legitimate co-context                  │
│  suggestive    pos += 2     when the regex source contains \b, else 1  │
│  substitute    pos += 2     the theatrical tell                        │
│  use           neg += 3     THE EXEMPTOR                               │
│                                                                        │
│  confidence(pos, neg) = pos / (pos + neg + 1)                          │
│  band = bandOf(confidence, {low, high})   <- abide's OWN bandFor       │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.4 THE RUNNER ORDER (F-4 — the lint half comes alive)

```
checkRunner.selectRules:
  BEFORE:  rule.check.type === "model" && rule.when === phase      (abide)
  AFTER:   (rule.check.type === "lexicon" || rule.check.type === "model"
            || rule.check.type === "lint") && rule.when === phase

the dispatch:
  lexicon  -> scoreSignals -> bandOf -> act?  DECIDED. no Jev.
                                        gray? -> Jev
                                        clear? -> recorded
  lint     -> new RegExp(pattern).test(fileText) -> a verdict
  model    -> abide's checkWithModel (unchanged)
```

### 2.5 THE ERROR RULES (loud, never silent)

```
a missing use: bank          -> loadRules THROWS with the rule id
an invalid regex             -> loadRules THROWS with the pattern
no Jev key                   -> the row records jev:null + a NAMED error;
                                the lexicon band still decides
a Jev timeout                -> the same: the mechanical band stands
a malformed rule file        -> THROWS; the engine does not load half a rubric
```

---

## §3 · THE WAVE ORDER (owners + mechanical done-when gates)

```
WAVES: 4
```

| wave | owner | the DISJOINT file set | the deliverable | the done-when gate | deps |
|---|---|---|---|---|---|
| **A-1** | Desk A | `vendor/abide/**` · `vendor/VENDOR.md` | abide vendored, sha-pinned | `bunx tsc --noEmit vendor/abide/index.ts` exit 0 · every file's sha in VENDOR.md | — |
| **A-2** | Desk A | `src/lexicon/**` · `src/engine/check.ts` | the lexicon type + the scorer + the runner order | `bun test src/lexicon` → the sweep table prints F1=1.000 · `check()` returns the seam's `CheckResult` | A-1 |
| **A-3** | Desk A | `src/lint/**` · `src/ledger/**` | the lint runner + the ledger writer | a KNOWN-BAD fixture REFUSED · a KNOWN-GOOD accepted · the ledger row matches the seam's `LedgerRow` | A-2 |
| **A-4** | Desk A | `src/index.ts` · `src/engine/check.test.ts` | the engine's public surface + the suite | `bun test` → 0 fail · `grep -c "ctx\|pi\." src/` → **0** (invariant I2) | A-3 |

**DISPATCH ORDER:** A-1 alone (the vendor is a prerequisite) → A-2 → A-3 → A-4. Each wave's gate
green before the next fires.

---

## §4 · THE TESTING TIERS

```
TIER 1  the unit      bun test src/lexicon  -> the sweep, the zero-hit, the mutation
TIER 2  the contract  bun test src/engine/check.test.ts -> the seam's shapes hold
TIER 3  the lint      the known-bad fixture REFUSED, the known-good accepted
TIER 4  the invariant grep -c "ctx\|pi\." src/ -> 0  (Desk A touches no host)
TIER 5  the merge     the integrator's index.ts imports check() and nothing else
```

---

## §5 · THE ANTI-PATTERNS (banned)

```
✗ a SECOND band implementation      -> import abide's bandFor
✗ a SECOND Jev wire                 -> import abide's checkWithModel
✗ an invented question type          -> abide's union is boolean/choice/score
✗ a hand-rolled reason string        -> abide's repairReason
✗ a host import in the engine        -> invariant I2; the grep must read 0
✗ a band inherited from a reference  -> DERIVED per rule; loadRules THROWS
✗ a silent skip                      -> every skip is a NAMED error
```

---

## §6 · THE SUCCESS CRITERIA (command-verifiable)

```
1  bunx tsc --noEmit                       -> exit 0
2  bun test                                -> 0 fail
3  bun test -t lexicon_sweep               -> F1=1.000 at the DERIVED band
4  bun test -t lint_runner                 -> the known-bad REFUSED
5  grep -c "ctx\|pi\." src/                -> 0            (invariant I2)
6  grep -c "bandFor" src/lexicon/          -> >= 1         (abide's, not ours)
7  the seam's CheckResult type-check       -> the engine's return satisfies it
8  vendor/VENDOR.md carries every sha      -> the count == the vendored files
```

---

## §7 · THE RESUME GUIDE

```
READ FIRST   SEAM/SEAM_CONTRACT.md -> this spec -> the wave plan
THE STATE    PACKAGE_A_ENGINE/{spec,wave-plan,blueprint}.md + context_management/
THE COMMANDS the 8 success criteria above
THE RESUME   re-run criterion 1; if red, the vendor or the types drifted
```

---

## §8 · THE OPEN QUESTIONS

```
Q1  THE VENDOR MECHANISM: a copy (pinned by sha) or a git subtree?   DEFAULT: a copy + VENDOR.md
Q2  THE LINT FILE SCOPE: which files does a lint rule see?           DEFAULT: the rule's `scope` globs
Q3  THE JEV GATE: does a `gray` ALWAYS call Jev, or only when keyed?  DEFAULT: only when keyed; else jev:null
```

---

## APPENDIX · THE ZERO-TRUST AUDIT OF THIS SPEC

```
[✓] every failure cites a grep or a file:line (F-1..F-8)
[✓] every wave names a DISJOINT file set
[✓] every gate is a COMMAND, not a claim
[✓] the seam is referenced, not restated
[✓] the anti-patterns name the defect CLASS (the 929-L re-implementation)
[?] the vendored file list is unverified — A-1 must enumerate it against the real tree
[?] the lint `scope` semantics are unspecified in abide — A-3 must measure it
```
