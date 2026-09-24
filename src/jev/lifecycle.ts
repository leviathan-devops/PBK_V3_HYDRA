/**
 * THE THREE LIFECYCLE GATES — the board's bottom half.
 *
 *   Commit ──> JEV PACKAGE AUDIT GATE
 *   Test   ──> JEV TEST AUDIT GATE
 *   PR     ──> JEV THANATOS REVIEW GATE
 *
 * ★ EACH IS THE SAME SHAPE as the edit-gate (deterministic pre-filter -> judgment -> a
 *   ticket or a named refusal). THE DIFFERENCE IS THE STATE IT READS AND THE QUESTION IT ASKS.
 *
 * ★ THE STATE IS READ FROM DISK, NEVER FROM THE AGENT. That is what makes the gate a
 *   MEASUREMENT rather than an opinion.
 */
import { TicketStore, TICKET_TOKENS, type GateDecision } from "./ticket";

/** The three lifecycle stages the board names. */
export type LifecycleStage = "commit" | "test" | "pr";

/** ★ THE STATE — every field is a fact read from disk by the caller. Never agent prose. */
export interface LifecycleState {
	staged_files?: readonly string[];
	changed_files?: readonly string[];
	spec_items?: readonly string[];
	delivered_items?: readonly string[];
	test_command?: string;
	test_exit?: number | null;
	test_imports?: readonly string[];
	adversarial_cases?: number;
	diff_lines?: number;
	verifier_author?: string;
	subject_author?: string;
	open_findings?: number;
	dispositioned_findings?: number;
	deploy_live_sha?: string;
	deploy_src_sha?: string;
}

/** ★ THE LIFECYCLE JUDGE — one question, one verdict, calibrated. */
export type LifecycleJudge = (stage: LifecycleStage, state: LifecycleState) => Promise<{ probability: number }>;

export interface LifecycleGateConfig {
	stage: LifecycleStage;
	actThreshold?: number;
	judge?: LifecycleJudge;
}

/** A mechanical check: a named predicate over the state. Returns true when it FAILS. */
interface Check {
	id: string;
	token: string;
	because: string;
	test: (s: LifecycleState) => boolean;
}

/** ★ THE COMMIT GATE — is what you are committing the AUTHORIZED package? */
const COMMIT_CHECKS: Check[] = [
	{
		id: "spec_coverage",
		token: "PACKAGE_SPEC_INCOMPLETE",
		because: "the delivered item count is below the spec's item count",
		test: (s) => !!s.spec_items && !!s.delivered_items && s.delivered_items.length < s.spec_items.length,
	},
	{
		id: "deploy_current",
		token: "PACKAGE_DEPLOY_STALE",
		because: "the deployed sha differs from the source sha",
		test: (s) => !!s.deploy_live_sha && !!s.deploy_src_sha && s.deploy_live_sha !== s.deploy_src_sha,
	},
	{
		id: "no_staged_outside_spec",
		token: "PACKAGE_UNSCOPED_CHANGE",
		because: "staged files exist that the changed set does not name",
		test: (s) => !!s.staged_files && !!s.changed_files && s.staged_files.length > s.changed_files.length,
	},
];

/** ★ THE TEST GATE — are the tests the AUTHORIZED tests? */
const TEST_CHECKS: Check[] = [
	{
		id: "exit_zero",
		token: "TEST_NOT_GREEN",
		because: "the test command's exit code is not 0",
		test: (s) => s.test_exit !== null && s.test_exit !== undefined && s.test_exit !== 0,
	},
	{
		id: "negative_half",
		token: "TEST_NO_NEGATIVE_HALF",
		because: "zero adversarial cases — a suite with no negative half is HALF A SUITE",
		test: (s) => s.adversarial_cases !== undefined && s.adversarial_cases < 1,
	},
	{
		id: "self_certified",
		token: "TEST_SELF_CERTIFIED",
		because: "the verifier and the subject share an author",
		test: (s) => !!s.verifier_author && !!s.subject_author && s.verifier_author === s.subject_author,
	},
];

/** ★ THE PR GATE — the THANATOS adversarial review. */
const PR_CHECKS: Check[] = [
	{
		id: "findings_dispositioned",
		token: "PR_FINDINGS_UNDISPOSITIONED",
		because: "open findings remain without a disposition (FIXED or ADJUDICATED)",
		test: (s) =>
			s.open_findings !== undefined && s.dispositioned_findings !== undefined &&
			s.dispositioned_findings < s.open_findings,
	},
	{
		id: "not_empty_diff",
		token: "PR_EMPTY_DIFF",
		because: "the diff has zero lines — a PR with no change is not a review target",
		test: (s) => s.diff_lines !== undefined && s.diff_lines === 0,
	},
];

const CHECKS: Record<LifecycleStage, Check[]> = {
	commit: COMMIT_CHECKS,
	test: TEST_CHECKS,
	pr: PR_CHECKS,
};

/**
 * ★ THE LIFECYCLE GATE — the same algorithm at three checkpoints.
 * ORDER: the mechanical checks (free) -> the judge (only if they pass) -> the ticket.
 */
export class LifecycleGate {
	readonly store: TicketStore;
	constructor(
		private readonly cfg: LifecycleGateConfig,
		store?: TicketStore,
	) {
		this.store = store ?? new TicketStore();
	}

	private refuse(token: string, because: string): GateDecision {
		this.store.noteRefusal(token as never);
		return { kind: "REFUSE", token: token as never, because };
	}

	async decide(state: LifecycleState): Promise<GateDecision> {
		for (const c of CHECKS[this.cfg.stage]) {
			if (c.test(state)) return this.refuse(c.token, `${c.id}: ${c.because}`);
		}

		let probability: number | null = null;
		if (this.cfg.judge) {
			try {
				const v = await this.cfg.judge(this.cfg.stage, state);
				probability = v.probability;
				const threshold = this.cfg.actThreshold ?? 0.85;
				if (v.probability < threshold) {
					return this.refuse(
						`${this.cfg.stage.toUpperCase()}_JUDGE_REJECTED`,
						`the judge scored the ${this.cfg.stage} ${v.probability.toFixed(3)} < ${threshold}`,
					);
				}
			} catch (e) {
				return this.refuse(TICKET_TOKENS.JUDGE_UNAVAILABLE, `the judge threw: ${String(e).slice(0, 120)}`);
			}
		}

		const ticket = this.store.issue({
			act: this.cfg.stage === "commit" ? "commit" : this.cfg.stage === "test" ? "test" : "review",
			target: this.cfg.stage,
			scope: "",
			intent: `the ${this.cfg.stage} gate authorized`,
			gate: `${this.cfg.stage}-gate`,
			probability,
		});
		return { kind: "ISSUE", ticket };
	}
}
