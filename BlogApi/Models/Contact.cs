using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public string Location { get; set; }
        public string Github { get; set; }
        public string Linkedin { get; set; }
        public string Twitter { get; set; }
        public string Instagram { get; set; }
    }
} 