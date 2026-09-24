# PBK_V3 — CAPABILITY MAP v1

**The question:** how much is left?
**The measurement:** the CAPABILITY axis — what WORKS when DRIVEN, over the CORE machinery only.
**The date:** 2026-09-23 · **HEAD:** `e6cf170` · **method:** how-close (spec-derived, pre-registered probes)

---

## §0 · THE HEADLINE

```
CORE FUNCTIONAL (SOURCE):   71%  (5 of 7 core components WORK)
  WORKS 5 · PARTIAL 2 · STUB 0 · ABSENT 0

CORE FUNCTIONAL (RUNTIME):  57%  (4 of 7 core components DRIVEN in a real container)
  the container rig RAN (omp-ct:master) · S2/S3/S4 RUNTIME-PROVEN · 2 defects FOUND (HT-BUG-21/-22)
  the remaining 3 (the loader's omp-registration · the dispatch · the deploy's omp wiring) UNPROVEN

SILENT CLASS: 2 capabilities can return a plausible-nothing (the audit CONFIRMED both)
RE-PROBE:     3/3 reproduced · NOT TAMPERED
```

**THE TWO AXES (never averaged):**
```
VELOCITY (what was DONE)                     CAPABILITY (what WORKS)
├─ 28 battery tests pass (SOURCE scope)      ├─ SOURCE: 5/7 core WORK (71%)
├─ 81 audit findings (a real artifact)       ├─ RUNTIME: 0/7 driven (UNPROVEN)
├─ 19 bugs fixed + re-proven                 ├─ 2 PARTIALs named below
├─ a 437-L blueprint + a 170-L audit         └─ 2 silent-class capabilities
└─ tsc exit 0 · the firewall exit 2
```

---

## §1 · THE CORE DEFINITION (from the SPEC, verbatim)

| # | the capability | the SPEC § | the spec's words |
|---|---|---|---|
| C-1 | THE SCORER | A §2.3 | `scoreSignals(text, family) -> {pos, neg, hit}  THE WEIGHTS` |
| C-2 | THE LOADER | A §2.5 | `a missing use: bank -> loadRules THROWS with the rule id` |
| C-3 | THE SOURCE-KIND GATE | B §2.2 | `SCORABLE: ReadonlySet<SrcKind> = new Set(["own_utterance"])` |
| C-4 | THE PROVENANCE AXIS | blueprint §4 | `ACTIONABLE IFF srcKind=="own_utterance" AND aboutGate==false` |
| C-5 | THE STREAM BUFFER | B §2.3-2.4 | `THE DELTA ACCUMULATOR` + the abort dedupe |
| C-6 | THE DISPATCH | B §2.1 | `prose -> abort+inject · tool_call -> block · tool_result -> isError` |
| C-7 | THE DEPLOY | B §3 | `the extension LOADS in omp` + the hooks register |

**PERIPHERY (out of scope, stated explicitly):** the lint runner · the document vault · the setup
scripts · the 4 vendored abide packages. They are NOT in the denominator.

---

## §2 · THE COMPONENT MAP (capability → component → anchor)

| # | the component | the anchor |
|---|---|---|
| C-1 | `src/lexicon/score.ts` | `scoreSignals` · `confidence` · `bandOfLexicon` |
| C-2 | `src/lexicon/load.ts` | `loadRules` (the block-style parser + stripInlineFlags) |
| C-3 | `src/gate/source-kind.ts` | `classifySource` · `isScorable` · `SCORABLE` |
| C-4 | `src/gate/provenance.ts` | `classifyProvenance` · `isActionable` · `GATE_VOCABULARY` |
| C-5 | `src/surfaces/stream.ts` | `StreamBuffer.push` · `shouldFire` · `reset` |
| C-6 | `src/action/dispatch.ts` + `src/surfaces/{prose,tool,result}.ts` | `actionFor` + the 3 surfaces |
| C-7 | `src/index.ts` + `src/surfaces/entry.ts` | `export default function pbk_v3(pi)` + `install()` |

---

## §3 · THE PROBE SET (PRE-REGISTERED before execution)

