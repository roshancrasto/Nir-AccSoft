using Microsoft.AspNetCore.Mvc;
using DemoProject.Business.Interfaces;
using System;
using System.Threading.Tasks;

namespace DemoProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("receipt-register")]
        public async Task<IActionResult> GetReceiptRegister([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return Ok(await _service.GetReceiptRegisterAsync(startDate, endDate));
        }

        [HttpGet("payment-register")]
        public async Task<IActionResult> GetPaymentRegister([FromQuery] DemoProject.Data.Entities.PaymentRegisterFilterDto filter)
        {
            return Ok(await _service.GetPaymentRegisterAsync(filter));
        }

        [HttpGet("category-expense")]
        public async Task<IActionResult> GetCategoryExpense([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return Ok(await _service.GetCategoryExpenseAsync(startDate, endDate));
        }

        [HttpGet("event-group-pnl/{eventGroupId}")]
        public async Task<IActionResult> GetEventGroupPNL(int eventGroupId)
        {
            return Ok(await _service.GetEventGroupPNLAsync(eventGroupId));
        }

        [HttpGet("donor-receipts/{donorId}")]
        public async Task<IActionResult> GetDonorReceipts(int donorId)
        {
            return Ok(await _service.GetDonorReceiptsAsync(donorId));
        }

        [HttpGet("income-expenditure")]
        public async Task<IActionResult> GetIncomeExpenditure([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            return Ok(await _service.GetIncomeExpenditureAsync(startDate, endDate));
        }

        [HttpGet("eventexpenses/{eventGroupKey}")]
        public async Task<IActionResult> GetEventGroupExpenses(int eventGroupKey)
        {
            var report = await _service.GetEventGroupExpensesAsync(eventGroupKey);
            return Ok(report);
        }

        [HttpGet("receiptspayments/{financialYear}")]
        public async Task<IActionResult> GetReceiptsPayments(string financialYear)
        {
            var report = await _service.GetReceiptsPaymentsAsync(financialYear);
            return Ok(report);
        }
        [HttpGet("accountledger")]
        public async Task<IActionResult> GetAccountLedger([FromQuery] int accountId, [FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var report = await _service.GetAccountLedgerAsync(accountId, fromDate, toDate);
            return Ok(report);
        }

        [HttpGet("vouchers")]
        public async Task<IActionResult> GetVoucherReport([FromQuery] int? eventGroupKey, [FromQuery] string? financialYear, [FromQuery] int? vendorKey, [FromQuery] string? voucherNo)
        {
            var report = await _service.GetVoucherReportAsync(eventGroupKey, financialYear, vendorKey, voucherNo);
            return Ok(report);
        }
    }
}
