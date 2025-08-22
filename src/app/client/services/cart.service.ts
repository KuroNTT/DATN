import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

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
  private apiUrl = `${environment.apiUrl}/carts`;
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
      const cart = this.getLocalCart().filter(
        (p: any) => p.variantId !== variantId || p.sizeId !== sizeId
      );
      this.saveLocalCart(cart);
      this.cartItems$.next(cart);
    }
  }
  public getLocalCart() {
    let data;
    if (typeof window != "undefined") {
      data = localStorage.getItem(this.CART_KEY);
    }
    return data ? JSON.parse(data) : [];
  }
  public getServerCart(userId: number) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  private saveLocalCart(cart: any[]) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }
  getAllCartInLocal(payload: {
    items: { variantId: number; sizeId: number }[];
  }) {
    return this.http.post(this.apiUrl, payload);
  }

  updateLocalQuantity(variantId: number, sizeId: number, quantity: number) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.map((item: any) => {
      if (item.variantId === variantId && item.sizeId === sizeId) {
        return { ...item, quantity };
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  updateCartQuantity(
    userId: number,
    variantId: number,
    sizeId: number,
    quantity: number
  ) {
    return this.http.put(`${this.apiUrl}/update-cart`, {
      userId,
      variantId,
      sizeId,
      quantity,
    });
  }

  getStock(variantId: number, sizeId: number) {
    return this.http.get(
      `${environment.apiUrl}/stock?variantId=${variantId}&sizeId=${sizeId}`
    );
  }

  createPaymentLink(payload: any) {
    return this.http.post(
      `${environment.apiUrl}/orders/create-payment`,
      payload
    );
  }
}
