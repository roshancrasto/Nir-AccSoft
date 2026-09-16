import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

export interface EventGroupDialogData {
  mode: 'add' | 'edit';
  eventGroup?: {
    eventGroupId: number;
    eventGroupName: string;
    startDate: string;
    endDate: string;
    budgetAmount: number;
    description: string;
    status: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-event-group-dialog',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './event-group-dialog.component.html',
  styleUrl: './event-group-dialog.component.css'
})
export class EventGroupDialogComponent {
  eventGroupName: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  budgetAmount: number = 0;
  description: string = '';
  status: string = 'Planned';
  isActive: boolean = true;

  statuses: string[] = ['Planned', 'Active', 'Completed', 'Cancelled'];

  constructor(
    public dialogRef: MatDialogRef<EventGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventGroupDialogData
  ) {
    if (data.mode === 'edit' && data.eventGroup) {
      this.eventGroupName = data.eventGroup.eventGroupName;
      this.startDate = data.eventGroup.startDate ? new Date(data.eventGroup.startDate) : new Date();
      this.endDate = data.eventGroup.endDate ? new Date(data.eventGroup.endDate) : new Date();
      this.budgetAmount = data.eventGroup.budgetAmount;
      this.description = data.eventGroup.description;
      this.status = data.eventGroup.status;
      this.isActive = data.eventGroup.isActive;
    }
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSave(): void {
    if (!this.eventGroupName?.trim()) return;

    const eventGroupData = {
      eventGroupName: this.eventGroupName.trim(),
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
      budgetAmount: this.budgetAmount,
      description: this.description.trim(),
      status: this.status,
      isActive: this.isActive
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        eventGroupId: this.data.eventGroup!.eventGroupId,
        ...eventGroupData
      });
    } else {
      this.dialogRef.close(eventGroupData);
    }
  }
}
