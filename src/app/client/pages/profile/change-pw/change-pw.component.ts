import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-change-pw",
  imports: [CommonModule, FormsModule],
  templateUrl: "./change-pw.component.html",
})
export class ChangePwComponent {
  user = { email: "", pass_old: "", passnew1: "", passnew2: "" };

  thong_bao = "";
  thong_bao_old = "";
  thong_bao_new = "";
  thong_bao_confirm = "";

  invalidOld = false;
  invalidNew = false;
  invalidConfirm = false;

  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    const u = sessionStorage.getItem("user") || "{}";
    this.user.email = JSON.parse(u).email;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isValid(): boolean {
    const { pass_old, passnew1, passnew2 } = this.user;
    this.thong_bao_pass_old = "";
    this.thong_bao_passnew1 = "";
    this.thong_bao_passnew2 = "";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!pass_old.trim()) {
      this.shakeField("pass_old", "Vui lòng nhập mật khẩu hiện tại");
      return false;
    }

    if (!passnew1.trim()) {
      this.shakeField("passnew1", "Vui lòng nhập mật khẩu mới");
      return false;
    }

    if (!passwordRegex.test(passnew1)) {
      this.shakeField(
        "passnew1",
        "Mật khẩu phải có ít nhất 8 ký tự, chữ hoa và số"
      );
      return false;
    }

    if (!passnew2.trim()) {
      this.shakeField("passnew2", "Vui lòng xác nhận mật khẩu mới");
      return false;
    }

    if (passnew1 !== passnew2) {
      this.shakeField("passnew2", "Hai mật khẩu không khớp");
      return false;
    }

    return true;
  }

  thong_bao_pass_old: string = "";
  thong_bao_passnew1: string = "";
  thong_bao_passnew2: string = "";
  invalidPassOld: boolean = false;
  invalidPassNew1: boolean = false;
  invalidPassNew2: boolean = false;
  shakeField(
    field: "pass_old" | "passnew1" | "passnew2",
    message: string
  ): void {
    if (field === "pass_old") {
      this.thong_bao_pass_old = message;
      this.invalidPassOld = false;
      setTimeout(() => (this.invalidPassOld = true), 10);
      setTimeout(() => (this.invalidPassOld = false), 400);
    }
    if (field === "passnew1") {
      this.thong_bao_passnew1 = message;
      this.invalidPassNew1 = false;
      setTimeout(() => (this.invalidPassNew1 = true), 10);
      setTimeout(() => (this.invalidPassNew1 = false), 400);
    }
    if (field === "passnew2") {
      this.thong_bao_passnew2 = message;
      this.invalidPassNew2 = false;
      setTimeout(() => (this.invalidPassNew2 = true), 10);
      setTimeout(() => (this.invalidPassNew2 = false), 400);
    }
  }

  doipass() {
    if (!this.isValid()) return;

    const token = sessionStorage.getItem("token");
    const opt = {
      method: "POST",
      body: JSON.stringify(this.user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`${environment.apiUrl}/user/profile/change-pw`, opt)
      .then((res) => res.json())
      .then((data) => {
        console.log("data =", data);
        if (data.error) {
          if (data.field === "pass_old") {
            this.shakeField("pass_old", data.message);
          } else if (data.field === "passnew1") {
            this.shakeField("passnew1", data.message);
          } else if (data.field === "passnew2") {
            this.shakeField("passnew2", data.message);
          } else {
            this.thong_bao = data.message;
          }
          return;
        }

        this.thong_bao = "Đổi mật khẩu thành công!";
        this.user.pass_old = "";
        this.user.passnew1 = "";
        this.user.passnew2 = "";
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        this.thong_bao = "Đã xảy ra lỗi, vui lòng thử lại.";
      });
  }
}
