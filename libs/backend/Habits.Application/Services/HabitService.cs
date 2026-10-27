using Habits.Application.Repositories;
using Habits.Domain;

namespace Habits.Application.Services;

public sealed class HabitService(IHabitRepository habitRepository) : IHabitService
{
    public Task<IReadOnlyList<Habit>> ListActiveAsync(
        CancellationToken cancellationToken = default)
    {
        return habitRepository.ListActiveAsync(cancellationToken);
    }

    public async Task<Habit?> GetActiveByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var habit = await habitRepository.GetByIdAsync(id, cancellationToken);
        return habit is { ArchivedAt: null } ? habit : null;
    }

    public async Task<Habit> CreateAsync(
        HabitDetails details,
        CancellationToken cancellationToken = default)
    {
        var habit = new Habit(
            details.Name,
            details.Description,
            details.TrackingType,
            details.TargetValue,
            details.Unit);

        await habitRepository.AddAsync(habit, cancellationToken);
        return habit;
    }

    public async Task<Habit?> UpdateAsync(
        Guid id,
        HabitDetails details,
        CancellationToken cancellationToken = default)
    {
        var habit = await habitRepository.GetByIdAsync(id, cancellationToken);
        if (habit is null || habit.ArchivedAt is not null)
        {
            return null;
        }

        habit.Update(
            details.Name,
            details.Description,
            details.TrackingType,
            details.TargetValue,
            details.Unit);

        await habitRepository.UpdateAsync(habit, cancellationToken);
        return habit;
    }

    public async Task<bool> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var habit = await habitRepository.GetByIdAsync(id, cancellationToken);
        if (habit is null || habit.ArchivedAt is not null)
        {
            return false;
        }

        habit.Archive();
        await habitRepository.UpdateAsync(habit, cancellationToken);
        return true;
    }
}
