import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentExpenseLink {
  expenseId: number;
  eventGroupKey: number;
  eventGroupName?: string;
  vendorKey: number;
  vendorName?: string;
  expenseCategoryKey: number;
  categoryName?: string;
  expenseDetails?: string;
  billNo?: string;
  billDate?: string;
  amount: number;
  paidByMemberKey?: number;
  memberName?: string;
  paymentMode?: string;
  relatedPaymentID?: number;
  remarks?: string;
  isSettled: boolean;
  settledDate?: string;
  paymentId?: number;
  isVoucherOnly?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentExpenseLinkService {
  private apiUrl = environment.apiUrl + '/PaymentExpenseLink';

  constructor(private http: HttpClient) { }

  getAll(): Observable<PaymentExpenseLink[]> {
    return this.http.get<PaymentExpenseLink[]>(this.apiUrl);
  }

  getPendingAll(): Observable<PaymentExpenseLink[]> {
    return this.http.get<PaymentExpenseLink[]>(`${this.apiUrl}/pending`);
  }

  getPendingByMember(memberId: number): Observable<PaymentExpenseLink[]> {
    return this.http.get<PaymentExpenseLink[]>(`${this.apiUrl}/pending/${memberId}`);
  }

  getUnlinkedExpenses(eventGroupKey: number, currentExpenseId?: number): Observable<PaymentExpenseLink[]> {
    let params = new HttpParams();
    if (currentExpenseId) {
      params = params.set('currentExpenseId', currentExpenseId.toString());
    }
    return this.http.get<PaymentExpenseLink[]>(`${this.apiUrl}/unlinked/${eventGroupKey}`, { params });
  }

  create(link: Partial<PaymentExpenseLink>): Observable<number> {
    return this.http.post<number>(this.apiUrl, link);
  }

  update(id: number, link: Partial<PaymentExpenseLink>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, link);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
