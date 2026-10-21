# Pinnacle Design Studio

A responsive, single-page React/Vite portfolio for Pinnacle Design Studio. The repository includes Vercel build/output configuration; there is no server or database.

## Run locally

```bash
npm ci
npm run dev
```

Create the production build with `npm run build`; the generated static site is in `dist/`. Vercel is configured to install from `package-lock.json`, build with Vite, and publish `dist/`.

## Update assets and founder names

Replace the three current project photos in `public/images/` and update the corresponding image paths and alt text in `src/content.js` when the final images arrive. The five equally weighted founder entries are also in `src/content.js`: Vijay Williams is listed, with four clearly labeled placeholders for the other founders. Add approved names or details there after the founders decide to proceed. Do not add invented biographies, role distinctions, or founder portraits.

The enquiry/contact form and navigation item are intentionally omitted for this phase. GSAP/SplitText and ScrollTrigger choreograph the hero, image reveals, discipline drawing strokes, founder register, project plates, and project-detail dialog. Lenis synchronizes smooth vertical scrolling without intercepting page-wheel input. Vanta.js provides an interactive, hero-only network field with a CSS contour fallback. The founders are presented as five equal architectural register panels, not a Three.js scene. Reduced-motion behavior is supported.

The three final replacement images and four approved founder identities/details have not yet been supplied. The public Vercel domain also needs its project binding/deployment status confirmed; a successful GitHub push does not by itself prove deployment.
