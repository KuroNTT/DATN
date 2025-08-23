import { NgModule } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { ClientLayoutComponent } from "../layouts/client-layout/client-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CartComponent } from "./pages/cart/cart.component";
import { BlogListComponent } from "./pages/blog-list/blog-list.component";
import { BlogDetailComponent } from "./pages/blog-detail/blog-detail.component";
import { OrderComponent } from "./pages/order/order.component";
import { ProductsComponent } from "./pages/products/products.component";
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
import { SearchResultComponent } from "./pages/search-result/search-result.component";
import { CancelComponent } from "./pages/cancel/cancel.component";
import { SuccessComponent } from "./pages/success/success.component";
import { AboutUsComponent } from "./pages/about-us/about-us.component";
import { VoucherComponent } from "./pages/profile/voucher/voucher.component";

const routes: Routes = [
  {
    path: "",
    component: ClientLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
        title: "TVM Shop",
        pathMatch: "full",
      },
      { path: "contact", component: ContactComponent, title: "Liên hệ" },
      { path: "cart", component: CartComponent, title: "Giỏ hàng" },
      { path: "blog", component: BlogListComponent, title: "Bài viết" },
      { path: "about-us", component: AboutUsComponent, title: "Về chúng tôi" },
      {
        path: "blog/:slug",
        component: BlogDetailComponent,
        title: "Chi tiết bài viết",
      },
      { path: "order", component: OrderComponent, title: "Đơn hàng" },
      {
        path: "products",
        component: ProductsComponent,
        title: "Tất cả sản phẩm",
      },
      {
        path: "product-detail/:slug",
        component: ProductDetailComponent,
        title: "Chi tiết sản phẩm",
      },
      {
        path: "product-wishlist",
        component: ProductWishlistComponent,
        title: "Sản phẩm yêu thích",
      },
      { path: "sign-up", component: SignUpComponent, title: "Đăng ký" },
      { path: "sign-in", component: LogInComponent, title: "Đăng nhập" },
      {
        path: "forgot-pw",
        component: ForgotPasswordComponent,
        title: "Quên mật khẩu",
      },
      {
        path: "reset-pw",
        component: ResetPasswordComponent,
        title: "Đổi mật khẩu",
      },
      { path: "search", component: SearchResultComponent, title: "Tìm kiếm" },

      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard],
        canActivateChild: [authGuard], 
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
          {
            path: "voucher",
            component: VoucherComponent,
            title: "Mã giảm giá",
            data: { breadcrumb: "Mã giảm giá" },
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
      { path: "cancel", component: CancelComponent, title: "Hủy thanh toán" },
      {
        path: "success",
        component: SuccessComponent,
        title: "thanh toán thành công",
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
export class ClientRoutingModule {}
