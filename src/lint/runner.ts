/**
 * D5 · THE LINT RUNNER (PACKAGE_A §2.4, F-4 — the lint half comes alive).
 *
 * abide's rubric carried a lint pattern that had NEVER EXECUTED. This runs it: a rule's
 * `lint` pattern is tested against the file text and REFUSES when it matches.
 *
 * A verdict is {ruleId, matched: boolean, span}. The runner is pure: text in, verdict out.
 */
export interface LintVerdict {
	ruleId: string;
	matched: boolean;
	span: string;
}

export interface LintRule {
	id: string;
	pattern: string;
	/** true = matching the pattern is a VIOLATION (refuse); false = it is a pass condition. */
	refuseOnMatch?: boolean;
}

/**
 * Run one lint rule against the text. THROWS on an invalid pattern (loud, never silent).
 */
export function runLint(rule: LintRule, text: string): LintVerdict {
	let re: RegExp;
	try {
		re = new RegExp(rule.pattern);
	} catch (e) {
		throw new Error(`lint: invalid pattern for ${rule.id}: ${String(e)}`);
	}
	const m = re.exec(text);
	const matched = m !== null;
	return { ruleId: rule.id, matched, span: m?.[0] ?? "" };
}

/** Run every lint rule; returns the verdicts in order. Empty input is never a silent pass. */
export function runAllLint(rules: LintRule[], text: string): LintVerdict[] {
	if (rules.length === 0) throw new Error("lint: no rules supplied — an empty run is not a pass");
	return rules.map((r) => runLint(r, text));
}
