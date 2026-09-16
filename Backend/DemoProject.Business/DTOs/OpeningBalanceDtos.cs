using System;
using System.ComponentModel.DataAnnotations;

namespace DemoProject.Business.DTOs
{
    public class OpeningBalanceDto
    {
        public int OpeningBalanceId { get; set; }
        public string FinancialYear { get; set; } = string.Empty;
        public string BalanceType { get; set; } = string.Empty;
        public int? BankAccountId { get; set; }
        public decimal OpeningAmount { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        
        // From joined table
        public string? BankName { get; set; }
        public string? Branch { get; set; }
    }

    public class OpeningBalanceCreateDto
    {
        [Required]
        [StringLength(20)]
        public string FinancialYear { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string BalanceType { get; set; } = string.Empty;

        public int? BankAccountId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Opening Amount must be greater than zero.")]
        public decimal OpeningAmount { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }
    }

    public class OpeningBalanceUpdateDto : OpeningBalanceCreateDto
    {
        [Required]
        public int OpeningBalanceId { get; set; }
    }

    public class BankAccountDropdownDto
    {
        public int BankAccountKey { get; set; }
        public string BankName { get; set; } = string.Empty;
        public string Branch { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
    }
}
