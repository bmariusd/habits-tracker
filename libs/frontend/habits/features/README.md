# Habits feature

This library contains the user-facing habits experience: the dashboard, activity calendar, habit list, forms, and dialogs.

Components receive data and event callbacks through props. Hooks such as `useHabits` and `useActivityCalendar` own API loading and mutation state. The feature obtains its `HabitFacade` from the `DIProvider` set up by `apps/web`.

Import the page entry point from `@org/features`:

```tsx
import { HabitsFeature } from '@org/features';
```
