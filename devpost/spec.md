---
doc: spec
status: approved
---

# START Triage Trainer — Technical Spec

## How This Works, In Plain Language
The whole app is a **static website**: a few files that the browser downloads and runs by itself. There is no server and no database — nothing is saved, and nothing needs to be installed.

Five files, each with one job:

- **`index.html`** — the *skeleton*. It holds the three screens (Start, Drill, Results) as sections of one page. Only one is visible at a time.
- **`style.css`** — the *appearance*. Colours, fonts, spacing, big buttons, and the rules that make it fit a phone or a laptop.
- **`cases.js`** — the *data*. The 15 bus-crash patients, each written as a small record of findings (walks? breathing? RR? pulse? …) plus the narrative and teaching note. It never contains the correct colour.
- **`start.js`** — the *algorithm*. One function, `startTriage(patient)`, that walks through the START steps in order and returns the correct colour, the step that decided it, and the reason in words. It's a "pure function": same findings in, same answer out, no side effects — like a formula in a spreadsheet cell.
- **`app.js`** — the *behaviour*. It switches screens, shuffles cards, runs the timer, records each button tap, and at the end compares each answer with `startTriage` to build the score, the over/under-triage counts and the mistakes review.

A small extra page, **`selfcheck.html`**, runs all 15 cases through `startTriage` and shows a green "PASS" or a red "FAIL" table, so you can prove the answer key matches the algorithm.

Why this shape: plain HTML/CSS/JavaScript is what every browser already understands, so there is no framework to learn, no build step, and GitHub Pages can host it for free exactly as it is. Splitting the algorithm and the data from the screens means the clinical logic can be read and checked on its own.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. The user opens the link → the browser loads `index.html`, which pulls in `style.css`, then `cases.js`, `start.js`, `app.js` → the **Start screen** section is visible.
2. They tap **Start** → `app.js` shuffles a copy of the 15 cases, sets the answers list to empty, sets the clock to 300 seconds, shows the **Drill screen**, and starts a once-per-second tick.
3. Each tick → seconds left goes down by one and the timer text updates (turns a warning colour at ≤ 30 s).
4. They tap a colour → `app.js` stores `{caseId, choice}` and shows the next card and counter ("5 / 15").
5. After the 15th tap or when seconds left hits 0 → `app.js` stops the tick and calls `scoreRound()`.
6. `scoreRound()` → for each case in the round, asks `startTriage(case)` for the correct colour, compares it with the user's choice, and labels the result **correct / over-triage / under-triage / untriaged**.
7. The **Results screen** is filled in: score, time used, the three counts, and one review entry per mistake with the explanation sentence and teaching note.
8. **Play again** → back to step 2 (new shuffle).

```
 tap Start ──► app.js: shuffle(cases) ──► Drill screen ◄──┐
                                            │ tap colour   │ next card
                                            ▼              │
                                     answers.push(...) ────┘
                     15 answers OR timer = 0
                                            ▼
          scoreRound(): startTriage(case) vs choice ──► Results + Mistakes review
```

## Stack
- **HTML5, CSS3, vanilla JavaScript (ES2017+)** — no framework, no libraries, no build step. Learner's choice in `brief.md`: simple to understand and explain, easy to deploy on GitHub Pages. Tradeoff accepted: we write screen switching by hand (a few lines) instead of using a framework.
- Scripts are loaded with ordinary `<script src>` tags (not modules), so the app also works by just double-clicking `index.html` — no local server needed.
- Docs: [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval).

## Where It Runs and How Someone Tries It
- **Runtime:** any modern browser (phone or laptop). No keys, no installs.
- **Locally:** open `index.html` in a browser (double-click). Self-check: open `selfcheck.html`.
- **Deployed (learner's choice — required for their "done"):** GitHub Pages from the public repo `mafaza1310/triage-trainer`, branch `main`, folder `/ (root)`. URL: `https://mafaza1310.github.io/triage-trainer/`.
  - Deploy steps: create the public repo on GitHub → `git remote add origin …` → `git push -u origin main` → repo **Settings → Pages → Deploy from a branch → main / root** → wait ~1 minute → open the URL on phone and laptop.
  - Docs: [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart).
- **Demo video (1–3 min):** briefing → timer → triaging cards → results → mistakes review with step explanation → play again. Record from the deployed link or the local file.

## Look and Feel
From `prd.md > Look and Feel`.
- **Palette:** calm neutral background (very light grey-blue `#f4f6fa`), white cards, dark slate text (`#1f2933`), one accent (deep blue `#1d4ed8`) for Start/Play again.
- **Triage colours** (buttons, badges in review):
  - GREEN `#15803d` white text · YELLOW `#facc15` **dark text** (`#1f2933`) for contrast · RED `#dc2626` white text · BLACK `#111827` white text.
- **Typography:** system font stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) — fast, no download, native look. Card narrative ~1.25rem; buttons ~1.25rem bold, uppercase.
- **Density:** spacious and calm. One centred column, max width ~640px. Rounded corners (12px), soft shadows.
- **Buttons:** at least 64px tall; 2×2 grid on phones; a single row of four on screens ≥ 720px wide.
- **Timer:** large, top-right; turns red-tinted at ≤ 30 s.
- **Copy tone:** short, direct, instructor-like.
- No images, no sounds.

