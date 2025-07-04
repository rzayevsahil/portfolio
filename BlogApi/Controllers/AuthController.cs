using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Services;
using BlogApi.Data;
using System.Linq;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly BlogContext _context;

        public AuthController(JwtService jwtService, BlogContext context)
        {
            _jwtService = jwtService;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest model)
        {
            var user = _context.Set<Profile>().FirstOrDefault(p => p.Email == model.Email && p.Password == model.Password);
            if (user == null)
                return Unauthorized("E-posta veya şifre hatalı.");

            var token = _jwtService.GenerateToken(user.Email, user.Name);
            return Ok(new { token });
        }
    }
} 