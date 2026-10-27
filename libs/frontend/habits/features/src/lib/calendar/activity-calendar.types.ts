import type {
  CalendarDaySummaryDto,
  HabitDayDto,
} from '@org/contracts';

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface ActivityDay {
  date: string;
  level: ActivityLevel;
  summary: CalendarDaySummaryDto;
}

export interface ActivityMonth {
  name: string;
  days: ActivityDay[];
}

export interface ActivityCalendarState {
  months: ActivityMonth[];
  summaries: CalendarDaySummaryDto[];
  isLoading: boolean;
  loadError: string | null;
  selectedDate: string | null;
  popoverPosition: { top: number; left: number } | null;
  selectedHabits: HabitDayDto[];
  isDayLoading: boolean;
  dayError: string | null;
  savingHabitId: string | null;
  openDay(date: string, trigger: HTMLElement): void;
  closeDay(): void;
  toggleCompletion(habit: HabitDayDto): Promise<void>;
  incrementQuantity(habit: HabitDayDto): Promise<void>;
}

export interface ActivityCellProps {
  day: ActivityDay;
  disabled: boolean;
  onOpen(element: HTMLButtonElement): void;
}

export interface DayPopoverProps {
  date: string;
  position: { top: number; left: number };
  habits: HabitDayDto[];
  isLoading: boolean;
  error: string | null;
  savingHabitId: string | null;
  onClose(): void;
  onToggle(habit: HabitDayDto): Promise<void>;
  onIncrement(habit: HabitDayDto): Promise<void>;
}
