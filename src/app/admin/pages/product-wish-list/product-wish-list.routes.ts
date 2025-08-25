import { Routes } from "@angular/router";
import { ProductWishListComponent } from "./product-wish-list/product-wish-list.component";

export const productWishListRoutes: Routes = [
  {
    path: "",
    component: ProductWishListComponent,
    title: "Danh sách sản phẩm yêu thích",
  },
];
