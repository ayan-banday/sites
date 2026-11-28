"use strict";
STORY.push(
  { shot: 7, level: 2, grade: "lonely", presses: [
    { p: 27, breath: false, run: (c) => { c.scene("emptyHall"); c.mood("carefree"); c.show("neel", "throneNeel", { moustache: "flat" }); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "shut" }); c.move("gate", { x: 336 }, 90); c.sfx("knock"); c.act("III", "The Right Knock", "Ash asks something stupid."); c.say("Ash", "Knock, knock."); } },
    { p: 28, breath: false, run: (c) => { c.show("scroll", "scroll", { x: -150, y: 480, length: 2 }); c.move("scroll", { x: 330 }, 1800); c.sfx("scroll-slide"); c.say("Ash", "I come bearing arguments."); } },
    { p: 29, breath: true, run: (c) => { c.show("ash", "ashStand", { x: 190, y: 815, s: 1.0 }); c.set("neel", { moustache: "flat", nod: 1, brow: true }); c.sfx("slide-whistle"); } },
  ]},
  { shot: 8, level: 2, grade: "", presses: [
    { p: 30, breath: false, run: (c) => { c.scene("starrySky"); c.mood("dreamy"); c.show("ash", "ashStand", { x: 250, y: 700, s: 1.0 }); c.show("eye", "eyeCloseUp", { x: 800, y: 400, s: 0.5, state: "halfLid" }); c.show("grille", "grilleWindow", { x: 800, y: 400, s: 1.7, state: "open" }); c.sfx("latch"); c.say("Neel", "State your business."); } },
    { p: 31, breath: false, run: (c) => { c.show("scroll", "scroll", { x: 570, y: 330, length: 1 }); c.sfx("scroll-slide"); c.say("Ash", "Why does a gate exist, Jahan Pana?"); } },
    { p: 32, breath: false, run: (c) => { c.set("scroll", { length: 2 }); c.sfx("wind-chimes"); c.say("Neel", "To keep things out. Obviously."); } },
    { p: 33, breath: false, run: (c) => { c.set("scroll", { length: 2 }); c.move("ash", { x: 215 }, 700); c.sfx("scroll-slide"); c.card("Day 2", "Is time real?", "", 1, "day"); c.narr("Ash came back the next day. And the next."); } },
    { p: 34, breath: false, run: (c) => { c.set("scroll", { length: 1 }); c.set("eye", { state: "halfLid" }); c.sfx("wind-chimes"); c.card("Day 5", "Is a hot dog a sandwich?", "", 1, "day"); c.narr("The questions got smaller. So did the scroll."); } },
    { p: 35, breath: false, run: (c) => { c.set("scroll", { length: 2 }); c.set("eye", { state: "open" }); c.move("ash", { x: 255 }, 500); c.card("Day 9", "Could you beat a hundred geese?", "", 1, "day"); c.say("Neel", "Yes. Easily."); } },
    { p: 36, breath: false, run: (c) => { c.set("scroll", { length: 0 }); c.set("eye", { state: "halfLid" }); c.sfx("slide-whistle"); c.card("Day 12", "Is a worm just a noodle with ambition?", "", 1, "day"); c.narr("Philosophy ran out. Ash’s questions did not."); } },
    { p: 37, breath: false, run: (c) => { c.set("scroll", { length: 3 }); c.move("ash", { x: 270 }, 900); c.say("Ash", "I just want to go deeper with you, Jahan Pana."); } },
    { p: 38, breath: false, run: (c) => { c.silence(); c.say("Neel", "That's one way to put it."); } },
    { p: 39, breath: true, run: (c) => {} },
    { p: 40, breath: false, run: (c) => { c.set("scroll", { length: 3, blank: true }); c.set("eye", { state: "open" }); c.sfx("record-scratch"); c.say("Ash", "Yes. Deeper."); } },
  ]},
  { shot: 9, level: 3, grade: "warm", presses: [
    { p: 41, breath: false, run: (c) => { c.scene("starrySky"); c.mood("carefree"); c.show("grille", "grilleWindow", { x: 800, y: 400, s: 1.2, state: "shut" }); c.show("ash", "worm", { x: 325, y: 640, phase: 1 }); c.sfx("slide-whistle"); c.say("Ash", "Then I shall make myself small, Jahan Pana."); } },
    { p: 42, breath: false, run: (c) => { c.set("ash", { phase: 2 }); c.say("Ash", "Would you still love me if I were a worm?"); } },
    { p: 43, breath: false, run: (c) => { c.set("ash", { phase: 3 }); c.sfx("slide-whistle"); c.narr("The worm danced. It was a very sincere dance."); } },
    { p: 44, breath: false, run: (c) => { c.mood("heart"); c.hide("grille"); c.show("neel", "walkingNeel", { x: 560, y: 700, state: "walk1", moustache: "curl", smile: true }); c.show("inset", "faceInset", { x: 1330, y: 270, s: 0.85, moustache: "curl", smile: true }); c.move("neel", { x: 700 }, 1500); c.say("Neel", "Ha."); } },
    { p: 45, breath: true, run: (c) => { c.set("neel", { state: "reach", moustache: "curl", smile: true }); c.sfx("footsteps"); } },
    { p: 46, breath: false, run: (c) => { c.scene("dawn", { open: true }); c.show("ash", "ashStand", { x: 300, y: 790, s: 1.0 }); c.show("neel", "walkingNeel", { x: 800, y: 700, state: "stand", moustache: "curl", smile: true }); c.sfx("latch"); c.sfx("warm-chord"); c.say("Neel", "Come in."); c.tally("Friends", "1"); } },
  ]},
  { shot: 10, level: 2, grade: "", presses: [
    { p: 47, breath: false, run: (c) => { c.mood("sneaky"); c.show("smooth", "takerPoses", { x: 1750, y: 830, s: 0.78, state: "ask" }); c.move("smooth", { x: 1350 }, 2400); c.sfx("jazz-sting"); c.say("Smooth Visitor", "Jahan Pana! Me again. A tiny favour?"); } },
    { p: 48, breath: false, run: (c) => { c.show("neel", "walkingNeel", { x: 800, y: 700, state: "stand", moustache: "drip" }); c.show("inset", "eyeCloseUp", { x: 1290, y: 280, s: 0.8, state: "halfLid", drip: true }); c.set("smooth", { state: "ask" }); c.say("Neel", "Of c—"); } },
    { p: 49, breath: false, run: (c) => { c.scene("dawn"); c.show("smooth", "takerPoses", { x: 1470, y: 820, s: 0.5, state: "refused" }); c.show("neel", "walkingNeel", { x: 440, y: 820, state: "pat", moustache: "drip", flip: true }); c.show("cushion", "cushion", { x: 250, y: 830, s: 0.9 }); c.show("ash", "seatedAsh", { x: 250, y: 800, s: 0.75 }); c.sfx("soft-slam"); c.say("Neel", "No. Ash, sit."); } },
    { p: 50, breath: true, run: (c) => { c.silence(); } },
    { p: 51, breath: false, run: (c) => { c.set("ash", { state: "happy" }); c.sfx("warm-chord"); c.narr("Everyone else came to take. Ash came to be stupid with him."); } },
  ]}
);
