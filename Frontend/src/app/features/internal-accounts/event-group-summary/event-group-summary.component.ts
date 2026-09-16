import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InternalAccountService, EventGroupSummary } from '../../../core/services/internal-account.service';

@Component({
  selector: 'app-event-group-summary',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './event-group-summary.component.html',
  styleUrls: ['./event-group-summary.component.css']
})
export class EventGroupSummaryComponent implements OnInit {
  displayedColumns: string[] = ['eventGroupName', 'totalReceipts', 'receiptsCreated', 'pendingReceipts', 'totalExpenseAmount', 'paidAmount', 'pendingAmount', 'balance'];
  dataSource: MatTableDataSource<EventGroupSummary> = new MatTableDataSource<EventGroupSummary>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private internalAccountService: InternalAccountService) { }

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.internalAccountService.getEventGroupSummary().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading summary', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalExpenseAmount(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.totalExpenseAmount || 0), 0);
  }

  getTotalPaidAmount(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.paidAmount || 0), 0);
  }

  getTotalPendingAmount(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.pendingAmount || 0), 0);
  }

  getTotalReceipts(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.totalReceipts || 0), 0);
  }

  getTotalReceiptsCreated(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.receiptsCreated || 0), 0);
  }

  getTotalPendingReceipts(): number {
    return this.dataSource.data.reduce((acc, row) => acc + (row.pendingReceipts || 0), 0);
  }

  getTotalBalance(): number {
    return this.getTotalReceipts() - this.getTotalExpenseAmount();
  }
}
