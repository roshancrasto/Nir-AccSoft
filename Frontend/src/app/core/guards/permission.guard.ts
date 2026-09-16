import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService, 
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.roleId === 1) { // Admin bypass
      return true;
    }

    // A simple implementation: assume menus are loaded or we fetch them to check route
    return this.permissionService.menus$.pipe(map(menus => {
      // Flatten menus, but only check leaf nodes (menus without children) or menus that match exactly
      let leafMenus: any[] = [];
      menus.forEach(m => {
        if (!m.children || m.children.length === 0) {
          leafMenus.push(m);
        } else {
          leafMenus = [...leafMenus, ...m.children];
        }
      });

      const routePath = '/' + route.routeConfig?.path;
      // Exact or starts-with match for leaf nodes only
      const hasAccess = leafMenus.some(m => m.menuRoute && (state.url === m.menuRoute || state.url.startsWith(m.menuRoute + '/')));

      if (!hasAccess) {
        this.router.navigate(['/dashboard']);
      }
      return hasAccess;
    }));
  }
}
