using AutoMapper;
using DemoProject.Data.Entities;

namespace DemoProject.Business.DTOs
{
    public class MoreTransactionProfiles : Profile
    {
        public MoreTransactionProfiles()
        {
            CreateMap<Reimbursement, ReimbursementDto>();
            CreateMap<CreateReimbursementDto, Reimbursement>();
            CreateMap<ReimbursementDto, Reimbursement>();

            CreateMap<Asset, AssetDto>();
            CreateMap<CreateAssetDto, Asset>();
            CreateMap<AssetDto, Asset>();

            CreateMap<BankTransfer, BankTransferDto>();
            CreateMap<CreateBankTransferDto, BankTransfer>();
            CreateMap<BankTransferDto, BankTransfer>();
            
            CreateMap<AccountBalance, AccountBalanceDto>();
        }
    }
}
