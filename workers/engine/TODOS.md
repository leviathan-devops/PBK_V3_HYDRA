# W1 THE ENGINE — THE PINNED TODO ANCHOR
# Source of truth: WORKER_SPEC.md §W7. On resume, RE-DERIVE from the spec; never trust this board over it.
# A todo completes ONLY when its mechanical gate lands.

[ ] W1-T1   worktree + branch verified        -> git branch --show-current == worker/engine
[ ] W1-T2   worker spec + goal pin on disk    -> ls WORKER_SPEC.md WORKER_GOAL.md
[ ] W1-T3   D1 the vendored abide             -> bunx tsc --noEmit vendor/abide/index.ts -> exit 0
[ ] W1-T4   D2 the lexicon check type         -> grep -c 'z.literal("lexicon")' -> >= 1
[ ] W1-T5   D3 the scorer                     -> bun test -t lexicon_sweep -> F1=1.000
[ ] W1-T6   D4+D5 the runner + the lint       -> bun test -t lint_runner -> REFUSED
[ ] W1-T7   D6 the ledger writer              -> grep -c '"decidedBy"' -> >= 1
[ ] W1-T8   D7 the public surface + purity    -> grep -rc "ctx\|pi\." src/ -> EMPTY
[ ] W1-T9   the self-audit §A table executed  -> every row carries a verdict
[ ] W1-T10  the PR opened                     -> the required checks armed
[ ] W1-T11  the PR merged via the gate        -> THE ORCHESTRATOR MERGES, NOT W1  [IMMUTABLE]
[ ] W1-T12  canon + ship docs updated         -> the record loop                 [IMMUTABLE]
