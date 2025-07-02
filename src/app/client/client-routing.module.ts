import { NgModule } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { ClientLayoutComponent } from "../layouts/client-layout/client-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CartComponent } from "./pages/cart/cart.component";
import { BlogListComponent } from "./pages/blog-list/blog-list.component";
import { BlogDetailComponent } from "./pages/blog-detail/blog-detail.component";
import { OrderComponent } from "./pages/order/order.component";
import { ProductComponent } from "./pages/product/product.component";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { LogInComponent } from "./pages/log-in/log-in.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { EditProfileComponent } from "./pages/profile/edit-profile/edit-profile.component";
import { ChangePwComponent } from "./pages/profile/change-pw/change-pw.component";
import { PurchaseComponent } from "./pages/profile/purchase/purchase.component";
import { authGuard } from "../core/guards/auth.guard";
import { ResetPasswordComponent } from "./pages/reset-pw/reset-pw.component";
import { ForgotPasswordComponent } from "./pages/forgot-pw/forgot-pw.component";
import { ProductWishlistComponent } from "./pages/product-wishlist/product-wishlist.component";

const routes: Routes = [

  {
    path: "",
    component: ClientLayoutComponent,
    children: [
      { path: "", component: HomeComponent, title: "Home", pathMatch: "full" },
      { path: "contact", component: ContactComponent, title: "Contact" },
      { path: "cart", component: CartComponent, title: "Cart" },
      { path: "blog", component: BlogListComponent, title: "Blog" },
      { path: "blog/:id", component: BlogDetailComponent, title: "Blog Detail" },
      { path: "order", component: OrderComponent, title: "Order" },
      { path: "product", component: ProductComponent, title: "Product" },
      {
        path: "product-detail/:slug",
        component: ProductDetailComponent,
        title: "Product Detail",
      },
      {
        path: "product-wishlist",
        component: ProductWishlistComponent,
        title: "Product Wishlist",
      },
      { path: "sign-up", component: SignUpComponent, title: "Sign Up" },
      { path: "sign-in", component: LogInComponent, title: "Sign In" },
      { path: "forgot-pw", component: ForgotPasswordComponent, title: "Forgot Password" },
      { path: "reset-pw", component: ResetPasswordComponent, title: "Reset Pasword" },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard],
        data: { roles: ["customer", "admin"] },
        children: [
          { path: "", redirectTo: "purchase", pathMatch: "full" },
          {
            path: "purchase",
            component: PurchaseComponent,
            title: "Đơn hàng",
            data: { breadcrumb: "Đơn hàng" },
          },
          {
            path: "edit",
            component: EditProfileComponent,
            title: "Chỉnh sửa thông tin",
            data: { breadcrumb: "Chỉnh sửa thông tin" },
          },
          {
            path: "change-pw",
            component: ChangePwComponent,
            title: "Thay đổi mật khẩu",
            data: { breadcrumb: "Thay đổi mật khẩu" },
          },
        ],
      },
      {
        path: "verify-email",
        loadComponent: () =>
          import("./pages/verify-email/verify-email.component").then(
            (m) => m.VerifyEmailComponent
          ),
      },
    ],
  },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  scrollPositionRestoration: "enabled",
};

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
