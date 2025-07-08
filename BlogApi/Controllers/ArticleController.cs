using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using BlogApi.Entities;

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

        // ArticleDto tanımını kaldırıyorum

        // Slugify fonksiyonu ekle
        private string Slugify(string text)
        {
            if (string.IsNullOrEmpty(text)) return "";
            var slug = text.ToLowerInvariant()
                .Replace("ğ", "g").Replace("ü", "u").Replace("ş", "s").Replace("ı", "i").Replace("ö", "o").Replace("ç", "c");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, "-+", "-");
            slug = slug.Trim('-');
            return slug;
        }

        [Authorize]
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
                IsPublished = m.IsPublished,
                Type = m.Type,
                Slug = m.Slug
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
                IsPublished = article.IsPublished,
                Type = article.Type,
                Slug = article.Slug
            };
            return result;
        }

        [Authorize]
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
            article.Type = string.IsNullOrEmpty(article.Type) ? "classic" : article.Type;
            article.Slug = Slugify(article.TitleTr ?? article.TitleEn);
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle(int id, Article article)
        {
            if (id != article.Id)
                return BadRequest("ID'ler eşleşmiyor.");

            var existingArticle = await _context.Articles.FindAsync(id);
            if (existingArticle == null)
                return NotFound("Makale bulunamadı.");

            // Eski resim dosyasını sil (eğer yeni resim farklıysa ve uploads klasöründeyse)
            if (!string.IsNullOrEmpty(existingArticle.Image) &&
                existingArticle.Image != article.Image &&
                existingArticle.Image.StartsWith("/uploads/"))
            {
                var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var oldImagePath = Path.Combine(wwwrootPath, existingArticle.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            existingArticle.TitleTr = article.TitleTr;
            existingArticle.TitleEn = article.TitleEn;
            existingArticle.ContentTr = article.ContentTr;
            existingArticle.ContentEn = article.ContentEn;
            existingArticle.Author = article.Author;
            existingArticle.Date = DateTime.UtcNow;
            existingArticle.Image = article.Image;
            existingArticle.Status = article.Status;
            existingArticle.IsPublished = article.IsPublished;
            existingArticle.Type = string.IsNullOrEmpty(article.Type) ? "classic" : article.Type;
            existingArticle.Slug = Slugify(article.TitleTr ?? article.TitleEn);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
                return NotFound();

            // Resim dosyasını sil
            if (!string.IsNullOrEmpty(article.Image) && article.Image.StartsWith("/uploads/"))
            {
                var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var imagePath = Path.Combine(wwwrootPath, article.Image.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

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
                IsPublished = m.IsPublished,
                Type = m.Type,
                Slug = m.Slug
            }).ToList();
            return result;
        }
    }
} 