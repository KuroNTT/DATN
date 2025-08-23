import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
import { WishlistService } from "../../services/wishlist.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-product-wishlist",
  imports: [CommonModule],
  templateUrl: "./product-wishlist.component.html",
  styleUrl: "./product-wishlist.component.css",
})
export class ProductWishlistComponent {
  product_arr: IProduct[] = [];
  products_wishList: any[] = [];
  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.products_wishList = res;
      },
      error: (err) => {
        console.error("Lỗi lấy wishlist:", err);
      },
    });
    fetch(`${environment.apiUrl}/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );
  }

  removeFromWishlist(item: any): void {
    const id = item.wishlist_id;
    console.log(id);
    this.wishlistService.removeFromWishlist(id).subscribe({
      next: () => {
        this.products_wishList = this.products_wishList.filter(
          (prod) => prod.wishlist_id !== id
        );
      },
      error: (err) => {
        console.error("❌ Xoá lỗi:", err);
      },
    });
  }
}
