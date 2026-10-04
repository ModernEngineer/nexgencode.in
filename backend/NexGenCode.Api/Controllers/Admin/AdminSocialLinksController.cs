using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Controllers.Admin;

/// <summary>Social media icons in the website footer.</summary>
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/social-links")]
public class AdminSocialLinksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<SocialLinkDto>> List() =>
        (await db.SocialLinks.AsNoTracking().OrderBy(s => s.DisplayOrder).ThenBy(s => s.Id).ToListAsync())
        .Select(SocialLinkDto.From);

    [HttpPost]
    public async Task<ActionResult<SocialLinkDto>> Create(SocialLinkInput input)
    {
        var link = new SocialLink
        {
            Platform = "",
            Url = "",
            DisplayOrder = (await db.SocialLinks.MaxAsync(s => (int?)s.DisplayOrder) ?? 0) + 1,
        };
        Apply(link, input);
        db.SocialLinks.Add(link);
        await db.SaveChangesAsync();
        return Ok(SocialLinkDto.From(link));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SocialLinkDto>> Update(int id, SocialLinkInput input)
    {
        var link = await db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();
        Apply(link, input);
        await db.SaveChangesAsync();
        return SocialLinkDto.From(link);
    }

    [HttpPatch("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] bool isActive)
    {
        var link = await db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();
        link.IsActive = isActive;
        link.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("reorder")]
    public async Task<IActionResult> Reorder(ReorderRequest req)
    {
        var links = await db.SocialLinks.Where(s => req.Ids.Contains(s.Id)).ToListAsync();
        foreach (var s in links) s.DisplayOrder = req.Ids.IndexOf(s.Id) + 1;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var link = await db.SocialLinks.FindAsync(id);
        if (link is null) return NotFound();
        db.SocialLinks.Remove(link);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(SocialLink s, SocialLinkInput input)
    {
        s.Platform = input.Platform;
        s.Label = string.IsNullOrWhiteSpace(input.Label) ? null : input.Label.Trim();
        s.Url = input.Url.Trim();
        s.IsActive = input.IsActive;
        s.UpdatedAt = DateTime.UtcNow;
    }
}
