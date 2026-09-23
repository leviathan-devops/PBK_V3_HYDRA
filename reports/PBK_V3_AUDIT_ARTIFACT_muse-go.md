# THE AUDIT GATE ARTIFACT — the muse-go scan (2026-09-23T17:45)

**THE LANE:** `muse-go` (`ocr config set provider muse-go`) — the operator's pin.
**THE SESSION:** `de614140-3f47-4903-9faf-77e33009b58d.jsonl`
**THE SCAN:** `ocr scan --path src --concurrency 1`
**THE VERDICT:** `AUDIT GATE: FAIL` — **81 findings** across 16 files.

```
the scan:      71 llm_requests · 71 llm_responses · 0 llm_errors · 38 tool_calls
the scope:     src/ (16 files) — the TREE's source
the by-category: {"bug": 59, "maintainability": 14, "performance": 4, "security": 4}
★ HT-BUG-19 (the protocol fix) is what made this run possible: before it, 6/6 calls 503'd.
```

## THE FINDINGS (81)

### src/action/dispatch.ts

- **[BUG]** tool-result returns `repair` unconditionally with no `isError`/healthy-result guard. Header itself says tool-result is `isError + the repair demand`, and `SEAM/seam.ts:ActionCall` distinguishes `isError` from other kinds, so firing repair on every `act` risks corrupting healthy tool outputs. `actionFor` needs the error/phase input (e.g. `(surface, band, opts:{isError:boolean})`) and should return `none`/`record` when `!isError`, or document why the caller is responsible for that filter.
- **[BUG]** Unvalidated `Band` collapses to `none`: any runtime value other than `act`/`flag` (typo, corrupt JSON, future band, null/undefined from JS caller) silently becomes `none`, while unknown `surface` throws. This asymmetry hides corruption. Validate explicitly — `clear -> none`, anything else throws — instead of `band === "flag" ? "record" : "none"`.
- **[MAINTAINABILITY]** Signature/doc drift + vocabulary drift: header promises `map (surface, phase, decidedBy, band)` but `actionFor(surface, band)` drops `phase`/`decidedBy`, and local `ActionKind="abort"|"block"|"repair"|...` does not match `SEAM/seam.ts:ActionCall["kind"]="abort+inject"|"block"|"isError"|...`. A wrong row is the wrong instrument — either thread the missing inputs through or fix the header, and map/document how `repair` becomes `isError` vs `notice`/`block`.
- **[MAINTAINABILITY]** Weak coverage guarantee: `SURFACES` is a mutable `Surface[]` and `actionMatrix()` returns `Record<string,...>`. A caller can `SURFACES.push/pop` and silently break the “prove coverage” claim, and `Record<string,...>` loses exhaustiveness vs `Record<Surface,...>`. Make it `readonly`/`as const` and key the matrix by `Surface`.
- **[MAINTAINABILITY]** Duplicate branch + weak matrix value typing: `tool-result`/`post-tool-use` both `return "repair"` should share one case, and `Record<string, Record<Band, ActionKind>>` should be `Record<Surface, Record<Band, ActionKind>>` so adding a `Surface` breaks compilation instead of silently missing from the matrix.

### src/engine/check.ts

