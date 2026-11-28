"use strict";
/* The film as data. One entry per shot, one item per press. A press is { p, breath, run: (c) => {...} }.
   Only the press API is allowed inside run: c.scene c.show c.hide c.move c.set c.say c.panel c.clear c.mood c.sfx c.silence
   Words are exact copies of build/press-sheet.md. */
const STORY = [
  { shot: 1, level: 2, grade: "dawn", presses: [
    { p: 0, breath: false, run: (c) => { c.scene("dawn"); c.mood("raga"); c.show("sun", "sun", { x: 800, y: 600, behind: true }); c.move("sun", { y: 150 }, 2400); c.tally(); c.narr("Tonight’s movie stars Neel, who never says no."); } },
    { p: 1, breath: false, run: (c) => { c.show("birds", "birds", { x: -500, y: 0 }); c.move("birds", { x: 0 }, 2200); c.sfx("conch", "birds"); c.narr("It is his birthday. The steps are empty."); } },
    { p: 2, breath: true, run: (c) => { c.show("title", "titleCard", { x: 800, y: 805, fade: true }); } },
  ]},
  { shot: 2, level: 2, grade: "", presses: [
    { p: 3, breath: false, run: (c) => { c.scene("hall"); c.mood("bombay"); c.show("gate", "hallGate", { x: 330, y: 740, s: 0.5, state: "open" }); c.show("neel", "throneNeel", {}); c.show("vis", "visitors", { x: 120, y: 830, s: 1, n: 1 }); c.move("vis", { x: 250 }, 1400); c.sfx("chime"); c.act("I", "Everyone In", "Neel never says no."); c.narr("Not long ago, Neel was the kindest king in the land. He let everyone in."); c.tally("Guests let in", "1"); } },
    { p: 4, breath: false, run: (c) => { c.set("neel", { nod: 1 }); c.set("vis", { n: 2 }); c.sfx("nod-thump"); c.show("taker", "smoothVisitor", { x: 1180, y: 830, s: 0.62, state: "stand" }); c.sfx("jazz-sting"); c.say("Smooth Visitor", "A small favour, Jahan Pana?"); c.tally("Guests let in", "2"); } },
    { p: 5, breath: false, run: (c) => { c.set("neel", { nod: 2 }); c.set("vis", { n: 3 }); c.sfx("nod-thump"); c.say("Smooth Visitor", "Just five minutes?"); c.tally("Guests let in", "3"); } },
    { p: 6, breath: false, run: (c) => { c.set("neel", { nod: 3 }); c.set("vis", { n: 4 }); c.sfx("nod-thump"); c.say("Smooth Visitor", "A loan, perhaps?"); c.tally("Guests let in", "4"); } },
    { p: 7, breath: false, run: (c) => { c.set("neel", { nod: 4 }); c.sfx("nod-thump"); c.say("Smooth Visitor", "Your watch, if it is no trouble?"); c.tally("Guests let in", "5"); } },
    { p: 8, breath: true, run: (c) => { c.set("neel", { nod: 0, brow: true }); c.sfx("watch-tick"); } },
  ]},
];
