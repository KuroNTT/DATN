import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  goToProfile() {
    window.location.href = "/profile";
  }

  goToAdminDashboard() {
    window.location.href = "/admin";
  }
  // toggleDropdown() {
  //   this.showDropdown = !this.showDropdown;
  // }
}
