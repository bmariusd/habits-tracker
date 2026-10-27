using Habits.Domain;

namespace Habits.Application.Services;

public sealed record RecordHabitProgressCommand(
    Guid HabitId,
    DateOnly Date,
    HabitTrackingType TrackingType,
    bool? Completed,
    decimal? Amount);

public sealed record HabitDayProgress(Habit Habit, DateOnly Date, decimal Amount)
{
    public bool Completed => Habit.TrackingType switch
    {
        HabitTrackingType.Completion => Amount >= 1m,
        HabitTrackingType.Quantity => Amount >= Habit.TargetValue!.Value,
        _ => false
    };
}

public sealed record HabitCalendarDaySummary(
    DateOnly Date,
    int TotalHabits,
    int CompletedHabits)
{
    public decimal CompletionPercentage => TotalHabits == 0
        ? 0
        : decimal.Round(CompletedHabits * 100m / TotalHabits, 2);
}
