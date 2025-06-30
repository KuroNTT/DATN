import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminLayoutComponent } from "../layouts/admin-layout/admin-layout/admin-layout.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    SidebarComponent,
    RouterModule,
  ],
})
export class AdminModule {}
