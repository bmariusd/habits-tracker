import type {
  CalendarDaySummaryDto,
  CreateHabitRequest,
  HabitDate,
  HabitDayDto,
  HabitDto,
  HabitFacade,
  HabitProgressDto,
  RecordHabitProgressRequest,
  UpdateHabitRequest,
} from '@org/contracts';

import type { ApiClient } from './api-client.js';

export class HttpHabitFacade implements HabitFacade {
  constructor(private readonly apiClient: ApiClient) {}

  listHabits(): Promise<HabitDto[]> {
    return this.apiClient.get('/habits');
  }

  getHabit(id: string): Promise<HabitDto | null> {
    return this.apiClient.get(`/habits/${encodeURIComponent(id)}`);
  }

  createHabit(input: CreateHabitRequest): Promise<HabitDto> {
    return this.apiClient.post('/habits', input);
  }

  updateHabit(id: string, input: UpdateHabitRequest): Promise<HabitDto> {
    return this.apiClient.put(`/habits/${encodeURIComponent(id)}`, input);
  }

  archiveHabit(id: string): Promise<void> {
    return this.apiClient.delete(`/habits/${encodeURIComponent(id)}`);
  }

  recordProgress(input: RecordHabitProgressRequest): Promise<HabitProgressDto> {
    const { habitId, ...progress } = input;

    return this.apiClient.post(
      `/habits/${encodeURIComponent(habitId)}/progress`,
      progress,
    );
  }

  getCalendarSummary(
    startDate: HabitDate,
    endDate: HabitDate,
  ): Promise<CalendarDaySummaryDto[]> {
    const query = new URLSearchParams({ startDate, endDate });

    return this.apiClient.get(`/calendar/summary?${query.toString()}`);
  }

  getProgressForDate(date: HabitDate): Promise<HabitDayDto[]> {
    const query = new URLSearchParams({ date });

    return this.apiClient.get(`/habits/progress?${query.toString()}`);
  }
}
