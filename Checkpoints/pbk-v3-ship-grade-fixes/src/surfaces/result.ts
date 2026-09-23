/**
 * D3c · THE TOOL-RESULT SURFACE (PACKAGE_B §2.3, G-4).
 *
 * tool_result -> the text is MATERIAL THE AGENT IS READING, not its own utterance, so it is
 * classified `doc` (non-scorable) BEFORE the engine sees it. The hook appends a repair demand
 * when a decision warrants one; it never blocks a read.
 */
import type { CheckResult } from "../../SEAM/seam";

export const REPAIR_HEAD = "lexicon-gate: this text looks like a pattern the PBK forbids.";

export interface RepairAction {
	isError: boolean;
	demand?: string;
}

/** Decide the tool-result surface's action. Pure. */
export function resultAction(res: CheckResult): RepairAction {
	const firing = res.decisions.filter((d) => d.band === "act");
	if (firing.length === 0) return { isError: false };
	const demand =
		`${REPAIR_HEAD}\n` +
		firing.map((d) => `- ${d.ruleId} (prob ${d.probability.toFixed(3)})`).join("\n");
	return { isError: true, demand };
}
