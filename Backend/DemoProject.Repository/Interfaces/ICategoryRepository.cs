using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int> AddAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(int categoryId, int modifiedBy);
        Task<IEnumerable<Category>> GetAllAsync();
        Task<bool> ExistsByNameAsync(string categoryName, int? excludeCategoryId = null);
    }
}
