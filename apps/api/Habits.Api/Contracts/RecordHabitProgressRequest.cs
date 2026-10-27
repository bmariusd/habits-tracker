namespace Habits.Api.Contracts;

public sealed record RecordHabitProgressRequest(
    DateOnly Date,
    string? TrackingType,
    bool? Completed,
    decimal? Amount);
