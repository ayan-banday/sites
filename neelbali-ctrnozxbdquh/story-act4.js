"use strict";
/* Act 4, shots 10-12 (presses 42-70). Words are exact copies of build/press-sheet.md. */
STORY.push(
  { shot: 10, presses: [
    { p: 42, breath: false, run: (c) => { c.scene("arena", { back: false }); c.mood("bach"); c.sfx("conch"); c.show("ash", "ashBow", { x: 140, y: 820, s: 1.05 }); c.show("gift", "gift", { x: 1800, y: 800, s: 0.9, state: "covered" }); c.move("ash", { x: 430 }, 1600); c.move("gift", { x: 1050 }, 1600); } },
    { p: 43, breath: false, run: (c) => { c.say("Ash", "Jahan Pana, you are great. My gift is huge."); } },
    { p: 44, breath: false, run: (c) => { c.set("gift", "open"); c.sfx("fanfare"); } },
    { p: 45, breath: false, run: (c) => { c.show("strap", "strap", { x: 1050, y: 520, s: 1.1, state: "on" }); c.move("strap", { y: 600 }, 300); c.sfx("strap-squeak"); } },
    { p: 46, breath: false, run: (c) => { c.scene("arena", { back: true }); c.hide("ash"); c.hide("gift"); c.hide("strap"); c.show("raas", "raasCircle", { view: "rows" }); c.show("ash", "ashBow", { x: 430, y: 820, s: 1.05 }); c.sfx("footsteps", "crowd-cheer-small"); } },
    { p: 47, breath: false, run: (c) => { c.show("raas", "raasCircle", { view: "rows", mortified: true, front: true }); c.show("ash", "ashBow", { x: 430, y: 820, s: 1.05 }); c.show("tape", "tailorTape", { x: 790, y: 780, dx: 420, dy: 0 }); c.sfx("tape-snap"); } },
    { p: 48, breath: false, run: (c) => { c.silence(); c.hide("tape"); c.show("sticks", "raisedSticks", {}); c.show("neel", "neelFace", { x: 1230, y: 400, s: 1.8, deadpan: true }); c.say("Neel", "That's one way to put it."); } },
    { p: 49, breath: true, run: (c) => {} },
  ]},
  { shot: 11, presses: [
    { p: 50, breath: false, run: (c) => { c.scene("arena"); c.mood("mountain-king"); c.show("raas", "raasCircle", { view: "ring" }); c.sfx("drum-strike"); } },
    { p: 51, breath: false, run: (c) => { c.hide("raas"); c.show("drums", "drumLine", { view: "close", hit: 0 }); c.sfx("drum-strike"); } },
    { p: 52, breath: false, run: (c) => { c.set("drums", { hit: 1, off: true }); c.sfx("stick-hit"); } },
    { p: 53, breath: false, run: (c) => { c.set("drums", { view: "low", off: false, hit: 2 }); c.sfx("drum-strike"); } },
    { p: 54, breath: false, run: (c) => { c.set("drums", { hit: [0, 3] }); c.sfx("drum-strike", "thunder"); } },
    { p: 55, breath: false, run: (c) => { c.mood("tabla"); c.set("drums", { view: "line", hit: [], slip: 2 }); c.sfx("strap-squeak"); } },
    { p: 56, breath: false, run: (c) => { c.set("drums", { slip: -1, selfHit: 1 }); c.sfx("stick-hit"); } },
    { p: 57, breath: false, run: (c) => { c.set("drums", { selfHit: -1, slow: 3 }); c.show("petals", "rosePetals", { x: 800, y: 450, density: 2 }); c.sfx("stick-hit"); } },
    { p: 58, breath: false, run: (c) => { c.hide("petals"); c.set("drums", { slow: -1, brows: true }); } },
    { p: 59, breath: false, run: (c) => { c.set("drums", { fest: true, hit: [1, 3] }); c.sfx("crowd-cheer-small", "drum-strike"); } },
    { p: 60, breath: false, run: (c) => { c.mood("happy-birthday"); c.set("drums", { hit: 0 }); c.sfx("drum-strike"); } },
    { p: 61, breath: false, run: (c) => { c.set("drums", { hit: 2 }); c.sfx("drum-strike"); } },
    { p: 62, breath: false, run: (c) => { c.set("drums", { hit: 3 }); c.sfx("drum-strike"); } },
    { p: 63, breath: true, run: (c) => { c.silence(); c.set("drums", { hit: [], raised: true }); } },
    { p: 64, breath: false, run: (c) => { c.mood("fanfare"); c.show("fw", "fireworks", { size: 2 }); c.show("gong", "gong", { x: 1180, y: 430, s: 1, ring: true }); c.show("neel", "walkingNeel", { x: 260, y: 830, s: 1.15, state: "strike" }); c.move("neel", { x: 760 }, 900); c.set("drums", { view: "line", hit: [], raised: true }); c.sfx("gong", "fireworks", "crowd-roar"); } },
  ]},
  { shot: 12, presses: [
    { p: 65, breath: false, run: (c) => { c.scene("dawn", { open: true, crowd: true }); c.mood("merry"); c.show("sun", "sun", { x: 800, y: 120, s: 1.3 }); c.show("crowd", "silhouetteCrowd", { x: 800, y: 840, s: 1.2, cheer: true }); c.show("neel", "walkingNeel", { x: 1170, y: 830, s: 1, moustache: "proud" }); c.show("ash", "ashBow", { x: 580, y: 700, s: 1.05, r: 0 }); c.say("Ash", "Happy birthday, Neel."); c.sfx("crowd-cheer-small"); } },
    { p: 66, breath: false, run: (c) => { c.show("ash", "ashBow", { x: 580, y: 700, s: 1.05, r: -5 }); c.say("Ash", "Welcome in."); } },
    { p: 67, breath: false, run: (c) => { c.silence(); c.show("neel", "walkingNeel", { x: 1170, y: 830, s: 1, moustache: "proud", state: "stand" }); c.say("Neel", "That's one way to put it."); } },
    { p: 68, breath: true, run: (c) => { c.show("ash", "ashBow", { x: 580, y: 700, s: 1.05, r: -20 }); } },
    { p: 69, breath: false, run: (c) => { c.show("neel", "walkingNeel", { x: 1170, y: 830, s: 1, moustache: "proud", state: "stick" }); c.show("gong", "gong", { x: 1470, y: 330, s: .55, ring: true }); c.sfx("stick-hit", "gong"); } },
    { p: 70, breath: false, run: (c) => { c.mood("healing"); c.show("ash", "ashBow", { x: 580, y: 700, s: 1.05, r: 0 }); c.say("Ash", "Yes. <b>In.</b>"); } },
  ]},
);
