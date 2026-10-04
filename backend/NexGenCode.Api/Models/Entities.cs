using System.ComponentModel.DataAnnotations;

namespace NexGenCode.Api.Models;

public class AdminUser
{
    public int Id { get; set; }

    [MaxLength(64)]
    public required string Username { get; set; }

    [MaxLength(256)]
    public required string PasswordHash { get; set; }

    [MaxLength(120)]
    public string DisplayName { get; set; } = "Administrator";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}

/// <summary>A member shown on the "Meet Our Core Team" page.</summary>
public class TeamMember
{
    public int Id { get; set; }

    [MaxLength(120)]
    public required string Name { get; set; }

    /// <summary>Job title / designation, e.g. "Founder &amp; CEO".</summary>
    [MaxLength(120)]
    public required string Title { get; set; }

    [MaxLength(600)]
    public string Bio { get; set; } = "";

    /// <summary>Relative URL of an uploaded photo (/uploads/...) or an absolute URL. Null = show initials.</summary>
    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [MaxLength(300)]
    public string? LinkedInUrl { get; set; }

    [MaxLength(200)]
    public string? Email { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>A client review. Only reviews with IsApproved = true are shown on the website.</summary>
public class Review
{
    public int Id { get; set; }

    [MaxLength(120)]
    public required string ClientName { get; set; }

    [MaxLength(120)]
    public string? Designation { get; set; }

    [MaxLength(160)]
    public string? Company { get; set; }

    [MaxLength(80)]
    public string? City { get; set; }

    /// <summary>1–5 stars.</summary>
    public int Rating { get; set; }

    [MaxLength(1500)]
    public required string Comment { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsApproved { get; set; }
    public bool IsFeatured { get; set; }

    /// <summary>"website" when submitted by a visitor, "admin" when created in the panel.</summary>
    [MaxLength(20)]
    public string Source { get; set; } = "website";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum EnquiryStatus
{
    New,
    InProgress,
    Closed,
}

/// <summary>A submission of the website contact form (/contact).</summary>
public class ContactSubmission
{
    public int Id { get; set; }

    [MaxLength(120)]
    public required string Name { get; set; }

    [MaxLength(200)]
    public required string Email { get; set; }

    [MaxLength(30)]
    public string? Phone { get; set; }

    [MaxLength(160)]
    public string? Company { get; set; }

    [MaxLength(120)]
    public string? Service { get; set; }

    [MaxLength(40)]
    public string? Budget { get; set; }

    [MaxLength(4000)]
    public required string Message { get; set; }

    public EnquiryStatus Status { get; set; } = EnquiryStatus.New;

    [MaxLength(2000)]
    public string? AdminNotes { get; set; }

    [MaxLength(64)]
    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>A portfolio project shown on /portfolio (and the homepage when featured).</summary>
public class Project
{
    public int Id { get; set; }

    [MaxLength(160)]
    public required string Title { get; set; }

    /// <summary>Filter category, e.g. "Web App", "Mobile App", "Cloud".</summary>
    [MaxLength(60)]
    public required string Category { get; set; }

    [MaxLength(600)]
    public string Description { get; set; } = "";

    /// <summary>Screenshot (/uploads/...) or an absolute URL. Null = gradient placeholder.</summary>
    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    /// <summary>Chips shown on the card (e.g. "React", "ERP"). Stored as JSON.</summary>
    public List<string> Tags { get; set; } = [];

    /// <summary>Live link (Vercel deploy, website, store listing). Opens in a new tab.</summary>
    [MaxLength(500)]
    public string? Url { get; set; }

    /// <summary>Tailwind gradient used when there is no image, e.g. "from-sky-500 to-cyan-500".</summary>
    [MaxLength(80)]
    public string Accent { get; set; } = "from-sky-500 to-cyan-500";

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    /// <summary>Featured projects are shown on the homepage.</summary>
    public bool IsFeatured { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
