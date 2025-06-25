import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartDisplayItem {
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'cart';
  private apiUrl = 'https://your-api.com/cart';
  public cartItems$ = new BehaviorSubject<CartDisplayItem[]>([]);
  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  addToCart(product: any): void {
    if (this.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/add`, { product }).subscribe(() => {
        this.loadCart();
      });
    } else {
      const cart = this.getLocalCart();
      cart.push(product);
      this.saveLocalCart(cart);
      this.cartItems$.next(cart);
    }
  }

  loadCart() {
    if (this.isLoggedIn()) {
      this.http.get<any[]>(`${this.apiUrl}`).subscribe((data) => {
        this.cartItems$.next(data);
      });
    } else {
      const cart = this.getLocalCart();
      this.cartItems$.next(cart);
    }
  }

  removeFromCart(productId: string) {
    if (this.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/remove`, { productId }).subscribe(() => {
        this.loadCart();
      });
    } else {
      const cart = this.getLocalCart().filter(p => p.id !== productId);
      this.saveLocalCart(cart);
      this.cartItems$.next(cart);
    }
  }
  private getLocalCart(): any[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveLocalCart(cart: any[]) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }
}
