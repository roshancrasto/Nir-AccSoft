using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class BankTransferTypeService : IBankTransferTypeService
    {
        private readonly IBankTransferTypeRepository _repository;

        public BankTransferTypeService(IBankTransferTypeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BankTransferType>> GetBankTransferTypesAsync()
        {
            return await _repository.GetBankTransferTypesAsync();
        }
    }
}
