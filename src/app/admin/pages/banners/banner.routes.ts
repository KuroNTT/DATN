import { Routes } from "@angular/router";
import { BannerListComponent } from "./banner-list/banner-list.component";
import { BannerAddComponent } from "./banner-add/banner-add.component";
import { BannerEditComponent } from "./banner-edit/banner-edit.component";

export const bannerRoutes: Routes = [
  {
    path: "",
    component: BannerListComponent,
    title: "Danh sách banner",
  },
  {
    path: "add",
    component: BannerAddComponent,
    title: "Thêm banner",
  },
  {
    path: "edit/:id",
    component: BannerEditComponent,
    title: "Chỉnh sửa banner",
  },
];
