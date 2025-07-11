import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    title: "Tổng quan",
  },
];
