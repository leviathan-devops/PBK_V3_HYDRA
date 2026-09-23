/**
 * D7 · THE PUBLIC SURFACE (PACKAGE_A §2.2, T-2/T-5).
 *
 * `check(req)` is the ONE entry point the seam names. It satisfies the seam's CheckRequest ->
 * CheckResult shapes EXACTLY, and imports NOTHING from the host — the engine is pure.
 */
import type { CheckRequest, CheckResult, LexiconRule } from "../../SEAM/seam";
import { run, type RunDeps } from "./engine/check";
import { loadRules } from "./lexicon/load";

export type { CheckRequest, CheckResult, Decision, LexiconRule } from "../../SEAM/seam";
export { run } from "./engine/check";
export { loadRules } from "./lexicon/load";
export { scoreSignals, confidence, bandOfLexicon, deriveBand } from "./lexicon/score";
export { runLint, runAllLint } from "./lint/runner";
export { appendLedger, buildRow } from "./ledger/writer";

/**
 * THE ENGINE. Desk B calls this. The rules + the optional judge are injected by the caller
 * so the engine stays pure (no fs reads at call time, no host handles).
 */
export function makeEngine(deps: RunDeps): (req: CheckRequest) => Promise<CheckResult> {
	return (req: CheckRequest) => run(req, deps);
}

/** A convenience factory: load the rules from a directory and build the engine. */
export function engineFromRulesDir(dir: string, extra: Omit<RunDeps, "rules"> = {}) {
	const rules: LexiconRule[] = loadRules(dir);
	return makeEngine({ rules, ...extra });
}
