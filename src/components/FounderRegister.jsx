import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders, projects } from "../content.js";

const TURN = 360 / founders.length;
const TAU = Math.PI * 2;
const DISC_RADIUS = 1.3;
const DISC_ORBIT_RADIUS = 3.15;
const DISC_VERTICAL_RADIUS = 1.45;
const FALLBACK_DISC_RADIUS = 218;
const DISC_IMAGE_INDEX = [0, 1, 2, 0, 2];
const DISC_CROP_OFFSETS = [0, 0, 0, 0.13, -0.13];
const wrapIndex = (index) => (index + founders.length) % founders.length;
const nearestEquivalentRotation = (target, current) => target + 360 * Math.round((current - target) / 360);

function ImageDiscFallback({ activeIndex, rotation, verticalOffset }) {
  const discs = founders.map((_, index) => {
    const baseAngle = (index * TAU) / founders.length;
    const angle = (index * TAU) / founders.length + (rotation * Math.PI) / 180;
    const depth = (Math.cos(angle) + 1) / 2;
    const visibilityPosition = Math.max(0, Math.min(1, (depth - 0.2) / 0.35));
    const visibility = visibilityPosition * visibilityPosition * (3 - 2 * visibilityPosition);
    return {
      index,
      image: projects[DISC_IMAGE_INDEX[index]].image,
      cropAnchor: index === 3 ? "xMinYMid slice" : index === 4 ? "xMaxYMid slice" : "xMidYMid slice",
      x: 450 + Math.sin(angle) * 385,
      y: 270 + Math.sin(baseAngle) * 205 - (verticalOffset / DISC_VERTICAL_RADIUS) * 205,
      depth,
      visibility,
      scale: 0.24 + 0.76 * depth ** 2.4,
    };
  });

  return (
    <svg
      className="founder-carousel__fallback"
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {discs.map(({ index }) => (
          <clipPath id={`founder-disc-clip-${index}`} key={index}>
            <circle r={FALLBACK_DISC_RADIUS - 3} />
          </clipPath>
        ))}
      </defs>
      {discs
        .sort((a, b) => a.depth - b.depth)
        .map(({ index, image, cropAnchor, x, y, depth, visibility, scale }) => (
          <g
            key={index}
            data-founder-index={index}
            transform={`translate(${x} ${y}) scale(${scale})`}
            opacity={visibility}
            className={index === activeIndex ? "founder-carousel__fallback-disc is-active" : "founder-carousel__fallback-disc"}
          >
            <circle r={FALLBACK_DISC_RADIUS + 3} className="founder-carousel__fallback-disc-shadow" />
            <image
              href={image}
              x={-(FALLBACK_DISC_RADIUS - 3)}
              y={-(FALLBACK_DISC_RADIUS - 3)}
              width={(FALLBACK_DISC_RADIUS - 3) * 2}
              height={(FALLBACK_DISC_RADIUS - 3) * 2}
              preserveAspectRatio={cropAnchor}
              clipPath={`url(#founder-disc-clip-${index})`}
              className="founder-carousel__fallback-image"
              style={{ "--disc-brightness": 0.42 + depth * 0.58 }}
            />
            <circle r={FALLBACK_DISC_RADIUS - 3} className="founder-carousel__fallback-disc-edge" />
          </g>
        ))}
    </svg>
  );
}

