import { SkillPhaseIndex, SKILL_TITLES, SKILL_DESCRIPTIONS } from "../../lib/skillsPhases";

interface SkillsTextCardProps {
  activePhase: SkillPhaseIndex | null;
}

export default function SkillsTextCard({ activePhase }: SkillsTextCardProps) {
  if (activePhase === null) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
      {/* --card-blur is ramped with the fade in useSkillsScrollProgress so the
          backdrop blur grows in smoothly with the card (backdrop-filter alone
          ignores the wrapper's opacity and would pop to full strength). */}
      <div
        className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60"
        style={{
          backdropFilter: "blur(var(--card-blur, 0px))",
          WebkitBackdropFilter: "blur(var(--card-blur, 0px))",
        }}
      >
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
