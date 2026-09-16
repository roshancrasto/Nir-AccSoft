using DemoProject.Data.Entities;
using DemoProject.Business.Interfaces;
using DemoProject.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReceiptRegisterModel>> GetReceiptRegisterAsync(DateTime startDate, DateTime endDate) => 
            await _repository.GetReceiptRegisterAsync(startDate, endDate);

        public async Task<IEnumerable<PaymentRegisterModel>> GetPaymentRegisterAsync(PaymentRegisterFilterDto filter) => 
            await _repository.GetPaymentRegisterAsync(filter);

        public async Task<IEnumerable<CategoryExpenseModel>> GetCategoryExpenseAsync(DateTime startDate, DateTime endDate) => 
            await _repository.GetCategoryExpenseAsync(startDate, endDate);

        public async Task<IEnumerable<EventGroupPNLModel>> GetEventGroupPNLAsync(int eventGroupId) => 
            await _repository.GetEventGroupPNLAsync(eventGroupId);

        public async Task<IEnumerable<DonorReceiptModel>> GetDonorReceiptsAsync(int donorId) => 
            await _repository.GetDonorReceiptsAsync(donorId);

        public async Task<IEnumerable<IncomeExpenditureModel>> GetIncomeExpenditureAsync(DateTime startDate, DateTime endDate) => 
            await _repository.GetIncomeExpenditureAsync(startDate, endDate);

        public async Task<EventExpensesReportModel> GetEventGroupExpensesAsync(int eventGroupKey) =>
            await _repository.GetEventGroupExpensesAsync(eventGroupKey);

        public async Task<ReceiptsPaymentsReportModel> GetReceiptsPaymentsAsync(string financialYear) =>
            await _repository.GetReceiptsPaymentsAsync(financialYear);

        public async Task<AccountLedgerResponseModel> GetAccountLedgerAsync(int accountId, DateTime fromDate, DateTime toDate) =>
            await _repository.GetAccountLedgerAsync(accountId, fromDate, toDate);

        public async Task<IEnumerable<VoucherReportModel>> GetVoucherReportAsync(int? eventGroupKey, string? financialYear, int? vendorKey, string? voucherNo) =>
            await _repository.GetVoucherReportAsync(eventGroupKey, financialYear, vendorKey, voucherNo);
    }
}
