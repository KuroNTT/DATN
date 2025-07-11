import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
import { CartService } from "../../services/cart.service";
import { Observable } from "rxjs";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-cart",
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent {
  constructor(private cartService: CartService) {}
  items: any[] = [];
  cartItems$!: Observable<any>;
  product_arr: IProduct[] = [];
  subtotal: number = 0;
  total: number = 0;
  user: any;

  ngOnInit(): void {
    this.items = this.cartService
      .getLocalCart()
      .map((e: any) => ({ variantId: e.variantId, sizeId: e.sizeId }));
    this.onLoad();
    this.cartItems$.subscribe((data) => {
      console.log("Cart data:", data);
    });
  }

  onLoad() {
    fetch(`http://localhost:3000/api/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );
    const payload = {
      items: this.items,
    };
    if (typeof window != "undefined") {
      this.user = JSON.parse(sessionStorage.getItem("user") as string);
    }
    if (this.user) {
      this.cartItems$ = this.cartService.getServerCart(this.user.id);
    } else {
      this.cartItems$ = this.cartService.getAllCartInLocal(payload);
      this.cartItems$.subscribe((data) => console.log(data));
    }
  }

  decrease() {}

  increase() {}

  toggleFavorite() {}

  remove() {}
}
