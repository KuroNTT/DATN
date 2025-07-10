import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

interface CartDisplayItem {
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private CART_KEY = "cart";
  private apiUrl = "http://localhost:3000/api/cart";
  public cartItems$ = new BehaviorSubject<CartDisplayItem[]>([]);
  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("token");
  }

  addToCart(variantId: number, sizeId: number, quantity: number) {
    if (this.isLoggedIn()) {
      let userId = JSON.parse(sessionStorage.getItem("user")!).id;
      let payload = {
        userId,
        variantId,
        sizeId,
        quantity,
      };
      this.http.post(`${this.apiUrl}/add`, payload).subscribe(() => {
        this.loadCart();
      });
    } else {
      const cart = this.getLocalCart();
      const existingProduct = cart.find(
        (item: any) => item.variantId === variantId && item.sizeId === sizeId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.push({ variantId, sizeId, quantity });
      }

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

  removeFromCart(userId: number, variantId: number, sizeId: number) {
    if (this.isLoggedIn()) {
      this.http
        .delete(`${this.apiUrl}/${userId}/${variantId}/${sizeId}`)
        .subscribe(() => {
          this.loadCart();
        });
    } else {
      const cart = this.getLocalCart().filter((p: any) => p.variantId !== variantId);
      this.saveLocalCart(cart);
      this.cartItems$.next(cart);
    }
  }
  public getLocalCart(){
      let data;
      if(typeof window != 'undefined'){
        data = localStorage.getItem(this.CART_KEY);
      }
      return data ? JSON.parse(data) : [];
  }
  public getServerCart(userId: number){
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  private saveLocalCart(cart: any[]) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }
  getAllCartInLocal(payload: {items: {variantId: number, sizeId: number}[]}){
    return this.http.post(this.apiUrl, payload);
  }
}
