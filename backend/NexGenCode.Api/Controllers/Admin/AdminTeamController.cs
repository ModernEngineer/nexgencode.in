using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;
using NexGenCode.Api.Services;

namespace NexGenCode.Api.Controllers.Admin;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/team")]
public class AdminTeamController(AppDbContext db, ImageStorage images) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<TeamMemberDto>> List() =>
        (await db.TeamMembers.AsNoTracking().OrderBy(m => m.DisplayOrder).ThenBy(m => m.Id).ToListAsync())
        .Select(TeamMemberDto.From);

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeamMemberDto>> Get(int id) =>
        await db.TeamMembers.FindAsync(id) is { } m ? TeamMemberDto.From(m) : NotFound();

    [HttpPost]
    public async Task<ActionResult<TeamMemberDto>> Create(TeamMemberInput input)
    {
        var order = input.DisplayOrder ?? (await db.TeamMembers.MaxAsync(m => (int?)m.DisplayOrder) ?? 0) + 1;
        var member = new TeamMember { Name = "", Title = "", DisplayOrder = order };
        Apply(member, input);
        member.DisplayOrder = order;
        db.TeamMembers.Add(member);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = member.Id }, TeamMemberDto.From(member));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TeamMemberDto>> Update(int id, TeamMemberInput input)
    {
        var member = await db.TeamMembers.FindAsync(id);
        if (member is null) return NotFound();

        var oldImage = member.ImageUrl;
        Apply(member, input);
        await db.SaveChangesAsync();
        if (oldImage != member.ImageUrl) images.TryDelete(oldImage);
        return TeamMemberDto.From(member);
    }

    [HttpPatch("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] bool isActive)
    {
        var member = await db.TeamMembers.FindAsync(id);
        if (member is null) return NotFound();
        member.IsActive = isActive;
        member.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Saves a new display order: ids in the order they should appear.</summary>
    [HttpPut("reorder")]
    public async Task<IActionResult> Reorder(ReorderRequest req)
    {
        var members = await db.TeamMembers.Where(m => req.Ids.Contains(m.Id)).ToListAsync();
        foreach (var m in members) m.DisplayOrder = req.Ids.IndexOf(m.Id) + 1;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var member = await db.TeamMembers.FindAsync(id);
        if (member is null) return NotFound();
        db.TeamMembers.Remove(member);
        await db.SaveChangesAsync();
        images.TryDelete(member.ImageUrl);
        return NoContent();
    }

    private static void Apply(TeamMember m, TeamMemberInput input)
    {
        m.Name = input.Name.Trim();
        m.Title = input.Title.Trim();
        m.Bio = input.Bio?.Trim() ?? "";
        m.ImageUrl = string.IsNullOrWhiteSpace(input.ImageUrl) ? null : input.ImageUrl.Trim();
        m.LinkedInUrl = string.IsNullOrWhiteSpace(input.LinkedInUrl) ? null : input.LinkedInUrl.Trim();
        m.Email = string.IsNullOrWhiteSpace(input.Email) ? null : input.Email.Trim();
        if (input.DisplayOrder is { } order) m.DisplayOrder = order;
        m.IsActive = input.IsActive;
        m.UpdatedAt = DateTime.UtcNow;
    }
}
