using System;

namespace DemoProject.Data.Entities
{
    public class ReceiptRegisterModel
    {
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime ReceiptDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public int? ReceiptBook_Rno { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string EventGroupName { get; set; } = string.Empty;
        public string PaymentMode { get; set; } = string.Empty;
        public decimal CashAmount { get; set; }
        public decimal BankAmount { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
    }

    public class PaymentRegisterModel
    {
        public int PaymentId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime? VoucherDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public string EventGroupName { get; set; } = string.Empty;
        public string ExpenseCategory { get; set; } = string.Empty;
        public string ExpenseDetails { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public string PaymentMode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string RelatedPaymentNumber { get; set; } = string.Empty;
    }

    public class PaymentRegisterFilterDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int? EventGroupKey { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public int? VendorId { get; set; }
        public int? ExpenseCategoryId { get; set; }
    }

    public class CategoryExpenseModel
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal TotalExpense { get; set; }
    }

    public class EventGroupPNLModel
    {
        public string EventGroupName { get; set; } = string.Empty;
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal ProfitLoss { get; set; }
    }

    public class DonorReceiptModel
    {
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime ReceiptDate { get; set; }
        public string EventGroupName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class IncomeExpenditureModel
    {
        public string Type { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class EventExpensesReportModel
    {
        public string EventGroupName { get; set; } = string.Empty;
        public List<EventReceiptItem>? Receipts { get; set; } = new();
        public List<EventPaymentItem>? Payments { get; set; } = new();
        public decimal TotalReceipts { get; set; }
        public decimal TotalPayments { get; set; }
        public decimal TotalReceiptAmount { get; set; }
        public decimal TotalVoucherAmount { get; set; }
        public decimal IncomeOverExpenditure { get; set; }
        public decimal IncomeOverExpenditureVal { get; set; }
    }

    public class EventReceiptItem
    {
        public string Receipts { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal ReceiptAmount { get; set; }
    }

    public class EventPaymentItem
    {
        public string ExpenseDetails { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal VoucherAmount { get; set; }
    }

    public class ReceiptsPaymentsReportModel
    {
        public string FinancialYear { get; set; } = string.Empty;
        public List<ReportItemModel> Receipts { get; set; } = new();
        public List<ReportItemModel> Payments { get; set; } = new();
        public decimal ClosingBalance { get; set; }
        public decimal TotalReceipts { get; set; }
        public decimal TotalPayments { get; set; }
        public decimal FinalTotal { get; set; }
    }

    public class ReportItemModel
    {
        public string Description { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public bool IsSubItem { get; set; }
    }

    public class AccountLedgerRequestModel
    {
        public int AccountId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class AccountLedgerTransactionModel
    {
        public DateTime Date { get; set; }
        public string Particulars { get; set; } = string.Empty;
        public string ReferenceNo { get; set; } = string.Empty;
        public decimal Receipt { get; set; }
        public decimal Payment { get; set; }
        public decimal Balance { get; set; }
    }

    public class AccountLedgerResponseModel
    {
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public decimal OpeningBalance { get; set; }
        public System.Collections.Generic.List<AccountLedgerTransactionModel> Transactions { get; set; } = new();
        public decimal TotalReceipts { get; set; }
        public decimal TotalPayments { get; set; }
        public decimal ClosingBalance { get; set; }
    }

    public class VoucherReportModel
    {
        public string VoucherNumber { get; set; } = string.Empty;
        public int PaymentID { get; set; }
        public decimal DebitAmount { get; set; }
        public string VoucherType { get; set; } = string.Empty;
        public string PaymentMode { get; set; } = string.Empty;
        public string Narration { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string PayTo { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public DateTime? VoucherDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string PaymentAccDetails { get; set; } = string.Empty; // Contains raw JSON string
        public List<VoucherReportDetailModel> Details { get; set; } = new();
    }

    public class VoucherReportDetailModel
    {
        public int RowNo { get; set; }
        public decimal Amount { get; set; }
        public string BillNo { get; set; } = string.Empty;
        public string BillDate { get; set; } = string.Empty;
        public string Party { get; set; } = string.Empty;
        public bool? IsVoucherOnly { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string ExpDesc { get; set; } = string.Empty;
        public string ExpenseID { get; set; } = string.Empty;
        public string EventGroupName { get; set; } = string.Empty;
    }
}
