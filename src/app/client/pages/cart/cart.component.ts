import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-cart",
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent {
  cartItems = [
    {
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png",
      name: "Nike Air Force 1 '07",
      description: "Sail/Light Orewood Brown/White/Black",
      size: 40,
      quantity: 1,
      price: 2929000,
      favorite: false,
    },
    {
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png",
      name: "Nike Acg Lowcate 'Leap High'",
      description: "Sail/Light Orewood Brown/White/Black",
      size: 40,
      quantity: 1,
      price: 2690000,
      favorite: true,
    },
  ];

  get subtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  get total() {
    return this.subtotal; // + shippingFee nếu có
  }
  toggleFavorite(item: any) {
    item.favorite = !item.favorite;
  }
  increase(item: any) {
    item.quantity++;
  }
  decrease(item: any) {
    if (item.quantity > 1) item.quantity--;
  }
  remove(item: any) {
    this.cartItems = this.cartItems.filter((i) => i !== item);
  }

  product_arr: IProduct[] = [];

  ngOnInit(): void {
    fetch(`http://localhost:3000/api/products/most-view/products`)
      .then((res) => res.json())
      .then((data) => {
        this.product_arr = data as IProduct[];
      })
      .catch((error) =>
        console.error("Có lỗi khi lấy dữ liệu sản phẩm nhiều lượt xem: ", error)
      );
  }
}
