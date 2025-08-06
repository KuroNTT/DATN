import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { inject } from "@angular/core";
import { environment } from "../../../../enviroments/environment";

@Component({
  selector: "app-reset-pw",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reset-pw.component.html",
})
export class ResetPasswordComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  newPassword = "";
  confirmPassword = "";
  thong_bao = "";
  thong_bao_new = "";
  thong_bao_confirm = "";

  invalidNew = false;
  invalidConfirm = false;

  showPassword = false;
  showConfirm = false;

  token = "";
  passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"] || "";
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirm = !this.showConfirm;
  }

  submit() {
    // Reset thông báo
    this.thong_bao = "";
    this.thong_bao_new = "";
    this.thong_bao_confirm = "";

    // Validate từng trường
    if (!this.newPassword.trim()) {
      this.shakeField("new", "Vui lòng nhập mật khẩu mới");
      return;
    }

    if (!this.passwordRegex.test(this.newPassword)) {
      this.shakeField("new", "Mật khẩu cần ít nhất 8 ký tự, 1 chữ hoa và 1 số");
      return;
    }

    if (!this.confirmPassword.trim()) {
      this.shakeField("confirm", "Vui lòng nhập xác nhận mật khẩu");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.shakeField("confirm", "Xác nhận mật khẩu không khớp");
      return;
    }

    // Gửi lên server
    const body = {
      token: this.token,
      new_password: this.newPassword,
    };

    fetch(`${environment.apiUrl}/auth/reset-pw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.error) {
          this.thong_bao = data.message || "Có lỗi xảy ra";
          return;
        }
        this.thong_bao = "Đổi mật khẩu thành công. Đang chuyển hướng...";
        setTimeout(() => this.router.navigate(["/sign-in"]), 2000);
      })
      .catch(() => {
        this.thong_bao = "Lỗi kết nối. Vui lòng thử lại";
      });
  }

  shakeField(field: "new" | "confirm", message: string) {
    if (field === "new") {
      this.thong_bao_new = message;
      this.invalidNew = false;
      setTimeout(() => (this.invalidNew = true), 10);
      setTimeout(() => (this.invalidNew = false), 400);
    }

    if (field === "confirm") {
      this.thong_bao_confirm = message;
      this.invalidConfirm = false;
      setTimeout(() => (this.invalidConfirm = true), 10);
      setTimeout(() => (this.invalidConfirm = false), 400);
    }
  }
}
