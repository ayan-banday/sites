"use strict";
/* The film as data. One entry per shot, one item per press. A press is { p, breath, run: (c) => {...} }.
   Only the press API is allowed inside run: c.scene c.show c.hide c.move c.set c.say c.panel c.clear c.mood c.sfx c.silence
   Words are exact copies of build/press-sheet.md. */
const STORY = [
  { shot: 1, presses: [
    { p: 0, breath: false, run: (c) => { c.scene("dawn"); c.mood("raga"); c.show("sun", "sun", { x: 800, y: 600, behind: true }); c.move("sun", { y: 150 }, 2400); } },
    { p: 1, breath: false, run: (c) => { c.show("birds", "birds", { x: -500, y: 0 }); c.move("birds", { x: 0 }, 2200); c.sfx("conch", "birds"); } },
    { p: 2, breath: true,  run: (c) => { c.show("title", "titleCard", { x: 800, y: 805, fade: true }); } },
  ]},
  { shot: 2, presses: [
    { p: 3, breath: false, run: (c) => { c.scene("hall"); c.mood("bombay"); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "throneNeel", {}); c.show("vis", "visitors", { x: 120, y: 830, s: 1, n: 1 }); c.move("vis", { x: 250 }, 1400); c.sfx("chime"); } },
    { p: 4, breath: false, run: (c) => { c.set("neel", { nod: 1 }); c.set("vis", { n: 2 }); c.sfx("nod-thump"); } },
    { p: 5, breath: false, run: (c) => { c.set("neel", { nod: 2 }); c.set("vis", { n: 3 }); c.sfx("nod-thump"); } },
    { p: 6, breath: false, run: (c) => { c.set("neel", { nod: 3 }); c.set("vis", { n: 4 }); c.sfx("nod-thump"); } },
    { p: 7, breath: false, run: (c) => { c.set("neel", { nod: 4 }); c.sfx("nod-thump"); } },
    { p: 8, breath: true,  run: (c) => { c.set("neel", { nod: 0, brow: true }); c.sfx("watch-tick"); } },
  ]},
];
