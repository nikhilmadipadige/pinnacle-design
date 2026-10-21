# Current revision status

| Outcome | Status |
|---|---|
| Preserve approved copy, project facts, current images, palette, logo, no-enquiry decision, and five equal founders | Complete. Existing copy/palette retained; no enquiry form, biographies, roles, or portraits invented. Five founders remain equal peers. |
| Founder interaction refinement | Implemented, awaiting user visual approval. The sample’s centered heading/instruction, rounded 896×600 desktop canvas stage, lower-left identity and lower-right arrow remain. The rejected visible card gallery is replaced by a warm architectural globe with orbital/latitude linework and five identical rotating founder markers. Keep Vijay Williams plus four placeholders, equal peer treatment, only the existing “Founder” label, no invented portraits/bios/roles, and preserve drag/swipe, stage wheel, keyboard, focus and reduced-motion behavior. Desktop/tablet/phone validation confirms rendering, no mobile overflow, all five accessible selection controls, next/Arrow/Home/End, small and standard wheel, mouse drag, touch swipe and reduced-motion selection. Keyboard focus expands a visible founder pill; stage wheel events are prevented without hijacking page scroll. Forced WebGL-unavailable test confirms the SVG fallback rotates; context-loss test restores it, and renderer/resize cleanup is covered. |
| Discipline interaction refinement | Complete. Restrained floating particles pause offscreen and with reduced motion; detailed blueprints open on hover/focus and via a labeled touch toggle. Existing three descriptions are preserved. |
| Existing layout | Complete. Photo-led project section and accessible native project dialog retained; cursor remains visible/usable, and open/close motion is disabled for reduced-motion users. |
| Build/security | Complete. Production build and `git diff --check` pass; `npm audit --omit=dev` reports 0 vulnerabilities. Vite retains its advisory that the Three.js vendor chunk exceeds 500 kB (181 kB gzip). |
| GitHub delivery | Previous founders refinement `34b6a47` is on `main`; the latest sphere/accessibility edge-case work is validated locally and awaiting its commit/push. |
| Vercel | Static build configuration is intact. The prior public check showed a stale bundle; recheck the production bundle after pushing this revision before treating the public URL as updated. |

## Awaiting client assets

The final three project images and four approved founder names/details are still pending. Replace current media and labels only after they are supplied and approved.
