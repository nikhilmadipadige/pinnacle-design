# Pinnacle Design Studio — Architectural Exhibition Refinement

## Product and constraints

Continue the React/Vite static site and preserve approved copy, statistics, project specifications, existing images, logo, and palette. Add the requested enquiry form as a client-side prototype only: no endpoint, network request, local storage, or server submission. Do not invent founder biographies, roles, or portrait imagery. Keep the five founders equal—Vijay Williams plus four editable placeholders—until approved details are supplied. Retain the Vercel static-build configuration.

## Art direction

The site remains an **architectural after-dark exhibition**: dark editorial space, oversized room photography, warm material light, fine drafting rules, and the Pinnacle Datum (a horizontal line meeting a rising diagonal). Maintain black, charcoal, bronze, cream and the existing gold; do not add a dominant color. Keep Playfair Display for expressive headings and Outfit for navigation and body copy.

## Page refinements

- **Hero:** retain its current asymmetric composition. Improve the backdrop with low-contrast parametric contour rings, warmer atmospheric lighting, and Vanta NET’s denser short-span node field. Keep the network confined behind the text side so it does not compete with the room photograph. Use a CSS fallback and respect reduced motion/mobile performance.
- **Founders:** match the sample recording’s centered eyebrow/title/instruction, rounded near-black stage, lower-left identity, and lower-right circular arrow. The artwork is image-led, not celestial: one crisp grayscale architectural-photo circle remains large at center, with only the nearest two smaller image circles slipping partly into opposing corners. The other two discs fade fully behind the visual plane, then re-enter as the cluster rotates. Use the existing project renders as anonymous architecture artwork (not assigned to a person), a plain black panel, and a cool cyan/blue glow around its outside edge. No sphere, latitude/longitude lines, visible orbital rings, metallic markers, star field, card stack, added labels or role hierarchy. Keep Vijay Williams plus four editable placeholders and the existing “Founder” label. Support drag/swipe, stage-only wheel, Arrow/Home/End, visible focus, context-loss fallback, and reduced motion.
- **Enquiry:** add one distinct studio-enquiry section between founders and footer. Balance a muted architectural image panel with a clear, compact form; use the existing dark, bronze and cream system, large editorial typography, and restrained drafting details. Provide name, email, project type, and project notes. Explain beside the submit control that this is a prototype and submissions are neither sent nor stored. Prevent the browser’s default submission; add no backend, analytics, network request, local storage or email integration. The submit response is a small local-only status message.
- **Year founded:** display the existing statistic as `2023`, without grouping it as `2,023`; keep the other animated stats as they are.
- **Disciplines:** replace the empty row treatment with three illustrated spatial-study cards. Give each a large numbered index, a bespoke architectural line drawing, generous title scale, and readable full-width description. Preserve the existing three descriptions verbatim. Arrange three across on wide screens and vertically on phones.
- Keep the existing natural-scroll, photo-led projects, native project dialog, equal accessible controls, and section copy.

## Motion and implementation

Use GSAP/SplitText and ScrollTrigger for the existing hero reveals, project-image masks, stats and modal, plus discipline-drawing strokes and the founders-stage entrance. Use existing Three.js lazily for the spatial photo-disc composition and GSAP for user-triggered rotation only; freeze in-flight motion at gesture start, snap to the nearest founder on release, and do not auto-spin. Keep Lenis synchronized to GSAP while preventing page smoothing from hijacking wheel interaction inside the stage; do not capture page scrolling elsewhere or pin the portfolio. Vanta NET remains hero-only. Keep semantic controls and an interactive SVG photo-disc fallback that follows rotation if WebGL is unavailable or lost. Reduced-motion mode shows the same scene and selection without interpolation, and project-dialog entrance/exit animations remain skipped.

## Project structure

- `src/App.jsx`: page sections, project dialog, discipline elevation SVGs, and the client-only enquiry form.
- `src/components/FounderRegister.jsx`: lazy Three.js depth-positioned architectural photo discs, five equal selection states, monochrome SVG fallback, drag/wheel/touch and keyboard navigation.
- `src/components/VantaBackdrop.jsx`: optional hero network and its fallback.
- `src/hooks/useMotion.js`: Lenis/GSAP synchronization and page choreography.
- `src/styles.css`: responsive editorial system, sample-led founder canvas frame and fallback, discipline cards, and motion-safe overrides.
- `src/content.js`: approved copy and replaceable founder labels.
- `public/images/`, `vercel.json`, `vite.config.js`, `package.json`: current photos and static hosting setup.

## Delivery

The current sample-led photo-disc correction, restrained blurred architectural ambience, prototype-only enquiry form, neutral founder navigation instruction, and ungrouped `2023` counter are implemented and production-build verified. The previous pushed founder version at `a4b4268` was the rejected globe variant. Push this revision, then compare the public Vercel bundle with the current build; if it remains stale, trigger a deployment from the Vercel project. Replace project media and founder details only when supplied and approved.


## Interaction refinement requested 2026-10-21

- **Founders:** prior grid, visible cards, and the globe were rejected. The current correction returns to the recording’s one large grayscale architecture disc, two smaller corner-arrival discs, black rounded stage, and cool peripheral glow. Five equal founder selections are still available; the two far discs are visually hidden, not removed from navigation. No role hierarchy, invented profile facts, or extra card copy. Support pointer drag/touch swipe, stage-contained wheel, Arrow/Home/End navigation, visible keyboard focus, reduced motion, WebGL context loss, and interactive SVG fallback.
- **Disciplines:** add a low-density, decorative gold particle field that drifts behind the three cards and pauses when the section is offscreen. Reveal a more detailed blueprint drawing on card hover or keyboard focus; provide an explicit, labeled toggle for touch devices. Keep the approved card descriptions readable and unchanged. Reduced-motion mode uses a static blueprint and no moving particles.
- Keep the existing GSAP/ScrollTrigger/Lenis setup and use the project’s existing Three.js dependency only for the lazy-loaded founders photo-disc motion; do not add other dependencies for these interactions.
