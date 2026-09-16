using AutoMapper;
using DemoProject.Data.Entities;

namespace DemoProject.Business.DTOs
{
    public class MasterProfiles : Profile
    {
        public MasterProfiles()
        {
            CreateMap<EventGroup, EventGroupDto>();
            CreateMap<CreateEventGroupDto, EventGroup>();
            CreateMap<EventGroupDto, EventGroup>();

            CreateMap<Donor, DonorDto>();
            CreateMap<CreateDonorDto, Donor>();
            CreateMap<DonorDto, Donor>();

            CreateMap<Vendor, VendorDto>();
            CreateMap<CreateVendorDto, Vendor>();
            CreateMap<VendorDto, Vendor>();

            CreateMap<LanguageMaster, LanguageMasterDto>();
            CreateMap<CreateLanguageMasterDto, LanguageMaster>();
            CreateMap<LanguageMasterDto, LanguageMaster>();

            CreateMap<EventCategoryMaster, EventCategoryDto>();
            CreateMap<CreateEventCategoryDto, EventCategoryMaster>();
            CreateMap<EventCategoryDto, EventCategoryMaster>();

            CreateMap<EventDetail, EventDetailDto>();
            CreateMap<CreateEventDetailDto, EventDetail>();
            CreateMap<EventDetailDto, EventDetail>();
        }
    }
}
