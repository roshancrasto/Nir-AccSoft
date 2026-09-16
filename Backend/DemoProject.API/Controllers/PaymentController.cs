using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentController(IPaymentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _service.GetAllAsync();
            return Ok(payments);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _service.GetByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [AllowAnonymous]
        [HttpGet("eventexpenses/pending")]
        public async Task<IActionResult> GetPendingEventExpenses()
        {
            var expenses = await _service.GetPendingEventExpensesAsync();
            return Ok(expenses);
        }

        [HttpGet("relatedpayments")]
        public async Task<IActionResult> GetRelatedPayments([FromQuery] int? eventGroupKey, [FromQuery] int? currentPaymentId)
        {
            var payments = await _service.GetRelatedPaymentsAsync(eventGroupKey, currentPaymentId);
            return Ok(payments);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
        {
            try
            {
                var paymentId = await _service.CreateAsync(dto);
                return Ok(new { PaymentId = paymentId });
            }
            catch (System.Exception ex) when (ex.Message == "Voucher no already exists" || ex.Message.StartsWith("Amount mismatch"))
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] PaymentDto dto)
        {
            dto.PaymentId = id;
            try
            {
                await _service.UpdateAsync(dto);
                return NoContent();
            }
            catch (System.Exception ex) when (ex.Message == "Voucher no already exists" || ex.Message.StartsWith("Amount mismatch"))
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, 1); // Default modifiedBy = 1
            return NoContent();
        }
    }
}
