import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-forgot-pw",
  imports: [CommonModule, FormsModule],
  templateUrl: "./forgot-pw.component.html",
})
export class ForgotPasswordComponent {
  email = "";
  thong_bao = "";
  thong_bao_email = "";
  isError = false;
  invalidEmail = false;

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  submit() {
    this.thong_bao = "";
    this.thong_bao_email = "";

    if (!this.email.trim()) {
      this.shakeEmail("Vui lòng nhập email");
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      this.shakeEmail("Email không hợp lệ");
      return;
    }

    fetch(`${environment.apiUrl}/auth/forgot-pw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.thong_bao = data.message || "Email không tồn tại";
          this.isError = true;
        } else {
          this.thong_bao = "Hãy kiểm tra email để đặt lại mật khẩu";
          this.isError = false;
        }
      })
      .catch(() => {
        this.thong_bao = "Lỗi kết nối. Vui lòng thử lại.";
        this.isError = true;
      });
  }

  shakeEmail(message: string) {
    this.thong_bao_email = message;
    this.invalidEmail = false;
    setTimeout(() => (this.invalidEmail = true), 10);
    setTimeout(() => (this.invalidEmail = false), 400);
  }
}
