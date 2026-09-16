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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReceiptEntryService, Receipt } from '../../../core/services/receipt-entry.service';
import { ReceiptDialogComponent, ReceiptDialogData } from './receipt-dialog/receipt-dialog.component';

@Component({
  selector: 'app-receipts',
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
    MatPaginatorModule
  ],
  providers: [ReceiptEntryService],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.css'
})
export class ReceiptsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['receiptNumber', 'receiptBook_Rno', 'receiptDate', 'donorName', 'eventGroupName', 'amount', 'paymentMode', 'actions'];
  dataSource: MatTableDataSource<Receipt> = new MatTableDataSource<Receipt>();

  // KPI Metrics
  totalReceipts: number = 0;
  totalCollection: number = 0;
  thisMonthCollection: number = 0;
  pendingReceipts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private receiptService: ReceiptEntryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadReceipts();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/receipts');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadReceipts(): void {
    this.receiptService.getReceipts().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.calculateKPIs(data);
      },
      error: (err: any) => {
        console.error('Error loading receipts', err);
        this.snackBar.open('Failed to load receipts', 'Close', { duration: 3000 });
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

  calculateKPIs(data: Receipt[]): void {
    this.totalReceipts = data.length;
    this.totalCollection = data.reduce((sum, r) => sum + this.getTotalAmount(r), 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.thisMonthCollection = data
      .filter(r => {
        const d = new Date(r.receiptDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, r) => sum + this.getTotalAmount(r), 0);
      
    // Assuming pending receipts are those without a printed copy, etc. For now we use 0.
    this.pendingReceipts = 0;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ReceiptDialogComponent, {
      width: '800px',
      data: { mode: 'add' } as ReceiptDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.receiptService.createReceipt(result).subscribe({
          next: () => {
            this.snackBar.open('Receipt added successfully', 'Close', { duration: 3000 });
            this.loadReceipts();
          },
          error: (err: any) => {
            console.error('Error adding receipt', err);
            const msg = err.error?.message || 'Failed to add receipt';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(receipt: Receipt): void {
    const dialogRef = this.dialog.open(ReceiptDialogComponent, {
      width: '800px',
      data: { mode: 'edit', receipt } as ReceiptDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.receiptService.updateReceipt(receipt.receiptId, result).subscribe({
          next: () => {
            this.snackBar.open('Receipt updated successfully', 'Close', { duration: 3000 });
            this.loadReceipts();
          },
          error: (err: any) => {
            console.error('Error updating receipt', err);
            const msg = err.error?.message || 'Failed to update receipt';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteReceipt(receipt: Receipt): void {
    if (confirm(`Are you sure you want to delete receipt ${receipt.receiptNumber}?`)) {
      this.receiptService.deleteReceipt(receipt.receiptId).subscribe({
        next: () => {
          this.snackBar.open('Receipt deleted successfully', 'Close', { duration: 3000 });
          this.loadReceipts();
        },
        error: (err: any) => {
          console.error('Error deleting receipt', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete receipts';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  getTotalAmount(receipt: Receipt): number {
    return (receipt.cashAmount || 0) + (receipt.bankAmount || 0);
  }
}
