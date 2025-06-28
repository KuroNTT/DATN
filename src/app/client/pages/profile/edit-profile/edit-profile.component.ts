import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  emailVerified: boolean = false;
  originalData: any = {};
  daThayDoi: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

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

    this.http.get('http://localhost:3000/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (data: any) => {

        this.originalData = data;
        this.form.patchValue(data);
        this.emailVerified = !!data.email_verify_at;
      },
      error: (err) => {
        console.error(err);
        alert('Không thể tải thông tin người dùng.');
      }
    });

    // Theo dõi thay đổi form
    this.form.valueChanges.subscribe(() => {
      this.daThayDoi = this.kiemTraThayDoi();
    });
  }

  kiemTraThayDoi(): boolean {
    const current = this.form.getRawValue();
    const goc = this.originalData;

    return current.name !== goc.name ||
           current.phone !== goc.phone ||
           current.sex !== goc.sex ||
           current.address !== goc.address;
  }

  capNhat(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    } 

    const updatedData = this.form.value;

    this.http.put('http://localhost:3000/api/user/me', updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (res: any) => {
        alert('Cập nhật thành công!');
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        sessionStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...updatedData,
        }));
      },
      error: (err) => {
        console.error(err);
        alert('Cập nhật thất bại!');
      }
    });
  }
}
