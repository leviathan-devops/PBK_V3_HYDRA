/**
 * D4 · THE RUNNER ORDER (PACKAGE_A §2.4, F-4).
 *
 * THE PIPELINE:
 *   source-kind gate is applied by the CALLER (Desk B) and supplied as req.sourceKind.
 *   here: for every ACTIVE lexicon rule whose scope matches the phase:
 *     score -> confidence -> bandOf -> act? DECIDED (lexicon, no Jev)
 *                                   -> flag? the gray zone (Jev would judge; with no key the
 *                                      band stands and the row records jev:null + the reason)
 *                                   -> clear? recorded
 *
 * THE PURITY INVARIANT (T-5): this file imports NO host surface — no host context
 */
import type { CheckRequest, CheckResult, Decision, LexiconRule } from "../../SEAM/seam";
import { bandOfLexicon, confidence, scoreSignals, toDecision } from "../lexicon/score";

export interface RunDeps {
	rules: LexiconRule[];
	/** The Jev judge. Absent/undefined => the gray zone records jev:null + a NAMED reason. */
	judge?: (span: string, ruleId: string) => Promise<{ probability: number; reason?: string }>;
	/** Sink for every decision (the ledger). */
	onDecision?: (d: Decision) => void;
}

/** Does the rule apply to this phase? No scope => applies to both. */
function inScope(rule: LexiconRule, phase: string): boolean {
	if (!rule.scope || rule.scope.length === 0) return true;
	return rule.scope.includes(phase);
}

/**
 * THE RUNNER. Returns the seam's CheckResult. Never throws for a rule-level condition —
 * a rule that throws on a bad pattern is caught and surfaced in `errors` (named, loud).
 */
export async function run(req: CheckRequest, deps: RunDeps): Promise<CheckResult> {
	const decisions: Decision[] = [];
	const errors: string[] = [];
	let jevCalls = 0;

	for (const rule of deps.rules) {
		if (!inScope(rule, req.phase)) continue;
		let signals;
		try {
			signals = scoreSignals(req.text, rule.lexicon);
		} catch (e) {
			errors.push(`${rule.id}: ${String(e)}`);
			continue;
		}
		const prob = confidence(signals.pos, signals.neg);
		const band = bandOfLexicon(prob, rule.band);

		if (band === "clear") {
			// recorded, never acted on
			const d = toDecision({ ruleId: rule.id, band, probability: prob, decidedBy: "lexicon",
				sourceKind: req.sourceKind, span: signals.hit, correction: rule.body });
			decisions.push(d);
			deps.onDecision?.(d);
			continue;
		}

		if (band === "flag") {
			// THE GRAY ZONE — the Jev judge, when one is wired. Only the gray reaches it.
			if (deps.judge) {
				jevCalls += 1;
				try {
					const v = await deps.judge(signals.hit, rule.id);
					const d = toDecision({ ruleId: rule.id, band: v.probability >= rule.band.high ? "act" : "flag",
						probability: v.probability, decidedBy: "jev", sourceKind: req.sourceKind,
						span: signals.hit, correction: rule.body });
					decisions.push(d);
					deps.onDecision?.(d);
					continue;
				} catch (e) {
					errors.push(`${rule.id}: jev failed (${String(e)}) — the mechanical band stands`);
					// fall through: the scored band decides
				}
			} else {
				errors.push(`${rule.id}: jev:null — no judge wired; the scored band stands`);
			}
			const d = toDecision({ ruleId: rule.id, band, probability: prob, decidedBy: "lexicon",
				sourceKind: req.sourceKind, span: signals.hit, correction: rule.body });
			decisions.push(d);
			deps.onDecision?.(d);
			continue;
		}

		// band === "act" — DECIDED by the lexicon. No Jev.
		const d = toDecision({ ruleId: rule.id, band, probability: prob, decidedBy: "lexicon",
			sourceKind: req.sourceKind, span: signals.hit, correction: rule.body });
		decisions.push(d);
		deps.onDecision?.(d);
	}

	return { decisions, jevCalls, total: decisions.length, errors };
}