- **[BUG]** Missing ACTIVE filter: header promises iteration over ACTIVE rules, but loop only checks `inScope`. Disabled/weak/noisy rules (when supplied) will still score and can produce `act` decisions. Add a status guard in this file (e.g. skip when `(rule as {status?: string}).status` is present and !== 'active') or explicitly filter upstream and update the header if filtering is caller's job.
- **[BUG]** Judge context dropped: `judge()` returns `{probability, reason?}` but `v.reason` is discarded, and the `jev:null` / `jev failed` reasons go only to the `errors[]` array. The fallback `Decision` row is indistinguishable from a pure-lexicon row despite the header claiming the row records `jev:null + reason`. Callers inspecting only `decisions` lose the diagnostic.
- **[BUG]** `confidence`/`bandOfLexicon` outside try breaks never-throws: only `scoreSignals` is protected. A malformed rule (missing/inverted `rule.band`, NaN thresholds) throws in `bandOfLexicon` and aborts the whole loop, rejecting `run()` contrary to the documented guarantee. Extend the try to cover scoring+banding or validate `rule.band` per rule and route failures to `errors`.
- **[BUG]** Unprotected ledger calls break never-throws: `toDecision` and `deps.onDecision` are invoked outside any try/catch on all three paths (clear / flag-fallback / act). A throw from user-supplied `onDecision` (ledger I/O) or from `toDecision` (e.g. undefined `span`/`correction`) aborts the loop and rejects `run()`. Wrap each per-rule `toDecision`+`onDecision` in try/catch and surface as `errors` to honor the guarantee.
- **[PERFORMANCE]** Sequential `await deps.judge` in `for-of` serializes all gray-zone judge calls. Independent flag-band hits could be judged concurrently with `Promise.all` while preserving order for `decisions`/`onDecision`. Keep sequential only if judge is rate-limited or order-sensitive — otherwise collect flag candidates first, then settle in parallel.
- **[MAINTAINABILITY]** Duplicate lexicon-decision construction on three paths (clear, flag-fallback, act) with identical `toDecision({... decidedBy: "lexicon" ...})` + push + `onDecision`. Extract a local helper (e.g. `emitLexiconDecision(rule, band, prob, hit)`) to avoid drift when Decision fields change.
- **[BUG]** Missing input validation / null checks: `deps.rules` is dereferenced without a guard (`for...of` throws if undefined), `req.text` is passed straight to `scoreSignals` (RegExp.exec coerces undefined/null to the string "undefined"/"null" instead of failing loud), and `jevCalls` is incremented before `await` so failed judge attempts count as calls. Default `deps.rules ?? []`, validate `typeof req.text === 'string'`, and increment `jevCalls` only on settled/successful judge per the CheckResult cost-metric contract.

### src/gate/provenance.ts

- **[SECURITY]** Provenance-evasion bypass: a single generic substring match forces non-actionable. An attacker (or coincidental text) can append e.g. `the rule` / `the gate` / `the ledger` to a genuinely violating `own_utterance` span and `classifyProvenance` will rewrite it to `rule_source`, suppressing abort. This is fail-open. Require stronger signal (e.g. higher threshold, quoted rule-id / law-name only, word-boundary + length-weighted match) or make generic phrases non-suppressing on their own.
- **[BUG]** Substring matching precision: case-sensitive `String.includes` without word boundaries causes both false positives (generic `the gate`/`the rule`/`lexicon` fire on ordinary prose) and false negatives (case variants like `The Gate`, `PREDICATE law`, `ScoreSignals` missed). Overlapping entries (`lexicon-gate` contains `lexicon`) double-count `gateRefCount`/`gateRefs`. Use a single case-insensitive word-boundary RegExp (or normalized tokenization) and prefer longest-match / dedupe.
- **[MAINTAINABILITY]** Dead parameter `_inFence`: doc comment claims `A fenced line is ALREADY rule_source — the axis does not override`, but `_inFence` is never read. Callers cannot tell the fence contract — is the caller or this function responsible for fence handling? Either enforce it (early-return when `_inFence`/already non-scorable) or remove the parameter.
- **[BUG]** Dual abort-suppression coupling + seam violation: `classifyProvenance` rewrites `srcKind` to `rule_source` while `isActionable` also checks `aboutGate`. If any caller mixes raw vs effective kinds, results diverge; worse, rewriting destroys ledger fidelity (header claims `recording path is unchanged` but engine is told a different kind) and conflates the two axes the file says must stay parallel. Keep original `srcKind` in the verdict and let `isActionable(v)` alone decide abort eligibility.
- **[BUG]** Misattributed `error` + missing input guard: `error: aboutGate ? TOKEN : null` is set even when `srcKind` was already non-scorable (no suppression actually occurred), so already-`rule_source` lines mentioning the gate emit `PROVENANCE_GATE_ABOUT_SELF` spuriously. Gate it on actual reclassification (`aboutGate && srcKind === 'own_utterance'`). Also `line.includes` throws on `null/undefined` — guard non-string input.

