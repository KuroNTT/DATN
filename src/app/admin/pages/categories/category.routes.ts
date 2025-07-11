import { Routes } from "@angular/router";
import { CategoryListComponent } from "./category-list/category-list.component";
import { CategoryAddComponent } from "./category-add/category-add.component";
import { CategoryEditComponent } from "./category-edit/category-edit.component";

export const categoryRoutes: Routes = [
  { path: "", component: CategoryListComponent, title: "Danh sách danh mục" },
  { path: "add", component: CategoryAddComponent, title: "Thêm danh mục" },
  {
    path: "edit/:id",
    component: CategoryEditComponent,
    title: "Chỉnh sửa danh mục",
  },
];
