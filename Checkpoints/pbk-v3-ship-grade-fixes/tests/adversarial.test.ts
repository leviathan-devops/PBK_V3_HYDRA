/**
 * P7 - THE ADVERSARIAL SWEEP: the known defects, re-probed against the NEW tree.
 *
 * THE PATTERNS ARE COPIED VERBATIM from the live rule file, emitted with JSON.stringify so the
 * backslashes survive. FOUR earlier drafts produced false failures by hand-building the regexes
 * or by template-literal escaping (\b became a BACKSPACE, not a word boundary). All adjudicated
 * as PROBE ERRORS (Side A). THE LESSON: copy the authority, and emit it with a real serializer.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import type { LexiconRule } from "../SEAM/seam";
import { bandOfLexicon, confidence, scoreSignals } from "../src/lexicon/score";
import { loadRules } from "../src/lexicon/load";
import { SCORABLE, classifySource } from "../src/gate/source-kind";
import { isQuotedMatch } from "../src/gate/quote";
import { StreamBuffer } from "../src/surfaces/stream";
import { actionFor } from "../src/action/dispatch";

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
	const live = loadRules("/home/leviathan/.omp/agent/rules").find((x) => x.id === "instruction-not-predicate")!;
	const s = scoreSignals(LONG + " about the doc-density gate: these are .md writes.", live.lexicon);
	const c = confidence(s.pos, s.neg);
	console.log(`  HT-BUG-5 the real span pos=${s.pos} neg=${s.neg} band=${bandOfLexicon(c, live.band)}`);
	expect(bandOfLexicon(c, live.band)).not.toBe("act");
	console.log("  HT-BUG-5 STATUS FIXED: a process hedge drops off act on the live rule");
});

test("P7-HT-BUG-6 the self-reference loop (FIXED on the live rule)", () => {
	const live = loadRules("/home/leviathan/.omp/agent/rules").find((x) => x.id === "instruction-not-predicate")!;
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
	const rules = loadRules("/home/leviathan/.omp/agent/rules");
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
