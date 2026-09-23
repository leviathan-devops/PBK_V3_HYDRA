# DECISION CHAIN — PBK v3 HYDRA

Append semantics. Every ruling lands verbatim with its context and rationale; prior rulings are
never edited.

## [D-101] THE UNIT IS THE WORKTREE, NOT THE FILE SET

```
CONTEXT   the operator's ruling: "your creation build packages [are] overhauled accordingly to
          be built by hydra workers. this will be the first live run of this architecture"
RULING    the build's unit coarsens from the wave (a disjoint file set, a subagent that dies)
          to the WORKER (one git worktree, a full lifecycle, persistence as an SME).
RATIONALE a wave's context dies with the agent; a worker's context persists, compacts, and
          reloads from its own spec + todos + pin. The scope boundary becomes git-enforced.
CONSEQUENCE the 13 deliverables were regrouped from 4 waves into 2 workers, and 2 real git
          worktrees were created BEFORE any spec was written.
```

## [D-102] THE SEAM IS FROZEN AND IS THE ONLY SHARED SURFACE

```
CONTEXT   two workers must build in parallel without file conflicts
RULING    SEAM/seam.ts (192 L, sha 66b66a7f10c7c6e7) is FROZEN. Both workers build against it;
          neither may edit it. There is NO edge between W1 and W2.
RATIONALE an interface that lands first lets consumers build against the CONTRACT rather than
          against an implementation that does not exist yet. The merge is the first time the
          halves meet.
CONSEQUENCE both worktrees carry a byte-identical copy of the seam; the merge gate checks its
          sha before allowing any merge.
```

## [D-103] THE WEIGHTS ARE THE SEAM'S, NOT INVENTED (a self-correction)

```
CONTEXT   the first draft of W1's spec said "descriptive +2, suggestive +3, substitute +3,
          use -3"
RULING    CORRECTED to the seam's verbatim values (seam.ts:71-77): descriptive neg+=1 ·
          suggestive pos+=2 (or +1 without \b) · substitute pos+=2 · use neg+=3 ·
          confidence = pos/(pos+neg+1)
RATIONALE the seam is the authority; a spec that contradicts it is a defect that would surface
          only at the merge. The correction was made before any code was written.
CONSEQUENCE W1's spec §W2/D3 now cites the seam's line numbers.
```

## [D-104] THE BAND FUNCTION IS abide's bandFor; THE EXTENSION'S bandOf IS AN OUTLIER

```
CONTEXT   three band vocabularies exist (seam, abide, the live extension)
RULING    W1 imports abide's bandFor (band.ts:48, -> act|flag|clear). W2 computes NO band at
          all. The live extension's bandOf (lib.ts:127, -> silent|gray|fire) is the outlier and
          is translated ONLY during migration, per the map in W2's spec §W11.
RATIONALE the contract (the seam) and the authority (abide) agree; the implementation diverges.
          Aligning to the authority is the only choice that keeps the seam meaningful.
CONSEQUENCE the migration map (fire->act, gray->flag, silent->clear) is written into W2's spec
          BEFORE the port, so it cannot be discovered mid-flight.
```

## [D-105] ANCHOR 1 IS LOCAL UNTIL A REMOTE IS EXPLICITLY AUTHORISED

```
CONTEXT   0 git remotes are configured; the architecture's Anchor 1 is "GitHub owns the deny"
RULING    the local equivalent is wired NOW (gates/merge-gate.sh with 6 predicates +
          .git/hooks/pre-push blocking a direct push to master). Creating a remote repository
          on the operator's GitHub account is an EXTERNAL SIDE EFFECT and is NOT taken without
          an explicit order.
RATIONALE the Hard-Dependency Law: when an action is blocked by an external dependency, report
          the blocker, list the options, and stop. Inferring authorisation from the architecture
          document is exactly what that law forbids.
CONSEQUENCE the gate is mechanical and observed failing (the negative control). The GitHub
          required-check half is OPEN, and named as open.
```

## [D-106] THE ORACLES STAY IN THE PLAN, NEVER IN THE DISPATCH PROMPTS

```
CONTEXT   the worker-plan carries 15 oracle rows (O1 pre-state facts, O2 post-state values,
          O3 trap oracles only a real execution produces)
RULING    the oracle rows live in .trident/worker-plan.md ONLY. A dispatch prompt that carries
          them would let the worker fit to the expected answer.
RATIONALE an oracle in the prompt converts a measurement into a target. The worker must be
          able to FAIL the oracle.
CONSEQUENCE the worker specs reference the oracle IDs (OR-n) without reproducing their values
          where the value would be fittable.
```

