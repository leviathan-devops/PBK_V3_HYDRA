/**
 * D3 · THE SCORER (PACKAGE_A §2.3, F-1/F-8).
 *
 * THE WEIGHTS ARE THE SEAM'S (SEAM/seam.ts:71-77), NOT INVENTED:
 *   descriptive  neg += 1     suggestive  pos += 2 (or +1 without \b)
 *   substitute   pos += 2     use         neg += 3    THE EXEMPTOR
 *   confidence = pos / (pos + neg + 1)
 *
 * THE BAND IS abide's OWN bandFor (vendor/abide/band.ts:48) — imported, never re-implemented.
 * The {low, high} thresholds are DERIVED from a labeled corpus, never inherited.
 */
import { bandFor } from "../../vendor/abide/band.js";
import type { Thresholds } from "../../vendor/abide/schema/index.js";
import type { Band, Decision, PatternFamily, SrcKind } from "../../SEAM/seam";

/** Compile one pattern. `\b` presence flips a suggestive hit from +1 to +2 (the seam's rule). */
function compile(p: string): RegExp {
	try {
		return new RegExp(p);
	} catch (e) {
		throw new Error(`lexicon: invalid regex ${JSON.stringify(p)}: ${String(e)}`);
	}
}

export interface Signals {
	pos: number;
	neg: number;
	hit: string;
}

/** scoreSignals — the 4 banks, the seam's weights, THE EXEMPTOR applied. */
export function scoreSignals(text: string, family: PatternFamily): Signals {
	let pos = 0;
	let neg = 0;
	let hit = "";
	for (const p of family.suggestive ?? []) {
		const m = compile(p).exec(text);
		if (m) {
			pos += p.includes("\\b") ? 2 : 1;
			if (!hit || m[0].length > hit.length) hit = m[0];
		}
	}
	for (const p of family.substitute ?? []) {
		const m = compile(p).exec(text);
		if (m) {
			pos += 2;
			if (!hit || m[0].length > hit.length) hit = m[0];
		}
	}
	for (const p of family.descriptive ?? []) if (compile(p).test(text)) neg += 1;
	for (const p of family.use ?? []) if (compile(p).test(text)) neg += 3;
	return { pos, neg, hit };
}

/** confidence = pos / (pos + neg + 1) — the seam's formula, verbatim. */
export const confidence = (pos: number, neg: number): number => pos / (pos + neg + 1);

/**
 * THE BAND — abide's bandFor, given the DERIVED thresholds.
 * The seam's Band is act|flag|clear; abide's bandFor returns exactly that vocabulary.
 */
export function bandOfLexicon(probability: number, band: { low: number; high: number }): Band {
	// abide's Thresholds shape is {act, flag}; the seam's band is {low, high}.
	// Map the seam's derived band onto abide's threshold shape (high -> act, low -> flag).
	const thresholds: Thresholds = { act: band.high, flag: band.low };
	return bandFor(probability, thresholds);
}

/**
 * Derive a band from a LABELED corpus: the smallest high that catches every positive
 * without catching a negative, and the smallest low below it.
 *  ★ NEVER inherited — measured from the corpus the caller supplies.
 */
export function deriveBand(
	corpus: { signals: Signals; expected: "act" | "clear" }[],
): { low: number; high: number } {
	const pos = corpus.filter((c) => c.expected === "act").map((c) => confidence(c.signals.pos, c.signals.neg));
	const neg = corpus.filter((c) => c.expected === "clear").map((c) => confidence(c.signals.pos, c.signals.neg));
	if (pos.length === 0 || neg.length === 0) {
		throw new Error("deriveBand: the corpus needs at least one positive and one negative");
	}
	const high = Math.max(...pos); // the smallest cut that catches every positive
	const low = Math.min(...pos); // the smallest score still treated as a violation
	if (!(high > low)) {
		// a single-valued positive set: keep a legal, non-degenerate band
		return { low: Math.max(0, low - 0.01), high };
	}
	return { low: Math.min(low, high), high };
}

/** The maximal span length the seam caps at (Decision.capped). */
export const SPAN_CAP = 200;

/** Build the Decision row that crosses the seam. */
export function toDecision(args: {
	ruleId: string;
	band: Band;
	probability: number;
	decidedBy: "lexicon" | "jev";
	sourceKind: SrcKind;
	span: string;
	correction: string;
}): Decision {
	const capped = args.span.length > SPAN_CAP;
	return {
		ruleId: args.ruleId,
		band: args.band,
		probability: args.probability,
		decidedBy: args.decidedBy,
		sourceKind: args.sourceKind,
		span: capped ? args.span.slice(0, SPAN_CAP) : args.span,
		correction: args.correction,
		capped,
	};
}
