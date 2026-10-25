// cases.js — Highway bus crash: 15 adult casualties.
// Only the findings are stored here. The correct colour is NEVER typed by hand:
// it is computed by startTriage() in start.js.
// Fields that don't apply at this patient's deciding step are null.

const SCENARIO = {
  title: "Highway bus crash",
  briefing:
    "A coach carrying 40 passengers has overturned on the highway. You are the first triage officer on scene. " +
    "Triage 15 adult casualties using START before the scene timer runs out.",
  seconds: 300,
};

const CASES = [
  {
    id: 1,
    narrative: "A 34-year-old man walks over to you holding his forearm, which has a deep laceration that is bleeding slowly. He is alert and talking.",
    walks: true, breathing: null, breathesAfterAirway: null, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "Walking patients go to the green area first; direct them to apply pressure to their own wound.",
  },
  {
    id: 2,
    narrative: "A 22-year-old woman is limping and crying, saying her ankle hurts badly, but she walks to the assembly point when asked.",
    walks: true, breathing: null, breathesAfterAirway: null, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "Pain and distress do not change the category if the patient can walk.",
  },
  {
    id: 3,
    narrative: "A 60-year-old man walks toward you with bruising on his chest, complaining of chest pain.",
    walks: true, breathing: null, breathesAfterAirway: null, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "START assigns green at the walking step. Walking patients with worrying complaints must be re-triaged early in the green area.",
  },
  {
    id: 4,
    narrative: "A 45-year-old woman lies near the bus with an open fracture of the lower leg. RR 22, radial pulse present, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 22, radialPulse: true, capRefillSec: 2, followsCommands: true,
    teachingNote: "A dramatic-looking injury is not automatically red; the physiology decides.",
  },
  {
    id: 5,
    narrative: "A 70-year-old man sits on the roadside unable to stand because of hip pain. RR 18, radial pulse present, capillary refill 2 seconds, answers questions and follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 18, radialPulse: true, capRefillSec: 2, followsCommands: true,
    teachingNote: "",
  },
  {
    id: 6,
    narrative: "A 28-year-old man has burns to both legs and cannot walk. RR 26, radial pulse present, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 26, radialPulse: true, capRefillSec: 2, followsCommands: true,
    teachingNote: "",
  },
  {
    id: 7,
    narrative: "A 38-year-old woman lies on her back, says she cannot move her legs and has back pain. RR 20, radial pulse present, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 20, radialPulse: true, capRefillSec: 1, followsCommands: true,
    teachingNote: "Suspected spinal injury does not by itself make a patient red in START.",
  },
  {
    id: 8,
    narrative: "A 52-year-old man has a bleeding scalp wound, feels dizzy and cannot stand. RR 28, radial pulse present, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 28, radialPulse: true, capRefillSec: 2, followsCommands: true,
    teachingNote: "The respiratory threshold is above 30. A rate of 28 does not meet it.",
  },
  {
    id: 9,
    narrative: "A 40-year-old man lies unresponsive and is not breathing. After a head-tilt chin-lift he starts breathing.",
    walks: false, breathing: false, breathesAfterAirway: true, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "Breathing only after airway repositioning means immediate category.",
  },
  {
    id: 10,
    narrative: "A 30-year-old woman has an obvious chest wall injury and is breathing fast. RR 36, radial pulse present, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 36, radialPulse: true, capRefillSec: 2, followsCommands: true,
    teachingNote: "",
  },
  {
    id: 11,
    narrative: "A 55-year-old man is trapped by the legs with a suspected pelvic injury. RR 24, radial pulse weak but present, capillary refill 4 seconds, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 24, radialPulse: true, capRefillSec: 4, followsCommands: true,
    teachingNote: "A present radial pulse does not clear the perfusion step if capillary refill is above 2 seconds.",
  },
  {
    id: 12,
    narrative: "A 25-year-old man is pale and sweaty, holding his abdomen. RR 24, radial pulse absent, follows commands.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 24, radialPulse: false, capRefillSec: null, followsCommands: true,
    teachingNote: "Absent radial pulse suggests shock; this patient may have internal bleeding.",
  },
  {
    id: 13,
    narrative: "A 48-year-old woman has a head injury and is confused. RR 20, radial pulse present, capillary refill 1 second, but she cannot squeeze your hand on command.",
    walks: false, breathing: true, breathesAfterAirway: null, rr: 20, radialPulse: true, capRefillSec: 1, followsCommands: false,
    teachingNote: "",
  },
  {
    id: 14,
    narrative: "A 65-year-old man lies motionless and is not breathing. After airway repositioning he still does not breathe.",
    walks: false, breathing: false, breathesAfterAirway: false, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "In START, no CPR is performed during initial triage of a mass-casualty incident.",
  },
  {
    id: 15,
    narrative: "A 35-year-old woman has a severe head injury and is not breathing. After airway repositioning there is still no breathing.",
    walks: false, breathing: false, breathesAfterAirway: false, rr: null, radialPulse: null, capRefillSec: null, followsCommands: null,
    teachingNote: "",
  },
];
