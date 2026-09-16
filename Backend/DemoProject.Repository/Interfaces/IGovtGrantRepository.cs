using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IGovtGrantRepository
    {
        Task<int> AddAsync(GovtGrant entity, int createdBy);
        Task UpdateAsync(GovtGrant entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<GovtGrant>> GetAllAsync();
        Task<GovtGrant?> GetByIdAsync(int id);
    }
}
