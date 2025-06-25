import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-verify-email",
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.css"],
})
export class VerifyEmailComponent implements OnInit {
  message: string = "";
  isSuccess = false;
  isError = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (!token) {
      this.message = "Không tìm thấy token";
      this.isError = true;
      return;
    }
    console.log("Đang gửi token:", token);

    this.http
      .post("http://localhost:3000/api/auth/verify-email", { token })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || "Xác thực thành công.";
          this.isSuccess = true;
        },
        error: (err) => {
          this.message =
            err.error?.message || "Token không hợp lệ hoặc đã hết hạn.";
          this.isError = true;
        },
      });
  }
}
