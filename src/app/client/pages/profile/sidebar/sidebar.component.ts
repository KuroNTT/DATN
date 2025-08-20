import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  isAccountMenuOpen = false;
  userName: string = "Người dùng";
  userAvatar: string = "images/default-avatar.jpg";

  ngOnInit() {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.warn("Chưa đăng nhập – sidebar sẽ hiển thị avatar mặc định");
      return;
    }

    fetch(`${environment.apiUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .then((user) => {
        this.userName = user.name || "Người dùng";
        this.userAvatar = user.avatar || "images/default-avatar.jpg";
        sessionStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API lấy thông tin user:", err);
      });
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  logout() {
    sessionStorage.clear();
    window.location.href = "/sign-in";
  }
}
