# Pinnacle Design Studio — Architectural Exhibition Refinement

## Product and constraints

Continue the React/Vite static site and preserve approved copy, statistics, project specifications, existing images, logo, palette, and the no-enquiry decision. Do not invent founder biographies, roles, or portrait imagery. Keep the five founders equal—Vijay Williams plus four editable placeholders—until approved details are supplied. Retain the Vercel static-build configuration.

## Art direction

The site remains an **architectural after-dark exhibition**: dark editorial space, oversized room photography, warm material light, fine drafting rules, and the Pinnacle Datum (a horizontal line meeting a rising diagonal). Maintain black, charcoal, bronze, cream and the existing gold; do not add a dominant color. Keep Playfair Display for expressive headings and Outfit for navigation and body copy.

## Page refinements

- **Hero:** retain its current asymmetric composition. Improve the backdrop with low-contrast parametric contour rings, warmer atmospheric lighting, and Vanta NET’s denser short-span node field. Keep the network confined behind the text side so it does not compete with the room photograph. Use a CSS fallback and respect reduced motion/mobile performance.
- **Founders:** replace the visually unstable 3D floating spheres with an **architectural studio register**: five identically sized selectable panels aligned on a shared datum rail. Each gets the same amount of space and treatment, a bespoke elevation/section line drawing, a numbered index, and the approved founder name or placeholder. The panel drawings vary as abstract geometric studies, not as implied jobs or ranks. No default selection. Support click and arrow/Home/End keyboard selection with clear focus, and one shared selection-status line.
- **Disciplines:** replace the empty row treatment with three illustrated spatial-study cards. Give each a large numbered index, a bespoke architectural line drawing, generous title scale, and readable full-width description. Preserve the existing three descriptions verbatim. Arrange three across on wide screens and vertically on phones.
- Keep the existing natural-scroll, photo-led projects, native project dialog, equal accessible controls, and section copy.

## Motion and implementation

Use GSAP/SplitText and ScrollTrigger for the existing hero reveals, project-image masks, stats, and modal, plus discipline-drawing stroke reveals and a measured stagger for the five founder panels. Lenis remains synchronized to the GSAP ticker/ScrollTrigger; no page-wheel capture or pinned project carousel. Vanta NET stays hero-only and lazy loaded; Three.js is no longer used for the founders roster. Reduced-motion styles must not hide content or prevent founder selection, and project-dialog entrance/exit animations are skipped.

## Project structure

- `src/App.jsx`: page sections, project dialog, and discipline elevation SVGs.
- `src/components/FounderRegister.jsx`: five equal founder panels, line drawings, selection state, and keyboard navigation.
- `src/components/VantaBackdrop.jsx`: optional hero network and its fallback.
- `src/hooks/useMotion.js`: Lenis/GSAP synchronization and page choreography.
- `src/styles.css`: responsive editorial system, founder register, discipline cards, and motion-safe overrides.
- `src/content.js`: approved copy and replaceable founder labels.
- `public/images/`, `vercel.json`, `vite.config.js`, `package.json`: current photos and static hosting setup.

## Delivery

A GitHub push is not proof of Vercel deployment. The user-facing Vercel domain previously served an older bundle and its project binding was not visible in this session; report deployment status based on an actual live check. Replace assets and founder details only when supplied and approved.


## Interaction refinement requested 2026-10-21

- **Founders:** retain five equal-size studio-register panels and no default selection. Use a subtle 18px desktop and 12px narrower-screen stagger with GSAP ScrollTrigger reveals; keep the offset positional so card dimensions and grid tracks stay equal. Selection may lift a panel by 6px without changing its size or layout priority. Keep the existing arrow-key/Home/End controls, center the fifth card on phones, and honor reduced motion.
- **Disciplines:** add a low-density, decorative gold particle field that drifts behind the three cards and pauses when the section is offscreen. Reveal a more detailed blueprint drawing on card hover or keyboard focus; provide an explicit, labeled toggle for touch devices. Keep the approved card descriptions readable and unchanged. Reduced-motion mode uses a static blueprint and no moving particles.
- Reuse the existing GSAP/ScrollTrigger/Lenis setup and native React/SVG/CSS. Do not add Three.js or another dependency for these bounded interactions.
