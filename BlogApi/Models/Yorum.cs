using System;

namespace BlogApi.Models
{
    public class Yorum
    {
        public int Id { get; set; }
        public string AdSoyad { get; set; }
        public string Icerik { get; set; }
        public DateTime Tarih { get; set; }
        public int MakaleId { get; set; }
    }
} 