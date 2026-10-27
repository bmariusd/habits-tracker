namespace Habits.Api.Contracts;

public sealed record HabitProgressResponse(
    string HabitId,
    DateOnly Date,
    string TrackingType,
    bool Completed,
    decimal? Amount,
    decimal? TargetValue,
    string? Unit);
