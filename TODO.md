# Current revision status

| Outcome | Status |
|---|---|
| Preserve approved copy, project facts, current images, palette, logo, no-enquiry decision, and five equal founders | Preserved. No biographies, roles, or portraits invented. |
| Founders section | Replaced the floating spheres with five aligned architectural register panels. Each panel has equal scale, its own abstract architectural study, the approved name or placeholder, and consistent selected/focus behavior. No default selection; click, arrow keys, Home and End work. |
| Disciplines section | Rebuilt as three custom-illustrated architectural study cards. Increased the heading, description, and body type sizes; preserved all three approved descriptions. Wide screens use three columns, tablet uses an equal 2+1 composition, phones stack the cards. |
| Hero background | Added low-contrast parametric contours and tuned the lazy Vanta NET layer toward shorter connections and softer opacity, keeping the photograph and headline prominent. |
| Motion and accessibility | Retained GSAP/SplitText and Lenis/ScrollTrigger synchronization. Added a measured founder-panel stagger and discipline line-art reveals. Preserved natural scroll, keyboard focus, reduced-motion handling, and the visible native pointer in project dialogs. |
| Responsive browser verification | Real Chromium checks at 1440px, 768px, and 390px: no mobile page overflow; five desktop founder cards match in width and height; five phone cards share the same dimensions; discipline illustrations/copy render at all sizes; keyboard selection works. |
| Build/security | Production build passes. `npm audit --omit=dev` reports zero vulnerabilities. `git diff --check` passes. |
| GitHub delivery | Implementation pushed to `main` as `31589ae` (clean worktree at time of check). |
| Vercel deployment | **Not live yet.** The public domain returns the previous JavaScript bundle, which does not contain the new founder-register component. GitHub reports no deployment record for commit `31589ae`. The static Vercel build configuration is intact. |

## Awaiting client assets

The final three project images and four approved founder names/details are still pending. Replace current media and labels only after they are supplied and approved.
