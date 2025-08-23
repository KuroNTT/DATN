import { Routes } from "@angular/router";
import { UsersComponent } from "./users.component";

export const userRoutes: Routes = [
  {
    path: "",
    component: UsersComponent,
    title: "Quản lý người dùng",
  },
];
