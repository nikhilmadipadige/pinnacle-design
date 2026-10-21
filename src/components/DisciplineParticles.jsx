import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const particles = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${(index * 43 + 9) % 97}%`,
  top: `${(index * 31 + 7) % 94}%`,
  size: index % 6 === 0 ? 3 : index % 3 === 0 ? 2 : 1.5,
}));

export default function DisciplineParticles() {
  const fieldRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const dots = [...field.querySelectorAll(".discipline__particle")];
      const loops = dots.map((dot, index) => gsap.fromTo(
        dot,
        { x: 0, y: 0, scale: 0.72, autoAlpha: 0.16 },
        {
          x: (index % 2 ? 1 : -1) * (8 + (index % 5) * 3),
          y: -(12 + (index % 7) * 4),
          scale: index % 4 === 0 ? 1.35 : 1.08,
          autoAlpha: 0.65,
          duration: 5.5 + (index % 6) * 1.1,
          delay: (index % 9) * 0.24,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        },
      ));
      const play = () => loops.forEach((loop) => loop.play());
      const pause = () => loops.forEach((loop) => loop.pause());
      const trigger = ScrollTrigger.create({
        trigger: field,
        start: "top bottom",
        end: "bottom top",
        onEnter: play,
        onEnterBack: play,
        onLeave: pause,
        onLeaveBack: pause,
      });
      if (ScrollTrigger.isInViewport(field)) play();

      return () => {
        trigger.kill();
        loops.forEach((loop) => loop.kill());
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div className="discipline__particles" ref={fieldRef} aria-hidden="true">
      {particles.map((particle) => (
        <span
          className="discipline__particle"
          key={particle.id}
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
        />
      ))}
    </div>
  );
}
