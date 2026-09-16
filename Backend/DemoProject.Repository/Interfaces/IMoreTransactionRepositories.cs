using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IReimbursementRepository
    {
        Task<int> AddAsync(Reimbursement entity, int createdBy);
        Task UpdateAsync(Reimbursement entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Reimbursement>> GetAllAsync();
    }

    public interface IAssetRepository
    {
        Task<int> AddAsync(Asset entity, int createdBy);
        Task UpdateAsync(Asset entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Asset>> GetAllAsync();
    }

    public interface IBankTransferRepository
    {
        Task<int> AddAsync(BankTransfer entity, int createdBy);
        Task UpdateAsync(BankTransfer entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<BankTransfer>> GetAllAsync();
        Task<IEnumerable<AccountBalance>> GetAccountBalancesAsync();
    }
}
