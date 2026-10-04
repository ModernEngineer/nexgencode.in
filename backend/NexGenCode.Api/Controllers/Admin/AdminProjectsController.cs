using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;
using NexGenCode.Api.Services;

namespace NexGenCode.Api.Controllers.Admin;

/// <summary>Portfolio projects shown on /portfolio (featured ones also on the homepage).</summary>
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/projects")]
public class AdminProjectsController(AppDbContext db, ImageStorage images) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<ProjectDto>> List() =>
        (await db.Projects.AsNoTracking().OrderBy(p => p.DisplayOrder).ThenBy(p => p.Id).ToListAsync())
        .Select(ProjectDto.From);

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectDto>> Get(int id) =>
        await db.Projects.FindAsync(id) is { } p ? ProjectDto.From(p) : NotFound();

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create(ProjectInput input)
    {
        var project = new Project
        {
            Title = "",
            Category = "",
            DisplayOrder = (await db.Projects.MaxAsync(p => (int?)p.DisplayOrder) ?? 0) + 1,
        };
        Apply(project, input);
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = project.Id }, ProjectDto.From(project));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProjectDto>> Update(int id, ProjectInput input)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return NotFound();
        var oldImage = project.ImageUrl;
        Apply(project, input);
        await db.SaveChangesAsync();
        if (oldImage != project.ImageUrl) images.TryDelete(oldImage);
        return ProjectDto.From(project);
    }

    [HttpPatch("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] bool isActive)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return NotFound();
        project.IsActive = isActive;
        project.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id:int}/featured")]
    public async Task<IActionResult> SetFeatured(int id, [FromBody] bool isFeatured)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return NotFound();
        project.IsFeatured = isFeatured;
        project.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Saves a new display order: ids in the order they should appear.</summary>
    [HttpPut("reorder")]
    public async Task<IActionResult> Reorder(ReorderRequest req)
    {
        var projects = await db.Projects.Where(p => req.Ids.Contains(p.Id)).ToListAsync();
        foreach (var p in projects) p.DisplayOrder = req.Ids.IndexOf(p.Id) + 1;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await db.Projects.FindAsync(id);
        if (project is null) return NotFound();
        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        images.TryDelete(project.ImageUrl);
        return NoContent();
    }

    private static void Apply(Project p, ProjectInput input)
    {
        p.Title = input.Title.Trim();
        p.Category = input.Category.Trim();
        p.Description = input.Description?.Trim() ?? "";
        p.ImageUrl = string.IsNullOrWhiteSpace(input.ImageUrl) ? null : input.ImageUrl.Trim();
        p.Tags = (input.Tags ?? [])
            .Select(t => t.Trim())
            .Where(t => t.Length is > 0 and <= 40)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(12)
            .ToList();
        p.Url = string.IsNullOrWhiteSpace(input.Url) ? null : input.Url.Trim();
        if (!string.IsNullOrWhiteSpace(input.Accent)) p.Accent = input.Accent.Trim();
        p.IsActive = input.IsActive;
        p.IsFeatured = input.IsFeatured;
        p.UpdatedAt = DateTime.UtcNow;
    }
}