### src/gate/quote.ts

- **[BUG]** First-occurrence-only lookup misclassifies lines with multiple occurrences. `indexOf` always tests the prefix before the first `match`, so `isQuotedMatch('foo "foo"', 'foo')` reports unquoted even when the caller meant the second (quoted) occurrence, and vice-versa for `'"foo" foo'`. The `(line, match:string)` signature cannot disambiguate which occurrence to test. Accept an explicit index/offset (e.g. `isQuotedMatch(line: string, index: number)` or `at?: number`) and walk to that index; keep a string-based overload only if it checks all occurrences.
- **[BUG]** Independent toggles ignore nesting/quoting context. A quote char inside another quote type still flips its own flag, e.g. `"it's"` toggles `inSingle` on the apostrophe while still inside double quotes, and `"a `b` c"` toggles backtick inside double quotes. Result is false quoted/unquoted verdicts. Use a single active-quote state machine (only the currently open delimiter can close; other delimiters are literal until it closes), or document that cross-type literals are intentionally counted.
- **[BUG]** Apostrophe in plain English text is treated as an open single-quote region, e.g. `isQuotedMatch("don't match", "match")` returns true because `'` toggles `inSingle`. If single-quote means code/string literal, require open/close pairing heuristics (e.g. ignore `'` surrounded by word chars, or only treat as quote per language rules). At minimum document this limitation.
- **[BUG]** Universal backslash escape is wrong where backslash is literal. Skipping the char after any `\` assumes C/JS-style escaping in all regions, but e.g. POSIX shell single quotes (`'a\'b'`), Markdown backtick spans, and SQL `''` escapes have no backslash escape. This corrupts the walk (`'\\'` handling, `"\\\""` vs `'\\'`). Make escape handling context-sensitive (e.g. no escape inside single-quoted shell text / backtick, or parameterize by language).
- **[MAINTAINABILITY]** Duplicated escape-aware prefix walk in `isQuotedMatch` and `openRegionsAt`. Same toggle + backslash-skip logic is copy-pasted (lines 10-38), so a fix to nesting/escaping in one will diverge from the other. Extract a single `computeOpenRegions(line, at)` helper and have both callers use it (with `isQuotedMatchAt` delegating to it).
- **[BUG]** `openRegionsAt(line, at)` does not validate/clamp `at`. Negative, `NaN`, or `at > line.length` silently produce misleading results (empty walk or overrun reading `line[i] === undefined`). Clamp to `[0, line.length]` and early-return on non-finite input, consistent with `isQuotedMatch` empty/miss guards.

### src/gate/source-kind.ts

- **[BUG]** Fail-open default: any unmatched line or unexpected `fileKind` falls through to `own_utterance` (the only scorable kind). A typo (`"Rule"` vs `"rule"`), case mismatch, `undefined`/`null` at runtime, or a new file-kind value silently becomes scorable instead of suppressed. For an FP-shield gate the safe default should be fail-closed (non-scorable).
- **[BUG]** Fence-delimiter boundary gap: suppression depends entirely on caller-supplied `inFence`. The ``` / ~~~ opener and closer lines themselves are typically evaluated with `inFence=false` (before toggle / after toggle), so they bypass this check and can be scored even though fenced content is meant to be fully suppressed. Function should detect fence delimiters itself or explicitly document/toggle the contract.
- **[BUG]** Narrow markdown matchers allow scorable bypass: table requires leading `|` (misses `a | b` without leading pipe / GFM tables), quotation requires `-/ * + backtick` or `>` (misses `1. `quoted``, plain bullets, indented code blocks), heading requires `#{1,6} + space` (misses `#heading`, closed ATX `## h ##`, Setext `===/---`). Combined with the fail-open default above, anything not matched becomes `own_utterance`.
- **[MAINTAINABILITY]** Loosely typed `fileKind: string` with case-sensitive `=== "rule" / "doc"` amplifies the fail-open risk: no compiler guard against typos, wrong case (`"Rule"`, `"DOC"`), whitespace, or new variants. Use a union type and normalize at the boundary.

