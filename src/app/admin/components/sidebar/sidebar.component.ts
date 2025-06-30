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
    { label: "DASHBOARD", path: "/admin", icon: "fas fa-home" },
    { label: "ĐƠN HÀNG", path: "/admin/orders", icon: "fas fa-receipt" },
    { label: "SẢN PHẨM", path: "/admin/products", icon: "fas fa-box" },
    { label: "DANH MỤC", path: "/admin/categories", icon: "fas fa-list" },
    { label: "BÀI VIẾT", path: "/admin/posts", icon: "fas fa-newspaper" },
    { label: "ĐÁNH GIÁ", path: "/admin/reviews", icon: "fas fa-star" },
    { label: "KHÁCH HÀNG", path: "/admin/users", icon: "fas fa-user" },
  ];
}
