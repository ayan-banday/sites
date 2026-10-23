import kaplay from '../lib/kaplay.mjs';
import { W, H } from './view.js';
import { registerArt } from './art.js';
import { audio } from './audio.js';
import { createStage } from './stage.js';
import { COLD_OPEN, MEETING, LOOPS, STORM, FINALE, COPY } from './content.js';
import { styleFit, scoreLoop, summarize } from './scoring.js';
import * as ui from './ui.js';

const params = new URLSearchParams(location.search);

const k = kaplay({
  canvas: document.getElementById('stage'),
  width: W,
  height: H,
  letterbox: true,
  crisp: true,
  global: false,
  background: [27, 21, 48],
  touchToMouse: true,
  debug: false,
});

if (params.has('timerraf')) window.__k = k; // testing aid

registerArt(k);
const stage = createStage(k, audio);
ui.init();

// iOS/Android only unlock audio inside a gesture, and can re-suspend it after an app switch.
for (const type of ['click', 'touchend', 'keydown']) window.addEventListener(type, () => audio.unlock(), { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) audio.unlock(); });

// Portrait phone: pause everything until it's turned sideways.
ui.onOrientation((portrait) => {
  k.debug.paused = portrait;
  if (portrait) audio.stopSpeech();
});

const lastAt = (barks) => barks.reduce((m, b) => Math.max(m, b.at), 0);

// Hooks the stage calls while a run is live.
function hooksFor(extra = {}) {
  return {
    bark: (line) => { ui.bark(line); },
    hud: (s) => ui.hud({ ...s, buff: s.buff ? { ...s.buff, label: COPY.buffs[s.buff.id] } : null }),
    tip: (kind) => ui.tip(kind),
    hideTip: () => ui.hideTip(),
    toast: (key, tone) => ui.toast(COPY[key] || key, tone),
    fit: () => ({ mode: 'match', gap: 0 }),
    reaction: () => null,
    junction: async () => ({ style: 'delegate', timedOut: true }),
    ...extra,
  };
}

async function playFest(mode) {
  const long = mode === 'long';
  const loops = LOOPS.filter((l) => l.modes.includes(mode));
  const start = params.get('start'); // testing aid: ?start=hall | loops | finale

  if (!start) {
  // 1. Cold open: straight into the collapse.
  audio.music('chase');
  await stage.run({ kind: 'cold', place: 'fest', dur: Math.max(38, lastAt(COLD_OPEN.barks) + 3), barks: COLD_OPEN.barks, tutorial: true }, hooksFor());
  ui.hideHud();
  ui.clearBarks();
  if (COLD_OPEN.door) await ui.dialogue([COLD_OPEN.door]);
  }

  if (!start || start === 'hall') {
  // 2. Meeting hall.
  audio.music('hall');
  stage.hall();
  await ui.dialogue(MEETING.lines);
  for (const a of MEETING.assign) {
    stage.hallAssign(a.who, a.task);
    await ui.dialogue([a.line]);
  }
  await ui.roads(MEETING); // speaks roadsIntro, then each road
  if (MEETING.outro) await ui.dialogue([MEETING.outro]);
  }

  // 3. The loops (storm after the second one in the full fest).
  const turns = [];
  for (const [i, loop] of loops.entries()) {
    if (start === 'finale') break;
    if (long && i === 2) {
      await ui.chapter({ n: 0, total: 0, title: 'Power cut!', creature: 'gorp', task: 'stage' });
      audio.music('storm');
      await stage.run({ kind: 'storm', place: 'quad', dur: Math.max(24, lastAt(STORM.barks) + 4), speed: 138, difficulty: 0.5, barks: STORM.barks, buddies: ['riya', 'zib', 'gorp'] }, hooksFor());
      ui.hideHud();
      ui.clearBarks();
    }
    await ui.chapter({ n: i + 1, total: loops.length, title: loop.title, creature: loop.creature, task: loop.task });
    audio.music('run');
    const run = await stage.run({
      kind: 'loop', place: loop.place, loop,
      durA: long ? 17 : 14, durB: long ? 14 : 12,
      speed: 132 + i * 4, difficulty: 0.35 + i * 0.08,
      barks: loop.barks, buddies: [loop.creature],
    }, hooksFor({
      junction: () => {
        ui.clearBarks();
        ui.hideHud();
        return ui.junction({ creature: loop.creature, read: { skill: loop.skill, will: loop.will }, ask: loop.ask, limit: 9 });
      },
      fit: (style) => styleFit(loop.need, style),
      reaction: (m) => loop.reactions[m] && loop.reactions[m].line,
    }));
    ui.hideHud();
    ui.clearBarks();
    const score = scoreLoop(loop, run);
    turns.push({ loop, run, score });
    await ui.lesson({
      creature: loop.creature, need: loop.need, chosen: run.style, fit: score.mode, gap: score.gap,
      timedOut: run.timedOut, reaction: loop.reactions[score.mode], read: loop.read, skill: loop.skill, will: loop.will,
    });
  }

  // 4. Fest night.
  const summary = summarize(turns);
  const happy = ['riya', 'zib', 'gorp'].filter((id) => summary.outcomes.creatures[id] === 'happy');
  await ui.chapter({ n: 0, total: 0, title: 'Fest Night!', creature: 'boss', task: 'stage' });
  audio.music('fest');
  await stage.run({
    kind: 'finale', place: 'night', dur: Math.max(long ? 34 : 24, lastAt(FINALE.barks) + 4),
    speed: 130, difficulty: 0.3, barks: FINALE.barks, buddies: happy,
    outcomes: summary.outcomes, propLines: { good: FINALE.good, bad: FINALE.bad },
  }, hooksFor());
  ui.hideHud();
  ui.clearBarks();
  audio.music(null);
  await ui.report({ ...summary, loops: summary.turns, mode }); // ui reads rows from `loops`
}

k.onLoad(async () => {
  document.getElementById('stage-loading').hidden = true;
  let mode = params.get('mode') === 'long' ? 'long' : 'short';
  try {
    for (;;) {
      stage.title();
      audio.music(null);
      const pick = await ui.title({ mode });
      mode = pick && pick.mode ? pick.mode : mode; // ui.title already unlocked audio and went fullscreen
      await playFest(mode);
    }
  } catch (err) {
    console.error(err);
    ui.error();
  }
});
