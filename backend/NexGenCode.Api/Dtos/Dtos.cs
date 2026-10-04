using System.ComponentModel.DataAnnotations;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Dtos;

// ---------- Auth ----------

public record LoginRequest(
    [Required, MaxLength(64)] string Username,
    [Required, MaxLength(128)] string Password);

public record LoginResponse(string Token, DateTime ExpiresAt, string Username, string DisplayName);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required, MinLength(8), MaxLength(128)] string NewPassword);

// ---------- Team ----------

public record TeamMemberDto(
    int Id, string Name, string Title, string Bio, string? ImageUrl, string? LinkedInUrl, string? Email,
    int DisplayOrder, bool IsActive)
{
    public static TeamMemberDto From(TeamMember m) =>
        new(m.Id, m.Name, m.Title, m.Bio, m.ImageUrl, m.LinkedInUrl, m.Email, m.DisplayOrder, m.IsActive);
}

public record TeamMemberInput(
    [Required, MaxLength(120)] string Name,
    [Required, MaxLength(120)] string Title,
    [MaxLength(600)] string? Bio,
    [MaxLength(500)] string? ImageUrl,
    [MaxLength(300), Url] string? LinkedInUrl,
    [MaxLength(200), EmailAddress] string? Email,
    int? DisplayOrder,
    bool IsActive = true);

public record ReorderRequest([Required] List<int> Ids);

// ---------- Reviews ----------

public record ReviewDto(
    int Id, string ClientName, string? Designation, string? Company, string? City, int Rating, string Comment,
    string? ImageUrl, bool IsApproved, bool IsFeatured, string Source, DateTime CreatedAt)
{
    public static ReviewDto From(Review r) =>
        new(r.Id, r.ClientName, r.Designation, r.Company, r.City, r.Rating, r.Comment, r.ImageUrl, r.IsApproved,
            r.IsFeatured, r.Source, r.CreatedAt);
}

/// <summary>Public "write a review" form. Saved as not approved until an admin enables it.</summary>
public record ReviewSubmission(
    [Required, MaxLength(120)] string ClientName,
    [MaxLength(120)] string? Designation,
    [MaxLength(160)] string? Company,
    [MaxLength(80)] string? City,
    [Range(1, 5)] int Rating,
    [Required, MinLength(10), MaxLength(1500)] string Comment,
    /// <summary>Honeypot — real users leave it empty.</summary>
    string? Website);

public record ReviewInput(
    [Required, MaxLength(120)] string ClientName,
    [MaxLength(120)] string? Designation,
    [MaxLength(160)] string? Company,
    [MaxLength(80)] string? City,
    [Range(1, 5)] int Rating,
    [Required, MaxLength(1500)] string Comment,
    [MaxLength(500)] string? ImageUrl,
    bool IsApproved,
    bool IsFeatured);

public record ApprovalRequest(bool IsApproved);

// ---------- Contact ----------

public record ContactRequest(
    [Required, MaxLength(120)] string Name,
    [Required, MaxLength(200), EmailAddress] string Email,
    [MaxLength(30)] string? Phone,
    [MaxLength(160)] string? Company,
    [MaxLength(120)] string? Service,
    [MaxLength(40)] string? Budget,
    [Required, MaxLength(4000)] string Message,
    /// <summary>Honeypot — real users leave it empty.</summary>
    string? Website);

public record ContactSubmissionDto(
    int Id, string Name, string Email, string? Phone, string? Company, string? Service, string? Budget,
    string Message, EnquiryStatus Status, string? AdminNotes, DateTime CreatedAt)
{
    public static ContactSubmissionDto From(ContactSubmission c) =>
        new(c.Id, c.Name, c.Email, c.Phone, c.Company, c.Service, c.Budget, c.Message, c.Status, c.AdminNotes,
            c.CreatedAt);
}

public record ContactUpdateRequest(EnquiryStatus Status, [MaxLength(2000)] string? AdminNotes);

// ---------- Shared ----------

public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public record DashboardStats(
    int NewEnquiries, int TotalEnquiries, int PendingReviews, int ApprovedReviews, int ActiveTeamMembers,
    double AverageRating, IReadOnlyList<ContactSubmissionDto> LatestEnquiries, IReadOnlyList<ReviewDto> LatestPendingReviews);
