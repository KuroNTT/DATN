import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  user = { name: "", email: "", password: "", re_password: "" };
  thong_bao: string = "";
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  isValid(): boolean {
    const { name, email, password, re_password } = this.user;

    if (!name.trim()) return this.setError("Bạn chưa nhập tên");
    if (!email.trim()) return this.setError("Bạn chưa nhập email");
    if (!this.emailRegex.test(email)) return this.setError("Email không hợp lệ");
    if (!password) return this.setError("Bạn chưa nhập mật khẩu");
    if (!this.passwordRegex.test(password)) return this.setError("Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số");
    if (password !== re_password) return this.setError("Mật khẩu xác nhận không khớp");

    return true;
  }

  private setError(msg: string): false {
    this.thong_bao = msg;
    return false;
  }

  dangky() {
    if (!this.isValid()) return;
    let opt = {
      method: "post",
      body: JSON.stringify(this.user),
      headers: { 'Content-type': 'application/json' }
    }
    fetch("http://localhost:3000/api/dangky", opt)
      .then(res => res.json())
      .then(data => { this.thong_bao = data.thong_bao })
  }
}
