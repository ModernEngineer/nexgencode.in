namespace NexGenCode.Api.Services;

/// <summary>Stores uploaded images under wwwroot/uploads and returns their public relative URL.</summary>
public class ImageStorage(IWebHostEnvironment env)
{
    public const long MaxBytes = 3 * 1024 * 1024;

    // SVG deliberately excluded — it can carry script.
    private static readonly Dictionary<string, byte[][]> Signatures = new()
    {
        [".jpg"] = [[0xFF, 0xD8, 0xFF]],
        [".jpeg"] = [[0xFF, 0xD8, 0xFF]],
        [".png"] = [[0x89, 0x50, 0x4E, 0x47]],
        [".webp"] = [[0x52, 0x49, 0x46, 0x46]],
    };

    private string UploadDir => Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");

    public async Task<string> SaveAsync(IFormFile file, CancellationToken ct)
    {
        if (file.Length == 0) throw new InvalidDataException("The file is empty.");
        if (file.Length > MaxBytes) throw new InvalidDataException("Images must be 3 MB or smaller.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!Signatures.TryGetValue(ext, out var sigs))
            throw new InvalidDataException("Only JPG, PNG and WebP images are allowed.");

        // Check the magic bytes so a renamed file can't slip through
        var header = new byte[4];
        await using (var peek = file.OpenReadStream())
        {
            _ = await peek.ReadAsync(header, ct);
        }
        if (!sigs.Any(sig => header.AsSpan(0, sig.Length).SequenceEqual(sig)))
            throw new InvalidDataException("The file content does not match its image type.");

        Directory.CreateDirectory(UploadDir);
        var name = $"{Guid.NewGuid():N}{ext}";
        await using var stream = File.Create(Path.Combine(UploadDir, name));
        await file.CopyToAsync(stream, ct);
        return $"/uploads/{name}";
    }

    /// <summary>Deletes a previously uploaded file. Ignores external URLs and anything outside /uploads.</summary>
    public void TryDelete(string? url)
    {
        if (string.IsNullOrEmpty(url) || !url.StartsWith("/uploads/")) return;
        var name = Path.GetFileName(url);
        var path = Path.Combine(UploadDir, name);
        if (File.Exists(path)) File.Delete(path);
    }
}
