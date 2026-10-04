using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Models;

namespace NexGenCode.Api.Data;

/// <summary>
/// Seeds the default admin account and sample (dummy) team members and reviews on first run.
/// Sample content only inserts into empty tables, so edits made in the admin panel are never overwritten.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IConfiguration config, IWebHostEnvironment env, ILogger logger)
    {
        if (!await db.AdminUsers.AnyAsync())
        {
            var username = config["Admin:DefaultUsername"] ?? "admin";
            var password = config["Admin:DefaultPassword"]
                ?? throw new InvalidOperationException("Admin:DefaultPassword must be configured for the first run.");
            var admin = new AdminUser { Username = username, PasswordHash = "", DisplayName = "NexGenCode Admin" };
            admin.PasswordHash = new PasswordHasher<AdminUser>().HashPassword(admin, password);
            db.AdminUsers.Add(admin);
            logger.LogWarning("Created default admin user '{Username}'. Change the password from the admin panel.", username);
        }

        if (!await db.TeamMembers.AnyAsync())
        {
            string[][] team =
            [
                ["Aarav Sharma", "Founder & CEO", "Leads strategy and client partnerships, with a decade of experience building business software for Indian SMEs."],
                ["Priya Verma", "Head of UI/UX Design", "Turns complex workflows into clean, intuitive interfaces for web, mobile and dashboards."],
                ["Rohit Mishra", "Lead Full-Stack Engineer", "Architects scalable React, Node.js and .NET applications — from ERP systems to e-commerce platforms."],
                ["Neha Gupta", "Project Manager", "Keeps every project on track with clear milestones, transparent updates and on-time delivery."],
                ["Ankit Srivastava", "Mobile App Lead", "Builds fast, reliable Android and iOS apps with React Native and modern backend integrations."],
                ["Sneha Tripathi", "Digital Marketing Lead", "Drives growth through SEO, Meta Ads and Google Ads campaigns focused on measurable results."],
                ["Vikas Yadav", "Cloud & DevOps Engineer", "Handles hosting, deployment, security and monitoring so client systems stay fast and stable."],
                ["Pooja Singh", "QA Lead", "Tests every release across devices and workflows so bugs are caught long before users see them."],
            ];
            db.TeamMembers.AddRange(team.Select((t, i) => new TeamMember
            {
                Name = t[0],
                Title = t[1],
                Bio = t[2],
                DisplayOrder = i + 1,
                IsActive = true,
            }));
        }

        if (!await db.Reviews.AnyAsync())
        {
            var now = DateTime.UtcNow;
            db.Reviews.AddRange(
                new Review
                {
                    ClientName = "Rajesh Agarwal", Designation = "Director", Company = "Agarwal Public School", City = "Prayagraj",
                    Rating = 5, IsApproved = true, IsFeatured = true, Source = "admin", CreatedAt = now.AddDays(-40),
                    Comment = "Our admissions, fees and attendance now run from one system. Parents get updates instantly and our office work has reduced by half. The NexGenCode team understood exactly how a school operates.",
                },
                new Review
                {
                    ClientName = "Dr. Sunita Pandey", Designation = "Managing Director", Company = "Pandey Multispeciality Hospital", City = "Varanasi",
                    Rating = 5, IsApproved = true, IsFeatured = true, Source = "admin", CreatedAt = now.AddDays(-32),
                    Comment = "Patient registration, billing and pharmacy are finally connected. The software is simple enough for our front desk staff and the support team responds quickly whenever we need help.",
                },
                new Review
                {
                    ClientName = "Manoj Kesarwani", Designation = "Owner", Company = "Hotel Sangam Residency", City = "Prayagraj",
                    Rating = 4, IsApproved = true, Source = "admin", CreatedAt = now.AddDays(-25),
                    Comment = "Room bookings, check-ins and housekeeping are much easier to manage now. Occupancy reports help us plan better during the Magh Mela season.",
                },
                new Review
                {
                    ClientName = "Kavita Jaiswal", Designation = "Founder", Company = "Kavya Ethnic Boutique", City = "Lucknow",
                    Rating = 5, IsApproved = true, IsFeatured = true, Source = "admin", CreatedAt = now.AddDays(-18),
                    Comment = "They built our online store and ran our Meta Ads campaigns. Orders from Instagram have grown steadily and managing inventory is no longer a headache.",
                },
                new Review
                {
                    ClientName = "Amit Chaurasia", Designation = "Partner", Company = "Chaurasia Realty", City = "Kanpur",
                    Rating = 5, IsApproved = true, Source = "admin", CreatedAt = now.AddDays(-10),
                    Comment = "The real estate CRM keeps every lead, site visit and follow-up in one place. Our sales team closes deals faster and nothing slips through the cracks.",
                },
                new Review
                {
                    ClientName = "Deepak Saxena", Designation = "Proprietor", Company = "Saxena Electronics", City = "Prayagraj",
                    Rating = 4, IsApproved = true, Source = "admin", CreatedAt = now.AddDays(-4),
                    Comment = "Fast POS billing with barcode support and GST reports. Very easy for my staff to learn, and stock tracking is accurate.",
                });
        }

        if (!await db.Projects.AnyAsync())
        {
            // Screenshots ship in SeedData/projects and are copied into wwwroot/uploads like admin uploads
            string? SeedImage(string file)
            {
                var source = Path.Combine(env.ContentRootPath, "SeedData", "projects", file);
                if (!File.Exists(source)) return null;
                var uploads = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");
                Directory.CreateDirectory(uploads);
                var name = $"seed-{file}";
                var target = Path.Combine(uploads, name);
                if (!File.Exists(target)) File.Copy(source, target);
                return $"/uploads/{name}";
            }

            var projects = new List<Project>
            {
                new() { Title = "IronPulse — Strength Studio", Category = "Web App", Accent = "from-indigo-500 to-blue-500",
                    Description = "A bold fitness studio website for memberships, coaching, training plans and gym community engagement.",
                    Tags = ["React", "Fitness", "Responsive UI"], ImageUrl = SeedImage("ironpulse.png"),
                    Url = "https://gym-wwyd.vercel.app/", IsFeatured = true },
                new() { Title = "Billing ERP — Business Management Platform", Category = "Web App", Accent = "from-emerald-500 to-teal-500",
                    Description = "A modern billing platform for managing invoices, inventory, sales, payments and business operations.",
                    Tags = ["React", "ERP", "Billing"], ImageUrl = SeedImage("billing-erp.png"),
                    Url = "https://billing-software-livid-omega.vercel.app/", IsFeatured = true },
                new() { Title = "Saffron & Ember — Fine Indian Dining", Category = "Web App", Accent = "from-amber-500 to-orange-500",
                    Description = "An atmospheric restaurant website for showcasing the menu, story, gallery and table reservations.",
                    Tags = ["React", "Restaurant", "Reservations"], ImageUrl = SeedImage("saffron-ember.png"),
                    Url = "https://restorent-ruddy.vercel.app/", IsFeatured = true },
                new() { Title = "Hospital — Healthcare Management Platform", Category = "Web App", Accent = "from-fuchsia-500 to-pink-500",
                    Description = "A modern hospital website for exploring healthcare services, departments, doctors, appointments and patient support in one accessible digital experience.",
                    Tags = ["React", "Healthcare", "Appointments"], ImageUrl = SeedImage("hospital.png"),
                    Url = "https://hospital-iota-sable.vercel.app/" },
                new() { Title = "OpSight — DevOps Observability Suite", Category = "Cloud", Accent = "from-amber-500 to-orange-500",
                    Description = "Unified logging, metrics and alerting for microservice fleets, deployed across AWS and Kubernetes.",
                    Tags = ["Kubernetes", "Grafana", "Go"] },
                new() { Title = "DocMind — AI Document Assistant", Category = "AI / ML", Accent = "from-violet-500 to-indigo-500",
                    Description = "An LLM-powered assistant that extracts, summarises and answers questions over large document sets.",
                    Tags = ["LLMs", "Python", "Vector Search"] },
                new() { Title = "RouteWise — Fleet Logistics Dashboard", Category = "Web App", Accent = "from-sky-500 to-cyan-500",
                    Description = "A live fleet-tracking and route optimisation dashboard used by logistics operators to cut fuel costs.",
                    Tags = ["React", "Mapbox", "PostgreSQL"] },
            };
            for (var i = 0; i < projects.Count; i++) projects[i].DisplayOrder = i + 1;
            db.Projects.AddRange(projects);
        }

        if (!await db.SocialLinks.AnyAsync())
        {
            // Dummy profile links — replace them in Admin → Social Links
            string[][] links =
            [
                ["linkedin", "NexGenCode on LinkedIn", "https://www.linkedin.com/company/your-company-page"],
                ["instagram", "NexGenCode on Instagram", "https://www.instagram.com/your-instagram-handle"],
                ["facebook", "NexGenCode on Facebook", "https://www.facebook.com/your-facebook-page"],
                ["twitter", "NexGenCode on X (Twitter)", "https://x.com/your-x-handle"],
                ["youtube", "NexGenCode on YouTube", "https://www.youtube.com/@your-channel"],
            ];
            db.SocialLinks.AddRange(links.Select((l, i) => new SocialLink
            {
                Platform = l[0], Label = l[1], Url = l[2], DisplayOrder = i + 1, IsActive = true,
            }));
        }

        await db.SaveChangesAsync();
    }
}
