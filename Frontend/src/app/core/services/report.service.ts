import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportItemModel {
  description: string;
  amount?: number;
  isSubItem?: boolean;
}

export interface ReceiptsPaymentsReportModel {
  financialYear: string;
  receipts: ReportItemModel[];
  payments: ReportItemModel[];
  closingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  finalTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = environment.apiUrl + '/Report';

  constructor(private http: HttpClient) { }

  getReceiptRegister(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/receipt-register`, { params });
  }

  getPaymentRegister(filters: { fromDate: string, toDate: string, eventGroupKey?: number, paymentMode?: string, vendorId?: number, expenseCategoryId?: number }): Observable<any[]> {
    let params = new HttpParams()
      .set('fromDate', filters.fromDate)
      .set('toDate', filters.toDate);
      
    if (filters.eventGroupKey) params = params.set('eventGroupKey', filters.eventGroupKey);
    if (filters.paymentMode) params = params.set('paymentMode', filters.paymentMode);
    if (filters.vendorId) params = params.set('vendorId', filters.vendorId);
    if (filters.expenseCategoryId) params = params.set('expenseCategoryId', filters.expenseCategoryId);

    return this.http.get<any[]>(`${this.apiUrl}/payment-register`, { params });
  }

  getCategoryExpense(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/category-expense`, { params });
  }

  getEventGroupPNL(eventGroupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event-group-pnl/${eventGroupId}`);
  }

  getDonorReceipts(donorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donor-receipts/${donorId}`);
  }

  getIncomeExpenditure(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/income-expenditure`, { params });
  }

  getEventExpenses(eventGroupKey: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventexpenses/${eventGroupKey}`);
  }

  getReceiptsPaymentsAccount(financialYear: string): Observable<ReceiptsPaymentsReportModel> {
    return this.http.get<ReceiptsPaymentsReportModel>(`${this.apiUrl}/receiptspayments/${financialYear}`);
  }

    getAccountLedger(accountId: number, fromDate: string, toDate: string): Observable<any> {
      const params = new HttpParams()
        .set('accountId', accountId.toString())
        .set('fromDate', fromDate)
        .set('toDate', toDate);
      return this.http.get<any>(`${this.apiUrl}/accountledger`, { params });
    }
  
    getVoucherReport(filters: { eventGroupKey?: number, financialYear?: string, vendorKey?: number, voucherNo?: string }): Observable<VoucherReportModel[]> {
      let params = new HttpParams();
      if (filters.eventGroupKey) params = params.set('eventGroupKey', filters.eventGroupKey.toString());
      if (filters.financialYear) params = params.set('financialYear', filters.financialYear);
      if (filters.vendorKey) params = params.set('vendorKey', filters.vendorKey.toString());
      if (filters.voucherNo) params = params.set('voucherNo', filters.voucherNo);
      return this.http.get<VoucherReportModel[]>(`${this.apiUrl}/vouchers`, { params });
    }
}

export interface VoucherReportModel {
  voucherNumber: string;
  paymentID: number;
  debitAmount: number;
  voucherType: string;
  paymentMode: string;
  narration: string;
  remarks: string;
  payTo: string;
  accountName: string;
  voucherDate?: Date;
  paymentDate?: Date;
  details: VoucherReportDetailModel[];
}

export interface VoucherReportDetailModel {
  rowNo: number;
  amount: number;
  billNo: string;
  billDate: string;
  party: string;
  isVoucherOnly?: boolean;
  categoryName: string;
  expDesc: string;
  expenseID: string;
  eventGroupName: string;
}
