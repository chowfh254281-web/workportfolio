# Portfolio v1 — artifact clone (snapshot before revamp 2.0)

A static HTML rebuild of the Next.js site in `app/`, made on 29 Oct 2026 and saved on 1 Nov 2026 before starting revamp 2.0.

- `index.html` + `uiux.html`, `graphic.html`, `3d.html`, `photography.html`, `video.html`, `ai.html`
- `site.js` — shared nav, preloader, Lenis smooth scroll, contact bubble, kinetic rows
- `images/` — assets copied from `public/`, file names without spaces; `.mov` converted to `.mp4`; `images/yt/` holds YouTube cover images

Differences from the live site: YouTube and Instagram embeds are replaced by cover images / link cards with "Watch on YouTube" / "View on Instagram" buttons; the missing `hkf.png` tile is left out.

Open locally with any static server, e.g. `python3 -m http.server` inside this folder.
