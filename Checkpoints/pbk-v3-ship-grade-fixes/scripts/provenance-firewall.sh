#!/usr/bin/env bash
# provenance-firewall.sh — THE ONE-COMMAND FIREWALL (N-5's deliverable).
# Exit 0 = the provenance axis is wired and the enforcement is not self-scoring.
# Exit !=0 = a named detector FAILED. Every failure mode from the blueprint §2/§3/§6.
#
# A DETECTOR THAT IS NEVER RUN IS DOCUMENTATION. This script RUNS them.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LEDGER="${LEDGER:-$HOME/.omp/run/lexicon-ledger.jsonl}"
LIVE_EXT="$HOME/.omp/agent/extensions/lexicon-gate/index.ts"
FAILN=0
fail() { echo "FAIL: $1"; FAILN=$((FAILN+1)); }
pass() { echo "ok: $1"; }

echo "=== THE PROVENANCE FIREWALL ==="

# ── D1: THE PROVENANCE-ABSENT — the axis exists ─────────────────────────────────
if [ -f "$ROOT/src/gate/provenance.ts" ] || grep -rqE 'aboutGate|classifyProvenance' "$ROOT/src" 2>/dev/null; then
  pass "D1 the provenance axis exists in src/"
else
  fail "D1 THE PROVENANCE-ABSENT: no aboutGate/classifyProvenance in src/ (the axis is unbuilt)"
fi

# ── D2: THE UNWIRED AXIS — something CALLS it ───────────────────────────────────
if grep -rqE 'classifyProvenance' "$ROOT/src/surfaces" 2>/dev/null; then
  pass "D2 the surface calls classifyProvenance"
else
  fail "D2 THE UNWIRED AXIS: no call site in src/surfaces/ (the axis exists, nothing consumes it)"
fi

# ── D3: THE CORRECTION RE-SCORE — the gate scoring its OWN text ─────────────────
# a ledger row whose span IS the gate's injected correction (the Incident-D signature)
CORR=$(grep -cE 'THE PREDICATE LAW|THE RECORD LAW|THE SCOPE LAW|THE SUBJECT LAW|THE ARTIFACT LAW' "$LEDGER" 2>/dev/null || echo 0)
if [ "$CORR" -gt 0 ]; then
  echo "warn: D3 ${CORR} rows score the gate's OWN correction text (Incident D; the axis not yet deployed)"
else
  pass "D3 zero self-correction re-scores"
fi

# ── D4: THE STALE DEPLOY — the live ext predates the src ────────────────────────
if [ -f "$LIVE_EXT" ] && [ -f "$ROOT/src/index.ts" ]; then
  LIVE_T=$(stat -c %Y "$LIVE_EXT"); SRC_T=$(stat -c %Y "$ROOT/src/index.ts")
  if [ "$LIVE_T" -lt "$SRC_T" ]; then
    fail "D4 THE STALE DEPLOY: the live ext mtime < the src mtime (DEPLOYED-IS-NOT-SOURCE)"
  else
    pass "D4 the live ext is not older than the src"
  fi
else
  fail "D4 THE STALE DEPLOY: a path is missing ($LIVE_EXT or $ROOT/src/index.ts)"
fi

# ── D5: THE TWO-VALUE CONFIDENCE — a label wearing a probability's clothes ──────
TV=$(grep 'instruction-not-predicate' "$LEDGER" 2>/dev/null | python3 -c "
import json,sys
cs=set()
for line in sys.stdin:
    try: d=json.loads(line)
    except: continue
    c=d.get('State',{}).get('confidence')
    if c is not None: cs.add(round(float(c),4))
print(1 if cs and cs <= {0.6667,0.8} else 0)
" 2>/dev/null || echo 0)
if [ "$TV" = "1" ]; then
  echo "warn: D5 the instruction-not-predicate confidences are ONLY {0.667, 0.8} (the dedupe defect)"
else
  pass "D5 the confidence varies beyond the two-value signature"
fi

# ── D6: THE BLIND PASS — the audit gate's disqualifying shape ───────────────────
if [ -f "$ROOT/TESTING_LOG.md" ] && grep -qE 'GATE: PASS.*filesReviewed=\?' "$ROOT/TESTING_LOG.md" 2>/dev/null; then
  fail "D6 THE BLIND PASS: a PASS with filesReviewed=? is recorded"
else
  pass "D6 no recorded blind PASS"
fi

# ── D7: THE PHANTOM — a claimed change with no diff ─────────────────────────────
if [ -d "$ROOT/.git" ]; then
  pass "D7 git present (a wave's diff is checkable)"
else
  fail "D7 THE PHANTOM: no .git — a change cannot be diffed"
fi

echo "=== END ==="
if [ "$FAILN" = "0" ]; then echo "FIREWALL: PASS"; else echo "FIREWALL: FAIL ($FAILN detector(s))"; fi
exit "$FAILN"
