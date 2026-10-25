// start.js — the adult START triage algorithm as pure functions.
// No screen code here: same findings in, same answer out.

// Walks through the START steps in order and returns the correct colour,
// the step that decided it, and the reason in words (used in explanations).
function startTriage(p) {
  // 1. Walking step
  if (p.walks) {
    return { color: "GREEN", step: "walking", reason: "being able to walk" };
  }

  // 2. Breathing step (reposition the airway if not breathing)
  if (!p.breathing) {
    if (p.breathesAfterAirway) {
      return { color: "RED", step: "breathing", reason: "breathing only after the airway is repositioned" };
    }
    return { color: "BLACK", step: "breathing", reason: "no breathing even after the airway is repositioned" };
  }

  // 3. Respiratory rate step
  if (p.rr !== null && p.rr > 30) {
    return { color: "RED", step: "respiratory rate", reason: `a respiratory rate above 30 (here ${p.rr}/min)` };
  }

  // 4. Perfusion step
  if (p.radialPulse === false) {
    return { color: "RED", step: "perfusion", reason: "an absent radial pulse" };
  }
  if (p.capRefillSec !== null && p.capRefillSec > 2) {
    return { color: "RED", step: "perfusion", reason: `a capillary refill above 2 seconds (here ${p.capRefillSec} s)` };
  }

  // 5. Mental status step
  if (p.followsCommands === false) {
    return { color: "RED", step: "mental status", reason: "being unable to follow simple commands" };
  }

  // 6. Passed every check
  return {
    color: "YELLOW",
    step: "final",
    reason: "not walking, but breathing at 30/min or less with a radial pulse, capillary refill of 2 seconds or less, and following commands",
  };
}

// Severity order for over/under-triage. BLACK is handled separately.
const SEVERITY = { GREEN: 1, YELLOW: 2, RED: 3 };

// Compares the user's choice with the correct colour.
// Returns "correct", "over" (too severe) or "under" (not severe enough).
function classifyError(choice, correct) {
  if (choice === correct) return "correct";
  if (correct === "BLACK") return "over";  // treating a dead patient as alive uses resources
  if (choice === "BLACK") return "under";  // a living patient would receive no care
  return SEVERITY[choice] > SEVERITY[correct] ? "over" : "under";
}

// Builds the sentence shown in the mistakes review.
// choice is null when the card was not triaged before time ran out.
function explain(choice, result) {
  const stepName = result.step;
  if (choice === null) {
    const reason = result.reason.charAt(0).toUpperCase() + result.reason.slice(1);
    return `Not triaged before time ran out. ${reason} means ${result.color} at the ${stepName} step.`;
  }
  return `You chose ${choice}, but ${result.reason} means ${result.color} at the ${stepName} step.`;
}

// Friendly label for the deciding step, used in the review.
function stepLabel(step) {
  return step === "final" ? "Final (all checks passed)" : step.charAt(0).toUpperCase() + step.slice(1);
}
