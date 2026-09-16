import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { ReportService } from '../../../core/services/report.service';
import { VendorService, Vendor } from '../../../core/services/vendor.service';
import { EventGroupService, EventGroup } from '../../../core/services/event-group.service';
import { CategoryService, Category } from '../../../core/services/category.service';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './payment-register.component.html',
  styleUrl: './payment-register.component.css'
})
export class PaymentRegisterComponent implements OnInit {

  displayedColumns: string[] = [
    'voucherNumber', 'voucherDate', 'paymentDate', 'eventGroupName', 
    'expenseCategory', 'expenseDetails', 'vendorName', 'paymentMode', 
    'amount', 'referenceNumber', 'remarks'
  ];
  dataSource = new MatTableDataSource<any>([]);

  filterForm!: FormGroup;
  
  vendors: Vendor[] = [];
  eventGroups: EventGroup[] = [];
  categories: Category[] = [];
  paymentModes: string[] = ['Cash', 'Bank', 'Online'];

  totalAmount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private vendorService: VendorService,
    private eventGroupService: EventGroupService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    this.filterForm = this.fb.group({
      fromDate: [startOfYear],
      toDate: [today],
      eventGroupKey: [null],
      paymentMode: [''],
      vendorId: [null],
      expenseCategoryId: [null]
    });

    this.loadMasterData();
  }

  loadMasterData(): void {
    this.vendorService.getVendors().subscribe(res => this.vendors = res);
    this.eventGroupService.getEventGroups().subscribe(res => this.eventGroups = res);
    this.categoryService.getCategories().subscribe(res => this.categories = res);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadReport(): void {
    const filters = this.filterForm.value;
    
    const reqFilters = {
      fromDate: filters.fromDate ? new Date(filters.fromDate).toISOString().split('T')[0] : '',
      toDate: filters.toDate ? new Date(filters.toDate).toISOString().split('T')[0] : '',
      eventGroupKey: filters.eventGroupKey,
      paymentMode: filters.paymentMode,
      vendorId: filters.vendorId,
      expenseCategoryId: filters.expenseCategoryId
    };

    this.reportService.getPaymentRegister(reqFilters).subscribe(data => {
      this.dataSource.data = data;
      this.calculateTotal();
    });
  }

  clearFilters(): void {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    this.filterForm.reset({
      fromDate: startOfYear,
      toDate: today,
      eventGroupKey: null,
      paymentMode: '',
      vendorId: null,
      expenseCategoryId: null
    });
    this.dataSource.data = [];
    this.calculateTotal();
  }

  applySearchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.dataSource.filteredData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  goToVoucher(voucherNumber: string): void {
    // Navigate to payment voucher details if needed
    // this.router.navigate(['/transactions/payments', voucherNumber]);
  }

  exportExcel(): void {
    const dataToExport = this.dataSource.filteredData.map(row => ({
      'Voucher No': row.voucherNumber,
      'Voucher Date': row.voucherDate ? new Date(row.voucherDate).toLocaleDateString() : '',
      'Payment Date': row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '',
      'Event Group': row.eventGroupName,
      'Expense Category': row.expenseCategory,
      'Expense Details': row.expenseDetails,
      'Vendor Name': row.vendorName,
      'Payment Mode': row.paymentMode,
      'Amount': row.amount,
      'Reference No': row.referenceNumber,
      'Remarks': row.remarks
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Register');
    XLSX.writeFile(wb, 'PaymentRegister.xlsx');
  }

  exportPDF(): void {
    const doc = new jsPDF('landscape');
    
    doc.text('Payment Voucher Register', 14, 15);
    
    const body = this.dataSource.filteredData.map(row => [
      row.voucherNumber,
      row.voucherDate ? new Date(row.voucherDate).toLocaleDateString() : '',
      row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '',
      row.eventGroupName,
      row.expenseCategory,
      row.vendorName,
      row.paymentMode,
      row.amount?.toString(),
      row.referenceNumber
    ]);

    autoTable(doc, {
      head: [['Voucher No', 'Vch Date', 'Pay Date', 'Event Group', 'Category', 'Vendor', 'Mode', 'Amount', 'Ref No']],
      body: body,
      startY: 20
    });

    const finalY = (doc as any).lastAutoTable.finalY || 20;
    doc.text(`Total Amount: INR ${this.totalAmount}`, 14, finalY + 10);

    doc.save('PaymentRegister.pdf');
  }

  print(): void {
    let printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>NIRANTHAR UDYAVAR</h2>
        <h3>Payment Voucher Register</h3>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;" border="1">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px;">Voucher No</th>
            <th style="padding: 8px;">Voucher Date</th>
            <th style="padding: 8px;">Payment Date</th>
            <th style="padding: 8px;">Event Group</th>
            <th style="padding: 8px;">Category</th>
            <th style="padding: 8px;">Expense Details</th>
            <th style="padding: 8px;">Vendor</th>
            <th style="padding: 8px;">Mode</th>
            <th style="padding: 8px;">Amount</th>
            <th style="padding: 8px;">Ref No</th>
          </tr>
        </thead>
        <tbody>
    `;

    this.dataSource.filteredData.forEach(row => {
      printContents += `
        <tr>
          <td style="padding: 8px;">${row.voucherNumber || ''}</td>
          <td style="padding: 8px;">${row.voucherDate ? new Date(row.voucherDate).toLocaleDateString() : ''}</td>
          <td style="padding: 8px;">${row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : ''}</td>
          <td style="padding: 8px;">${row.eventGroupName || ''}</td>
          <td style="padding: 8px;">${row.expenseCategory || ''}</td>
          <td style="padding: 8px;">${row.expenseDetails || ''}</td>
          <td style="padding: 8px;">${row.vendorName || ''}</td>
          <td style="padding: 8px;">${row.paymentMode || ''}</td>
          <td style="padding: 8px; text-align: right;">${row.amount || 0}</td>
          <td style="padding: 8px;">${row.referenceNumber || ''}</td>
        </tr>
      `;
    });

    printContents += `
        </tbody>
      </table>
      <div style="margin-top: 15px; font-weight: bold; text-align: right;">
        Total Amount: INR ${this.totalAmount}
      </div>
    `;

    const popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=100%');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>Print Payment Register</title>
          <style>
            @media print {
              table { page-break-inside: auto }
              tr    { page-break-inside: avoid; page-break-after: auto }
              thead { display: table-header-group }
              tfoot { display: table-footer-group }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin?.document.close();
  }
}
