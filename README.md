# oldcarscrap – QR review page

Customer QR scan karta hai → stars chunta hai → gaadi aur kya accha/bura laga, chips se → page us hisaab se
ek naya Hinglish review draft banata hai (customer badal sakta hai) → **Copy karo aur Google pe review do**
→ text copy hota hai aur Google ka review form khulta hai → customer paste karke post karta hai.

- Plain HTML/CSS/JS, koi build nahi. Business ki details sirf `js/config.js` mein.
- Google review form mein text/stars pehle se bharna possible nahi (Google allow nahi karta), isliye copy + paste.
- Har star rating Google pe hi jaati hai (low star ko rokna = "review gating", Google ki policy ke khilaaf).
- Draft sirf wahi bolta hai jo customer ne chuna (gaadi, halat, points); kuch bhi apni taraf se nahi banata.
- Jo text ek baar copy ho gaya, wo dobara nahi diya jaata: is phone pe hamesha (localStorage), sab phones pe
  jab Supabase on ho (`supabase.sql`). Same choices pe bhi 5000 mein 97%+ drafts alag bante hain (tests).

## Files
| File | Kya |
|---|---|
| `index.html`, `css/style.css`, `js/app.js` | customer wala page |
| `js/config.js` | naam, address, Google review link, Supabase (optional) |
| `js/phrases.js` | sentence pools (Hinglish) |
| `js/generator.js` | draft banane wala engine (seeded rng se testable) |
| `js/used.js` | used text yaad rakhna (local + Supabase) |
| `qr.html` | print karne layak A6 QR stand (link daalo → Print / PDF) |
| `supabase.sql` | optional table + 2 functions |
| `tests/` | `node --test tests/*.test.mjs` |

## Local check
`python -m http.server 8765` (is folder se) → http://127.0.0.1:8765/

## Live karna (free)
1. GitHub pe naya repo, ye folder push → Settings → Pages → branch `main`, folder `/`.
2. Link milega `https://<user>.github.io/<repo>/` → `qr.html` kholo → QR scan karke check → Print / PDF.
3. (Optional) Supabase free project → SQL Editor mein `supabase.sql` → URL + publishable key `js/config.js` mein.
