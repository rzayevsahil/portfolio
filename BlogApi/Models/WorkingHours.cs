using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class WorkingHours
    {
        [Key]
        public int Id { get; set; }
        public string Weekdays { get; set; } // "Pazartesi,Salı,Çarşamba,Perşembe,Cuma"
        public string WeekdayStart { get; set; } // "09:00"
        public string WeekdayEnd { get; set; }   // "18:00"
        public string Weekend { get; set; } // "Cumartesi,Pazar"
        public string WeekendStart { get; set; } // "10:00"
        public string WeekendEnd { get; set; }   // "16:00"
    }
} 