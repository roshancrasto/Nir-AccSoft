import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventCategory {
  eventCatKey: number;
  eventCatName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventCategoryService {
  private apiUrl = environment.apiUrl + '/EventCategory';

  constructor(private http: HttpClient) { }

  getEventCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(this.apiUrl);
  }

  createEventCategory(category: Partial<EventCategory>): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  updateEventCategory(id: number, category: EventCategory): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  deleteEventCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
