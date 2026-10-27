import type { CalendarDaySummaryDto } from '@org/contracts';
import type { ActivityLevel, ActivityMonth } from './activity-calendar.types';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildActivityMonths(
  year: number,
  summaries: CalendarDaySummaryDto[],
  locale = 'en',
): ActivityMonth[] {
  const summariesByDate = new Map(summaries.map((summary) => [summary.date, summary]));

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const date = toDateKey(new Date(year, monthIndex, dayIndex + 1));
      const summary = summariesByDate.get(date) ?? {
        date,
        totalHabits: 0,
        completedHabits: 0,
        completionPercentage: 0,
      };
      const level: ActivityLevel = summary.totalHabits === 0 || summary.completionPercentage <= 0
        ? 0
        : summary.completionPercentage <= 25
          ? 1
          : summary.completionPercentage <= 50
            ? 2
            : summary.completionPercentage <= 75
              ? 3
              : 4;

      return { date, level, summary };
    });

    return {
      name: new Date(year, monthIndex, 1).toLocaleString(locale, { month: 'long' }),
      days,
    };
  });
}
