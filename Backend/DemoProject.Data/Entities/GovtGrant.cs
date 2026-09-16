using System;

namespace DemoProject.Data.Entities
{
    public class GovtGrant
    {
        public int GovtGrantId { get; set; }
        public string GrantNumber { get; set; } = string.Empty;
        public int EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public DateTime GrantDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool DeletedFlag { get; set; }
        public bool IsActive { get; set; }
    }
}
