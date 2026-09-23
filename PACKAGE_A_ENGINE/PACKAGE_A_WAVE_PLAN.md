# PACKAGE A — THE ENGINE · WAVE PLAN

**WAVES: 4**

**Authority:** `PACKAGE_A_DPL1_SPEC.md` · the seam `../SEAM/SEAM_CONTRACT.md`
**Owner:** Desk A (one long-horizon worker agent)

---

## WAVE A-1 · THE VENDOR (alone — the prerequisite)

**the DISJOINT file set:** `vendor/abide/**` · `vendor/VENDOR.md`

**the deliverable:** abide's engine vendored verbatim — the schema, band, jev, reason — with a sha per
file recorded.

**the done-when gate:**
```bash
bunx tsc --noEmit vendor/abide/index.ts        # exit 0
grep -c '^' vendor/VENDOR.md                    # >= 10 (the header + one row per file)
# every vendored file's sha256 appears in VENDOR.md
```

**the named files to vendor (from the measured tree):**
```
/tmp/abide-repo/packages/schema/src/rubric.ts      the rule + check + question schemas
/tmp/abide-repo/packages/schema/src/hooks.ts       the 4 hook payloads
/tmp/abide-repo/packages/cli/src/lib/band.ts       violationProbability + bandFor
/tmp/abide-repo/packages/cli/src/lib/jev.ts        checkWithModel (the wire)
/tmp/abide-repo/packages/cli/src/lib/reason.ts     repairReason + flagNotice
```

---

## WAVE A-2 · THE LEXICON + THE RUNNER ORDER (deps: A-1)

**the DISJOINT file set:** `src/lexicon/**` · `src/engine/check.ts`

**the deliverable:** the `lexicon` check type; `scoreSignals`; `confidence`; `bandOf` (abide's);
`loadRules` (THROWS); the runner order (lexicon -> lint -> model).

**the done-when gate:**
```bash
bun test src/lexicon                          # 0 fail
bun test -t lexicon_sweep                     # the table prints F1=1.000
bun test -t lexicon_zero_hit                  # every rule's body scores 0 against itself
grep -c 'bandFor' src/lexicon/                # >= 1 (abide's, imported)
grep -c 'confidence(pos, neg) = pos' src/     # 0 (NOT re-derived inline)
```

**THE DERIVATION IS MANDATORY:** the band for every rule is computed from its own sweep
(`min(positive) > max(negative)`); an inherited band THROWS at load.

---

## WAVE A-3 · THE LINT RUNNER + THE LEDGER (deps: A-2)

**the DISJOINT file set:** `src/lint/**` · `src/ledger/**`

**the deliverable:** abide's never-executed `lintCheckSchema.pattern` EXECUTED; the ledger writer
emitting the seam's `LedgerRow`.

**the done-when gate:**
```bash
bun test -t lint_runner                       # the known-bad REFUSED, the known-good accepted
bun test -t ledger_row                        # the row satisfies the seam's LedgerRow
grep -c 'decidedBy' src/ledger/               # >= 1 (the cost metric is recorded)
```

**★ F-3 CLOSES HERE.** abide's own comment says the pattern is "Never executed". This wave executes it.

---

## WAVE A-4 · THE PUBLIC SURFACE (deps: A-3)

**the DISJOINT file set:** `src/index.ts` · `src/engine/check.test.ts`

**the deliverable:** `check(req: CheckRequest): Promise<CheckResult>` exported and satisfying the seam.

**the done-when gate:**
```bash
bunx tsc --noEmit                             # exit 0
bun test                                      # 0 fail
grep -c 'ctx\|pi\.' src/                      # 0        ← INVARIANT I2
grep -c 'export.*check' src/index.ts          # >= 1
```

---

## THE BOUNDARY CHECK (before the merge)

```bash
# the engine's return type satisfies the seam
bunx tsc --noEmit ../SEAM/seam.ts src/index.ts
# the invariant
grep -rc 'ctx\|pi\.' src/ | grep -v ':0' || echo "I2 HOLDS: zero host references"
```
