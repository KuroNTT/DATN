import { Component, OnInit, ViewChild } from "@angular/core";
import { OrderService } from "../../../services/order.service";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select"; // thêm
import { IOrder } from "../../../../core/models/structureData";

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: "./order-list.component.html",
})
export class OrderListComponent implements OnInit {
  dataSource = new MatTableDataSource<IOrder>([]);
  displayedColumns: string[] = [
    "id",
    "orderCode",
    "customer",
    "customerAddress",
    "customerPhoneNumber",
    "total_price",
    "status",
    "orderDate",
  ];

  statuses: string[] = [
    "pending",
    "confirmed",
    "shipping",
    "completed",
    "cancelled",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrder().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<IOrder>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeStatus(order: IOrder, newStatus: string) {
    if (!newStatus || newStatus === order.status) return;

    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        order.status = updated.status;
        alert("✅ Đã cập nhật trạng thái thành công!");
      },
      error: (err) => {
        console.error(err);
        alert("❌ Lỗi khi cập nhật trạng thái");
      },
    });
  }
}
