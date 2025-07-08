namespace BlogApi.DTOs
{
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
        public string Type { get; set; }
        public string Slug { get; set; }
    }
} 