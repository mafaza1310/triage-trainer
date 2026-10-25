---
doc: prd
status: approved
---

# START Triage Trainer — Product Requirements

A timed web drill where medical students, paramedics and disaster volunteers triage a 15-casualty "Highway bus crash" with adult START, then review every mistake with an explanation of the exact START step they got wrong.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`. All answers come from the learner's `brief.md`.

## The Core Journey
(Develops `scope.md > The Core Loop`.)

1. The user opens the link and lands on the **Start screen**: app name, a one-sentence explanation, and the scene briefing for "Highway bus crash" (15 adult casualties, 5 minutes).
2. They tap **Start**. The **Drill screen** appears and the 5-minute scene timer starts counting down.
3. They see one patient card at a time: a short narrative containing the findings, the timer, and a card counter (e.g. "4 / 15").
4. They tap one of four large buttons — **GREEN / YELLOW / RED / BLACK**. The next card appears immediately. No right/wrong feedback is shown during the round.
5. The round ends when all 15 cards are triaged **or** the timer reaches 0:00, whichever comes first.
6. The **Results screen** shows: score (correct / 15), time used, over-triage count, under-triage count, and untriaged count (if time ran out).
7. Below the results, the **Mistakes review** lists every wrong or missed card with its step-level explanation and the learner's teaching note.
8. They tap **Play again**: the cards are reshuffled, the timer resets, and the drill restarts.

Success: the user finishes a round and understands, for each mistake, which START step decided the correct colour.

## Screens and Layout
Three screens, one visible at a time, in a single page:

- **Start screen** — app name, one-sentence explanation, scene briefing, big Start button.
- **Drill screen** — top bar with timer and card counter; large patient card in the middle; four big triage buttons below (2×2 grid on phone, a single row on wide screens is acceptable).
- **Results screen** — score summary at top, then the Mistakes review list, then Play again.

A footer on every screen: "Educational training tool. Not for clinical decision-making."

## Look and Feel
(From `scope.md > Inspiration & Identity`.)
- Clean, modern, calm design; large readable cards and text.
- Big, clearly coloured buttons in true triage colours: green, yellow, red, and black with white text. Text on each button must stay readable (e.g. dark text on yellow).
- Works well on both a phone and a laptop; no horizontal scrolling on a phone.
- Smooth flow with no confusing screens. "Polished" means quality of the existing flow — **not more features**. No images or sounds.

## Features and Behavior

### Start Screen
- As a trainee, I want a short briefing so that I know the scene before the clock starts.
  - [ ] Shows app name, one-sentence explanation, scene title "Highway bus crash", briefing (15 adult casualties, 5 minutes, adult START), and a Start button.
  - [ ] The timer does not run on this screen.

### Triage Drill
- As a trainee, I want to triage patients one at a time under a single scene timer so that it feels like a real incident.
  - [ ] Tapping Start shows the first card and the timer at 5:00, counting down each second.
  - [ ] The card counter shows the current position, e.g. "1 / 15".
  - [ ] Each card shows only the narrative (the findings are inside it). The correct colour is never shown during the round.
  - [ ] Tapping any of the four colour buttons records the choice and immediately shows the next card. There is no undo.
  - [ ] After the 15th card, the Results screen appears and the timer stops.

### Scene Timer
- As a trainee, I want one countdown for the whole scene so that I practise working under time pressure.
  - [ ] One timer for the whole round (not per card), shown as m:ss.
  - [ ] When it reaches 0:00 the round ends immediately and the Results screen appears; any cards not yet triaged count as **untriaged**.
  - [ ] Time used is shown on the Results screen (e.g. "3:42"); if time ran out it shows 5:00.

### Answer Key From the START Algorithm (the kernel)
(Develops `scope.md > The Unique Kernel`.)
- The correct colour and the **deciding step** for every case are computed from the case's structured findings by the adult START algorithm — never typed by hand — so the answer key can never contradict the algorithm.
- START steps, in order:
  1. **Walking step:** can walk → GREEN.
  2. **Breathing step:** not breathing → reposition airway. Still not breathing → BLACK. Breathes after repositioning → RED.
  3. **Respiratory rate step:** RR > 30/min → RED.
  4. **Perfusion step:** radial pulse absent OR capillary refill > 2 seconds → RED.
  5. **Mental status step:** cannot follow simple commands → RED.
  6. Otherwise → YELLOW.
- [ ] A self-check runs every one of the 15 cases through the algorithm and confirms the expected results: 3 GREEN, 5 YELLOW, 5 RED, 2 BLACK, each matching the expected colour and step in `brief.md`.

### Over-triage and Under-triage
- Severity order GREEN < YELLOW < RED.
  - Choosing a more severe colour than correct = **over-triage**; less severe = **under-triage**.
  - Choosing BLACK for a living patient = **under-triage** (the most dangerous error — they would receive no care).
  - Choosing any other colour for a BLACK patient = **over-triage**.
- Untriaged cards (time ran out) are counted separately, not as over- or under-triage.
  - [ ] Results show three separate counts: over-triage, under-triage, untriaged.

### Results Screen
- As a trainee, I want a clear summary so that I know how I did at a glance.
  - [ ] Shows score as "correct / 15", time used, over-triage count, under-triage count, and untriaged count (shown when time ran out).
  - [ ] Counts add up: correct + over + under + untriaged = 15.

### Mistakes Review
- As a trainee, I want each mistake explained at the START step so that I learn the reasoning, not just the answer.
  - [ ] Lists every wrong or untriaged card. Each entry shows: the narrative, the user's choice (or "Not triaged"), the correct colour, the deciding START step, the generated explanation, and the teaching note if the case has one.
  - [ ] Each wrong entry is labelled over-triage or under-triage.
  - [ ] Explanation follows the template: "You chose {user}, but {reason} means {correct} at the {step} step." Example: "You chose YELLOW, but a respiratory rate above 30 means RED at the respiratory rate step."
  - [ ] For untriaged cards: "Not triaged before time ran out. {reason} means {correct} at the {step} step."
  - [ ] If there are no mistakes, a short congratulation message replaces the list.

### Play Again
- [ ] Tapping Play again shuffles the 15 cards into a new random order, resets the timer to 5:00 and the counter to 1 / 15, clears previous answers, and starts the drill.

## States and Boundaries
- **First use** — Start screen with briefing; nothing to set up.
- **Normal round** — all 15 cards triaged before the timer ends; untriaged = 0.
- **Time ran out** — round ends mid-card; remaining cards are untriaged and appear in the review.
- **Perfect round** — score 15 / 15; review shows a congratulation message instead of mistakes.
- **Persistence** — nothing is saved. Refreshing the page returns to the Start screen.
- **Leaving mid-round** — no pause or quit button in version 1; refreshing resets.

## Product Decisions
- One scenario, 15 cases, 5-minute scene timer — enough to prove the loop in a one-day build.
- One timer for the whole scene, not per card — realism of a real incident.
- No feedback during the round — realism; learning happens in the review.
- Over- and under-triage counted separately — they have different consequences.
- BLACK for a living patient counts as under-triage — the most dangerous error.
- Answer key computed by the START algorithm, with a self-check — answers can never contradict the algorithm.
- Learner writes all clinical cases and teaching notes — clinical correctness is the learner's call.
- **Assumption:** cards are shuffled for every round, including the first (brief says Play again shuffles; shuffling the first round too keeps behaviour consistent).
- **Assumption:** the YELLOW explanation names what the patient passed, e.g. "…but a respiratory rate of 30 or less, a radial pulse with capillary refill of 2 seconds or less, and following commands means YELLOW at the final step." Exact wording is fixed in the spec.
- **Assumption:** in the final 30 seconds the timer turns a warning colour (visual polish, no sound).

## What We're Building
- Start screen with briefing; drill screen with 15 shuffled cards, scene timer, counter, four colour buttons; results with score, time used, over/under/untriaged counts; mistakes review with step explanations and teaching notes; play again; footer disclaimer.
- START algorithm that computes the correct colour and deciding step, plus a self-check over all 15 cases.
- Responsive layout for phone and laptop.
- Deployment to GitHub Pages from a public repo (`mafaza1310`) that includes `devpost/scope.md`, `devpost/prd.md`, `devpost/spec.md`.

## Deferred From the POC
- Saved history / progress over time — needs storage or accounts.
- Multiple scenarios — content work; one scenario proves the loop.
- Re-triage of green patients — a second phase of the incident, beyond one-day size.

## Possible Later Enhancements
- JumpSTART (pediatric) and SALT algorithm modes.
- Arabic and Turkish versions.
- Instructor dashboard for running group drills.

## Non-Goals
- Login, accounts, leaderboards — no backend in version 1.
- AI features — deterministic explanations are more trustworthy for clinical teaching.
- Sounds and images — asset work without learning value.
- Clinical decision support — this is an educational tool only (footer disclaimer).

## Open Questions
None blocking `4-spec`.
