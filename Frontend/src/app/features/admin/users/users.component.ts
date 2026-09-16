import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, UserDTO } from '../../../core/services/user.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  users: UserDTO[] = [];
  displayedColumns: string[] = ['fullName', 'email', 'loginId', 'isActive', 'actions'];

  constructor(private userService: UserService, private dialog: MatDialog,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }

  editUser(user: UserDTO) {
    // Implement edit dialog
  }

  resetPassword(user: UserDTO) {
    const newPassword = prompt(`Enter new password for ${user.fullName}`);
    if (newPassword) {
      this.userService.resetPassword(user.userId, newPassword).subscribe(() => {
        alert('Password reset successfully');
      });
    }
  }

  deactivateUser(user: UserDTO) {
    if (confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.fullName}?`)) {
      user.isActive = !user.isActive;
      this.userService.updateUser(user.userId, user).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadUsers();
      }
    });
  }
}

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MemberDTO } from '../../../core/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Create New User</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" style="display: flex; flex-direction: column;">
        <mat-form-field appearance="fill">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="fullName" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Login ID</mat-label>
          <input matInput formControlName="loginId" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Link to Member (Optional)</mat-label>
          <mat-select formControlName="memberKey">
            <mat-option [value]="null">-- None --</mat-option>
            <mat-option *ngFor="let member of members" [value]="member.memberKey">
              {{member.memberName}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="isActive">Is Active</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  members: MemberDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      loginId: ['', Validators.required],
      password: ['', Validators.required],
      memberKey: [null],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.userService.getMembers().subscribe(data => {
      this.members = data;
    });
  }

  save() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}

