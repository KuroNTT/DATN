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
import { ProfileComponent } from "./pages/profile/profile.component";
import { EditProfileComponent } from "./pages/profile/edit-profile/edit-profile.component";
import { ChangePwComponent } from "./pages/profile/change-pw/change-pw.component";
import { PurchaseComponent } from "./pages/profile/purchase/purchase.component";
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
  {
    path: 'profile',
    component: ProfileComponent, 
    children: [
      { path: '', redirectTo: 'purchase', pathMatch: 'full' },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'edit', component: EditProfileComponent },
      { path: 'change-pw', component: ChangePwComponent }
    ]
  },
  {
    path: "verify-email",
    loadComponent: () =>
      import("./pages/verify-email/verify-email.component").then(
        (m) => m.VerifyEmailComponent
      ),
  },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  scrollPositionRestoration: "enabled",
};

@NgModule({
  imports: [RouterModule.forChild(routes)], // ✅ Đúng cho module con
  exports: [RouterModule],
})
export class ClientRoutingModule { }
