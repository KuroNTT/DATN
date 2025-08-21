import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-user-list',
  templateUrl: './users.component.html',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  p: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || res;
        this.loading = false;
        this.filteredUsers = [...this.users];
      },
      error: () => (this.loading = false),
    });
  }

  deleteUser(id: number) {
    this.userService.softDeleteUser(id).subscribe(() => this.fetchUsers());
  }

  toggleLock(id: number) {
    this.userService.toggleLockUser(id).subscribe(() => this.fetchUsers());
  }

  changeRole(id: number, role: string) {
    this.userService.changeUserRole(id, role).subscribe(() => this.fetchUsers());
  }

 resendVerify(user: any) {
  this.userService.resendVerify(user.email).subscribe({
    next: () => {
      user.verifySent = true; 
      alert(`Đã gửi email xác thực tới ${user.email}`);
    },
    error: (err) => {
      console.error("Lỗi gửi email:", err);
      alert("Gửi email thất bại, vui lòng thử lại.");
    }
  });
}

statusFilter: string = '';
roleFilter: string = '';
filteredUsers: any[] = [];

applyFilters() {
  this.filteredUsers = this.users.filter(u => {
    let matchStatus = true;
    let matchRole = true;
    if (this.statusFilter === 'active') matchStatus = !u.account_lock && !u.deleted_at;
    if (this.statusFilter === 'locked') matchStatus = u.account_lock;
    if (this.statusFilter === 'verified') matchStatus = !!u.email_verify_at;
    if (this.statusFilter === 'unverified') matchStatus = !u.email_verify_at;
    if (this.statusFilter === 'deleted') matchStatus = !!u.deleted_at;
    if (this.roleFilter) matchRole = u.role === this.roleFilter;

    return matchStatus && matchRole;
  });
}

}
