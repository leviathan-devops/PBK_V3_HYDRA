/**
 * src/index.ts — THE MERGED ENTRY (W3, the orchestrator's act).
 *
 * ★ THE COLLISION POINT: both workers created this file. W1's exported the ENGINE surface
 *   (`check`); W2's registered the HOST hooks. The seam's contract is explicit — "Desk B calls
 *   this; Desk A implements it." This file is where the two halves MEET.
 *
 * THE SHAPE: the engine is pure (no host handle); the entry is impure (it owns the hooks).
 * The entry IMPORTS the engine's `check` and hands it to the surfaces via `install()`.
 *
 * THE BOUNDARY IS PRESERVED:
 *   the engine (src/engine, src/lexicon, src/lint, src/ledger) imports NO host surface
 *   the surfaces (src/surfaces, src/action, src/gate) compute NO band
 *   this file is the ONLY place the two meet.
 */
import type { CheckRequest, CheckResult, LexiconRule } from "../SEAM/seam";
import { run, type RunDeps } from "./engine/check";
import { loadRules } from "./lexicon/load";
import { llmJudge } from "./engine/judge";
// ★ EXPORTED for the runtime test + the second operator (a zero-context seat must be able to
// drive the judge directly — an unexported judge is untestable from outside the bundle).
export { llmJudge };
import { install, type EntryDeps } from "./surfaces/entry";

// ── THE ENGINE SURFACE (W1's D7) ──
export type { CheckRequest, CheckResult, Decision, LexiconRule } from "../SEAM/seam";
export { run } from "./engine/check";
export { loadRules } from "./lexicon/load";
export { scoreSignals, confidence, bandOfLexicon, deriveBand } from "./lexicon/score";
export { runLint, runAllLint } from "./lint/runner";
export { appendLedger, buildRow } from "./ledger/writer";

/** The engine, with its deps injected. Pure: no fs read at call time, no host handle. */
export function makeEngine(deps: RunDeps): (req: CheckRequest) => Promise<CheckResult> {
	return (req: CheckRequest) => run(req, deps);
}

/** Load the rules from a directory and build the engine. */
export function engineFromRulesDir(dir: string, extra: Omit<RunDeps, "rules"> = {}) {
	const rules: LexiconRule[] = loadRules(dir);
	return makeEngine({ rules, ...extra });
}

// ── THE HOST ENTRY (W2's D7) ──
export { install, type EntryDeps } from "./surfaces/entry";
export { StreamBuffer } from "./surfaces/stream";
export { proseAction, CORRECTION_TYPE } from "./surfaces/prose";
export { toolAction } from "./surfaces/tool";
export { resultAction } from "./surfaces/result";
export { postAction, POST_TOOL_USE_BOUND } from "./surfaces/post";
export { actionFor, actionMatrix, SURFACES, type ActionKind } from "./action/dispatch";
export { classifySource, SCORABLE, isScorable } from "./gate/source-kind";
export { isQuotedMatch, openRegionsAt } from "./gate/quote";

/**
 * THE ONE-CALL WIRE — what the host actually calls at load time.
 * It builds the engine from a rules dir and installs the hooks that call it.
 */
export function boot(pi: any, opts: { rulesDir: string; logger?: EntryDeps["logger"] }): void {
	// ★ THE JUDGE, WIRED (2026-09-24 — the operator: "WHERE IS THE DECISION MAKING MODEL"):
	// the gray zone now reaches a real decision model (the muse-on-GO lane). Before this,
	// boot() passed NO judge and every ledger row recorded `jev:null — no judge wired`.
	// A judge failure is LOUD (the throw is caught by the engine; the mechanical band stands).
	const check = engineFromRulesDir(opts.rulesDir, { judge: llmJudge });
	install(pi, { check, logger: opts.logger });
}

/**
 * ★ THE DEFAULT EXPORT — THE DEPLOY CONTRACT (HT-BUG-15, found 2026-09-23).
 *
 * omp loads an extension by importing its file and CALLING THE DEFAULT EXPORT with `pi`. The live
 * extension carries `export default function (pi) { ... }` (lexicon-gate/index.ts:39). THIS TREE
 * had named exports ONLY — so a deploy would have loaded NOTHING, silently. The entry is
 * mechanically required; without it the extension registers zero hooks.
 *
 * The rules dir resolves from the env (PBK_RULES_DIR) or the live default.
 */
const DEFAULT_RULES_DIR = process.env.PBK_RULES_DIR ?? `${process.env.HOME}/.omp/agent/rules`;

export default function pbk_v3(pi: any): void {
	boot(pi, { rulesDir: DEFAULT_RULES_DIR, logger: pi?.logger });
}
