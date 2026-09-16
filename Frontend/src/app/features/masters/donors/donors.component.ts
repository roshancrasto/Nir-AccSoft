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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DonorService, Donor } from '../../../core/services/donor.service';
import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { DonorDialogComponent, DonorDialogData } from './donor-dialog/donor-dialog.component';

@Component({
  selector: 'app-donors',
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
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './donors.component.html',
  styleUrl: './donors.component.css'
})
export class DonorsComponent implements OnInit {
  displayedColumns: string[] = ['donorName', 'mobileNumber', 'dPlace', 'dCity', 'dState', 'isUdyavarParish', 'isActive', 'actions'];
  dataSource: MatTableDataSource<Donor> = new MatTableDataSource<Donor>();
  canAdd = false;
  canEdit = false;
  canDelete = false;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private donorService: DonorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDonors();
    
    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/donors');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  loadDonors(): void {
    this.isLoading = true;
    this.donorService.getDonors().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        
        // Custom filter for searching across multiple fields
        this.dataSource.filterPredicate = (data: Donor, filter: string) => {
          const searchStr = (
            (data.donorName || '') + 
            (data.dPlace || '') + 
            (data.dCity || '') + 
            (data.mobileNumber || '')
          ).toLowerCase();
          return searchStr.indexOf(filter.toLowerCase()) !== -1;
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching donors', error);
        this.snackBar.open('Failed to load donors', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(DonorDialogComponent, {
      width: '500px',
      data: { mode: 'add' } as DonorDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donorService.createDonor(result).subscribe({
          next: () => {
            this.snackBar.open('Donor added successfully!', 'Close', { duration: 3000 });
            this.loadDonors();
          },
          error: (err) => {
            console.error('Error creating donor', err);
            const message = err.status === 409 ? err.error?.message : 'Failed to add donor';
            this.snackBar.open(message || 'Failed to add donor', 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(donor: Donor): void {
    const dialogRef = this.dialog.open(DonorDialogComponent, {
      width: '500px',
      data: { mode: 'edit', donor: { ...donor } } as DonorDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donorService.updateDonor(result.donorId, result).subscribe({
          next: () => {
            this.snackBar.open('Donor updated successfully!', 'Close', { duration: 3000 });
            this.loadDonors();
          },
          error: (err) => {
            console.error('Error updating donor', err);
            const message = err.status === 409 ? err.error?.message : 'Failed to update donor';
            this.snackBar.open(message || 'Failed to update donor', 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteDonor(id: number): void {
    if (confirm('Are you sure you want to delete this donor?')) {
      this.donorService.deleteDonor(id).subscribe({
        next: () => {
          this.snackBar.open('Donor deleted successfully!', 'Close', { duration: 3000 });
          this.loadDonors();
        },
        error: (err) => {
          console.error('Error deleting donor', err);
          this.snackBar.open('Failed to delete donor', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
