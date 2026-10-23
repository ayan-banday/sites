# Fest Boss 2 — build spec (contract between modules)

Static site, plain ES modules, KAPLAY 3001 (`lib/kaplay.mjs`, created with `global:false`). No build step for dev
(`index.src.html`); `dev/build.mjs` bundles to a single `index.html` for hosting. Every asset is drawn or synthesized
in code. Players are college students who scan a QR during a talk and play ALONE on their phone, held sideways.
Nobody explains anything to them, so every screen must be obvious and the first 3 seconds must be action.

## Experience (approved by Ayan)
1. **Title** over a live collapsing-fest scene: "FEST BOSS", "TAP TO RUN". One tap = audio + speech unlock + Android fullscreen/landscape lock + go.
2. **Cold-open run (~40 s)**: hard but fair. Stage scaffolding collapses behind you, debris falls with shadow warnings, speakers and crates block the path, pits. Bunty Bhaiya (the previous organiser) flees past you and dumps the fest on you. Walkie-talkie barks (spoken Hinglish) from the team explain the mess while you run. One-time "TAP" and "HOLD = higher" tips with a brief slow-mo. Ends at the hall door.
3. **Meeting hall (~45 s)**: Dean Blorb at a whiteboard. Task cards fly from the board to Riya, Zib and Gorp. Then the 4 roads (styles) are introduced one by one as spoken lines + big sign cards. Visual first, little text.
4. **Loops (~50 s each)**: run with a teammate through a new place (phase A). Their barks reveal skill (🔧) and will (🔥) cues in a bubble. Something breaks (a scripted mini-disaster). **Slow-mo junction**: road forks into 4 coloured lanes, time slows, world dims, 4 big tappable signs (Direct/Coach/Support/Delegate) + timer. Then phase B runs on the chosen road with a **buff or debuff** that really changes play. Then a one-sentence lesson card.
5. **Finale**: fest-night run; props along the route are good/broken based on your results; teammates you led well run with you. Fireworks. **Report** card: grade, leadership habit, one line per loop, closing line, replay.

Modes: `short` (default, ≤7 min, target ~6 min) and `long` (`?mode=long`, ≤12 min, target ~9–10 min). Title has a small toggle.

| Order | short | long |
|---|---|---|
| cold open, meeting | ✓ | ✓ |
| L1 Riya · budget · low skill/high will → **direct** · place `quad` | ✓ | ✓ |
| L2 Zib · posters · high/high → **delegate** · place `woods` | ✓ | ✓ |
| STORM run (power cut, lightning, no decision) | – | ✓ |
| L3 Gorp · stage · high/low → **support** · place `backstage` | ✓ | ✓ |
| L4 Riya · budget again, after a flop · low/low → **coach** · place `canteen` | ✓ | ✓ |
| L5 Zib · food stall (new task) · low/high → **direct** · place `canteen` | – | ✓ |
| L6 Gorp · final stage check · high/high → **delegate** · place `backstage` | – | ✓ |
| finale (short 20 s / long 35 s), report | ✓ | ✓ |

## Screen
- Full screen, landscape. Logical height **H = 180**. Logical width **W = clamp(round(180 × long/short side), 320, 400)** chosen at boot (`src/view.js` exports `W`, `H`). KAPLAY `letterbox:true`, `crisp:true`; page background = ink so any bars blend.
- Everything else is a DOM overlay positioned over the canvas (`#overlay` inside `#stage-wrap`, same box as the canvas). No panel below the game anymore.
- Portrait on a phone → full-screen "Rotate your phone" overlay; the game pauses (`k.debug.paused`) until landscape.
- Android Chrome: on the first tap call `document.documentElement.requestFullscreen({navigationUI:'hide'})` then `screen.orientation.lock('landscape')`, both in try/catch. iPhone cannot; it just uses the rotate overlay.
- CSS: `100dvh`/`100dvw`, `viewport-fit=cover` + `env(safe-area-inset-*)` padding for overlays, `touch-action:none` on the stage, `user-select:none`, `overscroll-behavior:none`.

## Design tokens
ink `#1B1530` · night `#2B2350` · cream `#FFF6E5` · riya `#9B6BFF` · zib `#2EC4B6` · gorp `#8DBB3A` · blorb `#C98B5A` · bunty `#6E7FD8` · heart `#FF4D6D` · gold `#FFC93C` · orange `#FF8A3D` · pink `#FF8FC7`
Styles: direct = orange, coach = gold, support = pink, delegate = teal (`#2EC4B6`).
Fonts: Pixelify Sans (headings, labels, numbers), Nunito 700/800 (dialogue, body). Chunky look: cream cards, 3px ink borders, hard 0 4px 0 ink shadows, 10–14px radius. Buttons have default / hover lift / active press / focus-visible ring states, ≥44 px targets. Colour only carries meaning.

