/**
 * THE FROZEN INTERFACE — THE SEAM
 * ================================
 * W0 of the PBK v3 hydra build. THE ONLY SERIAL ARTIFACT.
 *
 * TWO DESKS BUILD AGAINST THIS FILE AND NEVER AGAINST EACH OTHER.
 *   DESK A (the engine)   implements check() and everything below it.
 *   DESK B (the surfaces) calls check() and owns the phase -> action mapping.
 *
 * NO SEMANTICS CROSS THIS LINE. Desk B never computes a band; Desk A never
 * touches a host event. The merge is ONE import.
 *
 * SELF-CONTAINED BY DESIGN: this file imports NOTHING. The abide types it
 * needs are declared here, so the seam's own gate (tsc --noEmit) passes
 * BEFORE any vendor lands. A-1's vendored schema must SATISFY these shapes;
 * if it does not, A-1 reports the mismatch rather than editing this file.
 *
 * FROZEN 2026-09-23 · sha256 recorded in SEAM_CONTRACT.md.
 */

// ── FROZEN INTERFACE ABOVE — DO NOT EDIT ──

// ── THE ABIDE-COMPATIBLE PRIMITIVES (declared here so the seam is standalone) ──

/** abide's band enum. `act` = enforce, `flag` = operator-only, `clear` = silent. */
export type Band = "act" | "flag" | "clear";

/** abide's check phase. */
export type CheckPhase = "edit" | "turn";

/** abide's thresholds. */
export interface Thresholds {
	act: number;
	flag: number;
}

/** abide's rule status. */
export type RuleStatus = "active" | "weak" | "noisy" | "disabled";

/** abide's verdict — one per (rule, check) pair. */
export interface Verdict {
	ruleId: string;
	probability: number;
	band: Band;
	answer?: string;
}

/** The minimal abide `Rule` surface the seam references. A-1's vendored schema is the authority. */
export interface Rule {
	id: string;
	text: string;
	source: { path: string; line?: number };
	scope?: string[];
	when?: CheckPhase;
	status: RuleStatus;
}

// ── THE SEAM'S OWN TYPES ──

/** The five source kinds. ONLY `own_utterance` is scorable. */
export type SrcKind = "own_utterance" | "quotation" | "table" | "doc" | "rule_source";

/** The four pipeline surfaces. A surface determines what ACTION is possible. */
export type Surface =
	| "prose" // the streaming text — Desk B: ctx.abort() + inject
	| "tool-call" // the tool args, BEFORE execution — Desk B: {block}
	| "tool-result" // the tool output, AFTER execution — Desk B: {isError}
	| "post-tool-use"; // the edit landed (abide native) — Desk B: the repair demand

/** The lexicon weights. THE ONLY place a score is defined. */
export interface PatternFamily {
	descriptive: string[]; // neg += 1   the legitimate co-context
	suggestive: string[]; // pos += 2   (or +1 without \b)   the violation shape
	substitute?: string[]; // pos += 2   the theatrical tell
	use?: string[]; // neg += 3   THE EXEMPTOR — mandatory
}

/** One lexicon rule, compiled from a rules/*.md file. */
export interface LexiconRule {
	id: string; // kebab-case, the abide rule id
	body: string; // the markdown body — the correction text
	description: string;
	scope: string[];
	lexicon: PatternFamily;
	threshold: number;
	band: { low: number; high: number }; // DERIVED, never inherited
}

/** THE ONE ENTRY POINT. Desk B calls this; Desk A implements it. */
export interface CheckRequest {
	/** Which surface produced the text. Drives NOTHING inside check(). */
	surface: Surface;
	/** The abide phase (edit | turn). */
	phase: CheckPhase;
	/** The text under test. */
	text: string;
	/** The origin of the text — Desk B's classifySource() result. */
	sourceKind: SrcKind;
	/** The file under test, when the surface carries one. */
	file?: string;
	/** The task, when the surface carries one. */
	task?: string;
}

/** One decision. THE ROW THAT CROSSES THE SEAM. */
export interface Decision {
	ruleId: string;
	band: Band; // act | flag | clear
	probability: number; // 0..1
	/** THE COST METRIC: which layer decided. */
	decidedBy: "lexicon" | "jev";
	/** The kind Desk B supplied. */
	sourceKind: SrcKind;
	/** The matched span, capped. */
	span: string;
	/** The correction text for the action layer. */
	correction: string;
	/** True when the span was capped. */
	capped: boolean;
}

export interface CheckResult {
	decisions: Decision[];
	/** How many decisions reached the semantic judge. The cost metric. */
	jevCalls: number;
	/** Total decisions. */
	total: number;
	/** Named failures — never silent. */
	errors: string[];
}

/** THE CONTRACT. Desk A implements; Desk B calls. */
export type CheckFn = (req: CheckRequest) => Promise<CheckResult>;

/** The band contract. Desk A owns it; Desk B may import it for tests only. */
export type BandFn = (probability: number, band: { low: number; high: number }) => Band;

/** Desk B's gate. Desk A never calls it. */
export type ClassifyFn = (line: string, inFence: boolean, fileKind: string) => SrcKind;

/** THE ACTION CONTRACT — owned by Desk B (it knows what each host can do). */
export type ActionFn = (surface: Surface, phase: CheckPhase, decisions: Decision[]) => ActionCall | null;

export interface ActionCall {
	/** prose -> abort+inject · tool-call -> block · tool-result -> isError · post-tool-use -> block */
	kind: "abort+inject" | "block" | "isError" | "notice" | "silent";
	/** The text for the inject / the block reason / the notice. */
	text: string;
	/** For `abort+inject`: the steer payload. */
	deliverAs?: "steer" | "followUp";
}

/** THE LEDGER ROW — the shared record shape. Desk A writes it. */
export interface LedgerRow {
	ruleId: string;
	band: Band;
	probability: number;
	decidedBy: "lexicon" | "jev";
	sourceKind: SrcKind;
	span: string;
	action: ActionCall["kind"];
	capped: boolean;
	at: string;
}

// ── THE COMPILE-TIME CONTRACT ASSERTIONS (a desk that breaks these fails tsc) ──

/** A compile-time check that a value satisfies a shape. */
type Assert<T extends true> = T;
type Extends<A, B> = A extends B ? true : false;

/** The action kinds are exhaustive — a new kind breaks this line. */
type _ActionKindsExhaustive = Assert<
	Extends<ActionCall["kind"], "abort+inject" | "block" | "isError" | "notice" | "silent">
>;
/** The bands are exhaustive. */
type _BandsExhaustive = Assert<Extends<Band, "act" | "flag" | "clear">>;
/** The source kinds are exhaustive. */
type _SrcKindsExhaustive = Assert<Extends<SrcKind, "own_utterance" | "quotation" | "table" | "doc" | "rule_source">>;
/** The surfaces are exhaustive. */
type _SurfacesExhaustive = Assert<
	Extends<Surface, "prose" | "tool-call" | "tool-result" | "post-tool-use">
>;

/** A decision's correction is never empty (the inject would carry nothing). */
export interface DecisionGuards {
	/** non-empty correction */
	correction: string & { readonly __nonEmpty: unique symbol };
}

export const FROZEN = "// ── FROZEN INTERFACE ABOVE — DO NOT EDIT ──";
export const SEAM_VERSION = "1.0.0";
