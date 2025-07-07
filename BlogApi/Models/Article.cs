using System;
using System.Collections.Generic;

namespace BlogApi.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string TitleTr { get; set; }
        public string TitleEn { get; set; }
        public string ContentTr { get; set; }
        public string ContentEn { get; set; }
        public string Author { get; set; }
        public DateTime Date { get; set; }
        public string Image { get; set; }
        public List<Comment> Comments { get; set; } = new List<Comment>();
        public bool Status { get; set; }
        public bool IsPublished { get; set; }
        public string Type { get; set; } // 'classic' veya 'medium'
    }
} 