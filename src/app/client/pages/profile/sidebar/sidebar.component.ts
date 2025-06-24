import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isAccountMenuOpen = false;
  userName: string = 'Người dùng';

  constructor() {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        this.userName = userObj.name || 'Người dùng';
      } catch (e) {
        console.error('Lỗi khi parse user từ sessionStorage:', e);
      }
    }
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  logout() {
    sessionStorage.clear();
    window.location.href = "/sign-in";
  }
}
