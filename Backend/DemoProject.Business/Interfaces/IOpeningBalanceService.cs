using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IOpeningBalanceService
    {
        Task<OpeningBalanceDto> CreateAsync(OpeningBalanceCreateDto dto, int? userId);
        Task UpdateAsync(OpeningBalanceUpdateDto dto, int? userId);
        Task DeleteAsync(int id, int? userId);
        Task<OpeningBalanceDto> GetByIdAsync(int id);
        Task<IEnumerable<OpeningBalanceDto>> GetAllAsync();
        Task<IEnumerable<BankAccountDropdownDto>> GetBankAccountDropdownAsync();
    }
}
