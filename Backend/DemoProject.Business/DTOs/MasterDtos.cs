using System;

namespace DemoProject.Business.DTOs
{
    // Event Group DTOs
    public class EventGroupDto
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

    public class CreateEventGroupDto
    {
        public string EventGroupName { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal BudgetAmount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    // Donor DTOs
    public class DonorDto
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

    public class CreateDonorDto
    {
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
    }

    // Vendor DTOs
    public class VendorDto
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

    public class CreateVendorDto
    {
        public string VendorName { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GSTNumber { get; set; } = string.Empty;
        public string PANNumber { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }

    // Language Master DTOs
    public class LanguageMasterDto
    {
        public int LangKey { get; set; }
        public string LangName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateLanguageMasterDto
    {
        public string LangName { get; set; } = string.Empty;
    }

    // Event Category Master DTOs
    public class EventCategoryDto
    {
        public int EventCatKey { get; set; }
        public string EventCatName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateEventCategoryDto
    {
        public string EventCatName { get; set; } = string.Empty;
    }

    // Event Detail DTOs
    public class EventDetailDto
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

    public class CreateEventDetailDto
    {
        public int EventCategoryKey { get; set; }
        public int EventGroupKey { get; set; }
        public int LanguageKey { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
    }
}
