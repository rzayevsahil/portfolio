using Microsoft.AspNetCore.Mvc;
using BlogApi.Entities;
using BlogApi.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkingHourController : ControllerBase
    {
        private readonly BlogContext _context;
        public WorkingHourController(BlogContext context)
        {
            _context = context;
        }

        // GET: api/workinghours
        [HttpGet]
        public async Task<ActionResult<WorkingHour>> Get()
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            if (wh == null)
            {
                return NotFound(new { message = "Çalışma saatleri bulunamadı." });
            }
            return Ok(wh);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<WorkingHour>> Create(WorkingHour workingHour)
        {
            if (workingHour == null)
                return BadRequest();
            _context.WorkingHours.Add(workingHour);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = workingHour.Id }, workingHour);
        }

        // PUT: api/workinghours
        [Authorize]
        [HttpPut]
        public async Task<ActionResult<WorkingHour>> Update(WorkingHour workingHour)
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            if (wh == null)
            {
                return NotFound(new { message = "Çalışma saatleri bulunamadı." });
            }            
            
            wh.Weekdays = workingHour.Weekdays;
            wh.Weekend = workingHour.Weekend;            
            _context.SaveChanges();
            return Ok(workingHour);
        }
    }
} 