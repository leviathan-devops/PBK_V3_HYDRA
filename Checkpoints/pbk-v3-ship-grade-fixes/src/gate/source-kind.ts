/**
 * D1 · THE SOURCE-KIND GATE (PACKAGE_B §2.2, G-2 — the FP shield).
 *
 * Ported VERBATIM from the proven live extension
 * (~/.omp/agent/extensions/lexicon-gate/lib.ts:81 classifySource, lib.ts:71 SCORABLE —
 * suite 5/5). The ONLY edit is the SrcKind import: it now comes from the FROZEN SEAM
 * (SEAM/seam.ts:61) instead of the extension's local copy. The logic is untouched so the
 * live proof carries over: a fenced block, a table row, a bulleted backtick quote, a
 * blockquote, a heading, a rule file, and a doc file are ALL non-scorable. $0, no model,
 * runs BEFORE any score — the engine's check() is never called for a suppressed line.
 */
import type { SrcKind } from "../../SEAM/seam";

/** ONLY own_utterance can fire. A quotation/table/doc/rule_source match is recorded, never acted on. */
export const SCORABLE: ReadonlySet<SrcKind> = new Set<SrcKind>(["own_utterance"]);

/**
 * The deterministic source-kind gate. Line-level. Returns the SrcKind Desk B supplies to
 * check() as CheckRequest.sourceKind (SEAM/seam.ts:96).
 */
export function classifySource(line: string, inFence: boolean, fileKind: string): SrcKind {
	if (inFence) return "rule_source";
	if (/^\s*\|/.test(line)) return "table";
	if (/^\s*[-*]\s*`[^`]+`/.test(line)) return "quotation";
	if (/^\s*>/.test(line)) return "quotation";
	if (/^\s*#{1,6}\s/.test(line)) return "doc";
	if (fileKind === "rule") return "rule_source";
	if (fileKind === "doc") return "doc";
	return "own_utterance";
}

/** True iff the kind may reach the engine. The one place the scorable set is consulted. */
export function isScorable(kind: SrcKind): boolean {
	return SCORABLE.has(kind);
}
