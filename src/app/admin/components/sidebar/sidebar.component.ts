import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  menu = [
    { label: "Dashboard", path: "/admin", icon: "fas fa-home" },
    { label: "Đơn hàng", path: "/admin/orders", icon: "fas fa-receipt" },
    { label: "Sản phẩm", path: "/admin/products", icon: "fas fa-box" },
    { label: "Danh mục", path: "/admin/categories", icon: "fas fa-list" },
    { label: "Thương hiệu", path: "/admin/brands", icon: "fas fa-copyright" },
    { label: "Bài viết", path: "/admin/blogs", icon: "fas fa-newspaper" },
    {
      label: "Danh mục bài viết",
      path: "/admin/blog-categories",
      icon: "fa-solid fa-rectangle-list",
    },
    { label: "Banner", path: "/admin/banners", icon: "fas fa-image" },
    { label: "Đánh giá", path: "/admin/reviews", icon: "fas fa-star" },
    { label: "Khách hàng", path: "/admin/user", icon: "fas fa-user" },
    { label: "Voucher", path: "/admin/vouchers", icon: "fa-solid fa-ticket" },
  ];
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
