using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<Contact>> Get()
        {
            var contact = _context.Contacts.FirstOrDefault();
            if (contact == null)
            {
                return NotFound(new { message = "İletişim bilgileri bulunamadı." });
            }
            return Ok(contact);
        }

        // POST: api/contact
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Contact>> Create(Contact contact)
        {
            if (contact == null)
                return BadRequest();
            _context.Contacts.Add(contact);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        // PUT: api/contact/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Contact>> Update(int id, Contact contact)
        {            
            if (id != contact.Id)
                return BadRequest("ID'ler eşleşmiyor.");

            var existingContact = await _context.Contacts.FindAsync(id);
            if (existingContact == null)
                return NotFound(new { message = "İletişim bilgileri bulunamadı." });

            existingContact.Email = contact.Email;
            existingContact.Location = contact.Location;
            existingContact.Github = contact.Github;
            existingContact.Linkedin = contact.Linkedin;
            existingContact.Twitter = contact.Twitter;
            existingContact.Instagram = contact.Instagram;
            _context.SaveChanges();
            return Ok(existingContact);
        }
    }
} 