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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VendorService, Vendor } from '../../../../core/services/vendor.service';
import { MemberService, Member } from '../../../../core/services/member.service';
import { EventDetailService, EventDetail } from '../../../../core/services/event-detail.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { EventGroupService, EventGroup } from '../../../../core/services/event-group.service';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EventExpenseSelectionDialogComponent } from '../event-expense-selection-dialog/event-expense-selection-dialog.component';
import { PaymentService, PaymentExpenseMapping, PendingEventExpense, RelatedPayment } from '../../../../core/services/payment.service';
import { PaymentExpenseLinkService, PaymentExpenseLink } from '../../../../core/services/payment-expense-link.service';
import { ReimbursementLinkDialogComponent } from '../reimbursement-link-dialog/reimbursement-link-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PaymentDialogData {
  mode: 'add' | 'edit';
  payment?: any;
}

@Component({
  selector: 'app-payment-dialog',
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
    MatSlideToggleModule,
    MatTableModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.css'
})
export class PaymentDialogComponent implements OnInit {
  voucherNumber: string = '';
  voucherDate: Date = new Date();
  paymentDate: Date = new Date();
  vendorId: number | null = null;
  eventKey: number | null = null;
  eventGroupKey: number | null = null;
  expenseCategoryId: number | null = null;
  
  paymentType: string = 'Normal';
  paymentTypes: string[] = ['Normal', 'Re-Imbursement', 'Multiple Payments'];
  memberId: number | null = null;
  selectedExpenseIds: number[] = [];
  pendingLinks: PaymentExpenseLink[] = [];

  paymentMode: string = 'Cash';
  debitAmount: number = 0;
  description: string = '';
  billAvailable: boolean = false;
  isVoucherOnly: boolean = false;
  billNumber: string = '';
  billDate: Date | null = null;
  referenceNumber: string = '';
  attachmentPath: string = '';
  relatedPaymentId: number | null = null;
  selectedRelatedPayment: any = null;
  allPayments: RelatedPayment[] = [];
  filteredPayments: RelatedPayment[] = [];
  eventExpenseMappings: PaymentExpenseMapping[] = [];
  displayedColumns: string[] = ['eventGroupName', 'expenseCode', 'expenseDetails', 'pendingAmount', 'amount', 'actions'];

  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  members: Member[] = [];
  allEventDetails: EventDetail[] = [];
  filteredEventDetails: EventDetail[] = [];
  eventGroups: EventGroup[] = [];
  filteredEventGroups: EventGroup[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  paymentModes: string[] = ['Cash', 'Bank'];

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData,
    private vendorService: VendorService,
    private eventDetailService: EventDetailService,
    private eventGroupService: EventGroupService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private memberService: MemberService,
    private paymentExpenseLinkService: PaymentExpenseLinkService,
    private snackBar: MatSnackBar
  ) {
    if (data.mode === 'edit' && data.payment) {
      this.loadPaymentDetails(data.payment.paymentId);
      this.voucherNumber = data.payment.voucherNumber;
      this.voucherDate = new Date(data.payment.voucherDate);
      this.paymentDate = new Date(data.payment.paymentDate);
      this.vendorId = data.payment.vendorId;
      this.eventKey = data.payment.eventKey;
      this.eventGroupKey = data.payment.eventGroupKey;
      this.expenseCategoryId = data.payment.expenseCategoryId;
      let pType = data.payment.paymentType;
      if (pType === 'Re-Inbursement') pType = 'Re-Imbursement';
      this.paymentType = pType || 'Normal';
      this.memberId = data.payment.memberId || null;
      this.selectedExpenseIds = data.payment.selectedExpenseIds || [];
      this.paymentMode = data.payment.paymentMode;
      this.debitAmount = data.payment.debitAmount;
      this.description = data.payment.description;
      this.billAvailable = data.payment.billAvailable;
      this.isVoucherOnly = data.payment.isVoucherOnly || false;
      this.billNumber = data.payment.billNumber;
      this.billDate = data.payment.billDate ? new Date(data.payment.billDate) : null;
      this.referenceNumber = data.payment.referenceNumber;
      this.attachmentPath = data.payment.attachmentPath;
      this.relatedPaymentId = data.payment.relatedPaymentId;
    }
  }

