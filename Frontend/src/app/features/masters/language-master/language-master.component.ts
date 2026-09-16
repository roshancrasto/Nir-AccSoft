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
import { LanguageMasterService, LanguageMaster } from '../../../core/services/language-master.service';
import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageMasterDialogComponent, LanguageMasterDialogData } from './language-master-dialog/language-master-dialog.component';

@Component({
  selector: 'app-language-master',
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
  templateUrl: './language-master.component.html',
  styleUrl: './language-master.component.css'
})
export class LanguageMasterComponent implements OnInit {
  displayedColumns: string[] = ['langKey', 'langName', 'isActive', 'actions'];
  dataSource: MatTableDataSource<LanguageMaster> = new MatTableDataSource<LanguageMaster>();
  isLoading = false;

  canAdd = false;
  canEdit = false;
  canDelete = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private langService: LanguageMasterService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLanguages();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/languages');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  loadLanguages(): void {
    this.isLoading = true;
    this.langService.getLanguages().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching languages', error);
        this.snackBar.open('Failed to load languages', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(LanguageMasterDialogComponent, {
      width: '450px',
      data: { mode: 'add' } as LanguageMasterDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.langService.createLanguage(result).subscribe({
          next: () => {
            this.snackBar.open('Language added successfully!', 'Close', { duration: 3000 });
            this.loadLanguages();
          },
          error: (err) => {
            console.error('Error creating language', err);
            const message = err.status === 409 ? err.error?.message : 'Failed to add language';
            this.snackBar.open(message || 'Failed to add language', 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(language: LanguageMaster): void {
    const dialogRef = this.dialog.open(LanguageMasterDialogComponent, {
      width: '450px',
      data: { mode: 'edit', language: { ...language } } as LanguageMasterDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.langService.updateLanguage(result.langKey, result).subscribe({
          next: () => {
            this.snackBar.open('Language updated successfully!', 'Close', { duration: 3000 });
            this.loadLanguages();
          },
          error: (err) => {
            console.error('Error updating language', err);
            const message = err.status === 409 ? err.error?.message : 'Failed to update language';
            this.snackBar.open(message || 'Failed to update language', 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteLanguage(id: number): void {
    if (confirm('Are you sure you want to delete this language?')) {
      this.langService.deleteLanguage(id).subscribe({
        next: () => {
          this.snackBar.open('Language deleted successfully!', 'Close', { duration: 3000 });
          this.loadLanguages();
        },
        error: (err) => {
          console.error('Error deleting language', err);
          this.snackBar.open('Failed to delete language', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
