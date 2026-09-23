/**
 * D6 · THE ACTION DISPATCH (PACKAGE_B §2.5, G-4).
 *
 * map (surface, phase, decidedBy, band) -> the action kind. THE ACTION COMES FROM THE SURFACE,
 * never guessed. A wrong row is the wrong instrument on the wrong surface.
 *
 * The four surfaces (the seam's Surface type):
 *   prose         -> abort + inject
 *   tool-call     -> block
 *   tool-result   -> isError + the repair demand
 *   post-tool-use -> the repair demand
 */
import type { Band, Surface } from "../../SEAM/seam";

export type ActionKind = "abort" | "block" | "repair" | "record" | "none";

/** The surface -> action-kind table. Only a firing band (act) produces an action. */
export function actionFor(surface: Surface, band: Band): ActionKind {
	if (band !== "act") return band === "flag" ? "record" : "none";
	switch (surface) {
		case "prose":
			return "abort";
		case "tool-call":
			return "block";
		case "tool-result":
			return "repair";
		case "post-tool-use":
			return "repair";
		default:
			throw new Error(`dispatch: unknown surface ${String(surface)}`);
	}
}

/** Every surface the dispatcher knows — used by the tests to prove coverage. */
export const SURFACES: Surface[] = ["prose", "tool-call", "tool-result", "post-tool-use"];

/** The full matrix — a diagnostic for the tests. */
export function actionMatrix(): Record<string, Record<Band, ActionKind>> {
	const out: Record<string, Record<Band, ActionKind>> = {};
	for (const s of SURFACES) {
		out[s] = { act: actionFor(s, "act"), flag: actionFor(s, "flag"), clear: actionFor(s, "clear") };
	}
	return out;
}
