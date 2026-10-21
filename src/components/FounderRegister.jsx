import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders } from "../content.js";

const TURN = 360 / founders.length;
const TAU = Math.PI * 2;
const wrapIndex = (index) => (index + founders.length) % founders.length;
const nearestEquivalentRotation = (target, current) => target + 360 * Math.round((current - target) / 360);

function SphereFallback({ activeIndex, rotation }) {
  const markerPoints = founders.map((_, index) => {
    const angle = (index * TAU) / founders.length + (rotation * Math.PI) / 180;
    return {
      index,
      x: 450 + Math.sin(angle) * 218,
      y: 282 + Math.sin(angle * 2) * 9,
      depth: Math.cos(angle),
    };
  });

  const marker = ({ index, x, y, depth }) => (
    <g
      key={index}
      data-founder-index={index}
      transform={`translate(${x} ${y})`}
      opacity={depth < 0 ? 0.62 : 0.95}
      className={index === activeIndex ? "founder-carousel__fallback-marker is-active" : "founder-carousel__fallback-marker"}
    >
      <circle r="18" className="founder-carousel__fallback-marker-halo" />
      <circle r="13" className="founder-carousel__fallback-marker-core" />
      <circle r="5" className="founder-carousel__fallback-marker-point" />
    </g>
  );

  return (
    <svg className="founder-carousel__fallback" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="founder-orb-core" cx="34%" cy="26%" r="76%">
          <stop offset="0%" stopColor="#756047" stopOpacity="0.48" />
          <stop offset="42%" stopColor="#30271d" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#090909" stopOpacity="0.08" />
        </radialGradient>
        <radialGradient id="founder-orb-glow">
          <stop offset="0%" stopColor="#c5a880" stopOpacity="0.20" />
          <stop offset="56%" stopColor="#c5a880" stopOpacity="0.055" />
          <stop offset="100%" stopColor="#c5a880" stopOpacity="0" />
        </radialGradient>
        <filter id="founder-orb-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="450" cy="282" rx="278" ry="156" className="founder-carousel__fallback-orbit" />
      <ellipse cx="450" cy="282" rx="250" ry="94" transform="rotate(-18 450 282)" className="founder-carousel__fallback-orbit is-secondary" />
      <ellipse cx="450" cy="282" rx="250" ry="94" transform="rotate(18 450 282)" className="founder-carousel__fallback-orbit is-secondary" />

      <circle cx="450" cy="282" r="206" fill="url(#founder-orb-glow)" />
      <circle cx="450" cy="282" r="148" fill="url(#founder-orb-core)" className="founder-carousel__fallback-globe" />
      <ellipse cx="450" cy="282" rx="148" ry="57" className="founder-carousel__fallback-latitude" />
      <ellipse cx="450" cy="282" rx="148" ry="107" className="founder-carousel__fallback-latitude is-soft" />
      <ellipse cx="450" cy="282" rx="62" ry="148" className="founder-carousel__fallback-longitude" />
      <ellipse cx="450" cy="282" rx="110" ry="148" transform="rotate(34 450 282)" className="founder-carousel__fallback-longitude is-soft" />
      <ellipse cx="450" cy="282" rx="110" ry="148" transform="rotate(-34 450 282)" className="founder-carousel__fallback-longitude is-soft" />
      <path d="M302 282h296M450 134v296" className="founder-carousel__fallback-axis" />
      <circle cx="450" cy="282" r="3" className="founder-carousel__fallback-center" />

      {markerPoints.map(marker)}
    </svg>
  );
}

