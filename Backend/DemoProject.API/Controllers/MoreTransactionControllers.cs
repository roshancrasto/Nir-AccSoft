using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReimbursementController : ControllerBase
    {
        private readonly IReimbursementService _service;
        public ReimbursementController(IReimbursementService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReimbursementDto dto) => Ok(new { ReimbursementId = await _service.CreateAsync(dto) });

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ReimbursementDto dto)
        {
            dto.ReimbursementId = id;
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
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _service;
        public AssetController(IAssetService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAssetDto dto) => Ok(new { AssetId = await _service.CreateAsync(dto) });

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssetDto dto)
        {
            dto.AssetId = id;
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
    public class BankTransferController : ControllerBase
    {
        private readonly IBankTransferService _service;
        public BankTransferController(IBankTransferService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBankTransferDto dto) => Ok(new { TransferId = await _service.CreateAsync(dto) });

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BankTransferDto dto)
        {
            dto.TransferId = id;
            await _service.UpdateAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id, 1);
            return NoContent();
        }

        [HttpGet("Balances")]
        public async Task<IActionResult> GetBalances() => Ok(await _service.GetAccountBalancesAsync());
    }
}
