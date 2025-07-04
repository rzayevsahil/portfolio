using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Data
{
    public class BlogContext : DbContext
    {
        public BlogContext(DbContextOptions<BlogContext> options) : base(options) { }

        public DbSet<Makale> Makaleler { get; set; }
        public DbSet<Yorum> Yorumlar { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
        public DbSet<Profile> Profiles { get; set; }
    }
} 