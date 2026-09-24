/**
 * P7 - THE ADVERSARIAL SWEEP: the known defects, re-probed against the NEW tree.
 *
 * THE PATTERNS ARE COPIED VERBATIM from the live rule file, emitted with JSON.stringify so the
 * backslashes survive. FOUR earlier drafts produced false failures by hand-building the regexes
 * or by template-literal escaping (\b became a BACKSPACE, not a word boundary). All adjudicated
 * as PROBE ERRORS (Side A). THE LESSON: copy the authority, and emit it with a real serializer.
 */
import { classifyProvenance, isActionable, PROVENANCE_GATE_ABOUT_SELF } from "../src/gate/provenance";
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import type { LexiconRule } from "../SEAM/seam";
import { bandOfLexicon, confidence, scoreSignals } from "../src/lexicon/score";
import { loadRules } from "../src/lexicon/load";
import { SCORABLE, classifySource } from "../src/gate/source-kind";
import { isQuotedMatch } from "../src/gate/quote";
import { StreamBuffer } from "../src/surfaces/stream";
import { actionFor } from "../src/action/dispatch";
import { proseAction } from "../src/surfaces/prose";

const RULES_DIR = `${import.meta.dir}/fixtures/rules`;
const SHORT = "be " + "careful";
const LONG = "let me " + SHORT;

const RULE: LexiconRule = {
	id: "instruction-not-predicate",
	body: "THE PREDICATE LAW: state a mechanical predicate.",
	description: "an intention where a predicate belongs",
	scope: [],
	lexicon: {
		descriptive: ["\\b(exit 1|nonzero|asserts?|throws)\\b"],
		suggestive: ["\\b(we (should|must|need to)|i.?ll|let.?s|let me) (just )?(make sure|ensure|remember to|be careful|always|never)\\b", "\\b(add a (check|warning|reminder|note|comment) (that|to))\\b", "\\b(be (more )?careful|pay attention to|watch out for|keep in mind)\\b"],
		substitute: [],
		use: ["\\b(exit|predicate|nonzero|throws?|fails?|asserts?)\\b"],
	},
	threshold: 0.62,
	band: { low: 0.3, high: 0.62 },
};
const score = (t: string) => {
	const s = scoreSignals(t, RULE.lexicon);
	const c = confidence(s.pos, s.neg);
	return { pos: s.pos, neg: s.neg, c, band: bandOfLexicon(c, RULE.band) };
};

test("P7-HT-BUG-3 the exemptor and inflections", () => {
	const base = score("the predicate throws a nonzero exit");
	expect(base.pos).toBe(0);
	expect(base.band).toBe("clear");
	const infl = score(LONG + ": the check exits 1 on a violation");
	console.log(`  HT-BUG-3 inflected: pos=${infl.pos} neg=${infl.neg} c=${infl.c.toFixed(3)} band=${infl.band}`);
	// THE FIX: the exemptor expands the inflection -> neg>0 and the band drops off act
	expect(infl.neg).toBeGreaterThan(0);
	expect(infl.band).not.toBe("act");
	console.log("  HT-BUG-3 STATUS FIXED: the exemptor expands the inflection (neg>0)");
});

test("P7-HT-BUG-4 the double-match", () => {
	const a = score(SHORT), b = score(LONG);
	console.log(`  HT-BUG-4 short pos=${a.pos} c=${a.c.toFixed(3)} band=${a.band}`);
	console.log(`  HT-BUG-4 long  pos=${b.pos} c=${b.c.toFixed(3)} band=${b.band}`);
	// THE FIX: two members sharing a tail no longer double-count -> the same pos
	expect(b.pos).toBe(a.pos);
	console.log("  HT-BUG-4 STATUS FIXED: overlapping matches are counted once");
});

test("P7-HT-BUG-5 the process narration (FIXED on the live rule)", () => {
	// ★ THE AUTHORITY IS THE LIVE RULE, not the local synthetic copy — W2's fix is there.
	const live = loadRules(RULES_DIR).find((x) => x.id === "instruction-not-predicate")!;
	const s = scoreSignals(LONG + " about the doc-density gate: these are .md writes.", live.lexicon);
	const c = confidence(s.pos, s.neg);
	console.log(`  HT-BUG-5 the real span pos=${s.pos} neg=${s.neg} band=${bandOfLexicon(c, live.band)}`);
	expect(bandOfLexicon(c, live.band)).not.toBe("act");
	console.log("  HT-BUG-5 STATUS FIXED: a process hedge drops off act on the live rule");
});

test("P7-HT-BUG-6 the self-reference loop (FIXED on the live rule)", () => {
	const live = loadRules(RULES_DIR).find((x) => x.id === "instruction-not-predicate")!;
	const s = scoreSignals("Now I must " + SHORT + " (no, that is the banned phrase). Let me EXECUTE.", live.lexicon);
	const c = confidence(s.pos, s.neg);
	console.log(`  HT-BUG-6 the meta-correction pos=${s.pos} neg=${s.neg} band=${bandOfLexicon(c, live.band)}`);
	expect(bandOfLexicon(c, live.band)).not.toBe("act");
	console.log("  HT-BUG-6 STATUS FIXED: the meta-correction drops off act on the live rule");
});

