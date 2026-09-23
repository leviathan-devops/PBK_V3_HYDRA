# DEBUG LOG — THE HYDRA BUILD + THE LEXICON-GATE CAMPAIGN

APPEND-ONLY. Every entry: the finding, the root cause, the mechanism, the fix, the verification,
the lesson. A bug fixed without an entry is an un-learned lesson.

---

## EN-1 — THE HOT-RELOAD CLAIM WAS INFERRED, NOT EXPERIMENTED (2026-09-23)

- **THE FINDING:** the canon's first hot-reload section claimed the mechanism was "measured" when
  it had been INFERRED from a log census. The operator's question — "how did you test/debug loop
  this until it worked" — exposed that no experiment had been run.
- **THE ROOT CAUSE (the 5-why):** (1) the census showed load lines in one live pid, strong enough
  to write down; (2) the claim was TRUE, and a true claim reads as a verified one; (3) the truth of
  a conclusion and the validity of its method are independent; (4) the canon feeds a
  compaction-survival kit, so a claim recorded as "measured" tells the next agent to trust a method
  that was never run; (5) `instruction-not-predicate` fired the moment the hedge was written — the rule was right.
- **THE FIX:** RAN THE EXPERIMENT. Three tests: (A) the function-level probe, (A-2) the corrected
  probe, (B) the end-to-end round trip.
- **THE VERIFICATION:** the round trip, one pid, no restart:
  `04:50:39.844 pid 191645 9 rules loaded` → plant a probe → `05:54:39.829 pid 191645 10 rules
  loaded` → delete the probe → `05:55:24.605 pid 191645 9 rules loaded`. **9 → 10 → 9.**
- **THE LESSON:** an inference recorded as a measurement is the exact theatrical class. The fix is
  not a better inference — it is the experiment.

## EN-2 — TEST A GAVE A FALSE NEGATIVE (the instrument-validity lesson) (2026-09-23)

- **THE FINDING:** Test A appended a marker to a rule's BODY and re-ran `loadRules()` in the same
  process. Result: `body len = 123` before, 123 after, 123 restored. It printed **"CACHED"**.
- **THE ROOT CAUSE:** the probe measured a property the loader does not read through.
  `loadRules()` parses only the YAML **frontmatter** (`lib.ts:142-147`); everything after the
  closing `---` is the `body` field. Appending to the body changed a region the measured accessor
  does not re-derive.
- **THE FIX:** Test A-2 mutated the FRONTMATTER (`threshold: 0.3` → `0.4242`) →
  `0.3 → 0.4242 → 0.3`. The in-process re-read saw BOTH the mutation and the restore.
- **THE VERIFICATION:** Test A `[1] 123 · [2] 123 · [3] 123 → NO`; Test A-2 `0.3 → 0.4242 → 0.3
  → YES`.
- **THE LESSON:** **a probe that reports "nothing happened" must first be validated against
  known-good input.** Test A's NULL was indistinguishable from a working loader over an unread
  field. A filter that matches nothing and a filter that is broken are the same observation.

## EN-3 — THE 3-LOADS-IN-8ms ANOMALY (the origin of the investigation) (2026-09-23)

- **THE FINDING:** pid 2458725 emitted FIVE load lines, THREE within 8 ms
  (04:13:04.657/.662/.665). A `session_start` firing three times in one second is not a user
  restarting sessions.
- **THE ROOT CAUSE:** at 04:13:02 the same pid logged
  `runSubagent: reusing parent modelRegistry` ×3. **A SUBAGENT constructs a session in the PARENT
  process → `session_start` fires → `reload()` runs.**
- **THE FIX:** none — the behaviour is correct. The understanding was the deliverable.
- **THE VERIFICATION:** the same-pid correlation; then the round trip (EN-1) confirmed it.
- **THE LESSON:** the anomaly that "looks like a bug" was the mechanism's signature. Three loads in
  8 ms is a fingerprint, and it named the trigger.

## EN-4 — THE DELIVERY CHANNEL IMPERSONATED THE OPERATOR (2026-09-23)

- **THE FINDING:** the operator pasted a rendered firing and asked: *"is it possible to have these
  gates appear with the proper system message pedigree instead of being a user message?"*
