using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpeningBalanceController : ControllerBase
    {
        private readonly IOpeningBalanceService _service;

        public OpeningBalanceController(IOpeningBalanceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpeningBalanceDto>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OpeningBalanceDto>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("bank-accounts")]
        public async Task<ActionResult<IEnumerable<BankAccountDropdownDto>>> GetBankAccounts()
        {
            var result = await _service.GetBankAccountDropdownAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<OpeningBalanceDto>> Create([FromBody] OpeningBalanceCreateDto dto)
        {
            try
            {
                // In a real app, you might get userId from JWT claims
                int? userId = 1; 

                var result = await _service.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = result.OpeningBalanceId }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OpeningBalanceUpdateDto dto)
        {
            if (id != dto.OpeningBalanceId)
            {
                return BadRequest(new { Message = "ID mismatch." });
            }

            try
            {
                int? userId = 1;
                await _service.UpdateAsync(dto, userId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                int? userId = 1;
                await _service.DeleteAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
