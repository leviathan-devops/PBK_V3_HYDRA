# THE FROZEN SEAM — W0 (the only serial artifact)

**Version:** 1.0.0 · **Frozen:** 2026-09-23 · **File:** `SEAM/seam.ts`
**Consumers:** PACKAGE_A_ENGINE · PACKAGE_B_SURFACES

## WHY THIS EXISTS

Two desks build in parallel and NEVER against each other. This file is the boundary.
A change here invalidates BOTH wave plans — it is the only artifact that may not drift.

## THE TWO HALVES

```
┌────────────────────────────────────────────────────────────────────────┐
│ DESK A · THE ENGINE (PACKAGE_A_ENGINE)                                 │
│   IMPLEMENTS:  check(req: CheckRequest) -> Promise<CheckResult>        │
│   OWNS:        the lexicon score · the band · the Jev wire · the lint  │
│                runner · the ledger writer · abide's vendored engine    │
│   NEVER:       touches a host event · calls ctx.abort() · reads a file │
├────────────────────────────────────────────────────────────────────────┤
│ DESK B · THE SURFACES (PACKAGE_B_SURFACES)                             │
│   IMPLEMENTS:  classifySource() · the 4 surface hooks · the ACTION      │
│                dispatch (surface,phase) -> ActionCall                  │
│   OWNS:        ctx.abort() · pi.sendUserMessage · the OMP event map ·  │
│                the streaming interrupt (abide has NO hook for it)      │
│   NEVER:       computes a band · calls Jev · reads a rule file          │
└────────────────────────────────────────────────────────────────────────┘
```

## THE CONTRACT (the exact shapes)

```
CheckRequest   { surface, phase, text, sourceKind, file?, task? }
CheckResult    { decisions: Decision[], jevCalls, total, errors: string[] }
Decision       { ruleId, band, probability, decidedBy, sourceKind,
                 span, correction, capped }
ActionCall     { kind, text, deliverAs? }
LedgerRow      { ruleId, band, probability, decidedBy, sourceKind,
                 span, action, capped, at }
```

## THE THREE INVARIANTS

```
I1  DESK B NEVER COMPUTES A BAND.  It supplies sourceKind and receives band.
    A band computed in Desk B is a SECOND SOURCE OF TRUTH — the exact defect
    that produced kernel-judge.ts (929 L re-implementing abide).

I2  DESK A NEVER TOUCHES A HOST.  check() is a pure function of its request.
    It does not import ctx, pi, or any extension API. A host call inside
    Desk A is untestable and violates the boundary.

I3  THE PHASE DETERMINES THE ACTION, AND DESK B OWNS THE MAPPING.
    prose        -> abort+inject   (the streaming interrupt — abide has NONE)
    tool-call    -> block
    tool-result  -> isError
    post-tool-use-> block          (the edit landed; the repair demand)
    Desk A returns the verdict; Desk B decides the wire.
```

## THE MERGE

```ts
// the ENTIRE merge — one import, no semantics crossing
import { check } from "./engine/check";        // Desk A
import { classifySource } from "./lexicon/gate"; // Desk B
import { dispatchAction } from "./surfaces/action"; // Desk B

// Desk B's hook
const d = await check({ surface:"prose", phase:"turn", text, sourceKind: classifySource(...) });
const a = dispatchAction("prose", "turn", d.decisions);
if (a?.kind === "abort+inject") { ctx.abort(); pi.sendUserMessage(a.text, { deliverAs:"steer" }); }
```

## THE VERIFICATION (both desks run this against the seam)

```
the seam compiles:            bunx tsc --noEmit SEAM/seam.ts
the shapes match:             Desk A's CheckResult satisfies the interface
the invariants hold:          grep -c "ctx\|pi\." PACKAGE_A_ENGINE/src  -> 0
                              grep -c "bandOf\|confidence" PACKAGE_B/src -> 0
the merge is one import:      the integrator's index.ts imports both, nothing else
```
