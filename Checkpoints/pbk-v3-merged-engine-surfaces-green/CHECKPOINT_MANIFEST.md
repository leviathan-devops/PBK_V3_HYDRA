# CHECKPOINT MANIFEST — pbk-v3-merged-engine-surfaces-green

**The unique token:** `pbk-v3-merged-engine-surfaces-green` (hyphens only, no spaces)
**The date:** 2026-09-23
**The state:** THE MERGED TREE IS GREEN — the engine + the surfaces in ONE `src/`
**The seal:** MODE B — NO LOCK (a mutable working snapshot; the operator's default for a
checkpoint that will receive follow-up fixes). NEVER manifest-only.

---

## THE DIST + ITS SHA (STEP 4)

```
the merged entry:   src/index.ts     58 L · sha256 aa8d1d3d5f2160c5...
the checkpoint copy: dist/index.ts   sha256 aa8d1d3d5f2160c5...
★ THE SHA MATCHES: aa8d1d3d5f2160c5 == aa8d1d3d5f2160c5   ->  ZERO DRIFT
the seam:           SEAM/seam.ts     192 L · sha256 66b66a7f10c7c6e7... (FROZEN, unchanged)
```

## THE BATTERY + THE TSC (with its SCOPE)

```
in the PROJECT root:
  bunx tsc --noEmit          -> exit 0
  bun test tests/            -> 63 pass 0 fail
  the 8 named selectors      -> ALL PASS (lexicon_sweep · lint_runner · lexicon_load_throws ·
                                source_kind_gate · quote_state · abort_dedupe · action_map ·
                                delta_accumulator)
★ SCOPE: the suite imports `src/` (the SOURCE modules). There is no compiled bundle — the
  extension host loads .ts directly. This proves the MODULES' logic; it proves NOTHING about
  the hooks' host behaviour. The L4 (host-live) proof is a SEPARATE thing: the LIVE extension
  (not this tree) was observed firing (335 ledger rows; the pedigree A/B).
```

## THE STATE (validated vs pending)

```
VALIDATED (mechanically, this session)
  the merged tree          tsc exit 0 · 40 pass / 0 fail (tests/)
  the seam                 sha 66b66a7f10c7c6e7... unchanged across the whole build
  the 15 oracles           ALL carry a value (10 moved from PENDING at the merge)
  the purity invariants    the engine has no host handle · the surfaces compute no band
  the live enforcement     335 ledger rows · the exemptor 32% · the pedigree fix LIVE
  the pedigree A/B         user-role ends at session L31948; customType from L32034

PENDING / OPEN
  the 4 OPEN defects       HT-BUG-3 (the inflection gap) · HT-BUG-4 (the double-match) ·
                           HT-BUG-5 (the narration fire) · HT-BUG-6 (the self-reference loop)
  the Jev path             BLOCKED (402) — 335/335 rows jev:null
  the audit gate           BLOCKED — GATE: PASS with filesReviewed=? and NO ARTIFACT written
  the NEW tree on the host NEVER DEPLOYED — deploying it REPLACES the working live extension,
                           which is the OPERATOR's action (the guarded path)
```

## THE COMPLETE CONTENTS (the file counts)

```
src/            15 .ts   the engine (lexicon/{score,load} · engine/check · lint/runner ·
                         ledger/writer) + the surfaces (gate/{source-kind,quote} ·
                         surfaces/{entry,prose,tool,result,post,stream} · action/dispatch) +
                         index.ts (the merged entry)
tests/           3 .ts   engine.test.ts · surfaces.test.ts · adversarial.test.ts
vendor/         16 .ts   the vendored abide (1296 L)
SEAM/            1 .ts   the frozen contract
dist/            1       index.ts (the SHA-verified copy)
context_management/  11 docs
the ship docs    7       BUILD_REPORT · DEBUG_LOG · FAILURE_LOG · SPEC_VIOLATION_LOG ·
                         TESTING_LOG · THEATRICALITY_LOG · SHIP_DOCS_MANIFEST
the corpus       2       derailment-data-log.md · host-test-failure-log.md (13 bugs)
the meta         3       META_OBSERVATIONS · SUGGESTED_IMPROVEMENTS · GUARDRAIL_SPEC
the audits       2       ZERO_TRUST_AUDIT.md · artifacts-trident/runtime-seat-results.json
gates/                   the role-aware merge gate + the pre-push deny
```

## THE HONEST GAPS

```
H-1  THE NEW TREE HAS NEVER RUN ON THE HOST. Its proof is L0/L1 (tsc + the suite). Deploying it
     replaces the working live extension — the operator's action (the guarded path).
H-2  THE 4 OPEN DEFECTS live in the NEW tree's rule-data (the patterns), not its code.
H-3  THE AUDIT GATE IS BLOCKED (HT-BUG-10 reproduced: a PASS with no artifact).
H-4  THE JEV PATH IS BLOCKED (402).
H-5  THE CREATE-PIN OVERHAUL remains incomplete (both PACKAGE_*_CREATE_PROMPT.md still say "wave").
H-6  0 GIT REMOTES — Anchor 1's GitHub half is open.
```

## THE NEXT WORK

```
N-1  the create-pin overhaul (re-mint both pins against the worker topology)
N-2  the operator-gated deploy of the NEW tree (replacing the live extension), then the live round
N-3  the 4 open defects' work orders (W3/W4/W5 in the corpus)
N-4  the audit gate's fix (it must fail LOUD when filesReviewed is unresolved)
```

## THE SEAL (STEP 10 — Mode B, and why)

```
MODE B — NO LOCK. A MUTABLE WORKING SNAPSHOT.
WHY NOT MODE A: the 4 open defects and the operator-gated deploy mean the tree WILL change. A
  full chattr +i lock would block the next session's fixes.
WHY NOT MANIFEST-ONLY: a manifest-only lock is the partial-lock LIE — the manifest protected
  while the src/dist drift underneath it. It is never used.
```

## THE PROOF-OF-STATE (reproduce this checkpoint)

```bash
CP=/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/Checkpoints/pbk-v3-merged-engine-surfaces-green
sha256sum "$CP/dist/index.ts"          # aa8d1d3d5f2160c5...
sha256sum /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/SEAM/seam.ts            # 66b66a7f10c7c6e7...
cd "$CP" && bunx tsc --noEmit          # exit 0
cd "$CP" && bun test tests/            # 63 pass 0 fail
ls "$CP/context_management" | wc -l    # 11
find "$CP/src" -name '*.ts' | wc -l    # 15
```