## Theory
Skill low + Will high → Direct (level 4). Low/low → Coach (3). High/low → Support (2). High/high → Delegate (1).
Chosen level > needed = `over` (too hands-on). Chosen < needed = `under` (too hands-off). Equal = `match`. `gap = |chosen − needed|` (1..3).
Junction timeout (no tap) = you froze = treated as **delegate** (doing nothing is hands-off), flagged `timedOut`.

## Characters (ids)
`riya` (purple jelly blob, eager, mixes Hindi/English), `zib` (three-eyed teal bat artist, dramatic, mostly English with Hindi words), `gorp` (mossy rock golem, slow, mostly Hindi, few words), `blorb` (Dean Blorb, big tan blob with glasses and tie, mostly Hindi, pompous but kind), `bunty` (Bunty Bhaiya, frazzled previous organiser, panicky fast Hinglish), `narrator`.

---
## Module: `src/content.js` (content agent)
Plain data, no imports. Every spoken line is an object `{ who, text, say }`:
- `text`: Roman-script Hinglish subtitle, **≤ 70 characters**, readable at a glance, funny, clean (no swearing), never an em dash.
- `say`: the same line in **Devanagari** for a Hindi TTS voice (English words transliterated, e.g. "बजट", "पोस्टर"). For `zib` and `narrator` `say` may be omitted (they use an English-India voice reading `text`).
- Lines must make sense when heard without the screen.

Exports:
```js
export const CAST = { riya:{id,name,color,blurb}, zib, gorp, blorb, bunty }
export const STYLES = [ // order matters: keys 1-4
  { id:'direct', name:'Direct', level:4, skill:'low', will:'high', color:'#FF8A3D', icon:'sign_direct',
    quote:'≤34 chars, what you'd say, Hinglish', tagline:'≤28 chars plain English: Tell them how' }, coach, support, delegate ]
export const COLD_OPEN = {
  barks: [ { at: seconds, who, text, say }, ... ],   // 7–9 barks over 38 s; first at ~1.5 s (Bunty fleeing), last ~35 s (Dean: hall mein aao)
  tipTap: 'TAP to jump', tipHold: 'HOLD to jump higher', door: { who:'blorb', text, say } }
export const MEETING = {
  lines: [ line, ... ],                      // 3–5 lines: Dean sets the scene (fest in 5 days, last boss ran away, you're in charge)
  assign: [ { who:'riya', task:'budget', line }, { who:'zib', task:'posters', line }, { who:'gorp', task:'stage', line } ], // Dean hands each a card; line = the creature's reaction
  roadsIntro: line,                          // Dean: "Har bande ko alag raasta chahiye" style
  roads: { direct: line, coach: line, support: line, delegate: line }, // Dean explains each road in one spoken line (who:'blorb')
  outro: line }
export const LOOPS = [ {
  id:'l1', modes:['short','long'], creature:'riya', task:'budget', place:'quad',
  title:'Budget Bawaal',        // ≤ 18 chars chapter name
  skill:'low', will:'high', need:'direct',
  barks: [ { at:1.5, who, text, say, cue:null|'skill'|'will' }, ... ], // 4–5 barks across phase A (0–14 s); exactly one cue:'skill' and one cue:'will' bark — these reveal the read
  breakLine: line,              // spoken as the mini-disaster hits (e.g. cash blowing away)
  ask: line,                    // creature asks you what to do, right before the junction
  read: { skill:'≤40 chars why skill is low/high', will:'≤40 chars why will is low/high' },
  reactions: {
    match: { line, lesson:'≤90 chars one-sentence takeaway' },
    over:  { line, lesson },
    under: { line, lesson } } }, ... ]   // 6 loops total, see table above; L4 shows Riya flopped and lost confidence; L5 Zib is clueless about food
export const STORM = { barks:[ {at, who, text, say}, ... ] }  // 4–5 barks, ~25 s, power cut panic, team pulls together
export const FINALE = { barks:[ {at, ...line} ], good:{budget,posters,stage,food: '≤40 chars'}, bad:{...} }
export const PROFILES = { situational:{title,line}, micromanager:{...}, ghost:{...}, frozen:{...} } // line ≤ 120 chars
export const COPY = { title:'Fest Boss', subtitle:'Lead the Situation', tap:'TAP TO RUN', rotate:'Turn your phone sideways',
  short:'Quick fest · 6 min', long:'Full fest · 10 min', closing:'Lead the situation in front of you.', replay:'Play again', ... }
```
`task` ids: `budget | posters | stage | food`. Place ids: `fest | quad | woods | backstage | canteen | night`.

