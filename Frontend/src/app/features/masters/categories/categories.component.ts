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
import { CategoryService, Category } from '../../../core/services/category.service';
import { CategoryDialogComponent, CategoryDialogData } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['categoryId', 'categoryName', 'isActive', 'actions'];
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCategories();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/masters/categories');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching categories', error);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '450px',
      data: { mode: 'add' } as CategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.createCategory(result).subscribe({
          next: () => {
            this.snackBar.open('Category added successfully!', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error creating category', err);
            let message = 'Failed to add category';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '450px',
      data: { mode: 'edit', category: { ...category } } as CategoryDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.updateCategory(result.categoryId, result).subscribe({
          next: () => {
            this.snackBar.open('Category updated successfully!', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error updating category', err);
            let message = 'Failed to update category';
            if (err.status === 403) message = 'You do not have the Permission';
            else if (err.status === 409) message = err.error?.message || message;
            this.snackBar.open(message, 'Close', { duration: 4000 });
          }
        });
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully!', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error deleting category', err);
          const message = err.status === 403 ? 'You do not have the Permission' : 'Failed to delete category';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
