import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-profile',
  imports: [],
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent {
isAccountMenuOpen = false;

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }
}
