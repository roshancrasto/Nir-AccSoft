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
import { EventGroupService, EventGroup } from '../../../core/services/event-group.service';
import { EventGroupDialogComponent, EventGroupDialogData } from './event-group-dialog/event-group-dialog.component';

@Component({
  selector: 'app-event-groups',
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
  templateUrl: './event-groups.component.html',
  styleUrl: './event-groups.component.css'
})
export class EventGroupsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['eventGroupName', 'dates', 'budgetAmount', 'status', 'isActive', 'actions'];
  dataSource: MatTableDataSource<EventGroup> = new MatTableDataSource<EventGroup>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private eventService: EventGroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEventGroups();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/event-groups');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadEventGroups(): void {
    this.isLoading = true;
    this.eventService.getEventGroups().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching event groups', error);
        this.snackBar.open('Failed to load event groups', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(EventGroupDialogComponent, {
      width: '550px',
      data: { mode: 'add' } as EventGroupDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.createEventGroup(result).subscribe({
          next: () => {
            this.snackBar.open('Event group added successfully!', 'Close', { duration: 3000 });
            this.loadEventGroups();
          },
          error: (err) => {
            console.error('Error creating event group', err);
            let message = 'Failed to add event-groups';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(eventGroup: EventGroup): void {
    const dialogRef = this.dialog.open(EventGroupDialogComponent, {
      width: '550px',
      data: { mode: 'edit', eventGroup: { ...eventGroup } } as EventGroupDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.updateEventGroup(result.eventGroupId, result).subscribe({
          next: () => {
            this.snackBar.open('Event group updated successfully!', 'Close', { duration: 3000 });
            this.loadEventGroups();
          },
          error: (err) => {
            console.error('Error updating event group', err);
            let message = 'Failed to update event-groups';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteEventGroup(id: number): void {
    if (confirm('Are you sure you want to delete this event group?')) {
      this.eventService.deleteEventGroup(id).subscribe({
        next: () => {
          this.snackBar.open('Event group deleted successfully!', 'Close', { duration: 3000 });
          this.loadEventGroups();
        },
        error: (err) => {
          console.error('Error deleting event group', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete event-groups';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'primary';
      case 'Completed': return 'accent';
      case 'Cancelled': return 'warn';
      default: return '';
    }
  }
}