### src/index.ts

- **[MAINTAINABILITY]** Untyped host handle `pi: any` hides host-contract mismatches from the compiler with no justification comment. `install(pi: any,...)` already uses `any`, so the mismatch propagates unchecked; e.g. a host without `pi.on`/`sendMessage` fails only at runtime inside event handlers. Type the minimal host surface explicitly (or alias it) and document why `any` is needed if kept.
- **[MAINTAINABILITY]** Default-export entry also takes `pi: any` without justification, so deploy-time host drift (live `lexicon-gate/index.ts:39` contract) is invisible to `tsc`. Same fix as `boot()` — reuse a named `HostHandle` type instead of `any`.
- **[BUG]** Unhandled rules-load failure crashes extension load: `loadRules()` throws on missing dir / malformed rule / bad regex (src/lexicon/load.ts:109), and `boot()` calls `engineFromRulesDir()` + `install()` with no try/catch, validation of `opts.rulesDir`, or validation of `pi`. A single bad `.md` or unreadable dir takes the whole extension down with no user-friendly message. Wrap load+install with error handling and surface via `logger.warn`/host notification instead of throwing.
- **[BUG]** Spread order ` { rules, ...extra }` lets a runtime caller override `rules` despite `Omit<RunDeps,'rules'>` (type-only). Put `...extra` first so the freshly loaded `rules` always win.
- **[BUG]** Unsafe `HOME` fallback: when `PBK_RULES_DIR` and `HOME` are both unset, this interpolates to the literal string `undefined/.omp/agent/rules`, guaranteeing `loadRules()` throws `rules dir absent`. Add a null check / explicit throw with actionable message, and don't compute the default at module top-level if it can be invalid.

### src/ledger/writer.ts

- **[BUG]** buildRow bypasses the loud-fail invariant: it can construct a `jev:null` row with no `jevReason`, deferring failure to `appendLedger`. Validate at construction so invalid rows fail fast.
- **[BUG]** Unsafe nested access + narrow null check: `row.Evidence.jev` throws a raw TypeError if `row`/`Evidence` is nullish, masking the intended named validation error. It also only checks `=== null`, so `jev: undefined` (runtime JS) slips through and is dropped by JSON.stringify.
- **[PERFORMANCE]** Sync FS on every row without error wrapping: `mkdirSync`+`appendFileSync` block the event loop and propagate raw FS errors (bad ledgerPath, EACCES, ENOSPC) with no context. `mkdirSync(recursive:true)` on every append is also a redundant syscall in hot paths.
- **[BUG]** Unvalidated confidence rounding: `Number(probability.toFixed(4))` with no finite/range check lets NaN through as NaN, throws raw RangeError on Infinity, and lets out-of-range values (<0, >1) corrupt ledger confidence.

### src/lexicon/load.ts

