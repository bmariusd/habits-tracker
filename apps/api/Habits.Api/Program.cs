using Habits.Application.Repositories;
using Habits.Domain;
using Habits.Infrastructure.Repositories;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IHabitRepository, InMemoryHabitRepository>();
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet(
    "/api/habits",
    async (IHabitRepository habitRepository, CancellationToken cancellationToken) =>
    {
        var habits = await habitRepository.ListActiveAsync(cancellationToken);

        var response = habits.Select(habit => new
        {
            id = habit.Id.ToString(),
            name = habit.Name,
            description = habit.Description,
            trackingType = habit.TrackingType == HabitTrackingType.Completion
                ? "completion"
                : "quantity",
            targetValue = habit.TargetValue,
            unit = habit.Unit,
            createdAt = habit.CreatedAt,
            archivedAt = habit.ArchivedAt
        });

        return Results.Ok(response);
    });

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
