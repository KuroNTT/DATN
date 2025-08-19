import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { environment } from "../../../../enviroments/environment";

@Component({
  selector: "app-sign-up",
  imports: [CommonModule, FormsModule],
  templateUrl: "./sign-up.component.html",
})
export class SignUpComponent {
  router = inject(Router);
  user = { name: "", email: "", phone: "", password: "", re_password: "" };
  thong_bao: string = "";
  private nameRegex = /^[a-zA-ZÀ-ỹ\s']{3,30}$/;
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  private passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  thong_bao_name: string = "";
  thong_bao_email: string = "";
  thong_bao_phone: string = "";
  thong_bao_password: string = "";
  thong_bao_re_password: string = "";

  invalidName: boolean = false;
  invalidEmail: boolean = false;
  invalidPhone: boolean = false;
  invalidPassword: boolean = false;
  invalidRepassword: boolean = false;

  showPassword = false;
  showConfirm = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  showCofirmPassword() {
    this.showConfirm = !this.showConfirm;
  }
  isValid(): boolean {
    const { name, email, phone, password, re_password } = this.user;

    this.thong_bao_name = "";
    this.thong_bao_email = "";
    this.thong_bao_phone = "";
    this.thong_bao_password = "";
    this.thong_bao_re_password = "";
    //Name
    if (!name.trim()) {
      this.shakeField("name", "Vui lòng nhập tên");
      return false;
    }
    const len = name.length;
    if (len < 3 || len > 30) {
      const msg =
        len < 3
          ? "Vui lòng nhập tên không quá ngắn"
          : "Vui lòng nhập tên không quá dài";
      this.shakeField("name", msg);
      return false;
    }
    if (!this.nameRegex.test(name)) {
      this.shakeField(
        "name",
        "Vui lòng nhập tên chỉ được chứa chữ cái và khoảng trắng"
      );
      return false;
    }
    if (!phone.trim()) {
      this.shakeField("phone", "Vui lòng nhập số điện thoại");
      return false;
    }
    if (!this.phoneRegex.test(phone)) {
      this.shakeField("phone", "Số điện thoại không hợp lệ");
      return false;
    }
    if (!email.trim()) {
      this.shakeField("email", "Vui lòng nhập Email");
      return false;
    }
    if (!this.emailRegex.test(email)) {
      this.shakeField("email", "Email không hợp lệ");
      return false;
    }
    if (!password.trim()) {
      this.shakeField("password", "Vui lòng nhập mật khẩu");
      return false;
    }
    if (!this.passwordRegex.test(password)) {
      this.shakeField(
        "password",
        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số"
      );
      return false;
    }
    if (password !== re_password) {
      this.shakeField("re_password", "Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  }

  shakeField(
    field: "name" | "email" | "phone" | "password" | "re_password",
    message: string
  ): void {
    if (field === "name") {
      this.thong_bao_name = message;
      this.invalidName = false;
      setTimeout(() => (this.invalidName = true), 10);
      setTimeout(() => (this.invalidName = false), 400);
    }
    if (field === "email") {
      this.thong_bao_email = message;
      this.invalidEmail = false;
      setTimeout(() => (this.invalidEmail = true), 10);
      setTimeout(() => (this.invalidEmail = false), 400);
    }
    if (field === "phone") {
    this.thong_bao_phone = message;
    this.invalidPhone = false;
    setTimeout(() => (this.invalidPhone = true), 10);
    setTimeout(() => (this.invalidPhone = false), 400);
  }
    if (field === "password") {
      this.thong_bao_password = message;
      this.invalidPassword = false;
      setTimeout(() => (this.invalidPassword = true), 10);
      setTimeout(() => (this.invalidPassword = false), 400);
    }
    if (field === "re_password") {
      this.thong_bao_re_password = message;
      this.invalidRepassword = false;
      setTimeout(() => (this.invalidRepassword = true), 10);
      setTimeout(() => (this.invalidRepassword = false), 400);
    }
  }

  dangky() {
    if (!this.isValid()) return;
    let opt = {
      method: "post",
      body: JSON.stringify(this.user),
      headers: { "Content-type": "application/json" },
    };
    fetch(`${environment.apiUrl}/auth/sign-up`, opt)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          if (data.field === "email") {
            this.shakeField("email", data.message);
          }
          if (data.field === "name") {
            this.shakeField("name", data.message);
          }
          if (data.field === "phone") {
            this.shakeField("phone", data.message);
          }
          if (data.field === "password") {
            this.shakeField("password", data.message);
          }
          if (data.field === "re_password") {
            this.shakeField("re_password", data.message);
          }
          return;
        }
        this.thong_bao =
          "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.";
      })
      .catch((err) => {
        this.thong_bao = "Có lỗi xảy ra. Vui lòng thử lại sau.";
      });
  }
}
