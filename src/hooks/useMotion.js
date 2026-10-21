import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function useMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -88 },
      respectReducedMotion: true,
    });

    const raf = (time) => lenis.raf(time * 1000);
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const media = gsap.matchMedia(root);
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(".hero__eyebrow", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
          .fromTo(".hero__title-line", { yPercent: 110, rotateX: -7 }, { yPercent: 0, rotateX: 0, duration: 0.9, stagger: 0.1 }, "-=0.25")
          .fromTo(".hero__description, .hero__actions", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.1 }, "-=0.35")
          .fromTo(".hero-art__frame", { clipPath: "inset(8% 0 8% 18%)", autoAlpha: 0.5 }, { clipPath: "inset(0% 0 0% 0%)", autoAlpha: 1, duration: 1.1 }, "-=0.85")
          .fromTo(".hero__bottom", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.3");

        gsap.utils.toArray(".reveal", root).forEach((element) => {
          gsap.fromTo(
            element,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.72,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        gsap.fromTo(
          ".stat",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.52,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: ".stats", start: "top 90%", once: true },
          },
        );

        gsap.to(".hero__glow", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refresh);
      media.revert();
      context.revert();
      gsap.ticker.remove(raf);
      lenis.off("scroll", update);
      lenis.destroy();
    };
  }, [rootRef]);
}
