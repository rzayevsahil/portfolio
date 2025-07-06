using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Models;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly BlogContext _context;

        public ArticleController(BlogContext context)
        {
            _context = context;
        }

        // DTO tanımı
        public class ArticleDto
        {
            public int Id { get; set; }
            public string TitleTr { get; set; }
            public string TitleEn { get; set; }
            public string ContentTr { get; set; }
            public string ContentEn { get; set; }
            public string Author { get; set; }
            public string Date { get; set; }
            public string Image { get; set; }
            public bool Status { get; set; }
            public bool IsPublished { get; set; }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles()
        {
            var articles = await _context.Articles.Where(m => m.Status).Include(m => m.Comments).ToListAsync();
            var result = articles.Select(m => new ArticleDto
            {
                Id = m.Id,
                TitleTr = m.TitleTr,
                TitleEn = m.TitleEn,
                ContentTr = m.ContentTr,
                ContentEn = m.ContentEn,
                Author = m.Author,
                Date = m.Date.ToString("yyyy-MM-ddTHH:mm:ss"),
                Image = m.Image,
                Status = m.Status,
                IsPublished = m.IsPublished
            }).ToList();
            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null || !article.Status)
            {
                return NotFound();
            }
            var result = new ArticleDto
            {
                Id = article.Id,
                TitleTr = article.TitleTr,
                TitleEn = article.TitleEn,
                ContentTr = article.ContentTr,
                ContentEn = article.ContentEn,
                Author = article.Author,
                Date = article.Date.ToString("yyyy-MM-ddTHH:mm:ss"),
                Image = article.Image,
                Status = article.Status,
                IsPublished = article.IsPublished
            };
            return result;
        }

        [HttpPost]
        public async Task<ActionResult<Article>> PostArticle(Article article)
        {
            // Tarih alanını ISO 8601 formatına çevir
            if (article.Date == default)
            {
                article.Date = DateTime.UtcNow;
            }
            else
            {
                // Eğer tarih string olarak gelirse, parse et
                article.Date = DateTime.SpecifyKind(article.Date, DateTimeKind.Utc);
            }
            article.Status = true;
            article.IsPublished = false;
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle(int id, Article article)
        {
            if (id != article.Id)
                return BadRequest();

            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
                return NotFound();

            article.Status = false;
            article.IsPublished = false;
            _context.Articles.Update(article);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("published")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetPublishedArticles()
        {
            var articles = await _context.Articles.Where(m => m.Status && m.IsPublished).Include(m => m.Comments).ToListAsync();
            var result = articles.Select(m => new ArticleDto
            {
                Id = m.Id,
                TitleTr = m.TitleTr,
                TitleEn = m.TitleEn,
                ContentTr = m.ContentTr,
                ContentEn = m.ContentEn,
                Author = m.Author,
                Date = m.Date.ToString("yyyy-MM-ddTHH:mm:ss"),
                Image = m.Image,
                Status = m.Status,
                IsPublished = m.IsPublished
            }).ToList();
            return result;
        }
    }
} 