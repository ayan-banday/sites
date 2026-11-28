"use strict";
STORY.push(
  { shot: 3, presses: [
    { p: 9, breath: false, run: (c) => { c.scene("hall"); c.mood("mountain-king"); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "throneNeel", {}); c.show("wind", "whirlwind", { x: -250, y: 820, s: 1, state: "walk" }); c.move("wind", { x: 330 }, 2000); c.sfx("thunder"); } },
    { p: 10, breath: false, run: (c) => { c.set("wind", { state: "talk" }); c.set("neel", { moustache: "droop1" }); c.show("rain", "rain", { x: 800, y: 450, s: 1, density: 1 }); c.show("puddle", "puddle", { x: 800, y: 830, s: 1, size: 1 }); c.sfx("thunder", "rain"); } },
    { p: 11, breath: false, run: (c) => { c.set("neel", { moustache: "droop2", water: 1 }); c.set("rain", { density: 2 }); c.set("puddle", { size: 2 }); c.sfx("rain"); } },
    { p: 12, breath: false, run: (c) => { c.set("neel", { moustache: "flat", water: 2 }); c.set("rain", { density: 3 }); c.set("puddle", { size: 3 }); c.sfx("rain"); } },
    { p: 13, breath: true,  run: (c) => { c.scene("hall"); c.show("eye", "eyeCloseUp", { x: 800, y: 450, state: "halfLid", drip: true }); c.sfx("rain"); } },
  ]},
  { shot: 4, presses: [
    { p: 14, breath: false, run: (c) => { c.scene("hall"); c.silence(); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "walkingNeel", { x: 800, y: 830, state: "stand", moustache: "flat", flip: true }); c.sfx("nod-thump"); } },
    { p: 15, breath: false, run: (c) => { c.set("neel", { state: "walk1" }); c.show("wind", "whirlwind", { x: 1000, y: 820, s: 1, state: "walk", flip: true }); c.move("neel", { x: 400 }, 2400); c.move("wind", { x: 560 }, 2400); c.sfx("footsteps"); } },
    { p: 16, breath: true,  run: (c) => { c.hide("wind"); c.set("gate", { state: "shut" }); c.show("neel", "walkingNeel", { x: 560, y: 830, state: "wave" }); c.show("streaks", "sunStreaks", {}); c.sfx("latch"); } },
  ]},
  { shot: 5, presses: [
    { p: 17, breath: false, run: (c) => { c.scene("emptyHall"); c.mood("ossuary"); c.show("neel", "throneNeel", { moustache: "flat" }); c.sfx("watch-tick"); } },
    { p: 18, breath: false, run: (c) => { c.set("neel", { glint: 1 }); c.sfx("watch-tick"); } },
    { p: 19, breath: false, run: (c) => { c.set("neel", { glint: 0 }); c.show("sil", "passingSilhouette", { x: 1550, y: 830, state: "walk" }); c.move("sil", { x: 1250 }, 1600); c.sfx("footsteps"); } },
    { p: 20, breath: false, run: (c) => { c.panel("A quiet court is also a lonely one."); c.set("sil", { state: "peer" }); c.sfx("watch-tick"); } },
    { p: 21, breath: true,  run: (c) => { c.silence(); c.sfx("watch-tick"); } },
  ]}
);
