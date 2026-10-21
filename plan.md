# Pinnacle Design Studio — Architectural Exhibition Revision

## Product and implementation

This is a visual and interaction overhaul, not a copy rewrite. Preserve the approved content, statistics, project descriptions/specifications, existing logo, palette, and no-enquiry decision. Do not add contact/lead-generation content, invent founder biographies/roles, or use project imagery as founder portraits. Keep five equal founders: Vijay Williams plus four editable name placeholders. Continue using the three existing interior photographs until the client sends replacements.

Keep the static React + Vite site and Vercel build configuration. Use the existing libraries for clear, visible purposes: Lenis owns smooth page scrolling and is synchronized with GSAP's ticker and ScrollTrigger; GSAP/SplitText/ScrollTrigger choreographs hero typography, photo apertures, project reveals, counters, and section entrances; Vanta.js provides a distinct interactive architectural network field only in the hero; Three.js creates a sculptural five-node founders orbit. Do not add duplicate animation libraries.

## Design movement

**Architectural after-dark exhibition:** related to the reference through the dark luxury atmosphere, warm metallic light, and orbital founder interaction, but authored as Pinnacle rather than a copy of its layout. Large interiors should carry the visual weight. The page should feel like entering a private architectural gallery, not operating a dashboard, reading a generic agency template, or being forced through a scroll-jacked carousel.

**Pinnacle Datum:** use one thin, rising diagonal meeting a horizontal baseline, derived from the existing geometric mark. Carry it sparingly through the hero photo aperture, one project progress rule, discipline dividers, and the founders' orbital axis. This is the sole recurring graphic signature; avoid extra grids, micro-labels, and redundant rings/corner frames.

**Palette:** keep `#121212` black, `#191816` charcoal, `#24221f` bronze, `#f5f3ef` cream, `#c5a880` gold, and only the existing subdued blue-green reflection. Do not introduce a new dominant hue.

**Typography:** retain Playfair Display for expressive headings and Outfit for navigation/body/metadata. Increase scale and negative space; use fewer, larger editorial gestures.

## Page composition

1. **Header:** compact translucent navigation with the existing four sections only: Studio, Works, Disciplines, Founders. Keep the brand mark and EST. 2023. No Contact or Inquire.
2. **Hero:** asymmetric, near-full-height composition. Preserve the exact two-line headline, description, and approved links. Make the lounge image a large right-hand architectural aperture that bleeds to the viewport edge, crossed by one Pinnacle Datum. Vanta's gold/bronze network glides subtly behind the copy/photo boundary and responds to pointer movement; a CSS fallback preserves the same tone.
3. **Stats:** keep the four approved metrics in a generous, architectural specification band; count each value once on first entry.
4. **Philosophy:** move through a large partition/material-study image and the existing approved copy, with a slow mask reveal and restrained parallax.
5. **Projects:** replace the pinned horizontal carousel with three natural-scroll, photo-led exhibition plates. Alternate image/copy composition, let each room image occupy most of its section, keep one concise specification visible, and preserve the details dialog. No scroll hijacking. On selection, GSAP opens the native dialog with a short editorial image/panel reveal; native cursor, close button, backdrop close, and Escape must remain usable.
6. **Disciplines:** three open, full-width drawing-schedule rows with large numerals, generous type, and one moving datum rule—no floating dashboard cards.
7. **Founders:** one immersive Three.js sculpture: a central low-contrast wire/metal sphere with five equal, glass-and-bronze spherical nodes around it. No names or portraits baked into the nodes. One shared caption, five equal keyboard/touch controls, no founder preselected, and the same selection transition for every person. Support drag and wheel; preserve a calm static state and controls under reduced motion.
8. **Footer:** quiet colophon, existing wordmark, approved closing sentence, section links, and back-to-top; no enquiry/contact form or details.

## Motion and interaction

- **Lenis:** one page-level instance with a measured inertia/lerp profile, natural vertical scrolling, anchor offsets, and a GSAP ticker bridge; do not intercept general wheel input.
- **GSAP/SplitText:** staged title-line/character reveal, followed by the hero image aperture and supporting copy; section labels, project panels, discipline rules, count-up values, and modal transition each have distinct timing and meaning.
- **ScrollTrigger:** synchronize with Lenis, use scrubbed image/parallax masks for visual depth, and reveal sections when they enter naturally. Avoid pinned page sections and horizontal page motion.
- **Vanta:** use the installed Vanta NET effect with a restrained gold line field, pointer-driven camera movement, sensible density, hero-only scope, lazy load, teardown, and a reduced-motion/low-performance fallback.
- **Three.js:** load the founders scene lazily, use actual lit spherical geometry/materials rather than flat text discs, preserve equal bubble sizing/material/interaction, dispose all GPU resources, and guard WebGL failure.
- **Accessibility:** maintain visible native cursor and clear focus states; all project dialogs can be closed by button, backdrop, or Escape; keyboard controls select all founders; respect `prefers-reduced-motion`, touch, mobile layout, and WebGL-unavailable fallback.

## Project files

- `src/App.jsx`: content/layout, project dialog, and page sections.
- `src/styles.css`: editorial design system, responsive project plates, accessible controls, and motion-safe fallbacks.
- `src/hooks/useMotion.js`: Lenis/GSAP synchronization and section-specific motion.
- `src/components/VantaBackdrop.jsx`: optional hero network and CSS fallback.
- `src/components/FounderSphere.jsx`: lazy Three.js founders sculpture and peer controls.
- `src/content.js`: approved content and editable founder labels.
- `public/images/`, `vercel.json`, `vite.config.js`, `package.json`: existing images, static deployment setup, and build dependencies.

## Delivery constraints

A repository push is not proof of a Vercel deployment. The public domain previously served the old bundle, and no Vercel project association/status is visible in this session; report that accurately. Replace project images and founder details only when the client supplies/approves them.
