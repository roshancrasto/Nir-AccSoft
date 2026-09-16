using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IReimbursementService
    {
        Task<int> CreateAsync(CreateReimbursementDto dto);
        Task UpdateAsync(ReimbursementDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<ReimbursementDto>> GetAllAsync();
    }

    public interface IAssetService
    {
        Task<int> CreateAsync(CreateAssetDto dto);
        Task UpdateAsync(AssetDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<AssetDto>> GetAllAsync();
    }

    public interface IBankTransferService
    {
        Task<int> CreateAsync(CreateBankTransferDto dto);
        Task UpdateAsync(BankTransferDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<BankTransferDto>> GetAllAsync();
        Task<IEnumerable<AccountBalanceDto>> GetAccountBalancesAsync();
    }
}
