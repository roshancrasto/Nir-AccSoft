using System;

namespace DemoProject.Business.DTOs
{
    // Reimbursement DTOs
    public class ReimbursementDto
    {
        public int ReimbursementId { get; set; }
        public string ReimbursementNumber { get; set; } = string.Empty;
        public DateTime ReimbursementDate { get; set; }
        public int? UserId { get; set; }
        public int? EventGroupId { get; set; }
        public int? ExpenseCategoryId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public bool BillAvailable { get; set; }
        public string? BillNumber { get; set; }
        public DateTime? BillDate { get; set; }
        public string? AttachmentPath { get; set; }
        public string Status { get; set; } = "Pending";
    }

    public class CreateReimbursementDto
    {
        public string ReimbursementNumber { get; set; } = string.Empty;
        public DateTime ReimbursementDate { get; set; }
        public int? UserId { get; set; }
        public int? EventGroupId { get; set; }
        public int? ExpenseCategoryId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public bool BillAvailable { get; set; }
        public string? BillNumber { get; set; }
        public DateTime? BillDate { get; set; }
        public string? AttachmentPath { get; set; }
        public string Status { get; set; } = "Pending";
    }

    // Asset DTOs
    public class AssetDto
    {
        public int AssetId { get; set; }
        public string AssetNumber { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseValue { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal? DepreciationRate { get; set; }
        public string? Location { get; set; }
        public string? Condition { get; set; }
        public int? PaymentId { get; set; }
    }

    public class CreateAssetDto
    {
        public string AssetNumber { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public decimal PurchaseValue { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal? DepreciationRate { get; set; }
        public string? Location { get; set; }
        public string? Condition { get; set; }
        public int? PaymentId { get; set; }
    }

    // Bank Transfer DTOs
    public class BankTransferDto
    {
        public int TransferId { get; set; }
        public string TransferNo { get; set; } = string.Empty;
        public DateTime TransferDate { get; set; }
        public string TransferType { get; set; } = string.Empty;
        public string FromAccountType { get; set; } = string.Empty;
        public int? FromAccountID { get; set; }
        public string ToAccountType { get; set; } = string.Empty;
        public int? ToAccountID { get; set; }
        public decimal Amount { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Remarks { get; set; }
    }

    public class CreateBankTransferDto
    {
        public string TransferNo { get; set; } = string.Empty;
        public DateTime TransferDate { get; set; }
        public string TransferType { get; set; } = string.Empty;
        public string FromAccountType { get; set; } = string.Empty;
        public int? FromAccountID { get; set; }
        public string ToAccountType { get; set; } = string.Empty;
        public int? ToAccountID { get; set; }
        public decimal Amount { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Remarks { get; set; }
    }

    public class AccountBalanceDto
    {
        public int AccountId { get; set; }
        public decimal Balance { get; set; }
    }
}
