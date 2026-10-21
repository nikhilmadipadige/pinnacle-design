import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

function animateCounter(element, gsapContext) {
  const original = element.textContent.trim();
  const value = Number.parseInt(original.replace(/\D/g, ""), 10);
  if (!Number.isFinite(value)) return;
  const suffix = original.replace(/[\d,]/g, "");
  const counter = { value: 0 };
  element.textContent = `0${suffix}`;
  gsapContext.to(counter, {
    value,
    duration: 1.65,
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
      duration: 1.12,
      smoothWheel: true,
      syncTouch: false,
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
        const titleLines = root.querySelectorAll(".hero__title-line");
        const split = titleLines.length
          ? new SplitText(titleLines, { type: "chars", charsClass: "hero-char" })
          : null;

        const opening = gsap.timeline({ delay: 0.12, defaults: { ease: "power4.out" } });
        opening
          .fromTo(".hero__eyebrow", { y: 20, autoAlpha: 0, letterSpacing: "0.42em" }, { y: 0, autoAlpha: 1, letterSpacing: "0.26em", duration: 0.74 })
          .fromTo(split?.chars || ".hero__title-line", { yPercent: 128, rotateX: -72, filter: "blur(12px)", autoAlpha: 0 }, { yPercent: 0, rotateX: 0, filter: "blur(0px)", autoAlpha: 1, duration: 1.08, stagger: { each: 0.021, from: "start" }, ease: "expo.out" }, "-=0.38")
          .fromTo(".hero__description", { y: 28, autoAlpha: 0, filter: "blur(6px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.76 }, "-=0.58")
          .fromTo(".hero__actions .button", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.11 }, "-=0.48")
          .fromTo(".hero-art__frame", { clipPath: "inset(14% 0 14% 24%)", scale: 1.12, autoAlpha: 0.5 }, { clipPath: "inset(0% 0 0% 0%)", scale: 1, autoAlpha: 1, duration: 1.35, ease: "power3.inOut" }, "-=1.05")
          .fromTo(".hero-art__caption, .hero__bottom", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, "-=0.55");

        gsap.utils.toArray(".reveal", root).forEach((element, index) => {
          gsap.fromTo(
            element,
            { y: 36, autoAlpha: 0, filter: "blur(7px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.92,
              delay: Math.min(index % 3, 2) * 0.045,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            },
          );
        });

        gsap.utils.toArray(".stat strong", root).forEach((element) => animateCounter(element, gsap));

        gsap.to(".hero__glow", {
          yPercent: 25,
          xPercent: -7,
          scale: 1.18,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(".hero-art__frame img", {
          yPercent: 9,
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
        });

        gsap.utils.toArray(".philosophy__image-wrap", root).forEach((image) => {
          gsap.fromTo(
            image,
            { clipPath: "inset(12% 0 12% 14%)" },
            {
              clipPath: "inset(0% 0 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: image, start: "top 84%", end: "center 52%", scrub: 0.8 },
            },
          );
          const photo = image.querySelector("img");
          if (photo) {
            gsap.fromTo(photo, { scale: 1.16 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: 1 },
            });
          }
        });

        gsap.utils.toArray(".discipline", root).forEach((row, index) => {
          gsap.fromTo(
            row,
            { x: index % 2 ? 42 : -42, autoAlpha: 0, clipPath: "inset(0 8% 0 8%)" },
            {
              x: 0,
              autoAlpha: 1,
              clipPath: "inset(0 0% 0 0%)",
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            },
          );
        });

        const founderHeading = root.querySelector(".founders__head h2");
        if (founderHeading) {
          const headingSplit = new SplitText(founderHeading, { type: "words", wordsClass: "founder-heading-word" });
          gsap.fromTo(
            headingSplit.words,
            { yPercent: 110, rotateX: -40, autoAlpha: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: founderHeading, start: "top 82%", once: true },
            },
          );
        }

        const gallery = root.querySelector(".portfolio--kinetic");
        const stage = root.querySelector(".portfolio__stage");
        const viewport = root.querySelector(".portfolio__viewport");
        const track = root.querySelector(".portfolio__track");
        if (gallery && stage && viewport && track) {
          const panels = gsap.utils.toArray(".portfolio-panel", track);
          const fill = root.querySelector(".portfolio__progress-fill");
          const current = root.querySelector(".portfolio__progress-current");
          const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          const horizontal = gsap.to(track, {
            x: () => -travel(),
            ease: "none",
            scrollTrigger: {
              trigger: gallery,
              start: "top top+=82",
              end: () => `+=${Math.max(travel(), window.innerHeight * 0.8)}`,
              pin: stage,
              pinSpacing: true,
              scrub: 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (fill) gsap.set(fill, { scaleX: Math.max(0.08, self.progress) });
                if (current && panels.length) {
                  const index = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
                  current.textContent = `0${index + 1}`;
                }
              },
            },
          });
          panels.forEach((panel) => {
            const image = panel.querySelector(".portfolio-panel__image img");
            if (!image) return;
            gsap.fromTo(
              image,
              { scale: 1.13 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
        }

        return () => split?.revert();
      });

      media.add("(max-width: 760px)", () => {
        const viewport = root.querySelector(".portfolio__viewport");
        const panels = gsap.utils.toArray(".portfolio-panel", root);
        const fill = root.querySelector(".portfolio__progress-fill");
        const current = root.querySelector(".portfolio__progress-current");
        if (!viewport || !panels.length) return undefined;
        let frame = 0;
        const updateMobileProgress = () => {
          window.cancelAnimationFrame(frame);
          frame = window.requestAnimationFrame(() => {
            const max = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
            const progress = viewport.scrollLeft / max;
            if (fill) fill.style.transform = `scaleX(${Math.max(0.08, progress)})`;
            const center = viewport.scrollLeft + viewport.clientWidth / 2;
            const index = panels.reduce((closest, panel, panelIndex) => {
              const distance = Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - center);
              return distance < closest.distance ? { index: panelIndex, distance } : closest;
            }, { index: 0, distance: Infinity }).index;
            if (current) current.textContent = `0${index + 1}`;
          });
        };
        viewport.addEventListener("scroll", updateMobileProgress, { passive: true });
        updateMobileProgress();
        return () => {
          window.cancelAnimationFrame(frame);
          viewport.removeEventListener("scroll", updateMobileProgress);
        };
      });

      media.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const lens = root.querySelector(".pointer-lens");
        if (!lens) return undefined;
        const label = lens.querySelector("span");
        const xTo = gsap.quickTo(lens, "x", { duration: 0.22, ease: "power3.out" });
        const yTo = gsap.quickTo(lens, "y", { duration: 0.22, ease: "power3.out" });
        let activeTarget = null;
        root.classList.add("has-pointer-lens");
        const move = (event) => {
          xTo(event.clientX);
          yTo(event.clientY);
          lens.classList.add("is-visible");
        };
        const enterTarget = (event) => {
          const target = event.target.closest?.("[data-cursor]");
          if (!target || target === activeTarget) return;
          activeTarget = target;
          if (label) label.textContent = target.dataset.cursor || "VIEW";
          lens.classList.add("is-active");
        };
        const leaveTarget = (event) => {
          if (activeTarget && !activeTarget.contains(event.relatedTarget)) {
            activeTarget = null;
            lens.classList.remove("is-active");
          }
        };
        const leaveRoot = () => lens.classList.remove("is-visible", "is-active");
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerover", enterTarget);
        root.addEventListener("pointerout", leaveTarget);
        root.addEventListener("pointerleave", leaveRoot);
        return () => {
          root.classList.remove("has-pointer-lens");
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerover", enterTarget);
          root.removeEventListener("pointerout", leaveTarget);
          root.removeEventListener("pointerleave", leaveRoot);
        };
      });

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 180);
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
