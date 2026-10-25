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
  showScreen("screen-results");
}

// Wire up the page once it has loaded.
$("scene-title").textContent = SCENARIO.title;
$("scene-briefing").textContent = SCENARIO.briefing;
$("btn-start").addEventListener("click", startRound);
document.querySelectorAll(".triage").forEach((btn) =>
  btn.addEventListener("click", () => choose(btn.dataset.color))
);
