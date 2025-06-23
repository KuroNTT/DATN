import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  standalone: true, 

  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isAccountMenuOpen = false;

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }
    logout() {
    sessionStorage.clear();
    window.location.href = "/sign-in";
  }
}
