import { Button, GlassPanel } from '@org/ui';
import type { HabitsSectionProps } from '../habits-feature.types';
import { HabitCard } from './habit-card';

export function HabitsSection({
  habits,
  isLoading,
  error,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}: HabitsSectionProps) {
  return (
    <GlassPanel className="flex min-w-0 flex-col p-4 sm:p-5" id="habits" aria-labelledby="habits-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-violet-200/55">
            YOUR DAILY PRACTICE
          </p>
          <h2
            id="habits-title"
            className="mt-1 flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            My habits
            <span className="grid h-6 min-w-6 place-items-center rounded-full border border-violet-200/10 bg-violet-300/[0.09] px-2 text-xs text-violet-100">
              {habits.length}
            </span>
          </h2>
        </div>
        <Button variant="secondary" onClick={onAddHabit}>
          ＋ New habit
        </Button>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/[0.035] p-8 text-center text-sm text-slate-400">
          Loading your habits…
        </p>
      ) : error ? (
        <p
          className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-6 text-center text-sm text-rose-200"
          role="alert"
        >
          Could not load habits: {error}
        </p>
      ) : habits.length === 0 ? (
        <EmptyHabitsState onAddHabit={onAddHabit} />
      ) : (
        <div className="grid gap-2.5">
          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              accentIndex={index}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}

function EmptyHabitsState({ onAddHabit }: Pick<HabitsSectionProps, 'onAddHabit'>) {
  return (
    <div className="grid justify-items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.035] px-5 py-10 text-center">
      <span className="text-2xl text-fuchsia-200" aria-hidden="true">✦</span>
      <strong className="text-sm text-slate-100">Your routine starts with one small step.</strong>
      <p className="m-0 text-xs text-slate-400">
        Add a habit you’d like to make part of your day.
      </p>
      <Button className="mt-2" onClick={onAddHabit}>
        ＋ Add your first habit
      </Button>
    </div>
  );
}
