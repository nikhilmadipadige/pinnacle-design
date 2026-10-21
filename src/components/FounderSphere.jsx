import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { founders } from "../content.js";

function createFiligreeTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const field = context.createLinearGradient(0, 0, 1024, 512);
  field.addColorStop(0, "#39352f");
  field.addColorStop(0.48, "#4a3e2e");
  field.addColorStop(1, "#211e19");
  context.fillStyle = field;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(245, 222, 184, 0.25)";
  context.lineWidth = 1.1;
  for (let row = 0; row < 10; row += 1) {
    const y = 22 + row * 52;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(240, y - 34, 480, y + 31, 720, y - 8);
    context.bezierCurveTo(850, y - 22, 930, y + 15, 1024, y - 2);
    context.stroke();
  }
  context.strokeStyle = "rgba(245, 243, 239, 0.11)";
  for (let column = -4; column < 14; column += 1) {
    context.beginPath();
    context.ellipse(column * 86 + 35, 256, 70, 285, 0, 0, Math.PI * 2);
    context.stroke();
  }
  context.strokeStyle = "rgba(226, 195, 146, 0.6)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 256);
  context.lineTo(420, 256);
  context.lineTo(515, 151);
  context.lineTo(1024, 151);
  context.stroke();
  context.fillStyle = "rgba(245, 243, 239, 0.72)";
  [[420, 256], [515, 151], [760, 151]].forEach(([x, y]) => {
    context.beginPath();
    context.arc(x, y, 3, 0, Math.PI * 2);
    context.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function FounderSphere() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneApi = useRef(null);
  const captionRef = useRef(null);
  const controlsRef = useRef(null);
  const activeIndexRef = useRef(null);
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
        scene.background = null;
        scene.fog = new THREE.FogExp2(0x121212, 0.022);
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
        camera.position.set(0, 0, 7.65);

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.04;
        renderer.setClearColor(0x121212, 0);

        scene.add(new THREE.AmbientLight(0xf5f3ef, 1.12));
        const keyLight = new THREE.DirectionalLight(0xc5a880, 2.2);
        keyLight.position.set(-3.2, 4.1, 5.4);
        scene.add(keyLight);
        const fillLight = new THREE.PointLight(0xf5f3ef, 1.35, 11);
        fillLight.position.set(3.4, -1.6, 3.6);
        scene.add(fillLight);
        const rimLight = new THREE.PointLight(0x60746c, 1.2, 13);
        rimLight.position.set(-4.2, -2.2, -3.4);
        scene.add(rimLight);

        const field = new THREE.Group();
        scene.add(field);
        const globe = new THREE.Group();
        field.add(globe);

        const geometries = [];
        const materials = [];
        const textures = [];
        const orbitGeometry = new THREE.TorusGeometry(2.03, 0.005, 6, 220);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xc5a880,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        });
        const orbitMaterialFine = orbitMaterial.clone();
        orbitMaterialFine.opacity = 0.09;
        geometries.push(orbitGeometry);
        materials.push(orbitMaterial, orbitMaterialFine);
        [0, Math.PI / 3, -Math.PI / 3].forEach((angle, index) => {
          const ring = new THREE.Mesh(orbitGeometry, index === 1 ? orbitMaterialFine : orbitMaterial);
          ring.rotation.x = Math.PI / 2 + angle;
          globe.add(ring);
        });

        const coreGeometry = new THREE.IcosahedronGeometry(0.9, 2);
        const coreEdges = new THREE.EdgesGeometry(coreGeometry);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x28241e,
          metalness: 0.64,
          roughness: 0.33,
          clearcoat: 0.8,
          clearcoatRoughness: 0.24,
          emissive: 0x130f09,
          emissiveIntensity: 0.22,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        const coreWire = new THREE.LineSegments(
          coreEdges,
          new THREE.LineBasicMaterial({ color: 0xc5a880, transparent: true, opacity: 0.27, depthWrite: false }),
        );
        globe.add(core, coreWire);
        geometries.push(coreGeometry, coreEdges);
        materials.push(coreMaterial, coreWire.material);

        const nodeRadius = 0.46;
        const nodeGeometry = new THREE.SphereGeometry(nodeRadius, 48, 32);
        const wireGeometry = new THREE.SphereGeometry(nodeRadius * 1.008, 26, 18);
        const bandGeometry = new THREE.TorusGeometry(nodeRadius * 1.04, 0.006, 8, 96);
        const filigree = createFiligreeTexture(THREE);
        textures.push(filigree);
        const nodeMaterial = new THREE.MeshPhysicalMaterial({
          map: filigree,
          color: 0xe8d6b9,
          metalness: 0.27,
          roughness: 0.25,
          clearcoat: 0.96,
          clearcoatRoughness: 0.12,
          emissive: 0x342515,
          emissiveMap: filigree,
          emissiveIntensity: 0.18,
        });
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: 0xf0dcb8,
          wireframe: true,
          transparent: true,
          opacity: 0.065,
          depthWrite: false,
        });
        const bandMaterial = new THREE.MeshBasicMaterial({
          color: 0xc5a880,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        });
        geometries.push(nodeGeometry, wireGeometry, bandGeometry);
        materials.push(nodeMaterial, wireMaterial, bandMaterial);

        const nodes = [];
        founders.forEach((founder, index) => {
          const y = 1 - (2 * (index + 0.5)) / founders.length;
          const radial = Math.sqrt(1 - y * y);
          const theta = index * Math.PI * (3 - Math.sqrt(5));
          const position = new THREE.Vector3(
            1.66 * radial * Math.cos(theta),
            1.66 * y,
            1.66 * radial * Math.sin(theta),
          );
          const bubble = new THREE.Group();
          bubble.position.copy(position);
          bubble.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());

          const orb = new THREE.Mesh(nodeGeometry, nodeMaterial);
          orb.userData.founderIndex = index;
          const wire = new THREE.Mesh(wireGeometry, wireMaterial);
          const band = new THREE.Mesh(bandGeometry, bandMaterial);
          band.rotation.x = Math.PI / 2.8;
          bubble.add(orb, wire, band);
          globe.add(bubble);
          nodes.push({ bubble, orb, index, position, band });
        });

        const starPositions = new Float32Array(320 * 3);
        for (let i = 0; i < 320; i += 1) {
          const radius = 2.55 + Math.random() * 2.25;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i * 3 + 1] = radius * Math.cos(phi);
          starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0xc5a880,
          size: 0.012,
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
          camera.position.z = width < 520 ? 8.7 : width < 850 ? 8.1 : 7.65;
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
          activeIndexRef.current = index;
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
            globe.rotation.z = 0;
            announceFocus(index);
            globe.updateMatrixWorld(true);
            renderer.render(scene, camera);
            return;
          }
          gsap.to(globe.rotation, {
            y: target,
            x: 0,
            z: 0,
            duration: 1.08,
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
          const hit = raycaster.intersectObjects(nodes.map((node) => node.orb), false)[0];
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
            announceFocus(focusIndex);
            if (reducedMotion) {
              snapTo(focusIndex);
              return;
            }
            gsap.to(globe.rotation, {
              y: globe.rotation.y + velocityX * 12,
              x: THREE.MathUtils.clamp(globe.rotation.x + velocityY * 10, -0.28, 0.28),
              duration: 0.52,
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
          globe.rotation.y += (event.deltaY + event.deltaX) * 0.00155;
          announceFocus(nearestToCamera());
          window.clearTimeout(snapTimer);
          snapTimer = window.setTimeout(() => snapTo(), 180);
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

        const render = (now) => {
          frame = window.requestAnimationFrame(render);
          if (!visible) return;
          if (!reducedMotion && !hasInteracted && !drag && !gsap.isTweening(globe.rotation)) {
            globe.rotation.y += 0.00012 * Math.min(32, now - (render.lastTime || now));
            globe.rotation.z = Math.sin(now * 0.00015) * 0.012;
            core.rotation.y += 0.00014 * Math.min(32, now - (render.lastTime || now));
            stars.rotation.y -= 0.000008 * Math.min(32, now - (render.lastTime || now));
          }
          render.lastTime = now;
          globe.updateMatrixWorld(true);
          nodes.forEach((node) => {
            node.bubble.rotation.z = Math.sin(now * 0.00034 + node.index * 1.7) * 0.03;
          });
          renderer.render(scene, camera);
        };
        frame = window.requestAnimationFrame(render);
        if (!reducedMotion) globe.rotation.y = -0.34;
        stage.classList.add("is-ready");

        sceneApi.current = {
          focus,
          step: (direction) => {
            const current = activeIndexRef.current ?? 0;
            focus((current + direction + founders.length) % founders.length);
          },
        };
        if (activeIndexRef.current !== null) focus(activeIndexRef.current);

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
          stage.classList.remove("is-ready");
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
      { rootMargin: "300px 0px" },
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
      { autoAlpha: 0, y: 12, filter: "blur(5px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power3.out" },
    );
  }, [activeIndex]);

  const activeFounder = activeIndex === null ? null : founders[activeIndex];
  const focusFounder = (index) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    sceneApi.current?.focus(index);
  };
  const onControlsKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    const buttons = [...(controlsRef.current?.querySelectorAll("button") || [])];
    const focusedIndex = buttons.indexOf(document.activeElement);
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = founders.length - 1;
    else {
      const current = activeIndex ?? (focusedIndex >= 0 ? focusedIndex : 0);
      next = (current + (event.key === "ArrowRight" ? 1 : -1) + founders.length) % founders.length;
    }
    event.preventDefault();
    focusFounder(next);
    buttons[next]?.focus();
  };

  return (
    <div className={`founder-experience${webglFailed ? " founder-experience--fallback" : ""}`}>
      <div
        className="founder-orbit-stage"
        ref={stageRef}
        role="group"
        aria-label="Interactive orbit of the five founders"
        aria-describedby="founder-orbit-note"
      >
        <div className="founder-orbit-stage__fallback" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <canvas className="founder-orbit-canvas" ref={canvasRef} aria-hidden="true" />
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

      <div className="founder-orbit-controls" ref={controlsRef} role="group" aria-label="Select a founder in the interactive sphere" onKeyDown={onControlsKeyDown}>
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

      <p className="founder-orbit-note" id="founder-orbit-note">Drag or scroll the sphere to explore the leadership team steering our spatial architecture.</p>
    </div>
  );
}
