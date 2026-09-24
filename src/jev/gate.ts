/**
 * THE JEV GATE — the mechanical decision algorithm.
 *
 * ★ THE LAW (the operator's whiteboard): "Jev Gates emit a flow of tickets for every tool run."
 *
 * THE ALGORITHM — four steps, in order, each one cheaper than the next:
 *
 *   STEP 1 · THE DETERMINISTIC PRE-FILTER   (pure code, FREE, no model)
 *     · is the act in the allowed verb set?          -> no  = REFUSE
 *     · is the target inside the authorized scope?   -> no  = REFUSE (the escape check)
 *     · is the budget available?                     -> no  = REFUSE
 *     ★ A REFUSAL HERE COSTS NOTHING. Most drift dies at this step.
 *
 *   STEP 2 · THE SPEC CHECK                 (pure code, FREE)
 *     · does the declared intent trace to a spec item? -> no = REFUSE
 *     ★ This is the step the whole derailment class dies at: an act with no spec
 *       backing is not ticketed.
 *
 *   STEP 3 · THE JEV JUDGMENT               (the model, ~100ms, ONLY when 1+2 pass)
 *     · does the intent MATCH the spec requirement?
 *     · is this the SMALLEST act that satisfies it?
 *     ★ The judge is consulted ONLY on a pre-filtered, spec-backed intent. The gray
 *       zone is tiny by construction — that is the cost model.
 *
 *   STEP 4 · THE ISSUANCE                   (pure code)
 *     · a ticket, BOUND to the exact target, ONE-SHOT, with a TTL.
 *
 * ★ THE ANTI-MISFIRE PROPERTY: the gate is invoked by an ACTION DECLARATION, never by
 *   prose. A sentence produces no declaration, so the gate is never called on a sentence.
 */
import { TicketStore, TICKET_TOKENS, type Act, type GateDecision, type RefusalToken } from "./ticket";

/** The allowed act verbs. An act outside this set can never be ticketed. */
const ALLOWED_ACTS: readonly Act[] = ["read", "edit", "create", "delete", "run", "commit", "test", "review", "deploy"];

/** ★ THE DECLARED INTENT — what the agent asks for. NOT prose; a structured request. */
export interface IntentDeclaration {
	act: string; // the verb
	target: string; // the exact path/command the act applies to
	why: string; // the reason — must trace to a spec item
	/** The spec anchor the intent claims. The gate VERIFIES it against the spec text. */
	specAnchor?: { file: string; section: string; quote: string };
}

/** The judge's contract — the same shape as the engine's, so a judge is pluggable. */
export type IntentJudge = (
	intent: IntentDeclaration,
	specText: string,
) => Promise<{ probability: number; reason?: string }>;

/** The scope config — the authorized roots and the spec file. */
export interface GateConfig {
	/** The roots an act's target may live under. A target outside = SCOPE_ESCAPE. */
	roots: readonly string[];
	/** The spec's text (read from disk by the caller — the gate never reads prose). */
	specText: string;
	/** The judge. ABSENT => a spec-backed deterministic-only gate (still mechanical). */
	judge?: IntentJudge;
	/** The act threshold for the judge's verdict. */
	actThreshold?: number;
	/** The budget — the board's "36 tickets to touch anything". */
	budget?: number;
}

/** Does the target live under one of the authorized roots? A pure string check. */
function inScope(target: string, roots: readonly string[]): boolean {
	return roots.some((r) => target === r || target.startsWith(r.endsWith("/") ? r : r + "/"));
}

/** Does the intent's spec quote actually appear in the spec text? A pure string check. */
function specBacked(intent: IntentDeclaration, specText: string): boolean {
	if (!intent.specAnchor) return false;
	const q = intent.specAnchor.quote.trim();
	if (q.length < 8) return false; // a trivial quote is not an anchor
	return specText.includes(q);
}

/**
 * ★ THE GATE — the mechanical decision algorithm. Pure w.r.t. the world (no I/O): the caller
 * supplies the spec text and the roots, so the gate is unit-testable and deterministic.
 */
export class JevGate {
	readonly store: TicketStore;
	constructor(
		private readonly cfg: GateConfig,
		store?: TicketStore,
	) {
		this.store = store ?? new TicketStore(cfg.budget ?? Number.POSITIVE_INFINITY);
	}

	private refuse(token: RefusalToken, because: string): GateDecision {
		this.store.noteRefusal(token);
		return { kind: "REFUSE", token, because };
	}

