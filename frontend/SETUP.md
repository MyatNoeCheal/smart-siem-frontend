# Wiring these files into smart-siem-frontend

Your repo is currently a bare Vite + React + Tailwind scaffold, so these
files are meant to be copied straight in.

## 1. Copy files

Copy this folder's contents into your repo so you end up with:

```
smart-siem-frontend/
  src/
    App.jsx
    main.jsx
    index.css
    pages/
      Jarvis.jsx
      StubPage.jsx
    components/
      AvatarCore.jsx
      ChatPanel.jsx
      SystemPanel.jsx
    lib/
      api.js
      useVoice.js
```

Overwrite your existing `src/App.jsx`, `src/main.jsx`, and `src/index.css`
with these versions (they're small — merge in any Tailwind directives you
already had at the top of `index.css` if you want to keep using Tailwind
elsewhere; the JARVIS page itself is styled with plain CSS in this file
so it doesn't depend on your Tailwind config being any particular shape).

## 2. Install the one new dependency

```bash
npm install react-router-dom
```

## 3. Confirm `index.html` has a mount point

Make sure your `index.html` (Vite's default) has:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

(This is Vite's default scaffold output, so it's almost certainly already there.)

## 4. Run it

You'll need three things running locally, in three terminals:

```bash
# 1. Ollama
ollama serve            # if not already running as a service
ollama pull qwen2.5      # once

# 2. Your FastAPI backend (crp-siem-backend), with assistant.py wired in
#    per backend/WIRE_UP_MAIN.md
uvicorn main:app --reload

# 3. This frontend
npm run dev
```

Open the frontend (Vite will print the localhost URL, usually
http://localhost:5173) — you should land on `/overview`, which renders
the JARVIS page. Type a message or click the mic and try:

- "How many critical alerts are there right now?"
- "Open the threats page"
- "Are any entities escalating right now?"

The right-hand panel's AI Status card pulls live from `/assistant/health`,
so if Ollama isn't running you'll see "offline" there instead of a
mysterious hang when you try to chat.

## Known trade-offs, worth noting in your report

- Only Chrome/Edge (and Chromium-based browsers) reliably support
  `SpeechRecognition`. Safari/Firefox will show voice input as
  unsupported and fall back to typed input — this is a Web Speech API
  limitation, not a bug in this code.
- `navigate_page` currently routes to `StubPage` for every section except
  `/overview` (the JARVIS page itself). That's intentional for this pass:
  it proves the "JARVIS drives the dashboard" interaction end-to-end.
  The next step is either rebuilding your other dashboard tabs as React
  routes here, or pointing `StubPage`/the navigate action at your
  existing `dashboard.html` views instead.
