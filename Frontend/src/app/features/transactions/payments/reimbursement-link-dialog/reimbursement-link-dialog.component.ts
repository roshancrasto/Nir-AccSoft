import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

export interface PendingExpenseLink {
  expenseId: number;
  paymentId: number | null;
  amount: number;
  memberId: number;
  eventGroupId: number;
  categoryId: number;
  eventId?: number | null;
  expenseDetails: string;
  isSettled: boolean;
  eventGroupName?: string;
  categoryName?: string;
  memberName?: string;
}

export interface ReimbursementLinkDialogData {
  pendingLinks: PendingExpenseLink[];
  selectedExpenseIds: number[];
}

@Component({
  selector: 'app-reimbursement-link-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './reimbursement-link-dialog.component.html',
  styleUrls: ['./reimbursement-link-dialog.component.css']
})
export class ReimbursementLinkDialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'memberName', 'eventGroupName', 'categoryName', 'expenseDetails', 'amount'];
  pendingLinks: PendingExpenseLink[] = [];
  selectedIds = new Set<number>();

  constructor(
    public dialogRef: MatDialogRef<ReimbursementLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReimbursementLinkDialogData
  ) {
    this.pendingLinks = data.pendingLinks || [];
    this.data.selectedExpenseIds?.forEach(id => this.selectedIds.add(id));
  }

  ngOnInit(): void {}

  toggleSelection(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  isAllSelected(): boolean {
    return this.pendingLinks.length > 0 && this.selectedIds.size === this.pendingLinks.length;
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.pendingLinks.forEach(link => this.selectedIds.add(link.expenseId));
    } else {
      this.selectedIds.clear();
    }
  }

  onSave(): void {
    this.dialogRef.close(Array.from(this.selectedIds));
  }
}