## Components

### START Algorithm (`start.js`)
`startTriage(patient)` → `{ color, step, reason }`.
- `color`: `"GREEN" | "YELLOW" | "RED" | "BLACK"`.
- `step`: `"walking" | "breathing" | "respiratory rate" | "perfusion" | "mental status" | "final"`.
- `reason`: the phrase that fills `{reason}` in the explanation template.

Logic, in order (PRD ref: `prd.md > Answer Key From the START Algorithm (the kernel)`):

| # | Condition | color | step | reason |
|---|---|---|---|---|
| 1 | `walks` | GREEN | walking | being able to walk |
| 2a | `!breathing && !breathesAfterAirway` | BLACK | breathing | no breathing even after the airway is repositioned |
| 2b | `!breathing && breathesAfterAirway` | RED | breathing | breathing only after the airway is repositioned |
| 3 | `rr > 30` | RED | respiratory rate | a respiratory rate above 30 (here {rr}/min) |
| 4a | `radialPulse === false` | RED | perfusion | an absent radial pulse |
| 4b | `capRefillSec > 2` | RED | perfusion | a capillary refill above 2 seconds (here {n} s) |
| 5 | `followsCommands === false` | RED | mental status | being unable to follow simple commands |
| 6 | otherwise | YELLOW | final | not walking, but breathing at 30/min or less with a radial pulse, capillary refill of 2 seconds or less, and following commands |

The step label shown to the user for `final` is "final (all checks passed)".

Also in `start.js` (pure helpers, no screen code):
- `classifyError(choice, correct)` → `"correct" | "over" | "under"` (PRD ref: `prd.md > Over-triage and Under-triage`):
  - same → correct; correct is BLACK and choice isn't → over; choice is BLACK and correct isn't → under; otherwise compare rank GREEN 1 < YELLOW 2 < RED 3 (higher = over).
- `explain(choice, result)` → the sentence. With a choice: "You chose {choice}, but {reason} means {color} at the {step} step." Untriaged: "Not triaged before time ran out. {Reason} means {color} at the {step} step." (PRD ref: `prd.md > Mistakes Review`.)

### Case Data (`cases.js`)
A single array `CASES` of 15 objects (see **Data Model**), written by the learner from `brief.md`. No colour or step fields. PRD ref: `prd.md > Answer Key From the START Algorithm (the kernel)`.

### Self-check (`selfcheck.html` + `selfcheck.js`)
`selfcheck.js` holds the **expected** colour and step for each case id (from `brief.md`), runs every case through `startTriage`, and renders a table (id, expected, computed, PASS/FAIL), the colour mix (must be 3/5/5/2), and a summary line. It also checks `classifyError` on the key rules (e.g. BLACK for a living patient = under). Results also go to the browser console. This lives outside `cases.js`, so the app's answer key still comes only from the algorithm. PRD ref: `prd.md > Answer Key From the START Algorithm (the kernel)`.

### Screens (`index.html`)
Three `<section>` elements — `#screen-start`, `#screen-drill`, `#screen-results` — only one without the `hidden` attribute at a time. Footer with the disclaimer outside the sections, always visible. PRD ref: `prd.md > Screens and Layout`.

### Screen Controller (`app.js`)
`showScreen(id)` hides all sections and shows one. PRD ref: `prd.md > Screens and Layout`.

### Drill Controller (`app.js`)
`startRound()` shuffles (Fisher–Yates) a copy of `CASES`, resets state, renders the first card, starts the timer. `choose(color)` records the answer and either renders the next card or ends the round. Buttons use `data-color` attributes and one click handler. PRD ref: `prd.md > Triage Drill`, `prd.md > Play Again`.

### Scene Timer (`app.js`)
`setInterval` every 1000 ms decrements `secondsLeft`; `formatTime(s)` → "m:ss". At 0, `endRound()`. `endRound()` always calls `clearInterval` so a timer can never keep running into the next round. PRD ref: `prd.md > Scene Timer`.

