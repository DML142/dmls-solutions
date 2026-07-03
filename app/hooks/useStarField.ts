"use client";
import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";

interface Star {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  createdAt: number;
  angle: number;
  va: number;
  lifetime: number;
}

interface Trace {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  createdAt: number;
  lifetime: number;
}

const GRAVITY = 1500;

const drawStarShape = (
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  context.beginPath();
  context.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    context.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    context.lineTo(x, y);
    rot += step;
  }
  context.lineTo(cx, cy - outerRadius);
  context.closePath();
};

// Renders a black-star trail on a fullscreen canvas that follows the pointer,
// and tilts `containerRef` in 3D based on pointer position relative to its center.
export function useStarField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const starsRef = useRef<Star[]>([]);
  const tracesRef = useRef<Trace[]>([]);
  const nextIdRef = useRef(0);
  const lastSpawnPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rotateXTo = gsap.quickTo(container, "rotationX", { duration: 0.5, ease: "power2.out" });
    const rotateYTo = gsap.quickTo(container, "rotationY", { duration: 0.5, ease: "power2.out" });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size the canvas from window.innerWidth/innerHeight (not canvas.clientWidth/Height)
    // because the canvas is always fullscreen (fixed inset-0) and clientWidth can lag
    // behind CSS layout during a synchronous zoom/resize.
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Draw in CSS-pixel coordinates regardless of the physical buffer size.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    // window resize catches innerWidth/innerHeight changes; Ctrl+wheel zoom only
    // changes devicePixelRatio, which is caught separately via matchMedia.
    window.addEventListener("resize", resizeCanvas);

    let mql = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDprChange = () => {
      resizeCanvas();
      mql = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mql.addEventListener("change", onDprChange, { once: true });
    };
    mql.addEventListener("change", onDprChange, { once: true });

    const getColor = () => `#000`;

    const handleMove = (clientX: number, clientY: number) => {
      const now = performance.now();
      const lastPos = lastSpawnPosRef.current;

      const dx = clientX - lastPos.x;
      const dy = clientY - lastPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 35) return;

      lastSpawnPosRef.current = { x: clientX, y: clientY };

      const starAngle = Math.random() * Math.PI * 2;
      const starSpeed = Math.random() * 250 + 150;

      starsRef.current.push({
        id: nextIdRef.current++,
        x: clientX,
        y: clientY,
        vx: Math.cos(starAngle) * starSpeed,
        vy: Math.sin(starAngle) * starSpeed - 100,
        size: Math.random() * 12 + 14,
        color: getColor(),
        createdAt: now,
        angle: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 4,
        lifetime: Math.random() * 0.2 + 0.3,
      });

      for (let i = 0; i < 2; i++) {
        const traceAngle = Math.random() * Math.PI * 2;
        const traceSpeed = Math.random() * 300 + 100;

        tracesRef.current.push({
          id: nextIdRef.current++,
          x: clientX,
          y: clientY,
          vx: Math.cos(traceAngle) * traceSpeed,
          vy: Math.sin(traceAngle) * traceSpeed - 50,
          color: getColor(),
          createdAt: now,
          lifetime: Math.random() * 0.2 + 0.3,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const percentX = (e.clientX - centerX) / (window.innerWidth / 2);
      const percentY = (e.clientY - centerY) / (window.innerHeight / 2);

      const maxTilt = 15;

      rotateXTo(-percentY * maxTilt);
      rotateYTo(percentX * maxTilt);

      handleMove(e.clientX, e.clientY);
    };

    const onMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { left, top, width, height } = container.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const percentX = (touch.clientX - centerX) / (window.innerWidth / 2);
        const percentY = (touch.clientY - centerY) / (window.innerHeight / 2);

        const maxTilt = 15;

        rotateXTo(-percentY * maxTilt);
        rotateYTo(percentX * maxTilt);

        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let lastTime = performance.now();
    let animationFrameId: number;

    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // ctx is scaled via setTransform(dpr, ...), so clearing the raw buffer
      // dimensions requires resetting the transform first.
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;

      starsRef.current = starsRef.current.filter((star) => {
        const age = (time - star.createdAt) / 1000;
        if (age >= star.lifetime) return false;

        star.vy += GRAVITY * dt;
        star.x += star.vx * dt;
        star.y += star.vy * dt;
        star.angle += star.va * dt;

        const alpha = 1 - age / star.lifetime;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;

        ctx.translate(star.x, star.y);
        ctx.rotate(star.angle);

        drawStarShape(ctx, 0, 0, 5, star.size, star.size / 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      tracesRef.current = tracesRef.current.filter((trace) => {
        const age = (time - trace.createdAt) / 1000;
        if (age >= trace.lifetime) return false;

        trace.vy += GRAVITY * dt;
        trace.x += trace.vx * dt;
        trace.y += trace.vy * dt;

        const alpha = 1 - age / trace.lifetime;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = trace.color;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(trace.x, trace.y);
        ctx.lineTo(trace.x - trace.vx * 0.03, trace.y - trace.vy * 0.03);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      mql.removeEventListener("change", onDprChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, containerRef]);
}
