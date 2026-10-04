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
[Route("api/admin")]
public class AdminDashboardController(AppDbContext db, ImageStorage images) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<DashboardStats> Dashboard()
    {
        var approved = db.Reviews.Where(r => r.IsApproved);
        var approvedCount = await approved.CountAsync();

        return new DashboardStats(
            NewEnquiries: await db.ContactSubmissions.CountAsync(c => c.Status == EnquiryStatus.New),
            TotalEnquiries: await db.ContactSubmissions.CountAsync(),
            PendingReviews: await db.Reviews.CountAsync(r => !r.IsApproved),
            ApprovedReviews: approvedCount,
            ActiveTeamMembers: await db.TeamMembers.CountAsync(m => m.IsActive),
            AverageRating: approvedCount == 0 ? 0 : Math.Round(await approved.AverageAsync(r => r.Rating), 1),
            LatestEnquiries: (await db.ContactSubmissions.AsNoTracking().OrderByDescending(c => c.CreatedAt).Take(5).ToListAsync())
                .Select(ContactSubmissionDto.From).ToList(),
            LatestPendingReviews: (await db.Reviews.AsNoTracking().Where(r => !r.IsApproved).OrderByDescending(r => r.CreatedAt).Take(5).ToListAsync())
                .Select(ReviewDto.From).ToList());
    }

    /// <summary>Uploads a JPG/PNG/WebP image (max 3 MB) and returns its URL.</summary>
    [HttpPost("uploads")]
    [RequestSizeLimit(ImageStorage.MaxBytes + 64 * 1024)]
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken ct)
    {
        try
        {
            var url = await images.SaveAsync(file, ct);
            return Ok(new { url });
        }
        catch (InvalidDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
