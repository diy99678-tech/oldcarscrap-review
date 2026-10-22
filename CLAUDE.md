# review-qr — QR review page for oldcarscrap (Indore)

Separate project (own folder, own git). Not part of any other project; do not mix.

- Owner writes Hinglish; reply in Hinglish, short. Discuss first, build after "start".
- Business: oldcarscrap, scrap metal dealer / scrap yard, 4 Chandmari, Et Bhatta, Dhar Rd, Indore 452002.
  Services: old / 15-year cars, accident & broken vehicles, car/bus/truck/heavy scrap, free pickup, RC cancel +
  scrap certificate (CD), instant payment. Google review link: https://g.page/r/CWT614wkHmw0EBE/review
  (place id ChIJcfvQmMX9YjkRZPrXjCQebDQ).
- Decided 22-Oct-2026: no pre-written fake batch. The draft is built from what the customer ticks (stars,
  vehicle, condition, good/bad points), editable, every star rating goes to Google (no review gating).
  Google cannot be prefilled: copy to clipboard + open the review link. Drafts must never state anything the
  customer did not tick (tests enforce it).
- Hindi gender: truck / heavy vehicle are masculine (OPENERS_M), car / bus / gaadi feminine.
- Used texts: SHA-256 of the normalised text, localStorage always, Supabase RPC (`review_is_used`,
  `review_claim`) when configured in `js/config.js`.
- Tests: `node --test tests/*.test.mjs` (Node portable at D:\keshav\tools\node-v24.21.0-win-x64).
- Git author: GitHub noreply, never the personal Gmail.

## Status log
- 2026-10-22 — Built: page, generator, QR stand, Supabase SQL. 5 tests pass. Not hosted yet (waiting for the
  owner's choice of GitHub account / Supabase).
