import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Router } from "@angular/router";
import { inject, OnInit } from "@angular/core";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isShoesMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Close shoes submenu when main menu is closed
    if (this.isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  toggleShoesMenu() {
    this.isShoesMenuOpen = !this.isShoesMenuOpen;
  }


// Dang nhap dropdown - tuong van
 private router = inject(Router);
  showDropdown = false;
  isLoggedIn = false;
  username: string = '';

  userrole : string = '';
  isAdmin: boolean = false;
  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    this.isLoggedIn = !!token && !!user;
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.username = parsedUser?.name || 'Khách hàng';
        this.userrole = parsedUser?.role || 'customer';
        this.isAdmin = this.userrole === 'admin'
      } catch (e) {
        console.error('Lỗi phân tích user từ sessionStorage:', e);
        this.username = 'Khách hàng';
      }
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToSignup() {
    window.location.href = '/sign-up';
  }

  goToLogin() {
    window.location.href = '/sign-in';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    window.location.href = '/sign-in';
  }
  goToAdminDashboard(){
    window.location.href = 'admin';
  }
}