- **[BUG]** Flow-bank capture truncates on first `]`, corrupting character classes. `([^\]]*)` stops at the `]` in `[a-z]`, so e.g. `use: ['\b[a-z]+\b']` is cut to `'\b[a-z`. The subsequent `.split(',')` also splits inside regex quantifiers (`{2,3}`) and quoted patterns containing commas. Fix: parse flow YAML properly (balanced-bracket scan respecting quotes/escapes) or reject ambiguous flow values loudly instead of silently loading a corrupted bank.
- **[BUG]** Stripped `(?i)` loses case-insensitivity, contradicting the comment. `stripInlineFlags` removes the leading flag group but validation (and any downstream reuse of the stripped source) compiles with `new RegExp(stripped)` and no `i` flag, so `(?i)\bfoo\b` validates as case-sensitive `/\bfoo\b/`. The live behaviour described is strip + compile case-insensitively. Fix: detect the flag before stripping and re-add it, e.g. `new RegExp(stripped, hadI ? 'i' : '')`, and propagate the flag to the consumer of `lexicon`. Also note `/^\(\?[a-z]+\)/` strips any `(?s)(?m)...` and only the first group.
- **[BUG]** Per-rule `scope` is silently dropped — `parseRule` hardcodes `scope: []` and never reads a `scope:` frontmatter field. If any live rule defines scoping, it is ignored downstream with no loud error, violating the file's own never-silent contract. Fix: parse flow/block `scope` (reuse `bank('scope')` or a dedicated parser) and either default explicitly or throw when missing if scoping is required.
- **[BUG]** Frontmatter delimiter rejects CRLF / trailing spaces, causing false 'has no frontmatter' load failure. `/^---\n([\s\S]*?)\n---\n?/` requires LF-only and no trailing whitespace, so Windows-checked-out rules (`\r\n`, `--- \r\n`) block the whole rubric load. Fix: normalise line endings first or allow `\r?\n` and trailing spaces/BOM: `/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/`.
- **[BUG]** Duplicate rule `id`s are not rejected — `loadRules` pushes by parsed frontmatter `id` (which may differ from filename) with no collision check. Two files declaring the same `id` silently coexist (downstream last-wins/double-count), violating 'the engine does not load half a rubric'. Fix: track `seen = new Set<string>()` and throw `lexicon: duplicate rule id ${r.id} in ${name}`.
- **[BUG]** Empty rules directory silently loads an empty rubric. `loadRules` only throws when the dir is absent; a present-but-empty (or all-non-`.md`) directory returns `[]` with no loud error, contradicting the never-half-a-rubric rule and letting the engine run with zero detections. Fix: throw when no `.md` files were loaded.

### src/lexicon/score.ts

- **[BUG]** deriveBand computes `neg` scores but never uses them: `high=max(pos)` and `low=min(pos)` are derived solely from positives. An overlapping `clear` case therefore cannot prevent a non-separating band, contradicting the header comment ('without catching a negative'). With `bandFor` semantics (`p>=act?'act':p>=flag?'flag':'clear'`), `high=max(pos)` also means only the top positive reaches `act`. Fix: compare against `max(neg)` (e.g. require `min(pos) > max(neg)` or return/search a separating cut) and avoid `Math.max(...pos)` spread which throws RangeError on very large corpora (use reduce).
- **[BUG]** Only the first occurrence per pattern is counted: `suggestive`/`substitute` use single `exec()` without `/g`, and `descriptive` uses single `test()`. Repeated non-overlapping hits of the same pattern (e.g. two `use` mentions, two descriptive hedges) contribute only once, understating `pos`/`neg` and `confidence`. If per-occurrence counting is intended, loop with `/g` (or `matchAll`) and apply the same-bank overlap dedupe to each successive span; if per-pattern counting is intended, document it explicitly.
- **[BUG]** Inflection expansion is morphologically wrong and structurally fragile: `${a}(?:s|ed|ing)?` turns `use` into `useed`/`useing` (misses `used`/`using`), never produces `es` plurals (`watches`/`boxes`) despite the `es` guard, mishandles `y->ies`/`e-drop`/`doubling`, and over-suppresses any word ending in `s` (`pass`/`class` treated as already inflected). The alternation splitter `/^(.*\()([^()]+)(\).*)$/` is greedy and rejects nesting (`[^()]+`), and the bare-word path only inflects the last word. Consider a real stemmer/lemma check at match time instead of naive suffix appending.
- **[PERFORMANCE]** Per-call `compile()` recompiles every pattern on every `scoreSignals()` call (no cache) and `throw`s on the first invalid regex, aborting the whole scoring. `stripInlineFlags` only strips a leading `(?flags)` (`/^\(\?[a-z]+\)/`), so embedded `(?i)`, `(?i:...)` (which becomes `:...)` and breaks), `(?P<>)`/`(?<>)` still throw, and ReDoS-prone patterns are unguarded. Pre-compile + cache per family at load, validate patterns upfront, and skip/log invalid banks instead of throwing mid-score.
- **[BUG]** Zero-length matches are counted as signals: an empty `m[0]` still does `pos+=2/1` and picks `hit`, and `overlaps()` (`s<x.e && e>x.s`) can never dedupe zero-length spans. Combined with missing null/length guards on `text`/`family` (a `null` text is coerced by `exec`/`test` instead of failing fast), scoring can inflate confidence. Guard `m[0].length===0` (skip) and validate inputs.

