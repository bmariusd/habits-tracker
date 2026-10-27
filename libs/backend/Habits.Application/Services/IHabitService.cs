using Habits.Domain;

namespace Habits.Application.Services;

public interface IHabitService
{
    Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default);

    Task<Habit?> GetActiveByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<Habit> CreateAsync(
        HabitDetails details,
        CancellationToken cancellationToken = default);

    Task<Habit?> UpdateAsync(
        Guid id,
        HabitDetails details,
        CancellationToken cancellationToken = default);

    Task<bool> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
