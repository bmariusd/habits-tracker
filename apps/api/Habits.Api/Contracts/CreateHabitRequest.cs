namespace Habits.Api.Contracts;

public sealed record CreateHabitRequest(
    string? Name,
    string? Description,
    string? TrackingType,
    decimal? TargetValue,
    string? Unit);
