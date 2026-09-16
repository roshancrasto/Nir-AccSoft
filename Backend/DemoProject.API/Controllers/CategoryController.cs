using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Uncomment after JWT setup is complete on UI side
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            try
            {
                // For now, hardcode user ID until HttpContext user parsing is implemented
                dto.CreatedBy = 1;
                var categoryId = await _categoryService.CreateCategoryAsync(dto);
                return Ok(new { CategoryId = categoryId });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
        {
            try
            {
                dto.CategoryId = id;
                dto.ModifiedBy = 1;
                await _categoryService.UpdateCategoryAsync(dto);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryService.DeleteCategoryAsync(id, 1);
            return NoContent();
        }
    }
}
