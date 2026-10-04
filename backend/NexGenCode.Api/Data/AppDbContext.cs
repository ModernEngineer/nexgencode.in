using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AdminUser>().HasIndex(x => x.Username).IsUnique();

        b.Entity<TeamMember>().HasIndex(x => new { x.IsActive, x.DisplayOrder });

        b.Entity<Review>(e =>
        {
            e.HasIndex(x => new { x.IsApproved, x.CreatedAt });
            e.ToTable(t => t.HasCheckConstraint("CK_Reviews_Rating", "[Rating] BETWEEN 1 AND 5"));
        });

        b.Entity<ContactSubmission>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => new { x.Status, x.CreatedAt });
        });
    }
}
