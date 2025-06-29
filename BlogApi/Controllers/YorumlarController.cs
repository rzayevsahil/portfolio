using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YorumlarController : ControllerBase
    {
        private readonly BlogContext _context;

        public YorumlarController(BlogContext context)
        {
            _context = context;
        }

        // Yorum ekle
        [HttpPost]
        public async Task<ActionResult<Yorum>> PostYorum(Yorum yorum)
        {
            _context.Yorumlar.Add(yorum);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(PostYorum), new { id = yorum.Id }, yorum);
        }

        // Belirli makalenin yorumlarını getir
        [HttpGet("makale/{makaleId}")]
        public async Task<ActionResult<IEnumerable<Yorum>>> GetYorumlarByMakale(int makaleId)
        {
            return await _context.Yorumlar.Where(y => y.MakaleId == makaleId).ToListAsync();
        }
    }
} 