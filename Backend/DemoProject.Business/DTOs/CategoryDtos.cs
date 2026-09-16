namespace DemoProject.Business.DTOs
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateCategoryDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
    }

    public class UpdateCategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int ModifiedBy { get; set; }
    }
}
