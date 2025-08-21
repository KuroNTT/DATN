import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherService } from '../../../services/voucher.service';
import { IVoucher } from '../../../../core/models/structureData';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  vouchers: IVoucher[] = [];

  constructor(private voucherService: VoucherService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadVouchers();
  }

loadVouchers() {
  this.voucherService.getUserVouchers().subscribe({
    next: (data: IVoucher[]) => {
      const user = this.authService.getCurrentUser();

      if (!user) {
        this.vouchers = [];
        return;
      }

      // Nếu là admin thì thấy hết
      if (user.role === "admin") {
        this.vouchers = data;
        return;
      }

      let daysSinceVerify = Infinity;
      if (user.email_verify_at) {
        const verifyDate = new Date(user.email_verify_at);
        const now = new Date();

        if (!isNaN(verifyDate.getTime())) {
          daysSinceVerify =
            (now.getTime() - verifyDate.getTime()) / (1000 * 60 * 60 * 24);
        }
      }

      if (daysSinceVerify <= 7) {
        // User mới
        this.vouchers = data.filter(
          (v) => v.code === "TVM_NEW" || v.code === "TVM_FREESHIP"
        );
      } else {
        // User không mới
        this.vouchers = data.filter(
          (v) => v.code === "TVM_SUMMER" || v.code === "TVM_FREE"
        );
      }

      console.log("daysSinceVerify:", daysSinceVerify);
      console.log("Final vouchers:", this.vouchers);
    },
    error: (err) => {
      console.error("Có lỗi khi tải voucher!", err);
    },
  });
}


}
