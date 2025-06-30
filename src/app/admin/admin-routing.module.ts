import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "../layouts/admin-layout/admin-layout/admin-layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", component: DashboardComponent, title: "Dashboard" },
      {
        path: "products",
        loadComponent: () =>
          import("./pages/products/products.component").then(
            (m) => m.ProductsComponent
          ),
        title: "Products",
      },
      {
        path: "categories",
        loadComponent: () =>
          import("./pages/categories/categories.component").then(
            (m) => m.CategoriesComponent
          ),
        title: "Products",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
