# CHECKPOINT MANIFEST — pbk-v3-ship-grade-fixes

**The token:** `pbk-v3-ship-grade-fixes` (hyphens only, no spaces)
**The date:** 2026-09-23 · **the source:** master @ 56c55e2
**The state:** 6 bugs FIXED + re-proven · the cleanup done · the deploy HANDED OFF · the audit BLOCKED
**The seal:** MODE B — NO LOCK (a mutable working snapshot; the blockers mean the tree WILL change).
NEVER manifest-only.

## THE DIST + ITS SHA
```
the merged entry  src/index.ts   74 L · sha256 6e3b6215d0b2175f...
the checkpoint    dist/index.ts  sha256 6e3b6215d0b2175f...
★ THE SHA MATCHES: True
the seam          SEAM/seam.ts   192 L · sha256 66b66a7f10c7c6e7... (FROZEN)
```

## THE BATTERY (SCOPE: SOURCE)
```
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/Checkpoints/pbk-v3-ship-grade-fixes
bunx tsc --noEmit   -> exit 0
bun test ./tests/   -> 24 pass 0 fail
★ THE HONEST COUNT IS 24 (engine 9 + surfaces 8 + adversarial 7). A pattern-matched `bun test
  tests/...` inflates it by matching the Checkpoints copies — measure with the ./ prefix.
```

## THE FIXES (6 FIXED + re-proven, 1 NEW found + fixed)
```
HT-BUG-3  the exemptor's inflection gap   neg=0 act -> neg=3 flag      FIXED
HT-BUG-4  the double-match                4 vs 2    -> 2 vs 2          FIXED
HT-BUG-5  the process-narration fire      pos=4 act -> neg=3 flag      FIXED
HT-BUG-6  the self-reference loop         neg=0 act -> neg=3 flag      FIXED
HT-BUG-10 the audit gate's blind pass     3 blind BLOCK, clean PASSES  FIXED (in source)
HT-BUG-14 the loader could not read the live rules (NEW)  9 of 9 load  FIXED
HT-BUG-15 the extension had NO default export (NEW)       7 hooks      FIXED
THE PRESERVED INVARIANTS: the DESIGN instruction still act · the sacred overlap still 0.000
```

## THE HONEST GAPS (the blockers)
```
B-1  THE AUDIT GATE IS BLOCKED — TWO independent causes, both outside the code:
     (a) its fix (HT-BUG-10) is IN SOURCE, NOT LIVE (mtime 14:31 vs the process 11:25:05; ESM-cached);
     (b) the ocr SCAN is RATE-LIMITED — the raw 429: "poolside/laguna-s-2.1:free is temporarily
         rate-limited upstream"; a retry 90 s later returned the SAME 429; ocr session list reads
         FILES 0 / COMMENTS 0.
B-2  THE NEW TREE HAS NEVER RUN. Its proof is L0/L1. The DEPLOY is the operator's act
     (W6_DEPLOY_HANDOFF.md); the entry now carries the DEFAULT EXPORT (HT-BUG-15) so it CAN load.
B-3  HT-BUG-7 (the Jev 402) — the operator's credits.
B-4  HT-BUG-13 (the GI graph gate's unreachable remedy) — an external extension.
```

## THE RESUME CONDITIONS
```
R-1  the deploy: the operator follows W6_DEPLOY_HANDOFF.md, then the live round (the A/B)
R-2  the audit: a NEW omp process (the fix is ESM-cached) AND a non-rate-limited ocr lane
R-3  HT-BUG-13's work order (the gate's dial / a greenfield path)
```

## THE SEAL
MODE B — NO LOCK. The 4 blockers mean the tree will change; a full-tree lock would block the next
session. NEVER manifest-only.

## THE PROOF-OF-STATE
```bash
CP=/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/Checkpoints/pbk-v3-ship-grade-fixes
sha256sum "$CP/dist/index.ts"   # 6e3b6215d0b2175f...
cd "$CP" && bunx tsc --noEmit   # exit 0
cd "$CP" && bun test ./tests/   # 24 pass 0 fail
```
