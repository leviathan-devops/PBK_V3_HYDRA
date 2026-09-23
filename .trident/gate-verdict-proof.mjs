import { readFileSync } from "node:fs";
const src = readFileSync("/home/leviathan/.omp/agent/extensions/qwen-code-audit/index.js", "utf8");
// extract gateVerdict by MATCHING BRACES (the non-greedy regex truncated it — a probe error)
const start = src.indexOf("function gateVerdict");
let depth = 0, i = src.indexOf("{", start), end = -1;
for (; i < src.length; i++) {
  if (src[i] === "{") depth++;
  else if (src[i] === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
}
const fnSrc = src.slice(start, end);
console.log(`  the extracted function: ${fnSrc.split("\n").length} lines`);
const fn = new Function(fnSrc + "; return gateVerdict;")();

const cases = [
  ["THE FALSE PASS (my measured case)", {status:"completed_with_errors",summary:{files_reviewed:2,comments:10},comments:[1,2,3,4,5,6,7,8,9,10]}],
  ["the empty run", {summary:{files_reviewed:0,comments:0},comments:[]}],
  ["the unresolved filesReviewed", {summary:{comments:0},comments:[]}],
  ["THE LEGIT CLEAN (2 files, 0 findings)", {status:"completed",summary:{files_reviewed:2,comments:0},comments:[]}],
  ["a real CRITICAL finding", {status:"completed",summary:{files_reviewed:3,comments:1},comments:[{severity:"critical",path:"x.ts",content:"bad"}]}],
  ["a real HIGH finding", {status:"completed",summary:{files_reviewed:3,comments:1},comments:[{severity:"high",path:"y.ts",content:"bad"}]}],
];
console.log();
for (const [name, doc] of cases) {
  const v = fn(JSON.stringify(doc));
  const line = v.blocked ? `BLOCKED (${String(v.reason).slice(0,64)})` : v.verdict;
  console.log(`  ${name.padEnd(40)} -> ${line}`);
}
