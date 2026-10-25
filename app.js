// app.js — screens, shuffling, the drill, timer and scoring.
// The clinical logic lives in start.js; the patients live in cases.js.

const state = {
  order: [],    // this round's cases, shuffled
  index: 0,     // which card is showing
  answers: {},  // caseId -> chosen colour
  secondsLeft: SCENARIO.seconds,
  timerId: null,
  timedOut: false,
};

const $ = (id) => document.getElementById(id);

// Show one screen and hide the others.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== id));
  window.scrollTo(0, 0);
}

// Fisher–Yates shuffle on a copy, so CASES itself never changes.
function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 300 -> "5:00", 59 -> "0:59"
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function renderTimer() {
  $("timer").textContent = formatTime(state.secondsLeft);
  $("timer").classList.toggle("warning", state.secondsLeft <= 30);
}

// One timer for the whole scene. Runs once per second.
function tick() {
  state.secondsLeft--;
  renderTimer();
  if (state.secondsLeft <= 0) {
    state.timedOut = true;
    endRound();
  }
}

function startRound() {
  clearInterval(state.timerId); // never let an old timer keep running
  state.order = shuffle(CASES);
  state.index = 0;
  state.answers = {};
  state.secondsLeft = SCENARIO.seconds;
  state.timedOut = false;
  renderCard();
  renderTimer();
  showScreen("screen-drill");
  state.timerId = setInterval(tick, 1000);
}

function renderCard() {
  const c = state.order[state.index];
  $("narrative").textContent = c.narrative;
  $("counter").textContent = `${state.index + 1} / ${state.order.length}`;
}

// Record the tapped colour and move straight on — no feedback during the round.
function choose(color) {
  const c = state.order[state.index];
  state.answers[c.id] = color;
  state.index++;
  if (state.index < state.order.length) {
    renderCard();
  } else {
    endRound();
  }
}

function endRound() {
  clearInterval(state.timerId);
  state.timerId = null;
  renderResults(scoreRound());
  showScreen("screen-results");
}

// Compare every answer with the colour the START algorithm computes.
function scoreRound() {
  return state.order.map((c) => {
    const choice = state.answers[c.id] || null;
    const correct = startTriage(c);
    const outcome = choice === null ? "untriaged" : classifyError(choice, correct.color);
    return { case: c, choice, correct, outcome };
  });
}

function renderResults(results) {
  const count = (outcome) => results.filter((r) => r.outcome === outcome).length;
  $("score-correct").textContent = count("correct");
  $("time-used").textContent = formatTime(SCENARIO.seconds - state.secondsLeft);
  $("count-over").textContent = count("over");
  $("count-under").textContent = count("under");
  $("count-untriaged").textContent = count("untriaged");
  $("stat-untriaged").hidden = !state.timedOut;
  $("results-eyebrow").textContent = state.timedOut ? "Time's up" : "Round complete";
  renderReview(results.filter((r) => r.outcome !== "correct"));
}

const OUTCOME_LABEL = { over: "Over-triage", under: "Under-triage", untriaged: "Not triaged" };

// Small coloured pill showing a triage colour, e.g. RED.
function badge(color) {
  const span = document.createElement("span");
  span.className = `badge ${color || "NONE"}`;
  span.textContent = color || "Not triaged";
  return span;
}

// One card per wrong or untriaged patient, explained at the deciding START step.
function renderReview(mistakes) {
  const list = $("review-list");
  list.innerHTML = "";
  $("review-intro").textContent = mistakes.length
    ? `${mistakes.length} patient${mistakes.length === 1 ? "" : "s"} to review. Each one shows the START step that decides the correct colour.`
    : "Perfect round — every patient triaged correctly. Play again to practise with a new order.";

  mistakes.forEach((m) => {
    const item = document.createElement("article");
    item.className = `card review-item ${m.outcome}`;

    const head = document.createElement("div");
    head.className = "review-head";
    const tag = document.createElement("span");
    tag.className = `outcome-tag ${m.outcome}`;
    tag.textContent = OUTCOME_LABEL[m.outcome];
    head.append(tag);

    const narrative = document.createElement("p");
    narrative.className = "review-narrative";
    narrative.textContent = m.case.narrative;

    const answers = document.createElement("dl");
    answers.className = "review-answers";
    const row = (label, value) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.append(value);
      answers.append(dt, dd);
    };
    row("Your choice", badge(m.choice));
    row("Correct", badge(m.correct.color));
    row("Deciding step", stepLabel(m.correct.step));

    const why = document.createElement("p");
    why.className = "review-explanation";
    why.textContent = explain(m.choice, m.correct);

    item.append(head, narrative, answers, why);

    if (m.case.teachingNote) {
      const note = document.createElement("p");
      note.className = "review-note";
      note.innerHTML = "<strong>Teaching note:</strong> ";
      note.append(m.case.teachingNote);
      item.append(note);
    }
    list.append(item);
  });
}

// Wire up the page once it has loaded.
$("scene-title").textContent = SCENARIO.title;
$("scene-briefing").textContent = SCENARIO.briefing;
$("btn-start").addEventListener("click", startRound);
document.querySelectorAll(".triage").forEach((btn) =>
  btn.addEventListener("click", () => choose(btn.dataset.color))
);
