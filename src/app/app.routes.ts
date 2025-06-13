import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  { path: "**", redirectTo: "" },
];
