namespace Habits.Application.Services;

public interface IHabitProgressService
{
    Task<IReadOnlyList<HabitDayProgress>> GetForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default);

    Task<HabitDayProgress?> RecordAsync(
        RecordHabitProgressCommand command,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<HabitCalendarDaySummary>> GetCalendarSummaryAsync(
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default);
}
