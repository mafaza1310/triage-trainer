// app.js — screens, shuffling, the drill, timer and scoring.
// The clinical logic lives in start.js; the patients live in cases.js.

const state = {
  order: [],    // this round's cases, shuffled
  index: 0,     // which card is showing
  answers: {},  // caseId -> chosen colour
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

function startRound() {
  state.order = shuffle(CASES);
  state.index = 0;
  state.answers = {};
  renderCard();
  showScreen("screen-drill");
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
  showScreen("screen-results");
}

// Wire up the page once it has loaded.
$("scene-title").textContent = SCENARIO.title;
$("scene-briefing").textContent = SCENARIO.briefing;
$("btn-start").addEventListener("click", startRound);
document.querySelectorAll(".triage").forEach((btn) =>
  btn.addEventListener("click", () => choose(btn.dataset.color))
);
