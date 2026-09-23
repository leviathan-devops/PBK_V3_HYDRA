/**
 * P7 - THE ADVERSARIAL SWEEP: the known defects, re-probed against the NEW tree.
 *
 * THE PATTERNS ARE COPIED VERBATIM from the live rule file, emitted with JSON.stringify so the
 * backslashes survive. FOUR earlier drafts produced false failures by hand-building the regexes
 * or by template-literal escaping (\b became a BACKSPACE, not a word boundary). All adjudicated
 * as PROBE ERRORS (Side A). THE LESSON: copy the authority, and emit it with a real serializer.
 */
import { describe, expect, test } from "bun:test";
import type { LexiconRule } from "../SEAM/seam";
import { bandOfLexicon, confidence, scoreSignals } from "../src/lexicon/score";
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
	expect(infl.pos).toBeGreaterThan(0);
	console.log("  HT-BUG-3 STATUS OPEN: an inflected form does not match the base-form exemptor");
});

test("P7-HT-BUG-4 the double-match", () => {
	const a = score(SHORT), b = score(LONG);
	console.log(`  HT-BUG-4 short pos=${a.pos} c=${a.c.toFixed(3)} band=${a.band}`);
	console.log(`  HT-BUG-4 long  pos=${b.pos} c=${b.c.toFixed(3)} band=${b.band}`);
	expect(b.pos).toBeGreaterThan(a.pos);
	console.log("  HT-BUG-4 STATUS OPEN: two members share the tail; the score doubles");
});

test("P7-HT-BUG-5 the process narration fires", () => {
	const real = score(LONG + " about the doc-density gate: these are .md writes.");
	console.log(`  HT-BUG-5 the real span pos=${real.pos} band=${real.band}`);
	expect(real.band).toBe("act");
	console.log("  HT-BUG-5 STATUS OPEN: a process hedge fires like a design instruction");
});

test("P7-HT-BUG-6 the self-reference loop", () => {
	const meta = score("Now I must " + SHORT + " (no, that is the banned phrase). Let me EXECUTE.");
	console.log(`  HT-BUG-6 the meta-correction pos=${meta.pos} neg=${meta.neg} band=${meta.band}`);
	expect(meta.band === "act" || meta.band === "flag").toBe(true);
	console.log("  HT-BUG-6 STATUS OPEN: the meta-correction re-fires");
});

test("P7-HT-BUG-10 the audit gate blind-pass class", () => {
	const artifact = { status: "completed_with_errors", summary: { comments: 10, files_reviewed: 2 } };
	const gate = { findings: 0, filesReviewed: "?" };
	expect(gate.findings === artifact.summary.comments).toBe(false);
	console.log(`  HT-BUG-10 the gate said ${gate.findings}; the artifact says ${artifact.summary.comments}`);
	console.log("  HT-BUG-10 STATUS OPEN: the summary is not derived from the artifact");
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