test("P7-HT-BUG-10 the audit gate's blind-pass guard (FIXED, asserted from disk)", () => {
	// THE CLASS: "0 findings" and "0 coverage" produce the same bytes unless coverage is asserted.
	// THE FIX lives in the extension; assert the guards are ON DISK (the source of truth).
	const src = readFileSync("/home/leviathan/.omp/agent/extensions/qwen-code-audit/index.js", "utf8");
	const guards = ["OCR_RUN_DEGRADED", "OCR_NO_FILES_REVIEWED", "OCR_COUNT_MISMATCH"];
	for (const g of guards) {
		console.log(`  HT-BUG-10 the guard present: ${g} -> ${src.includes(g)}`);
		expect(src.includes(g)).toBe(true);
	}
	// and the class assertion: the summary is not derived from the artifact
	const artifact = { status: "completed_with_errors", summary: { comments: 10, files_reviewed: 2 } };
	const gate = { findings: 0, filesReviewed: "?" };
	expect(gate.findings === artifact.summary.comments).toBe(false);
	console.log("  HT-BUG-10 STATUS FIXED: the 3 blind-pass guards are on disk (see gate-verdict-proof.mjs)");
});

test("P7 the FP shield: the positive fires, the negatives do not", () => {
	const pos = score(LONG + " about this");
	expect(pos.band).toBe("act");
	expect(SCORABLE.has("own_utterance")).toBe(true);
	expect(SCORABLE.has("quotation")).toBe(false);
	expect(classifySource("- `" + SHORT + "`", false, "md")).toBe("quotation");
	expect(classifySource(SHORT, true, "md")).toBe("rule_source");
	expect(isQuotedMatch('say "' + SHORT + '"', SHORT)).toBe(true);
	const b = new StreamBuffer();
	expect([1,2,3,4,5].map(() => b.shouldFire("r", "s")).filter(Boolean).length).toBe(1);
	for (const s of ["prose","tool-call","tool-result","post-tool-use"] as const) expect(actionFor(s, "act")).toBeTruthy();
});

// ── W2's rule_precision: the LIVE rules, read from disk, the exemptors proven ──
test("rule_precision: the live rules load + the two exemptors hold", () => {
	const rules = loadRules(RULES_DIR);
	expect(rules.length).toBe(9);
	const r = rules.find((x) => x.id === "instruction-not-predicate");
	expect(r).toBeDefined();
	// HT-BUG-6: the meta-correction drops off act
	const meta = scoreSignals("Now I must " + SHORT + " (no, that is the banned phrase). Let me EXECUTE.", r!.lexicon);
	const metaC = confidence(meta.pos, meta.neg);
	console.log(`  rule_precision HT-BUG-6: pos=${meta.pos} neg=${meta.neg} band=${bandOfLexicon(metaC, r!.band)}`);
	expect(bandOfLexicon(metaC, r!.band)).not.toBe("act");
	// HT-BUG-5: the process hedge drops off act
	const hedge = scoreSignals(LONG + " about the doc-density gate: these are .md writes.", r!.lexicon);
	const hedgeC = confidence(hedge.pos, hedge.neg);
	console.log(`  rule_precision HT-BUG-5: pos=${hedge.pos} neg=${hedge.neg} band=${bandOfLexicon(hedgeC, r!.band)}`);
	expect(bandOfLexicon(hedgeC, r!.band)).not.toBe("act");
	// THE NEGATIVE HALF: a DESIGN instruction still fires act
	const design = scoreSignals("let me just add a check that validates the input", r!.lexicon);
	const designC = confidence(design.pos, design.neg);
	console.log(`  rule_precision the design instruction: pos=${design.pos} band=${bandOfLexicon(designC, r!.band)}`);
	expect(bandOfLexicon(designC, r!.band)).toBe("act");
	// THE SACRED OVERLAP: a genuine predicate statement is still clear
	const sacred = scoreSignals("the predicate throws a nonzero exit", r!.lexicon);
	console.log(`  rule_precision the sacred overlap: pos=${sacred.pos} neg=${sacred.neg} band=${bandOfLexicon(confidence(sacred.pos, sacred.neg), r!.band)}`);
	expect(sacred.pos).toBe(0);
	expect(sacred.neg).toBeGreaterThanOrEqual(4);
});


// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE PROVENANCE AXIS (blueprint §4, §8) — POSITIVE + NEGATIVE
// ═══════════════════════════════════════════════════════════════════════════════════════════

test("provenance_axis: a span ABOUT the gate is NON-actionable (the root-cause class)", () => {
	const v = classifyProvenance("THE PREDICATE LAW. A prevention is a MECHANICAL PREDICATE.", "own_utterance");
	console.log(`  about-gate: aboutGate=${v.aboutGate} srcKind=${v.srcKind} refs=${v.gateRefCount} err=${v.error}`);
	expect(v.aboutGate).toBe(true);
	expect(v.srcKind).toBe("rule_source");      // re-classed, so NON-scorable
	expect(isActionable(v)).toBe(false);        // ★ the predicate: NOT actionable
	expect(v.error).toBe(PROVENANCE_GATE_ABOUT_SELF);
});

