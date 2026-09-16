using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IEventGroupRepository
    {
        Task<int> AddAsync(EventGroup entity, int createdBy);
        Task UpdateAsync(EventGroup entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<EventGroup>> GetAllAsync();
        Task<bool> ExistsByNameAsync(string eventGroupName, int? excludeId = null);
    }

    public interface IDonorRepository
    {
        Task<int> AddAsync(Donor entity, int createdBy);
        Task UpdateAsync(Donor entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Donor>> GetAllAsync();
        Task<bool> ExistsByNameAsync(string donorName, int? excludeId = null);
    }

    public interface IVendorRepository
    {
        Task<int> AddAsync(Vendor entity, int createdBy);
        Task UpdateAsync(Vendor entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Vendor>> GetAllAsync();
        Task<bool> ExistsByNameAsync(string vendorName, int? excludeId = null);
    }

    public interface ILanguageMasterRepository
    {
        Task<int> AddAsync(LanguageMaster entity, int createdBy);
        Task UpdateAsync(LanguageMaster entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<bool> ExistsByNameAsync(string langName, int? excludeId = null);
        Task<IEnumerable<LanguageMaster>> GetAllAsync();
    }

    public interface IEventCategoryRepository
    {
        Task<int> AddAsync(EventCategoryMaster entity, int createdBy);
        Task UpdateAsync(EventCategoryMaster entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<bool> ExistsByNameAsync(string eventCatName, int? excludeId = null);
        Task<IEnumerable<EventCategoryMaster>> GetAllAsync();
    }

    public interface IEventDetailRepository
    {
        Task<int> AddAsync(EventDetail entity, int createdBy);
        Task UpdateAsync(EventDetail entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<bool> ExistsByNameAsync(string eventName, int? excludeId = null);
        Task<IEnumerable<EventDetail>> GetAllAsync();
    }

    public interface IMemberRepository
    {
        Task<IEnumerable<MemberDetail>> GetAllAsync();
    }
}
