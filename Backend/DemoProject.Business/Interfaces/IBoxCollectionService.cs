using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IBoxCollectionService
    {
        Task<int> CreateAsync(CreateBoxCollectionDto dto);
        Task UpdateAsync(UpdateBoxCollectionDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<BoxCollectionDto>> GetAllAsync();
        Task<BoxCollectionDto?> GetByIdAsync(int id);
    }
}
