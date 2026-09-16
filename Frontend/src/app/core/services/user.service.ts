import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
export interface UserDTO extends User {
  loginId: string;
  isActive: boolean;
  password?: string;
  memberKey?: number;
  memberName?: string;
}

export interface MemberDTO {
  memberKey: number;
  memberName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/security/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl);
  }

  getMembers(): Observable<MemberDTO[]> {
    return this.http.get<MemberDTO[]>(`${this.apiUrl}/members`);
  }

  createUser(user: UserDTO): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUser(id: number, user: UserDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  resetPassword(id: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reset-password`, JSON.stringify(newPassword), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
