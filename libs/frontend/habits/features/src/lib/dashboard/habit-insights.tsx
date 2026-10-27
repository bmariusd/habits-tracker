import { GlassPanel } from '@org/ui';
import type {
  HabitInsightRowProps,
  HabitInsightsProps,
} from '../habits-feature.types';

export function HabitInsights({ habits }: HabitInsightsProps) {
  const completionCount = habits.filter(
    (habit) => habit.trackingType === 'completion',
  ).length;
  const quantityCount = habits.length - completionCount;

  return (
    <GlassPanel className="flex h-full flex-col p-4 sm:p-5">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-violet-200/60">
          YOUR ROUTINE
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">Habit mix</h2>
      </div>

      <div className="mt-5 grid gap-3">
        <InsightRow
          icon="✓"
          label="Completion habits"
          count={completionCount}
          color="text-emerald-200"
          glow="bg-emerald-400/10"
        />
        <InsightRow
          icon="◉"
          label="Quantity habits"
          count={quantityCount}
          color="text-cyan-200"
          glow="bg-cyan-400/10"
        />
      </div>

      <div className="mt-auto pt-5">
        <div className="h-px bg-white/10" />
        <p className="mb-0 mt-4 text-sm leading-6 text-slate-300/70">
          Small, repeatable actions build a routine that lasts.
        </p>
      </div>
    </GlassPanel>
  );
}

function InsightRow({ icon, label, count, color, glow }: HabitInsightRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${glow} ${color}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-slate-200/80">
        {label}
      </span>
      <strong className="text-lg font-semibold text-white">{count}</strong>
    </div>
  );
}
