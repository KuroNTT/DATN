import { Component } from "@angular/core";
import { NgClass, CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { IProduct } from "../../../core/models/structureData";

@Component({
  selector: "app-product",
  imports: [NgClass, CommonModule],
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent {
  isPriceFilterVisible = true;
  isBrandFilterVisible = true;
  isSexFilterVisible = true;

  product_arr: IProduct[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<IProduct[]>("http://localhost:3000/api/products").subscribe({
      next: (data) => {
        this.product_arr = data;
      },
      error: (error) => {
        console.error("Lỗi khi gọi API:", error);
      },
    });
  }

  // Like
  isLiked: boolean = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  togglePriceFilter() {
    this.isPriceFilterVisible = !this.isPriceFilterVisible;
  }

  toggleBrandFilter() {
    this.isBrandFilterVisible = !this.isBrandFilterVisible;
  }
  toggleSexFilter() {
    this.isSexFilterVisible = !this.isSexFilterVisible;
  }
}
