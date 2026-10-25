---
doc: scope
status: approved
---

# START Triage Trainer

A timed, phone-friendly web drill that trains adult mass-casualty START triage — and explains every mistake at the exact step of the algorithm where the reasoning went wrong.

## The Unique Kernel
For every mistake, the app shows **exactly which step of the START algorithm the user got wrong**, e.g. *"You chose YELLOW, but a respiratory rate above 30 means RED at the respiratory rate step."* The explanation is computed by the START algorithm itself from the patient's findings, so it teaches the reasoning, not just the answer — and the answer key can never contradict the algorithm.

Two supporting differences from flashcards:
- **Time pressure:** one timer for the whole scene, like a real incident.
- **Over-triage vs under-triage counted separately**, because they have different consequences: under-triage can kill a salvageable patient; over-triage wastes scarce resources and overwhelms the red area.

## Who It's For
Medical students, paramedics and disaster volunteers who have learned START but rarely get to practise it. Today they rely on occasional mass-casualty drills, which are rare and expensive, so the skill fades between them.

## The Core Loop
Read the scene briefing → start the 5-minute scene timer → triage 15 patient cards one at a time (GREEN / YELLOW / RED / BLACK, no feedback during the round) → see the score with over- and under-triage counts → review each mistake with its step-level explanation → play again with the cards shuffled.

People come back because each round is short, the order changes, and the review shows them precisely which step they keep missing.

## Inspiration & Identity
Clean, modern, calm under pressure. Large readable cards and big, clearly coloured buttons in the real triage colours (green, yellow, red, black with white text). Works equally well on a phone and a laptop. "Polished" means a smooth flow with no confusing screens — **not more features**.

## Why This Matters to the Learner
The learner is a physician and PhD student in Disaster Management: "triage skills fade without practice, and real mass-casualty drills are rare and expensive." They write the clinical cases themselves. They also want to learn how a simple web app is structured well enough to explain their own code, how to guide a coding agent step by step without drifting, and how to deploy an app to a public link — all in one day.

## What "Working" Looks Like
Someone opens a public GitHub Pages link on their phone or laptop, reads the "Highway bus crash" briefing, starts the timer, and triages 15 casualties. The results screen shows score, time used, over-triage, under-triage and untriaged counts. The **"oh, that's cool" beat**: tapping into the mistakes review and seeing, for a patient they marked YELLOW, *"…a respiratory rate above 30 means RED at the respiratory rate step"*, plus the learner's own teaching note. Then Play again reshuffles the scene.

The demo video (1–3 min) shows: briefing → timer → triaging cards → results → mistakes review with step explanation → play again.

## The POC Boundary
- One scenario: "Highway bus crash", 15 adult casualties (3 GREEN, 5 YELLOW, 5 RED, 2 BLACK), 5-minute scene timer.
- Start, drill, results and mistakes-review screens; play again with shuffle.
- Correct colours and deciding steps computed by a START function — never typed by hand — with a self-check that verifies all 15 cases.
- Footer disclaimer: "Educational training tool. Not for clinical decision-making."
- Deployed to GitHub Pages from a public repo (mafaza1310) that includes these planning docs.

## Later
Multiple scenarios, JumpSTART (pediatric), SALT, Arabic/Turkish versions, re-triage of green patients, saved history, instructor dashboard.

## Explicitly Cut
- **Login/accounts, saved history, leaderboards** — need a backend; not needed to prove the kernel.
- **Multiple scenarios** — one well-built scenario proves the loop; more is content work.
- **JumpSTART / SALT** — different algorithms; START alone proves the step-explanation idea.
- **Arabic/Turkish versions** — translation is valuable but doubles content work.
- **AI features** — explanations are deterministic from the algorithm, which is more trustworthy for clinical teaching.
- **Sounds, images** — polish that adds asset work, not learning value.
- **Instructor dashboard, re-triage of green patients** — beyond one-day size.
