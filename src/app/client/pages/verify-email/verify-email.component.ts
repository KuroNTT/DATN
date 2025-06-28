import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (!token) {
      this.message = "Không tìm thấy token";
      this.isError = true;
      return;
    }

    this.http
      .post("http://localhost:3000/api/verify-email", { token })
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
