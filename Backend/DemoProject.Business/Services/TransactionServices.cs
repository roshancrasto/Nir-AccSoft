using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class ReceiptService : IReceiptService
    {
        private readonly IReceiptRepository _repository;
        private readonly IMapper _mapper;

        public ReceiptService(IReceiptRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateReceiptDto dto)
        {
            var entity = _mapper.Map<Receipt>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(ReceiptDto dto)
        {
            var entity = _mapper.Map<Receipt>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<ReceiptDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReceiptDto>>(entities);
        }
    }
}
