# Fest Boss — Lead the Situation (spec)

A ~5 minute browser game that teaches **Situational Leadership** (Direct / Coach / Support / Delegate).
You lead a team of 3 weird pixel creatures organising a college fest over 5 days. Each of 6 decisions:
read the creature's Skill and Will → pick a leadership style → creature reacts → creature runs the task in a
Chrome-dino-style runner whose difficulty depends on whether your style matched → mini result.
Fest night ending + report card that shows what the player learned.

Static site, no build step. Plain ES modules. Open `index.html` via any static server. Deployable to Netlify Drop / GitHub Pages.

## File layout (each file has ONE owner — never edit files you don't own)

```
fest-boss/
  index.html          (UI owner)
  styles.css          (UI owner)
  lib/kaplay.mjs      (vendored KAPLAY 3001.0.19 — do not edit)
  src/main.js         (UI owner) boot, game state machine
  src/ui.js           (UI owner) DOM screens: title, dialogue, diagnose, styles, reaction, result, report card, HUD
  src/scoring.js      (UI owner) scoring + profile logic
  src/content.js      (CONTENT agent) all story text/data
  src/art.js          (ART agent) all pixel art, generated in code
  src/audio.js        (AUDIO agent) WebAudio babble voices + sfx, generated in code
  src/stage.js        (STAGE agent) KAPLAY scenes: title, talk, run (runner), fest
```

No external image or audio files. Everything is generated in code (pixel grids / canvas drawing / WebAudio synthesis).

## Shared visual tokens (use these exact hex values everywhere)

```
ink      #1B1530   outlines, dark text
night    #2B2350   night sky, dark panels
sky      #8FD3FF   day sky      sky2 #C9EEFF (horizon)
grass    #6BCB5A   grassDk #3E9A47
dirt     #C98B5A   dirtDk  #8E5A35
cream    #FFF6E5   UI paper    white #FFFFFF
riya     #9B6BFF   riyaDk #6A3FD1  riyaLt #C9B0FF     (purple jelly blob)
zib      #2EC4B6   zibDk  #168A80  zibLt  #9BF0E6     (teal three-eyed bat-thing)
gorp     #8DBB3A   gorpDk #5E8424  stone #8A8F9C stoneDk #5A5F6B  (mossy rock golem)
heart    #FF4D6D   heartDk #C21E45
gold     #FFC93C   orange #FF8A3D   pink #FF8FC7   gray #B9B4C7
```

Style colours (consistent across UI and report): direct = orange, coach = gold, support = pink, delegate = zib teal.

## Theory mapping (the core)

Skill and Will are each `"low"` or `"high"`.

| Skill | Will | Style needed |
|---|---|---|
| low  | high | direct   |
| low  | low  | coach    |
| high | low  | support  |
| high | high | delegate |

Style hands-on level: direct 4, coach 3, support 2, delegate 1.
Chosen level > needed level → **over-led** (micromanaged). Chosen < needed → **under-led** (abandoned). Equal → **match**.

## Module contracts

### src/content.js (CONTENT)
```js
export const CREATURES = {
  riya: { id:'riya', name:'Riya', species:'Blorp', color:'#9B6BFF', blurb:'...' },
  zib:  { id:'zib',  name:'Zib',  species:'Tri-eyed Flapper', color:'#2EC4B6', blurb:'...' },
  gorp: { id:'gorp', name:'Gorp', species:'Moss Golem', color:'#8DBB3A', blurb:'...' },
};
export const STYLES = [ // order = button order
  { id:'direct',   label:'Direct',   hint:'Give clear steps, check often', level:4, key:'1' },
  { id:'coach',    label:'Coach',    hint:'Steps + explain why + cheer',   level:3, key:'2' },
  { id:'support',  label:'Support',  hint:'Listen, encourage, back them',  level:2, key:'3' },
  { id:'delegate', label:'Delegate', hint:'Hand it over, step back',       level:1, key:'4' },
];
export const DAYS = [ // exactly 6 entries, in play order
  {
    id:'d1', dayNum:1, dayLabel:'Monday', creature:'riya',
    task:'Fest budget', theme:'budget',          // theme ∈ budget | posters | stage | food
    skill:'low', will:'high', correct:'direct',
    setup:'Narrator line (1 sentence) setting the scene.',
    dialogue:[ { who:'riya', text:'...' }, { who:'riya', text:'...' } ], // 2–3 lines, ≤ 110 chars each, contain the CLUES
    skillWhy:'One short sentence: why skill is low/high here.',
    willWhy:'One short sentence: why will is low/high here.',
    reactions:{
      match:{ line:'creature line ≤ 90 chars', why:'lesson ≤ 140 chars, plain words' },
      over: { line:'...', why:'...' },   // you were more hands-on than needed
      under:{ line:'...', why:'...' },   // you were less hands-on than needed
    },
  },
  // d2 zib posters high/high delegate, d3 gorp stage high/low support,
  // d4 riya budget(again) low/low coach, d5 zib food low/high direct (TWIST: new task), d6 gorp stage(final check) high/high delegate
];
export const PROFILES = {
  situational:{ title:'The Situational Leader', blurb:'...' },
  micromanager:{ title:'The Micromanager', blurb:'...' },
  ghost:{ title:'The Ghost Boss', blurb:'...' },
  frozen:{ title:'The Mind Reader Who Froze', blurb:'...' }, // read people right, picked wrong styles
};
export const FEST = { // ending
  intro:'Narrator line: fest night begins.',
  props:{ budget:{good:'...',bad:'...'}, posters:{good,bad}, stage:{good,bad}, food:{good,bad} }, // 1 sentence each
};
export const COPY = {
  title:'Fest Boss', subtitle:'Lead the Situation',
  tagline:'...', howTo:[ '...', '...', '...' ], // 3 short steps
  closing:'Lead the situation in front of you.',
};
```

