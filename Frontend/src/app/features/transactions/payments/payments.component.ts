import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PaymentService, Payment } from '../../../core/services/payment.service';
import { ListFilter } from '../../../shared/list-filter/list-filter';
import { ListFilterComponent } from '../../../shared/list-filter/list-filter.component';
import { FilterChipsComponent } from '../../../shared/list-filter/filter-chips.component';
import { PaymentDialogComponent, PaymentDialogData } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatPaginatorModule,
    ListFilterComponent,
    FilterChipsComponent
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  private confirmDialog = inject(ConfirmDialogService);

  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['voucherNumber', 'voucherDate', 'paymentDate', 'vendorName', 'categoryName', 'eventGroupName', 'amount', 'paymentMode', 'actions'];
  dataSource: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
  isLoading = false;

  // List filter (multi-select Vendor / Category / Event Group) combined with the search box
  searchText = '';
  filter = new ListFilter<Payment>([
    { id: 'vendor', label: 'Vendor', searchPlaceholder: 'Search vendors', emptyText: 'No vendors', weight: 3,
      keyOf: p => p.vendorId != null ? 'v' + p.vendorId : 'n' + (p.vendorName || ''), labelOf: p => p.vendorName },
    { id: 'category', label: 'Category', searchPlaceholder: 'Search categories', emptyText: 'No categories', weight: 2,
      keyOf: p => p.expenseCategoryId != null ? 'c' + p.expenseCategoryId : 'n' + (p.categoryName || ''), labelOf: p => p.categoryName },
    { id: 'eventGroup', label: 'Event Group', searchPlaceholder: 'Search event groups', emptyText: 'No event groups', weight: 2,
      keyOf: p => p.eventGroupKey != null ? 'g' + p.eventGroupKey : 'n' + (p.eventGroupName || ''), labelOf: p => p.eventGroupName }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.filter.changes.subscribe(() => this.applyFilters());
    this.loadPayments();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/payments');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any) => {
          if (!this.filter.matches(data)) return false;
          const searchStr = (data.voucherNumber + (data.vendorName || '') + (data.categoryName || '') + (data.eventGroupName || '') + (data.eventName || '') + (data.relatedVoucherNumber || '')).toLowerCase();
          return searchStr.indexOf(this.searchText) !== -1;
        };
        this.filter.setData(data || []);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments', err);
        this.snackBar.open('Failed to load payments', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    // The filter string only has to change for MatTableDataSource to re-run the predicate.
    this.dataSource.filter = this.searchText + '\u0000' + this.filter.signature;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '800px',
      data: { mode: 'add' } as PaymentDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.createPayment(result).subscribe({
          next: () => {
            this.snackBar.open('Payment voucher added successfully', 'Close', { duration: 3000 });
            this.loadPayments();
          },
          error: (err) => {
            console.error('Error adding payment', err);
            this.snackBar.open('Failed to add payment voucher', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '800px',
      data: { mode: 'edit', payment } as PaymentDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.updatePayment(payment.paymentId, result).subscribe({
          next: () => {
            this.snackBar.open('Payment voucher updated successfully', 'Close', { duration: 3000 });
            this.loadPayments();
          },
          error: (err) => {
            console.error('Error updating payment', err);
            this.snackBar.open('Failed to update payment voucher', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deletePayment(payment: Payment): void {
    this.confirmDialog.confirm({ title: 'Delete payment voucher', message: `Are you sure you want to delete voucher ${payment.voucherNumber}?`, confirmText: 'Delete' }).subscribe(confirmed => {
      if (!confirmed) { return; }
      this.paymentService.deletePayment(payment.paymentId).subscribe({
        next: () => {
          this.snackBar.open('Payment voucher deleted successfully', 'Close', { duration: 3000 });
          this.loadPayments();
        },
        error: (err) => {
          console.error('Error deleting payment', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete payments';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    });
  }
}
