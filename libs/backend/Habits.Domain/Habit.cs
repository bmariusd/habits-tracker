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
        ValidateDetails(name, trackingType, targetValue, unit);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Description = NormalizeDescription(description);
        TrackingType = trackingType;
        TargetValue = targetValue;
        Unit = NormalizeUnit(unit);
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void Update(
        string name,
        string? description,
        HabitTrackingType trackingType,
        decimal? targetValue,
        string? unit)
    {
        EnsureActive();
        ValidateDetails(name, trackingType, targetValue, unit);

        Name = name.Trim();
        Description = NormalizeDescription(description);
        TrackingType = trackingType;
        TargetValue = targetValue;
        Unit = NormalizeUnit(unit);
    }

    public void Archive()
    {
        ArchivedAt ??= DateTimeOffset.UtcNow;
    }

    public bool IsActiveOn(DateOnly date)
    {
        var createdDate = DateOnly.FromDateTime(CreatedAt.UtcDateTime);
        if (createdDate > date)
        {
            return false;
        }

        if (ArchivedAt is null)
        {
            return true;
        }

        var archivedDate = DateOnly.FromDateTime(ArchivedAt.Value.UtcDateTime);
        return archivedDate >= date;
    }

    private void EnsureActive()
    {
        if (ArchivedAt is not null)
        {
            throw new InvalidOperationException("An archived habit cannot be edited.");
        }
    }

    private static void ValidateDetails(
        string name,
        HabitTrackingType trackingType,
        decimal? targetValue,
        string? unit)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        switch (trackingType)
        {
            case HabitTrackingType.Quantity:
                if (targetValue is null or <= 0)
                {
                    throw new ArgumentOutOfRangeException(
                        nameof(targetValue),
                        "A quantity habit must have a target greater than zero.");
                }

                ArgumentException.ThrowIfNullOrWhiteSpace(unit);
                break;

            case HabitTrackingType.Completion:
                if (targetValue is not null || unit is not null)
                {
                    throw new ArgumentException(
                        "A completion habit cannot have a target value or unit.");
                }

                break;

            default:
                throw new ArgumentOutOfRangeException(nameof(trackingType));
        }
    }

    private static string? NormalizeDescription(string? description)
    {
        var trimmedDescription = description?.Trim();
        return string.IsNullOrEmpty(trimmedDescription) ? null : trimmedDescription;
    }

    private static string? NormalizeUnit(string? unit)
    {
        var trimmedUnit = unit?.Trim();
        return string.IsNullOrEmpty(trimmedUnit) ? null : trimmedUnit;
    }
}
