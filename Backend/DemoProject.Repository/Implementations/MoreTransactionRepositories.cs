using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class ReimbursementRepository : IReimbursementRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public ReimbursementRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Reimbursement entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@ReimbursementNumber", entity.ReimbursementNumber);
            parameters.Add("@ReimbursementDate", entity.ReimbursementDate);
            parameters.Add("@UserId", entity.UserId);
            parameters.Add("@EventGroupId", entity.EventGroupId);
            parameters.Add("@ExpenseCategoryId", entity.ExpenseCategoryId);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@BillAvailable", entity.BillAvailable);
            parameters.Add("@BillNumber", entity.BillNumber);
            parameters.Add("@BillDate", entity.BillDate);
            parameters.Add("@AttachmentPath", entity.AttachmentPath);
            parameters.Add("@Status", entity.Status);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_Reimbursement_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Reimbursement entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@ReimbursementId", entity.ReimbursementId);
            parameters.Add("@ReimbursementDate", entity.ReimbursementDate);
            parameters.Add("@UserId", entity.UserId);
            parameters.Add("@EventGroupId", entity.EventGroupId);
            parameters.Add("@ExpenseCategoryId", entity.ExpenseCategoryId);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@BillAvailable", entity.BillAvailable);
            parameters.Add("@BillNumber", entity.BillNumber);
            parameters.Add("@BillDate", entity.BillDate);
            parameters.Add("@AttachmentPath", entity.AttachmentPath);
            parameters.Add("@Status", entity.Status);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_Reimbursement_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Reimbursement_Delete", new { ReimbursementId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Reimbursement>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Reimbursement>("NU_sp_Reimbursement_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class AssetRepository : IAssetRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public AssetRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Asset entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@AssetNumber", entity.AssetNumber);
            parameters.Add("@AssetName", entity.AssetName);
            parameters.Add("@PurchaseDate", entity.PurchaseDate);
            parameters.Add("@PurchaseValue", entity.PurchaseValue);
            parameters.Add("@CurrentValue", entity.CurrentValue);
            parameters.Add("@DepreciationRate", entity.DepreciationRate);
            parameters.Add("@Location", entity.Location);
            parameters.Add("@Condition", entity.Condition);
            parameters.Add("@PaymentId", entity.PaymentId);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_Asset_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Asset entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@AssetId", entity.AssetId);
            parameters.Add("@AssetName", entity.AssetName);
            parameters.Add("@PurchaseDate", entity.PurchaseDate);
            parameters.Add("@PurchaseValue", entity.PurchaseValue);
            parameters.Add("@CurrentValue", entity.CurrentValue);
            parameters.Add("@DepreciationRate", entity.DepreciationRate);
            parameters.Add("@Location", entity.Location);
            parameters.Add("@Condition", entity.Condition);
            parameters.Add("@PaymentId", entity.PaymentId);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_Asset_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Asset_Delete", new { AssetId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Asset>("NU_sp_Asset_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class BankTransferRepository : IBankTransferRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public BankTransferRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(BankTransfer entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@TransferNo", entity.TransferNo);
            parameters.Add("@TransferDate", entity.TransferDate);
            parameters.Add("@TransferType", entity.TransferType);
            parameters.Add("@FromAccountType", entity.FromAccountType);
            parameters.Add("@FromAccountID", entity.FromAccountID);
            parameters.Add("@ToAccountType", entity.ToAccountType);
            parameters.Add("@ToAccountID", entity.ToAccountID);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_BankTransfer_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(BankTransfer entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@TransferId", entity.TransferId);
            parameters.Add("@TransferDate", entity.TransferDate);
            parameters.Add("@TransferType", entity.TransferType);
            parameters.Add("@FromAccountType", entity.FromAccountType);
            parameters.Add("@FromAccountID", entity.FromAccountID);
            parameters.Add("@ToAccountType", entity.ToAccountType);
            parameters.Add("@ToAccountID", entity.ToAccountID);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_BankTransfer_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_BankTransfer_Delete", new { TransferId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<BankTransfer>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<BankTransfer>("NU_sp_BankTransfer_GetAll", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<AccountBalance>> GetAccountBalancesAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<AccountBalance>("NU_sp_GetAccountBalances", commandType: CommandType.StoredProcedure);
        }
    }
}
