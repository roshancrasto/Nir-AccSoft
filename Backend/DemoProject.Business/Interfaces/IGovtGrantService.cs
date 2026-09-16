using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IGovtGrantService
    {
        Task<int> CreateAsync(CreateGovtGrantDto dto);
        Task UpdateAsync(UpdateGovtGrantDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<GovtGrantDto>> GetAllAsync();
        Task<GovtGrantDto?> GetByIdAsync(int id);
    }
}
