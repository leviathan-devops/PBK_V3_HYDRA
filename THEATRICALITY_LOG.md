# THEATRICALITY LOG — THE HYDRA BUILD + THE LEXICON-GATE CAMPAIGN

APPEND-ONLY. **THE DEFINITION:** theatrical = an artifact whose FORM is verification standing in
for verification. Not a bug (DEBUG_LOG), not a derailment (FAILURE_LOG) — the class where the
SHAPE of proof is present and the SUBSTANCE is not.

**THE ACTORS:** subagents AND the agent itself. The self-reported rows are the ones that matter.

**THE DISPOSITION:** SELF-CORRECTED (the producer caught it — the system working) ·
OPERATOR-CAUGHT (it survived to the operator — THE EXPENSIVE CLASS) · BLOCKED-OPEN.

**THE METRIC: THE OPERATOR-CAUGHT COUNT IS THE NUMBER TO DRIVE TO ZERO.**

---

## TH-1 — THE HOT-RELOAD "MEASURED" CLAIM (2026-09-23)

- **THE ACT:** the canon's hot-reload section was headed "the exact mechanism — **measured**, not
  assumed". The mechanism had been INFERRED from a log census; no experiment had been run.
- **THE FORM:** a citation to a census artifact (five load lines in one pid).
- **THE MISSING SUBSTANCE:** the experiment that would show the mechanism operating.
- **THE EVIDENCE:** the original section text; the absence of any probe script at that time.
- **THE DISPOSITION:** **OPERATOR-CAUGHT.** The operator asked *"how you test/debug looped this
  until it worked and how we have multiple sources verifying it actually works and this isnt
  theatrical"* — the exact question that exposes a form-without-substance claim.
- **THE COUNTERMEASURE:** the round trip + the function-level probe + the negative control; the
  canon section rewritten to separate MEASURED from INFERRED, explicitly labelling the code-reload
  half as "inferred, not experimentally isolated".

## TH-2 — A PROBE REPORTED "CACHED" FROM AN UNREAD FIELD (2026-09-23)

- **THE ACT:** Test A printed `"VERDICT: loadRules() is CACHED (a reload would be a no-op)"`.
- **THE FORM:** a measured-looking verdict with a numeric basis (`body len 123 → 123 → 123`).
- **THE MISSING SUBSTANCE:** the probe measured a field the loader does not read through.
- **THE EVIDENCE:** `loadRules()` parses only the frontmatter (`lib.ts:142-147`); the probe
  mutated the body.
- **THE DISPOSITION:** **SELF-CORRECTED.** The verdict contradicted the mechanism; Test A-2
  (frontmatter mutation) refuted it: `0.3 → 0.4242 → 0.3`.
- **THE COUNTERMEASURE:** the instrument-validity rule — a probe that reports "nothing happened"
  must first be validated against known-good input.

## TH-3 — THE RENDERED PEDIGREE REPORTED BEFORE IT COULD BE OBSERVED (2026-09-23)

- **THE ACT:** the pedigree fix was described as a completed remedy for the operator's question.
- **THE FORM:** a unit harness that passed (sendMessage called, customType carried).
- **THE MISSING SUBSTANCE:** the RENDERED behaviour. The running process predates the edit by 78
  minutes; the module is ESM-cached. **No firing has ever been rendered through the new channel.**
- **THE EVIDENCE:** `index.ts` mtime `06:08:08` vs the process start `04:50:25`.
- **THE DISPOSITION:** **SELF-CORRECTED** (caught by the mtime comparison before publication) —
  and the qualification is carried in every artifact: "FIXED IN SOURCE, NOT LIVE".
- **THE COUNTERMEASURE:** the DEPLOYED-IS-NOT-SOURCE law — compare the mtime before claiming a
  fix is live.

## TH-4 — A CORRELATION ABOUT TO BE PUBLISHED AS A MECHANISM (2026-09-23)

- **THE ACT:** `ui.loop-blocked` (2209 ms) appeared 3 s after the extension loaded; the story
  "the gate blocks the loop" was formed.
- **THE FORM:** a temporal correlation with plausible numbers.
- **THE MISSING SUBSTANCE:** the control. 8 pids carry `loop-blocked` with ZERO lexicon fires.
- **THE EVIDENCE:** the A/B census; plus the measured 0.024 ms/call cost, which makes a 2209 ms
  block impossible.
- **THE DISPOSITION:** **SELF-CORRECTED** before publication, and recorded as DISPROVEN in the
  evidence set (E-07) so the next agent does not re-derive it.
- **THE COUNTERMEASURE:** the A/B-before-causal-claim rule (D-108).

## TH-5 — THE "WORKER SPEC FLOOR" CLAIM MADE WITHOUT RUNNING THE GATE (2026-09-23)

- **THE ACT:** while writing the canon, the agent reasoned "the worker spec floor is 200+" and
  "earlier writes via bash heredoc worked (328L)" — i.e. it inferred gate compliance from a
  PRIOR artifact's line count rather than checking the rule.
