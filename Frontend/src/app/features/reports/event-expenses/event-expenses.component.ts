import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService } from '../../../core/services/report.service';
import { EventGroupService, EventGroup } from '../../../core/services/event-group.service';

interface StatementRow {
  receipt: string;
  receiptAmountVal: number | null;
  receiptAmount: number | null;
  payment: string;
  voucherAmountVal: number | null;
  paymentAmount: number | null;
}

@Component({
  selector: 'app-event-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-expenses.component.html',
  styleUrls: ['./event-expenses.component.css']
})
export class EventExpensesComponent implements OnInit {
  eventGroups: EventGroup[] = [];
  selectedEventGroupKey: number | null = null;
  isLoading = false;
  reportData: any = null;
  statementRows: StatementRow[] = [];

  constructor(
    private reportService: ReportService,
    private eventGroupService: EventGroupService
  ) {}

  ngOnInit(): void {
    this.loadEventGroups();
  }

  loadEventGroups(): void {
    this.eventGroupService.getEventGroups().subscribe({
      next: (groups) => {
        // Filter active event groups and sort by name
        this.eventGroups = groups
          .filter(g => g.isActive)
          .sort((a, b) => a.eventGroupName.localeCompare(b.eventGroupName));
          
        if (this.eventGroups.length > 0) {
          this.selectedEventGroupKey = this.eventGroups[0].eventGroupId;
          this.loadReport();
        }
      },
      error: (err) => console.error('Error fetching event groups:', err)
    });
  }

  loadReport(): void {
    if (!this.selectedEventGroupKey) return;
    
    this.isLoading = true;
    this.reportData = null;
    this.statementRows = [];

    this.reportService.getEventExpenses(this.selectedEventGroupKey).subscribe({
      next: (data) => {
        this.reportData = data;
        this.alignRows();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.isLoading = false;
      }
    });
  }

  alignRows(): void {
    if (!this.reportData) return;

    const receipts = this.reportData.receipts || [];
    const payments = this.reportData.payments || [];
    const maxRows = Math.max(receipts.length, payments.length);

    this.statementRows = [];
    for (let i = 0; i < maxRows; i++) {
      this.statementRows.push({
        receipt: receipts[i] ? receipts[i].receipts : '',
        receiptAmountVal: receipts[i] ? receipts[i].receiptAmount : null,
        receiptAmount: receipts[i] ? receipts[i].amount : null,
        payment: payments[i] ? (payments[i].expenseDetails || payments[i].payments) : '',
        voucherAmountVal: payments[i] ? payments[i].voucherAmount : null,
        paymentAmount: payments[i] ? payments[i].amount : null
      });
    }
  }

  exportToExcel(): void {
    if (!this.reportData) return;
    
    const eventName = this.reportData.eventGroupName || 'Event_Report';
    const fileName = `Event_Expenses_Report_${eventName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
    
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .title { text-align: center; font-size: 16px; font-weight: bold; padding: 15px 0; text-transform: uppercase; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th { border: 1px solid #000; background-color: #f2f2f2; font-weight: bold; padding: 8px; text-align: left; }
        td { border: 1px solid #cccccc; padding: 8px; }
        .text-right { text-align: right; }
        .amount { mso-number-format: "\\#\\,\\#\\#0\\.00"; }
        .bold { font-weight: bold; }
        .total-label { font-weight: bold; }
        .total-amount { font-weight: bold; border-top: 1px solid #000000; border-bottom: 3px double #000000; }
        .empty-cell { background-color: #fafafa; }
      </style>
      </head>
      <body>
        <div class="title">${eventName.toUpperCase()}</div>
        <table>
          <thead>
            <tr>
              <th>Receipts</th>
              <th>Receipt Amount</th>
              <th>Amount</th>
              <th>Payments</th>
              <th>Voucher Amount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
    `;

    this.statementRows.forEach(row => {
      const recAmtVal = row.receiptAmountVal !== null ? row.receiptAmountVal : '';
      const recAmt = row.receiptAmount !== null ? row.receiptAmount : '';
      const payAmtVal = row.voucherAmountVal !== null ? row.voucherAmountVal : '';
      const payAmt = row.paymentAmount !== null ? row.paymentAmount : '';
      html += `
        <tr>
          <td>${row.receipt}</td>
          <td class="text-right amount">${recAmtVal}</td>
          <td class="text-right amount">${recAmt}</td>
          <td>${row.payment}</td>
          <td class="text-right amount">${payAmtVal}</td>
          <td class="text-right amount">${payAmt}</td>
        </tr>
      `;
    });

    // Total Expenses row
    html += `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="bold">Total Expenses</td>
        <td class="text-right amount bold">${(this.reportData.totalVoucherAmount || 0).toFixed(2)}</td>
        <td class="text-right amount bold">${this.reportData.totalPayments.toFixed(2)}</td>
      </tr>
    `;

    // Income Over Expenditure row
    html += `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="bold">Income Over Expenditure</td>
        <td class="text-right amount bold">${(this.reportData.incomeOverExpenditureVal || 0).toFixed(2)}</td>
        <td class="text-right amount bold">${this.reportData.incomeOverExpenditure.toFixed(2)}</td>
      </tr>
    `;

    // Final TOTAL row
    const finalTotal = this.reportData.totalReceipts;
    html += `
      <tr class="bold">
        <td class="total-label">TOTAL</td>
        <td class="text-right amount total-amount">${(this.reportData.totalReceiptAmount || 0).toFixed(2)}</td>
        <td class="text-right amount total-amount">${finalTotal.toFixed(2)}</td>
        <td class="total-label">TOTAL</td>
        <td class="text-right amount total-amount">${(this.reportData.totalReceiptAmount || 0).toFixed(2)}</td>
        <td class="text-right amount total-amount">${finalTotal.toFixed(2)}</td>
      </tr>
    `;

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToPDF(): void {
    window.print();
  }
}
