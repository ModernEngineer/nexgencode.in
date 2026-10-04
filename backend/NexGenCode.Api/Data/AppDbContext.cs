using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AdminUser>().HasIndex(x => x.Username).IsUnique();

        b.Entity<TeamMember>().HasIndex(x => new { x.IsActive, x.DisplayOrder });

        b.Entity<Review>(e =>
        {
            e.HasIndex(x => new { x.IsApproved, x.CreatedAt });
            e.ToTable(t => t.HasCheckConstraint("CK_Reviews_Rating", "[Rating] BETWEEN 1 AND 5"));
        });

        b.Entity<Project>(e =>
        {
            e.HasIndex(x => new { x.IsActive, x.DisplayOrder });
            // Tags as a JSON array in one column
            e.Property(x => x.Tags)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .HasMaxLength(1000)
                .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                    (a, b) => a!.SequenceEqual(b!),
                    v => v.Aggregate(0, (h, t) => HashCode.Combine(h, t.GetHashCode())),
                    v => v.ToList()));
        });

        b.Entity<SocialLink>().HasIndex(x => new { x.IsActive, x.DisplayOrder });

        b.Entity<ContactSubmission>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => new { x.Status, x.CreatedAt });
        });
    }
}
