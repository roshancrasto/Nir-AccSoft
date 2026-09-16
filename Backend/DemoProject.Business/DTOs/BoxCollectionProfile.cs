using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Data.Entities;

namespace DemoProject.Business.DTOs
{
    public class BoxCollectionProfile : Profile
    {
        public BoxCollectionProfile()
        {
            CreateMap<BoxCollection, BoxCollectionDto>();
            CreateMap<CreateBoxCollectionDto, BoxCollection>();
            CreateMap<UpdateBoxCollectionDto, BoxCollection>();
        }
    }
}