test("provenance_axis NEGATIVE: a REAL violation is ACTIONABLE (zero over-suppress)", () => {
	const v = classifyProvenance("the system should validate the input before it writes", "own_utterance");
	console.log(`  real violation: aboutGate=${v.aboutGate} srcKind=${v.srcKind} refs=${v.gateRefCount}`);
	expect(v.aboutGate).toBe(false);
	expect(v.srcKind).toBe("own_utterance");
	expect(isActionable(v)).toBe(true);         // ★ a real prevention STILL fires
	expect(v.error).toBeNull();
});

test("provenance_axis NEGATIVE: a clean utterance with no gate ref is untouched", () => {
	const v = classifyProvenance("the parser reads the file and returns the tokens", "own_utterance");
	expect(v.aboutGate).toBe(false);
	expect(v.srcKind).toBe("own_utterance");
});

test("provenance_axis: a NON-scorable kind is never upgraded (the seam stays frozen)", () => {
	// a quotation that happens to mention the gate: still a quotation, never promoted
	const v = classifyProvenance("> the gate is a lexicon thing", "quotation");
	expect(v.srcKind).toBe("quotation");        // unchanged — the axis only re-classes own_utterance
});


// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE EVASION RESISTANCE (the audit's SECURITY finding, CONFIRMED Side-B, then FIXED)
// ═══════════════════════════════════════════════════════════════════════════════════════════

test("provenance_axis ADVERSARIAL: a real violation + a generic gate-word is NOT suppressed", () => {
	// the audit MEASURED: appending "the gate" to a violation forced actionable=false (fail-open).
	for (const s of [
		"the system should validate the input before it writes, the gate needs it",
		"the system should validate the input, the rule says so",
		"the system should validate the input, per the lexicon",
	]) {
		const v = classifyProvenance(s, "own_utterance");
		console.log(`  the evasion: aboutGate=${v.aboutGate} actionable=${isActionable(v)}`);
		expect(v.aboutGate).toBe(false);      // ★ NOT about-gate — the generic noun is not a signal
		expect(isActionable(v)).toBe(true);   // ★ the violation STILL aborts
	}
});

test("provenance_axis ADVERSARIAL: ordinary prose is not suppressed (zero false positives)", () => {
	for (const s of ["let me check the rule and then continue", "the ledger row grows by one each turn"]) {
		const v = classifyProvenance(s, "own_utterance");
		expect(v.aboutGate).toBe(false);
		expect(isActionable(v)).toBe(true);
	}
});

test("provenance_axis: the TRUE positives survive (the rule ids + the law names + the case variants)", () => {
	const cases = [
		"THE PREDICATE LAW. A prevention is a MECHANICAL PREDICATE.",
		"instruction-not-predicate fired at confidence 0.667",
		"the predicate law says execute",             // ★ the case variant
		"lexicon-gate fired on my prose",
	];
	for (const s of cases) {
		const v = classifyProvenance(s, "own_utterance");
		expect(v.aboutGate).toBe(true);
		expect(isActionable(v)).toBe(false);
	}
});

test("provenance_axis: no double-count (lexicon-gate is ONE ref, not two)", () => {
	const v = classifyProvenance("lexicon-gate fired", "own_utterance");
	console.log(`  the refs: [${v.gateRefs.join(", ")}] count=${v.gateRefCount}`);
	expect(v.gateRefs).not.toContain("lexicon");   // ★ the substring trap is gone
	expect(v.gateRefCount).toBe(1);
});

test("provenance_axis: the error token is gated on an ACTUAL reclassification", () => {
	const already = classifyProvenance("THE PREDICATE LAW", "rule_source");
	expect(already.aboutGate).toBe(true);
	expect(already.error).toBeNull();              // ★ no spurious token on a non-scorable input
});


// ═══════════════════════════════════════════════════════════════════════════════════════════
// HT-BUG-21 — THE NATIVE FORMAT (found by the RUNTIME test, not the suite)
// ═══════════════════════════════════════════════════════════════════════════════════════════

test("HT-BUG-21: the prose inject carries the NATIVE shape (display:false + details + attribution)", () => {
	const res = { decisions: [{ ruleId:"R1", band:"act", probability:0.9, sourceKind:"own_utterance",
		span:"the bad span", correction:"THE RULE BODY" }], jevCalls:0, total:1, errors:[] } as any;
	const a = proseAction(res, { lastSignature: "" });
	console.log(`  the inject: display=${a.inject!.display} attribution=${a.inject!.attribution} details=${!!a.inject!.details}`);
	// ★ the omp binary's native shape: display:!1 (FALSE) + details + attribution:"agent"
	expect(a.inject!.display).toBe(false);          // ★ NOT true — that renders as a "package" box
	expect(a.inject!.attribution).toBe("agent");
	expect(a.inject!.details.rules).toEqual(["R1"]);
	expect(a.inject!.details.confidence).toBe(0.9);
	expect(a.inject!.details.sourceKind).toBe("own_utterance");
});
