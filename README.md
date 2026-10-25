# START Triage Trainer

A timed web drill for practising **adult START triage** in a mass-casualty incident — built for medical students, paramedics and disaster volunteers.

**Live app:** https://mafaza1310.github.io/triage-trainer/

## What it does
- **Scene:** "Highway bus crash" — 15 adult casualties, one 5-minute scene timer.
- **Drill:** one patient card at a time; tap GREEN / YELLOW / RED / BLACK. No feedback until the round ends, like a real incident.
- **Results:** score, time used, and **over-triage** and **under-triage** counted separately (plus untriaged patients if time runs out).
- **Mistakes review:** every error is explained at the exact START step that decides the colour, e.g. *"You chose YELLOW, but a respiratory rate above 30 (here 36/min) means RED at the respiratory rate step."*
- **Play again:** the cards are reshuffled.

The correct colours are never typed by hand: `start.js` computes them from each patient's findings, so the answer key cannot contradict the algorithm.

## Run it locally
No install needed. Download the repo and open `index.html` in a browser.
Open `selfcheck.html` to verify that all 15 cases give the expected START result (3 GREEN, 5 YELLOW, 5 RED, 2 BLACK).

## Files
| File | Job |
|---|---|
| `index.html` | The three screens (start, drill, results) |
| `style.css` | Look and feel, triage colours, phone/laptop layout |
| `cases.js` | The 15 patients' findings and teaching notes |
| `start.js` | The START algorithm, over/under-triage rules, explanations |
| `app.js` | Screens, shuffle, timer, scoring, mistakes review |
| `selfcheck.html` / `selfcheck.js` | Automated check of the answer key |

Planning documents: [`devpost/scope.md`](devpost/scope.md), [`devpost/prd.md`](devpost/prd.md), [`devpost/spec.md`](devpost/spec.md).

## Disclaimer
Educational training tool. Not for clinical decision-making.
