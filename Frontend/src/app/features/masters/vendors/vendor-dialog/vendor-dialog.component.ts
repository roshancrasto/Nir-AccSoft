import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService, Category } from '../../../../core/services/category.service';

export interface VendorDialogData {
  mode: 'add' | 'edit';
  vendor?: {
    vendorId: number;
    vendorName: string;
    contactNumber: string;
    address: string;
    gstNumber: string;
    panNumber: string;
    categoryId: number;
    categoryName: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-vendor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './vendor-dialog.component.html',
  styleUrl: './vendor-dialog.component.css'
})
export class VendorDialogComponent {
  vendorName: string = '';
  contactNumber: string = '';
  address: string = '';
  gstNumber: string = '';
  panNumber: string = '';
  categoryId: number | null = null;
  isActive: boolean = true;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<VendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VendorDialogData,
    private categoryService: CategoryService
  ) {
    this.loadCategories();
    if (data.mode === 'edit' && data.vendor) {
      this.vendorName = data.vendor.vendorName;
      this.contactNumber = data.vendor.contactNumber;
      this.address = data.vendor.address;
      this.gstNumber = data.vendor.gstNumber;
      this.panNumber = data.vendor.panNumber;
      this.categoryId = data.vendor.categoryId;
      this.isActive = data.vendor.isActive;
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.filter(c => c.isActive);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  onSave(): void {
    if (!this.vendorName?.trim() || !this.categoryId) return;

    const vendorData = {
      vendorName: this.vendorName.trim(),
      contactNumber: this.contactNumber.trim(),
      address: this.address.trim(),
      gstNumber: this.gstNumber.trim().toUpperCase(),
      panNumber: this.panNumber.trim().toUpperCase(),
      categoryId: this.categoryId,
      isActive: this.isActive
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        vendorId: this.data.vendor!.vendorId,
        ...vendorData
      });
    } else {
      this.dialogRef.close(vendorData);
    }
  }
}
