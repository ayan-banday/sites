"use strict";
/* After P70: the credits screen (P71). Music credit lines from audio/music/credits-new.md and Khushi's music-additions.md. */
STORY.push({ shot: 13, presses: [
  { p: 71, breath: false, run: (c) => {
    c.scene("credits");
    c.show("credits", "creditsText", { x: 800, y: 385, size: 0.64, lines: [
      "#The idea",
      "The friends you let in are the ones who play your song.",
      "",
      "#Music",
      "Kevin MacLeod (incompetech.com), CC BY 4.0, creativecommons.org/licenses/by/4.0",
      "\"Carefree\", \"Dreamy Flashback\", \"Heart of Nowhere\", \"Sneaky Snitch\", \"Merry Go\", \"Healing\", \"Ossuary 6 - Air\"",
      "Raga Kaushi Kanra by Ranjit Makkuni (CC BY-SA 3.0)",
      "Bombay Summer by Shane Ivers, https://www.silvermansound.com (CC BY 4.0)",
      "Mountain King (Musopen) and Bach's Toccata (Wikimedia Commons) are public domain",
      "",
      "#Sound",
      "Sound effects made with earshot",
      "",
      "Happy birthday, Neel."
    ] });
  } },
] });
