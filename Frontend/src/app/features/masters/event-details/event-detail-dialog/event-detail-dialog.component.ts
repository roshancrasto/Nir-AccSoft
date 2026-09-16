import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventCategoryService, EventCategory } from '../../../../core/services/event-category.service';
import { EventGroupService, EventGroup } from '../../../../core/services/event-group.service';
import { LanguageMasterService, LanguageMaster } from '../../../../core/services/language-master.service';

export interface EventDetailDialogData {
  mode: 'add' | 'edit';
  event?: {
    eventKey: number;
    eventCategoryKey: number;
    eventGroupKey: number;
    languageKey: number;
    eventName: string;
    eventDate: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-event-detail-dialog',
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './event-detail-dialog.component.html',
  styleUrl: './event-detail-dialog.component.css'
})
export class EventDetailDialogComponent implements OnInit {
  eventCategoryKey: number | null = null;
  eventGroupKey: number | null = null;
  languageKey: number | null = null;
  eventName: string = '';
  eventDate: Date = new Date();
  isActive: boolean = true;

  categories: EventCategory[] = [];
  eventGroups: EventGroup[] = [];
  languages: LanguageMaster[] = [];

  constructor(
    public dialogRef: MatDialogRef<EventDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailDialogData,
    private categoryService: EventCategoryService,
    private eventGroupService: EventGroupService,
    private languageService: LanguageMasterService
  ) {
    if (data.mode === 'edit' && data.event) {
      this.eventCategoryKey = data.event.eventCategoryKey;
      this.eventGroupKey = data.event.eventGroupKey;
      this.languageKey = data.event.languageKey;
      this.eventName = data.event.eventName;
      this.eventDate = new Date(data.event.eventDate);
      this.isActive = data.event.isActive;
    }
  }

  ngOnInit(): void {
    this.loadMasters();
  }

  loadMasters(): void {
    this.categoryService.getEventCategories().subscribe(data => this.categories = data);
    this.eventGroupService.getEventGroups().subscribe(data => this.eventGroups = data);
    this.languageService.getLanguages().subscribe(data => this.languages = data);
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
    if (!this.eventName?.trim() || !this.eventCategoryKey || !this.eventGroupKey || !this.languageKey) return;

    const eventData = {
      eventCategoryKey: this.eventCategoryKey,
      eventGroupKey: this.eventGroupKey,
      languageKey: this.languageKey,
      eventName: this.eventName.trim(),
      eventDate: this.formatDate(this.eventDate),
      isActive: this.isActive
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        eventKey: this.data.event!.eventKey,
        ...eventData
      });
    } else {
      this.dialogRef.close(eventData);
    }
  }
}
