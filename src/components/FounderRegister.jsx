import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders } from "../content.js";

const TURN = 360 / founders.length;
const wrapIndex = (index) => (index + founders.length) % founders.length;

function FounderDrawing({ variant }) {
  const drawings = [
    <g key="geometry">
      <path d="M36 30h148v174H36zM54 48h112v138H54z" />
      <path d="M36 114h148M110 30v84M110 114v90M54 48l112 138" />
      <circle cx="110" cy="114" r="4" className="founder-carousel__glyph-point" />
    </g>,
    <g key="millwork">
      <path d="M38 30h144v174H38zM54 46h112v144H54z" />
      <path d="M54 91h112M54 137h112M92 46v45M128 91v46M91 137v53" />
      <path d="M69 68h10M142 115h10M107 161h10" />
    </g>,
    <g key="partition">
      <path d="M35 30h150v174H35zM55 30v174M91 30v174M129 30v174M165 30v174" />
      <path d="M55 30l110 174M165 30 55 204M35 85h150M35 150h150" />
      <path d="M91 85 129 150M129 85 91 150" />
    </g>,
    <g key="portal">
      <path d="M36 204V70L110 30l74 40v134M54 204V80l56-31 56 31v124" />
      <path d="M74 204V90l36-20 36 20v114M36 70h148M54 80h112" />
      <path d="m74 90 36 25 36-25M110 115v89" />
    </g>,
    <g key="light">
      <path d="M110 30v42M47 72h126M57 72l12 49h82l12-49M75 121v13m70-13v13" />
      <path d="M62 150h96M74 166h72M88 182h44" />
      <path d="M48 47 36 37m148 10 12-10M110 27V13" />
      <circle cx="110" cy="72" r="7" className="founder-carousel__glyph-point" />
    </g>,
  ];

  return (
    <svg className="founder-carousel__drawing" viewBox="0 0 220 230" fill="none" aria-hidden="true">
      <path className="founder-carousel__drawing-guide" d="M18 216h184M18 17h184M25 12v208M195 12v208" />
      {drawings[variant]}
      <path className="founder-carousel__drawing-datum" d="M18 216h83l18-18h83" />
    </svg>
  );
}

function SpatialSphere() {
  return (
    <svg className="founder-carousel__sphere" viewBox="0 0 900 520" fill="none" aria-hidden="true">
      <ellipse cx="450" cy="260" rx="286" ry="215" />
      <ellipse cx="450" cy="260" rx="286" ry="92" />
      <ellipse cx="450" cy="260" rx="115" ry="215" />
      <ellipse cx="450" cy="260" rx="208" ry="215" transform="rotate(34 450 260)" />
      <ellipse cx="450" cy="260" rx="208" ry="215" transform="rotate(-34 450 260)" />
      <path d="M164 260h572M450 45v430M232 108l436 304M668 108 232 412" />
      <circle cx="450" cy="260" r="4" className="founder-carousel__sphere-point" />
    </svg>
  );
}

