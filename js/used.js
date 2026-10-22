// Remembers which review texts were already given out, so nobody gets the same text twice.
// Always on this phone (localStorage); on every phone when Supabase is configured (see supabase.sql).
import { CONFIG } from "./config.js";

const LOCAL_KEY = "review-used-v1";
const remote = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseKey);

function localSet() {
  try { return new Set(JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]")); } catch { return new Set(); }
}
function saveLocal(set) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify([...set].slice(-500))); } catch { /* private mode */ }
}

function rpc(name, body, opts = {}) {
  const key = CONFIG.supabaseKey;
  const headers = { "Content-Type": "application/json", apikey: key };
  // Legacy anon keys are JWTs and also go in Authorization; new sb_publishable_ keys only in apikey.
  if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`;
  return fetch(`${CONFIG.supabaseUrl.replace(/\/+$/, "")}/rest/v1/rpc/${name}`, {
    method: "POST", headers, body: JSON.stringify(body), ...opts,
  });
}

/** true when this text was already handed out (here, or anywhere when Supabase is on). */
export async function isUsed(hash) {
  if (localSet().has(hash)) return true;
  if (!remote) return false;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const r = await rpc("review_is_used", { h: hash }, { signal: ctl.signal });
    clearTimeout(t);
    return r.ok ? (await r.json()) === true : false;
  } catch {
    return false; // offline or slow: never block the customer
  }
}

/** Marks the text as used. keepalive lets the request finish while the page moves to Google. */
export function markUsed(hash, stars) {
  const set = localSet();
  set.add(hash);
  saveLocal(set);
  if (remote) rpc("review_claim", { h: hash, s: stars }, { keepalive: true }).catch(() => {});
}
