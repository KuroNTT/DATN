import { Routes } from "@angular/router";
import { ReviewListComponent } from "./review-list/review-list.component";
import { ReviewDetailComponent } from "./review-detail/review-detail.component";

export const reviewRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./review-list/review-list.component").then(
        (m) => m.ReviewListComponent
      ),
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./review-detail/review-detail.component").then(
        (m) => m.ReviewDetailComponent
      ),
  },
];
