import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

const matAngular = [
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule
];
@Component({
  selector: 'app-order',
  imports: [...matAngular],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

}
