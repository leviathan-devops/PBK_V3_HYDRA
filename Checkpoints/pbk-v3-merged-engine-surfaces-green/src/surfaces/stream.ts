/**
 * D4 · THE DELTA ACCUMULATOR (PACKAGE_B §2.3, G-1) + D5 · THE ABORT DEDUPE (PACKAGE_B §2.4).
 *
 * G-1: message_update fires PER DELTA, not per line. A pattern spanning two deltas is invisible
 *      without a buffer. abide has ZERO delta handling (measured 0 hits) — this is net-new.
 * D5:  the same (rule, span) must abort ONCE per turn, not per delta — the loop guard.
 *
 * The buffer is CAPPED so memory is bounded.
 */
export const BUFFER_CAP = 8192;

export class StreamBuffer {
	private text = "";
	private fence = false;
	private readonly seen = new Set<string>();

	/** Feed a delta; return the COMPLETE lines it produced (the trailing partial stays buffered). */
	push(delta: string): { lines: string[]; fence: boolean } {
		this.text += delta;
		// bound memory: drop the oldest half when the cap is exceeded
		if (this.text.length > BUFFER_CAP) this.text = this.text.slice(this.text.length - BUFFER_CAP);
		const parts = this.text.split("\n");
		this.text = parts.pop() ?? "";
		const lines: string[] = [];
		for (const raw of parts) {
			if (/^\s*```/.test(raw)) this.fence = !this.fence;
			lines.push(raw);
		}
		return { lines, fence: this.fence };
	}

	/** THE DEDUPE (D5): true when this signature is NEW this turn (i.e. it should fire). */
	shouldFire(ruleId: string, span: string): boolean {
		const sig = `${ruleId}:${span}`;
		if (this.seen.has(sig)) return false;
		this.seen.add(sig);
		return true;
	}

	/** The current fence state (a fenced line is rule_source, never scorable). */
	get inFence(): boolean {
		return this.fence;
	}

	/** Reset at session_start / agent_end (the per-turn dedupe window). */
	reset(): void {
		this.text = "";
		this.fence = false;
		this.seen.clear();
	}
}
