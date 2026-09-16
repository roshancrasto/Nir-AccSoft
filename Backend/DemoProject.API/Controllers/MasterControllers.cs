using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventGroupController : ControllerBase
    {
        private readonly IEventGroupService _service;
        public EventGroupController(IEventGroupService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventGroupDto dto) => Ok(new { EventGroupId = await _service.CreateAsync(dto) });

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventGroupDto dto)
        {
            dto.EventGroupId = id;
            await _service.UpdateAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class DonorController : ControllerBase
    {
        private readonly IDonorService _service;
        public DonorController(IDonorService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDonorDto dto)
        {
            try
            {
                var donorId = await _service.CreateAsync(dto);
                return Ok(new { DonorId = donorId });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DonorDto dto)
        {
            try
            {
                dto.DonorId = id;
                await _service.UpdateAsync(dto);
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
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly IVendorService _service;
        public VendorController(IVendorService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVendorDto dto)
        {
            try
            {
                var vendorId = await _service.CreateAsync(dto);
                return Ok(new { VendorId = vendorId });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating vendor: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = "An error occurred while creating the vendor.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VendorDto dto)
        {
            try
            {
                dto.VendorId = id;
                await _service.UpdateAsync(dto);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating vendor: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = "An error occurred while updating the vendor.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class LanguageMasterController : ControllerBase
    {
        private readonly ILanguageMasterService _service;
        public LanguageMasterController(ILanguageMasterService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLanguageMasterDto dto)
        {
            try
            {
                var langKey = await _service.CreateAsync(dto);
                return Ok(new { LangKey = langKey });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LanguageMasterDto dto)
        {
            try
            {
                dto.LangKey = id;
                await _service.UpdateAsync(dto);
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
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class EventCategoryController : ControllerBase
    {
        private readonly IEventCategoryService _service;
        public EventCategoryController(IEventCategoryService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventCategoryDto dto)
        {
            try
            {
                var eventCatKey = await _service.CreateAsync(dto);
                return Ok(new { EventCatKey = eventCatKey });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventCategoryDto dto)
        {
            try
            {
                dto.EventCatKey = id;
                await _service.UpdateAsync(dto);
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
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class EventDetailController : ControllerBase
    {
        private readonly IEventDetailService _service;
        public EventDetailController(IEventDetailService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventDetailDto dto)
        {
            try
            {
                var eventKey = await _service.CreateAsync(dto);
                return Ok(new { EventKey = eventKey });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventDetailDto dto)
        {
            try
            {
                dto.EventKey = id;
                await _service.UpdateAsync(dto);
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
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }
    }
}
