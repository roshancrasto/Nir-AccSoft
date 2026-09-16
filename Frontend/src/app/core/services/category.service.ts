import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl + '/Category';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(category: Partial<Category>): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
