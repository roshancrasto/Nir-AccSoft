import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OpeningBalance {
  openingBalanceId: number;
  financialYear: string;
  balanceType: string;
  bankAccountId: number | null;
  openingAmount: number;
  remarks: string;
  isActive: boolean;
  bankName?: string;
  branch?: string;
}

export interface BankAccountDropdown {
  bankAccountKey: number;
  bankName: string;
  branch: string;
  accountType: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpeningBalanceService {
  private apiUrl = environment.apiUrl + '/OpeningBalance';

  constructor(private http: HttpClient) { }

  getAll(): Observable<OpeningBalance[]> {
    return this.http.get<OpeningBalance[]>(this.apiUrl);
  }

  getById(id: number): Observable<OpeningBalance> {
    return this.http.get<OpeningBalance>(`${this.apiUrl}/${id}`);
  }

  getBankAccounts(): Observable<BankAccountDropdown[]> {
    return this.http.get<BankAccountDropdown[]>(`${this.apiUrl}/bank-accounts`);
  }

  create(data: Partial<OpeningBalance>): Observable<OpeningBalance> {
    return this.http.post<OpeningBalance>(this.apiUrl, data);
  }

  update(id: number, data: Partial<OpeningBalance>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
