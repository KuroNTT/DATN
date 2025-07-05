import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  emailVerified: boolean = false;
  originalData: any = {};
  daThayDoi: boolean = false;

  thong_bao_name = '';
  thong_bao_phone = '';
  thong_bao_sex = '';
  thong_bao_address = '';

  constructor(private fb: FormBuilder) {}

  chiNhapSo(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.keyCode);
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  kiemTraLoi(): boolean {
    const v = this.form.value;
    this.thong_bao_name = '';
    this.thong_bao_phone = '';
    this.thong_bao_sex = '';
    this.thong_bao_address = '';
    let coLoi = false;

    if (!v.name.trim()) {
      this.thong_bao_name = 'Họ tên không được để trống';
      coLoi = true;
    }

    if (!v.phone.trim()) {
      this.thong_bao_phone = 'Số điện thoại không được để trống';
      coLoi = true;
    } else if (!/^\d{10}$/.test(v.phone)) {
      this.thong_bao_phone = 'Số điện thoại phải gồm đúng 10 chữ số';
      coLoi = true;
    }

    if (!v.sex) {
      this.thong_bao_sex = 'Vui lòng chọn giới tính';
      coLoi = true;
    }

    if (!v.address.trim() || v.address.trim().length < 10) {
      this.thong_bao_address = 'Địa chỉ phải trên 10 ký tự';
      coLoi = true;
    }

    return coLoi;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,12}$/)]],
      sex: ['', Validators.required],
      address: ['', Validators.required],
      email_verify_at: [''],
    });

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    // Fetch user data
    fetch('http://localhost:3000/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .then((data: any) => {
        this.originalData = data;
        this.form.patchValue(data);
        this.emailVerified = !!data.email_verify_at;
      })
      .catch((err) => {
        console.error(err);
        alert('Không thể tải thông tin người dùng.');
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

  capNhat(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const updatedData = this.form.value;

    fetch('http://localhost:3000/api/user/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        alert('Cập nhật thành công!');
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            ...currentUser,
            ...updatedData,
          })
        );
      })
      .catch((err) => {
        console.error(err);
        alert('Cập nhật thất bại!');
      });
  }
}
