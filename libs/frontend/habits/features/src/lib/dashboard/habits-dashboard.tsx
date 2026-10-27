import type { HabitsDashboardProps } from '../habits-feature.types';
import { ActivityCalendar } from '../calendar/activity-calendar';
import { HabitsSection } from '../habits/habits-section';
import { DashboardHeader } from './dashboard-header';
import { DashboardIntro } from './dashboard-intro';
import { HabitInsights } from './habit-insights';
import { Sidebar } from './sidebar';

export function HabitsDashboard({
  habits,
  isLoading,
  loadError,
  successMessage,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}: HabitsDashboardProps) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#08080c] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[18rem] -top-[24rem] h-[52rem] w-[72rem] rotate-[-24deg] rounded-full border-[2rem] border-fuchsia-400/[0.07] blur-2xl" />
        <div className="absolute -right-[26rem] top-[8rem] h-[44rem] w-[66rem] rotate-[-30deg] rounded-full border-[2rem] border-violet-400/[0.09] blur-2xl" />
        <div className="absolute bottom-[-28rem] left-[22%] h-[50rem] w-[60rem] rounded-full border-[2rem] border-indigo-400/[0.08] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(111,48,131,0.14),transparent_48%)]" />
      </div>

      <Sidebar />
      <main
        className="relative min-w-0 px-4 py-4 sm:px-5 md:ml-[104px] md:px-5 md:py-5 xl:px-7"
        id="overview"
      >
        <DashboardHeader onAddHabit={onAddHabit} />
        <DashboardIntro habitCount={habits.length} />
        <ActivityCalendar />

        <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
          <HabitsSection
            habits={habits}
            isLoading={isLoading}
            error={loadError}
            onAddHabit={onAddHabit}
            onEditHabit={onEditHabit}
            onDeleteHabit={onDeleteHabit}
          />
          <HabitInsights habits={habits} />
        </div>
        {successMessage && (
          <p className="mt-3 text-sm text-emerald-200" role="status">
            {successMessage}
          </p>
        )}
      </main>
    </div>
  );
}
