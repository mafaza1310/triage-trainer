# Project Brief — START Triage Trainer

This file contains all my answers for the 2-scope, 3-prd, 4-spec and 5-build skills. Use it as my input. Only ask me a question if something critical is truly missing.

## About me
- Physician (MBBS) and PhD student in Disaster Management.
- I use Python for research (data analysis, ML, NLP). I have built a Streamlit app. I am new to HTML/CSS/JavaScript and to coding agents.
- Learning goals: understand how a simple web app is structured (HTML, CSS, JavaScript) well enough to explain my code; guide a coding agent step by step without drifting; deploy the app online with a public link.
- I am short on time: the plan must be buildable in one day.

## The idea (scope)
A web app that trains medical students, paramedics and disaster volunteers in adult mass-casualty START triage.

**Problem:** triage skills fade without practice, and real mass-casualty drills are rare and expensive.

**Kernel (must be protected):** for every mistake, the app shows exactly which step of the START algorithm the user got wrong, e.g. "You chose YELLOW, but a respiratory rate above 30 means RED at the breathing step." This teaches the reasoning, not just the answer.

**What makes it different from flashcards:**
1. Time pressure: one timer for the whole scene, like a real incident.
2. Over-triage vs under-triage are counted separately, because they have different consequences (under-triage can kill a salvageable patient; over-triage wastes scarce resources and overwhelms the red area).
3. Step-level explanation of each error, computed by the START algorithm.

## In scope (version 1)
- One scenario: "Highway bus crash", 15 adult casualties, 5-minute scene timer.
- Start screen: app name, one-sentence explanation, scene briefing, Start button.
- Drill screen: one patient card at a time (short narrative with the findings), timer visible, card counter (e.g. 4 / 15), four large buttons GREEN / YELLOW / RED / BLACK. Tapping a button moves immediately to the next card. No right/wrong feedback during the round (realism).
- Results screen: score (correct / 15), time used, number of over-triage errors, number of under-triage errors, number of untriaged patients if time ran out.
- Mistakes review: for each wrong or missed card — the narrative, the user's choice, the correct color, the deciding START step, the generated explanation, and my optional teaching note.
- Play again: shuffles card order.
- Short disclaimer in the footer: "Educational training tool. Not for clinical decision-making."

## Out of scope (future work)
Login/accounts, saved history, leaderboards, multiple scenarios, JumpSTART (pediatric), SALT, Arabic/Turkish versions, AI features, sounds, images, instructor dashboard, re-triage of green patients.

## What "polished" means
Clean modern visual design, smooth flow with no confusing screens, large readable cards, big clearly colored buttons (triage colors: green, yellow, red, black with white text), works well on a phone and a laptop. Not more features.

## "Done" means
- Deployed to a free public link (GitHub Pages) and works on phone and laptop.
- Public GitHub repo (my username: mafaza1310) containing devpost/scope.md, devpost/prd.md, devpost/spec.md.
- Demo video (1–3 minutes) showing: briefing → timer → triaging cards → results → mistakes review with step explanation → play again.

## Technical choices (spec)
- Plain HTML + CSS + vanilla JavaScript. No framework, no build step, no backend, no database. This keeps it simple for me to understand and easy to deploy on GitHub Pages.
- Files: index.html, style.css, app.js (screens + timer + scoring), start.js (the START algorithm as a pure function), cases.js (the patient cases as data).
- The correct color is NEVER typed by hand. The app computes it from the structured findings with the START function, which also returns the deciding step. This means the answer key can never contradict the algorithm.
- Severity order for over/under-triage: GREEN < YELLOW < RED. Choosing a more severe color than correct = over-triage; less severe = under-triage. For BLACK: choosing BLACK for a living patient = under-triage (most dangerous error — they would receive no care); choosing any other color for a BLACK patient = over-triage.
- Add a small automated self-check (e.g. a test page or console check) that runs every case through the START function and confirms the expected mix below.

## START algorithm (adult) — steps in order
1. **Walking step:** can walk → GREEN.
2. **Breathing step:** not breathing → reposition airway. Still not breathing → BLACK. Breathes after repositioning → RED.
3. **Respiratory rate step:** RR > 30/min → RED.
4. **Perfusion step:** radial pulse absent OR capillary refill > 2 seconds → RED.
5. **Mental status step:** cannot follow simple commands → RED.
6. Otherwise → YELLOW.

Explanation template example: "You chose {user}, but {reason} means {correct} at the {step} step."

## Case data structure
Each case: id, narrative (what the responder sees, includes the findings), walks (true/false), breathing (true/false), breathesAfterAirway (true/false or null if breathing), rr (number or null), radialPulse (true/false or null), capRefillSec (number or null), followsCommands (true/false or null), teachingNote (optional text).

## The 15 cases — Highway bus crash (expected mix: 3 GREEN, 5 YELLOW, 5 RED, 2 BLACK)

