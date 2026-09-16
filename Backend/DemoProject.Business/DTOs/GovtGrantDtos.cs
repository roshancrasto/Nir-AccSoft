using System;

namespace DemoProject.Business.DTOs
{
    public class GovtGrantDto
    {
        public int GovtGrantId { get; set; }
        public string GrantNumber { get; set; } = string.Empty;
        public int EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public DateTime GrantDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
    }

    public class CreateGovtGrantDto
    {
        public int EventGroupKey { get; set; }
        public DateTime GrantDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
    }

    public class UpdateGovtGrantDto
    {
        public int GovtGrantId { get; set; }
        public int EventGroupKey { get; set; }
        public DateTime GrantDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
        public int ModifiedBy { get; set; }
    }
}
