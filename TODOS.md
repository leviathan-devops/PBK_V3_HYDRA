# W2 THE SURFACES — THE PINNED TODO ANCHOR
# Source of truth: WORKER_SPEC.md §W7. On resume, RE-DERIVE from the spec; never trust this board over it.
# A todo completes ONLY when its mechanical gate lands.

[ ] W2-T1   worktree + branch verified        -> git branch --show-current == worker/surfaces
[ ] W2-T2   worker spec + goal pin on disk    -> ls WORKER_SPEC.md WORKER_GOAL.md
[ ] W2-T3   D1 the source-kind gate           -> bun test -t source_kind_gate -> 0 FP
[ ] W2-T4   D2 the quote-state machine        -> bun test -t quote_state -> 5/5
[ ] W2-T5   D4 the delta accumulator          -> bun test -t delta_accumulator -> fires
[ ] W2-T6   D5 the abort dedupe               -> bun test -t abort_dedupe -> abort=1
[ ] W2-T7   D3 the four hooks                 -> bun test -t abort_dispatch -> 2 abort / 3 silent
[ ] W2-T8   D6 the action dispatch            -> bun test -t action_map -> 4 kinds
[ ] W2-T9   D7 the entry + purity             -> grep -rc "bandOf\|confidence" src/ -> EMPTY
[ ] W2-T10  the self-audit §A table executed  -> every row carries a verdict
[ ] W2-T11  the PR opened                     -> the required checks armed
[ ] W2-T12  the PR merged via the gate        -> THE ORCHESTRATOR MERGES, NOT W2  [IMMUTABLE]
[ ] W2-T13  canon + ship docs updated         -> the record loop                 [IMMUTABLE]
