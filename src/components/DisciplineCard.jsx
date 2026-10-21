import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

function DisciplineDrawing({ index }) {
  const drawings = [
    <g key="geometry">
      <path d="M24 24h112v112H24zM39 39h82v82H39z" />
      <path d="M24 80h112M80 24v56M80 80v56M39 39l82 82" />
      <circle cx="80" cy="80" r="4" className="discipline__drawing-point" />
    </g>,
    <g key="millwork">
      <path d="M28 25h104v111H28zM40 38h80v85H40z" />
      <path d="M40 66h80M40 94h80M67 38v28M94 66v28M67 94v29" />
      <path d="M48 51h8M104 80h8M76 108h8" />
    </g>,
    <g key="light">
      <path d="M80 22v31M39 53h82M48 53l8 34h48l8-34M62 87v12m36-12v12" />
      <path d="M50 112h60M61 123h38M72 134h16" />
      <path d="M34 36 25 28m101 8 9-8M80 18V8" />
      <circle cx="80" cy="53" r="5" className="discipline__drawing-point" />
    </g>,
  ];

  return (
    <svg className="discipline__drawing" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path className="discipline__drawing-guide" d="M14 148h132M14 14h132M18 10v142M142 10v142" />
      {drawings[index]}
      <path className="discipline__drawing-datum" d="M14 148h54l12-12h66" />
    </svg>
  );
}

function BlueprintDrawing({ index, title, drawingRef, id, visible }) {
  const detail = [
    <g key="plan">
      <path data-draw="true" d="M33 30h94v98H33zM46 42h68v74H46zM33 78h94M80 30v48M80 78v50" />
      <path data-draw="true" d="M33 20V13m94 7V13M33 17h94M23 30h-7m7 98h-7M19 30v98" />
      <path data-draw="true" d="M40 48h5m64 62h5M52 50l56 58" strokeDasharray="3 4" />
      <path data-draw="true" d="m30 17 4-2v4zm100 0-4-2v4zM19 27l-2 4h4zm0 104-2-4h4z" />
    </g>,
    <g key="elevation">
      <path data-draw="true" d="M33 26h94v104H33zM42 36h76v84H42zM42 64h76M42 92h76M67 36v28M93 64v28M67 92v28" />
      <path data-draw="true" d="M33 17h94M33 14v6m94-6v6M23 26v104m-3-104h6m-6 104h6" />
      <path data-draw="true" d="M49 50h9m43 28h9M77 106h9" strokeDasharray="3 4" />
      <path data-draw="true" d="M42 136h76m-76-3v6m76-6v6" />
    </g>,
    <g key="lighting">
      <path data-draw="true" d="M31 31h98v98H31zM44 44h72v72H44zM80 24v32M49 60h62M56 60l7 26h34l7-26" />
      <path data-draw="true" d="M36 37 25 26m99 11 11-11M80 20V11M62 99h36M69 107h22" />
      <circle data-draw="true" cx="80" cy="59" r="4" />
      <path data-draw="true" d="M31 138h98m-98-3v6m98-6v6M137 31v98m-3-98h6m-6 98h6" />
    </g>,
  ];

  return (
    <svg
      ref={drawingRef}
      id={id}
      className="discipline__blueprint"
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-hidden={!visible}
      aria-label={`Architectural blueprint study for ${title}`}
    >
      <path className="discipline__blueprint-grid" d="M16 16h128v128H16zM16 48h128M16 80h128M16 112h128M48 16v128M80 16v128M112 16v128" />
      {detail[index]}
    </svg>
  );
}

export default function DisciplineCard({ item, index }) {
  const [pointerActive, setPointerActive] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [pinned, setPinned] = useState(false);
  const blueprintRef = useRef(null);
  const blueprintId = `discipline-blueprint-${index + 1}`;
  const open = pointerActive || focusActive || pinned;

  useEffect(() => {
    if (!open || !blueprintRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const paths = [...blueprintRef.current.querySelectorAll("[data-draw='true']")];
    paths.forEach((path) => {
      const length = path.getTotalLength?.() || 0;
      if (length) gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 0.58,
      stagger: 0.035,
      ease: "power2.out",
      overwrite: "auto",
    });
    return () => {
      tween.kill();
      gsap.killTweensOf(paths);
      paths.forEach((path) => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }));
    };
  }, [open]);

  return (
    <article
      className={`discipline reveal${open ? " is-blueprint-open" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setPointerActive(true);
      }}
      onPointerLeave={() => setPointerActive(false)}
      onFocusCapture={() => setFocusActive(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusActive(false);
      }}
    >
      <span className="discipline__number">{item.number}</span>
      <span className="discipline__art">
        <DisciplineDrawing index={index} />
        <BlueprintDrawing index={index} title={item.title} drawingRef={blueprintRef} id={blueprintId} visible={open} />
        <span className="discipline__blueprint-label" aria-hidden="true">Drawing / 0{index + 1}</span>
      </span>
      <div className="discipline__content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <button
        type="button"
        className="discipline__blueprint-toggle"
        aria-label={`${pinned ? "Unpin" : "Pin"} blueprint for ${item.title}`}
        aria-controls={blueprintId}
        aria-expanded={open}
        aria-pressed={pinned}
        onClick={() => setPinned((value) => !value)}
      >
        <span>{pinned ? "Pinned" : "Blueprint"}</span>
        <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </article>
  );
}
