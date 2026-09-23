/**
 * D2 · THE QUOTE-STATE MACHINE (PACKAGE_B §2.2).
 *
 * Ported from the proven live extension (lib.ts:288 isQuotedMatch) — a quote-STATE WALK,
 * not an index check. The first version only checked the index; the walk is the fix.
 *
 * A match is "quoted" iff its START index falls inside an open backtick / double-quote /
 * single-quote region.
 */
export function isQuotedMatch(line: string, match: string): boolean {
	if (match.length === 0) return false;
	const at = line.indexOf(match);
	if (at < 0) return false;
	let inBacktick = false;
	let inDouble = false;
	let inSingle = false;
	for (let i = 0; i < at; i++) {
		const ch = line[i];
		if (ch === "\\" ) { i += 1; continue; } // an escaped char cannot open/close a region
		if (ch === "`") inBacktick = !inBacktick;
		else if (ch === '"') inDouble = !inDouble;
		else if (ch === "'") inSingle = !inSingle;
	}
	return inBacktick || inDouble || inSingle;
}

/** Count the open regions at a position — a diagnostic helper for the tests. */
export function openRegionsAt(line: string, at: number): { backtick: boolean; double: boolean; single: boolean } {
	let b = false, d = false, s = false;
	for (let i = 0; i < at; i++) {
		const ch = line[i];
		if (ch === "\\") { i += 1; continue; }
		if (ch === "`") b = !b;
		else if (ch === '"') d = !d;
		else if (ch === "'") s = !s;
	}
	return { backtick: b, double: d, single: s };
}
