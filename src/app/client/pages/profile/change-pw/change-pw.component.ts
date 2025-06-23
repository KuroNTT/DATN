import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-change-pw',
  imports: [CommonModule],
  templateUrl: './change-pw.component.html'
})
export class ChangePwComponent {
isAccountMenuOpen = false;

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }
}
