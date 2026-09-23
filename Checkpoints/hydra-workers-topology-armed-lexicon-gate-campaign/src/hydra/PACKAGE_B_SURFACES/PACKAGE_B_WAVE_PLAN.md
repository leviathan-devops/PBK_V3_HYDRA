# PACKAGE B — THE SURFACES · WAVE PLAN

**WAVES: 4**

**Authority:** `PACKAGE_B_DPL1_SPEC.md` · the seam `../SEAM/SEAM_CONTRACT.md`
**Owner:** Desk B (one long-horizon worker agent)

---

## WAVE B-1 · THE GATE (alone — the FP shield)

**the DISJOINT file set:** `src/gate/**`

**the deliverable:** `classifySource` · `isQuotedMatch` · `SCORABLE`. The deterministic, $0
filter that decides whether a line is the agent's OWN utterance.

**the done-when gate:**
```bash
bun test src/gate                       # 0 fail
bun test -t source_kind_gate            # "TOTAL FALSE POSITIVES: 0" + "CONTROL: 5/5 fired"
grep -c 'own_utterance' src/gate/       # >= 1
```

**THE 5 CONTROLS (must be NON-scorable):** a heading · a table row · a backtick bullet · a
blockquote · a fenced block.
**THE 5 CONTROLS (must be scorable):** the agent's own plain lines.

---

## WAVE B-2 · THE SURFACES (deps: B-1)

**the DISJOINT file set:** `src/surfaces/**`

**the deliverable:** the 4 hooks (`message_update` · `tool_call` · `tool_result` ·
`post-tool-use`) + the delta accumulator + the abort dedupe.

**the done-when gate:**
```bash
bun test -t abort_dispatch              # 2 positives abort, 3 negatives silent
bun test -t delta_accumulator           # a split-across-deltas line assembles
bun test -t abort_dedupe                # the same signature aborts ONCE
grep -c 'bandOf\|confidence' src/       # 0        ← Desk B computes NO band
```

**★ THE STREAMING INTERRUPT IS HERE.** `message_update` takes `(event, ctx)`; a fired band
calls `ctx.abort()` + `pi.sendUserMessage(text, {deliverAs:"steer"})`.

---

## WAVE B-3 · THE ACTION (deps: B-2)

**the DISJOINT file set:** `src/action/**`

**the deliverable:** `dispatchAction(surface, phase, decisions) -> ActionCall | null` — the
4-row mapping, owned here because only Desk B knows what each host surface can do.

**the done-when gate:**
```bash
bun test -t action_map                  # the 4 rows each produce the right `kind`
bun test -t action_snapshot             # a snapshot per row: kind + text
grep -c 'ctx\.abort\|sendUserMessage' src/action/   # >= 1
```

**THE MAPPING (the contract):**
```
prose          -> abort+inject   ctx.abort() + sendUserMessage(steer)
tool-call      -> block          {block:true, reason}
tool-result    -> isError        {isError:true, content:[..., demand]}
post-tool-use  -> block          the repair demand
```

---

## WAVE B-4 · THE ENTRY (deps: B-3)

**the DISJOINT file set:** `src/index.ts` · `src/surfaces/*.test.ts`

**the deliverable:** the extension's default export — the 4 hooks registered, the engine called,
the action dispatched.

**the done-when gate:**
```bash
bunx tsc --noEmit                       # exit 0
bun test                                # 0 fail
grep -c 'export default' src/index.ts   # >= 1
grep -c "bandOf\|confidence" src/       # 0        ← the invariant
```

---

## THE BOUNDARY CHECK (before the merge)

```bash
# Desk B never computes a band
grep -rc 'bandOf\|confidence' src/ | grep -v ':0' || echo "I1 HOLDS: no band computed in B"
# the seam's types are satisfied
bunx tsc --noEmit ../SEAM/seam.ts src/index.ts
# the engine is imported, not re-implemented
grep -c 'from "../engine' src/ || echo "the engine is NOT yet wired (B-2 uses the seam stub)"
```
