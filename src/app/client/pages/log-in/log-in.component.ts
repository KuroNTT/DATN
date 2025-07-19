import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../../../admin/services/auth.service";

@Component({
  selector: "app-log-in",
  imports: [FormsModule, CommonModule],
  templateUrl: "./log-in.component.html",
})
export class LogInComponent {
  authService = inject(AuthService);
  router = inject(Router);

  user = { email: "", password: "" };
  thong_bao: string = "";
  thong_bao_email: string = "";
  thong_bao_password: string = "";
  invalidEmail: boolean = false;
  invalidPassword: boolean = false;

  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isValid(): boolean {
    const { email, password } = this.user;
    this.thong_bao_email = "";
    this.thong_bao_password = "";

    // Email
    if (!email.trim()) {
      this.shakeField("email", "Vui lòng nhập Email");
      return false;
    }
    if (!this.emailRegex.test(email)) {
      this.shakeField("email", "Email không hợp lệ");
      return false;
    }

    // Password
    if (!password.trim()) {
      this.shakeField("password", "Vui lòng nhập mật khẩu");
      return false;
    }
    return true;
  }
  shakeField(field: "email" | "password", message: string): void {
    if (field === "email") {
      this.thong_bao_email = message;
      this.invalidEmail = false;
      setTimeout(() => (this.invalidEmail = true), 10);
      setTimeout(() => (this.invalidEmail = false), 400);
    }

    if (field === "password") {
      this.thong_bao_password = message;
      this.invalidPassword = false;
      setTimeout(() => (this.invalidPassword = true), 10);
      setTimeout(() => (this.invalidPassword = false), 400);
    }
  }
  dangnhap() {
    if (!this.isValid()) return;
    let opt = {
      method: "post",
      body: JSON.stringify(this.user),
      headers: { "Content-type": "application/json" },
    };
    fetch("http://localhost:3000/api/auth/sign-in", opt)
      .then((res) => res.json())
      .then((data) => {
        console.log("data=", data);
        if (data.error) {
          if (data.field === "email") {
            this.shakeField("email", data.message);
          } else if (data.field === "password") {
            this.shakeField("password", data.message);
          } else {
            this.thong_bao = data.message; // ⚠️ bạn cần có biến thong_bao trong component + HTML
          }
          return;
        }
        let user = data.info;
        let token = data.token;
        let expiresIn = data.expiresIn; //1h

        this.authService.setCurrentUser(user);

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("expiresIn", expiresIn);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      });
  }
}
