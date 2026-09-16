import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventGroup {
  eventGroupId: number;
  eventGroupName: string;
  startDate: string;
  endDate: string;
  budgetAmount: number;
  description: string;
  status: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventGroupService {
  private apiUrl = environment.apiUrl + '/EventGroup';

  constructor(private http: HttpClient) { }

  getEventGroups(): Observable<EventGroup[]> {
    return this.http.get<EventGroup[]>(this.apiUrl);
  }

  createEventGroup(eventGroup: Partial<EventGroup>): Observable<any> {
    return this.http.post(this.apiUrl, eventGroup);
  }

  updateEventGroup(id: number, eventGroup: EventGroup): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, eventGroup);
  }

  deleteEventGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
