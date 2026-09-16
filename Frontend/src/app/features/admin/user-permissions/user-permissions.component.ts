import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService, Permission, Menu } from '../../../core/services/permission.service';
import { UserService, UserDTO } from '../../../core/services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-permissions',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatSelectModule, MatCheckboxModule, 
    MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  users: UserDTO[] = [];
  selectedUserId: number | null = null;
  permissions: Permission[] = [];
  displayedColumns: string[] = ['menuName', 'canView', 'canAdd', 'canEdit', 'canDelete'];
  menus: Menu[] = [];

  constructor(private userService: UserService,
    private permissionService: PermissionService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => this.users = data);
    this.permissionService.fetchAuthorizedMenus().subscribe(data => this.menus = data);
  }

  onUserChange() {
    if (this.selectedUserId) {
      this.permissionService.getUserPermissions(this.selectedUserId).subscribe(data => {
        this.permissions = data;
        // If some menus are not in permissions, we could add them dynamically here, but SP does it.
      });
    } else {
      this.permissions = [];
    }
  }

  savePermissions() {
    if (this.selectedUserId && this.permissions.length > 0) {
      this.permissionService.updateUserPermissions(this.selectedUserId, this.permissions).subscribe(() => {
        alert('Permissions saved successfully!');
      });
    }
  }
}
