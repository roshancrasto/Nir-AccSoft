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
    public class BoxCollectionService : IBoxCollectionService
    {
        private readonly IBoxCollectionRepository _repository;
        private readonly IMapper _mapper;

        public BoxCollectionService(IBoxCollectionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateBoxCollectionDto dto)
        {
            if (dto.Amount <= 0)
            {
                throw new ArgumentException("Amount must be greater than zero.");
            }

            var entity = _mapper.Map<BoxCollection>(dto);
            return await _repository.AddAsync(entity, dto.CreatedBy);
        }

        public async Task UpdateAsync(UpdateBoxCollectionDto dto)
        {
            if (dto.Amount <= 0)
            {
                throw new ArgumentException("Amount must be greater than zero.");
            }

            var entity = _mapper.Map<BoxCollection>(dto);
            await _repository.UpdateAsync(entity, dto.ModifiedBy);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            await _repository.DeleteAsync(id, modifiedBy);
        }

        public async Task<IEnumerable<BoxCollectionDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<BoxCollectionDto>>(entities);
        }

        public async Task<BoxCollectionDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            return _mapper.Map<BoxCollectionDto>(entity);
        }
    }
}
