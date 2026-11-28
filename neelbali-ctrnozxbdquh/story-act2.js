"use strict";
STORY.push(
  { shot: 3, level: 3, grade: "storm", presses: [
    { p: 9, breath: false, run: (c) => { c.scene("hall"); c.mood("mountain-king"); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "throneNeel", {}); c.show("wind", "whirlwind", { x: -250, y: 820, s: 1, state: "walk" }); c.move("wind", { x: 330 }, 2000); c.sfx("thunder"); c.narr("Then came a storm, and Neel let it in too."); c.tally("Guests let in", "6"); } },
    { p: 10, breath: false, run: (c) => { c.set("wind", { state: "talk" }); c.set("neel", { moustache: "droop1" }); c.show("rain", "rain", { x: 800, y: 450, s: 1, density: 1 }); c.show("puddle", "puddle", { x: 800, y: 830, s: 1, size: 1 }); c.sfx("thunder", "rain"); c.say("Neel", "Of course."); } },
    { p: 11, breath: false, run: (c) => { c.set("neel", { moustache: "droop2", water: 1 }); c.set("rain", { density: 2 }); c.set("puddle", { size: 2 }); c.sfx("rain"); c.say("Neel", "Of course."); } },
    { p: 12, breath: false, run: (c) => { c.set("neel", { moustache: "flat", water: 2 }); c.set("rain", { density: 3 }); c.set("puddle", { size: 3 }); c.sfx("rain"); c.say("Neel", "Of… course."); } },
    { p: 13, breath: true, run: (c) => { c.scene("hall"); c.show("eye", "eyeCloseUp", { x: 800, y: 450, state: "halfLid", drip: true }); c.sfx("rain"); } },
  ]},
  { shot: 4, level: 3, grade: "heavy", presses: [
    { p: 14, breath: false, run: (c) => { c.scene("hall"); c.mood("bombay"); c.show("crowd", "silhouetteCrowd", { x: 800, y: 850, s: 1.15 }); c.show("neel", "throneNeel", { moustache: "droop2", nod: 2 }); c.sfx("chime", "crowd-cheer-small"); c.tally("Guests let in", "412"); c.narr("By sunset, 412 guests. Neel said “Of course” 412 times."); } },
    { p: 15, breath: false, run: (c) => { c.hide("crowd"); c.show("ledger", "ledgerScroll", { x: 800, y: 845, s: 1.0, length: 3, state: "smudged" }); c.set("neel", { moustache: "flat", nod: 4, glint: 1 }); c.sfx("watch-tick"); c.narr("He could not remember one of their names."); } },
  ]},
  { shot: 5, level: 1, grade: "", presses: [
    { p: 16, breath: false, run: (c) => { c.scene("hall"); c.silence(); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "walkingNeel", { x: 800, y: 830, state: "stand", moustache: "flat", flip: true }); c.sfx("nod-thump"); c.act("II", "The First No", "It costs more than it should."); c.say("Neel", "No."); } },
    { p: 17, breath: false, run: (c) => { c.set("neel", { state: "walk1" }); c.show("wind", "whirlwind", { x: 1000, y: 820, s: 1, state: "walk", flip: true }); c.move("neel", { x: 400 }, 2400); c.move("wind", { x: 560 }, 2400); c.sfx("footsteps"); c.narr("He had never said it before."); } },
    { p: 18, breath: false, run: (c) => { c.scene("closeup", { fill: MADDER }); c.show("latch", "latchCloseUp", { x: 800, y: 450, s: 1.6, state: "shut" }); c.sfx("latch"); c.narr("One small click."); } },
    { p: 19, breath: true, run: (c) => { c.hide("latch"); c.scene("hall"); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "shut" }); c.hide("wind"); c.set("gate", { state: "shut" }); c.show("neel", "walkingNeel", { x: 560, y: 830, state: "wave" }); c.show("streaks", "sunStreaks", {});  c.tally("Guests let in", "0"); } },
  ]},
  { shot: 6, level: 1, grade: "lonely", presses: [
    { p: 20, breath: false, run: (c) => { c.scene("emptyHall"); c.mood("ossuary"); c.show("neel", "throneNeel", { moustache: "flat" }); c.sfx("watch-tick"); c.narr("Afterwards, the court was very quiet."); } },
    { p: 21, breath: false, run: (c) => { c.set("neel", { glint: 1 }); c.sfx("watch-tick"); c.say("Neel", "Hello?"); } },
    { p: 22, breath: false, run: (c) => { c.scene("closeup", { fill: VIOLET }); c.show("watch", "watchCloseUp", { x: 800, y: 430, s: 1.5, state: "tick" }); c.sfx("watch-tick"); c.narr("The watch was the only thing still talking."); } },
    { p: 23, breath: false, run: (c) => { c.hide("watch"); c.scene("emptyHall"); c.show("neel", "throneNeel", { moustache: "flat" }); c.set("neel", { glint: 0 }); c.show("sil", "passingSilhouette", { x: 1550, y: 830, state: "walk" }); c.move("sil", { x: 1250 }, 1600); c.sfx("footsteps"); c.narr("Someone walked past. Nobody came in."); } },
    { p: 24, breath: false, run: (c) => { c.set("sil", { state: "peer" }); c.sfx("watch-tick"); c.panel("A quiet court is also a lonely one."); } },
    { p: 25, breath: false, run: (c) => { c.sfx("watch-tick"); c.narr("He had let in everybody. Not one of them was a friend."); c.tally("Friends", "0"); } },
    { p: 26, breath: true, run: (c) => { c.silence(); c.sfx("watch-tick"); } },
  ]}
);
