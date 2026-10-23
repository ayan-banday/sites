// Fest Boss scoring: style fit per loop, run points, grade and leadership habit. Pure functions, no DOM.

const LEVEL = { direct: 4, coach: 3, support: 2, delegate: 1 };

// Is the chosen style too hands-on, too hands-off, or right for what the person needed?
export function styleFit(need, chosen) {
  const d = (LEVEL[chosen] || 1) - (LEVEL[need] || 1);
  return { mode: d === 0 ? 'match' : d > 0 ? 'over' : 'under', gap: Math.abs(d) };
}

// Max 10 per loop: style 6/3/0, run 4 (3 minus hits, +1 for no stumble).
export function scoreLoop(loop, run) {
  const fit = styleFit(loop.need, run.style);
  const style = fit.gap === 0 ? 6 : fit.gap === 1 ? 3 : 0;
  const runPts = Math.max(0, 3 - run.hits) + (run.stumbles === 0 ? 1 : 0);
  return { ...fit, style, run: runPts, total: style + runPts };
}

export function grade(pct, matches, loops) {
  let g = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'D';
  if (matches <= loops / 2 && 'SAB'.includes(g)) g = 'C';
  return g;
}

export function profile({ matches, over, under, timeouts, loops }) {
  if (matches >= loops - 1) return 'situational';
  if (over >= under + 2) return 'micromanager';
  if (under >= over + 2) return 'ghost';
  if (timeouts >= 2) return 'frozen';
  return over >= under ? 'micromanager' : 'ghost';
}

// turns: [{ loop, run, score }]
export function summarize(turns) {
  const loops = turns.length;
  const total = turns.reduce((s, t) => s + t.score.total, 0);
  const max = loops * 10;
  const pct = max ? Math.round((total / max) * 100) : 0;
  const count = (m) => turns.filter((t) => t.score.mode === m).length;
  const matches = count('match');
  const over = count('over');
  const under = count('under');
  const timeouts = turns.filter((t) => t.run.timedOut).length;

  // A task with no loop this mode (food in the quick fest) follows the overall average.
  const avg = (list) => (list.length ? list.reduce((s, t) => s + t.score.total, 0) / list.length : total / Math.max(1, loops));
  const byTask = (task) => avg(turns.filter((t) => t.loop.task === task));
  const byWho = (who) => avg(turns.filter((t) => t.loop.creature === who));
  const outcomes = {
    budget: byTask('budget') >= 6,
    posters: byTask('posters') >= 6,
    stage: byTask('stage') >= 6,
    food: byTask('food') >= 6,
    creatures: {
      riya: byWho('riya') >= 6 ? 'happy' : 'sad',
      zib: byWho('zib') >= 6 ? 'happy' : 'sad',
      gorp: byWho('gorp') >= 6 ? 'happy' : 'sad',
    },
  };

  return {
    total, max, pct, matches, over, under, timeouts, loops,
    grade: grade(pct, matches, loops),
    profile: profile({ matches, over, under, timeouts, loops }),
    outcomes,
    turns,
  };
}
