# THE MERGE CHECKLIST (P4) — the orchestrator's act, never a worker's

## THE PRE-CONDITIONS (both must hold before ANY merge)
```
[ ] W1's gate PASSED (tsc + F1=1.000 + the lint REFUSED + the purity grep EMPTY)
[ ] W2's gate PASSED (tsc + 0 FP + 2 abort/3 silent + the purity grep EMPTY)
[ ] each branch's §A audit carries a verdict per hunk
[ ] the SEAM is untouched: sha 66b66a7f10c7c6e7 on BOTH branches
[ ] gates/merge-gate.sh PASSES on each branch
```

## THE MERGE SEQUENCE
```
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA
git checkout master
git merge --no-ff worker/engine    -m "feat(engine): W1's D1-D7 — the abide engine + the lexicon type"
git merge --no-ff worker/surfaces  -m "feat(surfaces): W2's D1-D7 — the OMP host surfaces"
```

## ★ THE ONE COLLISION: src/index.ts (both branches create it)
```
W1's src/index.ts  exports `check(req: CheckRequest): Promise<Decision>`  (the engine surface)
W2's src/index.ts  registers the pi.on hooks                              (the host entry)
THE RESOLUTION: ONE entry that BOTH exports check() and registers the hooks —
  i.e. W2's entry imports check() from the engine (a path the merge establishes).
THE BOUNDARY LAW: the seam says "Desk B calls this; Desk A implements it."
  The merged entry is the ONE place both halves meet. It is the orchestrator's to write.
```

## THE POST-CONDITIONS
```
[ ] bunx tsc --noEmit on the combined tree -> exit 0           (OR-14)
[ ] bun test -> 0 fail on the combined tree
[ ] the seam sha unchanged: 66b66a7f10c7c6e7
[ ] every ORACLE row that the two halves can move has moved
[ ] the merge recorded in the canon + ship docs
```
