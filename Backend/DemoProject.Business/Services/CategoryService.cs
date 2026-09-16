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
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateCategoryAsync(CreateCategoryDto dto)
        {
            // Check for duplicate category name
            var exists = await _categoryRepository.ExistsByNameAsync(dto.CategoryName);
            if (exists)
            {
                throw new InvalidOperationException($"A category with the name '{dto.CategoryName}' already exists.");
            }

            var category = _mapper.Map<Category>(dto);
            return await _categoryRepository.AddAsync(category);
        }

        public async Task UpdateCategoryAsync(UpdateCategoryDto dto)
        {
            // Check for duplicate category name (excluding the current record)
            var exists = await _categoryRepository.ExistsByNameAsync(dto.CategoryName, dto.CategoryId);
            if (exists)
            {
                throw new InvalidOperationException($"A category with the name '{dto.CategoryName}' already exists.");
            }

            var category = _mapper.Map<Category>(dto);
            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteCategoryAsync(int categoryId, int modifiedBy)
        {
            await _categoryRepository.DeleteAsync(categoryId, modifiedBy);
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }
    }
}
