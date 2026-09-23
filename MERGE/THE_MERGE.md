# THE MERGE — the integrator (W2, the thin step)

**The seam made this one import. That is the whole point.**

---

## WHY THE MERGE IS THIN

```
┌────────────────────────────────────────────────────────────────────────┐
│ THE MERGE IS ONE IMPORT BECAUSE THE SEAM PRE-DECIDED EVERYTHING        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  THE FAILURE MODE THE SEAM PREVENTS (measured):                        │
│    kernel-judge.ts (929 L) was a "merge later" re-implementation of     │
│    abide. Two desks building independently, merged after, produced a    │
│    SECOND ENGINE with the same constants and an invented type.          │
│                                                                        │
│  THE SEAM PREVENTS IT: both desks typed against seam.ts. Desk A's       │
│  CheckResult IS the type Desk B consumes. Nothing is negotiated at      │
│  merge time.                                                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## THE MERGE (the entire code)

```ts
// src/index.ts — the integrator's file
import { check } from "./engine/check";              // Desk A
import { classifySource, SCORABLE } from "./gate";   // Desk B
import { dispatchAction } from "./action";           // Desk B

export default function (pi: any): void {
  pi.on("message_update", async (event: any, ctx: any) => {
    const ev = event?.assistantMessageEvent;
    if (ev?.type !== "text_delta" && ev?.type !== "thinking_delta") return;
    for (const line of linesOf(ev.delta, ev.contentIndex)) {
      const kind = classifySource(line, false, "");
      if (!SCORABLE.has(kind)) continue;
      const res = await check({ surface: "prose", phase: "turn", text: line, sourceKind: kind });
      const act = dispatchAction("prose", "turn", res.decisions);
      if (act?.kind === "abort+inject") { ctx.abort(); pi.sendUserMessage(act.text, { deliverAs: "steer" }); }
    }
  });
  // ... the other 3 hooks, the same shape
}
```

## THE MERGE'S OWN GATE

```bash
bunx tsc --noEmit                        # both halves type-check TOGETHER
bun test                                 # both suites
bun test -t merge_integration            # the harness: 2 abort+inject, 3 silent
grep -c "from \"./engine" src/index.ts    # 1  (ONE import, no duplication)
grep -c "from \"./gate" src/index.ts      # 1
# THE NO-DUPLICATION PROOF: no band math exists in the merged tree outside Desk A
grep -rn "pos / (pos + neg + 1)" src/ | grep -v "^src/lexicon" || echo "NO DUPLICATE BAND"
```

## THE INTEGRATION AUDIT (after the merge)

```
1  the combined tree: tsc --noEmit
2  the combined suite: 0 fail
3  the invariant pair:  grep ctx|pi  in Desk A's dir -> 0
                        grep bandOf|confidence in Desk B's dir -> 0
4  the live probe: a fired band -> abort + inject (the container)
5  the corpus sweep: a real transcript, every firing adjudicated  <- THE PRECISION NUMBER
6  the Jev live call: restore the credits, run one gray-zone call
```

## THE ORDER OF OPERATIONS

```
W0  THE SEAM          DONE (frozen)
    DESK A (parallel) PACKAGE_A_ENGINE -> 4 waves
    DESK B (parallel) PACKAGE_B_SURFACES -> 4 waves
W2  THE MERGE         THIS FILE — one import + the 4 hooks wired
W3  THE INTEGRATION   the 6-step audit above
```

**THE PARALLELISM IS THE POINT:** Desk A and Desk B never wait on each other. Desk B builds
against the seam's stub; Desk A builds against the seam's types. The merge is the FIRST time
the two halves meet — and by then, every shape is already agreed.
