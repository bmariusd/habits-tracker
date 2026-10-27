import {
  HabitFacade,
  type CreateHabitRequest,
  type HabitDto,
  type UpdateHabitRequest,
} from '@org/contracts';
import { useInjection } from '@org/di';
import { useCallback, useEffect, useState } from 'react';
import type { UseHabitsResult } from '../habits-feature.types';

export function useHabits(): UseHabitsResult {
  const habitFacade = useInjection<HabitFacade>(HabitFacade.$);
  const [habits, setHabits] = useState<HabitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    habitFacade.listHabits()
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('Expected /api/habits to return a JSON array.');
        }
        if (isCurrent) setHabits(result);
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        setLoadError(
          error instanceof Error ? error.message : 'Could not load habits.',
        );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [habitFacade]);

  const createHabit = useCallback(async (input: CreateHabitRequest) => {
    setIsSaving(true);
    setMutationError(null);

    try {
      const createdHabit = await habitFacade.createHabit(input);
      setHabits((currentHabits) => [createdHabit, ...currentHabits]);
      return true;
    } catch (error: unknown) {
      setMutationError(
        error instanceof Error ? error.message : 'Could not create habit.',
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [habitFacade]);

  const updateHabit = useCallback(async (
    id: string,
    input: UpdateHabitRequest,
  ) => {
    setIsSaving(true);
    setMutationError(null);

    try {
      const updatedHabit = await habitFacade.updateHabit(id, input);
      setHabits((currentHabits) => currentHabits.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit,
      ));
      return true;
    } catch (error: unknown) {
      setMutationError(
        error instanceof Error ? error.message : 'Could not update habit.',
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [habitFacade]);

  const archiveHabit = useCallback(async (id: string) => {
    setIsArchiving(true);
    setMutationError(null);

    try {
      await habitFacade.archiveHabit(id);
      setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id));
      return true;
    } catch (error: unknown) {
      setMutationError(
        error instanceof Error ? error.message : 'Could not archive habit.',
      );
      return false;
    } finally {
      setIsArchiving(false);
    }
  }, [habitFacade]);

  const clearMutationError = useCallback(() => setMutationError(null), []);

  return {
    habits,
    isLoading,
    loadError,
    isSaving,
    isArchiving,
    mutationError,
    clearMutationError,
    createHabit,
    updateHabit,
    archiveHabit,
  };
}
