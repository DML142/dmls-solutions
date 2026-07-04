import { SkillPhaseIndex, SKILL_TITLES, SKILL_DESCRIPTIONS } from "../../lib/skillsPhases";

interface SkillsTextCardProps {
  activePhase: SkillPhaseIndex | null;
}

export default function SkillsTextCard({ activePhase }: SkillsTextCardProps) {
  if (activePhase === null) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
      {/* No backdrop-blur: backdrop-filter ignores the fade wrapper's
          opacity, so it would pop in at full strength while the card is
          still transparent. A translucent black fill reads better anyway. */}
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60">
        <h3 className="border-b border-white/20 px-6 py-4 text-center text-2xl font-bold tracking-widest text-white">
          {SKILL_TITLES[activePhase]}
        </h3>
        <p className="px-6 py-5 text-center text-sm leading-relaxed text-white/80">
          {SKILL_DESCRIPTIONS[activePhase]}
        </p>
      </div>
    </div>
  );
}
