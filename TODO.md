# Current revision status

| Outcome | Status |
|---|---|
| Approved content and five equal founders | Complete. Existing copy, project facts, images, palette, and logo are retained. Vijay Williams and four editable placeholders remain equal peers; no biographies, titles, portraits, or founder hierarchy have been invented. |
| Founder interaction refinement | Complete. The sample-led grayscale photo-disc carousel keeps the black stage, lower-left identity, lower-right circular control, and restrained cyan edge glow. GSAP uses a continuous 0.94-second eased transform; the caption commits when the new disc settles and wheel input is held through the glide. Drag, touch, keyboard, reduced motion, WebGL context loss, and the standalone SVG fallback were exercised. |
| Body-copy readability | Complete. Descriptive copy is at least 14px across the audited sections (15px for discipline descriptions); short uppercase indices and metadata remain intentionally smaller. |
| Site spacing and alignment | Complete. Section rhythm and heading-to-content gaps were checked at 1440px, 768px, and 390px. No horizontal overflow; discipline numbers align with their Blueprint controls; mobile and tablet layouts remain intact. |
| Project-focus select | Complete. Native select retained; options use high-contrast light-on-dark styling and were checked with the browser picker and keyboard-capable control at desktop, tablet, and phone widths. |
| Signature Masterpieces project 02 | Complete. The `02` index remains on the image side of the reversed card and has zero measured overlap with the copy panel at all three audited widths. |
| Enquiry form | Complete. Responsive client-side prototype includes project details 01–04. Valid test submission is prevented, the URL is unchanged, no network request or data persistence occurs, and only a local status response is shown. |
| Year founded | Complete. The existing animated statistic displays `2023` without a thousands separator. |
| Discipline interaction refinement | Complete. Restrained particles pause offscreen and with reduced motion; blueprint drawings reveal on hover/focus and via the labeled touch toggle. Existing descriptions are preserved. |
| Existing layout and motion | Complete. The photo-led project section, accessible native project dialog, Lenis/GSAP choreography, hero Vanta backdrop, visible cursor, and reduced-motion behavior are retained. |
| Build and dependency audit | Complete. `npm run build`, `npm audit --omit=dev`, and `git diff --check` pass. Vite reports the lazy Three.js vendor chunk at 704.69 kB (181.05 kB gzip), a size advisory rather than a build failure. |
| Delivery | The task completion message records the final commit and push outcome; deployment state is checked against the current production bundle. |
| Vercel | Compare the public production bundle after the push. If it still serves an older bundle, redeploy the latest production revision from the Vercel project dashboard. |

## Awaiting client assets

The final three project images and four approved founder names/details are still pending. Replace current media and labels only after they are supplied and approved.
