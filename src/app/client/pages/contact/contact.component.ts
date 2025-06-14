import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

const useMaterial = [
  MatInputModule,
  MatFormFieldModule,
  FormsModule
];
@Component({
  selector: 'app-contact',
  imports: [...useMaterial],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
