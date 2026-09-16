using System;

namespace DemoProject.Data.Entities
{
    public class MemberDetail
    {
        public int MemberKey { get; set; }
        public string MemberName { get; set; } = string.Empty;
    }

    public class EventGroup
    {
        public int EventGroupId { get; set; }
        public string EventGroupName { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal BudgetAmount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class Donor
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string DPlace { get; set; } = string.Empty;
        public string DAddr1 { get; set; } = string.Empty;
        public string DAddr2 { get; set; } = string.Empty;
        public string DAddr3 { get; set; } = string.Empty;
        public string DCity { get; set; } = string.Empty;
        public string DState { get; set; } = string.Empty;
        public bool IsUdyavarParish { get; set; }
        public string PANNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class Vendor
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string PANNumber { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class LanguageMaster
    {
        public int LangKey { get; set; }
        public string LangName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class EventCategoryMaster
    {
        public int EventCatKey { get; set; }
        public string EventCatName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class EventDetail
    {
        public int EventKey { get; set; }
        public int EventCategoryKey { get; set; }
        public string EventCategoryName { get; set; } = string.Empty;
        public int EventGroupKey { get; set; }
        public string EventGroupName { get; set; } = string.Empty;
        public int LanguageKey { get; set; }
        public string LanguageName { get; set; } = string.Empty;
        public string EventName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class EventExpense
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
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool DeletedFlag { get; set; }
    }

    public class EventGroupSummary
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
