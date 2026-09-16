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
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EventCategoryService, EventCategory } from '../../../core/services/event-category.service';
import { EventCategoryDialogComponent, EventCategoryDialogData } from './event-category-dialog/event-category-dialog.component';

@Component({
  selector: 'app-event-categories',
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
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './event-categories.component.html',
  styleUrl: './event-categories.component.css'
})
export class EventCategoriesComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['eventCatKey', 'eventCatName', 'isActive', 'actions'];
  dataSource: MatTableDataSource<EventCategory> = new MatTableDataSource<EventCategory>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private catService: EventCategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEventCategories();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/event-categories');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadEventCategories(): void {
    this.isLoading = true;
    this.catService.getEventCategories().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching event categories', error);
        this.snackBar.open('Failed to load event categories', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(EventCategoryDialogComponent, {
      width: '450px',
      data: { mode: 'add' } as EventCategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.catService.createEventCategory(result).subscribe({
          next: () => {
            this.snackBar.open('Event category added successfully!', 'Close', { duration: 3000 });
            this.loadEventCategories();
          },
          error: (err) => {
            console.error('Error creating event category', err);
            let message = 'Failed to add event-categories';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(category: EventCategory): void {
    const dialogRef = this.dialog.open(EventCategoryDialogComponent, {
      width: '450px',
      data: { mode: 'edit', category: { ...category } } as EventCategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.catService.updateEventCategory(result.eventCatKey, result).subscribe({
          next: () => {
            this.snackBar.open('Event category updated successfully!', 'Close', { duration: 3000 });
            this.loadEventCategories();
          },
          error: (err) => {
            console.error('Error updating event category', err);
            let message = 'Failed to update event-categories';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteEventCategory(id: number): void {
    if (confirm('Are you sure you want to delete this event category?')) {
      this.catService.deleteEventCategory(id).subscribe({
        next: () => {
          this.snackBar.open('Event category deleted successfully!', 'Close', { duration: 3000 });
          this.loadEventCategories();
        },
        error: (err) => {
          console.error('Error deleting event category', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete event-categories';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
