import { useEffect, useRef } from "react";

export default function VantaBackdrop() {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !window.WebGLRenderingContext) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowScreen = window.matchMedia("(max-width: 760px)");
    let effect = null;
    let cancelled = false;
    let idleId;
    let usingIdleCallback = false;

    const canStart = () => !cancelled && !reduceMotion.matches && !narrowScreen.matches && elementRef.current;
    const destroy = () => {
      effect?.destroy();
      effect = null;
      element.classList.remove("vanta-backdrop--ready");
    };
    const start = async () => {
      if (!canStart() || effect) return;
      try {
        const [threeModule, vantaModule] = await Promise.all([
          import("three"),
          import("vanta/dist/vanta.net.min"),
        ]);
        if (!canStart()) return;
        const THREE = threeModule.default ?? threeModule;
        const NET = vantaModule.default ?? vantaModule;
        effect = NET({
          el: elementRef.current,
          THREE,
          mouseControls: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 280,
          minWidth: 320,
          scale: 1,
          scaleMobile: 0.72,
          color: 0xc5a880,
          backgroundColor: 0x121212,
          points: 8,
          maxDistance: 27,
          spacing: 23,
          showDots: false,
          mouseCoeffX: 0.48,
          mouseCoeffY: 0.34,
        });
        element.classList.add("vanta-backdrop--ready");
      } catch {
        // The CSS datum-light fallback remains intact if WebGL or Vanta is unavailable.
      }
    };

    const schedule = () => {
      destroy();
      if (!canStart()) return;
      if ("requestIdleCallback" in window) {
        usingIdleCallback = true;
        idleId = window.requestIdleCallback(start, { timeout: 1800 });
      } else {
        usingIdleCallback = false;
        idleId = window.setTimeout(start, 700);
      }
    };
    const onCapabilityChange = () => {
      if (usingIdleCallback) window.cancelIdleCallback?.(idleId);
      else window.clearTimeout(idleId);
      schedule();
    };

    reduceMotion.addEventListener?.("change", onCapabilityChange);
    narrowScreen.addEventListener?.("change", onCapabilityChange);
    schedule();

    return () => {
      cancelled = true;
      if (usingIdleCallback) window.cancelIdleCallback?.(idleId);
      else window.clearTimeout(idleId);
      reduceMotion.removeEventListener?.("change", onCapabilityChange);
      narrowScreen.removeEventListener?.("change", onCapabilityChange);
      destroy();
    };
  }, []);

  return <div className="vanta-backdrop" ref={elementRef} aria-hidden="true" />;
}