### Results and Mistakes Review (`app.js`)
`scoreRound()` builds one result per case in the round: `{case, choice|null, correct: startTriage(case), outcome}`. `renderResults()` shows score `correct / 15`, time used (`300 − secondsLeft`, as m:ss), over / under / untriaged counts, then a review card for every non-correct result: narrative, "Your choice" badge (or "Not triaged"), "Correct" badge, outcome label (Over-triage / Under-triage / Not triaged), deciding step, explanation sentence, teaching note (if any). Perfect round → congratulation message. PRD ref: `prd.md > Results Screen`, `prd.md > Mistakes Review`.

## Data Model
**Case** (in `cases.js`, never changes at runtime):

```js
{
  id: 11,
  narrative: "55-year-old man is trapped by the legs…",
  walks: false,
  breathing: true,
  breathesAfterAirway: null,   // only used when breathing is false
  rr: 24,                      // null if not applicable
  radialPulse: true,           // null if not applicable
  capRefillSec: 4,             // null if not measured
  followsCommands: true,       // null if not applicable
  teachingNote: "A present radial pulse does not clear…" // or ""
}
```

**Round state** (in `app.js` memory only):

```js
state = {
  order: [/* shuffled cases */],
  index: 0,                 // which card is showing
  answers: {},              // caseId -> "GREEN" | "YELLOW" | "RED" | "BLACK"
  secondsLeft: 300,
  timerId: null
}
```

Nothing persists. Refreshing the page returns to the Start screen (PRD ref: `prd.md > States and Boundaries`).

## File Structure

```
triage-trainer/
├── index.html        # the three screens + footer; loads style.css and the 3 scripts
├── style.css         # look and feel, triage colours, phone/laptop layout
├── cases.js          # CASES: the 15 bus-crash patients (findings only, no answers)
├── start.js          # startTriage(), classifyError(), explain() — pure START logic
├── app.js            # screens, shuffle, timer, scoring, results + review rendering
├── selfcheck.html    # opens the self-check in a browser
├── selfcheck.js      # expected answers from brief.md; PASS/FAIL table
├── README.md         # what it is, live link, how to run, disclaimer
├── brief.md          # learner's answers (input to planning)
└── devpost/
    ├── scope.md
    ├── prd.md
    ├── spec.md
    └── checklist.md  # build steps (written by 5-build)
```

## External Services and Dependencies
- **GitHub** (repo hosting) and **GitHub Pages** (free static hosting). No API keys, no rate limits that matter, free for public repos. Docs: [GitHub Pages](https://docs.github.com/en/pages).
- No other services, libraries or CDNs.

## Important Failure Modes
- **Timer keeps running after the round ends or doubles on Play again** → `endRound()` always clears the interval, and `startRound()` clears any existing one before starting a new one.
- **Case data typo makes the algorithm give a wrong colour** → the self-check shows a red FAIL row naming the case; fix the data before demoing.
- **Yellow button text unreadable / buttons too small on phone** → dark text on yellow; buttons ≥ 64px tall; checked at phone width during the build.
- **GitHub Pages shows 404** → Pages not enabled or wrong branch/folder; re-check Settings → Pages (main / root) and wait a minute.

## What Was Simplified and Why
- **Static files** instead of a server and database — nothing needs saving; GitHub Pages hosts it free. The fuller version (history, accounts) would need a backend.
- **Global script tags** instead of JavaScript modules — works by double-clicking the file with no local server; fine for 3 small scripts.
- **Self-check as a web page** instead of a test framework — no installs; one page a non-programmer can open and read.
- **One hardcoded scenario** instead of a scenario loader — one scenario proves the loop.

## Decisions and Open Issues
- **Learner choices (from `brief.md`):** plain HTML/CSS/JS, no framework/build/backend/database; five named files; answer key computed by `startTriage`, never typed; over/under rules including BLACK; a self-check that verifies the 3/5/5/2 mix; GitHub Pages deployment.
- **Implementation details derived from those choices:** global `<script>` tags; expected answers live in `selfcheck.js`, not `cases.js`; `classifyError` and `explain` live in `start.js` with the algorithm because they are pure logic; YELLOW explanation uses the step name "final"; timer warning at ≤ 30 s; cards shuffled every round including the first.
- **Learner uncertainty addressed:** the learner wants to understand how a web app's HTML, CSS and JavaScript divide the work well enough to explain their own code. Clarified by the plain-language section above and by a 2–3 sentence explanation after each build step.
- **Open:** none blocking the build. GitHub repo creation and Pages enabling happen in the learner's GitHub account (build step 7) — may need the learner to sign in.
