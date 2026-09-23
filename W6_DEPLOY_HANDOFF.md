# W6 · THE DEPLOY HANDOFF (the operator's act)

## THE RUNTIME SEAT (declared)
```
I am the driver of ~/.omp/agent/extensions/lexicon-gate/ — the LIVE enforcement.
Its consumer is THIS session. Every firing on my own prose is the data.
```

## THE INSTANCE (named)
```
the live bundle      ~/.omp/agent/extensions/lexicon-gate/index.ts · 221 L · sha16 1122308d41ba11a8
  its mtime          2026-09-23 06:08:08
the running process  pid 13888 · started 2026-09-23 11:25:05
the ledger           ~/.omp/run/lexicon-ledger.jsonl · 566 rows
the new tree's entry src/index.ts · 74 L · sha16 6e3b6215d0b2175f
  ★ THE CORRECTION (found 2026-09-23 by re-measurement): the earlier value
    (aa8d1d3d5f2160c5 · 58 L) is the PRE-HT-BUG-15 hash — the tree WITHOUT the default export,
    i.e. the artifact that loads NOTHING. The current entry is 74 L. An operator verifying
    against the stale hash would see a mismatch, or worse, deploy the pre-fix artifact.
```

## ★ THE DEPLOYED-IS-NOT-SOURCE FINDING (measured twice)
```
1. THE PEDIGREE FIX: landed 06:08:08; the process that started 11:25:05 LOADED it. VERIFIED LIVE
   by the A/B in the session JSONL (user-role ends L31948; customType "ttsr-injection" from L32034).
2. THE AUDIT-GATE FIX (HT-BUG-10): landed 14:31:18; the process (11:25:05) PREDATES it. The tool
   still returns the OLD `GATE: PASS (filesReviewed=?)`. THE FIX IS IN SOURCE, NOT LIVE.
★ THE LAW HOLDS: compare the file's mtime to the process start BEFORE claiming a fix is live.
```

## THE DEPLOY (what the operator runs)
```
1  the source      /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/src/   (15 .ts)
2  the target      ~/.omp/agent/extensions/pbk-v3/     (a NEW dir — do NOT overwrite lexicon-gate/)
3  the entry       src/index.ts has `export default function pbk_v3(pi)` — THE DEPLOY CONTRACT
                   (HT-BUG-15, fixed). omp calls the DEFAULT EXPORT with `pi`; it calls boot()
                   internally. The rules dir comes from PBK_RULES_DIR or ~/.omp/agent/rules.
                   WITHOUT IT THE DEPLOY LOADS NOTHING — proven: typeof default === "function",
                   and calling it registers 7 hooks.
4  the rules       ~/.omp/agent/rules/  (the 9 live rules — W2 already fixed them)
5  the config      add the new path to ~/.omp/agent/config.yml's `extensions:` list
6  the restart     a NEW omp process is REQUIRED (extensions load at process construction;
                   the module is ESM-cached — proven by the HT-BUG-10 finding above)
7  the retest      the A/B: a firing must arrive as a customType entry, not a user-role message
```

## THE DEPLOY READINESS (measured)
```
bunx tsc --noEmit                  exit 0
bun test ./tests/                  24 pass / 0 fail   (SOURCE scope)
the entry exports boot()           1
the DEFAULT EXPORT (the contract)  1  <- HT-BUG-15 fixed + proven (7 hooks register)
the hooks register                 7 (MEASURED: calling the default export with a stub pi
                                    returns session_start, input, message_update, tool_call,
                                    tool_result, ttsr_triggered, agent_end)
  ★ the registration site           src/surfaces/entry.ts:35-99 (7 pi.on calls) — NOT src/index.ts,
                                    which imports install() from it. MEASURED by the probe above.
the rules load                     9 of 9
the audit gate                     BLOCKED (its fix is in source, not live; the scan writes no artifact)
```

## ★ WHY I DID NOT DEPLOY
The pin's HARD STOP: `~/.omp/agent/extensions/lexicon-gate/` is the OPERATOR'S, guarded.
Deploying REPLACES the working live enforcement. That is a guarded action, and the handoff is
where W6 ENDS.

## THE HONEST RESIDUAL
```
- the NEW tree has NEVER RUN. Its proof is L0/L1 (tsc + 24 tests, SOURCE scope).
- the audit gate is BLOCKED: (a) its fix needs a new process, (b) the scan itself writes no
  artifact (filesReviewed=?, 0 findings).
- HT-BUG-7 (the Jev 402) and HT-BUG-13 (the GI graph gate) remain BLOCKED/OPEN — both are
  outside this tree (an external account; an external extension).
```
