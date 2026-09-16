import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-receipt-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './receipt-register.component.html',
  styleUrls: ['./receipt-register.component.css']
})
export class ReceiptRegisterComponent implements OnInit {

  displayedColumns: string[] = ['receiptNumber', 'receiptBook_Rno', 'receivedDate', 'receiptDate', 'donorName', 'eventGroupName', 'paymentMode', 'cashAmount', 'bankAmount'];
  dataSource = new MatTableDataSource<any>([]);

  startDate: Date = new Date(new Date().getFullYear(), 0, 1);
  endDate: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadReport(): void {
    const start = this.startDate.toISOString().split('T')[0];
    const end = this.endDate.toISOString().split('T')[0];
    this.reportService.getReceiptRegister(start, end).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
