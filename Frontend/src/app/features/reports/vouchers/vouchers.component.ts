import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { VendorService, Vendor } from '../../../core/services/vendor.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { ReportService, VoucherReportModel } from '../../../core/services/report.service';



@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit {
  filterForm!: FormGroup;
  
  vendors: Vendor[] = [];
  categories: Category[] = [];
  financialYears: string[] = ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'];

  reports: VoucherReportModel[] = [];
  currentIndex: number = 0;
  
  displayedColumns: string[] = ['rowNo', 'billNo', 'billDate', 'party', 'categoryName', 'amount'];

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private categoryService: CategoryService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      financialYear: ['2025-26'],
      vendorId: [null],
      categoryId: [null],
      voucherNo: ['']
    });

    this.loadMasterData();
  }

  loadMasterData(): void {
    this.vendorService.getVendors().subscribe(res => this.vendors = res);
    this.categoryService.getCategories().subscribe(res => this.categories = res);
  }

  loading: boolean = false;

  onSearch(): void {
    const filters = this.filterForm.value;
    
    this.loading = true;
    this.reportService.getVoucherReport({
      financialYear: filters.financialYear,
      vendorKey: filters.vendorId,
      voucherNo: filters.voucherNo
    }).subscribe(data => {
      this.reports = data || [];
      this.currentIndex = 0;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  get currentReport(): VoucherReportModel | null {
    if (this.reports.length === 0) return null;
    return this.reports[this.currentIndex];
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.reports.length - 1;
  }

  previousReport(): void {
    if (this.hasPrevious) {
      this.currentIndex--;
    }
  }

  nextReport(): void {
    if (this.hasNext) {
      this.currentIndex++;
    }
  }

  isExporting: boolean = false;

  async exportPdf(): Promise<void> {
    if (this.reports.length === 0) return;
    
    this.isExporting = true;
    
    try {
      // Give Angular time to render all hidden pages in the DOM
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Process each voucher page individually to prevent canvas size limits (browser crashing)
      for (let i = 0; i < this.reports.length; i++) {
        const element = document.getElementById('voucher-page-' + i);
        if (element) {
          // Render the specific voucher div to a canvas
          const canvas = await html2canvas(element, { 
            scale: 2, // High resolution
            useCORS: true, 
            logging: false 
          });
          
          // Use JPEG to keep the PDF file size small for 150+ pages
          const imgData = canvas.toDataURL('image/jpeg', 0.95); 
          
          const imgWidth = 210; // A4 width in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          if (i > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
      }

      pdf.save('Vouchers_Report.pdf');
    } catch (err: any) {
      console.error('Error generating PDF', err);
      alert('Error generating PDF: ' + err.message);
    } finally {
      this.isExporting = false;
    }
  }

  getExpenseTotal(report: VoucherReportModel): number {
    if (!report || !report.details) return 0;
    return report.details.reduce((sum: number, detail: any) => sum + (detail.amount || 0), 0);
  }

  isTotalMismatch(report: VoucherReportModel): boolean {
    const expenseTotal = this.getExpenseTotal(report);
    const debitAmount = report.debitAmount || 0;
    return Math.abs(expenseTotal - debitAmount) > 0.01;
  }

  amountInWords(amount: number): string {
    if (!amount) return 'Zero Only';
    
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num: number): string => {
        if ((num = num.toString().replace(/[\, ]/g, '') as any) != parseFloat(num as any)) return 'Not a Number';
        let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str.trim();
    };

    return `Rupees ${inWords(Math.floor(amount))} Only`;
  }
}