1. **34-year-old man** walks over to you holding his forearm, which has a deep laceration that is bleeding slowly. He is alert and talking.
   walks: true. Expected: GREEN (walking step).
   Teaching note: Walking patients go to the green area first; direct them to apply pressure to their own wound.

2. **22-year-old woman** is limping and crying, saying her ankle hurts badly, but she walks to the assembly point when asked.
   walks: true. Expected: GREEN (walking step).
   Teaching note: Pain and distress do not change the category if the patient can walk.

3. **60-year-old man** walks toward you with bruising on his chest, complaining of chest pain.
   walks: true. Expected: GREEN (walking step).
   Teaching note: START assigns green at the walking step. Walking patients with worrying complaints must be re-triaged early in the green area.

4. **45-year-old woman** lies near the bus with an open fracture of the lower leg. RR 22, radial pulse present, follows commands.
   walks: false, breathing: true, rr: 22, radialPulse: true, capRefillSec: 2, followsCommands: true. Expected: YELLOW.
   Teaching note: A dramatic-looking injury is not automatically red; the physiology decides.

5. **70-year-old man** sits on the roadside unable to stand because of hip pain. RR 18, radial pulse present, capillary refill 2 seconds, answers questions and follows commands.
   walks: false, breathing: true, rr: 18, radialPulse: true, capRefillSec: 2, followsCommands: true. Expected: YELLOW.

6. **28-year-old man** has burns to both legs and cannot walk. RR 26, radial pulse present, follows commands.
   walks: false, breathing: true, rr: 26, radialPulse: true, capRefillSec: 2, followsCommands: true. Expected: YELLOW.

7. **38-year-old woman** lies on her back, says she cannot move her legs and has back pain. RR 20, radial pulse present, follows commands.
   walks: false, breathing: true, rr: 20, radialPulse: true, capRefillSec: 1, followsCommands: true. Expected: YELLOW.
   Teaching note: Suspected spinal injury does not by itself make a patient red in START.

8. **52-year-old man** has a bleeding scalp wound, feels dizzy and cannot stand. RR 28, radial pulse present, follows commands.
   walks: false, breathing: true, rr: 28, radialPulse: true, capRefillSec: 2, followsCommands: true. Expected: YELLOW.
   Teaching note: The respiratory threshold is above 30. A rate of 28 does not meet it.

9. **40-year-old man** lies unresponsive and is not breathing. After a head-tilt chin-lift he starts breathing.
   walks: false, breathing: false, breathesAfterAirway: true. Expected: RED (breathing step).
   Teaching note: Breathing only after airway repositioning means immediate category.

10. **30-year-old woman** has an obvious chest wall injury and is breathing fast. RR 36, radial pulse present, follows commands.
    walks: false, breathing: true, rr: 36, radialPulse: true, capRefillSec: 2, followsCommands: true. Expected: RED (respiratory rate step).

11. **55-year-old man** is trapped by the legs with a suspected pelvic injury. RR 24, radial pulse weak but present, capillary refill 4 seconds, follows commands.
    walks: false, breathing: true, rr: 24, radialPulse: true, capRefillSec: 4, followsCommands: true. Expected: RED (perfusion step).
    Teaching note: A present radial pulse does not clear the perfusion step if capillary refill is above 2 seconds.

12. **25-year-old man** is pale and sweaty, holding his abdomen. RR 24, radial pulse absent, follows commands.
    walks: false, breathing: true, rr: 24, radialPulse: false, capRefillSec: null, followsCommands: true. Expected: RED (perfusion step).
    Teaching note: Absent radial pulse suggests shock; this patient may have internal bleeding.

13. **48-year-old woman** has a head injury and is confused. RR 20, radial pulse present, capillary refill 1 second, but she cannot squeeze your hand on command.
    walks: false, breathing: true, rr: 20, radialPulse: true, capRefillSec: 1, followsCommands: false. Expected: RED (mental status step).

14. **65-year-old man** lies motionless and is not breathing. After airway repositioning he still does not breathe.
    walks: false, breathing: false, breathesAfterAirway: false. Expected: BLACK (breathing step).
    Teaching note: In START, no CPR is performed during initial triage of a mass-casualty incident.

15. **35-year-old woman** has a severe head injury and is not breathing. After airway repositioning there is still no breathing.
    walks: false, breathing: false, breathesAfterAirway: false. Expected: BLACK (breathing step).

## Build order (5-build)
1. START function + cases + self-check (verify all 15 expected results).
2. Start screen and drill screen with buttons (no timer yet).
3. Timer and end-of-round logic.
4. Results screen with over/under-triage counts.
5. Mistakes review with step explanations and teaching notes.
6. Play again with shuffle; mobile layout and visual polish.
7. Deploy to GitHub Pages.

After each step: test it, commit to git, and give me a 2–3 sentence plain-language explanation of what the code does, so I can explain my own code.
