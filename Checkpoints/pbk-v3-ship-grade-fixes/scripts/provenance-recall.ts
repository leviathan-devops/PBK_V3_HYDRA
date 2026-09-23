/** RES-1: measure the gate-vocabulary's RECALL over the live ledger's own spans. */
import { classifyProvenance } from "../src/gate/provenance";
import { readFileSync } from "fs";

const LEDGER = `${process.env.HOME}/.omp/run/lexicon-ledger.jsonl`;
let total = 0, about = 0, ownUtter = 0, ownAndAbout = 0;
const missed: string[] = [];
for (const line of readFileSync(LEDGER, "utf8").split("\n")) {
	if (!line.trim()) continue;
	let d: any;
	try { d = JSON.parse(line); } catch { continue; }
	total++;
	const span = d?.Evidence?.span ?? "";
	const sk = d?.State?.source_kind ?? "own_utterance";
	if (sk === "own_utterance") ownUtter++;
	const v = classifyProvenance(span, sk as any);
	if (v.aboutGate) { about++; if (sk === "own_utterance") ownAndAbout++; }
	else if (sk === "own_utterance" && span.length > 20) missed.push(span.slice(0, 70));
}
console.log(`  the ledger rows:           ${total}`);
console.log(`  own_utterance rows:        ${ownUtter}`);
console.log(`  aboutGate:true (all):      ${about}`);
console.log(`  own_utterance THAT are aboutGate: ${ownAndAbout}`);
console.log(`  ★ THE ABORT SUPPRESSION:   ${ownUtter} own_utterance -> ${ownUtter - ownAndAbout} actionable (${ownAndAbout} re-classed)`);
console.log(`\n  the 8 LONGEST own_utterance spans the vocabulary MISSED (the recall gap):`);
missed.sort((a, b) => b.length - a.length);
for (const m of missed.slice(0, 8)) console.log(`    - ${m}`);
