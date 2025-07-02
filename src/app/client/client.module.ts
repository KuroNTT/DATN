import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientRoutingModule } from "./client-routing.module";
import { ClientLayoutComponent } from "../layouts/client-layout/client-layout.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [CommonModule, ClientRoutingModule, ClientLayoutComponent, HttpClientModule],
})
export class ClientModule {}
