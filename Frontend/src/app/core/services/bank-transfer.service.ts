import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankTransfer {
  transferId: number;
  transferNo: string;
  transferDate: string;
  transferType: string;
  fromAccountType: string;
  fromAccountID: number | null;
  toAccountType: string;
  toAccountID: number | null;
  amount: number;
  referenceNumber?: string;
  remarks?: string;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class BankTransferService {
  private apiUrl = environment.apiUrl + '/BankTransfer';

  constructor(private http: HttpClient) { }

  getBankTransfers(): Observable<BankTransfer[]> {
    return this.http.get<BankTransfer[]>(this.apiUrl);
  }

  getBankTransfer(id: number): Observable<BankTransfer> {
    return this.http.get<BankTransfer>(`${this.apiUrl}/${id}`);
  }

  getAccountBalances(): Observable<AccountBalance[]> {
    return this.http.get<AccountBalance[]>(`${this.apiUrl}/Balances`);
  }

  createBankTransfer(transfer: Partial<BankTransfer>): Observable<any> {
    return this.http.post(this.apiUrl, transfer);
  }

  updateBankTransfer(id: number, transfer: BankTransfer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transfer);
  }

  deleteBankTransfer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
