import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
export interface User {
  userId: number;
  fullName: string;
  email: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/security';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public sessionExpired = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(loginId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { loginId, password })
      .pipe(tap(response => {
        if (response && response.token) {
          sessionStorage.setItem('jwtToken', response.token);
          const userObj = {
            userId: response.userId,
            fullName: response.fullName,
            email: response.email,
            roleId: response.roleId
          };
          sessionStorage.setItem('currentUser', JSON.stringify(userObj));
          this.currentUserSubject.next(userObj);
          this.sessionExpired.next(false);
        }
      }));
  }

  logout(expired: boolean = false) {
    if (!expired) {
      this.http.post(`${this.apiUrl}/logout`, 0).pipe(catchError(() => of(null))).subscribe();
    }
    
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    if (expired) {
      this.sessionExpired.next(true);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
