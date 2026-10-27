# Habits data access

This library implements the `HabitFacade` from `@org/contracts` with Axios. Feature hooks call the facade; the facade sends requests to the API under `/api`.

The Vite proxy in `apps/web/vite.config.mts` forwards those requests to the local API at `http://localhost:5023`.