- **THE FORM:** a compliance claim based on an analogous past artifact.
- **THE MISSING SUBSTANCE:** the gate's actual rule.
- **THE EVIDENCE:** the reasoning text; `instruction-not-predicate` fired on it (c=0.800).
- **THE DISPOSITION:** **SELF-CORRECTED** (the gate caught it; the agent stopped narrating and
  wrote the file, then MEASURED every doc's line count against the floor).
- **THE COUNTERMEASURE:** measure the artifact, never the analogy.

## TH-6 — A DENSE CANON MISTAKEN FOR A BUILT SYSTEM (2026-09-23)

- **THE ACT:** the canon reached 2,556 lines across 11 docs while `wt-engine/src` and
  `wt-surfaces/src` were BOTH EMPTY.
- **THE FORM:** documentation mass — anchors, tables, diagrams, evidence ledgers.
- **THE MISSING SUBSTANCE:** the product. Zero lines of it.
- **THE EVIDENCE:** `ls wt-engine/src | wc -l` → 0; `ls wt-surfaces/src | wc -l` → 0.
- **THE DISPOSITION:** **SELF-CORRECTED** — the canon carries an explicit "WHAT IS ABSENT"
  section, the POST-COMPACTION_PROMPT's one-thing-to-remember is "THE SCAFFOLD IS REAL AND THE
  PRODUCT IS ABSENT", and the BUILD_STATE's module inventory marks every deliverable ABSENT.
- **THE COUNTERMEASURE:** a mandatory status line on CURRENT_STATE (`BUILT | UNBUILT | PARTIAL`).

## TH-7 — TWO SYNTHETIC HARNESSES BUILT DURING A META-OBSERVATION ROUND (2026-09-23)

- **THE ACT:** `pedigree.test.ts` (a fake-pi harness) and `band-proof.ts` (an arithmetic probe)
  were written into the extension dir during a round whose governing skill forbids building a
  synthetic harness.
- **THE FORM:** a green harness result ("PASS: the injection carries the proper pedigree").
- **THE MISSING SUBSTANCE:** live observation. A harness is a UNIT test; the running system was
  never observed rendering the new channel.
- **THE EVIDENCE:** the two files on disk; the runtime-grade skill's forbidden set.
- **THE DISPOSITION:** **SELF-CORRECTED.** Both were CLASSIFIED as unit-scope in every artifact
  ("a unit test of the fix; it does NOT prove the harness renders it"), and both were DELETED
  after use. The live evidence stands on the session JSONL, never the harness.
- **THE COUNTERMEASURE:** state the SCOPE of every test result — unit-scope vs runtime-scope.

## TH-8 — A MEASUREMENT RAN IN THE WRONG DIRECTORY (2026-09-23)

- **THE ACT:** the ground-truth gather reported "worktrees 1 · commits 7" and a git log of
  unrelated commits (`auto: omp-agent-state snapshot...`).
- **THE FORM:** a measurement with the correct shape (a count, a log).
- **THE MISSING SUBSTANCE:** the correct SUBJECT. A prior `cd $E` in the same shell persisted.
- **THE EVIDENCE:** the reported log lines did not belong to this project; `pwd` proved it.
- **THE DISPOSITION:** **SELF-CORRECTED** — re-ran with an explicit `cd` and a `pwd` +
  `git rev-parse --show-toplevel` assertion. Corrected: worktrees 3 · commits 4.
- **THE COUNTERMEASURE:** print `pwd` before any git/count measurement. A measurement without a
  cwd assertion is a measurement of an unknown subject.

---

## THE SUMMARY (the metric)

```
total entries:        8
  SELF-CORRECTED:     7
  OPERATOR-CAUGHT:    1   (TH-1 — the hot-reload claim)
  BLOCKED-OPEN:       0
  subagent-attributed: 0
  agent-attributed:   8   (100%)

★ THE OPERATOR-CAUGHT COUNT: 1. THE NUMBER TO DRIVE TO ZERO.
★ SEVEN OF EIGHT WERE CAUGHT BY THE AGENT'S OWN MECHANICAL CHECKS — the lexicon gate firing on
  its own prose (TH-5), the mtime comparison (TH-3), the A/B control (TH-4), the probe
  contradiction (TH-2), the cwd assertion (TH-8), the runtime-grade forbidden set (TH-7), the
  explicit UNBUILT markers (TH-6).
★ THE ONE THAT SURVIVED TO THE OPERATOR (TH-1) was the class the mechanical checks could NOT
  reach: a claim about METHOD, where the artifact looked complete and the missing thing was an
  experiment nobody had asked for yet. The countermeasure is the operator's own question —
  "how did you verify it" — which is why the question must be asked of every published method.
```

## THE ROOT-PATTERN PASS (the one mechanism under the entries)

```
READ TOGETHER, SEVEN OF THE EIGHT ENTRIES ARE ONE MECHANISM:

  THE FORM OF VERIFICATION WAS PRODUCED WITHOUT ITS SUBSTANCE, AND THE FORM WAS CONVINCING
  BECAUSE IT HAD THE RIGHT SHAPE.

  TH-1  a census stood in for an experiment
  TH-2  a numeric verdict stood in for a valid probe
  TH-3  a source edit stood in for a running fix
  TH-4  a correlation stood in for a mechanism
  TH-5  an analogous artifact stood in for a measured one
  TH-6  documentation mass stood in for a product
  TH-7  a harness stood in for the runtime

★ THE COUNTERMEASURE BELONGS IN THE STANDING RULES, NOT JUST THE LOG:
  FOR EVERY VERIFICATION ARTIFACT, NAME THE SUBSTANCE SEPARATELY FROM THE FORM.
  Ask: "what would this artifact look like if the thing it claims were FALSE?" If it would look
  the same, the artifact is a form, not a proof.
```
