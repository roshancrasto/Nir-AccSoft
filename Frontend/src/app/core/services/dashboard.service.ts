import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecentActivity {
  action: string;
  details: string;
  time: string;
  icon: string;
  color: string;
  activityDate: Date;
}

export interface DashboardSummary {
  cashInHand: number;
  bankBalance: number;
  activeEvents: number;
  recentActivities: RecentActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl + '/Dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}
