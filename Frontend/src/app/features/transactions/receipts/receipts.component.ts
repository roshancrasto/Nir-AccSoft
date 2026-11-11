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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ListFilter } from '../../../shared/list-filter/list-filter';
import { ListFilterComponent } from '../../../shared/list-filter/list-filter.component';
import { FilterChipsComponent } from '../../../shared/list-filter/filter-chips.component';
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
    MatPaginatorModule,
    ListFilterComponent,
    FilterChipsComponent
  ],
  providers: [ReceiptEntryService],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.css'
})
export class ReceiptsComponent implements OnInit {
  private confirmDialog = inject(ConfirmDialogService);

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

  // List filter (multi-select Event Group / Donor) combined with the search box
  searchText = '';
  filter = new ListFilter<Receipt>([
    { id: 'eventGroup', label: 'Event Group', searchPlaceholder: 'Search event groups', emptyText: 'No event groups', weight: 2,
      keyOf: r => r.eventGroupKey != null ? 'g' + r.eventGroupKey : 'n' + (r.eventGroupName || ''), labelOf: r => r.eventGroupName },
    { id: 'donor', label: 'Donor', searchPlaceholder: 'Search donors', emptyText: 'No donors', weight: 3,
      keyOf: r => r.donorId != null ? 'd' + r.donorId : 'n' + (r.donorName || ''), labelOf: r => r.donorName }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private receiptService: ReceiptEntryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.filter.changes.subscribe(() => this.applyFilters());
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
        this.dataSource.filterPredicate = (r, f) => this.matchesFilter(r, f);
        this.filter.setData(data || []);
        this.applyFilters();
        this.calculateKPIs(data);
      },
      error: (err: any) => {
        console.error('Error loading receipts', err);
        this.snackBar.open('Failed to load receipts', 'Close', { duration: 3000 });
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

  private matchesFilter(r: Receipt, _filter: string): boolean {
    if (!this.filter.matches(r)) return false;
    if (!this.searchText) return true;
    // same text match as the table's default search
    const text = Object.values(r).reduce((acc: string, v) => acc + (v ?? '') + ' ', '').toLowerCase();
    return text.includes(this.searchText);
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
    this.confirmDialog.confirm({ title: 'Delete receipt', message: `Are you sure you want to delete receipt ${receipt.receiptNumber}?`, confirmText: 'Delete' }).subscribe(confirmed => {
      if (!confirmed) { return; }
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
    });
  }

  getTotalAmount(receipt: Receipt): number {
    return (receipt.cashAmount || 0) + (receipt.bankAmount || 0);
  }
}