## [D-107] THE CANON'S TWO LOGS UPDATE AT THE MOMENT, NOT AT THE MILESTONE

```
CONTEXT   the canon-doc-update skill's fresh-capture rule
RULING    RUNNING_DEBUG_LOG and RUNNING_BUILD_LOG are written FIRST and MOST OFTEN — at the
          moment the work or the insight happens.
RATIONALE the insight is perishable; the milestone note is not.
CONSEQUENCE both logs were written BEFORE the milestone docs in this pass, each with 7 dated
          entries including the live firings and the disproven hypothesis.
```

## [D-108] THE A/B IS MANDATORY BEFORE ANY CAUSAL CLAIM

```
CONTEXT   `ui.loop-blocked` events appeared within seconds of the extension loading — a
          tempting causal story
RULING    no causal claim without an A/B. The census (8 pids blocked with ZERO fires) DISPROVED
          the story and it was recorded as a disproven hypothesis.
RATIONALE the plausible story and the true story BOTH quiet the symptom. The measurement is
          the only separator.
CONSEQUENCE the deep-host-testing artifact records DISPROVEN as a verdict class alongside
          VERIFIED and CONFIRMED-DEFECT.
```

## [D-109] THE PIN IS NOT EMITTED UNTIL THE PACKAGE EXISTS

```
CONTEXT   the operator's /create contract: "Mint the build package (DPL1 + wave-plan +
          blueprint) BEFORE the pin — the pin is void without it."
RULING    the worker topology IS the package: .trident/worker-plan.md + the 2 worker specs +
          the 2 pins + the 2 todo anchors + the merge gate. The pin references them.
RATIONALE a pin for a build with no package is void — it would ask an agent to build against a
          contract that does not exist on disk.
CONSEQUENCE the create-pin overhaul (re-minting both pins against the worker topology) is the
          one remaining package task; it is queued, not skipped.
```

## [D-110] THE DOC-DENSITY FLOORS APPLY TO THE CANON, AND THE MEASURE IS LINES + REFS

```
CONTEXT   the canon-doc-update skill's gate: 200+ lines per standard doc, 3+ file:line refs,
          SHA refs in the evidence docs
RULING    the floors are met by REAL content (the line anchors, the measured numbers, the
          verbatim commands), never by padding.
RATIONALE a doc that meets the line floor with restated prose is padding; a doc that meets it
          with anchors and commands is density. The distinction is whether a fresh agent can
          ACT from it.
CONSEQUENCE every doc in this set carries either file:line anchors, verbatim command output, or
          a reproduce-this-command block.
```

## [D-111] THE GATE'S OWN CORRECTION MUST NOT BE SCORED (a proposed fix, not applied)

```
CONTEXT   the extension delivers its correction via pi.sendUserMessage (index.ts:129); the
          correction text then re-enters as agent-visible content and is scored own_utterance
          (14 ledger rows at c=0.000)
RULING    the fix is a sentinel on injected text resolved by classifySource to `doc` — the SAME
          class the tool_result channel already solved (the comment at index.ts:184-190).
          IT IS NOT APPLIED IN THIS SESSION: it is a source edit to LIVE enforcement, and the
          host-testing law says a live change lands only after its own test round.
RATIONALE changing live enforcement without a test round is exactly the theatrical edit the
          laws ban. The defect is NAMED, the fix is DESIGNED, and the application is queued.
CONSEQUENCE the defect stands as an open finding with a named remedy and a named reason it is
          not yet closed.
```

## [D-112] A DISPROVEN HYPOTHESIS IS RECORDED AS EVIDENCE

```
CONTEXT   the ui.loop-blocked correlation hypothesis
RULING    it is recorded in the evidence set as DISPROVEN, with its control.
RATIONALE a disproven hypothesis is evidence about the INSTRUMENT (what a 3-second window makes
          look causal), and the next agent must not re-derive it.
CONSEQUENCE the deep-host-testing artifact carries DISPROVEN alongside VERIFIED and
          CONFIRMED-DEFECT as a first-class verdict class.
```

## [D-113] THE WORKER'S LAST ACT IS THE PR, NEVER THE MERGE

