using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class ReimbursementService : IReimbursementService
    {
        private readonly IReimbursementRepository _repository;
        private readonly IMapper _mapper;

        public ReimbursementService(IReimbursementRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateReimbursementDto dto)
        {
            var entity = _mapper.Map<Reimbursement>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(ReimbursementDto dto)
        {
            var entity = _mapper.Map<Reimbursement>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<ReimbursementDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReimbursementDto>>(entities);
        }
    }

    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;
        private readonly IMapper _mapper;

        public AssetService(IAssetRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateAssetDto dto)
        {
            var entity = _mapper.Map<Asset>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(AssetDto dto)
        {
            var entity = _mapper.Map<Asset>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<AssetDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<AssetDto>>(entities);
        }
    }

    public class BankTransferService : IBankTransferService
    {
        private readonly IBankTransferRepository _repository;
        private readonly IMapper _mapper;

        public BankTransferService(IBankTransferRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateBankTransferDto dto)
        {
            var entities = await _repository.GetAllAsync();
            int nextId = (entities as List<BankTransfer>)?.Count + 1 ?? 1;
            dto.TransferNo = $"BT-{DateTime.Now.Year}-{nextId:D4}";
            
            var entity = _mapper.Map<BankTransfer>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(BankTransferDto dto)
        {
            var entity = _mapper.Map<BankTransfer>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<BankTransferDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<BankTransferDto>>(entities);
        }

        public async Task<IEnumerable<AccountBalanceDto>> GetAccountBalancesAsync()
        {
            var entities = await _repository.GetAccountBalancesAsync();
            return _mapper.Map<IEnumerable<AccountBalanceDto>>(entities);
        }
    }
}
