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
import { EventDetailService, EventDetail } from '../../../core/services/event-detail.service';
import { EventDetailDialogComponent, EventDetailDialogData } from './event-detail-dialog/event-detail-dialog.component';

@Component({
  selector: 'app-event-details',
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
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['eventName', 'eventDate', 'category', 'eventGroup', 'language', 'isActive', 'actions'];
  dataSource: MatTableDataSource<EventDetail> = new MatTableDataSource<EventDetail>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private eventDetailService: EventDetailService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEventDetails();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/event-details');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadEventDetails(): void {
    this.isLoading = true;
    this.eventDetailService.getEventDetails().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching event details', error);
        this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(EventDetailDialogComponent, {
      width: '650px',
      data: { mode: 'add' } as EventDetailDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventDetailService.createEventDetail(result).subscribe({
          next: () => {
            this.snackBar.open('Event detail added successfully!', 'Close', { duration: 3000 });
            this.loadEventDetails();
          },
          error: (err) => {
            console.error('Error creating event detail', err);
            let message = 'Failed to add event-details';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(event: EventDetail): void {
    const dialogRef = this.dialog.open(EventDetailDialogComponent, {
      width: '650px',
      data: { mode: 'edit', event: { ...event } } as EventDetailDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventDetailService.updateEventDetail(result.eventKey, result).subscribe({
          next: () => {
            this.snackBar.open('Event detail updated successfully!', 'Close', { duration: 3000 });
            this.loadEventDetails();
          },
          error: (err) => {
            console.error('Error updating event detail', err);
            let message = 'Failed to update event-details';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteEventDetail(id: number): void {
    if (confirm('Are you sure you want to delete this event detail?')) {
      this.eventDetailService.deleteEventDetail(id).subscribe({
        next: () => {
          this.snackBar.open('Event detail deleted successfully!', 'Close', { duration: 3000 });
          this.loadEventDetails();
        },
        error: (err) => {
          console.error('Error deleting event detail', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete event-details';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
