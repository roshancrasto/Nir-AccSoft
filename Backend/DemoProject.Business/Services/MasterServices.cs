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
    public class EventGroupService : IEventGroupService
    {
        private readonly IEventGroupRepository _repository;
        private readonly IMapper _mapper;

        public EventGroupService(IEventGroupRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateEventGroupDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventGroupName))
            {
                throw new InvalidOperationException($"An event group with the name '{dto.EventGroupName}' already exists.");
            }
            var entity = _mapper.Map<EventGroup>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(EventGroupDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventGroupName, dto.EventGroupId))
            {
                throw new InvalidOperationException($"An event group with the name '{dto.EventGroupName}' already exists.");
            }
            var entity = _mapper.Map<EventGroup>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<EventGroupDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<EventGroupDto>>(entities);
        }
    }

    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _repository;
        private readonly IMapper _mapper;

        public DonorService(IDonorRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateDonorDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.DonorName))
            {
                throw new InvalidOperationException($"A donor with the name '{dto.DonorName}' already exists.");
            }
            var entity = _mapper.Map<Donor>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(DonorDto dto)
        {
            // Relaxed check for updates due to legacy duplicate names in DB
            /*
            if (await _repository.ExistsByNameAsync(dto.DonorName, dto.DonorId))
            {
                throw new InvalidOperationException($"A donor with the name '{dto.DonorName}' already exists.");
            }
            */
            var entity = _mapper.Map<Donor>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<DonorDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<DonorDto>>(entities);
        }
    }

    public class VendorService : IVendorService
    {
        private readonly IVendorRepository _repository;
        private readonly IMapper _mapper;

        public VendorService(IVendorRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateVendorDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.VendorName))
            {
                throw new InvalidOperationException($"A vendor with the name '{dto.VendorName}' already exists.");
            }
            var entity = _mapper.Map<Vendor>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(VendorDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.VendorName, dto.VendorId))
            {
                throw new InvalidOperationException($"A vendor with the name '{dto.VendorName}' already exists.");
            }
            var entity = _mapper.Map<Vendor>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<VendorDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<VendorDto>>(entities);
        }
    }

    public class LanguageMasterService : ILanguageMasterService
    {
        private readonly ILanguageMasterRepository _repository;
        private readonly IMapper _mapper;

        public LanguageMasterService(ILanguageMasterRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateLanguageMasterDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.LangName))
            {
                throw new InvalidOperationException($"A language with the name '{dto.LangName}' already exists.");
            }
            var entity = _mapper.Map<LanguageMaster>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(LanguageMasterDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.LangName, dto.LangKey))
            {
                throw new InvalidOperationException($"A language with the name '{dto.LangName}' already exists.");
            }
            var entity = _mapper.Map<LanguageMaster>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<LanguageMasterDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<LanguageMasterDto>>(entities);
        }
    }

    public class EventCategoryService : IEventCategoryService
    {
        private readonly IEventCategoryRepository _repository;
        private readonly IMapper _mapper;

        public EventCategoryService(IEventCategoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateEventCategoryDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventCatName))
            {
                throw new InvalidOperationException($"An event category with the name '{dto.EventCatName}' already exists.");
            }
            var entity = _mapper.Map<EventCategoryMaster>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(EventCategoryDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventCatName, dto.EventCatKey))
            {
                throw new InvalidOperationException($"An event category with the name '{dto.EventCatName}' already exists.");
            }
            var entity = _mapper.Map<EventCategoryMaster>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<EventCategoryDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<EventCategoryDto>>(entities);
        }
    }

    public class EventDetailService : IEventDetailService
    {
        private readonly IEventDetailRepository _repository;
        private readonly IMapper _mapper;

        public EventDetailService(IEventDetailRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreateEventDetailDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventName))
            {
                throw new InvalidOperationException($"An event with the name '{dto.EventName}' already exists.");
            }
            var entity = _mapper.Map<EventDetail>(dto);
            return await _repository.AddAsync(entity, 1);
        }

        public async Task UpdateAsync(EventDetailDto dto)
        {
            if (await _repository.ExistsByNameAsync(dto.EventName, dto.EventKey))
            {
                throw new InvalidOperationException($"An event with the name '{dto.EventName}' already exists.");
            }
            var entity = _mapper.Map<EventDetail>(dto);
            await _repository.UpdateAsync(entity, 1);
        }

        public async Task DeleteAsync(int id, int modifiedBy) => await _repository.DeleteAsync(id, modifiedBy);

        public async Task<IEnumerable<EventDetailDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<EventDetailDto>>(entities);
        }
    }
}