function FounderScene({ frameRef, activeIndex, activeIndexRef, trackRef, sceneRef, setFallbackRotation }) {
  const canvasRef = useRef(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return undefined;

    let cancelled = false;
    let started = false;
    let observer = null;
    let resizeObserver = null;
    let renderer = null;
    let scene = null;
    let resize = null;

    const stopResizeObservation = () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (resize) window.removeEventListener("resize", resize);
    };

    const disposeResources = () => {
      stopResizeObservation();
      const disposedScene = scene;
      if (disposedScene) {
        disposedScene.traverse((object) => {
          object.geometry?.dispose?.();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
          else object.material?.dispose?.();
        });
        scene = null;
      }
      renderer?.dispose();
      renderer = null;
      if (sceneRef.current?.scene === disposedScene) sceneRef.current = null;
    };

    const onContextLost = (event) => {
      event.preventDefault();
      cancelled = true;
      setFallbackRotation(trackRef.current.rotationY);
      setWebglReady(false);
      disposeResources();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const start = async () => {
      if (cancelled || started) return;
      started = true;

      try {
        const threeModule = await import("three");
        if (cancelled) return;
        const THREE = threeModule.default ?? threeModule;
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
        camera.position.set(0, 0, 8.8);
        camera.lookAt(0, 0, 0);

        scene.add(new THREE.HemisphereLight(0xf0e4d0, 0x100e0b, 1.9));
        const keyLight = new THREE.DirectionalLight(0xe8d1a9, 4.5);
        keyLight.position.set(-3.6, 4.4, 5.2);
        scene.add(keyLight);
        const rimLight = new THREE.PointLight(0x9f774b, 5.8, 12, 2);
        rimLight.position.set(3.8, 0.8, -2.8);
        scene.add(rimLight);
        const activeLight = new THREE.PointLight(0xd8c19f, 2.2, 3.8, 2);
        scene.add(activeLight);

        const composition = new THREE.Group();
        composition.position.y = 0.15;
        scene.add(composition);

        const globe = new THREE.Group();
        composition.add(globe);
        const globeRadius = 1.5;
        const globeGeometry = new THREE.SphereGeometry(globeRadius, 56, 42);
        const globeMaterial = new THREE.MeshStandardMaterial({
          color: 0x59452c,
          metalness: 0.28,
          roughness: 0.38,
          emissive: 0x4a3317,
          emissiveIntensity: 0.38,
        });
        globe.add(new THREE.Mesh(globeGeometry, globeMaterial));

        const latitudeMaterial = new THREE.LineBasicMaterial({
          color: 0xd2b98f,
          transparent: true,
          opacity: 0.36,
          depthWrite: false,
        });
        const longitudeMaterial = new THREE.LineBasicMaterial({
          color: 0xc5a880,
          transparent: true,
          opacity: 0.25,
          depthWrite: false,
        });

        const addClosedLine = (parent, points, material) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          parent.add(new THREE.LineLoop(geometry, material));
        };

        [-0.76, -0.4, 0, 0.4, 0.76].forEach((latitude) => {
          const ringRadius = globeRadius * Math.cos(latitude);
          const y = globeRadius * Math.sin(latitude);
          const points = [];
          for (let step = 0; step < 96; step += 1) {
            const angle = (step / 96) * TAU;
            points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius));
          }
          addClosedLine(globe, points, latitudeMaterial);
        });

        for (let meridian = 0; meridian < 6; meridian += 1) {
          const longitude = (meridian / 6) * Math.PI;
          const points = [];
          for (let step = 0; step < 96; step += 1) {
            const angle = (step / 96) * TAU;
            const ring = globeRadius * Math.cos(angle);
            points.push(new THREE.Vector3(
              ring * Math.sin(longitude),
              globeRadius * Math.sin(angle),
              ring * Math.cos(longitude),
            ));
          }
          addClosedLine(globe, points, longitudeMaterial);
        }

        const frontRim = new THREE.Mesh(
          new THREE.TorusGeometry(globeRadius + 0.012, 0.006, 5, 120),
          new THREE.MeshBasicMaterial({ color: 0xc5a880, transparent: true, opacity: 0.44 }),
        );
        frontRim.rotation.x = Math.PI / 2;
        globe.add(frontRim);

        const orbitRadius = 2.64;
        const orbitalMaterial = new THREE.MeshBasicMaterial({
          color: 0xbca27b,
          transparent: true,
          opacity: 0.48,
          depthWrite: false,
        });
        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(orbitRadius, 0.006, 5, 180),
          orbitalMaterial,
        );
        orbit.rotation.x = Math.PI / 2;
        composition.add(orbit);

        const inclinedOrbit = new THREE.Mesh(
          new THREE.TorusGeometry(orbitRadius * 0.98, 0.0045, 5, 180),
          new THREE.MeshBasicMaterial({ color: 0x8a775d, transparent: true, opacity: 0.22, depthWrite: false }),
        );
        inclinedOrbit.rotation.set(1.17, 0.06, -0.24);
        composition.add(inclinedOrbit);

        const markerGeometry = new THREE.SphereGeometry(0.17, 24, 18);
        const markerRingGeometry = new THREE.TorusGeometry(0.235, 0.007, 5, 48);
        const markerGroups = founders.map((_, index) => {
          const angle = (index / founders.length) * TAU;
          const marker = new THREE.Group();
          marker.position.set(Math.sin(angle) * orbitRadius, 0, Math.cos(angle) * orbitRadius);
          marker.rotation.y = angle;

          const material = new THREE.MeshStandardMaterial({
            color: 0xc5a880,
            metalness: 0.6,
            roughness: 0.22,
            emissive: 0x5d482a,
            emissiveIntensity: index === activeIndexRef.current ? 0.46 : 0.14,
            transparent: true,
            opacity: 0.9,
            depthTest: false,
            depthWrite: false,
          });
          const bead = new THREE.Mesh(markerGeometry, material);
          bead.renderOrder = 12;
          marker.add(bead);
          const haloMaterial = new THREE.MeshBasicMaterial({
            color: 0xd8c19f,
            transparent: true,
            opacity: 0.54,
            depthTest: false,
            depthWrite: false,
          });
          const halo = new THREE.Mesh(
            markerRingGeometry,
            haloMaterial,
          );
          halo.renderOrder = 13;
          marker.add(halo);
          marker.userData.material = material;
          marker.userData.haloMaterial = haloMaterial;
          composition.add(marker);
          return marker;
        });

        const axisGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-4.4, -0.02, -0.12),
          new THREE.Vector3(4.4, -0.02, -0.12),
        ]);
        composition.add(new THREE.Line(
          axisGeometry,
          new THREE.LineBasicMaterial({ color: 0xa98b61, transparent: true, opacity: 0.12, depthWrite: false }),
        ));

        const dustPositions = [];
        for (let index = 0; index < 34; index += 1) {
          const angle = index * 2.399963229728653;
          const radius = 2.9 + (index % 5) * 0.33;
          dustPositions.push(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.7) * (0.7 + (index % 4) * 0.23),
            -1.4 + (index % 7) * 0.48,
          );
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
        scene.add(new THREE.Points(
          dustGeometry,
          new THREE.PointsMaterial({
            color: 0xd1ba94,
            size: 0.018,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
            sizeAttenuation: true,
          }),
        ));

        const worldPosition = new THREE.Vector3();
        const render = () => renderer?.render(scene, camera);
        const updateDepth = () => markerGroups.forEach((marker) => {
          marker.getWorldPosition(worldPosition);
          const frontness = THREE.MathUtils.clamp((worldPosition.z + 0.25) / (orbitRadius * 1.08), 0, 1);
          marker.userData.material.opacity = 0.34 + frontness * 0.56;
          marker.userData.haloMaterial.opacity = 0.2 + frontness * 0.4;
        });
        const updateLight = (index) => {
          const selected = markerGroups[wrapIndex(index)];
          selected.getWorldPosition(worldPosition);
          activeLight.position.copy(worldPosition);
        };
        const setRotation = (degrees) => {
          const radians = THREE.MathUtils.degToRad(degrees);
          composition.rotation.y = radians;
          globe.rotation.y = radians * 0.2;
          updateDepth();
          updateLight(activeIndexRef.current);
          render();
        };
        const setActive = (index) => {
          markerGroups.forEach((marker, markerIndex) => {
            marker.userData.material.emissiveIntensity = markerIndex === index ? 0.46 : 0.14;
          });
          updateDepth();
          updateLight(index);
          render();
        };

        resize = () => {
          if (cancelled) return;
          const bounds = frame.getBoundingClientRect();
          const width = Math.max(1, bounds.width);
          const height = Math.max(1, bounds.height);
          const aspect = width / height;
          camera.aspect = aspect;
          camera.fov = aspect < 0.9 ? 39 : 34;
          camera.position.z = aspect < 0.9 ? 8.65 : 8.8;
          camera.updateProjectionMatrix();
          composition.scale.setScalar(aspect < 0.9 ? 0.82 : 0.96);
          renderer.setSize(width, height, false);
          setRotation(trackRef.current.rotationY);
        };

        sceneRef.current = { renderer, scene, camera, setRotation, setActive, render };
        resize();
        setActive(activeIndexRef.current);
        resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
        resizeObserver?.observe(frame);
        if (!resizeObserver) window.addEventListener("resize", resize);
        if (!cancelled) setWebglReady(true);
      } catch {
        // A static SVG sphere remains visible if WebGL or Three.js is unavailable.
        stopResizeObservation();
        setFallbackRotation(trackRef.current.rotationY);
        disposeResources();
        setWebglReady(false);
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          start();
        }
      }, { rootMargin: "220px" });
      observer.observe(frame);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      disposeResources();
    };
  }, [activeIndexRef, frameRef, sceneRef, setFallbackRotation, trackRef]);

  return (
    <div className={`founder-carousel__scene${webglReady ? " is-webgl-ready" : ""}`} aria-hidden="true">
      <canvas className="founder-carousel__canvas" ref={canvasRef} />
      <SphereFallback activeIndex={activeIndex} rotation={trackRef.current.rotationY} />
    </div>
  );
}

