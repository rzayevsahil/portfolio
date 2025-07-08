using System;

namespace BlogApi.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string AdSoyad { get; set; }
        public string Icerik { get; set; }
        public DateTime Tarih { get; set; }
        public int ArticleId { get; set; }
        public Article Article { get; set; }
    }
} 