---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (learner asked for auto mode with a 2–3 sentence explanation after each step; build order taken from `brief.md`)

## Slices

- [x] **1. The START algorithm decides every case correctly**
  Becomes usable: `selfcheck.html` opens in a browser and shows all 15 cases computed by `startTriage` with PASS, the 3/5/5/2 mix, and the over/under rules checked.
  Why now: The kernel and the biggest clinical risk — if the algorithm or data is wrong, everything built on top is wrong. It leaves runnable evidence.
  PRD ref: `prd.md > Answer Key From the START Algorithm (the kernel)`, `prd.md > Over-triage and Under-triage`
  Spec ref: `spec.md > START Algorithm (start.js)`, `spec.md > Case Data (cases.js)`, `spec.md > Self-check (selfcheck.html + selfcheck.js)`, `spec.md > Data Model`
  Build: Write `start.js` (startTriage, classifyError, explain), `cases.js` (15 cases from brief.md), `selfcheck.js` + `selfcheck.html`.
  Verify (mechanical): Run the same self-check in Node and confirm 15/15 PASS, mix 3/5/5/2, all classifyError checks pass.
  Learner check: Open `selfcheck.html`; every row should say PASS and the summary should be green.
  Commit: `Add START algorithm, bus-crash cases and self-check`

- [x] **2. You can read the briefing and triage all 15 cards**
  Becomes usable: Start screen → Start → one card at a time with counter and four colour buttons → after card 15 a placeholder end screen.
  Why now: Gives the core loop a body as early as possible, on top of the verified algorithm.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Start Screen`, `prd.md > Triage Drill`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Screens (index.html)`, `spec.md > Screen Controller (app.js)`, `spec.md > Drill Controller (app.js)`, `spec.md > Look and Feel`
  Build: `index.html` with three sections and footer, base `style.css`, `app.js` with showScreen, startRound (shuffled), choose.
  Verify (mechanical): Load the page in a headless browser/DOM script, click Start and 15 buttons, confirm counter goes 1→15 and the results section appears; no console errors.
  Learner check: Open `index.html`, read the briefing, tap through all 15 cards.
  Commit: `Add start and drill screens`

- [x] **3. The scene timer runs and ends the round**
  Becomes usable: A 5:00 countdown on the drill screen; at 0:00 the round ends with remaining cards untriaged.
  Why now: Time pressure is a core difference from flashcards and changes how the round ends.
  PRD ref: `prd.md > Scene Timer`
  Spec ref: `spec.md > Scene Timer (app.js)`, `spec.md > Important Failure Modes`
  Build: setInterval tick, formatTime, warning style ≤ 30 s, endRound clearing the interval.
  Verify (mechanical): Script with a fake clock: timer shows 5:00, then 4:59; forcing 0 ends the round with untriaged cards; no interval left running.
  Learner check: Start a round and watch the timer count down.
  Commit: `Add scene timer and end-of-round logic`

- [x] **4. Results show score and over/under-triage counts**
  Becomes usable: Results screen with correct / 15, time used, over-, under-triage and untriaged counts.
  Why now: Turns the round into feedback; needs the timer's untriaged state.
  PRD ref: `prd.md > Results Screen`, `prd.md > Over-triage and Under-triage`
  Spec ref: `spec.md > Results and Mistakes Review (app.js)`
  Build: scoreRound and the summary part of renderResults.
  Verify (mechanical): Scripted rounds (all correct; all GREEN; timeout) give the expected counts and they add up to 15.
  Learner check: Play a round with a few deliberate mistakes; check the counts match.
  Commit: `Add results screen with over- and under-triage counts`

- [x] **5. Mistakes review explains each error at the START step**
  Becomes usable: For each wrong or untriaged card: narrative, your choice, correct colour, deciding step, explanation, teaching note.
  Why now: This is the kernel on screen — the "oh, that's cool" beat.
  PRD ref: `prd.md > Mistakes Review`
  Spec ref: `spec.md > Results and Mistakes Review (app.js)`, `spec.md > START Algorithm (start.js)`
  Build: Review list rendering, badges, perfect-round message.
  Verify (mechanical): Scripted round with case 10 answered YELLOW shows "You chose YELLOW, but a respiratory rate above 30 (here 36/min) means RED at the respiratory rate step." and its entries count equals the mistakes.
  Learner check: Mark the fast-breathing chest-injury patient YELLOW and read the explanation.
  Commit: `Add mistakes review with step explanations`

- [x] **6. Play again, mobile layout and polish**
  Becomes usable: Play again reshuffles and restarts cleanly; layout looks good on phone and laptop.
  Why now: Completes the loop and the "polished" bar before deploying.
  PRD ref: `prd.md > Play Again`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Drill Controller (app.js)`, `spec.md > Look and Feel`
  Build: Play again button, responsive CSS, visual polish, README.
  Verify (mechanical): Scripted two rounds back-to-back: state resets, one interval only; screenshots at 375px and 1280px widths show no horizontal scroll.
  Learner check: Play twice on your phone-sized browser window; order should differ.
  Commit: `Add play again, responsive layout and polish`

- [x] **7. Live on GitHub Pages**
  Becomes usable: Anyone can open `https://mafaza1310.github.io/triage-trainer/`.
  Why now: Learner's definition of done requires a public link.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`
  Build: Create public repo, push main, enable Pages (main / root).
  Verify (mechanical): Fetch the Pages URL and confirm HTTP 200 and the app title.
  Learner check: Open the link on your phone and laptop and play one round.
  Commit: `Add deployment notes`

## Hands-on Checkpoints

- [x] Early usable behavior explored — combined with the final session (learner asked for auto mode); learner tried the live app
- [x] Final kick-the-tires exploration and feedback completed — learner: "works well"

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship (no changes requested)

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Short static walkthrough at learner's request ("keep it short"), following one colour tap; evidence: browser tests for every slice, `selfcheck.html` 15/15 PASS locally and on the live site.
Route and stops: 1) `app.js` `btn.dataset.color` → `choose()`; 2) `start.js` `startTriage()` via `scoreRound()`/`classifyError()`; 3) `app.js` `renderReview()` + `start.js` `explain()`.
Edit outcome: offered as optional (change `SCENARIO.seconds`); not done during the short walkthrough.
Reflection: offered as optional.
Activity mode: static walkthrough (source excerpts in chat + app map), not a live editor session.

## Revisions

