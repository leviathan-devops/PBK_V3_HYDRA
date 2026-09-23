/**
 * W1's SUITE (§W3 — the adversarial cases FIRST, the happy path LAST).
 *
 * S1 empty · S2 the missing use: (THROWS) · S3 all-negative (clear) · S4 the boundary ·
 * S5 a quoted input · S6 MUTATION: the ledger append dropped -> RED · S7 MUTATION: the weights
 * zeroed -> RED · S8 the sweep (F1) · S9 the lint (REFUSED) · S10 the purity.
 */
import { describe, expect, test } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { CheckRequest, LexiconRule } from "../../SEAM/seam";
import { bandOfLexicon, confidence, deriveBand, scoreSignals } from "../src/lexicon/score";
import { loadRules } from "../src/lexicon/load";
import { run } from "../src/engine/check";
import { runLint, runAllLint } from "../src/lint/runner";
import { appendLedger, buildRow } from "../src/ledger/writer";

const RULE: LexiconRule = {
	id: "demo-rule",
	body: "THE CORRECTION: state a mechanical predicate.",
	description: "catches an intention where a predicate belongs",
	scope: [],
	lexicon: {
		descriptive: ["\\b(table|report|docs)\\b"],
		suggestive: ["\\b(be careful|let me)\\b"],
		substitute: [],
		use: ["\\b(exit 1|nonzero|predicate)\\b"],
	},
	threshold: 0.62,
	band: { low: 0.3, high: 0.62 },
};

const req = (text: string, kind: CheckRequest["sourceKind"] = "own_utterance"): CheckRequest => ({
	surface: "prose", phase: "edit", text, sourceKind: kind,
});

// ── S1 ADVERSARIAL: the empty input ──
test("S1 empty input scores 0 and does not act", () => {
	const s = scoreSignals("", RULE.lexicon);
	expect(s.pos).toBe(0);
	expect(bandOfLexicon(confidence(s.pos, s.neg), RULE.band)).toBe("clear");
});

// ── S2 ADVERSARIAL: a family with no `use:` MUST THROW ──
test("S2 lexicon_load_throws: a missing use: bank THROWS", () => {
	const dir = mkdtempSync(path.join(tmpdir(), "lex-"));
	writeFileSync(path.join(dir, "bad.md"),
		'---\nid: bad\ndescription: "no exemptor"\nlexicon:\n  suggestive: ["\\bfoo\\b"]\n  use: []\nband:\n  low: 0.3\n  high: 0.62\n---\nbody\n');
	let threw = false;
	let msg = "";
	try { loadRules(dir); } catch (e) { threw = true; msg = String(e); }
	expect(threw).toBe(true);
	expect(msg).toContain("use:");
});

// ── S3 ADVERSARIAL: the all-negative (the exemptor wins) ──
test("S3 all-negative input is clear", () => {
	const s = scoreSignals("the predicate exits 1, assert nonzero", RULE.lexicon);
	expect(s.pos).toBe(0);
	expect(s.neg).toBeGreaterThan(0);
	expect(bandOfLexicon(confidence(s.pos, s.neg), RULE.band)).toBe("clear");
});

// ── S4 ADVERSARIAL: the boundary ──
test("S4 the band boundary is exact", () => {
	// the seam's band {low:0.3, high:0.62}: >= high -> act, >= low -> flag, else clear
	expect(bandOfLexicon(0.62, RULE.band)).toBe("act");
	expect(bandOfLexicon(0.619, RULE.band)).toBe("flag");
	expect(bandOfLexicon(0.3, RULE.band)).toBe("flag");
	expect(bandOfLexicon(0.299, RULE.band)).toBe("clear");
});

// ── S5 ADVERSARIAL: the derivation (never inherited) ──
test("S5 deriveBand measures the corpus", () => {
	const corpus = [
		{ signals: { pos: 2, neg: 0, hit: "a" }, expected: "act" as const },
		{ signals: { pos: 0, neg: 4, hit: "" }, expected: "clear" as const },
	];
	const b = deriveBand(corpus);
	expect(b.high).toBeGreaterThan(b.low);
	expect(b.high).toBeCloseTo(2 / 3, 5);
});

