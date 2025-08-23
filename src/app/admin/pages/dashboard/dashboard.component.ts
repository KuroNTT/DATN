import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { DatePipe } from "@angular/common";
import { CommonModule } from "@angular/common";
import { IBlog, IProduct } from "../../../core/models/structureData";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  imports: [DatePipe, CommonModule],
})
export class DashboardComponent implements OnInit {
  blogs: IBlog[] = [];
  newProducts: IProduct[] = [];
  lowStocks: any[] = [];
  stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    newOrders: 0,
    newCustomers: 0
  };
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
    this.dashboardService.getNewProducts().subscribe((data) => {
      this.newProducts = data;
    });
    this.dashboardService.getLowStock().subscribe((data) => {
      this.lowStocks = data;
    });
    this.dashboardService.getStats().subscribe({
    next: (res) => this.stats = res,
    error: (err) => console.error('Lỗi lấy thống kê:', err)
  });
  }

  indexes = {
    new: 0,
    low: 0,
  };

  changeProduct(type: "new" | "low", direction: "prev" | "next") {
    const arr = type === "new" ? this.newProducts : this.lowStocks;
    if (direction === "prev") {
      this.indexes[type] = (this.indexes[type] - 1 + arr.length) % arr.length;
    } else {
      this.indexes[type] = (this.indexes[type] + 1) % arr.length;
    }
  }
}
