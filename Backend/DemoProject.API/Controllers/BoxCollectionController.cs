using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoxCollectionController : ControllerBase
    {
        private readonly IBoxCollectionService _boxCollectionService;

        public BoxCollectionController(IBoxCollectionService boxCollectionService)
        {
            _boxCollectionService = boxCollectionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var collections = await _boxCollectionService.GetAllAsync();
            return Ok(collections);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var collection = await _boxCollectionService.GetByIdAsync(id);
            if (collection == null)
            {
                return NotFound(new { message = $"Box Collection with ID {id} not found." });
            }
            return Ok(collection);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBoxCollectionDto dto)
        {
            try
            {
                // Hardcode user ID for now until HttpContext user parsing is fully implemented
                dto.CreatedBy = 1;
                var boxCollectionId = await _boxCollectionService.CreateAsync(dto);
                return Ok(new { BoxCollectionId = boxCollectionId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the box collection.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBoxCollectionDto dto)
        {
            try
            {
                dto.BoxCollectionId = id;
                dto.ModifiedBy = 1;
                await _boxCollectionService.UpdateAsync(dto);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the box collection.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _boxCollectionService.DeleteAsync(id, 1);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the box collection.", details = ex.Message });
            }
        }
    }
}
