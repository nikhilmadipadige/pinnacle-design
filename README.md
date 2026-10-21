# Pinnacle Design Studio

A responsive single-page React/Vite portfolio for Pinnacle Design Studio. The repository includes Vercel build/output configuration; there is no server or database.

## Run locally

```bash
npm ci
npm run dev
```

Create the production build with `npm run build`; the generated static site is in `dist/`. Vercel is configured to install from `package-lock.json`, build with Vite, and publish `dist/`.

## Update assets and founder names

Replace the three current project photos in `public/images/` and update the corresponding image paths and alt text in `src/content.js` when the final images arrive. The five equally weighted founder entries are also in `src/content.js`: Vijay Williams is listed, with four clearly labeled placeholders for the other founders. Add approved names or details there after the founders decide to proceed. Do not add invented biographies or role distinctions.

The inquiry/contact form and navigation item are intentionally omitted for this phase. GSAP SplitText and ScrollTrigger drive the opening sequence, scroll choreography, and pinned desktop portfolio rail; Lenis synchronizes smooth scrolling. The founders section uses a lazily loaded Three.js orbital scene with equal peer controls, while Vanta.js remains a progressive hero atmosphere with a static fallback. The three final replacement images and four approved founder identities/details have not yet been supplied. Respect reduced-motion settings and keep the controls accessible by keyboard.
