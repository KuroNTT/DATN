import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Voucher } from "./voucher.model";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { VoucherDialogComponent } from "./components/voucher-dialog/voucher-dialog.component";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { VoucherService } from "../../services/voucher.service";
import Swal from "sweetalert2";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-voucher",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
  ],
  templateUrl: "./voucher.component.html",
  styleUrl: "./voucher.component.css",
})
export class VoucherComponent {
  idVoucher!: number;
  displayedColumns: string[] = [
    "id",
    "code",
    "description",
    "discount_type",
    "discount_value",
    "min_order_value",
    "quantity",
    "start_date",
    "end_date",
    "is_active",
    "actions",
  ];
  dataSource = new MatTableDataSource<Voucher>([]);

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private voucherService: VoucherService
  ) {}

  ngOnInit(): void {
    this.fetchVouchers();
  }

  fetchVouchers(): void {
    this.http.get<Voucher[]>(`${environment.apiUrl}/voucher`).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error("Lỗi lấy voucher:", err),
    });
  }

  deleteVoucher(id: number) {
    console.log(id);

    if (confirm("Bạn có chắc muốn xoá voucher này không?")) {
      this.voucherService.deleteVoucher(id).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Xóa voucher thành công!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          this.fetchVouchers();
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Xóa không thành công do có tài khoảng đã dùng voucher này.",
          });
        },
      });
    }
  }

  editVoucher(voucher: Voucher, id: number) {
    const dialogRef = this.dialog.open(VoucherDialogComponent, {
      width: "600px",
      data: voucher,
    });
    this.idVoucher = id;

    dialogRef.afterClosed().subscribe((result) => {
      if (result.edit) {
        this.voucherService
          .editVoucher(result.voucher, this.idVoucher)
          .subscribe({
            next: () => {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Cập nhật voucher thành công!",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
              this.fetchVouchers();
            },
            error: (err) => {
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: err.message || "Cập nhật voucher thất bại!",
              });
            },
          });
        return;
      }
    });
  }

  addVoucher() {
    const dialogRef = this.dialog.open(VoucherDialogComponent, {
      width: "600px",
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: Voucher) => {
      this.voucherService.createVoucher(result).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Thêm voucher thành công!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          this.fetchVouchers();
        },
        error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: err.message || "Thêm voucher thất bại!",
          });
        },
      });
    });
  }
}
