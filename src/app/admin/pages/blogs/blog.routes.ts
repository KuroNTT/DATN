import { Routes } from "@angular/router";
import { BlogListComponent } from "./blog-list/blog-list.component";
import { BlogAddComponent } from "./blog-add/blog-add.component";
import { BlogEditComponent } from "./blog-edit/blog-edit.component";

export const blogRoutes: Routes = [
  { path: "", component: BlogListComponent, title: "Danh sách bài viết" },
  { path: "add", component: BlogAddComponent, title: "Thêm bài viết" },
  {
    path: "edit/:id",
    component: BlogEditComponent,
    title: "Chỉnh sửa bài viết",
  },
];
