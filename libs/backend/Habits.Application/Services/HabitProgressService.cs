using Habits.Application.Repositories;
using Habits.Domain;

namespace Habits.Application.Services;

public sealed class HabitProgressService(
    IHabitRepository habitRepository,
    IHabitProgressRepository progressRepository) : IHabitProgressService
{
    public async Task<IReadOnlyList<HabitDayProgress>> GetForDateAsync(
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        var allHabits = await habitRepository.ListAllAsync(cancellationToken);
        var savedProgress = await progressRepository.ListForDateAsync(
            date,
            cancellationToken);
        var progressByHabitId = savedProgress.ToDictionary(
            progress => progress.HabitId,
            progress => progress.Amount);

        return allHabits
            .Where(habit => habit.IsActiveOn(date))
            .Select(habit => new HabitDayProgress(
                habit,
                date,
                progressByHabitId.GetValueOrDefault(habit.Id)))
            .ToArray();
    }

    public async Task<HabitDayProgress?> RecordAsync(
        RecordHabitProgressCommand command,
        CancellationToken cancellationToken = default)
    {
        var habit = await habitRepository.GetByIdAsync(
            command.HabitId,
            cancellationToken);
        if (habit is null || !habit.IsActiveOn(command.Date))
        {
            return null;
        }

        if (command.TrackingType != habit.TrackingType)
        {
            throw new ArgumentException(
                "The progress tracking type must match the habit tracking type.");
        }

        var amount = command.TrackingType switch
        {
            HabitTrackingType.Completion when command.Completed is not null
                && command.Amount is null => command.Completed.Value ? 1m : 0m,
            HabitTrackingType.Quantity when command.Amount is not null
                && command.Completed is null => command.Amount.Value,
            _ => throw new ArgumentException(
                "Completion habits require 'completed'; quantity habits require 'amount'.")
        };

        var progress = await progressRepository.GetAsync(
            habit.Id,
            command.Date,
            cancellationToken);

        if (progress is null)
        {
            progress = new HabitProgress(habit.Id, command.Date, amount);
        }
        else
        {
            progress.SetAmount(amount);
        }

        await progressRepository.UpsertAsync(progress, cancellationToken);
        return new HabitDayProgress(habit, command.Date, progress.Amount);
    }

    public async Task<IReadOnlyList<HabitCalendarDaySummary>> GetCalendarSummaryAsync(
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default)
    {
        if (endDate < startDate)
        {
            throw new ArgumentException("The end date must be on or after the start date.");
        }

        var dayCount = endDate.DayNumber - startDate.DayNumber + 1;
        if (dayCount > 366)
        {
            throw new ArgumentOutOfRangeException(
                nameof(endDate),
                "Calendar summaries can cover at most 366 days at a time.");
        }

        var habits = await habitRepository.ListAllAsync(cancellationToken);
        var progress = await progressRepository.ListBetweenAsync(
            startDate,
            endDate,
            cancellationToken);
        var progressByKey = progress.ToDictionary(
            entry => (entry.HabitId, entry.Date),
            entry => entry.Amount);
        var summaries = new List<HabitCalendarDaySummary>(dayCount);

        for (var offset = 0; offset < dayCount; offset++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var date = startDate.AddDays(offset);
            var activeHabits = habits
                .Where(habit => habit.IsActiveOn(date))
                .ToArray();
            var completedHabits = activeHabits.Count(habit =>
                progressByKey.TryGetValue((habit.Id, date), out var amount)
                && new HabitDayProgress(habit, date, amount).Completed);

            summaries.Add(new HabitCalendarDaySummary(
                date,
                activeHabits.Length,
                completedHabits));
        }

        return summaries;
    }
}
