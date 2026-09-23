/**
 * D2b · THE LOADER (PACKAGE_A §2.5 THE ERROR RULES — loud, never silent).
 *
 * a missing `use:` bank   -> THROWS with the rule id
 * an invalid regex        -> THROWS with the pattern
 * a malformed rule file   -> THROWS; the engine does not load half a rubric
 * an inherited band       -> THROWS (the band must be DERIVED or explicit per rule)
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { LexiconRule, PatternFamily, RuleStatus } from "../../SEAM/seam";

/** Strip a LEADING inline flag group — `(?i)` -> "" (JS RegExp rejects it). Ported from the
 * live extension's lib.ts:59. */
export function stripInlineFlags(p: string): string {
	return p.replace(/^\(\?[a-z]+\)/, "");
}

export interface RawRule {
	id: string;
	description: string;
	scope: string[];
	status: RuleStatus;
	lexicon: PatternFamily;
	band: { low: number; high: number };
	body: string;
}

/** Parse one rules/*.md file. Frontmatter = YAML-ish; body = the correction text. */
function parseRule(file: string, raw: string): RawRule {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!m) throw new Error(`lexicon: ${file} has no frontmatter`);
	const [, fm, body] = m;
	const id = (fm.match(/^id:\s*(.+)$/m)?.[1] ?? path.basename(file, ".md")).trim();
	const description = (fm.match(/^description:\s*"?(.+?)"?\s*$/m)?.[1] ?? "").trim();

	// the lexicon block: the four banks.
	// THE MEASURED FORMAT GAP (2026-09-23): this loader was first written for FLOW-style YAML
	// (`use: [a, b]`) while the LIVE rules at ~/.omp/agent/rules/ use BLOCK style:
	//     use:
	//       - '\b(exit|predicate)\b'
	// Both shapes are accepted now; a block-style bank is the live format and MUST parse.
	const bank = (name: string): string[] => {
		// 1 · FLOW style: name: [a, b, c]
		const flow = fm.match(new RegExp(`^\\s*${name}:\\s*\\[([^\\]]*)\\]`, "m"));
		if (flow) {
			return flow[1]
				.split(",")
				.map((s) => s.trim().replace(/^["']|["']$/g, ""))
				.filter((s) => s.length > 0);
		}
		// 2 · BLOCK style: name:\n  - item\n  - item
		const block = fm.match(new RegExp(`^\\s*${name}:\\s*$`, "m"));
		if (!block) return [];
		const after = fm.slice(block.index! + block[0].length);
		const out: string[] = [];
		for (const line of after.split("\n")) {
			if (/^\s*#/.test(line)) continue;                     // a comment
			if (/^\s*$/.test(line)) { if (out.length) break; else continue; }
			const m2 = line.match(/^\s*-\s*(.+?)\s*$/);
			if (!m2) { if (out.length) break; else continue; }     // the bank ended
			out.push(m2[1].trim().replace(/^["']|["']$/g, ""));
		}
		return out.filter((s) => s.length > 0);
	};
	const lexicon: PatternFamily = {
		descriptive: bank("descriptive"),
		suggestive: bank("suggestive"),
		substitute: bank("substitute"),
		use: bank("use"),
	};
	if (!Array.isArray(lexicon.use) || lexicon.use.length === 0) {
		throw new Error(`lexicon: ${id} has no 'use:' bank (the exemptor is mandatory)`);
	}
	if (!Array.isArray(lexicon.suggestive) || lexicon.suggestive.length === 0) {
		throw new Error(`lexicon: ${id} has no 'suggestive:' bank (nothing to detect)`);
	}
	// validate every pattern compiles — an invalid regex is a loud THROW.
	// THE MEASURED GAP (2026-09-23): the LIVE rules carry a LEADING inline flag group (`(?i)`),
	// which JS RegExp rejects. The live extension strips it (lib.ts:59 stripInlineFlags) and
	// compiles case-insensitively; a rule whose regex threw at load took the whole extension down.
	// We port that exact behaviour.
	for (const [name, arr] of Object.entries(lexicon)) {
		for (const p of arr ?? []) {
			try {
				new RegExp(stripInlineFlags(p));
			} catch {
				throw new Error(`lexicon: ${id} invalid regex in ${name}: ${JSON.stringify(p)}`);
			}
		}
	}
	// the band: explicit low/high in the frontmatter
	// the band: the LIVE rules write it INLINE (`band: { low: 0.3, high: 0.62 }`); the first
	// loader only accepted `low:`/`high:` on separate lines. Accept both.
	const inline = fm.match(/^\s*band:\s*\{\s*low:\s*([\d.]+)\s*,\s*high:\s*([\d.]+)\s*\}/m);
	const low = Number(inline?.[1] ?? fm.match(/^\s*low:\s*([\d.]+)/m)?.[1] ?? NaN);
	const high = Number(inline?.[2] ?? fm.match(/^\s*high:\s*([\d.]+)/m)?.[1] ?? NaN);
	if (!Number.isFinite(low) || !Number.isFinite(high)) {
		throw new Error(`lexicon: ${id} has no derived band ({low, high}) — an inherited band is banned`);
	}
	if (!(high > low)) throw new Error(`lexicon: ${id} band.high must exceed band.low`);
	const status = ((fm.match(/^status:\s*(\w+)/m)?.[1] ?? "active").trim() as RuleStatus);

	return { id, description, scope: [], status, lexicon, band: { low, high }, body: body.trim() };
}

/** Load every rule from a directory. THROWS on the first malformed file. */
export function loadRules(dir: string): LexiconRule[] {
	if (!existsSync(dir)) throw new Error(`lexicon: rules dir absent: ${dir}`);
	const out: LexiconRule[] = [];
	for (const name of readdirSync(dir).filter((n) => n.endsWith(".md")).sort()) {
		const raw = readFileSync(path.join(dir, name), "utf8");
		const r = parseRule(name, raw);
		out.push({
			id: r.id,
			body: r.body,
			description: r.description,
			scope: r.scope,
			lexicon: r.lexicon,
			threshold: r.band.high,
			band: r.band,
		});
	}
	return out;
}
