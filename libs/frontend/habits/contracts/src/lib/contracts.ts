export type HabitDate = string; // Calendar date in YYYY-MM-DD format

export type HabitTrackingDetails =
  | {
      trackingType: 'completion';
      targetValue: null;
      unit: null;
    }
  | {
      trackingType: 'quantity';
      targetValue: number;
      unit: string;
    };

interface HabitFields {
  name: string;
  description: string | null;
}

export type CreateHabitRequest = HabitFields & HabitTrackingDetails;

// This represents a full update of the editable habit fields.
export type UpdateHabitRequest = CreateHabitRequest;

interface HabitRecordFields {
  id: string;
  createdAt: string; // Timestamp returned by the API
  archivedAt: string | null;
}

export type HabitDto = HabitFields & HabitRecordFields & HabitTrackingDetails;

export type RecordHabitProgressRequest = {
  habitId: string;
  date: HabitDate;
} & (
  | {
      trackingType: 'completion';
      completed: boolean;
    }
  | {
      trackingType: 'quantity';
      amount: number;
    }
);

export type HabitProgressDto = {
  habitId: string;
  date: HabitDate;
  completed: boolean;
} & (
  | {
      trackingType: 'completion';
    }
  | {
      trackingType: 'quantity';
      amount: number;
      targetValue: number;
      unit: string;
    }
);

export type HabitDayDto = HabitProgressDto & {
  name: string;
  description: string | null;
};

export interface CalendarDaySummaryDto {
  date: HabitDate;
  totalHabits: number;
  completedHabits: number;
  completionPercentage: number; // From 0 to 100
}

export interface HabitFacade {
  listHabits(): Promise<HabitDto[]>;
  getHabit(id: string): Promise<HabitDto | null>;
  createHabit(input: CreateHabitRequest): Promise<HabitDto>;
  updateHabit(id: string, input: UpdateHabitRequest): Promise<HabitDto>;
  archiveHabit(id: string): Promise<void>;
  recordProgress(input: RecordHabitProgressRequest): Promise<HabitProgressDto>;
  getProgressForDate(date: HabitDate): Promise<HabitDayDto[]>;
  getCalendarSummary(
    startDate: HabitDate,
    endDate: HabitDate,
  ): Promise<CalendarDaySummaryDto[]>;
}

export const HabitFacade = {
  $: Symbol.for('@org/habits/HabitFacade'),
};
