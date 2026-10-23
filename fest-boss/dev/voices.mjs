// Records a natural voice for every spoken line in src/content.js with Gemini TTS, saves small MP3s
// in audio/voice/, and writes src/voices.js (the list the game checks before playing a clip).
// The API key is only read from the environment and never written into the game.
//
// The free tier allows ~10 requests per model per day, so each character's lines are recorded in a
// few long takes with pauses between lines, then cut apart at the longest silences.
//
// Usage (from the fest-boss folder; needs Node 18+ and ffmpeg on PATH):
//   GEMINI_API_KEY=... node dev/voices.mjs            record lines that have no clip yet
//   GEMINI_API_KEY=... node dev/voices.mjs --force    re-record everything
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { execFileSync, spawnSync } from 'child_process';
import { tmpdir } from 'os';

const root = join(import.meta.dirname, '..');
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('Set GEMINI_API_KEY first.'); process.exit(1); }
// --recut riya,gorp re-cuts those characters from the takes saved last run, without calling the API.
const RECUT = (process.argv.find((a) => a.startsWith('--recut=')) || '').slice(8).split(',').filter(Boolean);
const FORCE = process.argv.includes('--force') || RECUT.length > 0;
const OUT = join(root, 'audio', 'voice');
const RAW = join(tmpdir(), 'festboss-takes');
mkdirSync(OUT, { recursive: true });
mkdirSync(RAW, { recursive: true });
const MODELS = (process.env.TTS_MODELS || 'gemini-2.5-flash-preview-tts,gemini-3.8-flash-lite-tts').split(',');
const BATCH = 13;

// Must match voiceId() in src/audio.js.
function voiceId(who, text) {
  let h = 0x811c9dc5;
  for (const ch of who + '|' + text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

const CAST = {
  riya: { voice: 'Leda', style: 'Riya, an excited, bubbly young Indian college girl from Delhi, speaking natural fast cheerful Hindi' },
  zib: { voice: 'Puck', style: 'Zib, a dramatic, flamboyant Indian art student, speaking English with a natural Indian accent, theatrical and playful' },
  gorp: { voice: 'Algenib', style: 'Gorp, a big, slow, sleepy, kind builder with a deep gravelly voice, speaking slow calm natural Hindi' },
  blorb: { voice: 'Charon', style: 'Dean Blorb, a pompous but kind Indian college dean uncle in his fifties, speaking natural Hindi with warm authority and a little drama' },
  bunty: { voice: 'Fenrir', style: 'Bunty Bhaiya, a panicky college senior, speaking very fast, breathless natural Hinglish' },
  narrator: { voice: 'Aoede', style: 'a friendly, upbeat Indian festival announcer speaking warm natural Indian English' },
};

// ---- collect lines (reactions that can never happen are skipped)
const c = await import(pathToFileURL(join(root, 'src', 'content.js')).href);
const lines = [];
const add = (l) => { if (l && l.who && l.text && CAST[l.who]) lines.push(l); };
c.COLD_OPEN.barks.forEach(add); add(c.COLD_OPEN.door);
c.MEETING.lines.forEach(add); c.MEETING.assign.forEach((a) => add(a.line));
add(c.MEETING.roadsIntro); Object.values(c.MEETING.roads).forEach(add); add(c.MEETING.outro);
for (const L of c.LOOPS) {
  L.barks.forEach(add); add(L.breakLine); add(L.ask);
  for (const [m, r] of Object.entries(L.reactions)) {
    const impossible = (m === 'over' && L.need === 'direct') || (m === 'under' && L.need === 'delegate');
    if (!impossible) add(r.line);
  }
}
c.STORM.barks.forEach(add); c.FINALE.barks.forEach(add);
for (const t of Object.values(c.FINALE.good)) add({ who: 'narrator', text: t });
for (const t of Object.values(c.FINALE.bad)) add({ who: 'narrator', text: t });
const all = [...new Map(lines.map((l) => [voiceId(l.who, l.text), { ...l, id: voiceId(l.who, l.text) }])).values()];
const todo = all.filter((l) => (RECUT.length ? RECUT.includes(l.who) : FORCE || !existsSync(join(OUT, l.id + '.mp3'))));
console.log(`${all.length} lines, ${todo.length} to record`);

// ---- Gemini TTS
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exhausted = new Set();
async function take(who, batch) {
  const cast = CAST[who];
  const script = batch.map((l) => l.say || l.text).join('\n\n');
  const prompt = `Read these lines aloud one at a time, in the voice of ${cast.style}. Leave two full seconds of silence after every line. Do not read anything else.\n\n${script}`;
  for (const model of MODELS) {
    if (exhausted.has(model)) continue;
    for (let attempt = 1; attempt <= 3; attempt++) {
      let res;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: cast.voice } } } } }),
        });
      } catch (e) {
        console.warn(`  ${model} attempt ${attempt}: network ${e.cause?.code || e.message}`);
        await sleep(5000);
        continue;
      }
      const j = await res.json().catch(() => ({}));
      const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (part) return { data: Buffer.from(part.inlineData.data, 'base64'), mime: part.inlineData.mimeType, model };
      const msg = j.error?.message || res.status;
      if (res.status === 429 && /PerDay/.test(JSON.stringify(j))) { console.warn(`  ${model}: daily quota used up`); exhausted.add(model); break; }
      console.warn(`  ${model} attempt ${attempt}: ${String(msg).slice(0, 120)}`);
      await sleep(res.status === 429 ? 30000 : 4000);
    }
  }
  return null;
}

