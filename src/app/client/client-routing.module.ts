import { NgModule } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CartComponent } from "./pages/cart/cart.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { OrderComponent } from "./pages/order/order.component";
import { ProductComponent } from "./pages/product/product.component";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { LogInComponent } from "./pages/log-in/log-in.component";

const routes: Routes = [
  { path: "", component: HomeComponent, title: "Home" },
  { path: "contact", component: ContactComponent, title: "Contact" },
  { path: "cart", component: CartComponent, title: "Cart" },
  { path: "blog", component: BlogComponent, title: "Blog" },
  { path: "order", component: OrderComponent, title: "Order" },
  { path: "product", component: ProductComponent, title: "Product" },
  {
    path: "product-detail/:slug",
    component: ProductDetailComponent,
    title: "Product Detail",
  },
  { path: "sign-up", component: SignUpComponent, title: "Sign Up" },
  { path: "sign-in", component: LogInComponent, title: "Sign In" },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  scrollPositionRestoration: "enabled",
};

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ Đúng cho module con
  exports: [RouterModule],
})
export class ClientRoutingModule {}
