using Habits.Domain;

namespace Habits.Application.Repositories;

public interface IHabitRepository
{
    Task AddAsync(
        Habit habit,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        Habit habit,
        CancellationToken cancellationToken = default);

    Task<Habit?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Habit>> ListAllAsync(
        CancellationToken cancellationToken = default);
}
