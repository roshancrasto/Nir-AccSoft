import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from './core/services/auth.service';
import { PermissionService, Menu } from './core/services/permission.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DemoProject';
  currentUser: User | null = null;
  menus: Menu[] = [];

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.permissionService.fetchAuthorizedMenus().subscribe(menus => {
          this.menus = menus;
        });
        this.permissionService.fetchMyPermissions().subscribe();
      } else {
        this.menus = [];
      }
    });
  }

  /** Display-only: initials for the avatar chip in the top bar. */
  get userInitials(): string {
    const name = (this.currentUser?.fullName || '').trim();
    if (!name) { return 'U'; }
    const parts = name.split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  /** Display-only: highlight a top-level menu when one of its child routes is open. */
  isParentActive(parent: Menu): boolean {
    const url = this.router.url.split('?')[0];
    return (parent.children || []).some(c => {
      const route = (c.menuRoute || '').replace(/^\/?/, '/');
      return route.length > 1 && (url === route || url.startsWith(route + '/'));
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
