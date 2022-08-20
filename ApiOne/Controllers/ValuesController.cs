using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiOne.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public string Secret()
        {
            return "secret message";
        }

        [HttpGet]
        public string NotSecret()
        {
            return "everyone message";
        }

        [HttpGet]
        public string S()
        {
            return "message";
        }
    }
}
