using Microsoft.EntityFrameworkCore;
using BlogApi.Entities;

namespace BlogApi.Data
{
    public class BlogContext : DbContext
    {
        public BlogContext(DbContextOptions<BlogContext> options) : base(options) { }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<WorkingHour> WorkingHours { get; set; }
        public DbSet<Profile> Profiles { get; set; }
    }
} 