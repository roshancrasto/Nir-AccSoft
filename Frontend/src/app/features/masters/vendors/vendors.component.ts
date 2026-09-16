import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { VendorService, Vendor } from '../../../core/services/vendor.service';
import { VendorDialogComponent, VendorDialogData } from './vendor-dialog/vendor-dialog.component';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css'
})
export class VendorsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['vendorName', 'contactNumber', 'gstNumber', 'category', 'isActive', 'actions'];
  dataSource: MatTableDataSource<Vendor> = new MatTableDataSource<Vendor>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private vendorService: VendorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadVendors();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/vendors');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadVendors(): void {
    this.isLoading = true;
    this.vendorService.getVendors().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vendors', error);
        this.snackBar.open('Failed to load vendors', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '500px',
      data: { mode: 'add' } as VendorDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vendorService.createVendor(result).subscribe({
          next: () => {
            this.snackBar.open('Vendor added successfully!', 'Close', { duration: 3000 });
            this.loadVendors();
          },
          error: (err) => {
            console.error('Error creating vendor', err);
            let message = 'Failed to add vendors';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(vendor: Vendor): void {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '500px',
      data: { mode: 'edit', vendor: { ...vendor } } as VendorDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vendorService.updateVendor(result.vendorId, result).subscribe({
          next: () => {
            this.snackBar.open('Vendor updated successfully!', 'Close', { duration: 3000 });
            this.loadVendors();
          },
          error: (err) => {
            console.error('Error updating vendor', err);
            let message = 'Failed to update vendors';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteVendor(id: number): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.vendorService.deleteVendor(id).subscribe({
        next: () => {
          this.snackBar.open('Vendor deleted successfully!', 'Close', { duration: 3000 });
          this.loadVendors();
        },
        error: (err) => {
          console.error('Error deleting vendor', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete vendors';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
