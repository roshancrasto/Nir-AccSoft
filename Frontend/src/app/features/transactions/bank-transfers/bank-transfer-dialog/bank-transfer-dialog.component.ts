import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BankTransfer, BankTransferService, AccountBalance } from '../../../../core/services/bank-transfer.service';
import { OpeningBalanceService, BankAccountDropdown } from '../../../../core/services/opening-balance.service';

export interface BankTransferDialogData {
  mode: 'add' | 'edit';
  transfer?: BankTransfer;
}

@Component({
  selector: 'app-bank-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './bank-transfer-dialog.component.html',
  styleUrl: './bank-transfer-dialog.component.css'
})
export class BankTransferDialogComponent implements OnInit {
  transferDate: Date = new Date();
  transferType: string = 'Cash Deposit';
  fromAccountType: string = 'Cash';
  fromAccountID: number | null = null;
  toAccountType: string = 'Bank';
  toAccountID: number | null = null;
  amount: number = 0;
  referenceNumber: string = '';
  remarks: string = '';

  transferTypes: string[] = [
    'Cash Deposit',
    'Cash Withdrawal',
    'Bank To Bank',
    'Transfer To Petty Cash',
    'Transfer To Fixed Deposit',
    'Fixed Deposit Maturity',
    'General Transfer'
  ];

  accountTypes: string[] = ['Cash', 'Bank', 'Fixed Deposit'];

  allAccounts: BankAccountDropdown[] = [];
  balances: AccountBalance[] = [];

  constructor(
    public dialogRef: MatDialogRef<BankTransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankTransferDialogData,
    private bankTransferService: BankTransferService,
    private openingBalanceService: OpeningBalanceService
  ) {
    if (data.mode === 'edit' && data.transfer) {
      this.transferDate = new Date(data.transfer.transferDate);
      this.transferType = data.transfer.transferType;
      this.fromAccountType = data.transfer.fromAccountType || 'Cash';
      this.fromAccountID = data.transfer.fromAccountID;
      this.toAccountType = data.transfer.toAccountType || 'Bank';
      this.toAccountID = data.transfer.toAccountID;
      this.amount = data.transfer.amount;
      this.referenceNumber = data.transfer.referenceNumber || '';
      this.remarks = data.transfer.remarks || '';
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.openingBalanceService.getBankAccounts().subscribe(accounts => {
      this.allAccounts = accounts;
    });
    this.bankTransferService.getAccountBalances().subscribe(balances => {
      this.balances = balances;
    });
  }

  getFilteredAccounts(type: string): BankAccountDropdown[] {
    return this.allAccounts.filter(a => (a.accountType || 'Bank') === type);
  }

  getAccountDisplay(account: BankAccountDropdown): string {
    return `[${account.accountType || 'Bank'}] ${account.bankName} - ${account.branch}`;
  }

  getBalance(accountId: number | null): number {
    if (!accountId) return 0;
    const b = this.balances.find(x => x.accountId === accountId);
    return b ? b.balance : 0;
  }

  onTransferTypeChange(): void {
    if (this.transferType === 'Cash Deposit') {
      this.fromAccountType = 'Cash';
      this.toAccountType = 'Bank';
    } else if (this.transferType === 'Cash Withdrawal') {
      this.fromAccountType = 'Bank';
      this.toAccountType = 'Cash';
    } else if (this.transferType === 'Bank To Bank') {
      this.fromAccountType = 'Bank';
      this.toAccountType = 'Bank';
    } else if (this.transferType === 'Transfer To Petty Cash') {
      this.fromAccountType = 'Cash';
      this.toAccountType = 'Cash';
    } else if (this.transferType === 'Transfer To Fixed Deposit') {
      this.fromAccountType = 'Bank';
      this.toAccountType = 'Fixed Deposit';
    } else if (this.transferType === 'Fixed Deposit Maturity') {
      this.fromAccountType = 'Fixed Deposit';
      this.toAccountType = 'Bank';
    }
    
    // Reset account selections when type changes
    this.fromAccountID = null;
    this.toAccountID = null;
  }

  onFromAccountTypeChange(): void {
    this.fromAccountID = null;
  }

  onToAccountTypeChange(): void {
    this.toAccountID = null;
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSave(): void {
    if (this.amount <= 0) return;
    
    if (this.fromAccountID && this.toAccountID && this.fromAccountID === this.toAccountID) {
      alert("From Account and To Account cannot be the same.");
      return;
    }

    const transferData = {
      transferDate: this.formatDate(this.transferDate),
      transferType: this.transferType,
      fromAccountType: this.fromAccountType,
      fromAccountID: this.fromAccountID,
      toAccountType: this.toAccountType,
      toAccountID: this.toAccountID,
      amount: this.amount,
      referenceNumber: this.referenceNumber,
      remarks: this.remarks
    };

    this.dialogRef.close(transferData);
  }
}
