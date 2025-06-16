import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
   cartItems = [
    {
      image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png',
      name: 'Nike Air Force 1 \'07',
      description: 'Sail/Light Orewood Brown/White/Black',
      size: 40,
      quantity: 1,
      price: 2929000,
      favorite: false
    },
    {
      image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png',
      name: 'Nike Acg Lowcate \'Leap High\'',
      description: 'Sail/Light Orewood Brown/White/Black',
      size: 40,
      quantity: 1,
      price: 2690000,
      favorite: true
    }
  ];

  suggestions = [
    { image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png', name: 'Nike Pegasus Plus', description: 'Giày chạy bộ nam', price: 5279000 },
    { image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png', name: 'Air Jordan 1 Low', description: 'Giày nam', price: 3239000 },
    { image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png', name: 'Nike Dunk Low', description: 'Giày nam', price: 3519000 },
    { image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2cbc1c62-b1b3-4daf-a221-1bfc00eee268/NIKE+AIR+ZOOM+RIVAL+FLY+4.png', name: 'Nike Downshifter 13', description: 'Giày chạy bộ nam', price: 2069000 }
  ];

  get subtotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get total() {
    return this.subtotal; // + shippingFee nếu có
  }
  toggleFavorite(item: any) {
    item.favorite = !item.favorite;
  }
  increase(item: any) { item.quantity++; }
  decrease(item: any) { if (item.quantity > 1) item.quantity--; }
  remove(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }
}
