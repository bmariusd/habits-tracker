import {
  HabitFacade,
  type HabitDayDto,
  type RecordHabitProgressRequest,
} from '@org/contracts';
import { useInjection } from '@org/di';
import { useCallback, useEffect, useRef, useState } from 'react';
import { buildActivityMonths } from '../calendar/activity-calendar.model';
import type { ActivityCalendarState } from '../calendar/activity-calendar.types';

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export function useActivityCalendar(year: number): ActivityCalendarState {
  const habitFacade = useInjection<HabitFacade>(HabitFacade.$);
  const [summaries, setSummaries] = useState<ActivityCalendarState['summaries']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<HabitDayDto[]>([]);
  const [isDayLoading, setIsDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);
  const [savingHabitId, setSavingHabitId] = useState<string | null>(null);
  const dayCache = useRef(new Map<string, HabitDayDto[]>());
  const currentRequest = useRef(0);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError(null);
    habitFacade.getCalendarSummary(`${year}-01-01`, `${year}-12-31`)
      .then((result) => {
        if (isCurrent) setSummaries(result);
      })
      .catch((error: unknown) => {
        if (isCurrent) setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [habitFacade, year]);

  const openDay = useCallback((date: string, trigger: HTMLElement) => {
    const requestId = ++currentRequest.current;
    const rect = trigger.getBoundingClientRect();
    const root = trigger.closest<HTMLElement>('[data-activity-root]');
    const rootRect = root?.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 24);
    const left = Math.min(
      Math.max(12, rect.left - (rootRect?.left ?? 0)),
      (rootRect?.width ?? window.innerWidth) - width - 12,
    );
    const rootTop = rootRect?.top ?? 0;
    const belowCell = rect.bottom - rootTop + 8;
    const availableBottom = window.innerHeight - rootTop - 392;
    const top = belowCell <= availableBottom
      ? Math.max(12, belowCell)
      : Math.max(12, rect.top - rootTop - 380 - 8);
    setPopoverPosition({ top: Math.max(12, top), left });
    setSelectedDate(date);
    setDayError(null);
    const cached = dayCache.current.get(date);
    if (cached) {
      setSelectedHabits(cached);
      setIsDayLoading(false);
      return;
    }
    setSelectedHabits([]);
    setIsDayLoading(true);
    habitFacade.getProgressForDate(date)
      .then((rows) => {
        if (currentRequest.current !== requestId) return;
        dayCache.current.set(date, rows);
        setSelectedHabits(rows);
      })
      .catch((error: unknown) => {
        if (currentRequest.current === requestId) setDayError(getErrorMessage(error));
      })
      .finally(() => {
        if (currentRequest.current === requestId) setIsDayLoading(false);
      });
  }, [habitFacade]);

  const closeDay = useCallback(() => {
    currentRequest.current += 1;
    setSelectedDate(null);
    setPopoverPosition(null);
    setDayError(null);
  }, []);

  const saveProgress = useCallback(async (habit: HabitDayDto, request: RecordHabitProgressRequest) => {
    setSavingHabitId(habit.habitId);
    setDayError(null);
    try {
      const saved = await habitFacade.recordProgress(request);
      const updated: HabitDayDto = {
        ...habit,
        ...saved,
      };
      const rows = (dayCache.current.get(habit.date) ?? []).map((row) =>
        row.habitId === habit.habitId ? updated : row,
      );
      dayCache.current.set(habit.date, rows);
      if (selectedDate === habit.date) setSelectedHabits(rows);
      setSummaries((current) => {
        const oldSummary = current.find((item) => item.date === habit.date);
        if (!oldSummary) return current;
        const completedHabits = Math.max(0, oldSummary.completedHabits + Number(updated.completed) - Number(habit.completed));
        const completionPercentage = oldSummary.totalHabits === 0
          ? 0
          : Math.round((completedHabits / oldSummary.totalHabits) * 100);
        return current.map((item) => item.date === habit.date
          ? { ...item, completedHabits, completionPercentage }
          : item);
      });
    } catch (error: unknown) {
      setDayError(getErrorMessage(error));
    } finally {
      setSavingHabitId(null);
    }
  }, [habitFacade, selectedDate]);

  const toggleCompletion = useCallback(async (habit: HabitDayDto) => {
    if (habit.trackingType !== 'completion') return;
    await saveProgress(habit, {
      habitId: habit.habitId,
      date: habit.date,
      trackingType: 'completion',
      completed: !habit.completed,
    });
  }, [saveProgress]);

  const incrementQuantity = useCallback(async (habit: HabitDayDto) => {
    if (habit.trackingType !== 'quantity') return;
    await saveProgress(habit, {
      habitId: habit.habitId,
      date: habit.date,
      trackingType: 'quantity',
      amount: habit.amount + 1,
    });
  }, [saveProgress]);

  const setQuantityDone = useCallback(async (habit: HabitDayDto) => {
    if (habit.trackingType !== 'quantity') return;
    await saveProgress(habit, {
      habitId: habit.habitId,
      date: habit.date,
      trackingType: 'quantity',
      amount: habit.completed ? 0 : habit.targetValue,
    });
  }, [saveProgress]);

  // Kept in the calendar state so the same right-hand checkbox works for both tracking types.
  const months = buildActivityMonths(year, summaries);
  return {
    months,
    summaries,
    isLoading,
    loadError,
    selectedDate,
    popoverPosition,
    selectedHabits,
    isDayLoading,
    dayError,
    savingHabitId,
    openDay,
    closeDay,
    toggleCompletion: (habit) => habit.trackingType === 'completion'
      ? toggleCompletion(habit)
      : setQuantityDone(habit),
    incrementQuantity,
  };
}

export function getLocalTodayKey(): string {
  return dateKey(new Date());
}
