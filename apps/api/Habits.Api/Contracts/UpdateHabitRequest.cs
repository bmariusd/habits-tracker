namespace Habits.Api.Contracts;

public sealed record UpdateHabitRequest(
    string? Name,
    string? Description,
    string? TrackingType,
    decimal? TargetValue,
    string? Unit);
