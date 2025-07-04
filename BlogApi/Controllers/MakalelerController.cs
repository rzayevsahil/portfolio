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

        // DTO tanımı
        public class MakaleDto
        {
            public int Id { get; set; }
            public string BaslikTr { get; set; }
            public string BaslikEn { get; set; }
            public string IcerikTr { get; set; }
            public string IcerikEn { get; set; }
            public string Yazar { get; set; }
            public string Tarih { get; set; }
            public string Image { get; set; }
            public bool Status { get; set; }
            public bool IsPublished { get; set; }
        }

        // Tüm makaleleri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MakaleDto>>> GetMakaleler()
        {
            var makaleler = await _context.Makaleler.Where(m => m.Status).Include(m => m.Yorumlar).ToListAsync();
            var result = makaleler.Select(m => new MakaleDto
            {
                Id = m.Id,
                BaslikTr = m.BaslikTr,
                BaslikEn = m.BaslikEn,
                IcerikTr = m.IcerikTr,
                IcerikEn = m.IcerikEn,
                Yazar = m.Yazar,
                Tarih = m.Tarih.ToString("yyyy-MM-ddTHH:mm:ss"),
                Image = m.Image,
                Status = m.Status,
                IsPublished = m.IsPublished
            }).ToList();
            return result;
        }

        // Tek makale getir
        [HttpGet("{id}")]
        public async Task<ActionResult<MakaleDto>> GetMakale(int id)
        {
            var makale = await _context.Makaleler.FindAsync(id);
            if (makale == null || !makale.Status)
            {
                return NotFound();
            }
            var result = new MakaleDto
            {
                Id = makale.Id,
                BaslikTr = makale.BaslikTr,
                BaslikEn = makale.BaslikEn,
                IcerikTr = makale.IcerikTr,
                IcerikEn = makale.IcerikEn,
                Yazar = makale.Yazar,
                Tarih = makale.Tarih.ToString("yyyy-MM-ddTHH:mm:ss"),
                Image = makale.Image,
                Status = makale.Status,
                IsPublished = makale.IsPublished
            };
            return result;
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