using Dapper;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class PaymentExpenseLinkRepository : IPaymentExpenseLinkRepository
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public PaymentExpenseLinkRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("AccSoftConnection");
        }

        public async Task<int> AddAsync(PaymentExpenseLink entity, int createdBy)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    INSERT INTO NU_PaymentExpenseLinks 
                    (EventGroupKey, VendorKey, ExpenseCategoryKey, ExpenseDetails, BillNo, BillDate, Amount, PaidByMemberKey, PaymentMode, RelatedPaymentID, Remarks, IsVoucherOnly, CreatedBy, CreatedDate)
                    VALUES 
                    (@EventGroupKey, @VendorKey, @ExpenseCategoryKey, @ExpenseDetails, @BillNo, @BillDate, @Amount, @PaidByMemberKey, @PaymentMode, @RelatedPaymentID, @Remarks, @IsVoucherOnly, @CreatedBy, GETDATE());
                    SELECT CAST(SCOPE_IDENTITY() as int);";
                
                entity.CreatedBy = createdBy;
                return await connection.QuerySingleAsync<int>(query, entity);
            }
        }

        public async Task UpdateAsync(PaymentExpenseLink entity, int modifiedBy)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    UPDATE NU_PaymentExpenseLinks SET
                        EventGroupKey = @EventGroupKey,
                        VendorKey = @VendorKey,
                        ExpenseCategoryKey = @ExpenseCategoryKey,
                        ExpenseDetails = @ExpenseDetails,
                        BillNo = @BillNo,
                        BillDate = @BillDate,
                        Amount = @Amount,
                        PaidByMemberKey = @PaidByMemberKey,
                        PaymentMode = @PaymentMode,
                        RelatedPaymentID = @RelatedPaymentID,
                        Remarks = @Remarks,
                        IsVoucherOnly = @IsVoucherOnly,
                        ModifiedBy = @ModifiedBy,
                        ModifiedDate = GETDATE()
                    WHERE ExpenseId = @ExpenseId";
                
                entity.ModifiedBy = modifiedBy;
                await connection.ExecuteAsync(query, entity);
            }
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE NU_PaymentExpenseLinks SET DeletedFlag = 1, ModifiedBy = @ModifiedBy, ModifiedDate = GETDATE() WHERE ExpenseId = @Id";
                await connection.ExecuteAsync(query, new { Id = id, ModifiedBy = modifiedBy });
            }
        }

        public async Task<IEnumerable<PaymentExpenseLink>> GetAllAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        l.*,
                        eg.EventGroupName,
                        v.VendorName,
                        c.CategoryName,
                        m.MemberName
                    FROM NU_PaymentExpenseLinks l
                    LEFT JOIN NU_EventGroups eg ON l.EventGroupKey = eg.EventGroupId
                    LEFT JOIN NU_Vendors v ON l.VendorKey = v.VendorId
                    LEFT JOIN NU_Categories c ON l.ExpenseCategoryKey = c.CategoryId
                    LEFT JOIN NU_MemberDetails m ON l.PaidByMemberKey = m.MemberKey
                    WHERE l.DeletedFlag = 0
                    ORDER BY l.CreatedDate DESC";
                return await connection.QueryAsync<PaymentExpenseLink>(query);
            }
        }

        public async Task<IEnumerable<PaymentExpenseLink>> GetPendingAllAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        l.*,
                        eg.EventGroupName,
                        v.VendorName,
                        c.CategoryName,
                        m.MemberName
                    FROM NU_PaymentExpenseLinks l
                    LEFT JOIN NU_EventGroups eg ON l.EventGroupKey = eg.EventGroupId
                    LEFT JOIN NU_Vendors v ON l.VendorKey = v.VendorId
                    LEFT JOIN NU_Categories c ON l.ExpenseCategoryKey = c.CategoryId
                    LEFT JOIN NU_MemberDetails m ON l.PaidByMemberKey = m.MemberKey
                    WHERE l.DeletedFlag = 0 AND l.IsSettled = 0";
                return await connection.QueryAsync<PaymentExpenseLink>(query);
            }
        }

        public async Task<IEnumerable<PaymentExpenseLink>> GetPendingByMemberAsync(int memberId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        l.*,
                        eg.EventGroupName,
                        v.VendorName,
                        c.CategoryName,
                        m.MemberName
                    FROM NU_PaymentExpenseLinks l
                    LEFT JOIN NU_EventGroups eg ON l.EventGroupKey = eg.EventGroupId
                    LEFT JOIN NU_Vendors v ON l.VendorKey = v.VendorId
                    LEFT JOIN NU_Categories c ON l.ExpenseCategoryKey = c.CategoryId
                    LEFT JOIN NU_MemberDetails m ON l.PaidByMemberKey = m.MemberKey
                    WHERE l.DeletedFlag = 0 AND l.IsSettled = 0 AND l.PaidByMemberKey = @MemberId";
                return await connection.QueryAsync<PaymentExpenseLink>(query, new { MemberId = memberId });
            }
        }

        public async Task<IEnumerable<PaymentExpenseLink>> GetByPaymentIdAsync(int paymentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        l.*,
                        eg.EventGroupName,
                        v.VendorName,
                        c.CategoryName,
                        m.MemberName
                    FROM NU_PaymentExpenseLinks l
                    LEFT JOIN NU_EventGroups eg ON l.EventGroupKey = eg.EventGroupId
                    LEFT JOIN NU_Vendors v ON l.VendorKey = v.VendorId
                    LEFT JOIN NU_Categories c ON l.ExpenseCategoryKey = c.CategoryId
                    LEFT JOIN NU_MemberDetails m ON l.PaidByMemberKey = m.MemberKey
                    WHERE l.DeletedFlag = 0 AND l.PaymentId = @PaymentId";
                return await connection.QueryAsync<PaymentExpenseLink>(query, new { PaymentId = paymentId });
            }
        }

        public async Task UpdateSettlementAsync(IEnumerable<int> expenseIds, int? paymentId, int modifiedBy)
        {
            if (expenseIds == null || !expenseIds.Any()) return;

            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    UPDATE NU_PaymentExpenseLinks 
                    SET IsSettled = CASE WHEN @PaymentId IS NOT NULL THEN 1 ELSE 0 END,
                        SettledDate = CASE WHEN @PaymentId IS NOT NULL THEN GETDATE() ELSE NULL END,
                        PaymentId = @PaymentId,
                        ModifiedBy = @ModifiedBy,
                        ModifiedDate = GETDATE()
                    WHERE ExpenseId IN @ExpenseIds";
                await connection.ExecuteAsync(query, new { ExpenseIds = expenseIds, PaymentId = paymentId, ModifiedBy = modifiedBy });
            }
        }

        public async Task UnsettleByPaymentIdAsync(int paymentId, int modifiedBy)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    UPDATE NU_PaymentExpenseLinks 
                    SET IsSettled = 0,
                        SettledDate = NULL,
                        PaymentId = NULL,
                        ModifiedBy = @ModifiedBy,
                        ModifiedDate = GETDATE()
                    WHERE PaymentId = @PaymentId";
                await connection.ExecuteAsync(query, new { PaymentId = paymentId, ModifiedBy = modifiedBy });
            }
        }

        public async Task<IEnumerable<PaymentExpenseLink>> GetUnlinkedExpensesAsync(int eventGroupKey, int? currentExpenseId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = @"
                    SELECT 
                        l.*,
                        eg.EventGroupName,
                        v.VendorName,
                        c.CategoryName,
                        m.MemberName
                    FROM NU_PaymentExpenseLinks l
                    LEFT JOIN NU_EventGroups eg ON l.EventGroupKey = eg.EventGroupId
                    LEFT JOIN NU_Vendors v ON l.VendorKey = v.VendorId
                    LEFT JOIN NU_Categories c ON l.ExpenseCategoryKey = c.CategoryId
                    LEFT JOIN NU_MemberDetails m ON l.PaidByMemberKey = m.MemberKey
                    WHERE l.DeletedFlag = 0 
                      AND l.EventGroupKey = @EventGroupKey
                      AND l.IsSettled = 0
                      AND NOT EXISTS (
                          SELECT 1 FROM NU_PaymentExpenseLinks child 
                          WHERE child.RelatedPaymentID = l.ExpenseId AND child.DeletedFlag = 0
                      )
                      AND (l.ExpenseId != @CurrentExpenseId OR @CurrentExpenseId IS NULL)";
                
                return await connection.QueryAsync<PaymentExpenseLink>(query, new { EventGroupKey = eventGroupKey, CurrentExpenseId = currentExpenseId });
            }
        }
    }
}
