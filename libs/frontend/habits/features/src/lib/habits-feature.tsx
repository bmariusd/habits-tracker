import { HabitFacade, type HabitDto } from '@org/contracts';
import { useInjection } from '@org/di';
import { useEffect, useState } from 'react';

export function HabitsFeature() {
  const habitFacade = useInjection<HabitFacade>(HabitFacade.$);
  const [habits, setHabits] = useState<HabitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    habitFacade
      .listHabits()
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('Expected /api/habits to return a JSON array.');
        }

        if (!cancelled) setHabits(result);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;

        setError(
          reason instanceof Error ? reason.message : 'Could not load habits.',
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [habitFacade]);

  if (isLoading) return <p>Loading habits…</p>;
  if (error) return <p role="alert">Could not load habits: {error}</p>;
  if (habits.length === 0) return <p>No active habits yet.</p>;

  return (
    <section>
      <h1>My habits</h1>
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name}
            {habit.trackingType === 'quantity' &&
              ` — target: ${habit.targetValue} ${habit.unit}`}
          </li>
        ))}
      </ul>
    </section>
  );
}
