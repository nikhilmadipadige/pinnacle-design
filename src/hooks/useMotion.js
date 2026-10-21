import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

function animateCounter(element, context) {
  const original = element.textContent.trim();
  const value = Number.parseInt(original.replace(/\D/g, ""), 10);
  if (!Number.isFinite(value)) return;
  const suffix = original.replace(/[\d,]/g, "");
  const counter = { value: 0 };
  element.textContent = `0${suffix}`;
  context.to(counter, {
    value,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = `${Math.round(counter.value).toLocaleString()}${suffix}`;
    },
    scrollTrigger: { trigger: element, start: "top 90%", once: true },
  });
}

export default function useMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      anchors: { offset: -82 },
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
        const splits = [];
        const titleLines = root.querySelectorAll(".hero__title-line");
        const heroSplit = titleLines.length
          ? new SplitText(titleLines, { type: "chars", charsClass: "hero-char" })
          : null;
        if (heroSplit) splits.push(heroSplit);

        const opening = gsap.timeline({ delay: 0.08, defaults: { ease: "power4.out" } });
        opening
          .fromTo(".hero__eyebrow", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65 })
          .fromTo(
            heroSplit?.chars || ".hero__title-line",
            { yPercent: 116, rotateX: -55, autoAlpha: 0 },
            { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.92, stagger: { each: 0.024, from: "start" }, ease: "expo.out" },
            "-=0.25",
          )
          .fromTo(".hero__description", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62 }, "-=0.4")
          .fromTo(".hero__actions .button", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1 }, "-=0.32")
          .fromTo(".hero-art__frame", { clipPath: "inset(10% 0 10% 14%)", scale: 1.08, autoAlpha: 0.7 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, autoAlpha: 1, duration: 1.12, ease: "power3.inOut" }, "-=0.96")
          .fromTo(".hero-art__caption, .hero__bottom", { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08 }, "-=0.42");

        gsap.to(".hero-art__datum", {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.85,
          ease: "power3.out",
          delay: 0.95,
        });

        gsap.utils.toArray(".reveal", root).forEach((element, index) => {
          gsap.fromTo(
            element,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.82,
              delay: Math.min(index % 3, 2) * 0.055,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            },
          );
        });

        gsap.utils.toArray(".stat strong", root).forEach((element) => animateCounter(element, gsap));

        const heroImage = root.querySelector(".hero-art__frame img");
        if (heroImage) {
          gsap.to(heroImage, {
            yPercent: 7,
            scale: 1.09,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.9 },
          });
        }

        const philosophyImage = root.querySelector(".philosophy__image-wrap");
        if (philosophyImage) {
          gsap.fromTo(
            philosophyImage,
            { clipPath: "inset(12% 0 8% 14%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: philosophyImage, start: "top 86%", end: "center 52%", scrub: 0.8 },
            },
          );
          const image = philosophyImage.querySelector("img");
          if (image) {
            gsap.fromTo(image, { scale: 1.15 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: philosophyImage, start: "top bottom", end: "bottom top", scrub: 1 },
            });
          }
        }

        const projectPanels = gsap.utils.toArray(".portfolio-panel", root);
        const progressFill = root.querySelector(".portfolio__progress-fill");
        const currentProject = root.querySelector(".portfolio__progress-current");
        const setProjectProgress = (index) => {
          if (currentProject) currentProject.textContent = `0${index + 1}`;
          if (progressFill) gsap.to(progressFill, { scaleX: (index + 1) / projectPanels.length, duration: 0.42, ease: "power2.out", overwrite: true });
        };
        setProjectProgress(0);

        projectPanels.forEach((panel, index) => {
          const imageFrame = panel.querySelector(".portfolio-panel__image");
          const image = panel.querySelector(".portfolio-panel__image img");
          const copy = panel.querySelector(".portfolio-panel__copy");
          const offset = index % 2 ? -46 : 46;
          if (imageFrame) {
            gsap.fromTo(
              imageFrame,
              { clipPath: index % 2 ? "inset(0 0 0 15%)" : "inset(0 15% 0 0)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: { trigger: panel, start: "top 82%", end: "top 42%", scrub: 0.75 },
              },
            );
          }
          if (image) {
            gsap.fromTo(image, { scale: 1.13 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
            });
            gsap.fromTo(image, { yPercent: index % 2 ? 6 : -6 }, {
              yPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1.25 },
            });
          }
          if (copy) {
            gsap.fromTo(
              copy,
              { x: offset, y: 14, autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                autoAlpha: 1,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: { trigger: panel, start: "top 76%", once: true },
              },
            );
          }
          ScrollTrigger.create({
            trigger: panel,
            start: "top center",
            end: "bottom center",
            onEnter: () => setProjectProgress(index),
            onEnterBack: () => setProjectProgress(index),
          });
        });

        gsap.utils.toArray(".discipline", root).forEach((row, index) => {
          gsap.fromTo(
            row,
            { x: index % 2 ? 28 : -28, autoAlpha: 0, clipPath: index % 2 ? "inset(0 0 0 7%)" : "inset(0 7% 0 0)" },
            {
              x: 0,
              autoAlpha: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.78,
              ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            },
          );
          const drawingPaths = row.querySelectorAll(".discipline__drawing path:not(.discipline__drawing-guide), .discipline__drawing circle");
          drawingPaths.forEach((path, pathIndex) => {
            if (path.tagName.toLowerCase() === "circle") return;
            const length = path.getTotalLength?.() || 0;
            if (!length) return;
            gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
              strokeDashoffset: 0,
              duration: 0.7,
              delay: pathIndex * 0.035,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 76%", once: true },
            });
          });
        });

        const founderHeading = root.querySelector(".founders__head h2");
        if (founderHeading) {
          const headingSplit = new SplitText(founderHeading, { type: "words", wordsClass: "founder-heading-word" });
          splits.push(headingSplit);
          gsap.fromTo(
            headingSplit.words,
            { yPercent: 105, rotateX: -35, autoAlpha: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              autoAlpha: 1,
              duration: 0.72,
              stagger: 0.075,
              ease: "power3.out",
              scrollTrigger: { trigger: founderHeading, start: "top 82%", once: true },
            },
          );
        }

        const founderFrame = root.querySelector(".founder-carousel__frame");
        if (founderFrame) {
          gsap.fromTo(
            founderFrame,
            { y: 38, autoAlpha: 0, clipPath: "inset(0 0 8% 0)" },
            {
              y: 0,
              autoAlpha: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: { trigger: founderFrame, start: "top 82%", once: true },
            },
          );
        }

        return () => splits.forEach((split) => split.revert());
      });

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 220);
      window.addEventListener("load", ScrollTrigger.refresh, { once: true });
      return () => {
        window.clearTimeout(refresh);
        window.removeEventListener("load", ScrollTrigger.refresh);
      };
    }, root);

    return () => {
      media.revert();
      context.revert();
      gsap.ticker.remove(raf);
      lenis.off("scroll", update);
      lenis.destroy();
    };
  }, [rootRef]);
}