// ---- cut a take at its N-1 longest silences
function toWav(raw, mime, dest) {
  const tmp = dest + '.in';
  writeFileSync(tmp, raw);
  const input = /L16|pcm/i.test(mime) ? ['-f', 's16le', '-ar', String((mime.match(/rate=(\d+)/) || [])[1] || 24000), '-ac', '1', '-i', tmp] : ['-i', tmp];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...input, '-ac', '1', '-ar', '24000', dest]);
  rmSync(tmp);
}
function duration(f) { return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString()); }
function silences(f, d = 0.2) {
  const r = spawnSync('ffmpeg', ['-i', f, '-af', `silencedetect=noise=-38dB:d=${d}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = [];
  let s = null;
  for (const line of r.stderr.split('\n')) {
    const a = line.match(/silence_start: ([\d.]+)/); if (a) s = parseFloat(a[1]);
    const b = line.match(/silence_end: ([\d.]+)/); if (b && s != null) { out.push({ s, e: parseFloat(b[1]) }); s = null; }
  }
  return out;
}
// Pick the n-1 pauses that best fit the script: long pauses are likely line breaks, and each segment
// should last roughly in proportion to its line's length (dynamic programming over the pauses).
function split(wav, batch) {
  const n = batch.length;
  const total = duration(wav);
  const sil = silences(wav).filter((x) => x.s > 0.05 && x.e < total - 0.05); // inner gaps only
  if (sil.length < n - 1) return null;
  const chars = batch.map((l) => (l.say || l.text).length);
  const speech = total - sil.reduce((s, x) => s + (x.e - x.s), 0);
  const per = speech / chars.reduce((a, b) => a + b, 0);
  const exp = chars.map((ch) => ch * per);
  const M = sil.length;
  const startOf = (j) => (j < 0 ? 0 : sil[j].e);   // segment start after pause j (-1 = take start)
  const endOf = (j) => (j >= M ? total : sil[j].s);  // segment end at pause j (M = take end)
  const segCost = (i, a, b) => { const d = endOf(b) - startOf(a); return ((d - exp[i]) ** 2) / Math.max(0.5, exp[i]); };
  const gapBonus = (j) => 1.5 * (sil[j].e - sil[j].s);
  // best[i][j]: line i ends at pause j (j = M means the take end, only for the last line)
  const best = Array.from({ length: n }, () => new Array(M + 1).fill(Infinity));
  const from = Array.from({ length: n }, () => new Array(M + 1).fill(-1));
  for (let j = 0; j <= M; j++) if (n === 1 ? j === M : j < M) best[0][j] = segCost(0, -1, j) - (j < M ? gapBonus(j) : 0);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j <= M; j++) {
      if ((i === n - 1) !== (j === M)) continue;
      for (let p = 0; p < j && p < M; p++) {
        if (best[i - 1][p] === Infinity) continue;
        const v = best[i - 1][p] + segCost(i, p, j) - (j < M ? gapBonus(j) : 0);
        if (v < best[i][j]) { best[i][j] = v; from[i][j] = p; }
      }
    }
  }
  if (best[n - 1][M] === Infinity) return null;
  const ends = [M];
  for (let i = n - 1; i > 0; i--) ends.unshift(from[i][ends[0]]);
  const cuts = ends.slice(0, -1).map((j) => sil[j]);
  const segs = [];
  let start = 0;
  for (const x of cuts) { segs.push([start, x.s + 0.08]); start = Math.max(0, x.e - 0.08); }
  segs.push([start, total]);
  return segs;
}
// Better: ask Gemini where each line ends in the take, then snap every cut to the nearest pause.
// (Slow speakers pause inside lines as long as between them, so silence alone can misplace cuts.)
async function modelSplit(wav, batch) {
  const mp3 = wav.replace(/\.wav$/, '.listen.mp3');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '64k', mp3]);
  const n = batch.length;
  const script = batch.map((l, i) => `${i + 1}. ${l.say || l.text}`).join('\n');
  const text = `This audio is one take of a voice actor reading these ${n} lines in order:\n${script}\n\nFor each line, give the time in seconds (with two decimals) at which the actor finishes saying it. Reply with only a JSON array of ${n} numbers.`;
  for (const model of ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest']) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType: 'audio/mp3', data: readFileSync(mp3).toString('base64') } }, { text }] }], generationConfig: { responseMimeType: 'application/json' } }),
        });
        const j = await res.json();
        const out = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('');
        const ends = out && JSON.parse(out);
        if (Array.isArray(ends) && ends.length === n && ends.every((v, i) => typeof v === 'number' && (i === 0 || v > ends[i - 1]))) return snap(wav, ends);
        console.warn(`  align ${model}: ${j.error?.message?.slice(0, 80) || 'bad answer'}`);
      } catch (e) { console.warn(`  align ${model}: ${e.message.slice(0, 80)}`); }
      await sleep(4000 * attempt);
    }
  }
  return null;
}
function snap(wav, ends) {
  const total = duration(wav);
  const sil = silences(wav, 0.08).filter((x) => x.s > 0.05 && x.e < total - 0.05);
  const segs = [];
  let start = 0, from = 0;
  for (let k = 0; k < ends.length - 1; k++) {
    let best = -1, bd = Infinity;
    for (let j = from; j < sil.length; j++) {
      const d = Math.abs((sil[j].s + sil[j].e) / 2 - ends[k]) - 0.3 * (sil[j].e - sil[j].s); // prefer longer pauses nearby
      if (d < bd) { bd = d; best = j; }
    }
    if (best < 0) return null;
    segs.push([start, sil[best].s + 0.08]);
    start = Math.max(0, sil[best].e - 0.08);
    from = best + 1;
  }
  segs.push([start, total]);
  return segs;
}

const TRIM ='silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse';
function cut(wav, [a, b], dest) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', a.toFixed(3), '-to', b.toFixed(3), '-i', wav, '-af', TRIM, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '40k', dest]);
}

// ---- record, character by character
const byWho = {};
for (const l of todo) (byWho[l.who] = byWho[l.who] || []).push(l);
for (const [who, list] of Object.entries(byWho)) {
  const n = Math.ceil(list.length / BATCH);
  const size = Math.ceil(list.length / n);
  for (let i = 0; i < list.length; i += size) {
    const batch = list.slice(i, i + size);
    const wav = join(RAW, `${who}-${i / size + 1}.wav`);
    let model = 'saved take';
    if (!RECUT.includes(who)) {
      const res = await take(who, batch);
      if (!res) { console.error(`SKIPPED ${who} batch ${i / size + 1}: no quota left`); continue; }
      toWav(res.data, res.mime, wav);
      model = res.model;
    }
    const segs = (KEY && (await modelSplit(wav, batch))) || split(wav, batch);
    if (!segs) { console.error(`SPLIT FAILED ${who} batch ${i / size + 1} (kept ${wav})`); continue; }
    batch.forEach((l, k) => {
      cut(wav, segs[k], join(OUT, l.id + '.mp3'));
      const d = segs[k][1] - segs[k][0];
      const odd = d > 0.16 * l.text.length + 2 || d < 0.03 * l.text.length;
      console.log(`${odd ? '??' : 'ok'} ${who} ${d.toFixed(1)}s  ${l.text}`);
    });
    console.log(`-- ${who} batch ${i / size + 1}/${n} via ${model}`);
  }
}

// The game only plays recordings that exist; anything missing falls back to subtitles + chirp.
const have = new Set(readdirSync(OUT).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)));
const ids = all.map((l) => l.id).filter((id) => have.has(id)).sort();
writeFileSync(join(root, 'src', 'voices.js'), `// Generated by dev/voices.mjs. Ids of the recorded lines in audio/voice/.\nexport const VOICES = new Set(${JSON.stringify(ids)});\n`);
console.log(`voices.js: ${ids.length}/${all.length} recorded`);
