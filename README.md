# PBK v3 HYDRA — THE 2-DESK BUILD

**Minted:** 2026-09-23 · **The architecture:** interface-first, 2 desks parallel, a thin merge.

---

## THE STRUCTURE

```
PBK_V3_HYDRA/
├── SEAM/                              W0 — THE ONLY SERIAL ARTIFACT
│   ├── seam.ts                        the frozen interface v1.0.0
│   └── SEAM_CONTRACT.md               the boundary doc
├── PACKAGE_A_ENGINE/                  DESK A — the engine
│   ├── PACKAGE_A_CREATE_PROMPT.md     ★ the /create pin
│   ├── PACKAGE_A_DPL1_SPEC.md         the contract (F-1..F-8)
│   ├── PACKAGE_A_WAVE_PLAN.md         WAVES: 4
│   ├── PACKAGE_A_MASTER_BLUEPRINT.md  the design authority
│   └── context_management/            11 canon docs
├── PACKAGE_B_SURFACES/                DESK B — the surfaces
│   ├── PACKAGE_B_CREATE_PROMPT.md     ★ the /create pin
│   ├── PACKAGE_B_DPL1_SPEC.md         the contract (G-1..G-6)
│   ├── PACKAGE_B_WAVE_PLAN.md         WAVES: 4
│   ├── PACKAGE_B_MASTER_BLUEPRINT.md  the design authority
│   └── context_management/            11 canon docs
└── MERGE/
    └── THE_MERGE.md                   W2 — the integrator (one import)
```

## THE PARALLELISM (why 2 desks, and why they never wait)

```
W0  THE SEAM            FROZEN — both desks type against it
        |
        +-------------------+-------------------+
        v                   v                   v
    DESK A              DESK B              (the integrator
    the engine          the surfaces         waits for BOTH)
    A-1 vendor          B-1 the gate
    A-2 lexicon         B-2 the surfaces    ★ THE STREAMING
    A-3 lint+ledger     B-3 the action        INTERRUPT
    A-4 the surface     B-4 the entry         (abide has NO hook)
        |                   |
        +---------+---------+
                  v
W2  THE MERGE           ONE IMPORT — the seam pre-decided everything
W3  THE INTEGRATION     the 6-step audit (tsc · suite · the invariant pair ·
                        the live probe · the corpus sweep · the Jev live call)
```

## WHY THE SEAM FIRST (the measured reason)

```
kernel-judge.ts (929 L) was a "merge later" re-implementation of abide: two efforts built
independently, merged after, producing a SECOND ENGINE with the same constants
(EDIT_CHECK_TIMEOUT_MS 8000 · 0.8 · 0.5) and an INVENTED question type (`noul`).

THE SEAM PREVENTS IT: both desks type against seam.ts. Desk A's CheckResult IS the type
Desk B consumes. Nothing is negotiated at merge time.
```

## THE THREE INVARIANTS (the seam's contract)

```
I1  DESK B NEVER COMPUTES A BAND.  grep -c "bandOf\|confidence" PACKAGE_B/src/  ->  0
I2  DESK A NEVER TOUCHES A HOST.   grep -c "ctx\|pi\." PACKAGE_A/src/          ->  0
I3  THE PHASE DETERMINES THE ACTION, and Desk B owns the mapping.
```

## THE DIFFERENTIATOR (what this build adds that abide does not have)

```
abide HAS    the rubric · the Jev wire · the band · the reason · the ledger · 3 host adapters
abide LACKS  a lexicon (0 grep hits) · a source-kind gate (0 grep hits) ·
             a streaming hook (0 grep hits) · a live lint runner ("Never executed") ·
             an OMP adapter

THIS BUILD FILLS EXACTLY THOSE FOUR CELLS. Nothing else.
```

## HOW TO FIRE THE DESKS

```
DESK A:  paste PACKAGE_A_ENGINE/PACKAGE_A_CREATE_PROMPT.md as the /create pin
DESK B:  paste PACKAGE_B_SURFACES/PACKAGE_B_CREATE_PROMPT.md as the /create pin
         (both can run CONCURRENTLY — they share only SEAM/seam.ts, read-only)
MERGE:   after both land, follow MERGE/THE_MERGE.md
```

## THE SEAM SHA (the pinned artifact)

```
SEAM/seam.ts    192 L    sha256 66b66a7f10c7c6e737a491b6e0f63903
                        tsc --noEmit -p tsconfig.json  ->  exit 0
BOTH packages cite v1.0.0. A change to the seam INVALIDATES both packages.
```

## THE HONEST STATE

```
DONE      the seam (frozen) · both packages (spec + wave plan + blueprint + canon + create pin)
NOT BUILT the engine · the surfaces · the merge
OPEN      the Jev live call (402) · the corpus sweep · the OMP event order
```
