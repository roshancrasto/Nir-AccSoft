using Dapper;
using DemoProject.Data.Entities;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class ReportRepository : IReportRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public ReportRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<IEnumerable<ReceiptRegisterModel>> GetReceiptRegisterAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<ReceiptRegisterModel>("NU_sp_Report_ReceiptRegister", new { StartDate = startDate, EndDate = endDate }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<PaymentRegisterModel>> GetPaymentRegisterAsync(PaymentRegisterFilterDto filter)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<PaymentRegisterModel>(
                "NU_sp_Report_PaymentRegister", 
                new 
                { 
                    StartDate = filter.FromDate, 
                    EndDate = filter.ToDate,
                    EventGroupKey = filter.EventGroupKey,
                    PaymentMode = string.IsNullOrEmpty(filter.PaymentMode) ? null : filter.PaymentMode,
                    VendorId = filter.VendorId,
                    ExpenseCategoryId = filter.ExpenseCategoryId
                }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CategoryExpenseModel>> GetCategoryExpenseAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<CategoryExpenseModel>("NU_sp_Report_CategoryExpense", new { StartDate = startDate, EndDate = endDate }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<EventGroupPNLModel>> GetEventGroupPNLAsync(int eventGroupId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventGroupPNLModel>("NU_sp_Report_EventGroupPNL", new { EventGroupId = eventGroupId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<DonorReceiptModel>> GetDonorReceiptsAsync(int donorId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<DonorReceiptModel>("NU_sp_Report_DonorReceipts", new { DonorId = donorId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<IncomeExpenditureModel>> GetIncomeExpenditureAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<IncomeExpenditureModel>("NU_sp_Report_IncomeExpenditure", new { StartDate = startDate, EndDate = endDate }, commandType: CommandType.StoredProcedure);
        }

        public async Task<EventExpensesReportModel> GetEventGroupExpensesAsync(int eventGroupKey)
        {
            using var connection = _connectionFactory.CreateConnection();
            
            // 1. Fetch Event Group Name
            var eventGroupName = await connection.QueryFirstOrDefaultAsync<string>(
                "SELECT EventGroupName FROM NU_EventGroups WHERE EventGroupId = @EventGroupKey",
                new { EventGroupKey = eventGroupKey }) ?? string.Empty;
                
            // 2. Fetch Receipts & Payments as JSON String Chunks (handling FOR JSON splitting)
            var jsonChunks = await connection.QueryAsync<string>(
                "NU_GetEventGroupExpenses",
                new { EventGroupKey = eventGroupKey },
                commandType: CommandType.StoredProcedure);
                
            var completeJson = string.Concat(jsonChunks);
            
            // 3. Deserialize JSON
            var report = new EventExpensesReportModel { EventGroupName = eventGroupName };
            if (!string.IsNullOrEmpty(completeJson))
            {
                try
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var rawData = JsonSerializer.Deserialize<EventExpensesReportModel>(completeJson, options);
                    if (rawData != null)
                    {
                        report.Receipts = rawData.Receipts ?? new();
                        report.Payments = rawData.Payments ?? new();
                    }
                }
                catch { /* Safe fallback */ }
            }
            
            // 4. Calculate Totals
            report.TotalReceipts = report.Receipts?.Sum(r => r.Amount) ?? 0;
            report.TotalPayments = report.Payments?.Sum(p => p.Amount) ?? 0;
            report.TotalReceiptAmount = report.Receipts?.Sum(r => r.ReceiptAmount) ?? 0;
            report.TotalVoucherAmount = report.Payments?.Sum(p => p.VoucherAmount) ?? 0;
            report.IncomeOverExpenditure = report.TotalReceipts - report.TotalPayments;
            report.IncomeOverExpenditureVal = report.TotalReceiptAmount - report.TotalVoucherAmount;
            
            return report;
        }

        public async Task<ReceiptsPaymentsReportModel> GetReceiptsPaymentsAsync(string financialYear)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@FinancialYear", financialYear);

            using var multi = await connection.QueryMultipleAsync(
                "NU_sp_Report_ReceiptsPayments",
                parameters,
                commandType: CommandType.StoredProcedure);

            var report = new ReceiptsPaymentsReportModel
            {
                FinancialYear = financialYear,
                Receipts = (await multi.ReadAsync<ReportItemModel>()).ToList(),
                Payments = (await multi.ReadAsync<ReportItemModel>()).ToList()
            };

            var summary = await multi.ReadFirstOrDefaultAsync<dynamic>();
            if (summary != null)
            {
                report.TotalReceipts = summary.TotalReceipts;
                report.TotalPayments = summary.TotalPayments;
                report.ClosingBalance = summary.ClosingBalance;
                report.FinalTotal = summary.FinalTotal;
            }

            return report;
        }

        public async Task<AccountLedgerResponseModel> GetAccountLedgerAsync(int accountId, DateTime fromDate, DateTime toDate)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@AccountId", accountId);
            parameters.Add("@FromDate", fromDate);
            parameters.Add("@ToDate", toDate);

            using var multi = await connection.QueryMultipleAsync(
                "NU_sp_Report_AccountLedger",
                parameters,
                commandType: CommandType.StoredProcedure);

            var accountInfo = await multi.ReadFirstOrDefaultAsync<dynamic>();
            if (accountInfo == null)
            {
                return new AccountLedgerResponseModel();
            }

            var report = new AccountLedgerResponseModel
            {
                AccountName = accountInfo.AccountName,
                AccountType = accountInfo.AccountType,
                OpeningBalance = accountInfo.OpeningBalance,
                Transactions = (await multi.ReadAsync<AccountLedgerTransactionModel>()).ToList()
            };

            var summary = await multi.ReadFirstOrDefaultAsync<dynamic>();
            if (summary != null)
            {
                report.TotalReceipts = summary.TotalReceipts;
                report.TotalPayments = summary.TotalPayments;
                report.ClosingBalance = summary.ClosingBalance;
            }

            return report;
        }

        public async Task<IEnumerable<VoucherReportModel>> GetVoucherReportAsync(int? eventGroupKey, string? financialYear, int? vendorKey, string? voucherNo)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupKey", eventGroupKey ?? 0);
            parameters.Add("@FinancialYear", financialYear ?? string.Empty);
            parameters.Add("@VendorKey", vendorKey ?? 0);
            parameters.Add("@VoucherNo", voucherNo ?? string.Empty);

            var vouchers = await connection.QueryAsync<VoucherReportModel>(
                "NU_sp_Report_GetVoucherReport",
                parameters,
                commandType: CommandType.StoredProcedure);

            foreach (var voucher in vouchers)
            {
                if (!string.IsNullOrEmpty(voucher.PaymentAccDetails))
                {
                    try
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        voucher.Details = JsonSerializer.Deserialize<List<VoucherReportDetailModel>>(voucher.PaymentAccDetails, options) ?? new();
                    }
                    catch
                    {
                        voucher.Details = new();
                    }
                }
            }

            return vouchers;
        }
    }
}
