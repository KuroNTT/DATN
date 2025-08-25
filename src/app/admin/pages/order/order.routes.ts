import { Routes } from "@angular/router";
import { OrderListComponent } from "./order-list/order-list.component";

export const orderRoutes: Routes = [
  {
    path: "",
    component: OrderListComponent,
    title: "Danh sách đơn hàng",
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./order-detail/order-detail.component").then(
        (m) => m.OrderDetailComponent
      ),
    title: "Chi tiết đơn hàng",
  },
];
