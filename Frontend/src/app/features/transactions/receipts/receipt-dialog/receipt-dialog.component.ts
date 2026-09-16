import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DonorService, Donor } from '../../../../core/services/donor.service';
import { EventDetailService, EventDetail } from '../../../../core/services/event-detail.service';
import { EventGroupService, EventGroup } from '../../../../core/services/event-group.service';

export interface ReceiptDialogData {
  mode: 'add' | 'edit';
  receipt?: any;
}

@Component({
  selector: 'app-receipt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './receipt-dialog.component.html',
  styleUrl: './receipt-dialog.component.css'
})
export class ReceiptDialogComponent implements OnInit {
  receiptNumber: string = '';
  receiptDate: Date = new Date();
  receivedDate: Date | null = null;
  donorId: number | null = null;
  eventKey: number | null = null;
  eventGroupKey: number | null = null;
  paymentMode: string = 'Cash';
  cashAmount: number = 0;
  bankAmount: number = 0;
  referenceNumber: string = '';
  panAvailable: boolean = false;
  description: string = '';
  receiptBook_Rno: number | null = null;

  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  allEventDetails: EventDetail[] = [];
  filteredEventDetails: EventDetail[] = [];
  eventGroups: EventGroup[] = [];
  filteredEventGroups: EventGroup[] = [];
  paymentModes: string[] = ['Cash', 'Bank', 'Both'];

  constructor(
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReceiptDialogData,
    private donorService: DonorService,
    private eventDetailService: EventDetailService,
    private eventGroupService: EventGroupService
  ) {
    if (data.mode === 'edit' && data.receipt) {
      this.receiptNumber = data.receipt.receiptNumber;
      this.receiptDate = new Date(data.receipt.receiptDate);
      this.receivedDate = data.receipt.receivedDate ? new Date(data.receipt.receivedDate) : null;
      this.donorId = data.receipt.donorId;
      this.eventKey = data.receipt.eventKey;
      this.eventGroupKey = data.receipt.eventGroupKey;
      this.paymentMode = data.receipt.paymentMode;
      this.cashAmount = data.receipt.cashAmount;
      this.bankAmount = data.receipt.bankAmount;
      this.referenceNumber = data.receipt.referenceNumber;
      this.panAvailable = data.receipt.panAvailable;
      this.description = data.receipt.description;
      this.receiptBook_Rno = data.receipt.receiptBook_Rno;
    }
  }

  ngOnInit(): void {
    this.loadMasters();
  }

  loadMasters(): void {
    this.donorService.getDonors().subscribe((data: Donor[]) => {
      this.donors = data.filter(d => d.isActive);
      this.filteredDonors = [...this.donors];
    });
    this.eventDetailService.getEventDetails().subscribe((data: EventDetail[]) => {
      this.allEventDetails = data.filter(e => e.isActive);
      this.filterEvents();
    });
    this.eventGroupService.getEventGroups().subscribe((data: EventGroup[]) => {
      this.eventGroups = data.filter(e => e.isActive);
      this.filteredEventGroups = [...this.eventGroups];
    });
  }

  onEventGroupChange(value: any): void {
    console.log('Event Group changed to:', value);
    this.eventGroupKey = value;
    this.eventKey = null; // Reset event detail when group changes
    this.filterEvents();
  }

  filterDonors(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.filteredDonors = this.donors.filter(d => 
      d.donorName.toLowerCase().includes(searchText) || 
      (d.mobileNumber && d.mobileNumber.includes(searchText)) ||
      (d.dPlace && d.dPlace.toLowerCase().includes(searchText))
    );
  }

  filterEventGroups(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.filteredEventGroups = this.eventGroups.filter(eg => 
      eg.eventGroupName.toLowerCase().includes(searchText)
    );
  }

  filterEvents(): void {
    if (this.eventGroupKey !== null && this.eventGroupKey !== undefined) {
      const selectedId = Number(this.eventGroupKey);
      this.filteredEventDetails = this.allEventDetails.filter(e => {
        // Check for both camelCase and PascalCase variations
        const itemGroupKey = e.eventGroupKey ?? (e as any).EventGroupKey;
        return Number(itemGroupKey) === selectedId;
      });
    } else {
      this.filteredEventDetails = [];
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
    if (!this.receiptNumber || !this.receiptDate || !this.donorId) return;

    const receiptData = {
      receiptNumber: this.receiptNumber,
      receiptDate: this.formatDate(this.receiptDate),
      receivedDate: this.formatDate(this.receivedDate),
      donorId: this.donorId,
      eventKey: this.eventKey,
      eventGroupKey: this.eventGroupKey,
      paymentMode: this.paymentMode,
      cashAmount: this.cashAmount,
      bankAmount: this.bankAmount,
      referenceNumber: this.referenceNumber,
      panAvailable: this.panAvailable,
      description: this.description,
      receiptBook_Rno: this.receiptBook_Rno
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        receiptId: this.data.receipt.receiptId,
        ...receiptData
      });
    } else {
      this.dialogRef.close(receiptData);
    }
  }
}
