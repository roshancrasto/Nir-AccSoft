import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InternalAccountService, EventExpense } from '../../../core/services/internal-account.service';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';

@Component({
  selector: 'app-event-expense-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './event-expense-details.component.html',
  styleUrls: ['./event-expense-details.component.css']
})
export class EventExpenseDetailsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  eventGroupKey: number = 0;
  eventGroupName: string = 'Loading...';
  totalAmount: number = 0;
  totalPaid: number = 0;
  totalPending: number = 0;
  
  displayedColumns: string[] = ['expenseCode', 'expenseDetails', 'paymentMode', 'amount', 'paidAmount', 'pendingAmount', 'createdDate', 'actions'];
  dataSource: MatTableDataSource<EventExpense> = new MatTableDataSource<EventExpense>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute,
    private internalAccountService: InternalAccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventGroupKey = +params['id'];
      this.loadExpenses();
      this.loadSummary(); // To get the event group name
    });

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/internal/accounts');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadExpenses(): void {
    this.internalAccountService.getExpensesByEventGroup(this.eventGroupKey).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: EventExpense, filter: string) => {
          const searchStr = (data.expenseCode + (data.expenseDetails || '') + data.paymentMode + data.amount.toString()).toLowerCase();
          return searchStr.indexOf(filter) !== -1;
        };
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading expenses', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadSummary(): void {
    this.internalAccountService.getEventGroupSummary().subscribe(summaries => {
      const current = summaries.find(s => s.eventGroupKey === this.eventGroupKey);
      if (current) {
        this.eventGroupName = current.eventGroupName;
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.dataSource.data.reduce((acc, curr) => acc + curr.amount, 0);
    this.totalPaid = this.dataSource.data.reduce((acc, curr) => acc + (Number(curr.paidAmount) || 0), 0);
    this.totalPending = this.dataSource.data.reduce((acc, curr) => acc + (Number(curr.pendingAmount) || 0), 0);
  }

  openDialog(expense?: EventExpense): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '500px',
      data: { 
        expense: expense || null,
        eventGroupKey: this.eventGroupKey
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpenses();
        this.snackBar.open('Expense saved successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteExpense(expense: EventExpense): void {
    if (confirm(`Are you sure you want to delete expense ${expense.expenseCode}?`)) {
      this.internalAccountService.deleteExpense(expense.eventExpenseKey).subscribe({
        next: () => {
          this.loadExpenses();
          this.snackBar.open('Expense deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error deleting expense', err);
          this.snackBar.open('Error deleting expense', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