function FounderScene({ frameRef, activeIndex, activeIndexRef, trackRef, sceneRef, setFallbackTransform, fallbackTransform }) {
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
    const textures = [];

    const stopResizeObservation = () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (resize) window.removeEventListener("resize", resize);
    };

    const disposeResources = () => {
      stopResizeObservation();
      const disposedScene = scene;
      if (disposedScene) {
        const disposedGeometries = new Set();
        disposedScene.traverse((object) => {
          if (object.geometry && !disposedGeometries.has(object.geometry)) {
            disposedGeometries.add(object.geometry);
            object.geometry.dispose?.();
          }
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
          else object.material?.dispose?.();
        });
        scene = null;
      }
      textures.splice(0).forEach((texture) => texture.dispose?.());
      renderer?.dispose();
      renderer = null;
      if (sceneRef.current?.scene === disposedScene) sceneRef.current = null;
    };

    const onContextLost = (event) => {
      event.preventDefault();
      cancelled = true;
      setFallbackTransform({ ...trackRef.current });
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

        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
        camera.position.set(0, 0, 8.8);
        camera.lookAt(0, 0, 0);

        const loader = new THREE.TextureLoader();
        const loadedTextures = await Promise.all(
          projects.map(async (project) => {
            try {
              const texture = await loader.loadAsync(project.image);
              textures.push(texture);
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
              return texture;
            } catch {
              return null;
            }
          }),
        );
        if (cancelled) {
          disposeResources();
          return;
        }
        const fallbackTexture = loadedTextures.find(Boolean);
        if (!fallbackTexture) throw new Error("Founder imagery could not be loaded");

        const composition = new THREE.Group();
        scene.add(composition);
        const discGeometry = new THREE.CircleGeometry(DISC_RADIUS, 72);
        const underlayGeometry = new THREE.CircleGeometry(DISC_RADIUS + 0.035, 72);
        const edgeGeometry = new THREE.RingGeometry(DISC_RADIUS - 0.009, DISC_RADIUS + 0.003, 72);
        const underlayMaterial = new THREE.MeshBasicMaterial({
          color: 0x080909,
          side: THREE.DoubleSide,
          depthWrite: true,
        });
        const discPositions = founders.map((_, index) => {
          const angle = (index / founders.length) * TAU;
          return new THREE.Vector3(
            Math.sin(angle) * DISC_ORBIT_RADIUS,
            -Math.sin(angle) * DISC_VERTICAL_RADIUS,
            Math.cos(angle) * DISC_ORBIT_RADIUS,
          );
        });
        const discs = founders.map((_, index) => {
          const texture = loadedTextures[DISC_IMAGE_INDEX[index]] ?? fallbackTexture;
          const material = new THREE.ShaderMaterial({
            uniforms: {
              uMap: { value: texture },
              uAspect: { value: texture.image.width / texture.image.height },
              uCropOffset: { value: new THREE.Vector2(DISC_CROP_OFFSETS[index], 0) },
              uBrightness: { value: 1 },
              uOpacity: { value: 1 },
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D uMap;
              uniform float uAspect;
              uniform vec2 uCropOffset;
              uniform float uBrightness;
              uniform float uOpacity;
              varying vec2 vUv;
              void main() {
                vec2 sampleUv = vUv - 0.5;
                if (uAspect > 1.0) {
                  sampleUv.x /= uAspect;
                } else {
                  sampleUv.y *= uAspect;
                }
                sampleUv += 0.5 + uCropOffset;
                vec3 source = texture2D(uMap, sampleUv).rgb;
                float luminance = dot(source, vec3(0.2126, 0.7152, 0.0722));
                float contrast = clamp((luminance - 0.36) * 1.35 + 0.5, 0.0, 1.0);
                float vignette = smoothstep(0.72, 0.18, length(vUv - 0.5));
                float imageTone = contrast * (0.84 + 0.16 * vignette) * uBrightness;
                gl_FragColor = vec4(vec3(imageTone), uOpacity);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
              }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          });

          const disc = new THREE.Group();
          disc.position.copy(discPositions[index]);
          disc.userData.index = index;
          disc.userData.imageMaterial = material;

          const underlay = new THREE.Mesh(underlayGeometry, underlayMaterial);
          underlay.position.z = -0.014;
          disc.add(underlay);

          const image = new THREE.Mesh(discGeometry, material);
          image.position.z = 0.002;
          disc.add(image);

          const edge = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
            color: 0xd7dcdd,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide,
            depthWrite: false,
            toneMapped: false,
          }));
          edge.position.z = 0.012;
          disc.add(edge);
          disc.userData.edgeMaterial = edge.material;

          composition.add(disc);
          return disc;
        });

        const worldPosition = new THREE.Vector3();
        const faceDirection = new THREE.Vector3();
        const forward = new THREE.Vector3(0, 0, 1);
        const facingQuaternion = new THREE.Quaternion();
        const inverseCompositionQuaternion = new THREE.Quaternion();
        const render = () => renderer?.render(scene, camera);
        const updateDepth = () => discs.forEach((disc) => {
          disc.getWorldPosition(worldPosition);
          const frontness = THREE.MathUtils.clamp((worldPosition.z + DISC_ORBIT_RADIUS) / (2 * DISC_ORBIT_RADIUS), 0, 1);
          const visibility = THREE.MathUtils.smoothstep(frontness, 0.2, 0.55);
          disc.scale.setScalar(0.24 + 0.76 * frontness ** 2.4);
          disc.userData.imageMaterial.uniforms.uBrightness.value = 0.26 + frontness * 0.74;
          disc.userData.imageMaterial.uniforms.uOpacity.value = visibility;
          disc.userData.edgeMaterial.opacity = visibility * 0.28;
          faceDirection.copy(camera.position).sub(worldPosition).normalize();
          facingQuaternion.setFromUnitVectors(forward, faceDirection);
          inverseCompositionQuaternion.copy(composition.quaternion).invert();
          disc.quaternion.copy(inverseCompositionQuaternion).multiply(facingQuaternion);
        });
        const setTransform = (degrees, verticalOffset) => {
          composition.rotation.y = THREE.MathUtils.degToRad(degrees);
          composition.position.y = verticalOffset;
          updateDepth();
          render();
        };
        const setActive = () => {
          updateDepth();
          render();
        };

        resize = () => {
          if (cancelled) return;
          const bounds = frame.getBoundingClientRect();
          const width = Math.max(1, bounds.width);
          const height = Math.max(1, bounds.height);
          const aspect = width / height;
          camera.aspect = aspect;
          camera.fov = aspect < 0.9 ? 39 : aspect < 1.25 ? 36 : 34;
          camera.position.z = aspect < 0.9 ? 8.8 : aspect < 1.25 ? 9.1 : 8.8;
          camera.updateProjectionMatrix();
          composition.scale.setScalar(aspect < 0.9 ? 0.95 : aspect < 1.25 ? 0.96 : 1);
          composition.position.x = window.matchMedia("(max-width: 760px)").matches
            ? 0
            : aspect < 1.15 ? -0.7 : -1.25;
          renderer.setSize(width, height, false);
          setTransform(trackRef.current.rotationY, trackRef.current.positionY);
        };

        sceneRef.current = {
          renderer,
          scene,
          camera,
          setTransform,
          setActive,
          centerOffset: (index) => -discPositions[wrapIndex(index)].y,
          render,
        };
        resize();
        setActive(activeIndexRef.current);
        resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
        resizeObserver?.observe(frame);
        if (!resizeObserver) window.addEventListener("resize", resize);
        if (!cancelled) setWebglReady(true);
      } catch {
        stopResizeObservation();
        setFallbackTransform({ ...trackRef.current });
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
  }, [activeIndexRef, frameRef, sceneRef, setFallbackTransform, trackRef]);

  return (
    <div className={`founder-carousel__scene${webglReady ? " is-webgl-ready" : ""}`} aria-hidden="true">
      <canvas className="founder-carousel__canvas" ref={canvasRef} />
      <ImageDiscFallback
        activeIndex={activeIndex}
        rotation={fallbackTransform.rotationY}
        verticalOffset={fallbackTransform.positionY}
      />
    </div>
  );
}

