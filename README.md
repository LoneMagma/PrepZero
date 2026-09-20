# PrepZero

**Think on your feet. Say what you mean.**

Practice extempore and impromptu speaking — Read a topic, think for a few seconds, then speak with live transcription and audio recording.

🌐 **Live at** → [prepzero](https://prepzero.pacify.site)

---

## Quick start

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build & deploy

```bash
npm run build          # outputs to dist/

# Vercel (recommended — one command)
npx vercel

# Netlify — drag dist/ to netlify.com/drop
```

---

## Browser support

| Feature            | Chrome | Edge | Safari | Firefox |
|--------------------|:------:|:----:|:------:|:-------:|
| Audio recording    |   ✅   |  ✅  |   ✅   |   ✅    |
| Live transcription |   ✅   |  ✅  | ⚠️ partial | ❌ |
| Session history    |   ✅   |  ✅  |   ✅   |   ✅    |

**Chrome or Edge recommended** — Web Speech API required for live transcription.

---

## Project structure

```
prepzero/
├── index.html              ← Full SEO, OG tags, schema.org, favicon
├── public/
│   ├── favicon.svg         ← P + zero mark, works everywhere
│   ├── site.webmanifest    ← PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            ← Entry (no StrictMode — MediaRecorder compat)
    ├── App.jsx             ← Phase orchestration + IndexedDB persistence
    ├── index.css           ← Dot-grid background, keyframes
    ├── tokens.jsx          ← Design tokens, NavPill, Btn atoms
    ├── topics.js           ← 32 curated topics across 4 categories
    ├── db.js               ← IndexedDB: sessions + audio blobs
    └── phases/
        ├── Home.jsx
        ├── ReadPhase.jsx
        ├── ThinkPhase.jsx
        ├── SpeakPhase.jsx  ← Fixed stop logic (local closure pattern)
        ├── Review.jsx
        ├── WriteMode.jsx
        ├── History.jsx
        └── SettingsPanel.jsx
```

---

## Extending the topic bank

Edit `src/topics.js`:
```js
{ id: 33, text: "Your question here.", cat: "Abstract" }
```
Categories: `Current Affairs` · `Abstract` · `Debate` · `Personal`

---

## Notes

- **Stop button fix**: uses `let active = true` local closure pattern inside `useEffect` — immune to StrictMode double-invoke and stale refs
- **Audio persistence**: blobs stored directly in IndexedDB (native Blob support) — survives page refresh, no base64 overhead
- **No StrictMode**: `main.jsx` intentionally omits it — `MediaRecorder` and `AudioContext` cannot be safely double-invoked
