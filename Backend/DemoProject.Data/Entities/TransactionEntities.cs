using System;

namespace DemoProject.Data.Entities
{
    public class Receipt
    {
        public int ReceiptId { get; set; }
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime ReceiptDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public int? DonorId { get; set; }
        public int? EventKey { get; set; }
        public string? EventName { get; set; }
        public int? EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public decimal CashAmount { get; set; }
        public decimal BankAmount { get; set; }
        public string? ReferenceNumber { get; set; }
        public bool PANAvailable { get; set; }
        public string? Description { get; set; }
        public string? DonorName { get; set; }
        public int? ReceiptBook_Rno { get; set; }
    }

    public class Payment
    {
        public int PaymentId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime VoucherDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public int? VendorId { get; set; }
        public string? VendorName { get; set; }
        public int? EventKey { get; set; }
        public string? EventName { get; set; }
        public int? EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public int? ExpenseCategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public decimal DebitAmount { get; set; }
        public string? Description { get; set; }
        public bool BillAvailable { get; set; }
        public string? BillNumber { get; set; }
        public DateTime? BillDate { get; set; }
        public string? ReferenceNumber { get; set; }
        public int? EnteredBy { get; set; }
        public int? VerifiedBy { get; set; }
        public string? AttachmentPath { get; set; }
        public int? RelatedPaymentID { get; set; }
        public string? PaymentType { get; set; }
        public int? MemberId { get; set; }
        public bool? IsVoucherOnly { get; set; }
        public bool IsReimbursement { get; set; }
        // Join fields for related payment
        public string? RelatedVoucherNumber { get; set; }
        public string? RelatedVendorName { get; set; }
        public decimal? RelatedAmount { get; set; }
    }

    public class PaymentExpenseMapping
    {
        public int PaymentExpenseMappingKey { get; set; }
        public int PaymentID { get; set; }
        public int EventExpenseKey { get; set; }
        public decimal Amount { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public bool IsActive { get; set; }

        // Join fields
        public string? ExpenseCode { get; set; }
        public string? ExpenseDetails { get; set; }
        public string? EventGroupName { get; set; }
    }

    public class PendingEventExpense
    {
        public int EventExpenseKey { get; set; }
        public string? EventGroupName { get; set; }
        public string? ExpenseCode { get; set; }
        public string? ExpenseDetails { get; set; }
        public decimal TotalExpenseAmount { get; set; }
        public decimal AllocatedAmount { get; set; }
        public decimal PendingAmount { get; set; }
    }

    public class RelatedPayment
    {
        public int PaymentId { get; set; }
        public string VoucherNumber { get; set; } = string.Empty;
        public string? VendorName { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class PaymentExpenseLink
    {
        public int ExpenseId { get; set; }
        public int EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public int VendorKey { get; set; }
        public string? VendorName { get; set; }
        public int ExpenseCategoryKey { get; set; }
        public string? CategoryName { get; set; }
        public string? ExpenseDetails { get; set; }
        public string? BillNo { get; set; }
        public DateTime? BillDate { get; set; }
        public decimal Amount { get; set; }
        public int? PaidByMemberKey { get; set; }
        public string? MemberName { get; set; }
        public string? PaymentMode { get; set; }
        public int? RelatedPaymentID { get; set; }
        public string? Remarks { get; set; }
        public bool IsSettled { get; set; }
        public DateTime? SettledDate { get; set; }
        public int? PaymentId { get; set; }
        public bool? IsVoucherOnly { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public bool IsActive { get; set; }
    }
}
