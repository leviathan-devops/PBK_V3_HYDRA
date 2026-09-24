/**
 * THE GRAY-ZONE JUDGE — wired 2026-09-24 (the operator: "WHERE IS THE DECISION MAKING MODEL").
 *
 * THE SLOT existed since the engine was written (`RunDeps.judge?`) but boot() never passed one —
 * every ledger row recorded `jev:null — no judge wired`. This module IS the wire: a judge that
 * asks the muse-on-GO lane (the pinned, non-rate-limited route with the 8-key pool) for a
 * violation probability on the gray-zone span.
 *
 * THE CONTRACT (src/engine/check.ts:19-20):
 *   (span: string, ruleId: string) => Promise<{ probability: number; reason?: string }>
 *
 * LOUD FAIL (never a silent default): a transport error THROWS — the engine's catch records
 * `jev failed (...) — the mechanical band stands`. A judge that silently returns 0.5 would be a
 * fabricated verdict; that class is banned.
 */

const JUDGE_ENDPOINT =
	process.env.PBK_JUDGE_URL ?? "http://127.0.0.1:4097/zen/go/v1/responses";
const JUDGE_MODEL = process.env.PBK_JUDGE_MODEL ?? "muse-spark-1.3-contributor";
/** The key resolver — NEVER an inline key (the secrets law). */
const JUDGE_KEY_CMD =
	process.env.PBK_JUDGE_KEY_CMD ?? "/home/leviathan/.omp/agent/bin/go-key.sh";
const JUDGE_TIMEOUT_MS = Number(process.env.PBK_JUDGE_TIMEOUT_MS ?? 20_000);

/** Resolve the bearer via the key script; cache per process (the script is cheap but not free). */
let cachedKey: string | null = null;
async function bearer(): Promise<string> {
	if (cachedKey) return cachedKey;
	const proc = Bun.spawnSync(["sh", JUDGE_KEY_CMD], { stdout: "pipe", stderr: "pipe" });
	const out = proc.stdout.toString().trim();
	if (!out) throw new Error(`judge key script produced no output: ${JUDGE_KEY_CMD}`);
	cachedKey = out;
	return out;
}

/** One JSON object out of the model's text (muse answers with prose around the JSON). */
function parseProbability(text: string): number | null {
	const m = text.match(/\{\s*"probability"\s*:\s*([0-9]*\.?[0-9]+)\s*\}/);
	if (!m) return null;
	const p = Number(m[1]);
	return Number.isFinite(p) && p >= 0 && p <= 1 ? p : null;
}

/** THE JUDGE. Throws on transport failure (the engine catches and records the named error). */
export async function llmJudge(span: string, ruleId: string): Promise<{ probability: number; reason?: string }> {
	const key = await bearer();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), JUDGE_TIMEOUT_MS);
	try {
		const res = await fetch(JUDGE_ENDPOINT, {
			method: "POST",
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`,
				"x-opencode-session": `ses_pbkjudge_${Date.now().toString(16)}`,
			},
			body: JSON.stringify({
				model: JUDGE_MODEL,
				input:
					`You are a behavioral-enforcement judge. Rule "${ruleId}" fired a GRAY-ZONE ` +
					`(undecided) match on an agent's own utterance. Decide: is this span a REAL ` +
					`violation of the rule's intent, or benign?\n\nTHE SPAN: "${span.slice(0, 500)}"\n\n` +
					`Answer with EXACTLY one JSON object and nothing else: ` +
					`{"probability": <0.0-1.0 the chance it is a REAL violation>}`,
				reasoning: { effort: "low" },
				stream: false,
			}),
		});
		if (!res.ok) throw new Error(`judge endpoint ${res.status}: ${(await res.text()).slice(0, 200)}`);
		const data = (await res.json()) as {
			output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
		};
		const text = (data.output ?? [])
			.filter((o) => o.type === "message")
			.flatMap((o) => o.content ?? [])
			.filter((c) => c.type === "output_text")
			.map((c) => c.text ?? "")
			.join("");
		const p = parseProbability(text);
		if (p === null) throw new Error(`judge returned no parseable probability: ${text.slice(0, 200)}`);
		return { probability: p, reason: text.slice(0, 300) };
	} finally {
		clearTimeout(timer);
	}
}
