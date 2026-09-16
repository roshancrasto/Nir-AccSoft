import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface LoginAuditReport {
  loginLogId: number;
  userName: string;
  loginDateTime: Date;
  logoutDateTime?: Date;
  durationMinutes: number;
  ipAddress: string;
  browserInfo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = environment.apiUrl + '/security/audit';

  constructor(private http: HttpClient) {}

  getLoginAuditReport(startDate?: string, endDate?: string): Observable<LoginAuditReport[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.http.get<LoginAuditReport[]>(this.apiUrl, { params });
  }
}