  loadPaymentDetails(id: number): void {
    this.paymentService.getPayment(id).subscribe(payment => {
      this.voucherNumber = payment.voucherNumber;
      this.voucherDate = new Date(payment.voucherDate);
      this.paymentDate = new Date(payment.paymentDate);
      this.vendorId = payment.vendorId;
      this.eventKey = payment.eventKey;
      this.eventGroupKey = payment.eventGroupKey;
      this.expenseCategoryId = payment.expenseCategoryId;
      let pType = payment.paymentType;
      if (pType === 'Re-Inbursement') pType = 'Re-Imbursement';
      this.paymentType = pType || 'Normal';
      this.memberId = payment.memberId || null;
      this.selectedExpenseIds = payment.selectedExpenseIds || [];
      this.paymentMode = payment.paymentMode;
      this.debitAmount = payment.debitAmount;
      this.description = payment.description;
      this.billAvailable = payment.billAvailable;
      this.isVoucherOnly = payment.isVoucherOnly || false;
      this.billNumber = payment.billNumber;
      this.billDate = payment.billDate ? new Date(payment.billDate) : null;
      this.referenceNumber = payment.referenceNumber;
      this.attachmentPath = payment.attachmentPath;
      this.relatedPaymentId = payment.relatedPaymentId;
      this.eventExpenseMappings = payment.eventExpenseMappings || [];
      this.filterEvents();
      this.loadRelatedPayments();
      if (this.paymentType === 'Re-Imbursement' && this.memberId) {
        this.loadPendingLinks();
      } else if (this.paymentType === 'Multiple Payments') {
        this.loadPendingLinksAll();
      }
    });
  }

  ngOnInit(): void {
    this.loadMasters();
  }

