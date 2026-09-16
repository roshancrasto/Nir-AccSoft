import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MemberService, Member } from '../../../core/services/member.service';
import { EventGroupService, EventGroup } from '../../../core/services/event-group.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { VendorService, Vendor } from '../../../core/services/vendor.service';

import { PaymentExpenseLinkService, PaymentExpenseLink } from '../../../core/services/payment-expense-link.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface ReimbursementDialogData {
  mode: 'add' | 'edit';
  link?: any;
}

@Component({
  selector: 'app-reimbursement-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, MatIconModule, MatCheckboxModule
  ],
  templateUrl: './reimbursement-dialog.component.html',
  styleUrls: ['./reimbursement-dialog.component.css']
})
export class ReimbursementDialogComponent implements OnInit {
  expenseId: number = 0;
  eventGroupKey: number | null = null;
  vendorKey: number | null = null;
  expenseCategoryKey: number | null = null;
  expenseDetails: string = '';
  billNo: string = '';
  billDate: Date | null = null;
  amount: number = 0;
  paidByMemberKey: number | null = null;
  paymentMode: string = 'Cash';
  relatedPaymentID: number | null = null;
  remarks: string = '';
  isVoucherOnly: boolean = false;

  members: Member[] = [];
  eventGroups: EventGroup[] = [];
  categories: Category[] = [];
  vendors: Vendor[] = [];
  paymentModes: string[] = ['Cash', 'Bank'];
  
  allPayments: PaymentExpenseLink[] = [];
  filteredPayments: PaymentExpenseLink[] = [];
  selectedRelatedPayment: any = null;

  constructor(
    public dialogRef: MatDialogRef<ReimbursementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReimbursementDialogData,
    private memberService: MemberService,
    private eventGroupService: EventGroupService,
    private categoryService: CategoryService,
    private vendorService: VendorService,
    private paymentExpenseLinkService: PaymentExpenseLinkService
  ) {
    if (data.mode === 'edit' && data.link) {
      this.expenseId = data.link.expenseId;
      this.eventGroupKey = data.link.eventGroupKey;
      this.vendorKey = data.link.vendorKey;
      this.expenseCategoryKey = data.link.expenseCategoryKey;
      this.expenseDetails = data.link.expenseDetails;
      this.billNo = data.link.billNo;
      this.billDate = data.link.billDate ? new Date(data.link.billDate) : null;
      this.amount = data.link.amount;
      this.paidByMemberKey = data.link.paidByMemberKey;
      this.paymentMode = data.link.paymentMode || 'Cash';
      this.relatedPaymentID = data.link.relatedPaymentID;
      this.remarks = data.link.remarks;
      this.isVoucherOnly = data.link.isVoucherOnly || false;
    }
  }

  ngOnInit(): void {
    this.memberService.getMembers().subscribe((data: Member[]) => this.members = data);
    this.eventGroupService.getEventGroups().subscribe((data: EventGroup[]) => this.eventGroups = data.filter((e: EventGroup) => e.isActive));
    this.categoryService.getCategories().subscribe((data: Category[]) => this.categories = data.filter((c: Category) => c.isActive));
    this.vendorService.getVendors().subscribe((data: Vendor[]) => this.vendors = data.filter((v: Vendor) => v.isActive));
    if (this.eventGroupKey) {
      this.loadRelatedPayments();
    }
  }

  onEventGroupChange(value: any): void {
    this.eventGroupKey = value;
    this.loadRelatedPayments();
  }

  loadRelatedPayments(): void {
    if (!this.eventGroupKey) {
      this.allPayments = [];
      this.filteredPayments = [];
      return;
    }
    this.paymentExpenseLinkService.getUnlinkedExpenses(this.eventGroupKey, this.expenseId > 0 ? this.expenseId : undefined).subscribe(data => {
      this.allPayments = data.filter(p => p.categoryName !== 'Bank Charges' && p.paymentMode !== 'Cash');
      this.filteredPayments = [...this.allPayments];
      if (this.relatedPaymentID) {
        this.selectedRelatedPayment = this.allPayments.find(p => p.expenseId === this.relatedPaymentID);
      }
    });
  }

  filterPayments(event: any): void {
    const searchText = typeof event === 'string' ? event.toLowerCase() : (event.target?.value || '').toLowerCase();
    this.filteredPayments = this.allPayments.filter(p => 
      (p.expenseDetails && p.expenseDetails.toLowerCase().includes(searchText)) || 
      (p.vendorName && p.vendorName.toLowerCase().includes(searchText)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(searchText)) ||
      p.amount.toString().includes(searchText)
    );
  }

  displayPayment(payment: any): string {
    if (!payment) return '';
    return `${payment.categoryName || 'Unknown'} | ${payment.expenseDetails || 'No details'} | ₹${payment.amount}`;
  }

  onPaymentSelected(event: any): void {
    const payment = event.option.value;
    this.relatedPaymentID = payment.expenseId;
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
    if (!this.eventGroupKey || !this.expenseCategoryKey || !this.amount) return;

    this.dialogRef.close({
      expenseId: this.expenseId,
      eventGroupKey: this.eventGroupKey,
      vendorKey: this.vendorKey || 0,
      expenseCategoryKey: this.expenseCategoryKey,
      expenseDetails: this.expenseDetails,
      billNo: this.billNo,
      billDate: this.formatDate(this.billDate),
      amount: this.amount,
      paidByMemberKey: this.paidByMemberKey,
      paymentMode: this.paymentMode,
      relatedPaymentID: this.relatedPaymentID,
      remarks: this.remarks,
      isVoucherOnly: this.isVoucherOnly
    });
  }
}
