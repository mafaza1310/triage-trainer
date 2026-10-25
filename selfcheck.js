// selfcheck.js — proves the answer key matches the START algorithm.
// The expected results below are copied from brief.md. They live here, not in
// cases.js, so the app itself only ever gets its answers from startTriage().

const EXPECTED = {
  1: ["GREEN", "walking"],
  2: ["GREEN", "walking"],
  3: ["GREEN", "walking"],
  4: ["YELLOW", "final"],
  5: ["YELLOW", "final"],
  6: ["YELLOW", "final"],
  7: ["YELLOW", "final"],
  8: ["YELLOW", "final"],
  9: ["RED", "breathing"],
  10: ["RED", "respiratory rate"],
  11: ["RED", "perfusion"],
  12: ["RED", "perfusion"],
  13: ["RED", "mental status"],
  14: ["BLACK", "breathing"],
  15: ["BLACK", "breathing"],
};
const EXPECTED_MIX = { GREEN: 3, YELLOW: 5, RED: 5, BLACK: 2 };

// [choice, correct, expected classification]
const ERROR_RULES = [
  ["RED", "RED", "correct"],
  ["RED", "YELLOW", "over"],
  ["YELLOW", "GREEN", "over"],
  ["GREEN", "RED", "under"],
  ["YELLOW", "RED", "under"],
  ["BLACK", "GREEN", "under"],
  ["BLACK", "RED", "under"],
  ["RED", "BLACK", "over"],
  ["GREEN", "BLACK", "over"],
];

function runSelfCheck() {
  const rows = CASES.map((c) => {
    const r = startTriage(c);
    const [color, step] = EXPECTED[c.id];
    return { id: c.id, expected: `${color} (${step})`, computed: `${r.color} (${r.step})`, pass: r.color === color && r.step === step };
  });

  const mix = { GREEN: 0, YELLOW: 0, RED: 0, BLACK: 0 };
  CASES.forEach((c) => mix[startTriage(c).color]++);
  const mixPass = Object.keys(EXPECTED_MIX).every((k) => mix[k] === EXPECTED_MIX[k]) && CASES.length === 15;

  const rules = ERROR_RULES.map(([choice, correct, want]) => {
    const got = classifyError(choice, correct);
    return { label: `${choice} for a ${correct} patient`, want, got, pass: got === want };
  });

  const explanation = explain("YELLOW", startTriage(CASES.find((c) => c.id === 10)));
  const wantExplanation = "You chose YELLOW, but a respiratory rate above 30 (here 36/min) means RED at the respiratory rate step.";

  const allPass = rows.every((r) => r.pass) && mixPass && rules.every((r) => r.pass) && explanation === wantExplanation;
  return { rows, mix, mixPass, rules, explanation, explanationPass: explanation === wantExplanation, allPass };
}

// In the browser: draw the results into selfcheck.html. In Node: print them.
function printSelfCheck(res) {
  console.table(res.rows);
  console.log("Mix:", res.mix, res.mixPass ? "PASS" : "FAIL");
  console.table(res.rules);
  console.log("Explanation:", res.explanation, res.explanationPass ? "PASS" : "FAIL");
  console.log(res.allPass ? "ALL CHECKS PASS" : "SOME CHECKS FAILED");
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const res = runSelfCheck();
    printSelfCheck(res);
    const badge = (ok) => `<span class="${ok ? "pass" : "fail"}">${ok ? "PASS" : "FAIL"}</span>`;
    document.getElementById("summary").innerHTML =
      `<p class="banner ${res.allPass ? "pass-bg" : "fail-bg"}">${res.allPass ? "All checks pass" : "Some checks failed"}</p>`;
    document.getElementById("cases").innerHTML =
      "<tr><th>Case</th><th>Expected (brief.md)</th><th>Computed by startTriage</th><th></th></tr>" +
      res.rows.map((r) => `<tr><td>${r.id}</td><td>${r.expected}</td><td>${r.computed}</td><td>${badge(r.pass)}</td></tr>`).join("");
    document.getElementById("mix").innerHTML =
      `GREEN ${res.mix.GREEN} · YELLOW ${res.mix.YELLOW} · RED ${res.mix.RED} · BLACK ${res.mix.BLACK} (expected 3 · 5 · 5 · 2) ${badge(res.mixPass)}`;
    document.getElementById("rules").innerHTML =
      "<tr><th>Choice</th><th>Expected</th><th>Got</th><th></th></tr>" +
      res.rules.map((r) => `<tr><td>${r.label}</td><td>${r.want}</td><td>${r.got}</td><td>${badge(r.pass)}</td></tr>`).join("");
    document.getElementById("explanation").innerHTML = `“${res.explanation}” ${badge(res.explanationPass)}`;
  });
}
