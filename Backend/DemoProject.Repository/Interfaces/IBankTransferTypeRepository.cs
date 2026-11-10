using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IBankTransferTypeRepository
    {
        Task<IEnumerable<BankTransferType>> GetBankTransferTypesAsync();
    }
}