	async decide(intent: IntentDeclaration): Promise<GateDecision> {
		// ── STEP 1 · THE DETERMINISTIC PRE-FILTER (free) ─────────────────────────────
		if (!ALLOWED_ACTS.includes(intent.act as Act)) {
			return this.refuse(TICKET_TOKENS.NO_TICKET, `the act "${intent.act}" is not a ticketable verb`);
		}
		if (!inScope(intent.target, this.cfg.roots)) {
			return this.refuse(TICKET_TOKENS.SCOPE_ESCAPE, `the target "${intent.target}" is outside every authorized root`);
		}
		if (this.store.remaining() <= 0) {
			return this.refuse(TICKET_TOKENS.BUDGET, `the ticket budget is exhausted (${this.store.remaining()} remaining)`);
		}

		// ── STEP 2 · THE SPEC CHECK (free) ───────────────────────────────────────────
		if (!specBacked(intent, this.cfg.specText)) {
			return this.refuse(
				TICKET_TOKENS.NOT_IN_SPEC,
				`the intent cites no spec anchor whose quote appears in the spec ` +
					`(${intent.specAnchor ? `"${intent.specAnchor.quote.slice(0, 40)}" not found` : "no anchor given"})`,
			);
		}

		// ── STEP 3 · THE JEV JUDGMENT (the model — ONLY when 1+2 passed) ─────────────
		let probability: number | null = null;
		if (this.cfg.judge) {
			try {
				const v = await this.cfg.judge(intent, this.cfg.specText);
				probability = v.probability;
				const threshold = this.cfg.actThreshold ?? 0.85;
				if (v.probability < threshold) {
					return this.refuse(
						TICKET_TOKENS.NOT_IN_SPEC,
						`the judge scored the intent ${v.probability.toFixed(3)} < ${threshold} ` +
							`(the intent does not match the spec requirement)`,
					);
				}
			} catch (e) {
				// ★ FAIL-CLOSED: a judge that cannot answer cannot authorize.
				return this.refuse(TICKET_TOKENS.JUDGE_UNAVAILABLE, `the judge threw: ${String(e).slice(0, 120)}`);
			}
		}

		// ── STEP 4 · THE ISSUANCE ────────────────────────────────────────────────────
		const ticket = this.store.issue({
			act: intent.act as Act,
			target: intent.target,
			scope: this.cfg.roots[0] ?? "",
			intent: intent.why,
			gate: "edit-gate",
			probability,
		});
		return { kind: "ISSUE", ticket };
	}
}

/**
 * ★ THE ENFORCER — the tool-run check. THE ABSENCE OF A TICKET IS THE REJECTION.
 *
 * Called by the tool-run hook with the ticket id the run presents (or none) and the run's
 * ACTUAL act+target. A mismatch is UNTICKETED DRIFT.
 */
export function enforceRun(
	store: TicketStore,
	presented: { ticketId?: string; act: string; target: string },
): { kind: "ALLOW"; ticketId: string } | { kind: "REJECT"; token: RefusalToken; because: string } {
	const reject = (token: RefusalToken, because: string) => {
		store.noteRefusal(token);
		return { kind: "REJECT" as const, token, because };
	};
	if (!presented.ticketId) {
		return reject(TICKET_TOKENS.NO_TICKET, `the run presents no ticket (act="${presented.act}" target="${presented.target}")`);
	}
	const t = store.find(presented.ticketId);
	if (!t) return reject(TICKET_TOKENS.NO_TICKET, `no such ticket: ${presented.ticketId}`);
	if (t.consumedAt !== null) return reject(TICKET_TOKENS.ALREADY_USED, `the ticket ${t.id} was already consumed`);
	if (Date.now() > t.expiresAt) return reject(TICKET_TOKENS.EXPIRED, `the ticket ${t.id} expired`);
	if (t.act !== presented.act) {
		return reject(TICKET_TOKENS.WRONG_ACT, `the ticket authorizes "${t.act}", the run is "${presented.act}"`);
	}
	if (t.target !== presented.target) {
		return reject(TICKET_TOKENS.WRONG_TARGET, `the ticket is bound to "${t.target}", the run targets "${presented.target}"`);
	}
	const consumed = store.consume(t.id);
	if (!consumed) return reject(TICKET_TOKENS.ALREADY_USED, `the ticket ${t.id} could not be consumed`);
	return { kind: "ALLOW", ticketId: t.id };
}