## Module: `src/art.js` (art agent) — extend, keep existing exports/sprites
Same pixel-buffer helpers, same palette feel (outlined, chunky, cute). Add:
- Creatures (same frame layout as riya: idle 0–1, run 2–3, jump 4, happy 5, sad 6): `blorb` 32×32, `bunty` 24×24 (sweaty, headband, clipboard).
- Parallax layers, **400 px wide, seamless horizontal tiling**, transparent above the skyline, bottom edge sits on the ground line:
  `fest_far` 400×100 (tents, ferris wheel, broken banners, leaning scaffold), `fest_near` 400×36 (barricades, bunting, crowd running),
  `quad_far` 400×90, `quad_near` 400×36, `woods_far` 400×110, `woods_near` 400×40, `backstage_far` 400×110 (curtains, rigs, ropes),
  `backstage_near` 400×36 (cables, flight cases), `canteen_far` 400×100 (stalls, string lights, night), `canteen_near` 400×36,
  `night_far` 400×110 (lit fest stage, ferris wheel lights), `night_near` 400×40 (crowd silhouettes with glow sticks).
- `hall` 400×180 full room: back wall, big whiteboard (centre-right, x≈200–330, y≈30–100, empty middle for cards), windows, fest banner, wooden floor from y=150.
- Ground tiles 16×30 (top 2–3 px is the walking surface at y=0): `gr_grass`, `gr_wood`, `gr_tile`, `gr_path`, `gr_stage`.
- Obstacles (botleft anchor, frames ≥1): `ob_crate` 16×16, `ob_speaker` 16×26 (tall, needs a held jump), `ob_cone` 12×12, `ob_debris` 18×10 (fallen chunk), `ob_light` 16×12 (falling stage light), `ob_log` 22×12, `ob_rock` 14×12, `ob_tray` 16×10, `ob_cash` 14×10 (flying note bundle, 2 frames flutter). Keep existing `ob_budget/posters/stage/food`.
- `scaffold` 48×140, 3 frames (standing, tilting, collapsing) — the chasing collapse at the left edge in the cold open.
- `door` 40×60 hall door (closed 0, open 1).
- Icons 24×24: `sign_direct` (megaphone, orange), `sign_coach` (whistle + clipboard, gold), `sign_support` (heart in hands, pink), `sign_delegate` (paper plane, teal).
- Icons 12×12: `icon_skill` (wrench), `icon_will` (flame), `icon_walkie`, `buff_sync` (two linked hearts), `debuff_resentful` (grumpy storm face), `debuff_lost` (question mark in fog).
- `firework` 16×16, 4 frames burst. `confetti` 4×4, 4 colour frames.
- Update `dev/art-preview.html` to show every sprite at 3× on a checker background.

## Module: `src/audio.js` (audio agent) — extend, keep existing API
- `audio.say(who, line)` → `Promise<{spoken:boolean}>`. Uses `speechSynthesis`. Voice per character:
  riya hi-IN pitch 1.55 rate 1.08 · zib en-IN pitch 1.3 rate 1.12 · gorp hi-IN pitch 0.35 rate 0.85 · blorb hi-IN pitch 0.7 rate 0.95 · bunty hi-IN pitch 1.15 rate 1.3 · narrator en-IN pitch 1 rate 1.05.
  Pick voices by `lang` (prefer names containing Google / Natural / Neural); if a hi voice exists and `line.say` exists speak `say` with it, else speak `text` with en-IN → en-GB → any en voice. Load voices via `voiceschanged`. Cancel any line still speaking before starting a new one. Resolve on `end`/`error`, plus a safety timeout of `1500 + 90 ms × text.length`. If speech is unavailable or muted, resolve after `600 + 45 ms × text.length` and return `{spoken:false}`.
  Play a short per-character "chirp" (2–3 babble notes) at the start of every line so each creature is recognisable even with TTS.
- `audio.canSpeak()` → boolean (speech available, a voice loaded, not muted). `audio.stopSpeech()`.
- `audio.warmup()` — call inside the first tap: unlock AudioContext AND speak an empty/space utterance at volume 0 (Chrome needs a gesture).
- `audio.music(name|null)` — synthesized looping chiptune via a lookahead scheduler: `run` (upbeat ~150 bpm), `chase` (cold open, urgent), `hall` (light, bouncy), `tense` (junction pulse), `storm`, `fest` (celebration). `null` stops. Crossfade 0.3 s. Music bus gain ≈ 0.18 under master.
- `audio.slowmo(on)` — lowpass + detune the music bus down while the junction is open.
- Mute toggles everything including speech (`speechSynthesis.cancel()`).
- New sfx names: `rumble`, `crash`, `creak`, `slowIn`, `slowOut`, `timer`, `buff`, `debuff`, `thunder`, `wind`, `cheer`, `firework`, `pitfall`, `stumble`, `pop`, `walkie` (radio squelch), `door`, `card` (paper flick), `stamp`.
- `dev/audio-preview.html`: buttons for every sfx, every music track, and `say` for each character with a sample line.

