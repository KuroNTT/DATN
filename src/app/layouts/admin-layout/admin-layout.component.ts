import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../admin/components/header/header.component";
import { SidebarComponent } from "../../admin/components/sidebar/sidebar.component";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.css"],
})
export class AdminLayoutComponent {}
