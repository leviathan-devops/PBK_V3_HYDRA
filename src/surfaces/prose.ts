/**
 * D3a · THE PROSE SURFACE (PACKAGE_B §2.3, G-4).
 *
 * message_update -> the engine's check() -> on act: abort the stream + inject the correction.
 *
 * ★ THE PEDIGREE: pi.sendMessage({customType: "ttsr-injection"}), NEVER pi.sendUserMessage.
 *   sendUserMessage is documented as "appears as if typed by the user" — a gate must never
 *   impersonate the operator.
 *
 * NO BAND MATH HERE (T-6): the engine returns the band; this module acts on it.
 */
import type { CheckResult, Decision } from "../../SEAM/seam";

export const CORRECTION_TYPE = "ttsr-injection";

export interface ProseAction {
	/** The decisions that warrant an abort. */
	abort: Decision[];
	/** The correction payload to inject, when one is warranted. */
	inject: {
		customType: string;
		content: string;
		/** ★ THE NATIVE SHAPE (measured in the omp binary): display:false — a custom entry with
		 * display:true renders as a BOX in the TUI. */
		display: boolean;
		attribution: string;
		details: { rules: string[]; confidence: number; sourceKind: string; span: string };
	} | null;
}

/** Decide what the prose surface does with a CheckResult. Pure — the caller performs it. */
export function proseAction(res: CheckResult, opts: { lastSignature?: string } = {}): ProseAction {
	const firing = res.decisions.filter((d) => d.band === "act");
	if (firing.length === 0) return { abort: [], inject: null };
	const d = firing[0];
	const sig = `${d.ruleId}:${d.span}`;
	if (opts.lastSignature === sig) return { abort: [], inject: null }; // the dedupe: already fired
	if (!d.correction || d.correction.trim().length === 0) {
		throw new Error(`prose: ${d.ruleId} fired with an EMPTY correction — a silent abort is banned`);
	}
	return {
		abort: firing,
		inject: {
			customType: CORRECTION_TYPE,
			content:
				`lexicon-gate INTERRUPT — rule "${d.ruleId}" fired ` +
				`(prob ${d.probability.toFixed(3)}, source_kind ${d.sourceKind}).\n` +
				`The text that fired: "${d.span}"\n\n${d.correction}`,
			// ★ THE NATIVE SHAPE (measured in the omp binary 2026-09-23): the harness's OWN TTSR
			// injections use display:!1 (FALSE) + details + attribution:"agent". `display:true`
			// renders the custom entry AS A BOX (the "package" the operator reported). The
			// details carry the machine-readable fields a renderer/inspector expects.
			display: false,
			attribution: "agent",
			details: {
				rules: [d.ruleId],
				confidence: Number(d.probability.toFixed(3)),
				sourceKind: d.sourceKind,
				span: d.span.slice(0, 200),
			},
		},
	};
}
