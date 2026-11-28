"use strict";
STORY.push(
  { shot: 6, presses: [
    { p: 22, breath: false, run: (c) => { c.scene("emptyHall"); c.mood("carefree"); c.show("neel", "throneNeel", { moustache: "flat" }); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "shut" }); c.move("gate", { x: 336 }, 90); c.sfx("knock"); c.act("III", "The Right Knock", "Ash asks something stupid."); c.say("Ash", "Knock, knock."); } },
    { p: 23, breath: false, run: (c) => { c.show("scroll", "scroll", { x: -150, y: 480, length: 2 }); c.move("scroll", { x: 330 }, 1800); c.sfx("scroll-slide"); c.say("Ash", "I come bearing arguments."); } },
    { p: 24, breath: true,  run: (c) => { c.show("ash", "ashStand", { x: 190, y: 815, s: 1.0 }); c.set("neel", { moustache: "flat", nod: 1, brow: true }); c.sfx("slide-whistle"); } },
  ]},
  { shot: 7, presses: [
    { p: 25, breath: false, run: (c) => { c.scene("starrySky"); c.mood("dreamy"); c.show("ash", "ashStand", { x: 250, y: 700, s: 1.0 }); c.show("eye", "eyeCloseUp", { x: 800, y: 400, s: 0.5, state: "halfLid" }); c.show("grille", "grilleWindow", { x: 800, y: 400, s: 1.7, state: "open" }); c.sfx("latch"); c.say("Neel", "State your business."); } },
    { p: 26, breath: false, run: (c) => { c.show("scroll", "scroll", { x: 570, y: 330, length: 1 }); c.sfx("scroll-slide"); c.say("Ash", "Why does a gate exist, Jahan Pana?"); } },
    { p: 27, breath: false, run: (c) => { c.set("scroll", { length: 2 }); c.sfx("wind-chimes"); c.say("Neel", "To keep things out."); } },
    { p: 28, breath: false, run: (c) => { c.say("Ash", "I just want to go deeper with you, Jahan Pana."); c.set("scroll", { length: 3 }); c.move("ash", { x: 270 }, 900); } },
    { p: 29, breath: false, run: (c) => { c.silence(); c.say("Neel", "That's one way to put it."); } },
    { p: 30, breath: true,  run: (c) => { } },
    { p: 31, breath: false, run: (c) => { c.set("scroll", { length: 3, blank: true }); c.set("eye", { state: "open" }); c.say("Ash", "Yes. Deeper."); c.sfx("record-scratch"); } },
  ]},
  { shot: 8, presses: [
    { p: 32, breath: false, run: (c) => { c.scene("starrySky"); c.mood("carefree"); c.show("grille", "grilleWindow", { x: 800, y: 400, s: 1.2, state: "shut" }); c.show("ash", "worm", { x: 325, y: 640, phase: 1 }); c.sfx("slide-whistle"); c.say("Ash", "Very well. I shall make myself small."); } },
    { p: 33, breath: false, run: (c) => { c.set("ash", { phase: 2 }); c.say("Ash", "Would you still love me if I were a worm?"); } },
    { p: 34, breath: false, run: (c) => { c.set("ash", { phase: 3 }); c.sfx("slide-whistle"); } },
    { p: 35, breath: false, run: (c) => { c.mood("heart"); c.hide("grille"); c.show("neel", "walkingNeel", { x: 560, y: 700, state: "walk1", moustache: "curl", smile: true }); c.show("inset", "faceInset", { x: 1360, y: 190, s: 0.85, moustache: "curl", smile: true }); c.move("neel", { x: 700 }, 1500); c.say("Neel", "Ha."); } },
    { p: 36, breath: true,  run: (c) => { c.set("neel", { state: "reach", moustache: "curl", smile: true }); c.sfx("footsteps"); } },
    { p: 37, breath: false, run: (c) => { c.scene("dawn", { open: true }); c.show("ash", "ashStand", { x: 300, y: 790, s: 1.0 }); c.show("neel", "walkingNeel", { x: 800, y: 700, state: "stand", moustache: "curl", smile: true }); c.sfx("latch"); c.sfx("warm-chord"); c.say("Neel", "Come in."); } },
  ]},
  { shot: 9, presses: [
    { p: 38, breath: false, run: (c) => { c.mood("sneaky"); c.show("smooth", "smoothVisitor", { x: 1700, y: 820, state: "glide" }); c.move("smooth", { x: 1150 }, 2400); c.sfx("jazz-sting"); c.say("Smooth Visitor", "Jahan Pana! Let’s connect."); } },
    { p: 39, breath: false, run: (c) => { c.show("neel", "walkingNeel", { x: 800, y: 700, state: "stand", moustache: "drip" }); c.show("inset", "eyeCloseUp", { x: 1290, y: 200, s: 0.8, state: "halfLid", drip: true }); c.say("Smooth Visitor", "Let’s circle back."); } },
    { p: 40, breath: false, run: (c) => { c.scene("dawn"); c.show("smooth", "smoothVisitor", { x: 1470, y: 820, s: 0.55, state: "stand" }); c.show("neel", "walkingNeel", { x: 520, y: 820, state: "wave", moustache: "drip" }); c.show("cushion", "cushion", { x: 250, y: 830, s: 0.9 }); c.show("ash", "seatedAsh", { x: 250, y: 800, s: 0.75 }); c.sfx("soft-slam"); c.say("Neel", "No. Ash, sit."); } },
    { p: 41, breath: true,  run: (c) => { c.silence(); } },
  ]},
);