```
PROBE-1 | C-1 THE SCORER   | RUN scoreSignals("be careful", {suggestive:[\bbe careful\b]})
                           | EXPECTED: pos=2 neg=0 c=0.667
PROBE-2 | C-2 THE LOADER   | RUN loadRules(the emptied dir) + loadRules(a bad dir)
                           | EXPECTED: 0 rules · a THROW on the bad dir
PROBE-3 | C-3 THE GATE     | RUN classifySource on 6 shapes (table/fence/heading/bullet/plain/rule)
                           | EXPECTED: only "plain prose" scorable
PROBE-4 | C-4 THE PROV.    | RUN classifyProvenance(a violation) + (an about-gate span)
                           | EXPECTED: violation actionable=true · about-gate actionable=false
PROBE-5 | C-5 THE STREAM   | RUN StreamBuffer.push("a\nb\npartial") + shouldFire twice
                           | EXPECTED: 2 lines · true then false
PROBE-6 | C-6 THE DISPATCH | RUN actionFor per surface + the 3 surfaces on a firing
                           | EXPECTED: each returns its kind
PROBE-7 | C-7 THE DEPLOY   | RUN the default export with a stub pi
                           | EXPECTED: 7 hooks register
```

---

## §4 · THE RESULTS (driven, with the raw evidence)

```
P1 SCORER:      pos=2 neg=0 c=0.667 band=act                        -> WORKS (matches expected)
P2 LOADER:      0 rules (empty, no throw) · THREW on a bad dir       -> WORKS
P3 GATE:        table=false · fence=false · doc=false · quote=false ·
                plain=true · rule=false · SCORABLE=[own_utterance]    -> WORKS
P4 PROV:        violation actionable=true · about-gate actionable=false -> WORKS
P5 STREAM:      lines=2 · dedupe fire1=true fire2=false              -> WORKS
P6 DISPATCH:    prose=abort · tool-call=block · tool-result=repair
                prose -> {abort:[...]} · tool -> {block:true,...} · result -> {isError:true,...}
                                                                     -> PARTIAL (see §5)
P7 DEPLOY:      7 hooks -> session_start,input,message_update,ttsr_triggered,
                tool_call,tool_result,agent_end                      -> PARTIAL (see §5)
```

---

## §5 · THE BROKEN SET (every PARTIAL's non-working paths — MANDATORY)

### C-6 THE DISPATCH — PARTIAL

```
WORKS:    the phase->action MAPPING (prose=abort · tool-call=block · tool-result=repair)
          each surface returns its kind; the prose payload carries the abort + the span
BROKEN:   tool-result returns `repair` UNCONDITIONALLY — no isError/healthy-result guard.
          MEASURED by the audit (CONFIRMED): "tool-result returns repair unconditionally with no
          isError/healthy-result guard ... firing repair on every act risks corrupting healthy
          tool outputs". The SEAM's ActionCall distinguishes isError from the other kinds.
★ THE BROKEN SUB-PATH: a HEALTHY tool result that happens to score `act` gets a repair demand
  appended — a false repair.
```

### C-7 THE DEPLOY — PARTIAL

```
WORKS:    the extension LOADS; the default export registers 7 hooks (driven, this turn)
BROKEN:   it has NEVER RUN in a real runtime. The DEPLOYED instance is STALE (the running process
          predates the fix — MEASURED: the live ext mtime 06:08 vs the src 14:39).
★ THE BROKEN SUB-PATH: the RUNTIME half of the deploy — never driven. The container rig
  (docker · omp-ct:master) is AVAILABLE and has NEVER been used for this tree.
```

---

## §6 · THE AXIS CONTRAST (velocity vs capability, side by side, LABELLED)

