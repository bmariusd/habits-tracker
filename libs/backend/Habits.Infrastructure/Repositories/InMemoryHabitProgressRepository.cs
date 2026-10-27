using Habits.Application.Repositories;
using Habits.Domain;

namespace Habits.Infrastructure.Repositories;

public sealed class InMemoryHabitProgressRepository : IHabitProgressRepository
{
    private readonly object _syncRoot = new();
    private readonly Dictionary<(Guid HabitId, DateOnly Date), HabitProgress> _progress = [];

    public Task<HabitProgress?> GetAsync(
        Guid habitId,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        HabitProgress? progress;
        lock (_syncRoot)
        {
            _progress.TryGetValue((habitId, date), out progress);
        }

        return Task.FromResult(progress);
    }

    public Task<IReadOnlyList<HabitProgress>> ListForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyList<HabitProgress> progressForDate;
        lock (_syncRoot)
        {
            progressForDate = _progress.Values
                .Where(progress => progress.Date == date)
                .ToArray();
        }

        return Task.FromResult(progressForDate);
    }

    public Task<IReadOnlyList<HabitProgress>> ListBetweenAsync(
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (endDate < startDate)
        {
            throw new ArgumentException("The end date must be on or after the start date.");
        }

        IReadOnlyList<HabitProgress> progressInRange;
        lock (_syncRoot)
        {
            progressInRange = _progress.Values
                .Where(progress => progress.Date >= startDate && progress.Date <= endDate)
                .ToArray();
        }

        return Task.FromResult(progressInRange);
    }

    public Task UpsertAsync(
        HabitProgress progress,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(progress);
        cancellationToken.ThrowIfCancellationRequested();

        lock (_syncRoot)
        {
            _progress[(progress.HabitId, progress.Date)] = progress;
        }

        return Task.CompletedTask;
    }
}
