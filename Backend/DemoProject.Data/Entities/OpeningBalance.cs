using System;

namespace DemoProject.Data.Entities
{
    public class OpeningBalance
    {
        public int OpeningBalanceId { get; set; }
        public string FinancialYear { get; set; } = string.Empty;
        public string BalanceType { get; set; } = string.Empty;
        public int? BankAccountId { get; set; }
        public decimal OpeningAmount { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        
        // Joined columns
        public string? BankName { get; set; }
        public string? Branch { get; set; }
    }

    public class BankAccountDropdown
    {
        public int BankAccountKey { get; set; }
        public string BankName { get; set; } = string.Empty;
        public string Branch { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
    }
}
