import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Receipt {
  receiptId: number;
  receiptNumber: string;
  receiptDate: string;
  receivedDate?: string | null;
  donorId: number | null;
  donorName?: string;
  eventKey: number | null;
  eventName?: string;
  eventGroupKey: number | null;
  eventGroupName?: string;
  paymentMode: string;
  cashAmount: number;
  bankAmount: number;
  referenceNumber: string;
  panAvailable: boolean;
  description: string;
  receiptBook_Rno?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptEntryService {
  private apiUrl = environment.apiUrl + '/Receipt';

  constructor(private http: HttpClient) { }

  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiUrl);
  }

  createReceipt(receipt: Partial<Receipt>): Observable<any> {
    return this.http.post(this.apiUrl, receipt);
  }

  updateReceipt(id: number, receipt: Receipt): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, receipt);
  }

  deleteReceipt(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