### src/lint/runner.ts

- **[BUG]** Unused `refuseOnMatch` semantics: interface promises true=violation/false=pass-condition but `runLint` never reads it and `LintVerdict` has no `violated` field. Callers cannot distinguish refuse from pass — every `matched:true` looks identical.
- **[SECURITY]** Unbounded `new RegExp(rule.pattern)` with no flags/length/timeout validation. Untrusted or mistyped patterns (e.g. `(a+)+$`) cause catastrophic backtracking / ReDoS, and callers cannot request `i/m/s` flags. Also no rejection of empty pattern which matches everything.
- **[SECURITY]** Unbounded `span` capture returns `m[0]` verbatim. A greedy pattern (e.g. `.*`) on a large file copies megabytes into every verdict (memory blowup) and can leak sensitive file content to callers/logs.
- **[BUG]** Doc/implementation mismatch on empty input: header comment promises 'Empty input is never a silent pass' but only empty `rules` throws. Empty `text` (`""`) still returns all `matched:false` verdicts, which most callers will treat as a pass.
- **[BUG]** Missing null/type guards: `runLint` dereferences `rule.pattern`/`rule.id` and `runAllLint` dereferences `rules.length` without checks. Null `rule`, non-array `rules`, non-string `text`, or entries with empty `id` throw raw TypeErrors instead of loud domain errors; `re.exec(text)` will also coerce non-strings silently.
- **[PERFORMANCE]** `runAllLint` recompiles every pattern on every call (`rules.map(r => runLint)`) and `exec` without `g` only captures the first match. For repeated runs over many files this is wasted CPU; no way to pre-compile or get all offsets.

### src/surfaces/entry.ts

- **[BUG]** Provenance gate is a no-op: both branches return identical `{action:"continue"}` so extension-sourced inputs are never filtered/dropped despite the comment. Either return a distinct verdict (e.g. `ignore`/`suppress`) for `source==="extension"` or remove the dead branch.
- **[BUG]** Unhandled engine failure in streaming loop: `await deps.check()` inside `for (const raw of lines)` has no try/catch. One rejection becomes an unhandled promise rejection, aborts the host hook, and silently skips remaining buffered lines. Wrap per-line check in try/catch (log + continue) and consider resetting/skipping buffer on failure.
- **[BUG]** Fire-and-forget abort+steer: `ctx.abort()` is fired synchronously before `pi.sendMessage()` which is not awaited, so the outer try/catch cannot catch async inject failures. Result is an aborted turn with no steer correction. `await` the send (and abort if async) inside the try block.
- **[BUG]** tool_result drops string payload: when `event.content` is a string, `base` falls back to `[]`, discarding the original tool output when appending the repair demand. Preserve string content (wrap as text block) or return original string + demand.
- **[BUG]** Unguarded serialization can crash hooks: `JSON.stringify(event.input/content)` on arbitrary host payloads throws on circular structures (also BigInt). No try/catch, so `tool_call`/`tool_result` hooks throw synchronously. Add safe-stringify helper with try/catch fallback (e.g. `String(input)`). Same issue applies to tool_result line.
- **[MAINTAINABILITY]** Banned `any` without justification + missing guard on injected deps: `pi: any`, `(event: any, ctx: any)` violate the TypeScript-Types rule (no `any` without explanatory comment). Also `install()` never validates `pi?.on` / `deps?.check` existence, so a bad host/injector throws TypeError at registration/first event. Type the host narrowly and early-throw on missing deps. Also `Decision` is imported but never used — remove dead import.

