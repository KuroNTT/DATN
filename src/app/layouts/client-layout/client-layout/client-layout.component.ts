import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../../client/components/header/header.component";
import { FooterComponent } from "../../../client/components/footer/footer.component";

@Component({
  selector: "app-client-layout",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  templateUrl: "./client-layout.component.html",
  styleUrl: "./client-layout.component.css",
})
export class ClientLayoutComponent {
  title = "Giày Thể Thao TVM";
}
