/**
 * D6 · THE LEDGER WRITER (PACKAGE_A §2.2, F-5).
 *
 * The row that crosses the seam, with `decidedBy` — WHICH layer decided (lexicon | jev).
 * A jev:null carries the NAMED reason, never a silent null (the loud-fail law).
 */
import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { SrcKind } from "../../../SEAM/seam";

export interface LedgerRow {
	Pattern: string;
	State: { confidence: number; source_kind: SrcKind; decidedBy: "lexicon" | "jev" };
	Evidence: { span: string; jev: number | null; jevReason?: string };
}

/** Append one row. Creates the dir on first write. A named jevReason is REQUIRED when jev is null. */
export function appendLedger(row: LedgerRow, ledgerPath: string): void {
	if (row.Evidence.jev === null && !row.Evidence.jevReason) {
		throw new Error(`ledger: ${row.Pattern} has jev:null with no named reason — a silent null is banned`);
	}
	mkdirSync(path.dirname(ledgerPath), { recursive: true });
	appendFileSync(ledgerPath, `${JSON.stringify(row)}\n`, "utf8");
}

/** Build a row from a decision. The decidedBy field is the cost metric. */
export function buildRow(args: {
	ruleId: string;
	probability: number;
	sourceKind: SrcKind;
	decidedBy: "lexicon" | "jev";
	span: string;
	jev: number | null;
	jevReason?: string;
}): LedgerRow {
	return {
		Pattern: args.ruleId,
		State: { confidence: Number(args.probability.toFixed(4)), source_kind: args.sourceKind, decidedBy: args.decidedBy },
		Evidence: { span: args.span, jev: args.jev, ...(args.jevReason ? { jevReason: args.jevReason } : {}) },
	};
}
