using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Data.Entities;

namespace DemoProject.Business.DTOs
{
    public class GovtGrantProfile : Profile
    {
        public GovtGrantProfile()
        {
            CreateMap<GovtGrant, GovtGrantDto>();
            CreateMap<CreateGovtGrantDto, GovtGrant>();
            CreateMap<UpdateGovtGrantDto, GovtGrant>();
        }
    }
}
