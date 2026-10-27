namespace Habits.Api.Contracts;

public sealed record HabitDayResponse(
    string HabitId,
    string Name,
    string? Description,
    DateOnly Date,
    string TrackingType,
    bool Completed,
    decimal? Amount,
    decimal? TargetValue,
    string? Unit);
