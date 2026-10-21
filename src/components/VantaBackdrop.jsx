import { useEffect, useRef } from "react";

export default function VantaBackdrop() {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowScreen = window.matchMedia("(max-width: 760px)");
    if (!element || reduceMotion.matches || narrowScreen.matches || !window.WebGLRenderingContext) return undefined;

    let effect;
    let cancelled = false;
    let idleId;
    let usingIdleCallback = false;

    const start = () => {
      if (cancelled || reduceMotion.matches || !elementRef.current) return;
      Promise.all([import("three"), import("vanta/dist/vanta.fog.min")])
        .then(([threeModule, vantaModule]) => {
          if (cancelled || reduceMotion.matches || !elementRef.current) return;
          const THREE = threeModule.default ?? threeModule;
          const FOG = vantaModule.default ?? vantaModule;
          effect = FOG({
            el: elementRef.current,
            THREE,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 220,
            minWidth: 280,
            scale: 1,
            scaleMobile: 1,
            highlightColor: 0x887557,
            midtoneColor: 0x304849,
            lowlightColor: 0x142020,
            baseColor: 0x121212,
            blurFactor: 0.65,
            speed: 0.36,
            zoom: 0.72,
          });
        })
        .catch(() => {
          // The CSS atmosphere remains as a complete fallback if WebGL or the effect is unavailable.
        });
    };

    const onMotionChange = (event) => {
      if (event.matches) {
        effect?.destroy();
        effect = null;
      }
    };
    reduceMotion.addEventListener?.("change", onMotionChange);

    if ("requestIdleCallback" in window) {
      usingIdleCallback = true;
      idleId = window.requestIdleCallback(start, { timeout: 2400 });
    } else {
      idleId = window.setTimeout(start, 900);
    }

    return () => {
      cancelled = true;
      if (usingIdleCallback) window.cancelIdleCallback?.(idleId);
      else window.clearTimeout(idleId);
      reduceMotion.removeEventListener?.("change", onMotionChange);
      effect?.destroy();
    };
  }, []);

  return <div className="vanta-backdrop" ref={elementRef} aria-hidden="true" />;
}
