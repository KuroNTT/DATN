import { Routes } from "@angular/router";
import { ReviewListComponent } from "./review-list/review-list.component";

export const reviewRoutes: Routes = [
  {
    path: "",
    component: ReviewListComponent,
    title: "Tổng quan",
  },
];
