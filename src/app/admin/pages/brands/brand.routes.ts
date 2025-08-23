import { Routes } from "@angular/router";
import { BrandListComponent } from "./brand-list/brand-list.component";
import { BrandAddComponent } from "./brand-add/brand-add.component";
import { BrandEditComponent } from "./brand-edit/brand-edit.component";

export const brandRoutes: Routes = [
  { path: "", component: BrandListComponent, title: "Danh sách thương hiệu" },
  { path: "add", component: BrandAddComponent, title: "Thêm thương hiệu" },
  {
    path: "edit/:id",
    component: BrandEditComponent,
    title: "Chỉnh sửa thương hiệu",
  },
];
