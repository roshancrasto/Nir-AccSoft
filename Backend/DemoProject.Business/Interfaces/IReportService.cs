using DemoProject.Data.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<ReceiptRegisterModel>> GetReceiptRegisterAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<PaymentRegisterModel>> GetPaymentRegisterAsync(PaymentRegisterFilterDto filter);
        Task<IEnumerable<CategoryExpenseModel>> GetCategoryExpenseAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<EventGroupPNLModel>> GetEventGroupPNLAsync(int eventGroupId);
        Task<IEnumerable<DonorReceiptModel>> GetDonorReceiptsAsync(int donorId);
        Task<IEnumerable<IncomeExpenditureModel>> GetIncomeExpenditureAsync(DateTime startDate, DateTime endDate);
        Task<EventExpensesReportModel> GetEventGroupExpensesAsync(int eventGroupKey);
        Task<ReceiptsPaymentsReportModel> GetReceiptsPaymentsAsync(string financialYear);
        Task<AccountLedgerResponseModel> GetAccountLedgerAsync(int accountId, DateTime fromDate, DateTime toDate);
        Task<IEnumerable<VoucherReportModel>> GetVoucherReportAsync(int? eventGroupKey, string? financialYear, int? vendorKey, string? voucherNo);
    }
}