export default function FounderRegister() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef(null);

  const animateTo = (index) => {
    const next = wrapIndex(index);
    activeIndexRef.current = next;
    setActiveIndex(next);
    const track = trackRef.current;
    if (!track) return;
    const rotationY = -next * TURN;
    gsap.killTweensOf(track);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(track, { rotationY });
    } else {
      gsap.to(track, {
        rotationY,
        duration: 0.82,
        ease: "power3.inOut",
        overwrite: true,
      });
    }
  };

  useEffect(() => () => {
    gsap.killTweensOf(trackRef.current);
    window.clearTimeout(wheelTimerRef.current);
  }, []);

  const onKeyDown = (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = activeIndexRef.current + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = activeIndexRef.current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = founders.length - 1;
    else return;

    event.preventDefault();
    event.stopPropagation();
    const wrapped = wrapIndex(next);
    animateTo(wrapped);
    requestAnimationFrame(() => slideRefs.current[wrapped]?.focus({ preventScroll: true }));
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current;
    const displayedRotation = track ? parseFloat(gsap.getProperty(track, "rotationY")) : NaN;
    if (track) gsap.killTweensOf(track);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: Number.isFinite(displayedRotation) ? displayedRotation : -activeIndexRef.current * TURN,
      moved: false,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      drag.moved = true;
      setDragging(true);
      stageRef.current?.setPointerCapture?.(event.pointerId);
    }
    if (!drag.moved) return;
    gsap.set(trackRef.current, { rotationY: drag.startRotation + deltaX * 0.45 });
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      if (Math.abs(drag.startRotation + activeIndexRef.current * TURN) > 0.5) animateTo(activeIndexRef.current);
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const draggedRotation = drag.startRotation + deltaX * 0.45;
    const next = wrapIndex(Math.round(-draggedRotation / TURN));
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 120);
    setDragging(false);
    animateTo(next);
  };

  const onWheel = (event) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 12 || wheelLockRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    wheelLockRef.current = true;
    wheelTimerRef.current = window.setTimeout(() => { wheelLockRef.current = false; }, 460);
    animateTo(activeIndexRef.current + (delta > 0 ? 1 : -1));
  };

  const nextIndex = wrapIndex(activeIndex + 1);
  const activeFounder = founders[activeIndex];

  return (
    <div className="founder-register">
      <div
        className={`founder-carousel__frame${dragging ? " is-dragging" : ""}`}
        ref={stageRef}
        role="region"
        aria-label="Founder carousel"
        aria-roledescription="carousel"
        aria-describedby="founder-carousel-instructions"
        data-lenis-prevent
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onWheel={onWheel}
      >
        <div className="founder-carousel__field" aria-hidden="true">
          <span className="founder-carousel__field-axis" />
          <span className="founder-carousel__field-halo" />
          <SpatialSphere />
        </div>

        <div className="founder-carousel__viewport">
          <div className="founder-carousel__track" ref={trackRef}>
            {founders.map((founder, index) => (
              <button
                type="button"
                className="founder-carousel__slide"
                key={founder.index}
                data-founder-index={index}
                data-active={activeIndex === index}
                aria-label={`Founder ${founder.index} of ${founders.length}: ${founder.label}`}
                aria-pressed={activeIndex === index}
                aria-roledescription="slide"
                tabIndex={activeIndex === index ? 0 : -1}
                ref={(node) => { slideRefs.current[index] = node; }}
                style={{ transform: `translate(-50%, -50%) rotateY(${index * TURN}deg) translateZ(var(--carousel-radius))` }}
                onClick={() => {
                  if (suppressClickRef.current) return;
                  if (activeIndexRef.current !== index) animateTo(index);
                }}
                onFocus={() => {
                  if (!dragRef.current && activeIndexRef.current !== index) animateTo(index);
                }}
              >
                <span className="founder-carousel__slide-head" aria-hidden="true">
                  <span>Founder</span>
                  <span>{founder.index}</span>
                </span>
                <span className="founder-carousel__slide-art" aria-hidden="true">
                  <FounderDrawing variant={index} />
                </span>
                <span className="founder-carousel__slide-foot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="founder-carousel__caption" aria-live="polite" aria-atomic="true">
          <div className="founder-carousel__identity" key={activeFounder.index}>
            <span className="founder-carousel__overline">Founder {activeFounder.index} / 05</span>
            <h3 className="founder-carousel__name">{activeFounder.label}</h3>
            <p className="founder-carousel__role">Founder</p>
          </div>
          <button
            className="founder-carousel__next"
            type="button"
            aria-label={`Show next founder: ${founders[nextIndex].label}`}
            onClick={() => animateTo(nextIndex)}
          >
            <span aria-hidden="true">↗</span>
          </button>
        </div>

      </div>
      <p className="founder-carousel__sr-instructions" id="founder-carousel-instructions">
        Use left and right arrow keys to move through founders, or Home and End to jump to the first or last founder.
      </p>
    </div>
  );
}
