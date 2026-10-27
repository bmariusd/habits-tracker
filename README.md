# Habits Tracker

A personal habit tracker with a React and TypeScript frontend in an Nx workspace and a .NET 10 Web API.

## Run locally

Open two PowerShell terminals from `K:\Habits App\habits-tracker`.

Terminal 1, start the API:

```powershell
dotnet run --project .\apps\api\Habits.Api\Habits.Api.csproj --launch-profile http
```

The HTTP profile serves the API at `http://localhost:5023`.

Terminal 2, start the frontend:

```powershell
pnpm nx serve @org/web
```

Open `http://localhost:4200`. Vite forwards `/api` requests to the API.

## What works

- Create, edit, and archive completion and quantity habits.
- Review active habits for a calendar date and check or uncheck their progress.
- Add quantity progress in one-unit steps. The checkbox can also set a quantity habit to its target or clear it.
- View yearly progress in the calendar. Days with more completed habits use a stronger violet shade.
- Historical dates only include habits that were active on that date.

The API currently stores habits and progress in memory. Restarting it resets the sample and user-created data.

## Code map

### Frontend

- `apps/web` starts React, creates the dependency container, and configures the Vite `/api` proxy.
- `libs/frontend/habits/features` contains the dashboard, reusable sections, forms, dialogs, and hooks that load and update data.
- `libs/frontend/habits/data-access` implements the API client and `HabitFacade`.
- `libs/frontend/habits/contracts` defines the frontend DTOs, requests, and facade interface.
- `libs/frontend/habits/ui` contains reusable buttons, modals, and glass panels.
- `libs/frontend/shared/di` connects React components to services through Inversify.

### Backend

- `libs/backend/Habits.Domain` holds the `Habit` and `HabitProgress` domain objects and their validation rules.
- `libs/backend/Habits.Application` contains use cases and repository interfaces.
- `libs/backend/Habits.Infrastructure` implements the repositories with in-memory collections.
- `apps/api/Habits.Api` maps HTTP requests to application services and returns JSON responses.

## Verify changes

```powershell
pnpm nx run @org/web:build
pnpm nx run-many -t test
dotnet build .\apps\api\Habits.Api\Habits.Api.csproj
```

The running API must be stopped with Ctrl+C before rebuilding if MSBuild reports that its output files are locked.
