import { Routes } from "@angular/router";

import { ProductDetailComponent } from "./client/pages/product-detail/product-detail.component";
import { ProductComponent } from "./client/pages/product/product.component";

import { CartComponent } from "./client/pages/cart/cart.component";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "product",
    component: ProductComponent,
    title: "Sản phẩm",
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
