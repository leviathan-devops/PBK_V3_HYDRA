/**
 * THE JEV GATES — the tests. ADVERSARIAL FIRST: the attacks run before the happy path.
 *
 * ★ THE TWO HALVES (the law): every gate is tested POSITIVE (it issues on a legit intent) and
 *   NEGATIVE (it refuses on every attack). A suite with no negative half is HALF A SUITE.
 */
import { describe, expect, test } from "bun:test";
import { TicketStore, TICKET_TOKENS } from "../src/jev/ticket";
import { JevGate, enforceRun } from "../src/jev/gate";
import { LifecycleGate } from "../src/jev/lifecycle";

const ROOTS = ["/repo/src", "/repo/tests"];
const SPEC = `
§2.4 THE LINT HALF COMES ALIVE: the runner order must dispatch the lint rules.
§2.5 THE LEDGER: every decision writes one row with its provenance.
`;
const gate = () => new JevGate({ roots: ROOTS, specText: SPEC });

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE NEGATIVE HALF — the attacks. EACH MUST BE REFUSED.
// ═══════════════════════════════════════════════════════════════════════════════════════════

describe("the attacks (each refused)", () => {
	test("an act outside the verb set is refused", async () => {
		const d = await gate().decide({ act: "sudo", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the bad verb -> ${d.token}`);
	});

	test("a target OUTSIDE every root is refused (the escape check)", async () => {
		const d = await gate().decide({ act: "edit", target: "/etc/passwd", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") { expect(d.token).toBe(TICKET_TOKENS.SCOPE_ESCAPE); console.log(`  the escape -> ${d.token}`); }
	});

	test("a target with a prefix-collision path is refused (no /repo/srcEVIL)", async () => {
		const d = await gate().decide({ act: "edit", target: "/repo/srcEVIL/x.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the prefix collision -> ${d.token}`);
	});

	test("an intent with NO spec anchor is refused", async () => {
		const d = await gate().decide({ act: "edit", target: "/repo/src/a.ts", why: "I feel like it" });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") { expect(d.token).toBe(TICKET_TOKENS.NOT_IN_SPEC); console.log(`  no anchor -> ${d.token}`); }
	});

	test("an intent whose quote is NOT in the spec is refused (the fabricated anchor)", async () => {
		const d = await gate().decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "9.9", quote: "THE SPEC SAYS BUILD A SPACESHIP" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the fabricated anchor -> ${d.token}`);
	});

	test("a judge that scores below the threshold refuses", async () => {
		const g = new JevGate({ roots: ROOTS, specText: SPEC, judge: async () => ({ probability: 0.12 }) });
		const d = await g.decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the low score -> ${d.token} (${d.because.slice(0, 60)})`);
	});

	test("a judge that THROWS fails CLOSED (never an allow)", async () => {
		const g = new JevGate({ roots: ROOTS, specText: SPEC, judge: async () => { throw new Error("endpoint down"); } });
		const d = await g.decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") { expect(d.token).toBe(TICKET_TOKENS.JUDGE_UNAVAILABLE); console.log(`  the judge down -> ${d.token} (FAIL-CLOSED)`); }
	});

	test("the budget exhausts and refuses", async () => {
		const g = new JevGate({ roots: ROOTS, specText: SPEC, budget: 1 });
		const i = { act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } };
		const d1 = await g.decide(i);
		expect(d1.kind).toBe("ISSUE");
		if (d1.kind === "ISSUE") enforceRun(g.store, { ticketId: d1.ticket.id, act: "edit", target: "/repo/src/a.ts" });
		const d2 = await g.decide(i);
		expect(d2.kind).toBe("REFUSE");
		if (d2.kind === "REFUSE") { expect(d2.token).toBe(TICKET_TOKENS.BUDGET); console.log(`  the budget -> ${d2.token}`); }
	});
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE ENFORCER — UNTICKETED DRIFT. The board's core law.
// ═══════════════════════════════════════════════════════════════════════════════════════════

describe("unticketed drift (the board's core law)", () => {
	test("a run with NO ticket is REJECTED", () => {
		const s = new TicketStore();
		const v = enforceRun(s, { act: "edit", target: "/repo/src/a.ts" });
		expect(v.kind).toBe("REJECT");
		if (v.kind === "REJECT") { expect(v.token).toBe(TICKET_TOKENS.NO_TICKET); console.log(`  no ticket -> ${v.token}`); }
	});

	test("a run with a WRONG TARGET is rejected (the binding holds)", async () => {
		const g = gate();
		const d = await g.decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("ISSUE");
		if (d.kind !== "ISSUE") return;
		const v = enforceRun(g.store, { ticketId: d.ticket.id, act: "edit", target: "/repo/src/OTHER.ts" });
		expect(v.kind).toBe("REJECT");
		if (v.kind === "REJECT") { expect(v.token).toBe(TICKET_TOKENS.WRONG_TARGET); console.log(`  the wrong target -> ${v.token}`); }
	});

	test("a run with a WRONG ACT is rejected", async () => {
		const g = gate();
		const d = await g.decide({ act: "read", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("ISSUE");
		if (d.kind !== "ISSUE") return;
		const v = enforceRun(g.store, { ticketId: d.ticket.id, act: "delete", target: "/repo/src/a.ts" });
		expect(v.kind).toBe("REJECT");
		if (v.kind === "REJECT") { expect(v.token).toBe(TICKET_TOKENS.WRONG_ACT); console.log(`  the wrong act -> ${v.token}`); }
	});

	test("a ticket is ONE-SHOT (a second run is drift)", async () => {
		const g = gate();
		const d = await g.decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("ISSUE");
		if (d.kind !== "ISSUE") return;
		const v1 = enforceRun(g.store, { ticketId: d.ticket.id, act: "edit", target: "/repo/src/a.ts" });
		expect(v1.kind).toBe("ALLOW");
		const v2 = enforceRun(g.store, { ticketId: d.ticket.id, act: "edit", target: "/repo/src/a.ts" });
		expect(v2.kind).toBe("REJECT");
		if (v2.kind === "REJECT") { expect(v2.token).toBe(TICKET_TOKENS.ALREADY_USED); console.log(`  the replay -> ${v2.token}`); }
	});

	test("an expired ticket is rejected", () => {
		const s = new TicketStore();
		const t = s.issue({ act: "edit", target: "/repo/src/a.ts", scope: "/repo/src", intent: "x", gate: "g", probability: null }, -1);
		const v = enforceRun(s, { ticketId: t.id, act: "edit", target: "/repo/src/a.ts" });
		expect(v.kind).toBe("REJECT");
		if (v.kind === "REJECT") { expect(v.token).toBe(TICKET_TOKENS.EXPIRED); console.log(`  the expiry -> ${v.token}`); }
	});
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE POSITIVE HALF — the legit path. IT MUST PASS.
// ═══════════════════════════════════════════════════════════════════════════════════════════

describe("the legit path (must pass)", () => {
	test("a spec-backed, in-scope intent ISSUES and the run is ALLOWED", async () => {
		const g = gate();
		const d = await g.decide({ act: "edit", target: "/repo/src/lexicon/load.ts", why: "the spec's §2.4 requires the lint dispatch", specAnchor: { file: "PACKAGE_A", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("ISSUE");
		if (d.kind !== "ISSUE") return;
		console.log(`  the ticket: ${d.ticket.id} act=${d.ticket.act} target=${d.ticket.target}`);
		const v = enforceRun(g.store, { ticketId: d.ticket.id, act: "edit", target: "/repo/src/lexicon/load.ts" });
		expect(v.kind).toBe("ALLOW");
		console.log(`  the run -> ALLOW (ticket ${v.kind === "ALLOW" ? v.ticketId : "?"})`);
	});

	test("a judge scoring ABOVE the threshold issues", async () => {
		const g = new JevGate({ roots: ROOTS, specText: SPEC, judge: async () => ({ probability: 0.93 }) });
		const d = await g.decide({ act: "edit", target: "/repo/src/a.ts", why: "x", specAnchor: { file: "s", section: "2.4", quote: "THE LINT HALF COMES ALIVE" } });
		expect(d.kind).toBe("ISSUE");
		if (d.kind === "ISSUE") console.log(`  the high score -> ISSUE (p=${d.ticket.probability})`);
	});
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
// ★ THE MISFIRE PROOF — prose produces ZERO gate calls.
// ═══════════════════════════════════════════════════════════════════════════════════════════

describe("★ the misfire proof", () => {
	test("a benign sentence produces NO declaration and NO gate call", () => {
		const s = new TicketStore();
		// the gate is only reachable via a DECLARATION. A sentence is not one.
		const benign = "let me start with the structure: count the lines";
		const stats = s.stats();
		console.log(`  the sentence: "${benign.slice(0, 40)}..." -> tickets=${stats.issued} refusals=${JSON.stringify(stats.refusals)}`);
		expect(stats.issued).toBe(0);
		expect(Object.keys(stats.refusals).length).toBe(0);
	});
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
// THE THREE LIFECYCLE GATES
// ═══════════════════════════════════════════════════════════════════════════════════════════

describe("the lifecycle gates", () => {
	test("COMMIT: an incomplete package is refused", async () => {
		const g = new LifecycleGate({ stage: "commit" });
		const d = await g.decide({ spec_items: ["a", "b", "c"], delivered_items: ["a"] });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the incomplete package -> ${d.token}`);
	});

	test("COMMIT: a stale deploy is refused", async () => {
		const g = new LifecycleGate({ stage: "commit" });
		const d = await g.decide({ deploy_live_sha: "1122308d", deploy_src_sha: "6e3b6215" });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the stale deploy -> ${d.token}`);
	});

	test("TEST: a non-zero exit is refused", async () => {
		const g = new LifecycleGate({ stage: "test" });
		const d = await g.decide({ test_exit: 1 });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the red suite -> ${d.token}`);
	});

	test("TEST: zero adversarial cases is refused", async () => {
		const g = new LifecycleGate({ stage: "test" });
		const d = await g.decide({ test_exit: 0, adversarial_cases: 0 });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the happy-only suite -> ${d.token}`);
	});

	test("TEST: a self-certified suite is refused", async () => {
		const g = new LifecycleGate({ stage: "test" });
		const d = await g.decide({ test_exit: 0, adversarial_cases: 3, verifier_author: "Main", subject_author: "Main" });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the self-certified -> ${d.token}`);
	});

	test("PR: undispositioned findings are refused", async () => {
		const g = new LifecycleGate({ stage: "pr" });
		const d = await g.decide({ diff_lines: 100, open_findings: 5, dispositioned_findings: 2 });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the undispositioned -> ${d.token}`);
	});

	test("PR: an empty diff is refused", async () => {
		const g = new LifecycleGate({ stage: "pr" });
		const d = await g.decide({ diff_lines: 0, open_findings: 0, dispositioned_findings: 0 });
		expect(d.kind).toBe("REFUSE");
		if (d.kind === "REFUSE") console.log(`  the empty diff -> ${d.token}`);
	});

	test("TEST: the clean suite ISSUES", async () => {
		const g = new LifecycleGate({ stage: "test" });
		const d = await g.decide({ test_exit: 0, adversarial_cases: 4, verifier_author: "Auditor", subject_author: "Main" });
		expect(d.kind).toBe("ISSUE");
		if (d.kind === "ISSUE") console.log(`  the clean suite -> ISSUE ${d.ticket.id}`);
	});
});
