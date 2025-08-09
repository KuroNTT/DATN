import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { ClientRoutingModule } from "./client-routing.module";
import { ClientLayoutComponent } from "../layouts/client-layout/client-layout.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ProductDetailComponent
  ],
})
export class ClientModule {}
