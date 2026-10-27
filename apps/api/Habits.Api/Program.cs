using Habits.Api.Contracts;
using Habits.Application.Repositories;
using Habits.Application.Services;
using Habits.Domain;
using Habits.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IHabitRepository, InMemoryHabitRepository>();
builder.Services.AddSingleton<IHabitProgressRepository, InMemoryHabitProgressRepository>();
builder.Services.AddSingleton<IHabitService, HabitService>();
builder.Services.AddSingleton<IHabitProgressService, HabitProgressService>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet(
    "/api/habits",
    async (IHabitService habitService, CancellationToken cancellationToken) =>
    {
        var habits = await habitService.ListActiveAsync(cancellationToken);
        return Results.Ok(habits.Select(ToHabitResponse));
    });

app.MapGet(
    "/api/habits/{id:guid}",
    async (
        Guid id,
        IHabitService habitService,
        CancellationToken cancellationToken) =>
    {
        var habit = await habitService.GetActiveByIdAsync(id, cancellationToken);

        return habit is null
            ? Results.NotFound()
            : Results.Ok(ToHabitResponse(habit));
    });

app.MapGet(
    "/api/habits/progress",
    async (
        DateOnly date,
        IHabitProgressService progressService,
        CancellationToken cancellationToken) =>
    {
        var progress = await progressService.GetForDateAsync(date, cancellationToken);
        return Results.Ok(progress.Select(ToHabitDayResponse));
    });

app.MapPost(
    "/api/habits",
    async (
        CreateHabitRequest request,
        IHabitService habitService,
        CancellationToken cancellationToken) =>
    {
        if (!TryParseTrackingType(request.TrackingType, out var trackingType))
        {
            return Results.BadRequest(new
            {
                message = "trackingType must be 'completion' or 'quantity'."
            });
        }

        try
        {
            var habit = await habitService.CreateAsync(
                ToHabitDetails(
                    request.Name,
                    request.Description,
                    trackingType,
                    request.TargetValue,
                    request.Unit),
                cancellationToken);

            return Results.Created(
                $"/api/habits/{habit.Id}",
                ToHabitResponse(habit));
        }
        catch (ArgumentException exception)
        {
            return Results.BadRequest(new { message = exception.Message });
        }
    });

app.MapPut(
    "/api/habits/{id:guid}",
    async (
        Guid id,
        UpdateHabitRequest request,
        IHabitService habitService,
        CancellationToken cancellationToken) =>
    {
        if (!TryParseTrackingType(request.TrackingType, out var trackingType))
        {
            return Results.BadRequest(new
            {
                message = "trackingType must be 'completion' or 'quantity'."
            });
        }

        try
        {
            var habit = await habitService.UpdateAsync(
                id,
                ToHabitDetails(
                    request.Name,
                    request.Description,
                    trackingType,
                    request.TargetValue,
                    request.Unit),
                cancellationToken);

            return habit is null
                ? Results.NotFound()
                : Results.Ok(ToHabitResponse(habit));
        }
        catch (ArgumentException exception)
        {
            return Results.BadRequest(new { message = exception.Message });
        }
    });

app.MapDelete(
    "/api/habits/{id:guid}",
    async (Guid id, IHabitService habitService, CancellationToken cancellationToken) =>
    {
        var archived = await habitService.ArchiveAsync(id, cancellationToken);
        return archived ? Results.NoContent() : Results.NotFound();
    });

app.MapPost(
    "/api/habits/{id:guid}/progress",
    async (
        Guid id,
        RecordHabitProgressRequest request,
        IHabitProgressService progressService,
        CancellationToken cancellationToken) =>
    {
        if (!TryParseTrackingType(request.TrackingType, out var trackingType))
        {
            return Results.BadRequest(new
            {
                message = "trackingType must be 'completion' or 'quantity'."
            });
        }

        try
        {
            var progress = await progressService.RecordAsync(
                new RecordHabitProgressCommand(
                    id,
                    request.Date,
                    trackingType,
                    request.Completed,
                    request.Amount),
                cancellationToken);

            return progress is null
                ? Results.NotFound()
                : Results.Ok(ToHabitProgressResponse(progress));
        }
        catch (ArgumentException exception)
        {
            return Results.BadRequest(new { message = exception.Message });
        }
    });

app.MapGet(
    "/api/calendar/summary",
    async (
        DateOnly startDate,
        DateOnly endDate,
        IHabitProgressService progressService,
        CancellationToken cancellationToken) =>
    {
        try
        {
            var summaries = await progressService.GetCalendarSummaryAsync(
                startDate,
                endDate,
                cancellationToken);

            return Results.Ok(summaries.Select(summary => new CalendarDaySummaryResponse(
                summary.Date,
                summary.TotalHabits,
                summary.CompletedHabits,
                summary.CompletionPercentage)));
        }
        catch (ArgumentException exception)
        {
            return Results.BadRequest(new { message = exception.Message });
        }
    });

app.Run();

static bool TryParseTrackingType(
    string? value,
    out HabitTrackingType trackingType)
{
    switch (value?.Trim().ToLowerInvariant())
    {
        case "completion":
            trackingType = HabitTrackingType.Completion;
            return true;
        case "quantity":
            trackingType = HabitTrackingType.Quantity;
            return true;
        default:
            trackingType = default;
            return false;
    }
}

static HabitDetails ToHabitDetails(
    string? name,
    string? description,
    HabitTrackingType trackingType,
    decimal? targetValue,
    string? unit)
{
    return new HabitDetails(
        name ?? string.Empty,
        description,
        trackingType,
        targetValue,
        unit);
}

static HabitResponse ToHabitResponse(Habit habit) => new(
    habit.Id.ToString(),
    habit.Name,
    habit.Description,
    habit.TrackingType switch
    {
        HabitTrackingType.Completion => "completion",
        HabitTrackingType.Quantity => "quantity",
        _ => throw new InvalidOperationException("The habit has an invalid tracking type.")
    },
    habit.TargetValue,
    habit.Unit,
    habit.CreatedAt,
    habit.ArchivedAt);

static HabitDayResponse ToHabitDayResponse(HabitDayProgress progress)
{
    var habit = progress.Habit;
    var isQuantityHabit = habit.TrackingType == HabitTrackingType.Quantity;

    return new HabitDayResponse(
        habit.Id.ToString(),
        habit.Name,
        habit.Description,
        progress.Date,
        TrackingTypeToString(habit.TrackingType),
        progress.Completed,
        isQuantityHabit ? progress.Amount : null,
        habit.TargetValue,
        habit.Unit);
}

static HabitProgressResponse ToHabitProgressResponse(HabitDayProgress progress)
{
    var habit = progress.Habit;
    var isQuantityHabit = habit.TrackingType == HabitTrackingType.Quantity;

    return new HabitProgressResponse(
        habit.Id.ToString(),
        progress.Date,
        TrackingTypeToString(habit.TrackingType),
        progress.Completed,
        isQuantityHabit ? progress.Amount : null,
        habit.TargetValue,
        habit.Unit);
}

static string TrackingTypeToString(HabitTrackingType trackingType) => trackingType switch
{
    HabitTrackingType.Completion => "completion",
    HabitTrackingType.Quantity => "quantity",
    _ => throw new InvalidOperationException("The habit has an invalid tracking type.")
};
