using Habits.Domain;

namespace Habits.Application.Repositories;

public interface IHabitRepository
{
    Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default);
}