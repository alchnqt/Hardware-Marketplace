using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiOne.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]/[action]")]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
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
