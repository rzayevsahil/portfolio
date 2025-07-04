using Microsoft.AspNetCore.Mvc;
using BlogApi.Models;
using BlogApi.Data;
using System.Linq;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkingHoursController : ControllerBase
    {
        private readonly BlogContext _context;
        public WorkingHoursController(BlogContext context)
        {
            _context = context;
        }

        // GET: api/workinghours
        [HttpGet]
        public ActionResult<WorkingHours> Get()
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            /*if (wh == null)
            {
                wh = new WorkingHours
                {
                    Weekdays = "Pazartesi - Cuma: 09:00 - 18:00",
                    Weekend = "Hafta Sonu: 10:00 - 16:00"
                };
                _context.WorkingHours.Add(wh);
                _context.SaveChanges();
            }*/
            return Ok(wh);
        }

        // PUT: api/workinghours
        [HttpPut]
        public ActionResult<WorkingHours> Update(WorkingHours updated)
        {
            var wh = _context.WorkingHours.FirstOrDefault();
            if (wh == null)
            {
                _context.WorkingHours.Add(updated);
            }
            else
            {
                wh.Weekdays = updated.Weekdays;
                wh.Weekend = updated.Weekend;
            }
            _context.SaveChanges();
            return Ok(updated);
        }
    }
} 