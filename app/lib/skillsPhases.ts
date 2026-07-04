export type SkillPhaseIndex = 0 | 1 | 2;

export const PHASE_COUNT = 3;

// Within each logo's own third of the scroll range: slide+spin in, hold
// static, then continue sliding out. Tunable later per the design's open
// question on exact timing feel.
export const ENTER_END = 0.35;
export const HOLD_END = 0.65;

export interface SkillsPhaseState {
  phase: SkillPhaseIndex;
  localProgress: number;
}

// Maps overall Skills-section scroll progress (0..1) to which phase is
// "current" and how far through that phase's own third we are.
export function getSkillsPhase(progress: number): SkillsPhaseState {
  const clamped = Math.min(Math.max(progress, 0), 1 - Number.EPSILON);
  const scaled = clamped * PHASE_COUNT;
  const phase = Math.floor(scaled) as SkillPhaseIndex;
  const localProgress = scaled - phase;
  return { phase, localProgress };
}

// 1 = enters from the left moving right; -1 = enters from the right moving left.
export type LogoDirection = 1 | -1;

export const LOGO_DIRECTIONS: Record<SkillPhaseIndex, LogoDirection> = {
  0: 1, // Next.js
  1: -1, // NestJS
  2: 1, // Other (Three.js)
};

export const SKILL_TITLES: Record<SkillPhaseIndex, string> = {
  0: "NEXTJS",
  1: "NESTJS",
  2: "OTHER",
};

export const SKILL_DESCRIPTIONS: Record<SkillPhaseIndex, string> = {
  0: "Building fast, full-stack React apps with the App Router, server components, and typed API routes.",
  1: "Structuring backend services with modules, controllers, and dependency injection for maintainable APIs.",
  2: "Rounding things out with GSAP, Three.js, and React Three Fiber for scroll-driven, interactive 3D on the web.",
};

// A logo's own continuous progress across the *entire* scroll range: 0
// before its phase starts, animates 0 -> 1 during its phase, then stays at
// 1 for the rest of the scroll (parked off-stage, not just during its own
// phase window).
export function getLogoProgress(progress: number, logoIndex: SkillPhaseIndex): number {
  const scaled = progress * PHASE_COUNT - logoIndex;
  return Math.min(Math.max(scaled, 0), 1);
}

export interface LogoTransform {
  x: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

// Cubic ease-in-out so the slide and spin start/stop gently instead of
// snapping at the phase edges — this is what makes the motion read as
// smooth rather than mechanical/linear.
function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Gentle multi-axis tumble: one clean full revolution on Y (always returns
// to face front) with a small secondary tilt on X and Z for dimensionality.
// Kept low-magnitude so it reads as a calm turn, not a chaotic spin.
const SPIN_Y = Math.PI * 2;
const TILT_X = Math.PI * 0.22;
const TILT_Z = Math.PI * 0.16;

// Derives a logo's world-space x offset and tumble from its own continuous
// progress and fixed direction. It spins the same gentle amount both on the
// way in (settling level exactly at the hold position) and on the way out
// (continuing in the same direction, per spec "hides in place"), so the
// logo is never motionless while visible except during the hold itself.
export function getLogoTransform(
  logoProgress: number,
  direction: LogoDirection,
  offstageX: number
): LogoTransform {
  if (logoProgress <= ENTER_END) {
    // remaining: 1 fully off-stage → 0 settled at center (eased).
    const remaining = 1 - smootherstep(logoProgress / ENTER_END);
    return {
      x: -direction * offstageX * remaining,
      rotationX: TILT_X * remaining,
      rotationY: direction * SPIN_Y * remaining,
      rotationZ: -direction * TILT_Z * remaining,
    };
  }

  if (logoProgress <= HOLD_END) {
    return { x: 0, rotationX: 0, rotationY: 0, rotationZ: 0 };
  }

  // t: 0 leaving the hold → 1 fully off-stage again (eased).
  const t = smootherstep((logoProgress - HOLD_END) / (1 - HOLD_END));
  return {
    x: direction * offstageX * t,
    rotationX: TILT_X * t,
    rotationY: direction * SPIN_Y * t,
    rotationZ: direction * TILT_Z * t,
  };
}

function ramp(edge0: number, edge1: number, x: number): number {
  return Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
}

const CARD_FADE = 0.14;

// Scrub-driven card opacity: fades in as the logo settles into its hold
// position and fades out as it starts exiting — a pure function of scroll,
// so reversing the scroll exactly reverses the fade (no pop, no timers).
export function getCardOpacity(localProgress: number): number {
  const fadeIn = ramp(ENTER_END, ENTER_END + CARD_FADE, localProgress);
  const fadeOut = 1 - ramp(HOLD_END, HOLD_END + CARD_FADE, localProgress);
  return Math.min(fadeIn, fadeOut);
}
