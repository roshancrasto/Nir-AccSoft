import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LanguageMaster {
  langKey: number;
  langName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageMasterService {
  private apiUrl = environment.apiUrl + '/LanguageMaster';

  constructor(private http: HttpClient) { }

  getLanguages(): Observable<LanguageMaster[]> {
    return this.http.get<LanguageMaster[]>(this.apiUrl);
  }

  createLanguage(language: Partial<LanguageMaster>): Observable<any> {
    return this.http.post(this.apiUrl, language);
  }

  updateLanguage(id: number, language: LanguageMaster): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, language);
  }

  deleteLanguage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
