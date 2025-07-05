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
        public ActionResult<Contact> Get()
        {
            var contact = _context.Contacts.FirstOrDefault();
            if (contact == null)
            {
                return NotFound(new { message = "İletişim bilgileri bulunamadı." });
            }
            return Ok(contact);
        }

        // POST: api/contact
        [HttpPost]
        public ActionResult<Contact> Create(Contact contact)
        {
            if (contact == null)
                return BadRequest();
            _context.Contacts.Add(contact);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        // PUT: api/contact/{id}
        [HttpPut("{id}")]
        public ActionResult<Contact> Update(int id, Contact contact)
        {
            var _contact = _context.Contacts.FirstOrDefault(c => c.Id == id);
            if (_contact == null)
                return NotFound();
            _contact.Email = contact.Email;
            _contact.Location = contact.Location;
            _contact.Github = contact.Github;
            _contact.Linkedin = contact.Linkedin;
            _contact.Twitter = contact.Twitter;
            _contact.Instagram = contact.Instagram;
            _context.SaveChanges();
            return Ok(_contact);
        }
    }
} 