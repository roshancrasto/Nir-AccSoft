using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class GovtGrantService : IGovtGrantService
    {
        private readonly IGovtGrantRepository _repository;
        private readonly IMapper _mapper;

        public GovtGrantService(IGovtGrantRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateGovtGrantDto dto)
        {
            if (dto.Amount <= 0)
            {
                throw new ArgumentException("Amount must be greater than zero.");
            }

            var entity = _mapper.Map<GovtGrant>(dto);
            return await _repository.AddAsync(entity, dto.CreatedBy);
        }

        public async Task UpdateAsync(UpdateGovtGrantDto dto)
        {
            if (dto.Amount <= 0)
            {
                throw new ArgumentException("Amount must be greater than zero.");
            }

            var entity = _mapper.Map<GovtGrant>(dto);
            await _repository.UpdateAsync(entity, dto.ModifiedBy);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            await _repository.DeleteAsync(id, modifiedBy);
        }

        public async Task<IEnumerable<GovtGrantDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<GovtGrantDto>>(entities);
        }

        public async Task<GovtGrantDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            return _mapper.Map<GovtGrantDto>(entity);
        }
    }
}
