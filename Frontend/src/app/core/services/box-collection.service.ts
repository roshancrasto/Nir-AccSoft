import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BoxCollection {
  boxCollectionId: number;
  collectionNumber: string;
  eventGroupKey: number;
  eventGroupName?: string;
  collectionDate: string;
  amount: number;
  considerForAudit: boolean;
  remarks?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoxCollectionService {
  private apiUrl = environment.apiUrl + '/BoxCollection';

  constructor(private http: HttpClient) { }

  getBoxCollections(): Observable<BoxCollection[]> {
    return this.http.get<BoxCollection[]>(this.apiUrl);
  }

  getBoxCollectionById(id: number): Observable<BoxCollection> {
    return this.http.get<BoxCollection>(`${this.apiUrl}/${id}`);
  }

  createBoxCollection(collection: Partial<BoxCollection>): Observable<any> {
    return this.http.post(this.apiUrl, collection);
  }

  updateBoxCollection(id: number, collection: Partial<BoxCollection>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, collection);
  }

  deleteBoxCollection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
