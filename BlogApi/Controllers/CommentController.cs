using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogApi.Data;
using BlogApi.Entities;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly BlogContext _context;

        public CommentController(BlogContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Comment>> AddComment(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddComment), new { id = comment.Id }, comment);
        }

        [HttpGet("article/{articleId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByArticle(int articleId)
        {
            return await _context.Comments.Where(y => y.ArticleId == articleId).ToListAsync();
        }
    }
} 