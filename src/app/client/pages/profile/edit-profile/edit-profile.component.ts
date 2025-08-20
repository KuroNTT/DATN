import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-edit-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-profile.component.html",
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  emailVerified = false;
  originalData: any = {};
  daThayDoi = false;
  avatarPreview: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [""], // không required
      phone: ["", [Validators.pattern(/^\d{10}$/)]], // chỉ kiểm tra pattern nếu nhập
      sex: [""],
      address: [""],
      email: [""],
      avatar: [""],
      email_verify_at: [""],
    });

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    fetch(`${environment.apiUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .then((data) => {
        this.originalData = data;
        this.form.patchValue(data);
        this.emailVerified = !!data.email_verify_at;

        // giữ role trong sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...data, role: currentUser.role };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải thông tin người dùng.");
      });

    this.form.valueChanges.subscribe(() => {
      this.daThayDoi = this.kiemTraThayDoi();
    });
  }

  kiemTraThayDoi(): boolean {
    const current = this.form.getRawValue();
    const goc = this.originalData;
    return (
      current.name !== goc.name ||
      current.phone !== goc.phone ||
      current.sex !== goc.sex ||
      current.address !== goc.address
    );
  }

  chiNhapSo(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.keyCode);
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  capNhat(): void {
    this.form.updateValueAndValidity();

    // nếu phone nhập nhưng không đúng pattern
    if (this.form.get("phone")?.value && this.form.get("phone")?.invalid) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const updatedData = this.form.value;

    fetch(`${environment.apiUrl}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;

        alert("Cập nhật thành công!");
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...data, role: currentUser.role };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((err) => {
        console.error(err);
        alert("Cập nhật thất bại!");
      });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    fetch("https://api.cloudinary.com/v1_1/dptdasr63/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.avatarPreview = data.secure_url;
        this.form.patchValue({ avatar: data.secure_url });
      })
      .catch((err) => {
        console.error("Lỗi upload ảnh:", err);
        alert("Tải ảnh thất bại.");
      });
  }
}
