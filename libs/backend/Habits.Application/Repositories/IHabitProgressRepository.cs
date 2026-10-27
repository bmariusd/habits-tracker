using Habits.Domain;

namespace Habits.Application.Repositories;

public interface IHabitProgressRepository
{
    Task<HabitProgress?> GetAsync(
        Guid habitId,
        DateOnly date,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<HabitProgress>> ListForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<HabitProgress>> ListBetweenAsync(
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default);

    Task UpsertAsync(
        HabitProgress progress,
        CancellationToken cancellationToken = default);
}
