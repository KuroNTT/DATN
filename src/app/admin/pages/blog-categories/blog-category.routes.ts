import { Routes } from "@angular/router";
import { BlogCategoryListComponent } from "./blog-category-list/blog-category-list.component";
import { BlogCategoryAddComponent } from "./blog-category-add/blog-category-add.component";
import { BlogCategoryEditComponent } from "./blog-category-edit/blog-category-edit.component";

export const blogCategoryRoutes: Routes = [
  {
    path: "",
    component: BlogCategoryListComponent,
    title: "Danh sách danh mục bài viết",
  },
  {
    path: "add",
    component: BlogCategoryAddComponent,
    title: "Thêm danh mục bài viết",
  },
  {
    path: "edit/:id",
    component: BlogCategoryEditComponent,
    title: "Chỉnh sửa danh mục bài viết",
  },
];
