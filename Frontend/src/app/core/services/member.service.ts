import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  memberKey: number;
  memberName: string;
  memberCode?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = environment.apiUrl + '/Member';

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  createMember(member: Partial<Member>): Observable<number> {
    return this.http.post<number>(this.apiUrl, member);
  }

  updateMember(id: number, member: Partial<Member>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
