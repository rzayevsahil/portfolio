using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Data;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly BlogContext _context;
        public ProfileController(BlogContext context)
        {
            _context = context;
        }

        // GET: api/profile
        [HttpGet]
        public ActionResult<Profile> Get()
        {
            var profile = _context.Set<Profile>().FirstOrDefault();
            if (profile == null)
            {
                return NotFound(new { message = "Profil bilgileri bulunamadı." });
            }
            return Ok(profile);
        }

        // PUT: api/profile
        [Authorize]
        [HttpPut]
        public ActionResult<Profile> Update(Profile updated)
        {
            var profile = _context.Set<Profile>().FirstOrDefault();
            if (profile == null)
            {
                _context.Set<Profile>().Add(updated);
            }
            else
            {
                profile.Name = updated.Name;
                profile.Email = updated.Email;
                profile.PhotoUrl = updated.PhotoUrl;
                if (!string.IsNullOrEmpty(updated.Password))
                    profile.Password = updated.Password;
            }
            _context.SaveChanges();
            return Ok(updated);
        }

        // POST: api/profile/photo
        [Authorize]
        [HttpPost("photo")]
        public IActionResult UploadPhoto([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya seçilmedi.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile_photos");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            // URL oluştur (ör: /profile_photos/filename.jpg)
            var url = $"/profile_photos/{fileName}";

            // Profile tablosunda PhotoUrl güncelle, eski fotoğrafı sil
            var profile = _context.Set<Profile>().FirstOrDefault();
            if (profile != null)
            {
                // Eski fotoğrafı sil
                if (!string.IsNullOrEmpty(profile.PhotoUrl))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", profile.PhotoUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }
                profile.PhotoUrl = url;
                _context.SaveChanges();
            }

            return Ok(new { url });
        }

        // POST: api/profile/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("E-posta ve şifre gereklidir.");

            // Debug log
            var firstProfile = _context.Set<Profile>().FirstOrDefault();
            Console.WriteLine($"Gelen: {request.Email} / {request.Password}");
            if (firstProfile != null)
                Console.WriteLine($"DB: {firstProfile.Email} / {firstProfile.Password}");

            var profile = _context.Set<Profile>().FirstOrDefault(p => 
                p.Email == request.Email && p.Password == request.Password);

            if (profile == null)
                return Unauthorized("E-posta veya şifre hatalı.");

            // JWT secret'ı ortamdan veya configden al
            var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? StartupStaticConfig.JwtSecret;
            if (string.IsNullOrEmpty(jwtSecret) || jwtSecret.Length < 32)
                throw new Exception("JWT_SECRET environment variable must be set and at least 32 characters!");

            // JWT token oluştur
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, profile.Email),
                    new Claim(ClaimTypes.Name, profile.Name)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new {
                message = "Giriş başarılı",
                token = tokenString,
                user = new {
                    name = profile.Name,
                    email = profile.Email,
                    photoUrl = profile.PhotoUrl
                }
            });
        }

        // Artık kullanılmıyor, sadece fallback için static config
        public static class StartupStaticConfig
        {
            public static string JwtSecret = null;
        }
    }
} 