#!/usr/bin/env bash
# THE MERGE GATE (Anchor 1, local equivalent of the GitHub required check).
# The ORCHESTRATOR runs this against a worker branch BEFORE merging. NONZERO = DO NOT MERGE.
#
# USAGE: merge-gate.sh <worker-branch> <worktree-path>
#
# THE ROLE-AWARE INVARIANTS (fixed 2026-09-23, HT-BUG-14):
#   the ENGINE  (worker/engine)   must have NO host reference   (grep -rc "ctx\|pi\.")
#   the SURFACES(worker/surfaces) must compute NO band          (grep -rc "bandOf\|confidence")
#   each invariant applies to ITS OWN tree only — applying both to both was the gate's bug.
set -uo pipefail
W="/home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA"
BRANCH="${1:?usage: merge-gate.sh <worker-branch> <worktree-path>}"
WT="${2:?usage: merge-gate.sh <worker-branch> <worktree-path>}"
fail=0
chk() { printf "  %-52s " "$1"; shift; if out=$("$@" 2>&1); then echo "PASS"; else echo "FAIL"; echo "$out" | tail -3 | sed 's/^/      /'; fail=1; fi; }
echo "THE MERGE GATE — branch=$BRANCH worktree=$WT"
cd "$WT" || { echo "  worktree absent: $WT"; exit 1; }

chk "tsc --noEmit"                 bash -c "bunx tsc --noEmit"
# the suite: grep the SUMMARY lines, not tail -1
chk "bun test (0 fail)"            bash -c "bun test 2>&1 | grep -qE '^ *0 fail'"
chk "the seam is untouched"        bash -c "test \"\$(sha256sum $W/SEAM/seam.ts | cut -c1-16)\" = 66b66a7f10c7c6e7"
chk "the branch is not master"     bash -c "test \"$BRANCH\" != master"

# ── THE ROLE-AWARE INVARIANT ──
case "$BRANCH" in
  *engine)
    chk "the ENGINE's purity (no host ref)" bash -c "! grep -rc 'ctx\\|pi\\.' src/ 2>/dev/null | grep -qv ':0'" ;;
  *surfaces)
    chk "the SURFACES' purity (no band)"    bash -c "! grep -rc 'bandOf\\|confidence' src/ 2>/dev/null | grep -qv ':0'" ;;
  *)
    echo "  (unknown branch role — no purity invariant applied)" ;;
esac
echo
[ $fail -eq 0 ] && echo "GATE: PASS — the orchestrator may merge" || echo "GATE: FAIL — DO NOT MERGE"
exit $fail
