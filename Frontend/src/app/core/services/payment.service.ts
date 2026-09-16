import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentExpenseMapping {
  paymentExpenseMappingKey: number;
  paymentID: number;
  eventExpenseKey: number;
  amount: number;
  expenseCode?: string;
  expenseDetails?: string;
  eventGroupName?: string;
}

export interface PendingEventExpense {
  eventExpenseKey: number;
  eventGroupName: string;
  expenseCode: string;
  expenseDetails: string;
  totalExpenseAmount: number;
  allocatedAmount: number;
  pendingAmount: number;
}

export interface RelatedPayment {
  paymentId: number;
  voucherNumber: string;
  vendorName?: string;
  amount: number;
  paymentDate: string;
}

export interface Payment {
  paymentId: number;
  voucherNumber: string;
  voucherDate: string;
  paymentDate: string;
  vendorId: number | null;
  vendorName?: string;
  eventKey: number | null;
  eventName?: string;
  eventGroupKey: number | null;
  eventGroupName?: string;
  expenseCategoryId: number | null;
  categoryName?: string;
  paymentMode: string;
  debitAmount: number;
  description: string;
  billAvailable: boolean;
  billNumber: string;
  billDate: string;
  referenceNumber: string;
  attachmentPath: string;
  relatedPaymentId: number | null;
  relatedVoucherNumber?: string;
  relatedVendorName?: string;
  relatedAmount?: number;
  eventExpenseMappings: PaymentExpenseMapping[];
  paymentType?: string;
  memberId?: number | null;
  selectedExpenseIds?: number[];
  isVoucherOnly?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl + '/Payment';

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPendingEventExpenses(): Observable<PendingEventExpense[]> {
    const cb = new Date().getTime();
    return this.http.get<PendingEventExpense[]>(`${this.apiUrl}/eventexpenses/pending?_cb=${cb}`);
  }

  getRelatedPayments(eventGroupKey?: number | null, currentPaymentId?: number | null): Observable<RelatedPayment[]> {
    let url = `${this.apiUrl}/relatedpayments?`;
    const params = [];
    if (eventGroupKey) params.push(`eventGroupKey=${eventGroupKey}`);
    if (currentPaymentId) params.push(`currentPaymentId=${currentPaymentId}`);
    return this.http.get<RelatedPayment[]>(url + params.join('&'));
  }

  createPayment(payment: Partial<Payment>): Observable<any> {
    return this.http.post(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
