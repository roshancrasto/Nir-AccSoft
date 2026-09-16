import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface EventCategoryDialogData {
  mode: 'add' | 'edit';
  category?: {
    eventCatKey: number;
    eventCatName: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-event-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './event-category-dialog.component.html',
  styleUrl: './event-category-dialog.component.css'
})
export class EventCategoryDialogComponent {
  eventCatName: string = '';
  isActive: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<EventCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventCategoryDialogData
  ) {
    if (data.mode === 'edit' && data.category) {
      this.eventCatName = data.category.eventCatName;
      this.isActive = data.category.isActive;
    }
  }

  onSave(): void {
    if (!this.eventCatName?.trim()) return;

    const categoryData = {
      eventCatName: this.eventCatName.trim(),
      isActive: this.isActive
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        eventCatKey: this.data.category!.eventCatKey,
        ...categoryData
      });
    } else {
      this.dialogRef.close(categoryData);
    }
  }
}
