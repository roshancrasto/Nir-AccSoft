using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class ReceiptRepository : IReceiptRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public ReceiptRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Receipt entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@ReceiptNumber", entity.ReceiptNumber);
            parameters.Add("@ReceiptDate", entity.ReceiptDate);
            parameters.Add("@ReceivedDate", entity.ReceivedDate);
            parameters.Add("@DonorId", entity.DonorId);
            parameters.Add("@EventKey", entity.EventKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@CashAmount", entity.CashAmount);
            parameters.Add("@BankAmount", entity.BankAmount);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@PANAvailable", entity.PANAvailable);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@ReceiptBook_Rno", entity.ReceiptBook_Rno);
            parameters.Add("@CreatedBy", createdBy);
            return await connection.ExecuteScalarAsync<int>("NU_sp_Receipt_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Receipt entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@ReceiptId", entity.ReceiptId);
            parameters.Add("@ReceiptDate", entity.ReceiptDate);
            parameters.Add("@ReceivedDate", entity.ReceivedDate);
            parameters.Add("@DonorId", entity.DonorId);
            parameters.Add("@EventKey", entity.EventKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@CashAmount", entity.CashAmount);
            parameters.Add("@BankAmount", entity.BankAmount);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@PANAvailable", entity.PANAvailable);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@ReceiptBook_Rno", entity.ReceiptBook_Rno);
            parameters.Add("@ModifiedBy", modifiedBy);
            await connection.ExecuteAsync("NU_sp_Receipt_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Receipt_Delete", new { ReceiptId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Receipt>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Receipt>("NU_sp_Receipt_GetAll", commandType: CommandType.StoredProcedure);
        }
    }

    public class PaymentRepository : IPaymentRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;
        public PaymentRepository(IDbConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }

        public async Task<int> AddAsync(Payment entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@VoucherNumber", entity.VoucherNumber);
            parameters.Add("@VoucherDate", entity.VoucherDate);
            parameters.Add("@PaymentDate", entity.PaymentDate);
            parameters.Add("@VendorId", entity.VendorId);
            parameters.Add("@EventKey", entity.EventKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@ExpenseCategoryId", entity.ExpenseCategoryId);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@DebitAmount", entity.DebitAmount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@BillAvailable", entity.BillAvailable);
            parameters.Add("@BillNumber", entity.BillNumber);
            parameters.Add("@BillDate", entity.BillDate);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@EnteredBy", entity.EnteredBy);
            parameters.Add("@VerifiedBy", entity.VerifiedBy);
            parameters.Add("@AttachmentPath", entity.AttachmentPath);
            parameters.Add("@RelatedPaymentID", entity.RelatedPaymentID);
            parameters.Add("@CreatedBy", createdBy);
            parameters.Add("@MemberId", entity.MemberId);
            parameters.Add("@IsVoucherOnly", entity.IsVoucherOnly);
            parameters.Add("@IsReimbursement", entity.IsReimbursement);
            parameters.Add("@PaymentType", entity.PaymentType);
            try
            {
                return await connection.ExecuteScalarAsync<int>("NU_sp_Payment_Insert", parameters, commandType: CommandType.StoredProcedure);
            }
            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                throw new System.Exception("Voucher no already exists");
            }
        }

        public async Task UpdateAsync(Payment entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@PaymentId", entity.PaymentId);
            parameters.Add("@VoucherDate", entity.VoucherDate);
            parameters.Add("@PaymentDate", entity.PaymentDate);
            parameters.Add("@VendorId", entity.VendorId);
            parameters.Add("@EventKey", entity.EventKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@ExpenseCategoryId", entity.ExpenseCategoryId);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@DebitAmount", entity.DebitAmount);
            parameters.Add("@Description", entity.Description);
            parameters.Add("@BillAvailable", entity.BillAvailable);
            parameters.Add("@BillNumber", entity.BillNumber);
            parameters.Add("@BillDate", entity.BillDate);
            parameters.Add("@ReferenceNumber", entity.ReferenceNumber);
            parameters.Add("@EnteredBy", entity.EnteredBy);
            parameters.Add("@VerifiedBy", entity.VerifiedBy);
            parameters.Add("@AttachmentPath", entity.AttachmentPath);
            parameters.Add("@RelatedPaymentID", entity.RelatedPaymentID);
            parameters.Add("@ModifiedBy", modifiedBy);
            parameters.Add("@MemberId", entity.MemberId);
            parameters.Add("@IsVoucherOnly", entity.IsVoucherOnly);
            parameters.Add("@IsReimbursement", entity.IsReimbursement);
            parameters.Add("@PaymentType", entity.PaymentType);
            try
            {
                await connection.ExecuteAsync("NU_sp_Payment_Update", parameters, commandType: CommandType.StoredProcedure);
            }
            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                throw new System.Exception("Voucher no already exists");
            }
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_Payment_Delete", new { PaymentId = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Payment>("NU_sp_Payment_GetAll", commandType: CommandType.StoredProcedure);
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Payment>("NU_sp_Payment_GetById", new { PaymentId = id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<PendingEventExpense>> GetPendingEventExpensesAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<PendingEventExpense>("NU_sp_EventExpense_GetPending", commandType: CommandType.StoredProcedure);
        }

        public async Task AddMappingsAsync(IEnumerable<PaymentExpenseMapping> mappings)
        {
            using var connection = _connectionFactory.CreateConnection();
            foreach (var mapping in mappings)
            {
                var parameters = new DynamicParameters();
                parameters.Add("@PaymentID", mapping.PaymentID);
                parameters.Add("@EventExpenseKey", mapping.EventExpenseKey);
                parameters.Add("@Amount", mapping.Amount);
                parameters.Add("@CreatedBy", mapping.CreatedBy);
                await connection.ExecuteAsync("NU_sp_PaymentExpenseMapping_Insert", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task<IEnumerable<PaymentExpenseMapping>> GetMappingsByPaymentIdAsync(int paymentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<PaymentExpenseMapping>("NU_sp_PaymentExpenseMapping_GetByPaymentId", new { PaymentID = paymentId }, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteMappingsByPaymentIdAsync(int paymentId, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_PaymentExpenseMapping_DeleteByPaymentId", new { PaymentID = paymentId, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<RelatedPayment>> GetRelatedPaymentsAsync(int? eventGroupKey, int? currentPaymentId)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupKey", eventGroupKey);
            parameters.Add("@CurrentPaymentID", currentPaymentId);
            return await connection.QueryAsync<RelatedPayment>("NU_sp_Payment_GetRelated", parameters, commandType: CommandType.StoredProcedure);
        }
    }
}
