import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { PaymentService, PendingEventExpense } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-event-expense-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './event-expense-selection-dialog.component.html',
  styleUrls: ['./event-expense-selection-dialog.component.css']
})
export class EventExpenseSelectionDialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'eventGroupName', 'expenseCode', 'expenseDetails', 'pendingAmount'];
  dataSource = new MatTableDataSource<PendingEventExpense>();
  selection = new SelectionModel<PendingEventExpense>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<EventExpenseSelectionDialogComponent>
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Explicit filter predicate to ensure search works on all relevant fields
    this.dataSource.filterPredicate = (data: PendingEventExpense, filter: string) => {
      const dataStr = `${data.eventGroupName} ${data.expenseCode} ${data.expenseDetails} ${data.pendingAmount}`.toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };

    this.loadPendingExpenses();
  }

  loadPendingExpenses(): void {
    this.paymentService.getPendingEventExpenses().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => console.error('Error loading pending expenses', err)
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onConfirm(): void {
    this.dialogRef.close(this.selection.selected);
  }
}
