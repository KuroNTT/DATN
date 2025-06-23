import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; //
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,               
    SidebarComponent
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {}
