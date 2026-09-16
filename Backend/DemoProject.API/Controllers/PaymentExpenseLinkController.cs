using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentExpenseLinkController : ControllerBase
    {
        private readonly IPaymentExpenseLinkService _service;

        public PaymentExpenseLinkController(IPaymentExpenseLinkService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentExpenseLinkDto dto)
        {
            var createdBy = 1; // Default to 1 for now
            var id = await _service.CreateAsync(dto, createdBy);
            return Ok(id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePaymentExpenseLinkDto dto)
        {
            var modifiedBy = 1;
            await _service.UpdateAsync(dto, id, modifiedBy);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var modifiedBy = 1;
            await _service.DeleteAsync(id, modifiedBy);
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingAll()
        {
            var data = await _service.GetPendingAllAsync();
            return Ok(data);
        }

        [HttpGet("pending/{memberId}")]
        public async Task<IActionResult> GetPendingByMember(int memberId)
        {
            var data = await _service.GetPendingByMemberAsync(memberId);
            return Ok(data);
        }

        [HttpGet("unlinked/{eventGroupKey}")]
        public async Task<IActionResult> GetUnlinked(int eventGroupKey, [FromQuery] int? currentExpenseId = null)
        {
            var data = await _service.GetUnlinkedExpensesAsync(eventGroupKey, currentExpenseId);
            return Ok(data);
        }
    }
}
