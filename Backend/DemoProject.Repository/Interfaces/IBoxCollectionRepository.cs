using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IBoxCollectionRepository
    {
        Task<int> AddAsync(BoxCollection entity, int createdBy);
        Task UpdateAsync(BoxCollection entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<BoxCollection>> GetAllAsync();
        Task<BoxCollection?> GetByIdAsync(int id);
    }
}
