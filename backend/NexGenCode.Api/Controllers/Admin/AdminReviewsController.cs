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
[Route("api/admin/reviews")]
public class AdminReviewsController(AppDbContext db, ImageStorage images) : ControllerBase
{
    /// <param name="status">all | pending | approved</param>
    [HttpGet]
    public async Task<IEnumerable<ReviewDto>> List([FromQuery] string status = "all")
    {
        var q = db.Reviews.AsNoTracking();
        q = status switch
        {
            "pending" => q.Where(r => !r.IsApproved),
            "approved" => q.Where(r => r.IsApproved),
            _ => q,
        };
        return (await q.OrderByDescending(r => r.CreatedAt).ToListAsync()).Select(ReviewDto.From);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ReviewDto>> Get(int id) =>
        await db.Reviews.FindAsync(id) is { } r ? ReviewDto.From(r) : NotFound();

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> Create(ReviewInput input)
    {
        var review = new Review { ClientName = "", Comment = "", Source = "admin" };
        Apply(review, input);
        db.Reviews.Add(review);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = review.Id }, ReviewDto.From(review));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ReviewDto>> Update(int id, ReviewInput input)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null) return NotFound();
        var oldImage = review.ImageUrl;
        Apply(review, input);
        await db.SaveChangesAsync();
        if (oldImage != review.ImageUrl) images.TryDelete(oldImage);
        return ReviewDto.From(review);
    }

    /// <summary>Enable (show on website) or disable a review.</summary>
    [HttpPatch("{id:int}/approval")]
    public async Task<IActionResult> SetApproval(int id, ApprovalRequest req)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null) return NotFound();
        review.IsApproved = req.IsApproved;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null) return NotFound();
        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        images.TryDelete(review.ImageUrl);
        return NoContent();
    }

    private static void Apply(Review r, ReviewInput input)
    {
        r.ClientName = input.ClientName.Trim();
        r.Designation = string.IsNullOrWhiteSpace(input.Designation) ? null : input.Designation.Trim();
        r.Company = string.IsNullOrWhiteSpace(input.Company) ? null : input.Company.Trim();
        r.City = string.IsNullOrWhiteSpace(input.City) ? null : input.City.Trim();
        r.Rating = input.Rating;
        r.Comment = input.Comment.Trim();
        r.ImageUrl = string.IsNullOrWhiteSpace(input.ImageUrl) ? null : input.ImageUrl.Trim();
        r.IsApproved = input.IsApproved;
        r.IsFeatured = input.IsFeatured;
    }
}
