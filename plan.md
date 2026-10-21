# Pinnacle Design Studio — Kinetic Rebuild Plan

## Product and implementation

Keep the existing approved copy, statistics, brand wordmark, palette, project descriptions, and three current interior photographs. This is a presentation redesign, not a content rewrite or lead-generation funnel: retain the no-enquiry decision, do not invent founder biographies/roles/portraits, and represent all five founders as equal peers. Vijay Williams is named; the other four remain editable placeholders. Use the next three client images when supplied.

Keep the static React + Vite app and Vercel deployment configuration. Use the existing libraries as deliberate parts of the experience: GSAP plus its official SplitText and ScrollTrigger plugins for typography, pinned sections, progress, and scroll choreography; Lenis for smooth scrolling synchronized with ScrollTrigger; Three.js for the founders' interactive 3D sphere; Vanta.js only for the hero's existing restrained atmospheric backdrop. Load the Three.js founders scene lazily when near the viewport and dispose its WebGL resources safely. Avoid adding libraries that duplicate these capabilities.

## Project structure

- `src/App.jsx`: existing page copy and composition, navigation, portfolio dialog, disciplines, founder experience mount.
- `src/components/FounderSphere.jsx`: lazy Three.js scene, five identical geometric founder bubbles, mouse/touch orbit, scroll-wheel navigation, snap/inertia, and accessible equal-weight controls.
- `src/components/VantaBackdrop.jsx`: optional hero atmosphere with static fallback.
- `src/hooks/useMotion.js`: Lenis/ScrollTrigger synchronization, SplitText hero sequence, statistics count-up, parallax/image masks, pinned horizontal portfolio choreography, and section transitions.
- `src/content.js`: all existing approved project/statistics/disciplines copy and the five editable founder labels.
- `src/styles.css`: preserve the locked palette and typography while rebuilding the first impression, pinned project rail, and immersive founder stage for desktop/tablet/mobile.
- `public/images/`: current replaceable project photographs and logo; do not present an interior image as a founder portrait.
- `public/manus-routes.json`, `vercel.json`, `package.json`, and `index.html`: single-page routing, Vercel build, dependencies, and page metadata.

## Design direction

**Design movement:** cinematic kinetic editorialism crossed with architectural instrument design: the page should feel like moving through a designed space, not reading a conventional agency template.

**Core principles:** (1) scale creates impact, (2) motion reveals spatial meaning, (3) all five founders share identical visual rules, (4) the original content and palette remain intact.

**Color philosophy:** retain `#121212` black, `#191816` charcoal, `#24221f` bronze, `#f5f3ef` cream, and `#c5a880` gold. Keep the sample's existing blue-green light bloom as an atmospheric accent, never as a new dominant color.

**Layout paradigm:** an asymmetric editorial hero; a slow, image-led philosophy interlude; a GSAP-pinned horizontal project rail on desktop (native swipe/scroll stack on mobile); a large, full-width founders' orbit with a deep 3D field and five equally sized bubbles.

**Signature elements:** a split/revealing typographic hero; a horizontal project reel with a precise progress instrument; a five-node orbital sphere of abstract geometric bubbles, with equal rotation, sizing, and founder treatment.

**Interaction philosophy:** tactile and discoverable. Drag, wheel, touch, or arrow-key input rotates the founders sphere with momentum and equal snapping. The name in the shared caption changes using the same transition for every node. The bubbles use abstract geometry—not invented headshots. Portfolio projects move horizontally with page scroll on desktop and remain directly swipeable on touch devices. Keep native keyboard focus and reduced-motion alternatives.

**Animation:** Lenis runs the main scroll and calls `ScrollTrigger.update`; GSAP SplitText staggers hero characters into view; a pinned ScrollTrigger translates the project rail with live progress; images use clip-path and parallax reveals; counters animate only when entering view. Three.js animates the founders' geometry with subdued idle drift; user drag applies momentum, wheel and touch move through the orbit, and keyboard controls snap any founder to the same front position. Turn off nonessential autoplay under `prefers-reduced-motion`, keep content visible without animation, and avoid loading the 3D scene until it is near view.

**Typography system:** continue Playfair Display for display titles and Outfit for navigation, controls, body copy, and technical labels. Oversized titles are carefully clipped per line; captions remain short, tracked, and high contrast.

**Brand essence:** bespoke interior architecture for people who know the studio and its founders; architectural, tactile, and assured.

**Brand voice:** retain approved wording and tone; examples remain “YOUR DREAM, OUR CANVAS.” and “Every line has a purpose; every divider, shelf, and ceiling recess is calculated to direct flow and focus.”

**Wordmark and mark:** retain the existing PINNACLE / DESIGN STUDIO lock-up and geometric line symbol.

**Signature brand color:** existing luxury gold `#c5a880`.

## Delivery constraints

No founder portraits or personal details were supplied; the 3D node textures are abstract, not synthetic human likenesses. Keep the three current photos until the client sends the three replacement images. Repository push is not proof of a Vercel deployment; report deployment only if independently confirmed.
