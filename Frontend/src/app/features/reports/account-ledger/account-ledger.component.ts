import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportService } from '../../../core/services/report.service';
import { OpeningBalanceService } from '../../../core/services/opening-balance.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-account-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.css']
})
export class AccountLedgerComponent implements OnInit {
  accounts: any[] = [];
  selectedAccountId: number | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  
  isLoading = false;
  reportData: any = null;

  displayedColumns: string[] = ['date', 'particulars', 'referenceNo', 'receipt', 'payment', 'balance'];

  constructor(
    private reportService: ReportService,
    private obService: OpeningBalanceService,
    private snackBar: MatSnackBar
  ) {
    const today = new Date();
    // Default to current financial year logic could go here
    // For simplicity, let's default to a 1 year range ending today
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), 3, 1); // April 1st
    if (today.getMonth() < 3) {
      this.fromDate = new Date(today.getFullYear() - 1, 3, 1);
    }
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.obService.getBankAccounts().subscribe({
      next: (data: any[]) => {
        this.accounts = data;
      },
      error: () => {
        this.snackBar.open('Failed to load accounts', 'Close', { duration: 3000 });
      }
    });
  }

  formatDateForApi(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  viewReport(): void {
    if (!this.selectedAccountId) {
      this.snackBar.open('Please select an account', 'Close', { duration: 3000 });
      return;
    }
    if (!this.fromDate || !this.toDate) {
      this.snackBar.open('Please select a valid date range', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.reportData = null;

    const fromDateStr = this.formatDateForApi(this.fromDate);
    const toDateStr = this.formatDateForApi(this.toDate);

    this.reportService.getAccountLedger(this.selectedAccountId, fromDateStr, toDateStr).subscribe({
      next: (data) => {
        // Add opening balance as the first transaction for UI display
        if (data) {
          const obTx = {
            date: this.fromDate,
            particulars: 'Opening Balance',
            referenceNo: '',
            receipt: data.openingBalance,
            payment: 0,
            balance: data.openingBalance,
            isOpeningBalance: true
          };
          data.transactions = [obTx, ...(data.transactions || [])];
        }
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load report', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  clearFilters(): void {
    this.selectedAccountId = null;
    this.reportData = null;
    const today = new Date();
    this.toDate = today;
    this.fromDate = new Date(today.getFullYear(), 3, 1);
    if (today.getMonth() < 3) {
      this.fromDate = new Date(today.getFullYear() - 1, 3, 1);
    }
  }

  exportExcel(): void {
    if (!this.reportData) return;

    const wsData = [];
    wsData.push(['NIRANTHAR UDYAVAR']);
    wsData.push(['ACCOUNT LEDGER']);
    wsData.push([`Account: ${this.reportData.accountName}`]);
    wsData.push([`Period: ${this.formatDateForApi(this.fromDate)} to ${this.formatDateForApi(this.toDate)}`]);
    wsData.push([]);
    wsData.push(['Date', 'Particulars', 'Reference No', 'Receipt', 'Payment', 'Balance']);

    this.reportData.transactions.forEach((tx: any) => {
      wsData.push([
        this.formatDateForApi(tx.date),
        tx.particulars,
        tx.referenceNo,
        tx.receipt || '',
        tx.payment || '',
        tx.balance
      ]);
    });

    wsData.push([]);
    wsData.push(['', '', 'Total Receipts', this.reportData.totalReceipts + this.reportData.openingBalance]);
    wsData.push(['', '', 'Total Payments', this.reportData.totalPayments]);
    wsData.push(['', '', 'Closing Balance', this.reportData.closingBalance]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Account Ledger');
    XLSX.writeFile(wb, `Account_Ledger_${this.reportData.accountName}.xlsx`);
  }

  exportPDF(): void {
    if (!this.reportData) return;

    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text('NIRANTHAR UDYAVAR', 14, 15);
    doc.setFontSize(12);
    doc.text('ACCOUNT LEDGER', 14, 22);
    doc.setFontSize(10);
    doc.text(`Account: ${this.reportData.accountName}`, 14, 28);
    doc.text(`Period: ${this.formatDateForApi(this.fromDate)} to ${this.formatDateForApi(this.toDate)}`, 14, 33);

    const bodyData = this.reportData.transactions.map((tx: any) => [
      this.formatDateForApi(tx.date),
      tx.particulars,
      tx.referenceNo,
      this.formatCurrency(tx.receipt),
      this.formatCurrency(tx.payment),
      this.formatCurrency(tx.balance)
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Particulars', 'Reference No', 'Receipt', 'Payment', 'Balance']],
      body: bodyData,
      theme: 'grid',
      styles: { fontSize: 9 },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.text(`Opening Balance: ${this.formatCurrency(this.reportData.openingBalance)}`, 14, finalY + 10);
    doc.text(`Total Receipts: ${this.formatCurrency(this.reportData.totalReceipts)}`, 14, finalY + 16);
    doc.text(`Total Payments: ${this.formatCurrency(this.reportData.totalPayments)}`, 14, finalY + 22);
    doc.text(`Closing Balance: ${this.formatCurrency(this.reportData.closingBalance)}`, 14, finalY + 28);

    doc.save(`Account_Ledger_${this.reportData.accountName}.pdf`);
  }

  printReport(): void {
    window.print();
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }
}
