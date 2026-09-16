import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    MatPaginatorModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['voucherNumber', 'voucherDate', 'paymentDate', 'vendorName', 'categoryName', 'eventGroupName', 'amount', 'paymentMode', 'actions'];
  dataSource: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
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
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const searchStr = (data.voucherNumber + (data.vendorName || '') + (data.categoryName || '') + (data.eventGroupName || '') + (data.eventName || '') + (data.relatedVoucherNumber || '')).toLowerCase();
          return searchStr.indexOf(filter) !== -1;
        };
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
    if (confirm(`Are you sure you want to delete voucher ${payment.voucherNumber}?`)) {
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
    }
  }
}
