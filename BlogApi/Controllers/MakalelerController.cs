using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MakalelerController : ControllerBase
    {
        private readonly BlogContext _context;

        public MakalelerController(BlogContext context)
        {
            _context = context;
        }

        // Tüm makaleleri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Makale>>> GetMakaleler()
        {
            return await _context.Makaleler.Where(m => m.Status).Include(m => m.Yorumlar).ToListAsync();
        }

        // Tek makale getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Makale>> GetMakale(int id)
        {
            var makale = await _context.Makaleler.FindAsync(id);
            if (makale == null || !makale.Status)
            {
                return NotFound();
            }
            return makale;
        }

        // Makale ekle
        [HttpPost]
        public async Task<ActionResult<Makale>> PostMakale(Makale makale)
        {
            // Tarih alanını ISO 8601 formatına çevir
            if (makale.Tarih == default)
            {
                makale.Tarih = DateTime.UtcNow;
            }
            else
            {
                // Eğer tarih string olarak gelirse, parse et
                makale.Tarih = DateTime.SpecifyKind(makale.Tarih, DateTimeKind.Utc);
            }
            _context.Makaleler.Add(makale);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMakale), new { id = makale.Id }, makale);
        }

        // Makale güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMakale(int id, Makale makale)
        {
            if (id != makale.Id)
                return BadRequest();

            _context.Entry(makale).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Makale sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMakale(int id)
        {
            var makale = await _context.Makaleler.FindAsync(id);
            if (makale == null)
                return NotFound();

            _context.Makaleler.Remove(makale);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 