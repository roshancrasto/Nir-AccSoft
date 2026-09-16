import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventExpense {
  eventExpenseKey: number;
  eventGroupKey: number;
  expenseCode: string;
  expenseDetails: string;
  expenseDesc: string;
  paymentMode: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  createdDate: Date;
}

export interface EventGroupSummary {
  eventGroupKey: number;
  eventGroupName: string;
  totalExpenseAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalReceipts: number;
  receiptsCreated: number;
  pendingReceipts: number;
}

@Injectable({
  providedIn: 'root'
})
export class InternalAccountService {
  private apiUrl = environment.apiUrl + '/InternalAccounts';

  constructor(private http: HttpClient) { }

  getEventGroupSummary(): Observable<EventGroupSummary[]> {
    return this.http.get<EventGroupSummary[]>(`${this.apiUrl}/eventgroupsummary`);
  }

  getExpensesByEventGroup(eventGroupKey: number): Observable<EventExpense[]> {
    return this.http.get<EventExpense[]>(`${this.apiUrl}/eventexpenses/${eventGroupKey}`);
  }

  getExpenseById(id: number): Observable<EventExpense> {
    return this.http.get<EventExpense>(`${this.apiUrl}/eventexpense/${id}`);
  }

  createExpense(expense: Partial<EventExpense>): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventexpense`, expense);
  }

  updateExpense(id: number, expense: Partial<EventExpense>): Observable<any> {
    return this.http.put(`${this.apiUrl}/eventexpense/${id}`, expense);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventexpense/${id}`);
  }
}
