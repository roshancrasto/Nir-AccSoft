using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IOpeningBalanceRepository
    {
        Task<int> AddAsync(OpeningBalance entity, int? createdBy);
        Task UpdateAsync(OpeningBalance entity, int? modifiedBy);
        Task DeleteAsync(int id, int? modifiedBy);
        Task<OpeningBalance?> GetByIdAsync(int id);
        Task<IEnumerable<OpeningBalance>> GetAllAsync();
        Task<IEnumerable<BankAccountDropdown>> GetBankAccountDropdownAsync();
    }
}
