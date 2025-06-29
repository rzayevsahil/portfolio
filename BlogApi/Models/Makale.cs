using System;
using System.Collections.Generic;

namespace BlogApi.Models
{
    public class Makale
    {
        public int Id { get; set; }
        public string BaslikTr { get; set; }
        public string BaslikEn { get; set; }
        public string IcerikTr { get; set; }
        public string IcerikEn { get; set; }
        public string Yazar { get; set; }
        public DateTime Tarih { get; set; }
        public string Image { get; set; }
        public List<Yorum> Yorumlar { get; set; } = new List<Yorum>();
        public bool Status { get; set; } = true;
    }
} 