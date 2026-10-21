# Pinnacle Design Studio — Architectural Exhibition Refinement

## Product and constraints

Continue the React/Vite static site and preserve approved copy, statistics, project specifications, existing images, logo, palette, and the no-enquiry decision. Do not invent founder biographies, roles, or portrait imagery. Keep the five founders equal—Vijay Williams plus four editable placeholders—until approved details are supplied. Retain the Vercel static-build configuration.

## Art direction

The site remains an **architectural after-dark exhibition**: dark editorial space, oversized room photography, warm material light, fine drafting rules, and the Pinnacle Datum (a horizontal line meeting a rising diagonal). Maintain black, charcoal, bronze, cream and the existing gold; do not add a dominant color. Keep Playfair Display for expressive headings and Outfit for navigation and body copy.

## Page refinements

- **Hero:** retain its current asymmetric composition. Improve the backdrop with low-contrast parametric contour rings, warmer atmospheric lighting, and Vanta NET’s denser short-span node field. Keep the network confined behind the text side so it does not compete with the room photograph. Use a CSS fallback and respect reduced motion/mobile performance.
- **Founders:** match the sample’s editorial shell: centered “Our Founders” eyebrow, centered “The Visionaries Behind Pinnacle” title and its original drag/scroll instruction, followed by one rounded `896 × 600px` desktop stage. Improvise only inside this section: use five identically structured architectural study cards around a restrained wireframe sphere; show the current founder at lower left and a circular next arrow at lower right. Every founder gets the same front position and one shared “Founder” label; the carousel index is navigation state, not rank. Keep Vijay Williams plus four editable placeholders; invent no roles, biographies, portraits, or extra copy. Support drag/swipe, stage-only wheel, Arrow/Home/End keys, visible focus and reduced motion.
- **Disciplines:** replace the empty row treatment with three illustrated spatial-study cards. Give each a large numbered index, a bespoke architectural line drawing, generous title scale, and readable full-width description. Preserve the existing three descriptions verbatim. Arrange three across on wide screens and vertically on phones.
- Keep the existing natural-scroll, photo-led projects, native project dialog, equal accessible controls, and section copy.

## Motion and implementation

Use GSAP/SplitText and ScrollTrigger for the existing hero reveals, project-image masks, stats and modal, plus discipline-drawing strokes and a restrained entrance for the founders stage. Use GSAP for user-triggered carousel rotation only; freeze an in-flight track tween at gesture start and snap back on a no-drag release; do not auto-spin. Keep Lenis synchronized to GSAP, but prevent its page smoothing from hijacking wheel interaction inside the founder stage; do not capture page scrolling elsewhere or pin the portfolio. Vanta NET stays hero-only and lazy loaded; the founder carousel remains DOM/SVG/CSS with no new 3D dependency. Reduced-motion styles must not hide content or prevent founder selection, and project-dialog entrance/exit animations are skipped.

## Project structure

- `src/App.jsx`: page sections, project dialog, and discipline elevation SVGs.
- `src/components/FounderRegister.jsx`: five equal founder carousel cards, line drawings, accessible selection state, drag/wheel/touch and keyboard navigation.
- `src/components/VantaBackdrop.jsx`: optional hero network and its fallback.
- `src/hooks/useMotion.js`: Lenis/GSAP synchronization and page choreography.
- `src/styles.css`: responsive editorial system, sample-led founder carousel stage, discipline cards, and motion-safe overrides.
- `src/content.js`: approved copy and replaceable founder labels.
- `public/images/`, `vercel.json`, `vite.config.js`, `package.json`: current photos and static hosting setup.

## Delivery

A GitHub push is not proof of Vercel deployment. The user-facing Vercel domain previously served an older bundle and its project binding was not visible in this session; report deployment status based on an actual live check. Replace assets and founder details only when supplied and approved.


## Interaction refinement requested 2026-10-21

- **Founders:** replace the five-column register after the user rejected it. Match the sample’s centered title/instruction, wide rounded single-stage carousel, lower-left active identity and lower-right circular arrow. Build a structured five-card 3D carousel with equal peers, no role hierarchy, no invented profile facts, and the existing name/placeholders; allow pointer drag/swipe, wheel only inside the stage, arrow/Home/End keyboard navigation, focus visibility and reduced-motion use.
- **Disciplines:** add a low-density, decorative gold particle field that drifts behind the three cards and pauses when the section is offscreen. Reveal a more detailed blueprint drawing on card hover or keyboard focus; provide an explicit, labeled toggle for touch devices. Keep the approved card descriptions readable and unchanged. Reduced-motion mode uses a static blueprint and no moving particles.
- Reuse the existing GSAP/ScrollTrigger/Lenis setup and native React/SVG/CSS. Do not add Three.js or another dependency for these bounded interactions.
