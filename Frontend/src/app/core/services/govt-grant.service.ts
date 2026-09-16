import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GovtGrant {
  govtGrantId: number;
  grantNumber: string;
  eventGroupKey: number;
  eventGroupName?: string;
  grantDate: string;
  amount: number;
  considerForAudit: boolean;
  remarks?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GovtGrantService {
  private apiUrl = environment.apiUrl + '/GovtGrant';

  constructor(private http: HttpClient) { }

  getGovtGrants(): Observable<GovtGrant[]> {
    return this.http.get<GovtGrant[]>(this.apiUrl);
  }

  getGovtGrantById(id: number): Observable<GovtGrant> {
    return this.http.get<GovtGrant>(`${this.apiUrl}/${id}`);
  }

  createGovtGrant(grant: Partial<GovtGrant>): Observable<any> {
    return this.http.post(this.apiUrl, grant);
  }

  updateGovtGrant(id: number, grant: Partial<GovtGrant>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, grant);
  }

  deleteGovtGrant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
