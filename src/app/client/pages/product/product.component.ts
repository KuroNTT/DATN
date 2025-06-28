import { Component } from "@angular/core";
import { NgClass, CommonModule } from "@angular/common";
import { ICategory, IProduct } from "../../../core/models/structureData";

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
  category_arr: ICategory[] = [];

  categoryName: string = "";

  ngOnInit(): void {
    fetch(`http://localhost:3000/api/products`).then((res) => {
      res
        .json()
        .then((data) => (this.product_arr = data as IProduct[]))
        .catch((error) =>
          console.error("Có lỗi khi lấy dữ liệu sản phẩm! ", error)
        );
    });

    fetch("http://localhost:3000/api/categories").then((res) => {
      res
        .json()
        .then((data) => (this.category_arr = data as ICategory[]))
        .catch((error) =>
          console.log("Có lỗi khi lấy dữ liệu danh mục!: ", error)
        );
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
