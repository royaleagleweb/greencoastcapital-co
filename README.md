# Green Coast Capital — greencoastcapital.co

Static marketing website for Green Coast Capital. Pure HTML/CSS/JS — **no build step**.
Deploys to Cloudflare Pages (or any static host) by serving this folder as the site root.

## Structure
- `index.html` — home (site root)
- 33 additional pages: about, services + 7 service pages, industries + 16 industry pages, blog, article, faq, contact, apply, terms, privacy
- `404.html` — branded not-found page (served automatically by Cloudflare Pages)
- `styles.css`, `main.js` — shared stylesheet and scripts
- `images/` — local photography (no external image URLs)

## Deploy (Cloudflare Pages)
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `/`

## Notes
- All forms are front-end only and do **not** submit anywhere yet (add a form backend to capture leads).
- All companies, people, stats and testimonials are fictional, for demonstration.
