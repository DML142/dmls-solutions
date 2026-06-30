"use client";
import { useEffect, useRef } from "react";
import { Viaoda_Libre, Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import About from "./About";

gsap.registerPlugin(ScrollTrigger);

const viaodaLibre = Viaoda_Libre({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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

export default function HeroPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const tracesRef = useRef<Trace[]>([]);
  const nextIdRef = useRef(0);
  const lastSpawnPosRef = useRef({ x: 0, y: 0 });

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const arrowFillRef = useRef<SVGSVGElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // 1. ЭФФЕКТ GSAP ДЛЯ ТЕКСТА
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.4 },
    });

    tl.from(titleRef.current, {
      yPercent: 100,
      opacity: 0,
    }).from(
      subtitleRef.current,
      {
        yPercent: 100,
        opacity: 0,
      },
      "-=1.0"
    );
  }, []);

  useEffect(() => {
    if (!scrollContentRef.current || !arrowFillRef.current || !aboutRef.current) return;

    const triggerPoint = 300; 

    // 1. Стрелочка (остается без изменений)
    const arrowAnimation = gsap.to(arrowFillRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: {
        trigger: scrollContentRef.current,
        start: "top top",
        end: `+=${triggerPoint}`,
        scrub: true,
      },
    });

    // 2. ИСПРАВЛЕННАЯ АНИМАЦИЯ ОКНА ABOUT
    // Используем fromTo, чтобы жестко связать движение и прозрачность
    const aboutAnimation = gsap.fromTo(aboutRef.current,
      { 
        yPercent: 0, 
        autoAlpha: 0 // Стартовая точка: окно внизу и полностью невидимо
      },
      {
        yPercent: -100,
        autoAlpha: 1, // Конечная точка: окно поднялось и стало видимым
        duration: 0.7,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: scrollContentRef.current,
          start: `+=${triggerPoint} top`,
          toggleActions: "play none none reverse", // reverse теперь вернет и позицию, и прозрачность плавно!
        },
      }
    );

    return () => {
      arrowAnimation.scrollTrigger?.kill();
      aboutAnimation.scrollTrigger?.kill();
    };
  }, []);

  // 2. ЛОГИКА CANVAS
  useEffect(() => {
    const container = textContainerRef.current;

    if (!container) return;

    const rotateXTo = gsap.quickTo(container, "rotationX", { duration: 0.5, ease: "power2.out" });
    const rotateYTo = gsap.quickTo(container, "rotationY", { duration: 0.5, ease: "power2.out" });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // КЛЮЧЕВОЙ ФИКС:
    // Берём размер не из canvas.clientWidth/Height (который зависит от
    // CSS layout и может не успеть обновиться синхронно с zoom/resize),
    // а напрямую из window.innerWidth/innerHeight — канвас у нас всегда
    // полноэкранный (fixed inset-0 + absolute inset-0).
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Физический размер буфера — под реальные пиксели экрана
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // CSS-размер канваса задаём явно в JS (не полагаемся только на w-full h-full),
      // чтобы избежать рассинхрона между CSS layout и буфером
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Система координат рисования = CSS-пиксели
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    // window.resize надёжно срабатывает при изменении innerWidth/innerHeight,
    // а Ctrl+wheel zoom меняет dpr — это ловим отдельно через matchMedia
    window.addEventListener("resize", resizeCanvas);

    let mql = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDprChange = () => {
      resizeCanvas();
      mql = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mql.addEventListener("change", onDprChange, { once: true });
    };
    mql.addEventListener("change", onDprChange, { once: true });

    const GRAVITY = 1500;
    const getColor = () => `#000`;

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
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    let lastTime = performance.now();
    let animationFrameId: number;

    const update = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // clearRect должен покрывать весь буфер в физических пикселях,
      // но т.к. ctx уже масштабирован через setTransform(dpr,...),
      // достаточно очищать в CSS-координатах = window.innerWidth/Height
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // --- РЕНДЕР ЗВЕЗД ---
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

      // --- РЕНДЕР ТРЕЙСОВ ---
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
      window.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={scrollContentRef} className="relative w-full h-[150vh] bg-white">
      
      {/* Фиксированное окно Героя — всегда стоит на месте, пока идет скролл */}
      <div className="fixed inset-0 w-full overflow-hidden bg-white flex flex-col items-center justify-center select-none touch-pan-y z-10">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* Твои угловые изображения */}
        <div className="absolute top-24 left-6 pointer-events-none z-20 rotate-90">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} priority />
        </div>
        <div className="absolute top-24 right-6 pointer-events-none z-20 -rotate-90 -scale-x-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} priority />
        </div>
        <div className="absolute bottom-6 left-6 pointer-events-none z-20 rotate-90 -scale-x-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} />
        </div>
        <div className="absolute bottom-6 right-6 pointer-events-none z-20 rotate-90 -scale-100">
          <Image src="/vector1.png" alt="Corner pattern" width={60} height={60} />
        </div>

        {/* Центрированный 3D-блок с текстом */}
        <div className="text-center z-0 flex flex-col items-center justify-center perspective-[1000px] transform-3d">
          <div ref={textContainerRef} className="will-change-transform transform-3d">
            <div className="overflow-hidden py-2 px-1 binding-box">
              <h1 
                ref={titleRef} 
                className={`${viaodaLibre.className} [text-shadow:0_3px_5px_rgba(0,0,0,0.55)] text-black text-6xl md:text-[84px] leading-tight tracking-normal will-change-transform`}
              >
                DML_142
              </h1>
            </div>
            
            <div className="overflow-hidden pb-2 mt-4 binding-box">
              <p 
                ref={subtitleRef} 
                className={`${inter.className} [text-shadow:0_3px_3px_rgba(0,0,0,0.55)] text-black lg:text-xl text-sm font-light tracking-wide opacity-80 will-change-transform`}
              >
                Web frontend|backend developer
              </p>
            </div>
            <p className="pl-3 h-full absolute bottom-0 text-black">
              Ready for hire
            </p>
          </div>
        </div>

        {/* ИСПРАВЛЕННЫЙ БЛОК СТРЕЛКИ С CLIP-PATH */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
          <div className="relative w-5 h-6 mb-2">
            {/* 1. Серая фоновая стрелка */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full absolute inset-0">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            
            {/* 2. Черная стрелка, накладываемая поверх. Изначально обрезана на 100% сверху (скрыта) */}
            <svg 
              ref={arrowFillRef}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#000000" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-full h-full absolute inset-0"
              style={{ clipPath: "inset(100% 0% 0% 0%)" }}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          
          <div className={`${inter.className} text-[10px] font-light tracking-[0.3em] uppercase opacity-50 text-black`}>
            Scroll Down
          </div>
        </div>

      </div>

      {/* Секция About из другого файла — сидит под экраном (top-[100%]) и ждет своей очереди */}
      <About ref={aboutRef} />

    </div>
  );
}