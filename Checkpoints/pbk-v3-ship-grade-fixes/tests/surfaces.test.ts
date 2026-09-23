/**
 * W2's SUITE (§W3 — the adversarial cases FIRST, the happy path LAST).
 *
 * S1 the FP control · S1b the quote-state walk · S3 the split delta · S4 the repeat storm ·
 * S5 the empty text · S6 an empty correction (LOUD FAIL) · S9 the 4 surfaces -> the 4 kinds ·
 * S7/S8 the mutation negatives.
 */
import { describe, expect, test } from "bun:test";
import type { CheckResult, Decision, SrcKind } from "../SEAM/seam";
import { SCORABLE, classifySource, isScorable } from "../src/gate/source-kind";
import { isQuotedMatch } from "../src/gate/quote";
import { StreamBuffer } from "../src/surfaces/stream";
import { proseAction, CORRECTION_TYPE } from "../src/surfaces/prose";
import { toolAction } from "../src/surfaces/tool";
import { resultAction } from "../src/surfaces/result";
import { postAction, POST_TOOL_USE_BOUND } from "../src/surfaces/post";
import { actionFor, actionMatrix, SURFACES } from "../src/action/dispatch";

const BC = "be careful";

const dec = (over: Partial<Decision> = {}): Decision => ({
	ruleId: "instr-not-pred", band: "act", probability: 0.667, decidedBy: "lexicon",
	sourceKind: "own_utterance", span: BC, correction: "state a predicate.",
	capped: false, ...over,
});
const res = (ds: Decision[], extra: Partial<CheckResult> = {}): CheckResult =>
	({ decisions: ds, jevCalls: 0, total: ds.length, errors: [], ...extra });

// ── S1 ADVERSARIAL: the FP control (only own_utterance is scorable) ──
test("S1 source_kind_gate: only own_utterance is scorable", () => {
	expect(SCORABLE.has("own_utterance")).toBe(true);
	expect(SCORABLE.has("quotation")).toBe(false);
	expect(SCORABLE.size).toBe(1);
	// the contract: classifySource(line, inFence, fileKind) — inFence is a PARAMETER
	const cases: [string, SrcKind][] = [
		["| a | table |", "table"],
		["- `quoted`", "quotation"],
		["> a quote", "quotation"],
		["# heading", "doc"],
		["plain prose", "own_utterance"],
	];
	for (const [line, expected] of cases) expect(classifySource(line, false, "md")).toBe(expected);
	// inFence WINS over every line shape (the fence is the strongest signal)
	expect(classifySource("plain prose", true, "md")).toBe("rule_source");
	expect(classifySource("| a | table |", true, "md")).toBe("rule_source");
	// the fileKind fallbacks
	expect(classifySource("plain", false, "rule")).toBe("rule_source");
	expect(classifySource("plain", false, "doc")).toBe("doc");
});

// ── S1b: the quote-state walk ──
test("S1b quote_state: the walk handles open/closed/escaped/absent", () => {
	expect(isQuotedMatch('say "' + BC + '"', BC)).toBe(true);   // inside double
	expect(isQuotedMatch("say `" + BC + "`", BC)).toBe(true);   // inside backtick
	expect(isQuotedMatch(BC + " now", BC)).toBe(false);         // absent
	expect(isQuotedMatch('"a" then ' + BC, BC)).toBe(false);    // the region CLOSED
	expect(isQuotedMatch("a 'x " + BC, BC)).toBe(true);         // inside single
	expect(isQuotedMatch("x", "")).toBe(false);                 // empty match
});

// ── S3 ADVERSARIAL: the split delta ──
test("S3 delta_accumulator: a line split across deltas assembles", () => {
	const b = new StreamBuffer();
	const r1 = b.push("the agent is be");
	expect(r1.lines.length).toBe(0); // no newline yet — still buffered
	const r2 = b.push("ing " + BC + " here\n");
	expect(r2.lines.length).toBe(1);
	expect(r2.lines[0]).toContain(BC);
});

// ── S4 ADVERSARIAL: the repeat storm (the dedupe) ──
test("S4 abort_dedupe: the same signature fires ONCE", () => {
	const b = new StreamBuffer();
	let fires = 0;
	for (let i = 0; i < 10; i++) if (b.shouldFire("r1", "span-a")) fires += 1;
	expect(fires).toBe(1);
	expect(b.shouldFire("r1", "span-b")).toBe(true);
	b.reset();
	expect(b.shouldFire("r1", "span-a")).toBe(true);
});

// ── S5 ADVERSARIAL: the empty text ──
test("S5 empty text: no abort, no throw", () => {
	const b = new StreamBuffer();
	expect(b.push("").lines.length).toBe(0);
	expect(proseAction(res([])).inject).toBe(null);
	expect(proseAction(res([])).abort.length).toBe(0);
	expect(toolAction(res([])).block).toBe(false);
	expect(resultAction(res([])).isError).toBe(false);
	expect(postAction(res([])).demand).toBe(null);
});

// ── S6 ADVERSARIAL: an empty correction is a LOUD fail ──
test("S6 an empty correction THROWS (no silent abort)", () => {
	expect(() => proseAction(res([dec({ correction: "" })]))).toThrow(/silent abort is banned/);
});

// ── S9 HAPPY: the 4 surfaces -> the 4 actions ──
test("S9 action_map: the 4 surfaces produce the right kind", () => {
	expect(actionFor("prose", "act")).toBe("abort");
	expect(actionFor("tool-call", "act")).toBe("block");
	expect(actionFor("tool-result", "act")).toBe("repair");
	expect(actionFor("post-tool-use", "act")).toBe("repair");
	expect(actionFor("prose", "flag")).toBe("record");
	expect(actionFor("prose", "clear")).toBe("none");
	expect(Object.keys(actionMatrix()).length).toBe(4);
	expect(SURFACES.length).toBe(4);
	const a = proseAction(res([dec()]));
	expect(a.inject?.customType).toBe(CORRECTION_TYPE);
	expect(a.inject?.customType).toBe("ttsr-injection");
	expect(POST_TOOL_USE_BOUND).toBe(false);
});

// ── S7/S8 MUTATION (the pinned negatives) ──
test("S7/S8 mutation: the dedupe + the SCORABLE set are load-bearing", () => {
	const b = new StreamBuffer();
	expect([1, 2, 3].map(() => b.shouldFire("r", "s")).filter(Boolean).length).toBe(1);
	expect([...SCORABLE]).toEqual(["own_utterance"]);
	expect(isScorable("quotation")).toBe(false);
	expect(isScorable("own_utterance")).toBe(true);
});
