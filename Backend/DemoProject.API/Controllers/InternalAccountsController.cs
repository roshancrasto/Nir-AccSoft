using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternalAccountsController : ControllerBase
    {
        private readonly IInternalAccountService _service;

        public InternalAccountsController(IInternalAccountService service)
        {
            _service = service;
        }

        [HttpGet("eventgroupsummary")]
        public async Task<IActionResult> GetEventGroupSummary()
        {
            var summary = await _service.GetEventGroupSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("eventexpenses/{eventGroupKey}")]
        public async Task<IActionResult> GetExpensesByEventGroup(int eventGroupKey)
        {
            var expenses = await _service.GetExpensesByEventGroupAsync(eventGroupKey);
            return Ok(expenses);
        }

        [HttpGet("eventexpense/{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            var expense = await _service.GetExpenseByIdAsync(id);
            if (expense == null) return NotFound();
            return Ok(expense);
        }

        [HttpPost("eventexpense")]
        public async Task<IActionResult> CreateExpense([FromBody] CreateEventExpenseDto dto)
        {
            dto.CreatedBy = 1; // Hardcoded for now
            var id = await _service.CreateExpenseAsync(dto);
            return Ok(new { EventExpenseKey = id });
        }

        [HttpPut("eventexpense/{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] UpdateEventExpenseDto dto)
        {
            dto.EventExpenseKey = id;
            dto.ModifiedBy = 1; // Hardcoded for now
            await _service.UpdateExpenseAsync(dto);
            return NoContent();
        }

        [HttpDelete("eventexpense/{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            await _service.DeleteExpenseAsync(id, 1); // Hardcoded modifiedBy
            return NoContent();
        }
    }
}