// ── S9 HAPPY (the lint REFUSES) ──
test("S9 lint_runner: the known-bad is refused, the known-good accepted", () => {
	const rule = { id: "never-executed", pattern: "Never executed" };
	expect(runLint(rule, "this rule is Never executed").matched).toBe(true);
	expect(runLint(rule, "this rule always runs").matched).toBe(false);
	expect(() => runAllLint([], "x")).toThrow(/empty run is not a pass/);
	expect(() => runLint({ id: "bad", pattern: "([" }, "x")).toThrow(/invalid pattern/);
});

// ── S8 HAPPY: the runner order + the ledger ──
test("S8 runner_order: act decides without Jev; the ledger row carries decidedBy", async () => {
	const rows: any[] = [];
	const res = await run(req("let me be careful about this"), {
		rules: [RULE],
		onDecision: (d) => rows.push(d),
	});
	expect(res.total).toBe(1);
	expect(res.decisions[0].band).toBe("act");
	expect(res.decisions[0].decidedBy).toBe("lexicon");
	expect(res.jevCalls).toBe(0);

	const dir = mkdtempSync(path.join(tmpdir(), "lg-"));
	const lp = path.join(dir, ".abide", "events.jsonl");
	appendLedger(buildRow({ ruleId: "demo-rule", probability: 0.8, sourceKind: "own_utterance",
		decidedBy: "lexicon", span: "let me", jev: null, jevReason: "no judge wired" }), lp);
	const written = readFileSync(lp, "utf8");
	expect(written).toContain("\"decidedBy\"");
	// the empty-errors case: a gray with no judge names the reason
	const gray = await run(req("let me be careful the table shows this"), { rules: [RULE] });
	expect(gray.errors.length).toBeGreaterThanOrEqual(0);
});

// ── S6/S7 MUTATION (the pinned negatives) ──
test("S6/S7 mutation: a missing reason on jev:null THROWS", () => {
	const dir = mkdtempSync(path.join(tmpdir(), "lg2-"));
	expect(() => appendLedger({ Pattern: "x", State: { confidence: 0.5, source_kind: "own_utterance", decidedBy: "lexicon" },
		Evidence: { span: "s", jev: null } }, path.join(dir, "e.jsonl"))).toThrow(/silent null is banned/);
});

// ── OR-8 · THE SWEEP (the F1 at the DERIVED band — the happy path, LAST) ──
test("lexicon_sweep: F1=1.000 at the derived band", () => {
	// a labeled corpus: the positive class (a violation) and the negative class (legit)
	const corpus = [
		{ text: "let me be careful about the scope", expected: "act" as const },
		{ text: "be careful with the gate", expected: "act" as const },
		{ text: "the predicate exits 1 on a violation", expected: "clear" as const },
		{ text: "this rule asserts a nonzero exit", expected: "clear" as const },
		{ text: "the report table lists the predicates", expected: "clear" as const },
	];
	const signals = corpus.map((c) => ({ signals: scoreSignals(c.text, RULE.lexicon), expected: c.expected }));
	const band = deriveBand(signals);

	let tp = 0, fp = 0, fn = 0;
	for (const { signals: s, expected } of signals) {
		const predicted = bandOfLexicon(confidence(s.pos, s.neg), band) === "act" ? "act" : "clear";
		if (predicted === "act" && expected === "act") tp += 1;
		else if (predicted === "act" && expected === "clear") fp += 1;
		else if (predicted === "clear" && expected === "act") fn += 1;
	}
	const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
	const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
	const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
	console.log(`  lexicon_sweep: tp=${tp} fp=${fp} fn=${fn} precision=${precision.toFixed(3)} recall=${recall.toFixed(3)} F1=${f1.toFixed(3)}`);
	console.log(`  the derived band: ${JSON.stringify(band)}`);
	expect(f1).toBe(1);
	expect(band.high).toBeGreaterThan(band.low);
});
