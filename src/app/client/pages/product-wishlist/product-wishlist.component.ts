import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-product-wishlist",
  imports: [CommonModule],
  templateUrl: "./product-wishlist.component.html",
  styleUrl: "./product-wishlist.component.css",
})
export class ProductWishlistComponent {
  product_arr: IProduct[] = [];

  ngOnInit(): void {
    fetch(`${environment.apiUrl}/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );
  }
}
