import { Button } from '@org/ui';
import type { HabitCardProps } from '../habits-feature.types';

const accentClasses = [
  'border-violet-200/10 bg-violet-300/[0.12] text-violet-100',
  'border-emerald-200/10 bg-emerald-300/[0.1] text-emerald-100',
  'border-amber-200/10 bg-amber-300/[0.1] text-amber-100',
  'border-cyan-200/10 bg-cyan-300/[0.1] text-cyan-100',
] as const;

export function HabitCard({
  habit,
  accentIndex,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const habitDetails = habit.description
    || (habit.trackingType === 'quantity'
      ? `Reach ${habit.targetValue} ${habit.unit}`
      : 'Show up for yourself today');

  return (
    <article className="flex min-h-[76px] items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.045] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:border-violet-200/20 hover:bg-white/[0.075]">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-base font-bold ${accentClasses[accentIndex % accentClasses.length]}`}
        aria-hidden="true"
      >
        {habit.trackingType === 'quantity' ? '◉' : '✓'}
      </span>

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-white">{habit.name}</h3>
        <p className="mt-1 truncate text-xs text-slate-400">{habitDetails}</p>
      </div>

      <span className="ml-auto hidden shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] text-slate-300 sm:inline">
        {habit.trackingType === 'quantity'
          ? `${habit.targetValue} ${habit.unit}`
          : 'Daily'}
      </span>

      <div className="ml-auto flex shrink-0 gap-1 sm:ml-2">
        <Button
          variant="quiet"
          className="min-h-8 px-2 text-xs"
          aria-label={`Edit ${habit.name}`}
          onClick={() => onEdit(habit)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          className="min-h-8 px-2 text-xs"
          aria-label={`Delete ${habit.name}`}
          onClick={() => onDelete(habit)}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}
