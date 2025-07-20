import { Routes } from "@angular/router";
import { ProductListComponent } from "./product-list/products.component";
import { ProductAddComponent } from "./product-add/product-add.component";
import { ProductEditComponent } from "./product-edit/product-edit.component";

export const productRoutes: Routes = [
  { path: "", component: ProductListComponent, title: "Danh sách sản phẩm" },
  { path: "add", component: ProductAddComponent, title: "Thêm sản phẩm" },
  {
    path: "edit/:slug",
    component: ProductEditComponent,
    title: "Chỉnh sửa sản phẩm",
  },
];
