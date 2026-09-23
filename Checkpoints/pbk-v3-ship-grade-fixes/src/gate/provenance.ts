/**
 * THE PROVENANCE AXIS (the second dimension) — PBK_V3_NEXT_STEPS_BLUEPRINT_v1 §4.
 *
 * ★ THE ROOT CAUSE THIS CLOSES (derailment-data-log.md:§9, the build's OWN post-mortem):
 *   "THE SCORING PATH HAS NO NOTION OF PROVENANCE. ... The provenance axis needs one more
 *    dimension: NOT JUST 'is this the agent's utterance?' BUT 'is this utterance ABOUT THE GATE?'"
 *
 * THE FIVE-KIND GATE (`src/gate/source-kind.ts` → the frozen seam's `SrcKind`) answers the
 * FIRST question and works: it suppressed 304 of 792 rows. But all four recorded incidents
 * (D the correction re-score, A the self-reference loop, C the process narration, B the
 * inflection gap) land INSIDE `own_utterance`. This module adds the SECOND axis.
 *
 * ★ THE VALIDITY LAW (the predicate):
 *   A SPAN IS ACTIONABLE IFF srcKind === "own_utterance" AND aboutGate === false,
 *   ELSE PROVENANCE_GATE_ABOUT_SELF.
 *
 *   "actionable" == eligible to ABORT the stream. An about-gate span is recorded (the engine's
 *   onDecision still fires) but never aborts — the gate stops firing on its own subject matter.
 *
 * ★ THE SEAM STAYS FROZEN. This does NOT add a sixth `SrcKind` (that would break
 * `SEAM/seam.ts:61` and its exhaustive assert at `seam.ts:179`). It is a PARALLEL axis that
 * RETURNS a `SrcKind`: a span about the gate is reported as `rule_source` — the existing kind
 * that means "material about rules", which is non-scorable by construction
 * (`src/gate/source-kind.ts:15`). The recording path is unchanged; only the abort eligibility
 * changes.
 */
import type { SrcKind } from "../../SEAM/seam";

/**
 * THE GATE'S OWN VOCABULARY — an identifier here marks a span as ABOUT the gate.
 *
 * DERIVED from the live corpus, not invented: each entry appears in the ledger's own
 * `Evidence.span` values (the injected corrections and the rule texts) OR is a rule id.
 * MEASURED RECALL: run `bun test -t provenance_recall` (see tests/adversarial.test.ts).
 */
export const GATE_VOCABULARY: readonly string[] = [
	// the rule ids (the gate's own names)
	"instruction-not-predicate",
	"theatrical-verification",
	"scope-shrink",
	"record-anchor",
	"stale-substrate",
	"unwired-edge",
	"phantom-and-claim",
	"dist-not-built",
	"fallback-slop",
	// the law names (the injected corrections' vocabulary)
	"PREDICATE LAW",
	"RECORD LAW",
	"SCOPE LAW",
	"SUBJECT LAW",
	"ARTIFACT LAW",
	"THE EXIT TEST",
	// the gate machinery (the engine + the ledger)
	"lexicon-gate",
	"lexicon",
	"the gate",
	"the rule",
	"the band",
	"the ledger",
	"scoreSignals",
	"classifySource",
	"SCORABLE",
	"source_kind",
	"sourceKind",
];

/** ★ THE NAMED ERROR TOKEN (frozen, greppable, testable — a sentence would not be). */
export const PROVENANCE_GATE_ABOUT_SELF = "PROVENANCE_GATE_ABOUT_SELF";

export interface ProvenanceVerdict {
	/** The kind the engine should be told (the axis' OUTPUT — `rule_source` when about-gate). */
	srcKind: SrcKind;
	/** ★ THE NEW AXIS: does this span DESCRIBE the gate? */
	aboutGate: boolean;
	/** How many gate identifiers appear (the strength signal). */
	gateRefCount: number;
	/** WHICH identifiers (for the ledger row + the audit). */
	gateRefs: readonly string[];
	/** The named token when aboutGate, else null. */
	error: typeof PROVENANCE_GATE_ABOUT_SELF | null;
}

/** ★ THE VALIDITY LAW, as a predicate: is this span eligible to ABORT the stream? */
export function isActionable(v: ProvenanceVerdict): boolean {
	return v.srcKind === "own_utterance" && v.aboutGate === false;
}

/**
 * CLASSIFY THE PROVENANCE of one line. Pure. No fs read, no host handle (the purity invariant
 * the engine holds — `src/engine/check.ts` imports no host surface).
 *
 * A fenced line is ALREADY `rule_source` — the axis does not override a non-scorable kind.
 * The axis only ADDS the about-gate determination ON TOP of `own_utterance`.
 */
export function classifyProvenance(line: string, srcKind: SrcKind, _inFence = false): ProvenanceVerdict {
	const refs: string[] = [];
	for (const term of GATE_VOCABULARY) {
		if (line.includes(term)) refs.push(term);
	}
	const aboutGate = refs.length >= 1;
	// the axis only re-classes an otherwise-actionable span
	const effective: SrcKind = aboutGate && srcKind === "own_utterance" ? "rule_source" : srcKind;
	return {
		srcKind: effective,
		aboutGate,
		gateRefCount: refs.length,
		gateRefs: refs,
		error: aboutGate ? PROVENANCE_GATE_ABOUT_SELF : null,
	};
}
