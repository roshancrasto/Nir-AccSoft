using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class EventGroupRepository : IEventGroupRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public EventGroupRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(EventGroup entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupName", entity.EventGroupName);
            parameters.Add("@StartDate", entity.StartDate);
            parameters.Add("@EndDate", entity.EndDate);
            parameters.Add("@BudgetAmount", entity.BudgetAmount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@Status", entity.Status);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_EventGroup_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(EventGroup entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupId", entity.EventGroupId);
            parameters.Add("@EventGroupName", entity.EventGroupName);
            parameters.Add("@StartDate", entity.StartDate);
            parameters.Add("@EndDate", entity.EndDate);
            parameters.Add("@BudgetAmount", entity.BudgetAmount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@Status", entity.Status);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_EventGroup_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_EventGroup_Delete", new { EventGroupId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string eventGroupName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_EventGroups 
                        WHERE EventGroupName = @EventGroupName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupName", eventGroupName);
            if (excludeId.HasValue)
            {
                sql += " AND EventGroupId <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<EventGroup>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventGroup>("NU_sp_EventGroup_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class DonorRepository : IDonorRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public DonorRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Donor entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DonorName", entity.DonorName);
            parameters.Add("@MobileNumber", entity.MobileNumber);
            parameters.Add("@DPlace", entity.DPlace);
            parameters.Add("@DAddr1", entity.DAddr1);
            parameters.Add("@DAddr2", entity.DAddr2);
            parameters.Add("@DAddr3", entity.DAddr3);
            parameters.Add("@DCity", entity.DCity);
            parameters.Add("@DState", entity.DState);
            parameters.Add("@IsUdyavarParish", entity.IsUdyavarParish);
            parameters.Add("@PANNumber", entity.PANNumber);
            parameters.Add("@Email", entity.Email);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_Donor_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Donor entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@DonorId", entity.DonorId);
            parameters.Add("@DonorName", entity.DonorName);
            parameters.Add("@MobileNumber", entity.MobileNumber);
            parameters.Add("@DPlace", entity.DPlace);
            parameters.Add("@DAddr1", entity.DAddr1);
            parameters.Add("@DAddr2", entity.DAddr2);
            parameters.Add("@DAddr3", entity.DAddr3);
            parameters.Add("@DCity", entity.DCity);
            parameters.Add("@DState", entity.DState);
            parameters.Add("@IsUdyavarParish", entity.IsUdyavarParish);
            parameters.Add("@PANNumber", entity.PANNumber);
            parameters.Add("@Email", entity.Email);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_Donor_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Donor_Delete", new { DonorId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Donor>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Donor>("NU_sp_Donor_GetAll", commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string donorName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_Donors 
                        WHERE DonorName = @DonorName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@DonorName", donorName);
            if (excludeId.HasValue)
            {
                sql += " AND DonorId <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }
    }

    public class VendorRepository : IVendorRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public VendorRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Vendor entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@VendorName", entity.VendorName);
            parameters.Add("@ContactNumber", entity.ContactNumber);
            parameters.Add("@Address", entity.Address);
            parameters.Add("@GSTNumber", entity.GSTNumber);
            parameters.Add("@PANNumber", entity.PANNumber);
            parameters.Add("@CategoryId", entity.CategoryId);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_Vendor_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Vendor entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@VendorId", entity.VendorId);
            parameters.Add("@VendorName", entity.VendorName);
            parameters.Add("@ContactNumber", entity.ContactNumber);
            parameters.Add("@Address", entity.Address);
            parameters.Add("@GSTNumber", entity.GSTNumber);
            parameters.Add("@PANNumber", entity.PANNumber);
            parameters.Add("@CategoryId", entity.CategoryId);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_Vendor_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Vendor_Delete", new { VendorId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string vendorName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_Vendors 
                        WHERE VendorName = @VendorName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@VendorName", vendorName);
            if (excludeId.HasValue)
            {
                sql += " AND VendorId <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<Vendor>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Vendor>("NU_sp_Vendor_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class LanguageMasterRepository : ILanguageMasterRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public LanguageMasterRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(LanguageMaster entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@LangName", entity.LangName);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_LanguageMaster_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(LanguageMaster entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@LangKey", entity.LangKey);
            parameters.Add("@LangName", entity.LangName);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_LanguageMaster_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_LanguageMaster_Delete", new { LangKey = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string langName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_LanguageMaster 
                        WHERE LangName = @LangName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@LangName", langName);
            if (excludeId.HasValue)
            {
                sql += " AND LangKey <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<LanguageMaster>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<LanguageMaster>("NU_sp_LanguageMaster_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class EventCategoryRepository : IEventCategoryRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public EventCategoryRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(EventCategoryMaster entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventCatName", entity.EventCatName);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_EventCategory_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(EventCategoryMaster entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventCatKey", entity.EventCatKey);
            parameters.Add("@EventCatName", entity.EventCatName);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_EventCategory_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_EventCategory_Delete", new { EventCatKey = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string eventCatName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_EventCategoryMaster 
                        WHERE EventCatName = @EventCatName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@EventCatName", eventCatName);
            if (excludeId.HasValue)
            {
                sql += " AND EventCatKey <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<EventCategoryMaster>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventCategoryMaster>("NU_sp_EventCategory_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class EventDetailRepository : IEventDetailRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public EventDetailRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(EventDetail entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventCategoryKey", entity.EventCategoryKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@LanguageKey", entity.LanguageKey);
            parameters.Add("@EventName", entity.EventName);
            parameters.Add("@EventDate", entity.EventDate);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_EventDetail_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(EventDetail entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventKey", entity.EventKey);
            parameters.Add("@EventCategoryKey", entity.EventCategoryKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@LanguageKey", entity.LanguageKey);
            parameters.Add("@EventName", entity.EventName);
            parameters.Add("@EventDate", entity.EventDate);
            parameters.Add("@IsActive", entity.IsActive);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_EventDetail_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_EventDetail_Delete", new { EventKey = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string eventName, int? excludeId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_EventDetails 
                        WHERE EventName = @EventName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";
            var parameters = new DynamicParameters();
            parameters.Add("@EventName", eventName);
            if (excludeId.HasValue)
            {
                sql += " AND EventKey <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<EventDetail>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventDetail>("NU_sp_EventDetail_GetAll", commandType: CommandType.StoredProcedure);
        }
    }
}
