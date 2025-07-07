import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "../layouts/admin-layout/admin-layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { provideHttpClient } from '@angular/common/http';

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
        providers: [provideHttpClient()], // ✅ Dòng quan trọng!
        title: "Products",
        /* children: [
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent),
            title: 'Add Product'
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent),
            title: 'Edit Product'
          }
        ] */
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
export class AdminRoutingModule { }
