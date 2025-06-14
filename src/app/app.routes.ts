import { Routes } from "@angular/router";
import { ProductDetailComponent } from "./client/pages/product-detail/product-detail.component";
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "product-detail",
    component: ProductDetailComponent,
    title: "Chi tiết sản phẩm",
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },

  { path: "**", redirectTo: "" },
];
