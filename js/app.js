import { CONFIG } from "./config.js";
import { generate, hashText, toneOf } from "./generator.js";
import { isUsed, markUsed } from "./used.js";

const $ = (s) => document.querySelector(s);
const LABELS = { 1: "Bahut kharab 😞", 2: "Accha nahi 😕", 3: "Theek-thaak 😐", 4: "Accha 🙂", 5: "Bahut badhiya! 🤩" };
const REDIRECT_MS = 2600;

const state = { stars: 0, vehicle: "car", conditions: [], good: [], bad: [], model: "" };
let edited = false; // the customer typed in the box: never overwrite it silently
let seq = 0;

$("#biz-name").textContent = CONFIG.name;
$("#biz-tag").textContent = CONFIG.tagline;
$("#biz-addr").textContent = `📍 ${CONFIG.address}`;
$("#open-google").href = CONFIG.reviewUrl;
$("#star-label").classList.add("idle");
document.title = `${CONFIG.name} · Review`;

// ---------- steps + reveal ----------
const stepEls = [...document.querySelectorAll("#steps li")];
function setStep(n) {
  stepEls.forEach((li, i) => {
    li.classList.toggle("on", i === n - 1);
    li.classList.toggle("done", i < n - 1);
  });
}
function reveal(el) {
  if (!el.hidden) return false;
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
  return true;
}
const onScreen = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) setStep(e.target.id === "draft-card" ? 3 : e.target.id === "details" ? 2 : 1);
}, { threshold: 0.6 });
["#rate-card", "#details", "#draft-card"].forEach((s) => onScreen.observe($(s)));

// ---------- stars ----------
const starBtns = [...document.querySelectorAll("#stars button")];
starBtns.forEach((b) =>
  b.addEventListener("click", () => {
    state.stars = +b.dataset.v;
    starBtns.forEach((x, i) => {
      const on = +x.dataset.v <= state.stars;
      x.classList.remove("lit");
      if (on) {
        x.style.setProperty("--i", i);
        void x.offsetWidth; // restart the pop animation
        x.classList.add("lit");
      }
      x.setAttribute("aria-checked", String(+x.dataset.v === state.stars));
    });
    const label = $("#star-label");
    label.classList.remove("idle");
    label.innerHTML = `<span>${LABELS[state.stars]}</span>`;
    if (navigator.vibrate) navigator.vibrate(12);
    $("#how-stars").textContent = state.stars;
    $("#mini-stars").innerHTML = "★".repeat(state.stars) + `<span class="off">${"★".repeat(5 - state.stars)}</span>`;

    const tone = toneOf(state.stars);
    $("#good-wrap").hidden = tone === "neg";
    $("#bad-wrap").hidden = tone === "pos";
    if (tone === "neg") clearGroup("good");
    if (tone === "pos") clearGroup("bad");

    const first = reveal($("#details"));
    reveal($("#draft-card"));
    if (!edited) refresh(true);
    if (first) setTimeout(() => $("#details").scrollIntoView({ behavior: "smooth", block: "start" }), 350);
  })
);

// ---------- chips ----------
document.querySelectorAll(".chips").forEach((group) => {
  const name = group.dataset.group;
  const single = group.hasAttribute("data-single");
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    if (single) {
      group.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
      state[name] = chip.dataset.k;
    } else {
      chip.classList.toggle("on");
      state[name] = [...group.querySelectorAll(".chip.on")].map((c) => c.dataset.k);
    }
    if (!edited) refresh(false);
  });
});

function clearGroup(name) {
  document.querySelectorAll(`[data-group="${name}"] .chip`).forEach((c) => c.classList.remove("on"));
  state[name] = [];
}

let modelTimer;
$("#model").addEventListener("input", (e) => {
  state.model = e.target.value;
  clearTimeout(modelTimer);
  if (!edited) modelTimer = setTimeout(() => refresh(false), 450);
});

// ---------- draft ----------
const box = $("#review");
const pill = $("#draft-pill");
const grow = () => { box.style.height = "auto"; box.style.height = `${box.scrollHeight + 2}px`; };
box.addEventListener("input", () => { edited = true; stopTyping(); pill.textContent = "Aapka text ✓"; grow(); });

$("#again").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.remove("spin"); void btn.offsetWidth; btn.classList.add("spin");
  edited = false;
  refresh(true);
});
$("#own").addEventListener("click", () => {
  edited = true;
  stopTyping();
  box.value = "";
  grow();
  box.placeholder = "Apne shabdon me likho...";
  pill.textContent = "Aapka text";
  box.focus();
});

// A fresh draft that was never handed out before.
async function refresh(animate) {
  if (!state.stars) return;
  const my = ++seq;
  let text = "";
  for (let i = 0; i < 8; i++) {
    text = generate(state, CONFIG).text;
    if (!(await isUsed(await hashText(text)))) break;
  }
  if (my !== seq || edited) return;
  pill.textContent = "Badal sakte ho";
  if (animate) typeOut(text); else { stopTyping(); box.value = text; grow(); }
}

// Typewriter: fast, word by word, and the box is usable at once.
let typing = 0;
function typeOut(text) {
  stopTyping();
  const words = text.split(/(\s+)/);
  let i = 0;
  box.value = "";
  box.parentElement.classList.add("typing");
  typing = setInterval(() => {
    box.value += words.slice(i, i + 2).join("");
    i += 2;
    grow();
    if (i >= words.length) stopTyping();
  }, 28);
  box.dataset.full = text;
}
function stopTyping() {
  if (!typing) return;
  clearInterval(typing);
  typing = 0;
  if (box.dataset.full && !edited) box.value = box.dataset.full;
  box.parentElement.classList.remove("typing");
  grow();
}

// ---------- copy, remember, go to Google ----------
let redirectTimer;
$("#go").addEventListener("click", async () => {
  if (!state.stars) return;
  stopTyping();
  const text = box.value.trim();
  let copied = false;
  if (text) {
    copied = await copy(text);
    markUsed(await hashText(text), state.stars);
  }
  $("#sheet-title").textContent = copied ? "Review copy ho gaya!" : "Ab Google pe review likho";
  // Copy blocked by the browser: show the text to copy by hand, and do not rush off to Google.
  $("#manual").hidden = copied || !text;
  $("#manual-text").textContent = text;
  openSheet(copied || !text);
});

function openSheet(autoGo) {
  $("#sheet").hidden = false;
  const bar = $("#bar");
  bar.parentElement.hidden = !autoGo;
  clearTimeout(redirectTimer);
  if (!autoGo) return;
  bar.classList.remove("run"); void bar.offsetWidth;
  bar.style.setProperty("--wait", `${REDIRECT_MS}ms`);
  bar.classList.add("run");
  redirectTimer = setTimeout(() => { location.href = CONFIG.reviewUrl; }, REDIRECT_MS);
}
$("#sheet-close").addEventListener("click", () => {
  clearTimeout(redirectTimer);
  $("#sheet").hidden = true;
});

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Old browsers / plain http: select a hidden textarea and copy.
    const t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { /* ignore */ }
    t.remove();
    return ok;
  }
}