export default function FounderRegister() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fallbackTransform, setFallbackTransform] = useState({ rotationY: 0, positionY: 0 });
  const stageRef = useRef(null);
  const trackRef = useRef({ rotationY: 0, positionY: 0 });
  const sceneRef = useRef(null);
  const slideRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const dragRef = useRef(null);
  const wheelLockRef = useRef(false);
  const wheelTimerRef = useRef(null);
  const wheelHandlerRef = useRef(null);

  const applyTransform = () => {
    if (sceneRef.current) sceneRef.current.setTransform(trackRef.current.rotationY, trackRef.current.positionY);
    else setFallbackTransform({ ...trackRef.current });
  };

  const animateTo = (index) => {
    const next = wrapIndex(index);
    activeIndexRef.current = next;
    const target = nearestEquivalentRotation(-next * TURN, trackRef.current.rotationY);
    const targetOffset = sceneRef.current?.centerOffset(next)
      ?? Math.sin((next * TAU) / founders.length) * DISC_VERTICAL_RADIUS;
    gsap.killTweensOf(trackRef.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      trackRef.current.rotationY = target;
      trackRef.current.positionY = targetOffset;
      setActiveIndex(next);
      applyTransform();
    } else {
      gsap.to(trackRef.current, {
        rotationY: target,
        positionY: targetOffset,
        duration: 0.94,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: applyTransform,
        onComplete: () => {
          if (activeIndexRef.current === next) setActiveIndex(next);
        },
      });
    }
  };

  useEffect(() => {
    sceneRef.current?.setActive(activeIndex);
    sceneRef.current?.setTransform(trackRef.current.rotationY, trackRef.current.positionY);
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
    applyTransform();
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
    if (Math.abs(delta) < 12) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      animateTo(activeIndexRef.current + (delta > 0 ? 1 : -1));
      return;
    }
    if (wheelLockRef.current) return;
    wheelLockRef.current = true;
    window.clearTimeout(wheelTimerRef.current);
    wheelTimerRef.current = window.setTimeout(() => { wheelLockRef.current = false; }, 1000);
    animateTo(activeIndexRef.current + (delta > 0 ? 1 : -1));
  };
  wheelHandlerRef.current = onWheel;

  const nextIndex = wrapIndex(activeIndexRef.current + 1);
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
          <FounderScene
            frameRef={stageRef}
            activeIndex={activeIndex}
            activeIndexRef={activeIndexRef}
            trackRef={trackRef}
            sceneRef={sceneRef}
            setFallbackTransform={setFallbackTransform}
            fallbackTransform={fallbackTransform}
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
            <h3 className="founder-carousel__name">{activeFounder.label}</h3>
            <p className="founder-carousel__role">Founder</p>
            <span className="founder-carousel__philosophy-label">Design philosophy</span>
            <p className="founder-carousel__philosophy">
              Every line has a purpose; every divider, shelf, and ceiling recess is calculated to direct flow and focus.
            </p>
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
