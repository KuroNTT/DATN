import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";
@Component({
  selector: "app-contact",
  imports: [FormsModule, CommonModule],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css",
})
export class ContactComponent {
  loading: boolean = false;
  constructor(private http: HttpClient) {}
  fullName: string = "";
  email: string = "";
  content: string = "";
  onClick() {
    let payload = {
      fullName: this.fullName,
      email: this.email,
      content: this.content,
    };
    this.loading = true;
    this.http.post("http://localhost:3000/api/contact", payload).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: `Gửi thành công`,
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        });
      },
    });
  }
}