  loadMasters(): void {
    this.vendorService.getVendors().subscribe((data: Vendor[]) => {
      this.vendors = data.filter(v => v.isActive);
      this.filteredVendors = [...this.vendors];
    });
    this.memberService.getMembers().subscribe((data: Member[]) => {
      this.members = data;
    });
    this.eventDetailService.getEventDetails().subscribe((data: EventDetail[]) => {
      this.allEventDetails = data.filter(e => e.isActive);
      this.filterEvents();
    });
    this.eventGroupService.getEventGroups().subscribe((data: EventGroup[]) => {
      this.eventGroups = data.filter(e => e.isActive);
      this.filteredEventGroups = [...this.eventGroups];
    });
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data.filter(c => c.isActive);
      this.filteredCategories = [...this.categories];
    });
  }

  onEventGroupChange(value: any): void {
    this.eventGroupKey = value;
    this.eventKey = null;
    this.filterEvents();
    this.loadRelatedPayments();
  }

  loadRelatedPayments(): void {
    if (!this.eventGroupKey) {
      this.allPayments = [];
      this.filteredPayments = [];
      return;
    }
    const currentPaymentId = this.data.mode === 'edit' ? this.data.payment?.paymentId : null;
    this.paymentService.getRelatedPayments(this.eventGroupKey, currentPaymentId).subscribe(data => {
      this.allPayments = data;
      this.filteredPayments = [...this.allPayments];
      if (this.relatedPaymentId) {
        this.selectedRelatedPayment = this.allPayments.find(p => p.paymentId === this.relatedPaymentId);
      }
    });
  }

  filterVendors(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.filteredVendors = this.vendors.filter(v => 
      v.vendorName.toLowerCase().includes(searchText) || 
      (v.contactNumber && v.contactNumber.includes(searchText))
    );
  }

  filterEventGroups(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.filteredEventGroups = this.eventGroups.filter(eg => 
      eg.eventGroupName.toLowerCase().includes(searchText)
    );
  }

  filterCategories(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.filteredCategories = this.categories.filter(c => 
      c.categoryName.toLowerCase().includes(searchText)
    );
  }

  filterPayments(event: any): void {
    const searchText = typeof event === 'string' ? event.toLowerCase() : (event.target?.value || '').toLowerCase();
    this.filteredPayments = this.allPayments.filter(p => 
      p.voucherNumber.toLowerCase().includes(searchText) || 
      (p.vendorName && p.vendorName.toLowerCase().includes(searchText)) ||
      p.amount.toString().includes(searchText)
    );
  }

  displayPayment(payment: any): string {
    if (!payment) return '';
    // Format: PV-101 | ABC Caterers | ₹10,000 | 12-May-2026
    const datePipe = new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    return `${payment.voucherNumber} | ${payment.vendorName || 'Unknown'} | ₹${payment.amount} | ${datePipe}`;
  }

  onPaymentSelected(event: any): void {
    const payment = event.option.value;
    this.relatedPaymentId = payment.paymentId;
  }

  filterEvents(): void {
    if (this.eventGroupKey !== null && this.eventGroupKey !== undefined) {
      const selectedId = Number(this.eventGroupKey);
      this.filteredEventDetails = this.allEventDetails.filter(e => {
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
    if (!this.voucherNumber || !this.voucherDate || !this.debitAmount) return;

    const paymentData = {
      voucherNumber: this.voucherNumber,
      voucherDate: this.formatDate(this.voucherDate),
      paymentDate: this.formatDate(this.paymentDate),
      vendorId: this.vendorId,
      eventKey: this.eventKey,
      eventGroupKey: this.eventGroupKey,
      expenseCategoryId: this.expenseCategoryId,
      paymentMode: this.paymentMode,
      debitAmount: this.debitAmount,
      description: this.description,
      billAvailable: this.billAvailable,
      isVoucherOnly: this.isVoucherOnly,
      billNumber: this.billNumber,
      billDate: this.formatDate(this.billDate),
      referenceNumber: this.referenceNumber,
      attachmentPath: this.attachmentPath,
      relatedPaymentId: this.relatedPaymentId,
      paymentType: this.paymentType,
      memberId: this.memberId,
      selectedExpenseIds: this.selectedExpenseIds,
      eventExpenseMappings: this.eventExpenseMappings
    };

    if (this.paymentType === 'Re-Imbursement' || this.paymentType === 'Multiple Payments') {
      if (this.paymentType === 'Re-Imbursement' && !this.memberId) {
        this.snackBar.open('Please select a member for reimbursement', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        return;
      }
      const totalAmount = this.pendingLinks
        .filter(l => this.selectedExpenseIds.includes(l.expenseId))
        .reduce((sum, l) => sum + l.amount, 0);
      
      if (totalAmount !== this.debitAmount && this.selectedExpenseIds.length > 0) {
        this.snackBar.open(`Amount mismatch: Selected Expenses (${totalAmount}) must equal Payment Amount (${this.debitAmount})`, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
    } else {
      const totalAllocated = this.getTotalAllocated();
      if (totalAllocated !== this.debitAmount) {
        this.snackBar.open(`Amount mismatch: Total Allocated (${totalAllocated}) must equal Payment Amount (${this.debitAmount})`, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
    }

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        paymentId: this.data.payment.paymentId,
        ...paymentData
      });
    } else {
      this.dialogRef.close(paymentData);
    }
  }

  openSelectionDialog(): void {
    const dialogRef = this.dialog.open(EventExpenseSelectionDialogComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((selectedExpenses: PendingEventExpense[]) => {
      if (selectedExpenses && selectedExpenses.length > 0) {
        selectedExpenses.forEach(expense => {
          // Check if already exists
          const exists = this.eventExpenseMappings.find(m => m.eventExpenseKey === expense.eventExpenseKey);
          if (!exists) {
            this.eventExpenseMappings = [...this.eventExpenseMappings, {
              paymentExpenseMappingKey: 0,
              paymentID: 0,
              eventExpenseKey: expense.eventExpenseKey,
              amount: expense.pendingAmount,
              expenseCode: expense.expenseCode,
              expenseDetails: expense.expenseDetails,
              eventGroupName: expense.eventGroupName,
              pendingAmount: expense.pendingAmount // Temporary field for UI validation
            } as any];
          }
        });
      }
    });
  }

  removeMapping(index: number): void {
    const mappings = [...this.eventExpenseMappings];
    mappings.splice(index, 1);
    this.eventExpenseMappings = mappings;
  }

  getTotalAllocated(): number {
    return this.eventExpenseMappings.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  }

  getBalanceAmount(): number {
    return this.debitAmount - this.getTotalAllocated();
  }

  onPaymentTypeChange(): void {
    if (this.paymentType === 'Normal') {
      this.memberId = null;
      this.selectedExpenseIds = [];
      this.pendingLinks = [];
    } else if (this.paymentType === 'Multiple Payments') {
      this.memberId = null;
      this.selectedExpenseIds = [];
      this.loadPendingLinksAll();
    } else if (this.paymentType === 'Re-Imbursement') {
      this.selectedExpenseIds = [];
      this.pendingLinks = [];
      if (this.memberId) {
        this.loadPendingLinks();
      }
    }
  }

  onMemberChange(): void {
    this.selectedExpenseIds = [];
    if (this.memberId) {
      this.loadPendingLinks();
    } else {
      this.pendingLinks = [];
    }
  }

  loadPendingLinksAll(): void {
    this.paymentExpenseLinkService.getPendingAll().subscribe((data: PaymentExpenseLink[]) => {
      this.pendingLinks = data;
      if (this.data.mode === 'edit' && this.data.payment && this.data.payment.paymentId) {
        this.paymentExpenseLinkService.getAll().subscribe((all: PaymentExpenseLink[]) => {
          const settledForThis = all.filter((l: PaymentExpenseLink) => l.paymentId === this.data.payment.paymentId);
          this.pendingLinks = [...data, ...settledForThis];
        });
      }
    });
  }

  loadPendingLinks(): void {
    if (!this.memberId) return;
    this.paymentExpenseLinkService.getPendingByMember(this.memberId).subscribe((data: PaymentExpenseLink[]) => {
      this.pendingLinks = data;
      // If editing, we also need to fetch the ones currently linked to this payment
      if (this.data.mode === 'edit' && this.data.payment && this.data.payment.paymentId) {
        this.paymentExpenseLinkService.getAll().subscribe((all: PaymentExpenseLink[]) => {
          const settledForThis = all.filter((l: PaymentExpenseLink) => l.paymentId === this.data.payment.paymentId);
          this.pendingLinks = [...data, ...settledForThis];
        });
      }
    });
  }

  toggleExpenseSelection(expenseId: number, checked: boolean): void {
    if (checked) {
      this.selectedExpenseIds.push(expenseId);
    } else {
      this.selectedExpenseIds = this.selectedExpenseIds.filter((id: number) => id !== expenseId);
    }
    this.debitAmount = this.reimbursementTotal;
  }

  get selectedLinks(): PaymentExpenseLink[] {
    return this.pendingLinks.filter(l => this.selectedExpenseIds.includes(l.expenseId));
  }

  get reimbursementTotal(): number {
    return this.selectedLinks.reduce((sum, l) => sum + l.amount, 0);
  }

  openReimbursementLinkDialog(): void {
    if (this.paymentType === 'Re-Imbursement' && !this.memberId) {
      this.snackBar.open('Please select a member first', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ReimbursementLinkDialogComponent, {
      width: '800px',
      data: {
        pendingLinks: this.pendingLinks,
        selectedExpenseIds: [...this.selectedExpenseIds]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedExpenseIds = result;
        this.debitAmount = this.reimbursementTotal;
      }
    });
  }

  removeSelectedLink(expenseId: number): void {
    this.selectedExpenseIds = this.selectedExpenseIds.filter(id => id !== expenseId);
    this.debitAmount = this.reimbursementTotal;
  }
}
