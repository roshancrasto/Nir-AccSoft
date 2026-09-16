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
import { BoxCollectionService, BoxCollection } from '../../../core/services/box-collection.service';
import { BoxCollectionDialogComponent, BoxCollectionDialogData } from './box-collection-dialog/box-collection-dialog.component';

@Component({
  selector: 'app-box-collections',
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
  providers: [BoxCollectionService],
  templateUrl: './box-collections.component.html',
  styleUrl: './box-collections.component.css'
})
export class BoxCollectionsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['collectionNumber', 'eventGroupName', 'collectionDate', 'amount', 'considerForAudit', 'remarks', 'actions'];
  dataSource: MatTableDataSource<BoxCollection> = new MatTableDataSource<BoxCollection>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private boxCollectionService: BoxCollectionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadBoxCollections();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/box-collections');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  loadBoxCollections(): void {
    this.boxCollectionService.getBoxCollections().subscribe({
      next: (data: BoxCollection[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.error('Error loading box collections', err);
        this.snackBar.open('Failed to load box collections', 'Close', { duration: 3000 });
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

  openViewDialog(collection: BoxCollection): void {
    this.dialog.open(BoxCollectionDialogComponent, {
      width: '700px',
      data: { mode: 'view', collection } as BoxCollectionDialogData
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(BoxCollectionDialogComponent, {
      width: '700px',
      data: { mode: 'add' } as BoxCollectionDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.boxCollectionService.createBoxCollection(result).subscribe({
          next: () => {
            this.snackBar.open('Box collection recorded successfully', 'Close', { duration: 3000 });
            this.loadBoxCollections();
          },
          error: (err: any) => {
            console.error('Error recording box collection', err);
            const msg = err.error?.message || 'Failed to record box collection';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(collection: BoxCollection): void {
    const dialogRef = this.dialog.open(BoxCollectionDialogComponent, {
      width: '700px',
      data: { mode: 'edit', collection } as BoxCollectionDialogData
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.boxCollectionService.updateBoxCollection(collection.boxCollectionId, result).subscribe({
          next: () => {
            this.snackBar.open('Box collection updated successfully', 'Close', { duration: 3000 });
            this.loadBoxCollections();
          },
          error: (err: any) => {
            console.error('Error updating box collection', err);
            const msg = err.error?.message || 'Failed to update box collection';
            this.snackBar.open(msg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteBoxCollection(collection: BoxCollection): void {
    if (confirm(`Are you sure you want to delete box collection ${collection.collectionNumber}?`)) {
      this.boxCollectionService.deleteBoxCollection(collection.boxCollectionId).subscribe({
        next: () => {
          this.snackBar.open('Box collection deleted successfully', 'Close', { duration: 3000 });
          this.loadBoxCollections();
        },
        error: (err: any) => {
          console.error('Error deleting box collection', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete box-collections';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
