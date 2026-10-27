import { Button } from '@org/ui';
import type { DashboardHeaderProps } from '../habits-feature.types';

export function DashboardHeader({ onAddHabit }: DashboardHeaderProps) {
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  return (
    <header className="mb-4 flex min-h-10 items-center justify-between gap-3 px-1">
      <div>
        <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
          {todayLabel}
        </p>
        <p className="mt-1 text-xs text-slate-300/70">
          A little progress goes a long way <span className="text-fuchsia-300">✦</span>
        </p>
      </div>
      <Button onClick={onAddHabit}>
        <span aria-hidden="true">＋</span>
        <span className="hidden sm:inline">Add a habit</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </header>
  );
}
