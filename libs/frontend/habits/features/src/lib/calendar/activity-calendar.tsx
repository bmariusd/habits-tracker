import { GlassPanel } from '@org/ui';
import { useActivityCalendar, getLocalTodayKey } from '../hooks/use-activity-calendar';
import type {
  ActivityCellProps,
  ActivityLevel,
  DayPopoverProps,
} from './activity-calendar.types';

const activityLevelClasses: Record<ActivityLevel, string> = {
  0: 'bg-white/[0.08]',
  1: 'bg-violet-950',
  2: 'bg-violet-800',
  3: 'bg-violet-600',
  4: 'bg-violet-400',
};

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ActivityCalendar() {
  const year = new Date().getFullYear();
  const calendar = useActivityCalendar(year);
  const today = getLocalTodayKey();

  return (
    <GlassPanel
      className={`relative w-full p-4 sm:p-5 ${calendar.selectedDate ? 'z-40' : 'z-0'}`}
      aria-labelledby="activity-title"
      data-activity-root
      onMouseLeave={calendar.closeDay}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-violet-200/55">YOUR MOMENTUM</p>
          <h2 id="activity-title" className="mt-1 text-lg font-semibold tracking-tight text-white">
            Activity <span className="font-medium text-slate-400/70">{year}</span>
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold text-slate-300/75">
          {calendar.isLoading ? 'Loading activity…' : 'Daily progress'}
        </span>
      </div>

      <p className="mb-4 mt-1 text-xs text-slate-400/80">
        Hover or focus a day to review and update your habits.
      </p>

      {calendar.loadError && (
        <p role="alert" className="mb-3 rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-100">
          Could not load activity: {calendar.loadError}
        </p>
      )}

      <div className="overflow-x-auto pb-2" role="region" aria-label={`Activity calendar for ${year}`} tabIndex={0}>
        <div className="grid w-full min-w-[840px] grid-cols-[5rem_repeat(31,minmax(16px,1fr))] gap-x-1 gap-y-1.5">
          <span className="self-end pb-1 text-[9px] font-bold tracking-[0.12em] text-slate-500" aria-hidden="true">MONTH</span>
          {Array.from({ length: 31 }, (_, dayIndex) => (
            <span key={dayIndex + 1} className="pb-1 text-center text-[9px] text-slate-500" aria-hidden="true">
              {dayIndex + 1}
            </span>
          ))}

          {calendar.months.map((month) => (
            <div className="col-span-full grid grid-cols-subgrid items-center gap-x-1" key={month.name}>
              <span className="text-[10px] font-semibold text-slate-300/75">{month.name}</span>
              <div className="col-start-2 col-end-[-1] grid grid-cols-[repeat(31,minmax(16px,1fr))] gap-1">
                {month.days.map((day) => (
                  <ActivityCell
                    key={day.date}
                    day={day}
                    disabled={day.date > today}
                    onOpen={(element) => calendar.openDay(day.date, element)}
                  />
                ))}
                {Array.from({ length: 31 - month.days.length }, (_, dayIndex) => (
                  <span key={`empty-${dayIndex}`} aria-hidden="true" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActivityLegend />
      {calendar.selectedDate && calendar.popoverPosition && (
        <DayPopover
          date={calendar.selectedDate}
          position={calendar.popoverPosition}
          habits={calendar.selectedHabits}
          isLoading={calendar.isDayLoading}
          error={calendar.dayError}
          savingHabitId={calendar.savingHabitId}
          onClose={calendar.closeDay}
          onToggle={calendar.toggleCompletion}
          onIncrement={calendar.incrementQuantity}
        />
      )}
    </GlassPanel>
  );
}

function ActivityCell({ day, disabled, onOpen }: ActivityCellProps) {
  const total = day.summary.totalHabits;
  const completed = day.summary.completedHabits;
  const description = total === 0 ? 'No active habits' : `${completed} of ${total} habits complete`;
  return (
    <button
      type="button"
      className={`aspect-square w-full rounded-[5px] border border-white/[0.035] transition duration-150 hover:scale-110 hover:ring-1 hover:ring-violet-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${activityLevelClasses[day.level]} ${disabled ? 'cursor-default opacity-35' : 'cursor-pointer'}`}
      title={`${formatDate(day.date)} · ${description}`}
      aria-label={`${formatDate(day.date)}: ${description}`}
      disabled={disabled}
      onMouseEnter={(event) => !disabled && onOpen(event.currentTarget)}
      onFocus={(event) => !disabled && onOpen(event.currentTarget)}
      onClick={(event) => !disabled && onOpen(event.currentTarget)}
    />
  );
}

function DayPopover({ date, position, habits, isLoading, error, savingHabitId, onClose, onToggle, onIncrement }: DayPopoverProps) {
  return (
    <section
      className="absolute z-50 max-h-[min(420px,calc(100vh-24px))] w-[min(360px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/90 p-4 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl"
      style={{ top: position.top, left: position.left }}
      aria-label={`Habits for ${formatDate(date)}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-violet-200/60">DAILY CHECK-IN</p>
          <h3 className="mt-1 text-base font-semibold">{formatDate(date)}</h3>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10" aria-label="Close daily habits">✕</button>
      </div>

      {isLoading && <p className="py-4 text-sm text-slate-400">Loading habits…</p>}
      {error && <p role="alert" className="mb-2 rounded-lg bg-rose-400/10 px-3 py-2 text-xs text-rose-100">{error}</p>}
      {!isLoading && habits.length === 0 && !error && <p className="py-3 text-sm text-slate-400">No habits were active on this day.</p>}
      <ul className="space-y-2">
        {habits.map((habit) => (
          <li key={habit.habitId} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{habit.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {habit.trackingType === 'quantity'
                  ? `${habit.amount} / ${habit.targetValue} ${habit.unit}`
                  : habit.completed ? 'Completed' : 'Not completed'}
              </p>
            </div>
            {habit.trackingType === 'quantity' && (
              <button
                type="button"
                className="rounded-lg border border-violet-300/20 px-2 py-1 text-xs text-violet-100 hover:bg-violet-300/10 disabled:opacity-40"
                disabled={savingHabitId === habit.habitId}
                onClick={() => void onIncrement(habit)}
                aria-label={`Add one ${habit.unit} to ${habit.name}`}
              >+1</button>
            )}
            <input
              type="checkbox"
              checked={habit.completed}
              disabled={savingHabitId === habit.habitId}
              onChange={() => void onToggle(habit)}
              className="h-4 w-4 shrink-0 accent-violet-400 disabled:opacity-40"
              aria-label={`Mark ${habit.name} ${habit.completed ? 'not done' : 'done'}`}
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-slate-500">Quantity habits can also be increased in one unit at a time.</p>
    </section>
  );
}

function ActivityLegend() {
  return (
    <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate-400" aria-label="Activity intensity legend">
      <span className="mr-1">Less</span>
      {([0, 1, 2, 3, 4] as const).map((level) => (
        <span key={level} className={`h-3.5 w-3.5 rounded-[3px] ${activityLevelClasses[level]}`} />
      ))}
      <span className="ml-1">More</span>
    </div>
  );
}
