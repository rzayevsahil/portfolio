using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranslateController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Translate([FromBody] TranslateRequest req)
        {
            using var client = new HttpClient();
            var body = new StringContent(
                $"{{\"q\":\"{req.Text}\",\"source\":\"tr\",\"target\":\"en\",\"format\":\"text\"}}",
                Encoding.UTF8, "application/json"
            );
            var response = await client.PostAsync("https://translate.argosopentech.com/translate", body);
            var result = await response.Content.ReadAsStringAsync();
            return Content(result, "application/json");
        }
    }

    public class TranslateRequest
    {
        public string Text { get; set; }
    }
} 