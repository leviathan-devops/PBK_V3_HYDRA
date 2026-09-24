/**
 * THE JEV TICKET — the unit of authorization.
 *
 * ★ THE LAW (the operator's whiteboard): "Jev Gates emit a FLOW OF TICKETS for every tool run.
 *   AUTO-REJECT UNTICKETED DRIFT."
 *
 * THE SHIFT THIS MAKES: the old model DETECTED drift (score the span, judge it, block it) — so it
 * fired on benign prose. THIS model AUTHORIZES action: a tool run needs a ticket, and the ABSENCE
 * of a ticket IS the rejection. There is nothing to detect and nothing to misfire on.
 *
 * A TICKET IS BOUND TO ONE ACT ON ONE TARGET. It is one-shot: it is consumed by the run it
 * authorizes. A run whose target differs from the ticket's target is UNTICKETED DRIFT.
 */

/** The acts a ticket can authorize. An act not in this set can never be ticketed. */
export type Act =
	| "read"
	| "edit"
	| "create"
	| "delete"
	| "run"
	| "commit"
	| "test"
	| "review"
	| "deploy";

export interface Ticket {
	id: string; // the ticket's identity
	act: Act; // what it authorizes
	/** ★ THE BINDING: the exact target. A run whose target differs is UNTICKETED. */
	target: string;
	/** The scope root the target must live under — the escape check. */
	scope: string;
	/** The intent the agent declared, kept for the ledger. */
	intent: string;
	/** The gate that issued it. */
	gate: string;
	issuedAt: number;
	/** ★ ONE-SHOT: the ticket dies at this epoch even if unused. */
	expiresAt: number;
	/** ★ CONSUMED ONCE. A second run with the same ticket is drift. */
	consumedAt: number | null;
	/** The verdict's probability, when the judge was consulted. */
	probability: number | null;
}

/** ★ THE REFUSAL TOKENS — frozen, greppable, testable. A sentence would not be. */
export const TICKET_TOKENS = {
	NO_TICKET: "UNTICKETED_DRIFT",
	WRONG_TARGET: "TICKET_TARGET_MISMATCH",
	WRONG_ACT: "TICKET_ACT_MISMATCH",
	EXPIRED: "TICKET_EXPIRED",
	ALREADY_USED: "TICKET_ALREADY_CONSUMED",
	SCOPE_ESCAPE: "TICKET_SCOPE_ESCAPE",
	OUT_OF_SCOPE: "INTENT_OUT_OF_SCOPE",
	NOT_IN_SPEC: "INTENT_NOT_IN_SPEC",
	BUDGET: "TICKET_BUDGET_EXHAUSTED",
	JUDGE_UNAVAILABLE: "JUDGE_UNAVAILABLE",
} as const;

export type RefusalToken = (typeof TICKET_TOKENS)[keyof typeof TICKET_TOKENS];

/** THE DECISION — the gate's output. Either a ticket, or a named refusal. */
export type GateDecision =
	| { kind: "ISSUE"; ticket: Ticket }
	| { kind: "REFUSE"; token: RefusalToken; because: string };

/** THE ENFORCEMENT — the tool-run check's output. */
export type EnforceVerdict =
	| { kind: "ALLOW"; ticket: Ticket }
	| { kind: "REJECT"; token: RefusalToken; because: string };

/**
 * ★ THE TICKET STORE — append-only, the ledger of every issuance and consumption.
 *
 * THE LEDGER IS THE PRODUCT: it answers which act was authorized, on what target, by which gate,
 * at what probability, and whether it was used. A ticket with no ledger row is unproven.
 */
export class TicketStore {
	private readonly issued: Ticket[] = [];
	private readonly used = new Set<string>();
	/** ★ THE BUDGET — the board's "36 tickets to touch anything" is a LIVE number. */
	private budget: number;
	/** The count of refusals, by token — the drift census. */
	readonly refusals: Record<string, number> = {};

	constructor(budget = Number.POSITIVE_INFINITY) {
		this.budget = budget;
	}

	issue(t: Omit<Ticket, "id" | "issuedAt" | "expiresAt" | "consumedAt">, ttlMs = 60_000): Ticket {
		const now = Date.now();
		const ticket: Ticket = {
			...t,
			id: `tk_${(this.issued.length + 1).toString(36)}_${now.toString(36)}`,
			issuedAt: now,
			expiresAt: now + ttlMs,
			consumedAt: null,
		};
		this.issued.push(ticket);
		return ticket;
	}

	/** ★ THE CONSUMPTION — one-shot. Returns the ticket, or null if it cannot be consumed. */
	consume(id: string): Ticket | null {
		const t = this.issued.find((x) => x.id === id);
		if (!t) return null;
		if (this.used.has(id)) return null;
		if (Date.now() > t.expiresAt) return null;
		this.used.add(id);
		t.consumedAt = Date.now();
		return t;
	}

	find(id: string): Ticket | undefined {
		return this.issued.find((x) => x.id === id);
	}

	/** The live budget: issued minus consumed. */
	remaining(): number {
		return this.budget - this.used.size;
	}

	/** Record a refusal — the drift census. Every rejection is a datum. */
	noteRefusal(token: RefusalToken): void {
		this.refusals[token] = (this.refusals[token] ?? 0) + 1;
	}

	/** The ledger view — every issuance, in order. */
	ledger(): readonly Ticket[] {
		return this.issued;
	}

	stats(): { issued: number; consumed: number; remaining: number; refusals: Record<string, number> } {
		return {
			issued: this.issued.length,
			consumed: this.used.size,
			remaining: this.remaining(),
			refusals: { ...this.refusals },
		};
	}
}