- **THE ROOT CAUSE:** `pi.sendUserMessage` is documented verbatim as sending *"an actual user
  message that appears as if typed by the user."* The channel was chosen for its `deliverAs:
  "steer"` semantics; its PROVENANCE was never evaluated. A lexicon gate was speaking as the
  principal it serves.
- **THE FIX:** `index.ts:129` → `pi.sendMessage({customType: "ttsr-injection", content, display:
  true}, {deliverAs: "steer"})`, plus a new `pi.on("input")` hook routing
  `event.source === "extension"`.
- **THE VERIFICATION:** the unit harness (a fake `pi`): `sendMessage` called, `sendUserMessage` NOT
  called, `customType "ttsr-injection"` carried, `ctx.abort()` fired. ★ **NOT LIVE** — the running
  process (started 04:50:25) predates the edit (mtime 06:08:08) by 78 minutes; the module is
  ESM-cached.
- **THE LESSON:** an API selected for delivery semantics with no provenance evaluation is an
  authority-spoof waiting to happen. Check WHO the message claims to be.

## EN-5 — THE GATE SCORED ITS OWN INJECTED CORRECTION (2026-09-23)

- **THE FINDING:** 14 ledger rows at `confidence 0.000` whose `Evidence.span` IS the gate's own
  injected correction text.
- **THE ROOT CAUSE:** the correction re-enters the conversation as agent-visible content; on the
  next `message_update` it is scored with the DEFAULT `source_kind` (`own_utterance`). Because it
  quotes the rule's own trigger words, the exemptor drives it to 0.000.
- **THE FIX:** the same edit as EN-4 (the `customType` channel removes the text from the utterance
  path).
- **THE VERIFICATION:** the 14 rows counted by a python census over the ledger.
- **THE LESSON:** **when a system fixes a defect class at ONE channel, SWEEP THE SIBLING
  CHANNELS.** The `tool_result` fix (`index.ts:184-190`) solved this exact class and missed the
  delivery channel — the same class, a different door. This is the single highest-value finding of
  the campaign.

## EN-6 — THE EXEMPTOR MISSES INFLECTIONS (2026-09-23)

- **THE FINDING:** the probe: `"let me be careful: the check exits 1 on a violation"` → `pos=4 neg=0
  c=0.800 FIRE`. The word "exits" is present; the exemptor did not fire.
- **THE ROOT CAUSE:** the `use:` member is `\bexit\b`, which does NOT match "exits" — the
  trailing `\b` requires a non-word character. `lib.ts:64 compileLexiconPattern` compiles the bank
  as written: no stemmer, no inflection expansion.
- **THE FIX (PROPOSED, W3):** add the inflections explicitly, or normalize the `use:` bank at load
  (`(s|ed|ing)?` on every member).
- **THE VERIFICATION:** the probe output; plus the STRUCTURAL CEILING: even a PERFECT exemptor
  match (neg=3) against a double match (pos=4) gives `4/8 = 0.500` = GRAY. The exemptor cannot
  clear a double-positive.
- **THE LESSON:** an exemption contract that is not stated is not a contract. The rules' `use:`
  banks carry base forms; the loader treats them as exact.

## EN-7 — THE DOUBLE-MATCH MADE CONFIDENCE A TWO-VALUE SIGNAL (2026-09-23)

- **THE FINDING:** the live record: confidence `0.667 ×17` and `0.800 ×7`, and NOTHING between.
- **THE ROOT CAUSE:** two suggestive members share a tail —
  `suggestive[0] = \b(...|let me) (just )?(...|be careful|...)\b` and
  `suggestive[2] = \b(be (more )?be careful|...)\b`. `scoreSignals` does not deduplicate overlapping
  matches, so "let me be careful" scores pos 4 (0.800) and "be careful" scores pos 2 (0.667).
- **THE FIX (PROPOSED, W4):** deduplicate overlapping suggestive matches, or restructure the banks
  so no two members share a tail.
- **THE VERIFICATION:** the probe reproduced both values exactly from the two input shapes.
- **THE LESSON:** a "probability" that can only take two values is a LABEL wearing a probability's
  clothes. A confidence that does not vary with the input's severity is not a confidence.

## EN-8 — THE MERGE GATE'S `bun test` FAILS ON AN EMPTY TREE (2026-09-23)

- **THE FINDING:** `gates/merge-gate.sh worker/engine wt-engine` → `bun test FAIL` while every
  other check PASSED.
- **THE ROOT CAUSE:** the worktree has no test files; Bun's runner exits 1 on zero discovered
  tests. The signal is REAL — a branch with no tests has no verifiable behaviour.
- **THE FIX:** none — this is the DESIRED behaviour and it is the gate's negative control. A
  refinement: the gate should print the failing command's own output, not just `FAIL`.
- **THE VERIFICATION:** `tsc PASS · bun test FAIL · no-host-ref PASS · no-band PASS · seam PASS ·
  branch PASS → GATE: FAIL — DO NOT MERGE`.
- **THE LESSON:** **the first run of any gate should be against a state that must fail it.** A gate
  never observed failing is untested.

## EN-9 — A SPEC DRAFT CONTRADICTED ITS OWN FROZEN CONTRACT (2026-09-23)

- **THE FINDING:** W1's worker-spec draft said `descriptive +2, suggestive +3, substitute +3, use
  -3`.
- **THE ROOT CAUSE:** the draft was written from memory of the earlier package rather than read
  from `SEAM/seam.ts:71-77`, which says `descriptive neg+=1 · suggestive pos+=2 (or +1 without
  \b) · substitute pos+=2 · use neg+=3`.
- **THE FIX:** corrected to the seam's verbatim values with its line numbers.
- **THE VERIFICATION:** `grep -n` on the seam; the spec now cites `seam.ts:71-77`.
- **THE LESSON:** a spec that contradicts its contract surfaces only at the merge. Read the
  CONTRACT, never the memory of it.

## EN-10 — THE PREDICATE SCRIPTS FAIL WITH A USAGE MESSAGE (2026-09-23)

- **THE FINDING:** `FAIL: usage: check.sh <worker-plan.md> (file not found: '')` and
  `FAIL: G1 no worker-plan.md under .`
- **THE ROOT CAUSE:** the check scripts take positional arguments; `hydra-workers` discovers
  `.trident/worker-plan.md` RELATIVE TO CWD. Run with no argument and from the wrong directory they
  fail correctly.
- **THE FIX:** run with the file path, and from the project root for `hydra-workers`.
- **THE VERIFICATION:** all four then report PASS with exit 0.
- **THE LESSON:** a predicate that fails with a USAGE message is not a failed predicate — it is a
  mis-invoked one. `usage:` means the ARGS are wrong, not the artifact.

## EN-11 — THE `hydra-workers` PREDICATE NAMED THE EXACT MISSING STEP (2026-09-23)

- **THE FINDING:** `FAIL: G5 no worker spec in .../wt-engine (L1 not done)` and `G6 no goal pin
  (WORKER_GOAL.md) ... (L2 not done)`.
- **THE ROOT CAUSE:** the topology was genuinely incomplete — the worktrees existed; the spec (L1)
  and the pin (L2) did not.
- **THE FIX:** authored `WORKER_SPEC.md` (333 L) + `WORKER_GOAL.md` (57 L) in `wt-engine`, and the
  pair in `wt-surfaces`. The predicate then reported PASS.
- **THE VERIFICATION:** `PASS: worker topology verified`, exit 0.
- **THE LESSON:** this is what a mechanical predicate is FOR — it names the missing lifecycle step
  rather than saying "incomplete". A prose status could not have said WHICH of the eight columns
  was missing.

## EN-12 — A MEASUREMENT RAN IN THE WRONG DIRECTORY (2026-09-23)

- **THE FINDING:** a ground-truth gather reported "worktrees 1 · commits 7" and a git log of
  unrelated commits (`fix(rules): pull theatrical-claim...`, `auto: omp-agent-state snapshot...`).
- **THE ROOT CAUSE:** a prior command in the same shell did `cd $E` (the extension dir). The `cd`
  PERSISTED; the subsequent `git worktree list` ran in the EXTENSION's repo, not the project's.
- **THE FIX:** re-ran with an explicit `cd $W` and verified with `pwd` + `git rev-parse
  --show-toplevel`. Corrected: worktrees 3 · commits 4.
- **THE VERIFICATION:** the cwd check printed both values before the measurements.
- **THE LESSON:** **a `cd` persists across commands in one shell.** A measurement without a cwd
  assertion is a measurement of an unknown subject. Print `pwd` before any git/count measurement.
