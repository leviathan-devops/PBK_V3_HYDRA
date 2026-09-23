/**
 * D7 · THE ENTRY (PACKAGE_B §2.6, T-6/T-7).
 *
 * Registers the surface hooks on the host. NO BAND MATH lives here (T-6) — the engine returns
 * the band; the action modules act on it.
 *
 * THE HOOKS (measured on this host): session_start · input · message_update · tool_call ·
 * tool_result · ttsr_triggered · agent_end. post_tool_use is NOT emitted (0 hits in the binary)
 * so its handler ships unbound, named-and-skipped.
 */
import type { CheckRequest, CheckResult, Decision, SrcKind } from "../../SEAM/seam";
import { classifyProvenance } from "../gate/provenance";
import { StreamBuffer } from "./stream";
import { proseAction, CORRECTION_TYPE } from "./prose";
import { toolAction } from "./tool";
import { resultAction } from "./result";
import { postAction, POST_TOOL_USE_BOUND } from "./post";
import { actionFor } from "../action/dispatch";

export type CheckFn = (req: CheckRequest) => Promise<CheckResult>;

export interface EntryDeps {
	check: CheckFn;
	logger?: { info?: (m: string) => void; warn?: (m: string) => void };
}

/**
 * Install the surface hooks onto the host. The engine (`check`) is INJECTED — the surfaces
 * never know how the decision was made, only what it was.
 */
export function install(pi: any, deps: EntryDeps): void {
	const buf = new StreamBuffer();
	const log = deps.logger ?? {};

	// ── session_start: reset the per-turn dedupe window ──
	pi.on("session_start", async () => {
		buf.reset();
		log.info?.("[lexicon-gate] session_start — buffer + dedupe reset");
	});

	// ── input: THE PROVENANCE GATE — our own injections are not our utterances ──
	pi.on("input", async (event: any) => {
		if (event?.source === "extension") return { action: "continue" };
		return { action: "continue" };
	});

	// ── message_update: THE STREAMING SURFACE (the lexicon decides) ──
	pi.on("message_update", async (event: any, ctx: any) => {
		const ev = event?.assistantMessageEvent;
		if (!ev || ev.type !== "text_delta" || typeof ev.delta !== "string") return;
		const { lines, fence } = buf.push(ev.delta);
		for (const raw of lines) {
			const line = raw.trim();
			if (line.length < 8) continue;
			// ★ THE PROVENANCE AXIS (blueprint §4): a span ABOUT the gate is recorded, never
			// aborted. It resolves to `rule_source` (non-scorable) so the engine still records
			// the row and the surface never aborts on the gate's own subject matter.
			const base: SrcKind = fence ? "rule_source" : "own_utterance";
			const prov = classifyProvenance(line, base, fence);
			const res = await deps.check({
				surface: "prose", phase: "edit", text: line,
				sourceKind: prov.srcKind,
			});
			const firing = res.decisions.filter((d) => d.band === "act" && d.sourceKind === "own_utterance");
			if (firing.length === 0) continue;
			const d = firing[0];
			if (!buf.shouldFire(d.ruleId, d.span)) continue; // the dedupe
			const act = actionFor("prose", d.band);
			if (act !== "abort") continue;
			const a = proseAction(res, { lastSignature: `${d.ruleId}:${d.span}` });
			ctx?.abort?.();
			try {
				if (a.inject) pi.sendMessage(a.inject, { deliverAs: "steer" });
			} catch (e) {
				log.warn?.(`[lexicon-gate] inject failed (named): ${String(e)}`);
			}
		}
	});

	// ── tool_call: the BLOCK channel ──
	pi.on("tool_call", async (event: any) => {
		const text = typeof event?.input === "string" ? event.input : JSON.stringify(event?.input ?? {});
		const res = await deps.check({ surface: "tool-call", phase: "edit", text, sourceKind: "own_utterance" });
		const a = toolAction(res);
		if (a.block) return { block: true, reason: a.reason };
		return undefined;
	});

	// ── tool_result: the repair-append channel (the text is `doc`, never scorable) ──
	pi.on("tool_result", async (event: any) => {
		const text = typeof event?.content === "string" ? event.content : JSON.stringify(event?.content ?? {});
		const res = await deps.check({ surface: "tool-result", phase: "edit", text, sourceKind: "doc" });
		const a = resultAction(res);
		if (!a.isError) return undefined;
		const base = Array.isArray(event?.content) ? event.content : [];
		return { isError: true, content: [...base, { type: "text", text: a.demand ?? "" }] };
	});

	// ── ttsr_triggered: the regex pre-filter fired; log it (the engine decides, not TTSR) ──
	pi.on("ttsr_triggered", async (event: any) => {
		log.info?.(`[lexicon-gate] ttsr pre-filter fired: ${String(event?.rule ?? "?")}`);
	});

	// ── agent_end: reset the window ──
	pi.on("agent_end", async () => {
		buf.reset();
	});
}

export { StreamBuffer } from "./stream";
export { proseAction, CORRECTION_TYPE } from "./prose";
export { toolAction } from "./tool";
export { resultAction } from "./result";
export { postAction, POST_TOOL_USE_BOUND } from "./post";
export { actionFor, actionMatrix, SURFACES, type ActionKind } from "../action/dispatch";
export { classifySource, SCORABLE, isScorable } from "../gate/source-kind";
export { isQuotedMatch, openRegionsAt } from "../gate/quote";
