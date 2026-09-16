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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GovtGrantService, GovtGrant } from '../../../core/services/govt-grant.service';
import { GovtGrantDialogComponent, GovtGrantDialogData } from './govt-grant-dialog/govt-grant-dialog.component';

@Component({
  selector: 'app-govt-grants',
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
    MatSortModule,
    MatTooltipModule
  ],
  providers: [GovtGrantService],
  templateUrl: './govt-grants.component.html',
  styleUrl: './govt-grants.component.css'
})
export class GovtGrantsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['grantNumber', 'eventGroupName', 'grantDate', 'amount', 'considerForAudit', 'remarks', 'actions'];
  dataSource: MatTableDataSource<GovtGrant> = new MatTableDataSource<GovtGrant>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private govtGrantService: GovtGrantService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadGovtGrants();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/govt-grants');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  loadGovtGrants(): void {
    this.govtGrantService.getGovtGrants().subscribe({
      next: (data: GovtGrant[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.error('Error loading government grants', err);
        this.snackBar.open('Failed to load government grants', 'Close', { duration: 3000 });
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

  openViewDialog(grant: GovtGrant): void {
    this.dialog.open(GovtGrantDialogComponent, {
      width: '700px',
      data: { mode: 'view', grant } as GovtGrantDialogData
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(GovtGrantDialogComponent, {
      width: '700px',
      data: { mode: 'add' } as GovtGrantDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.govtGrantService.createGovtGrant(result).subscribe({
          next: () => {
            this.snackBar.open('Government grant recorded successfully', 'Close', { duration: 3000 });
            this.loadGovtGrants();
          },
          error: (err: any) => {
            console.error('Error recording government grant', err);
            const msg = err.error?.message || 'Failed to record government grant';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(grant: GovtGrant): void {
    const dialogRef = this.dialog.open(GovtGrantDialogComponent, {
      width: '700px',
      data: { mode: 'edit', grant } as GovtGrantDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.govtGrantService.updateGovtGrant(grant.govtGrantId, result).subscribe({
          next: () => {
            this.snackBar.open('Government grant updated successfully', 'Close', { duration: 3000 });
            this.loadGovtGrants();
          },
          error: (err: any) => {
            console.error('Error updating government grant', err);
            const msg = err.error?.message || 'Failed to update government grant';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteGovtGrant(grant: GovtGrant): void {
    if (confirm(`Are you sure you want to delete government grant ${grant.grantNumber}?`)) {
      this.govtGrantService.deleteGovtGrant(grant.govtGrantId).subscribe({
        next: () => {
          this.snackBar.open('Government grant deleted successfully', 'Close', { duration: 3000 });
          this.loadGovtGrants();
        },
        error: (err: any) => {
          console.error('Error deleting government grant', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete govt-grants';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
