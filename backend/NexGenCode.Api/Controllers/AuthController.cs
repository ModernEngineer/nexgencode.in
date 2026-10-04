using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using NexGenCode.Api.Data;
using NexGenCode.Api.Dtos;
using NexGenCode.Api.Models;
using NexGenCode.Api.Services;

namespace NexGenCode.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens) : ControllerBase
{
    private static readonly PasswordHasher<AdminUser> Hasher = new();

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == req.Username.Trim());
        var result = user is null
            ? PasswordVerificationResult.Failed
            : Hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);

        if (user is null || result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid username or password." });

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
            user.PasswordHash = Hasher.HashPassword(user, req.Password);

        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var (token, expires) = tokens.CreateToken(user);
        return new LoginResponse(token, expires, user.Username, user.DisplayName);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await CurrentUser();
        return user is null ? Unauthorized() : Ok(new { user.Username, user.DisplayName, user.LastLoginAt });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest req)
    {
        var user = await CurrentUser();
        if (user is null) return Unauthorized();

        if (Hasher.VerifyHashedPassword(user, user.PasswordHash, req.CurrentPassword) == PasswordVerificationResult.Failed)
            return BadRequest(new { message = "Current password is incorrect." });

        user.PasswordHash = Hasher.HashPassword(user, req.NewPassword);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<AdminUser?> CurrentUser()
    {
        var sub = User.FindFirst("sub")?.Value;
        return int.TryParse(sub, out var id) ? await db.AdminUsers.FindAsync(id) : null;
    }
}
