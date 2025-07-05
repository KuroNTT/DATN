import { Component, Input } from "@angular/core";
import { CommonModule, NgClass, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  IProduct,
  ICategory,
  IBrand,
} from "../../../../../core/models/structureData";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, NgClass, NgFor],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent {
  @Input() products: IProduct[] = [];
  // Like
  isLiked: boolean = false;
  toggleLike() {
    this.isLiked = !this.isLiked;
  }
  constructor(private http: HttpClient) {}
}
