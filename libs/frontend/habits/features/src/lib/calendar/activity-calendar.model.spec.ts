import type { CalendarDaySummaryDto } from '@org/contracts';
import { buildActivityMonths } from './activity-calendar.model';

describe('buildActivityMonths', () => {
  it('maps completion percentages to heatmap levels and keeps real month lengths', () => {
    const summaries: CalendarDaySummaryDto[] = [
      { date: '2026-01-01', totalHabits: 2, completedHabits: 0, completionPercentage: 0 },
      { date: '2026-01-02', totalHabits: 4, completedHabits: 1, completionPercentage: 25 },
      { date: '2026-01-03', totalHabits: 2, completedHabits: 1, completionPercentage: 50 },
      { date: '2026-01-04', totalHabits: 4, completedHabits: 3, completionPercentage: 75 },
      { date: '2026-01-05', totalHabits: 2, completedHabits: 2, completionPercentage: 100 },
    ];

    const months = buildActivityMonths(2026, summaries);
    const january = months[0];

    expect(january.days.slice(0, 5).map((day) => day.level)).toEqual([0, 1, 2, 3, 4]);
    expect(january.days).toHaveLength(31);
    expect(months[1].days).toHaveLength(28);
    expect(months).toHaveLength(12);
  });
});
