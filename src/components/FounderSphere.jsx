import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders } from "../content.js";

function createFounderTexture(THREE, founder, index) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  const center = 320;

  const background = context.createRadialGradient(center, center, 28, center, center, 330);
  background.addColorStop(0, "#292621");
  background.addColorStop(0.64, "#191816");
  background.addColorStop(1, "#10100f");
  context.fillStyle = background;
  context.fillRect(0, 0, 640, 640);

  context.save();
  context.beginPath();
  context.arc(center, center, 304, 0, Math.PI * 2);
  context.clip();
  context.translate(center, center);
  context.rotate(index * 0.19);
  context.strokeStyle = "rgba(197, 168, 128, 0.23)";
  context.lineWidth = 1;
  for (let radius = 82; radius <= 286; radius += 34) {
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();
  }
  for (let ray = 0; ray < 16; ray += 1) {
    const angle = (Math.PI * 2 * ray) / 16;
    context.beginPath();
    context.moveTo(Math.cos(angle) * 82, Math.sin(angle) * 82);
    context.lineTo(Math.cos(angle) * 304, Math.sin(angle) * 304);
    context.stroke();
  }
  context.restore();

  context.beginPath();
  context.arc(center, center, 306, 0, Math.PI * 2);
  context.strokeStyle = "rgba(197, 168, 128, 0.82)";
  context.lineWidth = 3;
  context.stroke();
  context.beginPath();
  context.arc(center, center, 288, 0, Math.PI * 2);
  context.strokeStyle = "rgba(245, 243, 239, 0.24)";
  context.lineWidth = 1;
  context.stroke();

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(197, 168, 128, 0.96)";
  context.font = "500 23px Outfit, Arial, sans-serif";
  context.fillText("FOUNDER  /  " + founder.index, center, 214);

  context.fillStyle = "rgba(245, 243, 239, 0.94)";
  context.font = "400 70px Georgia, 'Times New Roman', serif";
  const labelLines = founder.placeholder
    ? ["Founder " + founder.index, "Name to be added"]
    : ["Vijay", "Williams"];
  context.fillText(labelLines[0], center, 304);
  context.fillText(labelLines[1], center, 386);

  context.fillStyle = "rgba(197, 168, 128, 0.72)";
  context.font = "500 19px Outfit, Arial, sans-serif";
  context.fillText("PINNACLE  /  DESIGN STUDIO", center, 475);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function nearestFounderIndex(nodes) {
  let index = 0;
  let depth = -Infinity;
  nodes.forEach((node, currentIndex) => {
    if (node.position.z > depth) {
      depth = node.position.z;
      index = currentIndex;
    }
  });
  return index;
}

