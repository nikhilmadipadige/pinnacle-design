import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders } from "../content.js";

function FounderDrawing({ variant }) {
  const drawings = [
    <g key="geometry">
      <path d="M36 30h148v174H36zM54 48h112v138H54z" />
      <path d="M36 114h148M110 30v84M110 114v90M54 48l112 138" />
      <circle cx="110" cy="114" r="4" className="register-glyph__point" />
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
      <circle cx="110" cy="72" r="7" className="register-glyph__point" />
    </g>,
  ];

  return (
    <svg className="founder-register__drawing" viewBox="0 0 220 230" fill="none" aria-hidden="true" data-variant={variant}>
      <path className="founder-register__drawing-guide" d="M18 216h184M18 17h184M25 12v208M195 12v208" />
      {drawings[variant]}
      <path className="founder-register__drawing-datum" d="M18 216h83l18-18h83" />
    </svg>
  );
}

export default function FounderRegister() {
  const [activeIndex, setActiveIndex] = useState(null);
  const buttonsRef = useRef(null);
  const activeIndexRef = useRef(null);

  useEffect(() => {
    if (activeIndex === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const activeButton = buttonsRef.current?.querySelector(`[data-founder-index="${activeIndex}"]`);
    if (!activeButton) return;
    const glyph = activeButton.querySelector(".founder-register__drawing");
    const number = activeButton.querySelector(".founder-register__number");
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
    timeline.fromTo(glyph, { y: 9, autoAlpha: 0.68 }, { y: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out" });
    timeline.fromTo(number, { y: 10, autoAlpha: 0.3 }, { y: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" }, "-=0.32");
    return () => timeline.kill();
  }, [activeIndex]);

  const selectFounder = (index) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  const onKeyDown = (event) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = founders.length - 1;
    else if (direction) {
      const focusedCard = event.target.closest?.("[data-founder-index]");
      const focusedIndex = focusedCard ? Number(focusedCard.dataset.founderIndex) : activeIndexRef.current;
      const origin = Number.isInteger(focusedIndex) ? focusedIndex : 0;
      next = (origin + direction + founders.length) % founders.length;
    }
    else return;
    event.preventDefault();
    selectFounder(next);
    buttonsRef.current?.querySelector(`[data-founder-index="${next}"]`)?.focus();
  };

  return (
    <div className="founder-register">
      <div className="founder-register__index" aria-hidden="true">
        <span>Founding team</span>
        <span className="founder-register__index-rule" />
        <span>Five equal parts / One studio</span>
      </div>

      <div className="founder-register__rail" aria-hidden="true">
        {founders.map((founder) => <span key={founder.index} />)}
      </div>

      <div
        className="founder-register__grid"
        role="group"
        aria-label="Select a founder"
        ref={buttonsRef}
        onKeyDown={onKeyDown}
      >
        {founders.map((founder, index) => (
          <button
            type="button"
            className={`founder-register__card${activeIndex === index ? " is-active" : ""}`}
            key={founder.index}
            data-founder-index={index}
            aria-pressed={activeIndex === index}
            onClick={() => selectFounder(index)}
          >
            <span className="founder-register__card-top">
              <span className="founder-register__number">{founder.index}</span>
              <span className="founder-register__card-mark" aria-hidden="true"><i /><i /></span>
            </span>
            <span className="founder-register__art">
              <FounderDrawing variant={index} />
              <span className="founder-register__art-caption">P / 0{index + 1}</span>
            </span>
            <span className="founder-register__identity">
              <span className="founder-register__name">{founder.label}</span>
              <span className="founder-register__role">Founder</span>
            </span>
          </button>
        ))}
      </div>

      <div className="founder-register__footer" aria-live="polite" aria-atomic="true">
        <span className="founder-register__footer-rule" />
        <span>{activeIndex === null ? "Select a founder" : `Founder ${founders[activeIndex].index} selected`}</span>
        <span className="founder-register__footer-rule" />
      </div>
    </div>
  );
}
