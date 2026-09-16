import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDetail {
  eventKey: number;
  eventCategoryKey: number;
  eventCategoryName?: string;
  eventGroupKey: number;
  eventGroupName?: string;
  languageKey: number;
  languageName?: string;
  eventName: string;
  eventDate: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {
  private apiUrl = environment.apiUrl + '/EventDetail';

  constructor(private http: HttpClient) { }

  getEventDetails(): Observable<EventDetail[]> {
    return this.http.get<EventDetail[]>(this.apiUrl);
  }

  createEventDetail(event: Partial<EventDetail>): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  updateEventDetail(id: number, event: EventDetail): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, event);
  }

  deleteEventDetail(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
