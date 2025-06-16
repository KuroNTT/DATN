import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
@Component({
  selector: 'app-log-in',
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  router = inject(Router);
  user = {email:"", password:""};
  thong_bao:string ="";
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isValid(): boolean{
    const {email, password} = this.user;
    if(!email.trim()) return this.setError("Bạn chưa nhập email");
    if(!this.emailRegex.test(email)) return  this.setError("Email không hợp lệ");
    if(!password.trim()) return this.setError("Bạn chưa nhập mật khẩu");
    return true;
  }
  private setError(msg: string): false {
    this.thong_bao = msg;
    return false;
  }
  dangnhap(){
     if (!this.isValid()) return;
     let opt = {
      method: "post",
      body: JSON.stringify(this.user),
      headers: {'Content-type': 'application/json'}
     }
     fetch("http://localhost:3000/api/dangnhap", opt)
     .then(res => res.json())
     .then(data => {
      console.log("data=",data);
      if(data.thong_bao != undefined) return this.thong_bao = data.thong_bao;
      let expiresIn = data.expiresIn; //1h
      let user = data.info;
      let token = data.token;
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("expiresIn", expiresIn);
      this.thong_bao = "Đăng nhập thành công"
setTimeout(() => {
        this.router.navigate(["/"])
      }, 2000);

      
     })
  }
}