### src/art.js (ART)
```js
export const PAL = { ink:'#1B1530', ... };            // the tokens above
export function registerArt(k) { /* k.loadSprite(...) for every sprite below; returns nothing */ }
export function spriteURL(name, frame = 0) { /* PNG data URL of one frame at native size, for <img> in HTML */ }
```
Sprites (exact names; frames laid out horizontally in one sheet; native pixel sizes):

| name | size/frame | frames & anims |
|---|---|---|
| `riya`,`zib`,`gorp` | 24×24 | 7 frames. anims: `idle` 0–1 loop speed 3, `run` 2–3 loop speed 10, `jump` 4, `happy` 5, `sad` 6 |
| `heart` | 9×8 | 3 frames: 0 full, 1 cracked, 2 empty |
| `sparkle` | 8×8 | 4 frames anim `play` 0–3 speed 12 |
| `smoke` | 16×16 | 4 frames anim `play` 0–3 speed 10 |
| `shield` | 28×28 | 2 frames anim `glow` loop speed 6 (bubble drawn around a 24px creature) |
| `stormcloud` | 32×16 | 2 frames anim `rumble` loop speed 4 (grey "micromanager" cloud with an angry face) |
| `ob_budget` | 16×16 | 2 frames anim `idle` loop speed 4 — red "#ERR" spreadsheet block |
| `ob_posters` | 16×16 | 2 frames — tipped paint bucket with splat |
| `ob_stage` | 16×16 | 2 frames — stack of wooden planks/crate |
| `ob_food` | 16×12 | 2 frames — flying red chilli with flame (this one flies) |
| `ground` | 16×16 | 1 frame, tileable grass-top dirt |
| `bg_campus` | 320×180 | 1 frame: day sky, clouds, college building w/ "FEST" banner & bunting, grass |
| `bg_hills` | 320×60 | 1 frame, horizontally tileable far parallax |
| `bg_bushes` | 320×30 | 1 frame, horizontally tileable near parallax (bushes, lamp posts) |
| `bg_night` | 320×180 | 1 frame: fest night, stars, open-air stage area, string lights |
| `prop_budget_good/bad` | 48×48 | fireworks burst / sad fizzled single rocket |
| `prop_posters_good/bad` | 48×48 | bright glowing poster / blank torn poster |
| `prop_stage_good/bad` | 48×48 | tall lit stage / collapsed planks |
| `prop_food_good/bad` | 48×48 | steaming food stall / stall on fire |
| `badge_situational`,`badge_micromanager`,`badge_ghost`,`badge_frozen` | 24×24 | 1 frame each |
| `task_budget`,`task_posters`,`task_stage`,`task_food` | 24×24 | 1 frame — icon of the task (spreadsheet, poster, stage, food) |

Creatures must look weird, cute, colourful, readable at 24px, with 1px ink outline and big expressive eyes.
Riya: purple jelly blob that wobbles. Zib: teal round body, three eyes, small bat wings, one antenna. Gorp: chunky grey rock body with moss on top, small glowing eyes.

