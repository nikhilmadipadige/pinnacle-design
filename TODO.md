# Current revision status

| Outcome | Status |
|---|---|
| Preserve approved copy, project facts, current images, palette, logo, and five equal founders | Complete. Existing copy/palette retained; no biographies, roles, or portraits invented. Five founders remain equal peers. |
| Founder interaction refinement | Implemented, awaiting the latest visual review. Preserves the sample-led grayscale discs and corner arrivals; adds only a faint blurred architectural texture and cool bloom behind the images, with no globe/orbit graphics or competing photo. Five equal founder states, drag/swipe, wheel, keyboard, visible focus, reduced-motion and SVG/WebGL fallback remain. Founder instruction now matches disc navigation. |
| Enquiry form | Implemented and tested. Adds name, email, project type and project notes in a responsive editorial section. The form explicitly says it is a prototype; valid dummy submit was prevented, URL unchanged, and zero fetch/XHR/beacon calls occurred. No data is sent or persisted; only a local status message appears. |
| Year founded | Complete. The existing animated statistic displays `2023` without a thousands separator; other counters retain locale formatting. |
| Discipline interaction refinement | Complete. Restrained floating particles pause offscreen and with reduced motion; detailed blueprints open on hover/focus and via a labeled touch toggle. Existing three descriptions are preserved. |
| Existing layout | Complete. Photo-led project section and accessible native project dialog retained; cursor remains visible/usable, and open/close motion is disabled for reduced-motion users. |
| Build/security | Current local correction builds; `git diff --check` passes and `npm audit --omit=dev` reports 0 vulnerabilities. Vite retains its advisory that the lazy Three.js vendor chunk exceeds 500 kB (181 kB gzip). |
| GitHub delivery | Previous globe version `a4b4268` remains on `main` at the start of this delivery; this correction is staged for final commit/push after the final build. |
| Vercel | The last known public bundle was stale. Check again after pushing this revision; if needed, redeploy from the Vercel project. |

## Awaiting client assets

The final three project images and four approved founder names/details are still pending. Replace current media and labels only after they are supplied and approved.
