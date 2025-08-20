import { Component, ViewChild } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { OrderService } from "../../services/order.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-order",
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.css",
})
export class OrderComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<any>;
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

  constructor(private orderService: OrderService) {}

  ngAfterViewInit() {
    this.orderService.getAllOrder().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
