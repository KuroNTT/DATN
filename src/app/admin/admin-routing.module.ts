import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "../layouts/admin-layout/admin-layout.component";
import { provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from "./pages/dashboard/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", component: DashboardComponent, title: "Dashboard" },
      {
        path: "products",
        loadChildren: () =>
          import("./pages/products/product.routes").then(
            (m) => m.productRoutes
          ),
        title: "Quản lý sản phẩm",
      },
      {
        path: "products/add",
        loadComponent: () => import("./pages/products/components/product-form/product-form.component").then(m => m.ProductFormComponent),
        title: "Add Product"
      },

      {
        path: "categories",
        loadChildren: () =>
          import("./pages/categories/category.routes").then(
            (m) => m.categoryRoutes
          ),
        title: "Quản lý danh mục",
      },
      {
        path: "blogs",
        loadChildren: () =>
          import("./pages/blogs/blog.routes").then((m) => m.blogRoutes),
        title: "Quản lý bài viết",
      },
      {
        path: "blog-categories",
        loadChildren: () =>
          import("./pages/blog-categories/blog-category.routes").then(
            (m) => m.blogCategoryRoutes
          ),
        title: "Quản lý danh mục bài viết",
      },
      {
        path: "banners",
        loadChildren: () =>
          import("./pages/banners/banner.routes").then((m) => m.bannerRoutes),
        title: "Quản lý banner",
      },
      {
        path: "orders",
        loadComponent: () =>
          import("./pages/order/order.component").then((m) => m.OrderComponent),
        title: "Quản lý banner",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
