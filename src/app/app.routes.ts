import { Routes, provideRouter } from "@angular/router";
import { CartComponent } from "./client/pages/cart/cart.component";
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

export const appRoutesProvider = provideRouter(routes);
