# Release checklist

## Completed
- [x] Preserve the approved hero, philosophy, project descriptions/specifications, disciplines content, statistics, and original core palette.
- [x] Reuse the current three sample project photos as replaceable temporary assets; reference all images from the shared content model.
- [x] Show exactly five founders: Vijay Williams and four editable placeholders; no sample-fictional names, invented portraits, biographies, or differentiated titles.
- [x] Give all five founder panels equal dimensions and type scale; leave every panel unselected on first load.
- [x] Build the responsive studio, works, disciplines, and founders page; exclude the inquiry/contact form and link.
- [x] Implement keyboard/touch-friendly project details with a native modal dialog and equal founder selection controls.
- [x] Honor reduced-motion settings; keep content visible without motion; defer the optional Vanta effect and skip it for narrow screens.
- [x] Include GSAP/ScrollTrigger, Lenis, Vanta.js, Vite, a lockfile, the one-page route manifest, and Vercel build/output configuration.
- [x] Pass `npm ci`, `npm run build`, `npm audit --omit=dev`, static content/config checks, production browser interaction checks, and Chromium screenshots at 390px and 1280px.

## Pending user inputs / external confirmation
- [ ] Replace the three current sample images with the three new images when provided.
- [ ] Replace the four founder placeholders and add any approved founder details once confirmed.
- [ ] Confirm that the external Vercel project has completed its deployment after the GitHub push; deployment status is outside this repository build check.
