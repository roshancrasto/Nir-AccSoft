using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IEventGroupService
    {
        Task<int> CreateAsync(CreateEventGroupDto dto);
        Task UpdateAsync(EventGroupDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<EventGroupDto>> GetAllAsync();
    }

    public interface IDonorService
    {
        Task<int> CreateAsync(CreateDonorDto dto);
        Task UpdateAsync(DonorDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<DonorDto>> GetAllAsync();
    }

    public interface IVendorService
    {
        Task<int> CreateAsync(CreateVendorDto dto);
        Task UpdateAsync(VendorDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<VendorDto>> GetAllAsync();
    }

    public interface ILanguageMasterService
    {
        Task<int> CreateAsync(CreateLanguageMasterDto dto);
        Task UpdateAsync(LanguageMasterDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<LanguageMasterDto>> GetAllAsync();
    }

    public interface IEventCategoryService
    {
        Task<int> CreateAsync(CreateEventCategoryDto dto);
        Task UpdateAsync(EventCategoryDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<EventCategoryDto>> GetAllAsync();
    }

    public interface IEventDetailService
    {
        Task<int> CreateAsync(CreateEventDetailDto dto);
        Task UpdateAsync(EventDetailDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<EventDetailDto>> GetAllAsync();
    }
}
