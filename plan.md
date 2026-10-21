# Pinnacle Design Studio — Architectural Exhibition Refinement

## Product and constraints

Continue the React/Vite static site and preserve approved copy, statistics, project specifications, existing images, logo, palette, and the no-enquiry decision. Do not invent founder biographies, roles, or portrait imagery. Keep the five founders equal—Vijay Williams plus four editable placeholders—until approved details are supplied. Retain the Vercel static-build configuration.

## Art direction

The site remains an **architectural after-dark exhibition**: dark editorial space, oversized room photography, warm material light, fine drafting rules, and the Pinnacle Datum (a horizontal line meeting a rising diagonal). Maintain black, charcoal, bronze, cream and the existing gold; do not add a dominant color. Keep Playfair Display for expressive headings and Outfit for navigation and body copy.

## Page refinements

- **Hero:** retain its current asymmetric composition. Improve the backdrop with low-contrast parametric contour rings, warmer atmospheric lighting, and Vanta NET’s denser short-span node field. Keep the network confined behind the text side so it does not compete with the room photograph. Use a CSS fallback and respect reduced motion/mobile performance.
- **Founders:** keep the sample’s centered eyebrow/title/instruction, one rounded `896 × 600px` near-black canvas stage, lower-left identity and lower-right circular next arrow. The canvas is the visual object, not a card gallery: build one sculptural architectural globe with subtle latitude/longitude etching, one shared orbit, and five identical spatial markers. Selection advances a marker to the same front point and gives it a restrained warm highlight; marker identity is navigation state, never rank. Keep only Vijay Williams plus four editable placeholders and the existing “Founder” label—no invented roles, biographies, portraits or extra card copy. Support drag/swipe, stage-only wheel, Arrow/Home/End, visible focus and reduced motion.
- **Disciplines:** replace the empty row treatment with three illustrated spatial-study cards. Give each a large numbered index, a bespoke architectural line drawing, generous title scale, and readable full-width description. Preserve the existing three descriptions verbatim. Arrange three across on wide screens and vertically on phones.
- Keep the existing natural-scroll, photo-led projects, native project dialog, equal accessible controls, and section copy.

## Motion and implementation

Use GSAP/SplitText and ScrollTrigger for the existing hero reveals, project-image masks, stats and modal, plus discipline-drawing strokes and the founders-stage entrance. Use existing Three.js lazily for the founders canvas and GSAP for user-triggered orbit rotation only; freeze in-flight motion at gesture start, snap to the nearest founder on release, and do not auto-spin. Keep Lenis synchronized to GSAP while preventing page smoothing from hijacking wheel interaction inside the stage; do not capture page scrolling elsewhere or pin the portfolio. Vanta NET remains hero-only. Keep semantic controls and an interactive SVG fallback that follows rotation if WebGL is unavailable or lost. Reduced-motion mode shows the same scene and selection without interpolation, and project-dialog entrance/exit animations remain skipped.

## Project structure

- `src/App.jsx`: page sections, project dialog, and discipline elevation SVGs.
- `src/components/FounderRegister.jsx`: lazy Three.js architectural globe, five equal orbital markers, static SVG fallback, accessible founder selection, drag/wheel/touch and keyboard navigation.
- `src/components/VantaBackdrop.jsx`: optional hero network and its fallback.
- `src/hooks/useMotion.js`: Lenis/GSAP synchronization and page choreography.
- `src/styles.css`: responsive editorial system, sample-led founder canvas frame and fallback, discipline cards, and motion-safe overrides.
- `src/content.js`: approved copy and replaceable founder labels.
- `public/images/`, `vercel.json`, `vite.config.js`, `package.json`: current photos and static hosting setup.

## Delivery

A GitHub push is not proof of Vercel deployment. The user-facing Vercel domain previously served an older bundle and its project binding was not visible in this session; report deployment status based on an actual live check. Replace assets and founder details only when supplied and approved.


## Interaction refinement requested 2026-10-21

- **Founders:** the original grid was rejected; after the sample-style card experiment was also rejected, the current design uses the sample’s centered title/instruction, wide rounded single stage, lower-left active identity, and lower-right circular arrow. One architectural globe and five equal rotating markers replace the card gallery. No role hierarchy, invented profile facts, or extra card copy. Support pointer drag/touch swipe, stage-contained wheel, Arrow/Home/End navigation, visible keyboard focus, reduced motion, WebGL context loss, and interactive SVG fallback.
- **Disciplines:** add a low-density, decorative gold particle field that drifts behind the three cards and pauses when the section is offscreen. Reveal a more detailed blueprint drawing on card hover or keyboard focus; provide an explicit, labeled toggle for touch devices. Keep the approved card descriptions readable and unchanged. Reduced-motion mode uses a static blueprint and no moving particles.
- Keep the existing GSAP/ScrollTrigger/Lenis setup and use the project’s existing Three.js dependency only for the lazy-loaded founders globe; do not add other dependencies for these interactions.