export default function FounderRegister() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fallbackRotation, setFallbackRotation] = useState(0);
  const stageRef = useRef(null);
  const trackRef = useRef({ rotationY: 0 });
  const sceneRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const dragRef = useRef(null);
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef(null);
  const wheelHandlerRef = useRef(null);

  const applyRotation = () => {
    if (sceneRef.current) sceneRef.current.setRotation(trackRef.current.rotationY);
    else setFallbackRotation(trackRef.current.rotationY);
  };

  const animateTo = (index) => {
    const next = wrapIndex(index);
    activeIndexRef.current = next;
    setActiveIndex(next);
    const target = nearestEquivalentRotation(-next * TURN, trackRef.current.rotationY);
    gsap.killTweensOf(trackRef.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      trackRef.current.rotationY = target;
      applyRotation();
    } else {
      gsap.to(trackRef.current, {
        rotationY: target,
        duration: 0.92,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: applyRotation,
      });
    }
  };

  useEffect(() => {
    sceneRef.current?.setActive(activeIndex);
    sceneRef.current?.setRotation(trackRef.current.rotationY);
  }, [activeIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const handleWheel = (event) => wheelHandlerRef.current?.(event);
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, []);

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
    if (event.target instanceof Element && event.target.closest("button")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: trackRef.current.rotationY,
      moved: false,
    };
    gsap.killTweensOf(trackRef.current);
    try {
      stageRef.current?.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is best-effort; the pointer handlers still work inside the stage.
    }
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      drag.moved = true;
      setDragging(true);
    }
    if (!drag.moved) return;
    trackRef.current.rotationY = drag.startRotation + deltaX * 0.43;
    applyRotation();
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      const selectedRotation = nearestEquivalentRotation(-activeIndexRef.current * TURN, drag.startRotation);
      if (Math.abs(drag.startRotation - selectedRotation) > 0.5) animateTo(activeIndexRef.current);
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const draggedRotation = drag.startRotation + deltaX * 0.43;
    const next = wrapIndex(Math.round(-draggedRotation / TURN));
    setDragging(false);
    animateTo(next);
  };

  const onWheel = (event) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    event.preventDefault();
    event.stopPropagation();
    if (Math.abs(delta) < 12 || wheelLockRef.current) return;
    wheelLockRef.current = true;
    wheelTimerRef.current = window.setTimeout(() => { wheelLockRef.current = false; }, 460);
    animateTo(activeIndexRef.current + (delta > 0 ? 1 : -1));
  };
  wheelHandlerRef.current = onWheel;

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
      >
        <div className="founder-carousel__field" aria-hidden="true">
          <span className="founder-carousel__field-halo" />
          <FounderScene
            frameRef={stageRef}
            activeIndex={activeIndex}
            activeIndexRef={activeIndexRef}
            trackRef={trackRef}
            sceneRef={sceneRef}
            setFallbackRotation={setFallbackRotation}
          />
        </div>

        <div className="founder-carousel__sr-controls" role="group" aria-label="Select a founder">
          {founders.map((founder, index) => (
            <button
              type="button"
              key={founder.index}
              aria-label={`Founder ${founder.index} of ${founders.length}: ${founder.label}`}
              aria-pressed={activeIndex === index}
              aria-roledescription="slide"
              tabIndex={activeIndex === index ? 0 : -1}
              ref={(node) => { slideRefs.current[index] = node; }}
              onClick={() => animateTo(index)}
              onFocus={() => {
                if (!dragRef.current && activeIndexRef.current !== index) animateTo(index);
              }}
            >
              {founder.label}
            </button>
          ))}
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
