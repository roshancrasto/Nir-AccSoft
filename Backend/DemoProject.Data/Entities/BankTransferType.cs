using System;

namespace DemoProject.Data.Entities
{
    public class BankTransferType
    {
        public int TransferTypeId { get; set; }
        public string TransferTypeName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
