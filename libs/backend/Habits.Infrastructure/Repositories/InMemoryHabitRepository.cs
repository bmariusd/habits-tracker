using Habits.Application.Repositories;
using Habits.Domain;

namespace Habits.Infrastructure.Repositories;

public sealed class InMemoryHabitRepository : IHabitRepository
{
    private readonly object _syncRoot = new();

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

    public Task AddAsync(
        Habit habit,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(habit);
        cancellationToken.ThrowIfCancellationRequested();

        lock (_syncRoot)
        {
            _habits.Add(habit);
        }

        return Task.CompletedTask;
    }

    public Task UpdateAsync(
        Habit habit,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(habit);
        cancellationToken.ThrowIfCancellationRequested();

        lock (_syncRoot)
        {
            var index = _habits.FindIndex(candidate => candidate.Id == habit.Id);
            if (index < 0)
            {
                throw new InvalidOperationException(
                    $"Habit '{habit.Id}' does not exist in the repository.");
            }

            _habits[index] = habit;
        }

        return Task.CompletedTask;
    }

    public Task<Habit?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        Habit? habit;
        lock (_syncRoot)
        {
            habit = _habits.FirstOrDefault(candidate => candidate.Id == id);
        }

        return Task.FromResult(habit);
    }

    public Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyList<Habit> activeHabits;
        lock (_syncRoot)
        {
            activeHabits = _habits
                .Where(habit => habit.ArchivedAt is null)
                .ToArray();
        }

        return Task.FromResult(activeHabits);
    }

    public Task<IReadOnlyList<Habit>> ListAllAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyList<Habit> habits;
        lock (_syncRoot)
        {
            habits = _habits.ToArray();
        }

        return Task.FromResult(habits);
    }
}
