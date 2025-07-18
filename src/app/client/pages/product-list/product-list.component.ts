import { Component, Input } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { IProduct } from "../../../core/models/structureData";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent {
  @Input() products: IProduct[] = [];
}
