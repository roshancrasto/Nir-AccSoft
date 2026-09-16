using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GovtGrantController : ControllerBase
    {
        private readonly IGovtGrantService _govtGrantService;

        public GovtGrantController(IGovtGrantService govtGrantService)
        {
            _govtGrantService = govtGrantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var grants = await _govtGrantService.GetAllAsync();
            return Ok(grants);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var grant = await _govtGrantService.GetByIdAsync(id);
            if (grant == null)
            {
                return NotFound(new { message = $"Government Grant with ID {id} not found." });
            }
            return Ok(grant);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGovtGrantDto dto)
        {
            try
            {
                // Hardcode user ID for now until HttpContext user parsing is fully implemented
                dto.CreatedBy = 1;
                var govtGrantId = await _govtGrantService.CreateAsync(dto);
                return Ok(new { GovtGrantId = govtGrantId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the government grant.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateGovtGrantDto dto)
        {
            try
            {
                dto.GovtGrantId = id;
                dto.ModifiedBy = 1;
                await _govtGrantService.UpdateAsync(dto);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the government grant.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _govtGrantService.DeleteAsync(id, 1);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the government grant.", details = ex.Message });
            }
        }
    }
}
