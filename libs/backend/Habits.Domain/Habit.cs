namespace Habits.Domain;

public enum HabitTrackingType
{
    Completion,
    Quantity
}

public sealed class Habit
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public HabitTrackingType TrackingType { get; private set; }
    public decimal? TargetValue { get; private set; }
    public string? Unit { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? ArchivedAt { get; private set; }

    public Habit(
        string name,
        string? description,
        HabitTrackingType trackingType,
        decimal? targetValue,
        string? unit)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        if (trackingType == HabitTrackingType.Quantity)
        {
            if (targetValue is null or <= 0)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(targetValue),
                    "A quantity habit must have a target greater than zero.");
            }

            ArgumentException.ThrowIfNullOrWhiteSpace(unit);
        }
        else if (targetValue is not null || unit is not null)
        {
            throw new ArgumentException(
                "A completion habit cannot have a target value or unit.");
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = description;
        TrackingType = trackingType;
        TargetValue = targetValue;
        Unit = unit;
        CreatedAt = DateTimeOffset.UtcNow;
    }
}