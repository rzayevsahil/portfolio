using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Data;
using System.Linq;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly BlogContext _context;
        public ContactController(BlogContext context)
        {
            _context = context;
        }

        // GET: api/contact
        [HttpGet]
        public ActionResult<ContactInfo> Get()
        {
            var contact = _context.ContactInfos.FirstOrDefault();
            /*if (contact == null)
            {
                // Varsayılan değerlerle ilk kayıt oluştur
                contact = new ContactInfo
                {
                    Email = "sahilrzayev200d@gmail.com",
                    Location = "Istanbul, Turkey",
                    Github = "https://github.com/rzayevsahil",
                    Linkedin = "https://linkedin.com/in/sahil-rzayev",
                    Twitter = "https://twitter.com/sahilrzayev",
                    Instagram = "https://instagram.com/sahilrzayev"
                };
                _context.ContactInfos.Add(contact);
                _context.SaveChanges();
            }*/
            return Ok(contact);
        }

        // PUT: api/contact
        [HttpPut]
        public ActionResult<ContactInfo> Update(ContactInfo updated)
        {
            var contact = _context.ContactInfos.FirstOrDefault();
            if (contact == null)
            {
                _context.ContactInfos.Add(updated);
            }
            else
            {
                contact.Email = updated.Email;
                contact.Location = updated.Location;
                contact.Github = updated.Github;
                contact.Linkedin = updated.Linkedin;
                contact.Twitter = updated.Twitter;
                contact.Instagram = updated.Instagram;
            }
            _context.SaveChanges();
            return Ok(updated);
        }
    }
} 