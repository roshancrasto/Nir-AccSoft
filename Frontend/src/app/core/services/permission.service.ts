import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
export interface Menu {
  menuId: number;
  parentMenuId?: number;
  menuName: string;
  menuRoute: string;
  menuIcon: string;
  displayOrder: number;
  children?: Menu[];
}

export interface Permission {
  permissionId: number;
  userId: number;
  menuId: number;
  menuName: string;
  parentMenuId?: number;
  menuRoute: string;
  menuIcon: string;
  displayOrder: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = environment.apiUrl + '/security';
  private menusSubject = new BehaviorSubject<Menu[]>([]);
  public menus$ = this.menusSubject.asObservable();
  private myPermissionsSubject = new BehaviorSubject<Permission[]>([]);
  public myPermissions$ = this.myPermissionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAuthorizedMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/menus`).pipe(
      tap(menus => this.menusSubject.next(menus))
    );
  }

  fetchMyPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/my-permissions`).pipe(
      tap(permissions => this.myPermissionsSubject.next(permissions))
    );
  }

  // Admin endpoints
  getUserPermissions(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions/${userId}`);
  }

  updateUserPermissions(userId: number, permissions: Permission[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/permissions/${userId}`, permissions);
  }
}
