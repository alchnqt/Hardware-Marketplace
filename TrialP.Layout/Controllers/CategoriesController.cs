using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TrialP.Layout.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        public List<string> GetAll()
        {
            List<string> str = new();
            return str;
        }
    }
}
