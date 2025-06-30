import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-verify-email",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./verify-email.component.html"
})
export class VerifyEmailComponent implements OnInit {
  message: string = "";
  isSuccess = false;
  isError = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");

    if (!token) {
      this.message = "Không tìm thấy token";
      this.isError = true;
      return;
    }

    // Dùng Fetch API thay vì HttpClient
    fetch("http://localhost:3000/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw data;
        }

        this.message = data.message || "Xác thực thành công.";
        this.isSuccess = true;
      })
      .catch((err) => {
        this.message = err?.message || "Token không hợp lệ hoặc đã hết hạn.";
        this.isError = true;
      });
  }
}
