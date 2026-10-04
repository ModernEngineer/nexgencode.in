using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Controllers;

/// <summary>Endpoints used by the public website.</summary>
[ApiController]
[Route("api")]
public class PublicController(AppDbContext db, ILogger<PublicController> logger) : ControllerBase
{
    /// <summary>Active team members in display order ("Meet Our Core Team").</summary>
    [HttpGet("team")]
    public async Task<IEnumerable<TeamMemberDto>> Team() =>
        (await db.TeamMembers.AsNoTracking()
            .Where(m => m.IsActive)
            .OrderBy(m => m.DisplayOrder).ThenBy(m => m.Id)
            .ToListAsync())
        .Select(TeamMemberDto.From);

    /// <summary>Active portfolio projects in display order. ?featured=true returns only homepage projects.</summary>
    [HttpGet("projects")]
    public async Task<IEnumerable<ProjectDto>> Projects([FromQuery] bool featured = false)
    {
        var q = db.Projects.AsNoTracking().Where(p => p.IsActive);
        if (featured) q = q.Where(p => p.IsFeatured);
        return (await q.OrderBy(p => p.DisplayOrder).ThenBy(p => p.Id).ToListAsync()).Select(ProjectDto.From);
    }

    /// <summary>Approved (admin-enabled) reviews only, featured first.</summary>
    [HttpGet("reviews")]
    public async Task<IActionResult> Reviews([FromQuery] int? limit)
    {
        var approved = db.Reviews.AsNoTracking().Where(r => r.IsApproved);
        var query = approved.OrderByDescending(r => r.IsFeatured).ThenByDescending(r => r.CreatedAt);
        var items = await (limit is > 0 ? query.Take(Math.Min(limit.Value, 50)) : query).ToListAsync();
        var count = await approved.CountAsync();
        var average = count == 0 ? 0 : await approved.AverageAsync(r => r.Rating);

        // Admin-only fields (approval/source) aren't exposed publicly
        return Ok(new
        {
            items = items.Select(r => new
            {
                r.Id, r.ClientName, r.Designation, r.Company, r.City, r.Rating, r.Comment, r.ImageUrl, r.CreatedAt,
            }),
            count,
            average = Math.Round(average, 1),
        });
    }

    /// <summary>Visitor-submitted review. Hidden until approved in the admin panel.</summary>
    [HttpPost("reviews")]
    [EnableRateLimiting("submit")]
    public async Task<IActionResult> SubmitReview(ReviewSubmission req)
    {
        if (!string.IsNullOrEmpty(req.Website)) return Accepted(); // honeypot: pretend success for bots

        db.Reviews.Add(new Review
        {
            ClientName = req.ClientName.Trim(),
            Designation = req.Designation?.Trim(),
            Company = req.Company?.Trim(),
            City = req.City?.Trim(),
            Rating = req.Rating,
            Comment = req.Comment.Trim(),
            IsApproved = false,
            Source = "website",
        });
        await db.SaveChangesAsync();
        return Accepted(new { message = "Thank you! Your review will appear after it is approved." });
    }

    /// <summary>Contact form submission from /contact.</summary>
    [HttpPost("contact")]
    [EnableRateLimiting("submit")]
    public async Task<IActionResult> Contact(ContactRequest req)
    {
        if (!string.IsNullOrEmpty(req.Website)) return Accepted();

        var entry = new ContactSubmission
        {
            Name = req.Name.Trim(),
            Email = req.Email.Trim(),
            Phone = req.Phone?.Trim(),
            Company = req.Company?.Trim(),
            Service = req.Service?.Trim(),
            Budget = req.Budget?.Trim(),
            Message = req.Message.Trim(),
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
        };
        db.ContactSubmissions.Add(entry);
        await db.SaveChangesAsync();
        logger.LogInformation("New enquiry #{Id} from {Email}", entry.Id, entry.Email);
        return Accepted(new { message = "Thanks — we'll get back to you within one business day." });
    }
}
