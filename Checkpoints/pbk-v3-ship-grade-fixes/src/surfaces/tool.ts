/**
 * D3b · THE TOOL-CALL SURFACE (PACKAGE_B §2.3, G-4).
 *
 * tool_call -> the engine's check() on the tool's INPUT -> on act: return {block: true, reason}.
 * The block carries the rule's own correction text (the block must teach the remedy).
 */
import type { CheckResult } from "../../SEAM/seam";

export interface BlockAction {
	block: boolean;
	reason?: string;
}

/** Decide the tool-call surface's action. Pure. */
export function toolAction(res: CheckResult): BlockAction {
	const firing = res.decisions.filter((d) => d.band === "act");
	if (firing.length === 0) return { block: false };
	const d = firing[0];
	return { block: true, reason: `${d.ruleId}: ${d.correction}` };
}
