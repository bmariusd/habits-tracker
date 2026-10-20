using Habits.Application.Repositories;
using Habits.Domain;

namespace Habits.Infrastructure.Repositories;

public sealed class InMemoryHabitRepository : IHabitRepository
{
    private readonly List<Habit> _habits =
    [
        new Habit(
            "Drink water",
            "Drink 4 litres of water",
            HabitTrackingType.Quantity,
            4m,
            "litres"),
        new Habit(
            "Read",
            "Read for at least 30 minutes",
            HabitTrackingType.Completion,
            null,
            null)
    ];

    public Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Habit> activeHabits = _habits
            .Where(habit => habit.ArchivedAt is null)
            .ToList();

        return Task.FromResult(activeHabits);
    }
}