using System;

namespace DemoProject.Business.DTOs
{
    public class EventExpenseDto
    {
        public int EventExpenseKey { get; set; }
        public int EventGroupKey { get; set; }
        public string? ExpenseCode { get; set; }
        public string? ExpenseDetails { get; set; }
        public string? ExpenseDesc { get; set; }
        public string? PaymentMode { get; set; }
        public decimal Amount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateEventExpenseDto
    {
        public int EventGroupKey { get; set; }
        public string? ExpenseCode { get; set; }
        public string? ExpenseDetails { get; set; }
        public string? ExpenseDesc { get; set; }
        public string? PaymentMode { get; set; }
        public decimal Amount { get; set; }
        public int? CreatedBy { get; set; }
    }

    public class UpdateEventExpenseDto
    {
        public int EventExpenseKey { get; set; }
        public int EventGroupKey { get; set; }
        public string? ExpenseCode { get; set; }
        public string? ExpenseDetails { get; set; }
        public string? ExpenseDesc { get; set; }
        public string? PaymentMode { get; set; }
        public decimal Amount { get; set; }
        public int? ModifiedBy { get; set; }
    }

    public class EventGroupSummaryDto
    {
        public int EventGroupKey { get; set; }
        public string EventGroupName { get; set; } = string.Empty;
        public decimal TotalExpenseAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public decimal TotalReceipts { get; set; }
        public decimal ReceiptsCreated { get; set; }
        public decimal PendingReceipts { get; set; }
    }
}