### src/surfaces/post.ts

- **[BUG]** Missing null guard on `postAction` input: `res.decisions.filter` will throw TypeError if `res` is null/undefined or `decisions` is null/undefined/non-array. Add a defensive guard per Null Checks rule.
- **[BUG]** Unvalidated decision fields interpolated into demand string: if any decision has missing `ruleId`/`correction` (or null entry), output contains literal `undefined` and yields a corrupt repair demand.
- **[MAINTAINABILITY]** Unwired-edge constants are exported but never consumed/enforced locally: `POST_TOOL_USE_BOUND=false` can silently drift if the host starts emitting `post_tool_use` and a caller registers using only `POST_TOOL_USE_EVENT`. Consider `as const` + a single guard helper or a test that asserts no registration path ignores the flag.

### src/surfaces/prose.ts

- **[BUG]** Multi-act drops N-1 corrections: `abort` returns all `firing` decisions but `sig` and `inject.content` derive only from `firing[0]`. If 2+ rules fire on the same check, the additional rules are aborted with no surfaced correction, so the model/operator never learns why they fired.
- **[BUG]** Single-`lastSignature` dedupe is fragile: only the immediately prior `ruleId:span` is remembered, so alternating A-B-A-B re-injects in a loop, and a changed `correction`/`probability` for the same span is incorrectly suppressed. The signature also embeds the full (potentially large/capped) span verbatim, which is unbounded memory/comparison cost and can collide on `:`/truncation.
- **[BUG]** Throwing in this pure mapper loses the `abort` intent: the `throw` discards `firing` so a caller without try/catch gets an uncaught exception and — depending on the stream handler — may fail-open (no abort) instead of fail-closed. Prefer returning a safe fallback or a typed error that preserves `abort`.
- **[SECURITY]** Unescaped `d.span`/`d.correction` in `display:true` payload: `span` is attacker/model-influenced text interpolated with only `"..."` quoting. If the host renders markdown/HTML, embedded newlines, fences, or directives can break out and inject misleading instructions/markup. Fence/escape the span.
- **[BUG]** No null/shape guard on engine output: `res.decisions.filter` throws TypeError if `res` is nullish or `decisions` is undefined (e.g. partial engine failure surfaced via `CheckResult.errors`). This pure boundary should degrade to no-op instead of crashing the surface.
- **[BUG]** `d.probability.toFixed(3)` assumes a finite number with no guard. The seam types it as `number`, but a buggy/deserialized engine can supply `undefined`/`NaN`/`Infinity`, turning the correction path into a TypeError/RangeError exactly when an abort is needed.

### src/surfaces/result.ts

- **[BUG]** Missing null guards on `res`/`res.decisions` (and on elements). `res.decisions.filter` and `d.band` will throw `TypeError` if the caller passes null/undefined, if `decisions` is missing, or if the array contains a hole/null entry. That violates the header guarantee that this surface 'never blocks a read' — an exception here propagates to the hook. Add a defensive guard returning `{ isError: false }` (or an explicit error) for malformed input.
- **[MAINTAINABILITY]** Flat `RepairAction` permits inconsistent states (`{isError:true}` with no `demand`, or `{isError:false, demand:'...'}`). Callers must infer the invariant by convention. Prefer a discriminated union so the type system enforces it.
- **[BUG]** Unsafe demand formatting: `d.probability.toFixed(3)` throws if `probability` is missing/non-numeric at runtime and emits `NaN`/`Infinity` if non-finite; `d.ruleId` is interpolated without sanitization so an embedded newline (`'x\n- forged'`) forges extra demand lines. Clamp/validate the number and strip line breaks from the id.

### src/surfaces/stream.ts

