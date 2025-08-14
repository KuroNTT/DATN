import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { IBrand, ICategory } from "../../../core/models/structureData";
import { FormsModule } from "@angular/forms";
import { HostListener } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ProductService } from "../../services/product.service";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private pds: ProductService
  ) {}

  isMenuOpen = false;
  isShoesMenuOpen = false;

  isSearchBarVisible: boolean = false;
  searchQuery: string = "";

  hideHeader = false;
  private lastScrollTop = 0;

  isUserDropdownVisible: boolean = false;
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

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

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible;
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
  brand_arr: IBrand[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getCategoriesWithoutGender();
    this.checkLoginStatus();
    this.getBrands();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search"], {
        queryParams: { q: this.searchQuery },
      });
      this.isSearchBarVisible = false;
      this.searchQuery = "";
    }
  }

  getAllCategories(): void {
    fetch(`${environment.apiUrl}/categories`).then((res) => {
      res
        .json()
        .then((data) => (this.category_arr = data as ICategory[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu danh mục!: ", error)
        );
    });
  }
  getBrands(): void {
    fetch(`${environment.apiUrl}/brands`).then((res) => {
      res
        .json()
        .then((data) => (this.brand_arr = data as IBrand[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu thuong hieu!: ", error)
        );
    });
  }
  getCategoriesWithoutGender(): void {
    fetch(`${environment.apiUrl}/categories`)
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

  goToCategory(categoryId: number | null) {
    if (categoryId) {
      this.pds.setPreselectedCategory(categoryId);
    } else {
      this.pds.clearPreselectedCategory();
    }
    this.router.navigate(["/products"]);
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
      this.isLoggedIn = false;
      this.username = "Khách hàng";
      this.userrole = "customer";
      this.isAdmin = false;
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

  goToAdminDashboard() {
    window.location.href = "/admin";
  }
}
