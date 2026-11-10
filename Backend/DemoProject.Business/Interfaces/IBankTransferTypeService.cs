using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IBankTransferTypeService
    {
        Task<IEnumerable<BankTransferType>> GetBankTransferTypesAsync();
    }
}