- **[BUG]** Coarse fence result misclassifies lines in multi-line batches. `push()` toggles `this.fence` per line but returns only the final state, so if a batch contains ``` open/close, caller cannot tell which of the returned `lines` were inside vs outside. Earlier lines will be scored as scorable when they were fenced (false positive abort) or vice-versa.
- **[BUG]** Cap truncation discards the match context the accumulator exists to preserve, and comment contradicts code ('drop oldest half' vs keep last BUFFER_CAP). `this.text` at truncation time is the trailing partial only, but slicing its head corrupts a long split line/pattern and can split a ``` marker or a surrogate pair, making cross-delta matching and fence toggling invisible. Completed lines are already emitted, so multi-line patterns spanning emitted lines are also not retained.
- **[BUG]** Unbounded `seen` set with collision-prone key. Stores full verbatim `span` strings (`${ruleId}:${span}`) with no cap/eviction, so memory grows with distinct spans while `text` is bounded. Plain `:` join is ambiguous if `ruleId` can contain `:` (e.g. `a:b`+`c` vs `a`+`b:c` collide and cause missed aborts).
- **[MAINTAINABILITY]** Fence + dedupe correctness silently depends on external `reset()` at turn boundaries. If caller forgets (session_start/agent_end), `fence` leaks into next turn (fenced lines misclassified forever) and `seen` wrongly suppresses future (rule,span) aborts. No turn-id parameter, TTL, or assertion enforces the window.
- **[BUG]** No CRLF normalization: `split("\n")` leaves trailing `\r` on lines from `\r\n` deltas. Returned lines then carry `\r` into rule/span matching (missed matches or spans containing `\r`) and `shouldFire` signatures diverge for identical logical lines.
- **[BUG]** Missing input validation on `delta`: `this.text += delta` coerces `null`/`undefined`/non-string to literal "null"/"undefined" text, permanently poisoning the buffer and fence/match results. Also fence regex only handles ``` with unlimited indent, missing ~~~ fences and 4-space indented-code false positives.

### src/surfaces/tool.ts

- **[BUG]** First-match-only drops additional `act` violations. When multiple decisions have `band === 'act'`, only `firing[0]` is surfaced, so remaining rules and their remedies are lost and the returned `reason` depends on `decisions` ordering. Aggregate all firing decisions.
- **[BUG]** Unsafe access to `res.decisions` throws on malformed input. If `res` is null/undefined or `decisions` is missing/non-array, `.filter` throws instead of failing closed on this blocking surface. Guard before filtering.
- **[MAINTAINABILITY]** BlockAction type does not enforce the file-header contract. `reason` is optional even when `block: true`, so callers can construct `{block:true}` with no remedy text and the compiler will not catch it. Use a discriminated union.
- **[BUG]** Unvalidated `ruleId`/`correction` interpolation can violate the must-teach-remedy contract. If a firing decision has empty/missing `correction` (or `ruleId`), reason becomes e.g. `R1: undefined` / `R1: ` with no actionable remedy. Fall back to a default message and filter empties.


---

## ★ THE HIGHEST-PRIORITY FINDING — A SECURITY FAIL-OPEN IN THE NEW AXIS

```
[SECURITY] src/gate/provenance.ts
  "Provenance-evasion bypass: a single generic substring match forces non-actionable. An
   attacker (or coincidental text) can append e.g. `the rule` / `the gate` / `the ledger` to a
   genuinely violating own_utterance span and classifyProvenance will rewrite it to
   `rule_source`, suppressing abort. This is fail-open."
```

★ THIS IS THE GOAL'S OWN HARD-STOP CLASS: a FAIL-OPEN where a LOUD FAIL was required. The axis
was built to suppress the gate's self-reference; the finding shows it can be used to suppress a
REAL violation. THE PROBE + THE ADJUDICATION + THE FIX follow in the debug log.

## THE ADJUDICATION LAW (the goal's PROOF CONTRACT)

Every finding is adjudicated BOTH ways before a verdict:
```
Side A — was the AUDIT wrong (a wrong expectation, a mis-read, an out-of-scope assumption)?
Side B — is the observed behavior a REAL contract violation?
★ Only CONFIRMED Side-B defects are findings; the rest are recorded as audit-errors.
```
