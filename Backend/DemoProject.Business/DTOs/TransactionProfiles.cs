using AutoMapper;
using DemoProject.Data.Entities;

namespace DemoProject.Business.DTOs
{
    public class TransactionProfiles : Profile
    {
        public TransactionProfiles()
        {
            CreateMap<Receipt, ReceiptDto>();
            CreateMap<CreateReceiptDto, Receipt>();
            CreateMap<ReceiptDto, Receipt>();

            CreateMap<Payment, PaymentDto>();
            CreateMap<CreatePaymentDto, Payment>();
            CreateMap<PaymentDto, Payment>();

            CreateMap<PaymentExpenseMapping, PaymentExpenseMappingDto>();
            CreateMap<PaymentExpenseMappingDto, PaymentExpenseMapping>();
            CreateMap<PendingEventExpense, PendingEventExpenseDto>();
            CreateMap<RelatedPayment, RelatedPaymentDto>();
        }
    }
}
