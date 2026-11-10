using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BankTransferTypeController : ControllerBase
    {
        private readonly IBankTransferTypeService _service;

        public BankTransferTypeController(IBankTransferTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetBankTransferTypes()
        {
            var types = await _service.GetBankTransferTypesAsync();
            return Ok(types);
        }
    }
}
