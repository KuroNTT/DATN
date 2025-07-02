import { Routes, provideRouter } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "admin",
    canActivate: [authGuard],
    data: { roles: ["admin"] },
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
];

export const appRoutesProvider = provideRouter(routes);