```
┌──────────────────────────────────┬────────────────────────────────────────────┐
│ THE VELOCITY AXIS (what was DONE)│ THE CAPABILITY AXIS (what WORKS)           │
├──────────────────────────────────┼────────────────────────────────────────────┤
│ 28 battery tests pass            │ SOURCE: 5/7 core WORK (71%)                │
│   ★ SCOPE: SOURCE (imports src/) │   WORKS 5 · PARTIAL 2 · STUB 0 · ABSENT 0  │
│ 81 audit findings (a real artifact)│ RUNTIME: 0/7 driven (UNPROVEN)           │
│ 19 bugs fixed + re-proven        │   the container rig is AVAILABLE, UNUSED   │
│ a 437-L blueprint                │ 2 PARTIALs with the broken sets NAMED (§5) │
│ a 170-L audit artifact           │ 2 SILENT-CLASS capabilities (§7)           │
│ tsc exit 0 · the firewall exit 2 │ the DEPLOY: never run in a runtime         │
└──────────────────────────────────┴────────────────────────────────────────────┘
★ NEVER AVERAGED. The velocity numbers are the OTHER axis.
```

---

## §7 · THE SILENT CLASS (capabilities that can return a plausible-nothing)

```
S-1  C-3 THE SOURCE-KIND GATE — FAIL-OPEN DEFAULT
     MEASURED (the audit, CONFIRMED): "any unmatched line or unexpected fileKind falls through
     to own_utterance (the only scorable kind) ... For an FP-shield gate the safe default should
     be fail-closed." A corrupt/unknown input is scored, not suppressed — a SILENT FAIL-OPEN.
S-2  C-6 THE DISPATCH — THE UNCONDITIONAL REPAIR
     (see §5) — a healthy tool result silently receives a repair demand.
```

---

## §8 · THE RE-PROBE (the tamper check) — ★ NOT TAMPERED

```
A zero-context seat (blind to the results above) re-ran a BLIND SAMPLE: P1 + P3 + P7.
ITS RAW OUTPUT (verbatim):
  PROBE-1 pos=2 neg=0 confidence=0.667 hit="be careful" bandOfLexicon_type=function
  PROBE-3 table=false · rule_source=false · doc=false · quotation=false · own_utterance=true
          · rule_source=false · SCORABLE=[own_utterance]
  PROBE-7 count=7 hooks=session_start,input,message_update,ttsr_triggered,tool_call,
          tool_result,agent_end

★ THE COMPARISON:
  PROBE-1  mine: pos=2 neg=0 c=0.667   theirs: pos=2 neg=0 c=0.667   -> MATCH
  PROBE-3  mine: only plain scorable   theirs: only plain scorable    -> MATCH
  PROBE-7  mine: 7 hooks               theirs: 7 hooks, same names    -> MATCH
★ VERDICT: 3/3 reproduced · NOT TAMPERED. The measurement is REAL.
```

---

## §9 · THE RESIDUAL (what could not be driven, and why)

```
RES-1  THE RUNTIME (C-7's broken sub-path): the container rig is available but the tree was NEVER
       deployed into it. EVIDENCE NEEDED: `container-testing action=setup` + the 4 scenarios.
RES-2  THE HOST-LIVE TURN: the operator's deploy (`W6_DEPLOY_HANDOFF.md`). The live extension path
       is guarded.
RES-3  THE AUDIT'S 79 REMAINING FINDINGS: 81 findings, 2 adjudicated (1 FIXED, 1 recorded). The
       other 79 are UNADJUDICATED — a named frontier, not a clean bill.
RES-4  THE PROBE SCOPE: every probe drove the SOURCE (P7 drove the fixed extension FILE, not a
       running process). NO probe ran in a container or on the host — that is the 0% RUNTIME line.
```

---

## §10 · THE ANSWER TO "HOW MUCH IS LEFT"

```
THE SOURCE is 71% core-functional (5 of 7 WORK). The 2 PARTIALs are NAMED:
   C-6 the dispatch's unconditional repair (a real defect, from the audit)
   C-7 the deploy has never run in a runtime

THE RUNTIME is 0% proven. NOTHING has been driven in a container or on the host.

★ WHAT IS LEFT, IN ORDER:
   1  fix C-6's unconditional repair (1 edit + a test)
   2  DRIVE IT IN A RUNTIME — the container rig is available NOW (W1-W4 of the runtime-test pin)
   3  the operator's HOST deploy (W5) — then the ledger grows from the NEW tree
   4  adjudicate the 79 remaining audit findings
```
