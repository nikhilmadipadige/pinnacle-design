# Pinnacle Design Studio Website — Build Plan

## Product and implementation

Build a polished, responsive, single-page portfolio website for Pinnacle Design Studio from the empty connected repository. Preserve the sample's copy, core color palette, three existing project images, and selected-project details. The site is for people who already know the studio or its founders, so the work and collective identity should lead; the page is not a lead-generation funnel. Remove the inquiry/contact form section and inquiry navigation item for this phase. Do not create a replacement contact flow.

The founders section presents five equal peers. Show Vijay Williams by name and four explicitly editable placeholders. Do not use the sample's fictional founder names, titles, headshots, biographies, or specialties. Do not give any profile more scale, emphasis, or position than the others.

Use a static React + Vite frontend with no server or database. The repository is intended for Vercel, so provide a Vite production build and `vercel.json` settings. Use the user's connected GitHub repository as the source of truth. Keep all browser paths relative, and do not embed private credentials.

GSAP with ScrollTrigger is the animation layer. Lenis may provide smooth scrolling, synchronized with ScrollTrigger and respecting reduced-motion settings. Vanta.js is limited to one restrained, optional hero atmospheric background with an accessible static fallback and cleanup. Motion is progressive enhancement: page content remains visible and usable if scripts or WebGL are unavailable.

## Page and modules

- `src/App.jsx`: page composition, existing content, navigation, project selection, founder peer section, and accessible project detail dialog.
- `src/components/`: focused components for header, hero/ambient effect, portfolio, philosophy/discipline, founders, footer, and project detail dialog.
- `src/data/siteContent.js`: approved copy, stats, projects and five founder entries; easy to update when the founders approve their details.
- `src/hooks/`: GSAP/Lenis setup and optional Vanta lifecycle cleanup.
- `src/styles.css`: design tokens, responsive layout, motion, focus, reduced-motion and fallback rules.
- `public/images/`: supplied/current studio and project imagery, replaceable with the three forthcoming images.
- `public/manus-routes.json`: route declaration for the one-page site.
- `vercel.json`, `package.json`, and `index.html`: production build/deployment metadata.

## Design direction

**Movement:** refined luxury editorial with modernist architectural composition, grounded in the existing site rather than a new palette or brand rewrite.

**Core principles:** (1) architecture-first composition, (2) warm restraint, (3) equal founder status, (4) motion that clarifies rather than competes.

**Color philosophy:** preserve the existing near-black `#121212`, charcoal `#191816`, bronze `#24221f`, cream `#f5f3ef`, and gold `#c5a880`. Maintain the sample's subtle blue-green atmospheric glow only as a restrained existing visual accent; do not introduce a new dominant hue.

**Layout paradigm:** editorial, asymmetric composition. A split hero joins typography and a large project image; portfolio projects receive deliberate, varying image scale; philosophy pairs a material image with its approved copy; five equal architectural planes form the signature founders' presentation. Reflow as a readable single column on mobile.

**Signature elements:** a quiet geometric monogram/grid; a cinematic image reveal; a five-plane founders' composition with synchronized/mirrored reveal and equal dimensions.

**Interaction philosophy:** use direct navigation and clear controls. Project cards open keyboard-accessible project details. Each founder is equally actionable; selection changes only the common detail area, never the selected founder's scale/rank. Mobile uses stacked profiles rather than a hidden carousel.

**Animation:** GSAP timelines for initial reveal, restrained ScrollTrigger reveals and image masks. Synchronize Lenis with ScrollTrigger if used. Vanta.js only behind the hero and disabled for reduced-motion/unavailable WebGL. Honor `prefers-reduced-motion`, avoid continuous movement, preserve native touch behavior and provide static content.

**Typography system:** preserve the existing Playfair Display editorial display face with Outfit for navigation, body copy, captions and controls. Use a restrained scale, generous line height, and consistent tracking for labels.

**Brand essence:** a bespoke interior architecture studio for people who value considered spatial design; distinct through the balance of strict geometry and organic warmth. Personality: architectural, warm, composed.

**Brand voice:** retain the existing approved voice and wording. Existing examples: “YOUR DREAM, OUR CANVAS.” and “Every line has a purpose; every divider, shelf, and ceiling recess is calculated to direct flow and focus.” Do not invent new marketing copy.

**Wordmark and mark:** keep the exact “PINNACLE / DESIGN STUDIO” name lockup; use a small geometric line mark drawn from the supplied Pinnacle logo, not a new brand name or alternate identity.

**Signature brand color:** existing luxury gold `#c5a880`.

## Delivery assumptions

The three existing project images from the deployed sample are included as current assets so the page is complete for review; the three replacement images will be integrated when provided. Founder portraits and personal details are not available and will not be fabricated. Vercel deployment itself depends on the existing external project being linked to this GitHub repository; this repository receives the finished source and Vercel configuration, and a successful GitHub push alone does not prove deployment success.
