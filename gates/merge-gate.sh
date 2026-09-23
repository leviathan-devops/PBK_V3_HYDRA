#!/usr/bin/env bash
# THE MERGE GATE (Anchor 1, local equivalent of the GitHub required check).
# The ORCHESTRATOR runs this against a worker branch BEFORE merging. NONZERO = DO NOT MERGE.
set -uo pipefail
W="/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA"
BRANCH="${1:?usage: merge-gate.sh <worker-branch>}"
WT="${2:?usage: merge-gate.sh <worker-branch> <worktree-path>}"
fail=0
chk() { printf "  %-52s " "$1"; shift; if out=$("$@" 2>&1); then echo "PASS"; else echo "FAIL"; echo "$out" | tail -3 | sed 's/^/      /'; fail=1; fi; }
echo "THE MERGE GATE — branch=$BRANCH worktree=$WT"
cd "$WT" || { echo "  worktree absent: $WT"; exit 1; }
chk "tsc --noEmit"                 bash -c "bunx tsc --noEmit"
chk "bun test"                     bash -c "bun test 2>&1 | tail -1 | grep -qE '0 fail'"
chk "no host ref in the engine"    bash -c "! grep -rc 'ctx\\|pi\\.' src/ 2>/dev/null | grep -qv ':0'"
chk "no band in the surfaces"      bash -c "! grep -rc 'bandOf\\|confidence' src/ 2>/dev/null | grep -qv ':0'"
chk "the seam is untouched"        bash -c "test \"\$(sha256sum $W/SEAM/seam.ts | cut -c1-16)\" = 66b66a7f10c7c6e7"
chk "the branch is not master"     bash -c "test \"$BRANCH\" != master"
echo
[ $fail -eq 0 ] && echo "GATE: PASS — the orchestrator may merge" || echo "GATE: FAIL — DO NOT MERGE"
exit $fail