## Module: `src/ui.js` + `styles.css` + `index.src.html` (UI agent)
All overlays live in `#overlay` (absolute, inset 0 over the canvas, `pointer-events:none` except interactive children). Sizes scale with the viewport: base unit `--u: min(1vh*?, …)` so it looks the same on a 360×800 phone in landscape (CSS ~800×360) and a 1440×900 laptop. Text never below 14 CSS px on phones.
Imports `spriteURL` from art.js, `audio` from audio.js, `STYLES, CAST, COPY` from content.js.
```js
init()                                    // builds overlay DOM, mute button (top-right), rotate overlay + portrait detection
title({mode}) → Promise<{mode}>           // logo, subtitle, pulsing TAP TO RUN (whole screen is the button), small mode toggle chip
bark(line) → Promise                      // top-centre walkie strip: portrait (spriteURL(who,0)), name in creature colour, typewritten text; audio.say; stays max(2.2s, speech end + .3s); queue, never overlap; never blocks input
clearBarks()
dialogue(lines) → Promise                 // bottom box for scenes (hall, after runs): portrait, name, typewriter; advance when speech ends + .5 s OR tap (tap first completes text); "tap" chevron
roads(meeting) → Promise                  // 4 sign cards appear one at a time, each while its Dean line is spoken; then a big "Let's go" button
chapter({n,total,title,creature,task}) → Promise   // 1.6 s splash: "2/4 · Posters Panga" with creature + task icon, slides in/out
hud({hearts, maxHearts, progress, buff})  // top-left hearts (heart crack animation on loss), thin progress bar, buff chip {id:'sync'|'resentful'|'lost', label, t01} with draining bar; call only on change
hideHud()
tip(kind)  /  hideTip()                   // kind 'tap' | 'hold': big pulsing hand icon + text centred low
toast(text, tone)                         // short centre pop: "Stumble!", "Shield!", tone good|bad
junction({creature, read:{skill,will}, ask, limit}) → Promise<{style, timedOut}>
                                          // dims canvas; LEFT: creature portrait, ask line, read chips (🔧 Skill LOW/HIGH, 🔥 Will LOW/HIGH, coloured);
                                          // RIGHT: 4 stacked sign buttons (style colour border, icon, name, quote, small "for 🔧low 🔥high" chips) aligned to the 4 lanes;
                                          // draining timer bar (limit s); keys 1–4; pop sfx on press; resolves once
lesson({creature, need, chosen, fit, timedOut, reaction, read}) → Promise
                                          // card: big ✓ / ↑ too hands-on / ↓ too hands-off; creature reaction line (spoken); "Needed: Direct · You: Delegate"; the lesson sentence; Continue button (1 s guard)
report(summary) → Promise                 // full-screen card, scrollable inside: grade, habit badge, per-loop rows (icon, needed vs chosen, ✓/✗), closing line, "Play again", "Try the full fest" link (?mode=long) in short mode
error()
```

## Module: `src/stage.js`, `src/main.js`, `src/scoring.js`, `src/view.js` (lead)
Runner: gravity 1000, tap jump v 250, **hold** up to 0.22 s adds lift (max ≈ 300 equivalent), release cuts upward velocity ×0.45, coyote 0.1 s, jump buffer 0.12 s, hitbox 75 % of sprite. 3 hearts, 1.2 s blink after a hit. 0 hearts = **stumble** (counts against you, hearts refill, run continues) — never game over.
Debuffs scale with `gap` (1–3): **Resentful** (over): jump power × (1 − 0.07·gap), speed × (1 + 0.08·gap), the teammate sulks behind under a stormcloud that drops extra obstacles. **Lost** (under): fog hides everything beyond `PLAYER_X + 150 − 25·gap`, more obstacles, pits. **Sync** (match): teammate runs alongside, one-hit shield, a gentler pattern set.
Scoring per loop (max 10): style 6 (match) / 3 (gap 1) / 0; run 4 = max(0, 3 − hits) + (no stumble ? 1 : 0). Grade by %: S ≥ 90, A ≥ 75, B ≥ 60, C ≥ 45, else D; capped at C when matches ≤ half the loops.
Profile: matches ≥ loops − 1 → situational; over ≥ under + 2 → micromanager; under ≥ over + 2 → ghost; timeouts ≥ 2 → frozen; else the larger of over/under.
