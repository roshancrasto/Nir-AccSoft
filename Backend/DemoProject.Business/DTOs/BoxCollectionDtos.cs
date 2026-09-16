using System;

namespace DemoProject.Business.DTOs
{
    public class BoxCollectionDto
    {
        public int BoxCollectionId { get; set; }
        public string CollectionNumber { get; set; } = string.Empty;
        public int EventGroupKey { get; set; }
        public string? EventGroupName { get; set; }
        public DateTime CollectionDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
    }

    public class CreateBoxCollectionDto
    {
        public int EventGroupKey { get; set; }
        public DateTime CollectionDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
    }

    public class UpdateBoxCollectionDto
    {
        public int BoxCollectionId { get; set; }
        public int EventGroupKey { get; set; }
        public DateTime CollectionDate { get; set; }
        public decimal Amount { get; set; }
        public bool ConsiderForAudit { get; set; }
        public string? Remarks { get; set; }
        public int ModifiedBy { get; set; }
    }
}
