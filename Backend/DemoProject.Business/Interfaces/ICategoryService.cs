using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface ICategoryService
    {
        Task<int> CreateCategoryAsync(CreateCategoryDto dto);
        Task UpdateCategoryAsync(UpdateCategoryDto dto);
        Task DeleteCategoryAsync(int categoryId, int modifiedBy);
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
    }
}
