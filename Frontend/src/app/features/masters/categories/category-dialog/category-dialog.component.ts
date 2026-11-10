import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

export interface CategoryDialogData {
  mode: 'add' | 'edit';
  category?: {
    categoryId: number;
    categoryName: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <div mat-dialog-title class="dlg-header">
      <span class="dlg-icon"><mat-icon>label</mat-icon></span>
      <div class="dlg-heading">
        <span class="dlg-eyebrow">Masters</span>
        <h2 class="dlg-title">{{ data.mode === 'add' ? 'Add New Category' : 'Edit Category' }}</h2>
      </div>
      <button type="button" class="dlg-close" mat-dialog-close aria-label="Close" title="Close"><mat-icon>close</mat-icon></button>
    </div>
    <mat-dialog-content>
      <form #categoryForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput
                 [(ngModel)]="categoryName"
                 name="categoryName"
                 required
                 maxlength="100"
                 placeholder="Enter category name"
                 #nameField="ngModel">
          <mat-error *ngIf="nameField.hasError('required')">Category name is required</mat-error>
        </mat-form-field>

        <div class="toggle-row" *ngIf="data.mode === 'edit'">
          <mat-slide-toggle [(ngModel)]="isActive" name="isActive" color="primary">
            {{ isActive ? 'Active' : 'Inactive' }}
          </mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="!categoryName.trim()"
              (click)="onSave()">
        <mat-icon>save</mat-icon>
        {{ data.mode === 'add' ? 'Add' : 'Update' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    .toggle-row {
      margin: 8px 0 16px;
    }
    mat-dialog-content {
      min-width: 350px;
    }
  `]
})
export class CategoryDialogComponent {
  categoryName: string = '';
  isActive: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
  ) {
    if (data.mode === 'edit' && data.category) {
      this.categoryName = data.category.categoryName;
      this.isActive = data.category.isActive;
    }
  }

  onSave(): void {
    if (!this.categoryName?.trim()) return;

    if (this.data.mode === 'add') {
      this.dialogRef.close({
        categoryName: this.categoryName.trim()
      });
    } else {
      this.dialogRef.close({
        categoryId: this.data.category!.categoryId,
        categoryName: this.categoryName.trim(),
        isActive: this.isActive
      });
    }
  }
}