```
CONTEXT   the hydra-workers Anchor 1
RULING    W1-T11 and W2-T12 ("the PR merged via the gate") are IMMUTABLE rows that the WORKER
          CANNOT complete. The orchestrator merges.
RATIONALE a worker merging its own branch is the self-certification the architecture exists to
          prevent.
CONSEQUENCE the merge gate script is the orchestrator's instrument; the pre-push hook denies a
          direct master push from any branch.
```

## [D-114] THE CANON DOCS ARE WRITTEN BEFORE THE WORKERS ARE DISPATCHED

```
CONTEXT   the operator's three-part order: meta-observe, document the hot-reload method,
          then deep-host-test
RULING    the record precedes the dispatch. A worker dispatched into a stale canon reloads
          fiction.
RATIONALE the canon is the compaction-survival mechanism; if it lags the topology, a
          post-compaction agent rebuilds the wrong thing.
CONSEQUENCE this canon set (11 docs) was written immediately after the topology was committed
          and BEFORE any worker was dispatched.
```

## [D-115] THE META-OBSERVATION IS THE OPERATOR'S ORDER, NOT AN OPTIONAL EXTRA

```
CONTEXT   "meta observe how this is firing, /skill:canon-doc-update document the exact method
          you just used for hot reload, and then /skill:deep-host-testing test everything
          directly in the hot seat for real time latency on debugging and testing"
RULING    three deliverables, all mandatory: (1) the meta-observation artifact, (2) the canon
          doc recording the exact hot-reload method, (3) the deep-host-testing round in the hot
          seat with real-time latency measurement.
RATIONALE the scope is the operator's. A partial delivery (the observation without the canon,
          or the canon without the host test) is a FAILED delivery.
CONSEQUENCE all three are produced in this pass; the canon set carries the hot-reload method
          verbatim; the deep-host artifact carries the latency measurement.
```

## [D-116] THE HOT-RELOAD DISTINCTION: RULES IN-PROCESS, CODE WITH A NEW PROCESS

```
CONTEXT   the operator asked for "the exact method you just used for hot reload"
RULING    the method is TWO channels, measured, and they are not the same:
            A · RULES (.md) reload IN-PROCESS at the next session_start — reload() ->
                loadRules() -> readdirSync + readFileSync; disk is read every call.
                PROOF: pid 2458725 emitted FIVE load lines.
            B · CODE (.ts) needs a NEW PROCESS — the module is ESM-cached after import.
                PROOF: the 03:35-03:36 edits did not appear until pid 191645 started at 04:50:39.
RATIONALE the distinction is the whole answer: an operator who edits a RULE and expects it live
          mid-turn will be wrong; an operator who edits CODE and expects it live will also be
          wrong, for a different reason. Naming both channels is the deliverable.
CONSEQUENCE the load line (`[lexicon-gate] N rules loaded`) is documented as the ONLY proof of
          a reload — a reload is never assumed.
```

## [D-117] NO CLAIM OF LIVE ENFORCEMENT WITHOUT THE LEDGER ROW AND ITS ATTRIBUTION

```
CONTEXT   3 concurrent processes loaded the extension; 56 ledger rows accumulated
RULING    a "the gate fired" claim carries the rule id, the confidence, the source kind, the
          pid, and the boot timestamp.
RATIONALE the host runs multiple concurrent sessions, each with its own in-memory state, all
          appending one ledger. An unattributed row is fiction.
CONSEQUENCE the deep-host artifact attributes every fire; the residual rows from other pids are
          reported as residual, never mixed.
```

## [D-118] THE TWO LOGS PRECEDE THE MILESTONE DOCS (the fresh-capture rule)

```
CONTEXT   the canon-doc-update skill's STEP 2
RULING    RUNNING_DEBUG_LOG + RUNNING_BUILD_LOG are written FIRST in every canon pass.
RATIONALE the insight is perishable; the milestone note is not.
CONSEQUENCE both logs were written before CURRENT_STATE/BUILD_STATE/CHANGELOG in this pass.
```

## [D-119] THE VERDICT CLASSES FOR A HOST TEST ARE THREE, NOT TWO

```
CONTEXT   the ui.loop-blocked A/B and the live firings
RULING    the verdict vocabulary is VERIFIED · CONFIRMED-DEFECT · DISPROVEN — a disproven
          hypothesis is a first-class outcome, not a discard.
RATIONALE a two-class vocabulary (pass/fail) forces a disproven hypothesis into "fail", which
          mislabels the instrument rather than the hypothesis.
CONSEQUENCE the deep-host artifact uses all three; the ui.loop-blocked entry is DISPROVEN.
```
