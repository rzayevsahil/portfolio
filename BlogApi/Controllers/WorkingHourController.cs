using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Data;
using System.Linq;

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
        public ActionResult<WorkingHour> Get()
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            if (wh == null)
            {
                return NotFound(new { message = "Çalışma saatleri bulunamadı." });
            }
            return Ok(wh);
        }

        // PUT: api/workinghours
        [HttpPut]
        public ActionResult<WorkingHour> Update(WorkingHour workingHour)
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            if (wh == null)
            {
                _context.WorkingHours.Add(workingHour);
            }
            else
            {
                wh.Weekdays = workingHour.Weekdays;
                wh.Weekend = workingHour.Weekend;
            }
            _context.SaveChanges();
            return Ok(workingHour);
        }
    }
} 