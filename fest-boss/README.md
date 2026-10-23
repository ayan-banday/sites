# Fest Boss: Lead the Situation

A pixel runner game that teaches **Situational Leadership**. Players scan a QR code and play alone on their phones, held sideways.
They run into a collapsing college fest, get handed the job of Fest Boss, and lead three teammates through the week.
At each slow-motion junction they read the teammate's **Skill** and **Will** and pick a road: **Direct, Coach, Support or Delegate**.
The right road gives a teammate shield. Too hands-on makes the next run heavy and faster (Resentful). Too hands-off covers it in fog (Lost).
Fest night and a report card show what they learned.

- **Quick fest** (default link): about 5 to 6 minutes, all four styles once.
- **Full fest** (add `?mode=long` to the link): about 9 to 10 minutes, with a power-cut storm run and two "same person, new task" twists.

## Put it online for free

**Netlify Drop (easiest, about 1 minute)**
1. Go to https://app.netlify.com/drop.
2. Drag the whole `fest-boss` folder onto the page. It must include `index.html` and the `audio` folder (the voices).
3. You get a link like `https://something.netlify.app`. Sign up (free) to keep it and rename it.

Make two QR codes if you want both lengths: the plain link (quick fest) and the link ending in `?mode=long` (full fest).

## Voices

Every line is a real recording made with Google Gemini text-to-speech and stored in `audio/voice/` (about 1 MB).
`src/voices.js` lists which lines have a recording. A line without one shows subtitles with a short chirp.
After you edit dialogue in `src/content.js`, record the new lines (needs Node.js, ffmpeg and a Gemini API key):

```bash
GEMINI_API_KEY=your-key node dev/voices.mjs
```

The key is only used on your computer and never goes into the game. The free tier allows about 10 requests per model per day,
so the script records each character's lines in a few long takes and cuts them apart.

## How the theory maps to the game

| Skill | Will | Road needed | Loops |
|---|---|---|---|
| Low  | High | Direct   | Riya, budget · Zib, food stall (full fest: same person, new task) |
| Low  | Low  | Coach    | Riya, budget again after a flop |
| High | Low  | Support  | Gorp, stage |
| High | High | Delegate | Zib, posters · Gorp, final sound check (full fest) |

Each loop scores 10: the road you pick (6 if right, 3 if one step off) and the run (4). If you use one road for everyone, the grade is capped at C.

## Files

```
index.html               the built game in one file (upload this with the audio folder)
index.src.html, styles.css   source page and UI look
src/content.js           all dialogue (Hinglish subtitles + Devanagari for the voices)
src/stage.js             runner, junction, hall, finale (KAPLAY)
src/ui.js                every overlay: title, barks, junction, lessons, report
src/scoring.js           points, grade, leadership habit
src/art.js               all pixel art, drawn in code
src/audio.js             recorded voices, synthesized music and sound effects
src/voices.js            generated list of recorded lines
audio/voice/             the voice recordings
lib/kaplay.mjs           KAPLAY game library (MIT)
dev/                     preview pages, the bundler and the voice recorder
```

After editing anything in `src/`, `styles.css` or `index.src.html`, rebuild `index.html` (needs Node.js):

```bash
npm i esbuild
node dev/build.mjs
```

To test without rebuilding, serve the folder (`python -m http.server 8000`) and open http://localhost:8000/index.src.html.
Testing aids: `?start=hall`, `?start=finale`, `?bot` (auto-jumps), `?timerraf` (keeps running in a background tab).

Built with [KAPLAY](https://github.com/kaplayjs/kaplay) (MIT). Fonts: Pixelify Sans and Nunito (Google Fonts, OFL). Voices: Google Gemini TTS.