### src/audio.js (AUDIO)
```js
export const audio = {
  unlock(),                 // call on first user gesture; resumes AudioContext
  setMuted(bool), isMuted(),
  babble(who, ch),          // who ∈ riya|zib|gorp|narrator; ch = the char just typed. Ignores spaces/punctuation, self-throttles.
  sfx(name),                // select confirm tick cross sparkle crack smoke jump hit shield win lose fanfare whoosh countdown go
};
```
All synthesized with WebAudio. Must never throw if AudioContext is unavailable. Mute persisted in localStorage (wrapped in try/catch).

### src/stage.js (STAGE)
```js
export function createStage(k, audio) {
  return {
    showTitle(),                              // campus bg, 3 creatures idling/bobbing, gentle parallax
    showTalk(creatureId, theme),              // campus bg, creature large-ish centre, task icon next to it, idle anim
    react(kind),                              // kind ∈ match|over|under. match: happy frame + sparkles + hop; over: sad + heart cracks over head + stormcloud puff; under: sad + smoke puff + shake. ~1.6s. Returns Promise.
    run({ creature, theme, mode }),           // mode ∈ match|over|under. Runner. Returns Promise<{ hearts:0..3, progress:0..1 }>
    showFest(outcomes),                       // outcomes: { budget:bool, posters:bool, stage:bool, food:bool, creatures:{riya:'happy'|'sad', zib, gorp} }
  };
}
```
KAPLAY is created by main.js: `kaplay({ canvas, width:320, height:180, letterbox:true, crisp:true, global:false, background:[143,211,255], touchToMouse:true, debug:false })`. Stage uses only the `k` instance (no globals).

Runner rules:
- 3-2-1-GO countdown (in canvas), then ~16 s run. Creature on the left third; ground scrolls; parallax `bg_hills` + `bg_bushes`.
- Jump: Space / ArrowUp / W, or pointerdown anywhere on the page (listen on `window` while running; remove listeners after). Variable height not needed; one solid jump. No double jump.
- Obstacles use `ob_<theme>`; `food` obstacles fly at two heights (jump over low ones; high ones pass over a standing creature).
- 3 hearts drawn top-left (`heart` sprite). Hit → lose heart, brief invulnerability blink, `hit` sfx; in `over` mode a hit also plays `crack`.
- Progress bar top-centre with task icon. Run ends at 16 s, or early at 0 hearts (creature `sad`, falls over).
- **match**: speed 120 px/s, obstacle gap 1.5–2.2 s, starts with `shield` that absorbs the first hit. Bright.
- **over**: speed 140, gap 1.1–1.6 s, `stormcloud` follows above the creature and drops an extra obstacle every ~3 s (with a 0.7s warning shadow on the ground).
- **under**: speed 160, gap 1.0–1.5 s, darkness overlay with a soft circle of light around the creature so obstacles appear late.
- A competent player should finish match runs with 2–3 hearts, over/under runs with ~1–2.
- After end: small "Task done X%" banner in canvas for 1 s, then resolve.

### Scoring (UI owner, src/scoring.js)
Per turn out of 10: diagnosis 2 per correct meter (max 4); style 4 if match, 2 if level differs by 1, else 0; run = hearts left, capped at 2 (3→2, 2→2, 1→1, 0→0)... use `Math.min(2, hearts)`. Total /60.
Grade: S ≥ 54, A ≥ 45, B ≥ 36, C ≥ 27, D below. If style matches ≤ 3, grade is capped at C.
Profile: matches ≥ 5 → situational; else over ≥ under + 2 → micromanager; else under ≥ over + 2 → ghost; else reads ≥ 10/12 → frozen; else over ≥ under → micromanager; else ghost.
Fest outcomes: budget = avg(d1,d4) ≥ 6; posters = d2 ≥ 6; stage = avg(d3,d6) ≥ 6; food = d5 ≥ 6. Creature mood happy if its avg turn score ≥ 6.

## UI / UX rules (from Figma design basics)
- Same layout every turn: stage canvas on top (16:9), one panel below. One decision per screen.
- Buttons: clear default / hover (lift) / active (press down) / focus-visible (3px ring) / selected states. ≥ 44px touch targets. Keyboard 1–4, Space/Enter.
- Colour carries meaning only (red heart = hurt, gold = success, style colours constant).
- Fonts: "Pixelify Sans" headings/labels, "Nunito" body (Google Fonts). Cream paper panels, 3px ink borders, hard offset shadow (chunky pixel look). Canvas `image-rendering: pixelated`.
- Works at 360px wide phones and on a projector. Mute toggle always visible.
