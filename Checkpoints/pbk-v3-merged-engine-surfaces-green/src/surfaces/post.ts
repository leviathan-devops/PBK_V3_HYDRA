/**
 * D3d · THE POST-TOOL-USE SURFACE (PACKAGE_B §2.3, G-4).
 *
 * ★ THE MEASURED FACT (W2's own report): this omp host emits exactly
 *   session_start · message_update · tool_call · tool_result · ttsr_triggered · agent_end
 *   (+ the `input` hook the live extension proves). A binary grep found ZERO `post_tool_use`
 *   occurrences.
 * SO: the handler is SHIPPED but its binding is NAMED-AND-SKIPPED (the unwired-edge law) —
 *   never a guessed event registration.
 */
import type { CheckResult } from "../../SEAM/seam";

/** The event name this surface WOULD bind to — recorded as absent on this host. */
export const POST_TOOL_USE_EVENT = "post_tool_use";
export const POST_TOOL_USE_BOUND = false; // measured: the host does not emit it

export interface RepairDemand {
	demand: string | null;
}

/** The repair demand for a landed edit. Pure. */
export function postAction(res: CheckResult): RepairDemand {
	const firing = res.decisions.filter((d) => d.band === "act");
	if (firing.length === 0) return { demand: null };
	return {
		demand:
			`lexicon-gate: the edit landed and ${firing.length} rule(s) fired — repair before continuing:\n` +
			firing.map((d) => `- ${d.ruleId}: ${d.correction}`).join("\n"),
	};
}
