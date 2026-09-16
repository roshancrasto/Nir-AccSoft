import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { BankTransferService, BankTransfer } from '../../../core/services/bank-transfer.service';
import { BankTransferDialogComponent, BankTransferDialogData } from './bank-transfer-dialog/bank-transfer-dialog.component';

@Component({
  selector: 'app-bank-transfers',
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
    BankTransferDialogComponent
  ],
  templateUrl: './bank-transfers.component.html',
  styleUrl: './bank-transfers.component.css'
})
export class BankTransfersComponent implements OnInit, AfterViewInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['transferNo', 'transferDate', 'transferType', 'fromAccount', 'toAccount', 'amount', 'referenceNumber', 'actions'];
  dataSource: MatTableDataSource<BankTransfer> = new MatTableDataSource<BankTransfer>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bankTransferService: BankTransferService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {
    console.log('BankTransfersComponent constructor');
  }

  ngOnInit(): void {
    console.log('BankTransfersComponent ngOnInit');
    this.loadTransfers();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/bank-transfers');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadTransfers(): void {
    this.isLoading = true;
    this.bankTransferService.getBankTransfers().subscribe({
      next: (data) => {
        console.log('Transfers loaded:', data);
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading transfers', err);
        this.snackBar.open('Failed to load bank transfers', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(BankTransferDialogComponent, {
      width: '600px',
      data: { mode: 'add' } as BankTransferDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bankTransferService.createBankTransfer(result).subscribe({
          next: () => {
            this.snackBar.open('Bank transfer recorded successfully', 'Close', { duration: 3000 });
            this.loadTransfers();
          },
          error: (err) => {
            console.error('Error adding transfer', err);
            this.snackBar.open('Failed to record bank transfer', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditDialog(transfer: BankTransfer): void {
    const dialogRef = this.dialog.open(BankTransferDialogComponent, {
      width: '600px',
      data: { mode: 'edit', transfer } as BankTransferDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bankTransferService.updateBankTransfer(transfer.transferId, result).subscribe({
          next: () => {
            this.snackBar.open('Bank transfer updated successfully', 'Close', { duration: 3000 });
            this.loadTransfers();
          },
          error: (err) => {
            console.error('Error updating transfer', err);
            this.snackBar.open('Failed to update bank transfer', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteTransfer(transfer: BankTransfer): void {
    if (confirm(`Are you sure you want to delete transfer ${transfer.transferNo}?`)) {
      this.bankTransferService.deleteBankTransfer(transfer.transferId).subscribe({
        next: () => {
          this.snackBar.open('Bank transfer deleted successfully', 'Close', { duration: 3000 });
          this.loadTransfers();
        },
        error: (err) => {
          console.error('Error deleting transfer', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete bank-transfers';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
