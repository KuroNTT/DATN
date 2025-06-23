import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { ICategory } from "../../../core/models/structureData";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isMenuOpen = false;
  isShoesMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }

  toggleShoesMenu() {
    this.isShoesMenuOpen = !this.isShoesMenuOpen;
  }

  scrollToSection(id: string) {
    if (this.router.url === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      this.router.navigate(["/"], { fragment: id });
    }
  }

  category_arr: ICategory[] = [];
  filtered_categories: ICategory[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getCategoriesWithoutGender();
    this.checkLoginStatus();
  }

  getAllCategories(): void {
    fetch("http://localhost:3000/api/categories").then((res) => {
      res
        .json()
        .then((data) => (this.category_arr = data as ICategory[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu danh mục!: ", error)
        );
    });
  }

  getCategoriesWithoutGender(): void {
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        this.filtered_categories = (data as ICategory[]).filter(
          (cat) => cat.name !== "Giày nam" && cat.name !== "Giày nữ"
        );
      })
      .catch((error) =>
        console.log("Lỗi khi lọc danh mục không có Giày nam/nữ:", error)
      );
  }

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


  goToAdminDashboard() {
    window.location.href = "/admin";
  }
}
