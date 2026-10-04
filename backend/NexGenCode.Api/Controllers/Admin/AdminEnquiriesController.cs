using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Controllers.Admin;

/// <summary>Contact form submissions from the website.</summary>
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/enquiries")]
public class AdminEnquiriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResult<ContactSubmissionDto>> List(
        [FromQuery] EnquiryStatus? status, [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var q = db.ContactSubmissions.AsNoTracking();
        if (status is not null) q = q.Where(c => c.Status == status);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            q = q.Where(c => c.Name.Contains(s) || c.Email.Contains(s) || (c.Phone != null && c.Phone.Contains(s))
                             || (c.Company != null && c.Company.Contains(s)) || c.Message.Contains(s));
        }

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(c => c.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedResult<ContactSubmissionDto>(items.Select(ContactSubmissionDto.From).ToList(), total, page, pageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ContactSubmissionDto>> Get(int id) =>
        await db.ContactSubmissions.FindAsync(id) is { } c ? ContactSubmissionDto.From(c) : NotFound();

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<ContactSubmissionDto>> Update(int id, ContactUpdateRequest req)
    {
        var entry = await db.ContactSubmissions.FindAsync(id);
        if (entry is null) return NotFound();
        entry.Status = req.Status;
        entry.AdminNotes = req.AdminNotes;
        await db.SaveChangesAsync();
        return ContactSubmissionDto.From(entry);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entry = await db.ContactSubmissions.FindAsync(id);
        if (entry is null) return NotFound();
        db.ContactSubmissions.Remove(entry);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