export default function FounderSphere() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneApi = useRef(null);
  const captionRef = useRef(null);
  const controlsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    let observer;
    let disposed = false;
    let destroyScene;

    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return undefined;

    const startScene = async () => {
      if (disposed || sceneApi.current) return;
      try {
        const THREE = await import("three");
        if (disposed) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
        camera.position.set(0, 0, 7.2);
        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        const field = new THREE.Group();
        scene.add(field);
        const globe = new THREE.Group();
        field.add(globe);

        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xc5a880,
          transparent: true,
          opacity: 0.28,
          wireframe: false,
          depthWrite: false,
        });
        const orbitMaterialSoft = orbitMaterial.clone();
        orbitMaterialSoft.opacity = 0.12;
        const orbitGeometry = new THREE.TorusGeometry(2.05, 0.006, 6, 180);
        [0, Math.PI / 3, -Math.PI / 3].forEach((angle, index) => {
          const ring = new THREE.Mesh(orbitGeometry, index === 1 ? orbitMaterialSoft : orbitMaterial);
          ring.rotation.x = Math.PI / 2 + angle;
          globe.add(ring);
        });

        const coreGeometry = new THREE.IcosahedronGeometry(0.79, 2);
        const coreEdges = new THREE.EdgesGeometry(coreGeometry);
        const core = new THREE.LineSegments(
          coreEdges,
          new THREE.LineBasicMaterial({
            color: 0xc5a880,
            transparent: true,
            opacity: 0.23,
            depthWrite: false,
          }),
        );
        globe.add(core);

        const centerMark = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.19, 0),
          new THREE.MeshBasicMaterial({ color: 0xc5a880, transparent: true, opacity: 0.76 }),
        );
        globe.add(centerMark);

        const nodes = [];
        const textures = [];
        const geometries = [orbitGeometry, coreGeometry, coreEdges];
        const materials = [orbitMaterial, orbitMaterialSoft, core.material, centerMark.material];
        const sharedDisc = new THREE.CircleGeometry(0.68, 96);
        const sharedRim = new THREE.RingGeometry(0.69, 0.715, 96);
        geometries.push(sharedDisc, sharedRim);

        founders.forEach((founder, index) => {
          const angle = (Math.PI * 2 * index) / founders.length;
          const position = new THREE.Vector3(
            1.76 * Math.sin(angle),
            0.34 * Math.sin(angle * 2),
            1.76 * Math.cos(angle),
          );
          const normal = position.clone().normalize();
          const bubble = new THREE.Group();
          bubble.position.copy(position);
          bubble.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

          const texture = createFounderTexture(THREE, founder, index);
          textures.push(texture);
          const discMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            opacity: 0.92,
          });
          const disc = new THREE.Mesh(sharedDisc, discMaterial);
          disc.userData.founderIndex = index;
          bubble.add(disc);

          const rimMaterial = new THREE.MeshBasicMaterial({
            color: 0xc5a880,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const rim = new THREE.Mesh(sharedRim, rimMaterial);
          rim.position.z = 0.012;
          bubble.add(rim);
          globe.add(bubble);
          nodes.push({ bubble, disc, rim, index, position });
          materials.push(discMaterial, rimMaterial);
        });

        const starPositions = new Float32Array(260 * 3);
        for (let i = 0; i < 260; i += 1) {
          const radius = 2.6 + Math.random() * 1.6;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i * 3 + 1] = radius * Math.cos(phi);
          starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0xd0b892,
          size: 0.014,
          transparent: true,
          opacity: 0.52,
          depthWrite: false,
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        geometries.push(starGeometry);
        materials.push(starMaterial);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frame = 0;
        let hasInteracted = false;
        let lastFocus = -1;
        let lastFocusTime = 0;
        let drag = null;
        let snapTimer;
        let visible = true;

        const resize = () => {
          const width = Math.max(1, stage.clientWidth);
          const height = Math.max(1, stage.clientHeight);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stage);
        resize();

        const nearestToCamera = () => {
          let closest = 0;
          let furthestZ = -Infinity;
          const vector = new THREE.Vector3();
          nodes.forEach((node, index) => {
            node.bubble.getWorldPosition(vector);
            if (vector.z > furthestZ) {
              furthestZ = vector.z;
              closest = index;
            }
          });
          return closest;
        };

        const announceFocus = (index) => {
          if (index === lastFocus) return;
          lastFocus = index;
          setActiveIndex(index);
        };

        const snapTo = (index = nearestToCamera()) => {
          const position = nodes[index].position;
          const angle = Math.atan2(-position.x, position.z);
          const current = globe.rotation.y;
          const target = angle + Math.round((current - angle) / (Math.PI * 2)) * Math.PI * 2;
          gsap.killTweensOf(globe.rotation);
          if (reducedMotion) {
            globe.rotation.y = target;
            globe.rotation.x = 0;
            announceFocus(index);
            globe.updateMatrixWorld(true);
            renderer.render(scene, camera);
            return;
          }
          gsap.to(globe.rotation, {
            y: target,
            duration: 0.95,
            ease: "expo.out",
            onUpdate: () => announceFocus(index),
            onComplete: () => announceFocus(index),
          });
        };

        const focus = (index) => {
          if (index < 0 || index >= nodes.length) return;
          hasInteracted = true;
          announceFocus(index);
          snapTo(index);
        };

        const readRaycast = (event) => {
          const bounds = canvas.getBoundingClientRect();
          pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(nodes.map((node) => node.disc), false)[0];
          return hit?.object?.userData?.founderIndex;
        };

        const onPointerDown = (event) => {
          drag = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            moved: false,
            velocityX: 0,
            velocityY: 0,
          };
          canvas.setPointerCapture?.(event.pointerId);
          gsap.killTweensOf(globe.rotation);
          window.clearTimeout(snapTimer);
        };

        const onPointerMove = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          const dx = event.clientX - drag.x;
          const dy = event.clientY - drag.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
          if (!drag.moved) return;
          hasInteracted = true;
          globe.rotation.y += dx * 0.0072;
          globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + dy * 0.003, -0.28, 0.28);
          drag.velocityX = dx * 0.0072;
          drag.velocityY = dy * 0.003;
          drag.x = event.clientX;
          drag.y = event.clientY;
          announceFocus(nearestToCamera());
        };

        const onPointerUp = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          const didMove = drag.moved;
          const velocityX = drag.velocityX;
          const velocityY = drag.velocityY;
          const clickedIndex = !didMove ? readRaycast(event) : undefined;
          drag = null;
          if (clickedIndex !== undefined) {
            focus(clickedIndex);
            return;
          }
          if (didMove) {
            hasInteracted = true;
            const focusIndex = nearestToCamera();
            setActiveIndex(focusIndex);
            if (reducedMotion) {
              snapTo(focusIndex);
              return;
            }
            gsap.to(globe.rotation, {
              y: globe.rotation.y + velocityX * 12,
              x: THREE.MathUtils.clamp(globe.rotation.x + velocityY * 10, -0.28, 0.28),
              duration: 0.48,
              ease: "power2.out",
              onComplete: () => snapTo(),
            });
          } else {
            snapTo();
          }
        };

        const onWheel = (event) => {
          event.preventDefault();
          hasInteracted = true;
          gsap.killTweensOf(globe.rotation);
          globe.rotation.y += (event.deltaY + event.deltaX) * 0.00165;
          announceFocus(nearestToCamera());
          window.clearTimeout(snapTimer);
          snapTimer = window.setTimeout(() => snapTo(), 170);
        };

        const onVisibility = () => {
          visible = document.visibilityState !== "hidden";
        };

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);
        canvas.addEventListener("wheel", onWheel, { passive: false });
        document.addEventListener("visibilitychange", onVisibility);

        let lastTime = performance.now();
        const render = (now) => {
          frame = window.requestAnimationFrame(render);
          if (!visible) return;
          const elapsed = Math.min(32, now - lastTime);
          lastTime = now;
          if (!reducedMotion && !hasInteracted && !drag && !gsap.isTweening(globe.rotation)) {
            globe.rotation.y += elapsed * 0.00012;
            globe.rotation.z = Math.sin(now * 0.00016) * 0.018;
            core.rotation.y += elapsed * 0.00014;
            stars.rotation.y -= elapsed * 0.000008;
          }
          globe.updateMatrixWorld(true);
          const cameraVector = new THREE.Vector3();
          nodes.forEach((node) => {
            node.bubble.getWorldPosition(cameraVector);
            const depth = THREE.MathUtils.clamp((cameraVector.z + 1.6) / 3.2, 0.25, 1.12);
            node.bubble.scale.setScalar(0.77 + depth * 0.25);
            node.rim.material.opacity = 0.3 + depth * 0.6;
          });
          if (hasInteracted && now - lastFocusTime > 130) {
            lastFocusTime = now;
            announceFocus(nearestToCamera());
          }
          renderer.render(scene, camera);
        };
        frame = window.requestAnimationFrame(render);
        if (!reducedMotion) globe.rotation.y = -0.34;

        sceneApi.current = {
          focus,
          step: (direction) => {
            const current = lastFocus < 0 ? 0 : lastFocus;
            focus((current + direction + founders.length) % founders.length);
          },
        };

        destroyScene = () => {
          window.cancelAnimationFrame(frame);
          window.clearTimeout(snapTimer);
          resizeObserver.disconnect();
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          canvas.removeEventListener("wheel", onWheel);
          document.removeEventListener("visibilitychange", onVisibility);
          gsap.killTweensOf(globe.rotation);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          textures.forEach((texture) => texture.dispose());
          renderer.dispose();
          sceneApi.current = null;
        };
      } catch (error) {
        console.warn("The founders' 3D scene is unavailable; using its static fallback.", error);
        if (!disposed) setWebglFailed(true);
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startScene();
        }
      },
      { rootMargin: "260px 0px" },
    );
    observer.observe(stage);

    return () => {
      disposed = true;
      observer?.disconnect();
      destroyScene?.();
      sceneApi.current = null;
    };
  }, []);

  useEffect(() => {
    const caption = captionRef.current;
    if (!caption || activeIndex === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      caption,
      { autoAlpha: 0, y: 15, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.48, ease: "power3.out" },
    );
  }, [activeIndex]);

  const activeFounder = activeIndex === null ? null : founders[activeIndex];
  const focusFounder = (index) => {
    setActiveIndex(index);
    sceneApi.current?.focus(index);
  };
  const onControlsKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const buttons = [...(controlsRef.current?.querySelectorAll("button") || [])];
    const focusedIndex = buttons.indexOf(document.activeElement);
    const current = activeIndex ?? (focusedIndex >= 0 ? focusedIndex : 0);
    const next = (current + (event.key === "ArrowRight" ? 1 : -1) + founders.length) % founders.length;
    event.preventDefault();
    focusFounder(next);
    buttons[next]?.focus();
  };

  return (
    <div className={`founder-experience${webglFailed ? " founder-experience--fallback" : ""}`}>
      <div className="founder-orbit-stage" ref={stageRef} data-cursor="ROTATE">
        <div className="founder-orbit-stage__halo" aria-hidden="true" />
        <div className="founder-orbit-stage__crosshair" aria-hidden="true"><span /><span /></div>
        <canvas className="founder-orbit-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="founder-orbit-stage__fallback" aria-hidden="true">
          <span /><span /><span /><span /><i>05</i>
        </div>
        <span className="founder-orbit-stage__axis founder-orbit-stage__axis--left" aria-hidden="true">01 — 05 / ORBITAL INDEX</span>
        <span className="founder-orbit-stage__axis founder-orbit-stage__axis--right" aria-hidden="true">P / 05</span>
      </div>

      <div className="founder-orbit-caption" ref={captionRef} aria-live="polite" aria-atomic="true">
        {activeFounder && (
          <>
            <span className="founder-orbit-caption__index">{activeFounder.index} / 05</span>
            <strong className="founder-orbit-caption__name" key={activeFounder.index}>{activeFounder.label}</strong>
            <span className="founder-orbit-caption__role">Founder</span>
          </>
        )}
      </div>

      <div className="founder-orbit-controls" ref={controlsRef} role="group" aria-label="Select a founder in the interactive sphere" onKeyDown={onControlsKeyDown} data-cursor="SELECT">
        {founders.map((founder, index) => (
          <button
            className={`founder-orbit-control${activeIndex === index ? " is-active" : ""}`}
            key={founder.index}
            type="button"
            aria-label={`Show founder ${founder.index}: ${founder.label}`}
            aria-pressed={activeIndex === index}
            onClick={() => focusFounder(index)}
          >
            <span className="founder-orbit-control__index">{founder.index}</span>
            <span className="founder-orbit-control__name">{founder.label}</span>
          </button>
        ))}
      </div>

      <p className="founder-orbit-note">Drag or scroll the sphere to explore the leadership team steering our spatial architecture.</p>
    </div>
  );
}
