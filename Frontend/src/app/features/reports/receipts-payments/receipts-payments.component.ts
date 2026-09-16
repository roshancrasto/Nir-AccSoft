import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportService, ReceiptsPaymentsReportModel } from '../../../core/services/report.service';

@Component({
  selector: 'app-receipts-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './receipts-payments.component.html',
  styleUrls: ['./receipts-payments.component.css']
})
export class ReceiptsPaymentsComponent implements OnInit {

  financialYears: string[] = ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'];
  selectedYear: string = '2025-26';
  
  reportData: ReceiptsPaymentsReportModel | null = null;
  
  // We use maxRows to balance the left and right sides of the table
  maxRows: number[] = [];

  constructor(
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Optionally load default data
    // this.loadReport();
  }

  loadReport() {
    if (!this.selectedYear) return;

    this.reportService.getReceiptsPaymentsAccount(this.selectedYear).subscribe({
      next: (res: ReceiptsPaymentsReportModel) => {
        this.reportData = res;
        this.calculateMaxRows();
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Error loading report data', 'Close', { duration: 3000 });
      }
    });
  }

  calculateMaxRows() {
    if (!this.reportData) return;
    const rLen = this.reportData.receipts ? this.reportData.receipts.length : 0;
    const pLen = this.reportData.payments ? this.reportData.payments.length : 0;
    const max = Math.max(rLen, pLen);
    this.maxRows = Array(max).fill(0).map((x, i) => i);
  }

  exportExcel() {
    if (!this.reportData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "NIRANTHAR UDYAVAR\n";
    csvContent += `Receipts & Payments Account for the Year Ending 31-Mar-${this.selectedYear.split('-')[0]}\n\n`;
    
    csvContent += "Receipts,Amount (INR),Payments,Amount (INR)\n";
    
    for (let i of this.maxRows) {
      const receipt = this.reportData.receipts[i];
      const payment = this.reportData.payments[i];
      
      const rDesc = receipt ? `"${receipt.description}"` : "";
      const rAmt = (receipt && receipt.amount != null) ? receipt.amount.toFixed(2) : "";
      
      const pDesc = payment ? `"${payment.description}"` : "";
      const pAmt = (payment && payment.amount != null) ? payment.amount.toFixed(2) : "";
      
      csvContent += `${rDesc},${rAmt},${pDesc},${pAmt}\n`;
    }

    // Totals row
    csvContent += `Total Receipts,${this.reportData.totalReceipts.toFixed(2)},Total Payments,${this.reportData.totalPayments.toFixed(2)}\n`;
    csvContent += `,,Closing Balance,${this.reportData.closingBalance.toFixed(2)}\n`;
    csvContent += `Final Total,${this.reportData.finalTotal.toFixed(2)},Final Total,${this.reportData.finalTotal.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Receipts_Payments_${this.selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportPdf() {
    window.print();
  }
}
