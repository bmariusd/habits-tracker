namespace Habits.Api.Contracts;

public sealed record HabitResponse(
    string Id,
    string Name,
    string? Description,
    string TrackingType,
    decimal? TargetValue,
    string? Unit,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ArchivedAt);
