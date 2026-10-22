import { test } from "node:test";
import assert from "node:assert/strict";
import { generate, mulberry32, normalize, hashText } from "../js/generator.js";
import { CONFIG } from "../js/config.js";
import { GOOD, BAD } from "../js/phrases.js";

const ALL_GOOD = Object.keys(GOOD);
const ALL_BAD = Object.keys(BAD);

function many(input, n, seed = 1) {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () => generate(input, CONFIG, rng));
}

test("no placeholder or 'undefined' ever leaks", () => {
  const inputs = [
    { stars: 5, vehicle: "car", conditions: ["old15"], good: ALL_GOOD, model: "Maruti 800" },
    { stars: 4, vehicle: "truck", conditions: [], good: ["rate"] },
    { stars: 3, vehicle: "bus", conditions: ["accident", "broken"], good: ["pickup"], bad: ["payment_late"] },
    { stars: 1, vehicle: "heavy", bad: ALL_BAD },
    { stars: 2 },
  ];
  for (const input of inputs)
    for (const r of many(input, 3000)) {
      assert.ok(!/[{}]|undefined|null|NaN/.test(r.text), r.text);
      assert.ok(r.text.trim().length >= 15, r.text);
    }
});

test("only the points the customer ticked appear", () => {
  for (const r of many({ stars: 5, vehicle: "car", good: ["pickup", "payment"], bad: ALL_BAD }, 3000)) {
    for (const p of r.parts) {
      assert.notEqual(p.kind, "bad", "a 5-star review must not carry complaints");
      if (p.kind === "good") assert.ok(["pickup", "payment"].includes(p.key));
    }
  }
  for (const r of many({ stars: 1, good: ALL_GOOD, bad: ["calls"] }, 3000)) {
    for (const p of r.parts) {
      assert.notEqual(p.kind, "good", "a 1-star review must not carry praise");
      if (p.kind === "bad") assert.equal(p.key, "calls");
      if (p.kind === "closer" || p.kind === "general") assert.notEqual(p.tone, "pos");
    }
  }
});

test("conditions not ticked are never claimed", () => {
  for (const r of many({ stars: 5, vehicle: "car", conditions: ["accident"], good: ["rate"] }, 3000)) {
    const opener = r.parts.find((p) => p.kind === "opener");
    if (opener) assert.equal(opener.key, "accident");
    assert.ok(!/15 saal/.test(r.text), r.text);
  }
});

test("drafts hardly ever repeat, even for identical choices", () => {
  const cases = [
    { stars: 5, vehicle: "car", conditions: ["old15"], good: ["pickup", "rate", "payment", "paperwork"] },
    { stars: 5, vehicle: "car" },
  ];
  for (const input of cases) {
    const n = 5000;
    const seen = new Set(many(input, n, 7).map((r) => normalize(r.text)));
    assert.ok(seen.size / n > 0.97, `${seen.size} distinct of ${n} for ${JSON.stringify(input)}`);
  }
});

test("hash ignores case, spacing and punctuation", async () => {
  assert.equal(await hashText("Rate sahi diya. Thanks!"), await hashText("rate  sahi diya thanks"));
  assert.notEqual(await hashText("rate sahi diya"), await hashText("rate sahi mila"));
});
