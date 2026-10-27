namespace Habits.Api.Contracts;

public sealed record CalendarDaySummaryResponse(
    DateOnly Date,
    int TotalHabits,
    int CompletedHabits,
    decimal CompletionPercentage);
