import {
  Component,
  PLATFORM_ID,
  Inject,
  OnInit
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  showDropdown = false;
  isLoggedIn = false;
  username: string = "";
  userrole: string = "";
  isAdmin: boolean = false;
  isUserDropdownVisible: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

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
        }
      }
    }
  }
showUserDropdown(): void {
    this.isUserDropdownVisible = true;
  }
  hideUserDropdown(): void {
    this.isUserDropdownVisible = false;
  }
  toggleUserDropdown(): void {
    this.isUserDropdownVisible = !this.isUserDropdownVisible;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
