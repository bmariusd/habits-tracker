namespace Habits.Domain;

public sealed class HabitProgress
{
    public Guid HabitId { get; }
    public DateOnly Date { get; }
    public decimal Amount { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    public HabitProgress(Guid habitId, DateOnly date, decimal amount)
    {
        HabitId = habitId;
        Date = date;
        SetAmount(amount);
    }

    public void SetAmount(decimal amount)
    {
        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(amount),
                "Progress cannot be less than zero.");
        }

        Amount = amount;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
