import { Component, PLATFORM_ID, Inject } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  // Dang nhap dropdown - tuong van
  showDropdown = false;
  isLoggedIn = false;
  username: string = "";

  userrole: string = "";
  isAdmin: boolean = false;

  checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");

      this.isLoggedIn = !!token && !!user;
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          this.username = parsedUser?.name || "Khách hàng";
          this.userrole = parsedUser?.role || "customer";
          this.isAdmin = this.userrole === "admin";
        } catch (e) {
          console.error("Lỗi phân tích user từ sessionStorage:", e);
          this.username = "Khách hàng";
        }
      }
    } else {
      // Đang chạy ở môi trường không phải trình duyệt
      this.isLoggedIn = false;
      this.username = "Khách hàng";
      this.userrole = "customer";
      this.isAdmin = false;
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToSignup() {
    window.location.href = "/sign-up";
  }

  goToLogin() {
    window.location.href = "/sign-in";
  }

  goToProfile() {
    window.location.href = "/profile";
  }

  
  logout() {
    sessionStorage.clear();
    window.location.href = "/sign-in";
  }
    goToHome() {
    window.location.href = "/";
  }
}
