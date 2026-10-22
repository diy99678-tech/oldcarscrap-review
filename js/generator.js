// Builds one review draft from what the customer ticked. Pure function of (input, config, rng),
// so tests can run it with a seeded rng.
import {
  VEHICLE, OPENERS, OPENERS_M, BIZ_LINES, GOOD, BAD, BUT, JOIN, CLOSERS, GENERAL, SPELLINGS, EMOJI,
} from "./phrases.js";

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const chance = (rng, p) => rng() < p;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// "Rate sahi" -> "rate sahi", but "RC cancel" stays.
const uncap = (s) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function toneOf(stars) {
  return stars >= 4 ? "pos" : stars === 3 ? "mid" : "neg";
}

/**
 * input: { stars 1-5, vehicle: car|truck|bus|heavy, conditions: [old15|accident|broken],
 *          good: [keys of GOOD], bad: [keys of BAD], model: "" }
 * returns { text, parts: [{ kind, key, tone }] }
 */
export function generate(input, cfg, rng = Math.random) {
  const stars = Math.min(5, Math.max(1, input.stars | 0));
  const tone = toneOf(stars);
  const vehicle = VEHICLE[input.vehicle] ? input.vehicle : "car";
  const model = (input.model || "").trim().slice(0, 40);
  const good = tone === "neg" ? [] : (input.good || []).filter((k) => GOOD[k]);
  const bad = tone === "pos" ? [] : (input.bad || []).filter((k) => BAD[k]);
  const conditions = (input.conditions || []).filter((k) => OPENERS[k]);

  // The first mention may be the model ("meri Maruti 800"), later ones generic words.
  let mentions = 0;
  const biz = pick(rng, cfg.nameForms);
  const fill = (s) =>
    s
      .replace(/\{gaadi\}/g, () => {
        mentions++;
        if (mentions === 1 && model && chance(rng, 0.75)) return model;
        return pick(rng, VEHICLE[vehicle].words);
      })
      .replace(/\{vahan\}/g, () => {
        mentions++;
        return model && chance(rng, 0.75) ? model : VEHICLE[vehicle].words[0];
      })
      .replace(/\{biz\}/g, () => biz)
      .replace(/\{place\}/g, () => pick(rng, cfg.places));

  const parts = [];
  const add = (kind, key, t, text) => parts.push({ kind, key, tone: t, text: fill(text) });

  const hasPoints = good.length + bad.length > 0;
  if (conditions.length || chance(rng, hasPoints ? 0.6 : 0.85)) {
    const key = conditions.length ? pick(rng, conditions) : "plain";
    add("opener", key, "any", pick(rng, (VEHICLE[vehicle].masc ? OPENERS_M : OPENERS)[key]));
  }
  if (!parts.some((p) => p.text.includes(biz)) && chance(rng, 0.2)) add("biz", "biz", "any", pick(rng, BIZ_LINES));

  for (const k of shuffle(rng, good)) add("good", k, "pos", pick(rng, GOOD[k]));
  let firstBad = true;
  for (const k of shuffle(rng, bad)) {
    let s = pick(rng, BAD[k]);
    if (tone === "mid" && good.length && firstBad) s = `${pick(rng, BUT)} ${s}`;
    firstBad = false;
    add("bad", k, "neg", s);
  }
  if (!hasPoints) {
    const pool = shuffle(rng, GENERAL[tone]);
    // Nothing ticked: two general lines, so short reviews do not keep repeating.
    add("general", tone, tone, pool[0]);
    add("general", tone, tone, pool[1]);
  }
  if (chance(rng, parts.length < 2 ? 1 : 0.8)) add("closer", String(stars), tone, pick(rng, CLOSERS[stars]));

  // Sentences: occasionally fuse two neighbouring points into one.
  const sentences = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i], q = parts[i + 1];
    if (q && p.kind === q.kind && (p.kind === "good" || p.kind === "bad") && chance(rng, 0.35)) {
      sentences.push(p.text + pick(rng, JOIN) + q.text);
      i++;
    } else sentences.push(p.text);
  }

  return { text: style(sentences, stars, rng), parts: parts.map(({ kind, key, tone: t }) => ({ kind, key, tone: t })) };
}

// One "writer" per review: spelling habits, punctuation, capitals, emoji.
function style(sentences, stars, rng) {
  const lower = chance(rng, 0.22);
  const mode = pick(rng, ["proper", "proper", "proper", "loose", "loose", "dots", "lines"]);
  const dots = pick(rng, ["..", "...", " ..."]);

  let s = sentences.map((x) => (lower ? x.toLowerCase() : cap(x)));
  if (mode === "proper") {
    s = s.map((x, i) => x + (i === s.length - 1 && stars >= 4 && chance(rng, 0.35) ? "!" : "."));
    s = s.join(" ");
  } else if (mode === "loose") {
    // A comma joins two sentences into one, so the next one starts small.
    let out = s[0];
    for (let i = 1; i < s.length; i++) {
      const comma = i < s.length - 1 && chance(rng, 0.25);
      out += comma ? ", " + uncap(s[i]) : ". " + s[i];
    }
    s = out;
  } else if (mode === "dots") {
    s = s.join(dots + " ") + (chance(rng, 0.5) ? dots.trim() : "");
  } else {
    s = s.join("\n");
  }

  for (const [word, forms] of Object.entries(SPELLINGS)) {
    const form = pick(rng, forms);
    s = s.replace(new RegExp(`\\b${word}\\b`, "gi"), (m) => (m[0] === m[0].toUpperCase() ? cap(form) : form));
  }
  if (stars >= 4 && chance(rng, 0.12)) s += " " + pick(rng, EMOJI);
  return s;
}

// Same text with different spacing/case/punctuation counts as the same text.
export function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, " ").trim();
}

export async function hashText(text) {
  const data = new TextEncoder().encode(normalize(text));
  // crypto.subtle exists only on https/localhost; a plain-http test on the LAN gets FNV-1a.
  if (!globalThis.crypto?.subtle) {
    let h = 0x811c9dc5;
    for (const b of data) h = Math.imul(h ^ b, 0x01000193) >>> 0;
    return "fnv" + h.toString(16).padStart(8, "0");
  }
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
