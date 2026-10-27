using Habits.Domain;

namespace Habits.Application.Services;

/// <summary>
/// The editable fields shared by the create and update use cases.
/// </summary>
public sealed record HabitDetails(
    string Name,
    string? Description,
    HabitTrackingType TrackingType,
    decimal? TargetValue,
    string? Unit);
