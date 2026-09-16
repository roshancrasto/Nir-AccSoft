using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptController : ControllerBase
    {
        private readonly IReceiptService _service;
        public ReceiptController(IReceiptService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReceiptDto dto)
        {
            try
            {
                var id = await _service.CreateAsync(dto);
                return Ok(new { ReceiptId = id });
            }
            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 2627)
            {
                return BadRequest(new { message = "A receipt with this number already exists." });
            }
            catch (System.Exception ex) when (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 2627)
            {
                return BadRequest(new { message = "A receipt with this number already exists." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ReceiptDto dto)
        {
            try
            {
                dto.ReceiptId = id;
                await _service.UpdateAsync(dto);
                return NoContent();
            }
            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 2627)
            {
                return BadRequest(new { message = "A receipt with this number already exists." });
            }
            catch (System.Exception ex) when (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 2627)
            {
                return BadRequest(new { message = "A receipt with this number already exists." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }
}
