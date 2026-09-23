# THE §A AUDIT CHECKLIST — READY TO EXECUTE WHEN W1/W2 RETURN

Extracted from `.trident/worker-plan.md` §A. The audit is COMPOSED AT PLAN TIME (before the
returns) so it can FAIL. Executing it after reading the returns would be fitting to the evidence.

## THE PROCEDURE (per returned worker)
```
1  THE STREAM GATE      the session stream must read `complete` AND the return must be intact
                        (no truncation). A truncated return = an INTERRUPTED agent -> KICK.
2  THE PHANTOM CHECK    "completed" + zero disk change = the agent wrote nothing. SHA the tree.
3  THE PER-HUNK         WHAT: verify each claimed hunk EXISTS on disk (grep the line, sha
                        before/after). WHY: does the reason hold against the spec? HOW: the
                        blast radius (who imports the changed surface).
4  THE VERDICT          CORRECT | FLAWED | FITTED-TO-GOLDEN | DOWNSTREAM-FABRICATION |
                        ARCHITECTURE-VIOLATION | SCOPE-CREEP
5  THE MECHANICAL RE-VERIFY   run tsc + the suite YOURSELF. The worker's exit codes are CLAIMS.
6  THE ADVERSARIAL SWEEP      the two MUTATION tests must go RED on wrong code.
```

## THE PRE-WRITTEN AUDIT (§A — per expected hunk; composed AT PLAN TIME)

```
W1 (THE ENGINE):
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| vendor/abide/* | abide's engine vendored verbatim | sha256sum each vs the source | OR-2 | _ |
| src/lexicon/schema.ts | check.type "lexicon" added | grep -c 'z.literal("lexicon")' | OR-8 | _ |
| src/lexicon/score.ts | the 4 weights, abide's band | grep -c 'bandFor' -> >= 1 | OR-8 | _ |
| src/lexicon/load.ts | a missing use: THROWS | bun test -t lexicon_load_throws | OR-8 | _ |
| src/engine/check.ts | the runner order | bun test -t runner_order | OR-8, OR-9 | _ |
| src/lint/runner.ts | abide's pattern EXECUTED | bun test -t lint_runner | OR-9 | _ |
| src/ledger/writer.ts | the row carries decidedBy | grep -c decidedBy | OR-15 | _ |
| src/index.ts | check(req) exported | grep -c 'export.*check' | OR-6 | _ |
| EVERY src file | NO host reference | grep -rc "ctx\|pi\." src/ | OR-6 | _ |

W2 (THE SURFACES):
| the expected hunk | the claim | the verify command | the oracle | the verdict |
| src/gate/source-kind.ts | classifySource + SCORABLE | bun test -t source_kind_gate | OR-10 | _ |
| src/gate/quote.ts | isQuotedMatch (the state machine) | bun test -t quote_state | OR-10 | _ |
| src/surfaces/prose.ts | message_update takes (event, ctx) | grep -c 'ctx.abort' | OR-11 | _ |
| src/surfaces/stream.ts | the delta accumulator | bun test -t delta_accumulator | OR-11 | _ |
| src/surfaces/stream.ts | the abort dedupe | bun test -t abort_dedupe | OR-11 | _ |
| src/surfaces/tool.ts | the material kind "doc" | grep -c '"doc"' | OR-12 | _ |
| src/action/dispatch.ts | the 4-row mapping | bun test -t action_map | OR-12, OR-13 | _ |
| src/index.ts | the 4 hooks registered | grep -c 'pi.on(' -> >= 4 | OR-7 | _ |
| EVERY src file | NO band computed | grep -rc "bandOf\|confidence" src/ | OR-7 | _ |
```



## THE EXECUTION COMMANDS (the mechanical re-verify — run these YOURSELF)
```bash
# W1
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-engine
bunx tsc --noEmit ; echo "tsc exit=$?"
bun test 2>&1 | tail -3
bun test -t lexicon_sweep 2>&1 | tail -3
bun test -t lint_runner 2>&1 | tail -3
bun test -t lexicon_load_throws 2>&1 | tail -3
grep -rc "ctx\|pi\." src/ 2>/dev/null | grep -v ':0' ; echo "purity hits above (EMPTY = pass)"
grep -c '"decidedBy"' .abide/events.jsonl 2>/dev/null
grep -c 'z.literal("lexicon")' vendor/abide/*.ts 2>/dev/null

# W2
cd /home/leviathan/JARVIS_WORKSPACE/OMP/PBK_V3_HYDRA/wt-surfaces
bunx tsc --noEmit ; echo "tsc exit=$?"
bun test 2>&1 | tail -3
bun test -t source_kind_gate 2>&1 | tail -3
bun test -t quote_state 2>&1 | tail -3
bun test -t abort_dispatch 2>&1 | tail -3
bun test -t abort_dedupe 2>&1 | tail -3
grep -c 'pi.on(' src/index.ts
grep -rc "bandOf\|confidence" src/ 2>/dev/null | grep -v ':0' ; echo "band hits above (EMPTY = pass)"
```

## THE MUTATION TESTS (the anti-theatrical core — a test that does not go RED proves nothing)
```
W1-S6  comment out the ledger append      -> the S6 test MUST go red
W1-S7  zero every weight                  -> the S3 test MUST go red
W2-S7  delete the dedupe Set              -> the S4 test MUST go red
W2-S8  SCORABLE = all kinds               -> the S1 test MUST go red
★ RECORD the red run's output. A mutation test that stays GREEN is a FAILED mutation test —
  it means the suite does not actually exercise the mechanism.
```

## THE COVERAGE MAP (every T-n <-> a worker; check the §A rows are all verdict-bearing)
```
T-1 the seam type-checks           <-> the seam (frozen)          <-> OR-1
T-2 the engine satisfies the seam  <-> W1/D7                      <-> OR-6, OR-14
T-3 the lexicon separates          <-> W1/D2, D3                  <-> OR-8
T-4 abide's lint half RUNS         <-> W1/D5                      <-> OR-3, OR-9
T-5 the engine touches no host     <-> W1/D7                      <-> OR-6
T-6 the surfaces compute no band   <-> W2/D7                      <-> OR-7
T-7 the streaming interrupt fires  <-> W2/D3, D4, D6              <-> OR-11, OR-12, OR-13
T-8 the merge is ONE import        <-> W3 (the orchestrator)      <-> OR-14
```

## THE GATE FOR ADVANCING (a wave ships ONLY with all of these)
```
[ ] the stream read `complete` AND the return intact
[ ] a disk diff exists (no phantom)
[ ] every §A hunk carries a verdict
[ ] 100% spec coverage (every T-n has a worker + a deliverable)
[ ] the mechanical re-verify ran (tsc + the suite, BY ME)
[ ] the adversarial sweep is clean (the mutation tests went RED, then GREEN after the fix)
[ ] zero open CRITICAL/HIGH findings
```
