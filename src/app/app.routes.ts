import { Routes, provideRouter } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { ProductDetailComponent } from "./client/pages/product-detail/product-detail.component";
import { ProductsComponent } from "./client/pages/products/products.component";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "product",
    component: ProductsComponent,
    title: "Sản phẩm",
  },
  {
    path: "product-detail",
    component: ProductDetailComponent,
    title: "Chi tiết sản phẩm",
  },
  {
    path: "admin",
    canActivate: [authGuard],
    data: { roles: ["admin"] },
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
];

export const appRoutesProvider = provideRouter(routes);
