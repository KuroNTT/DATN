import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { IProduct } from "../../../core/models/structureData";
import { CartService } from "../../services/cart.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { FavoriteButtonComponent } from "../../components/favorite-button/favorite-button.component";
import { AuthService } from "../../services/auth.service";
import { WishlistService } from "../../services/wishlist.service";
@Component({
  selector: "app-cart",
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    FavoriteButtonComponent,
  ],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}
  items: any[] = [];
  cartItems$!: Observable<any>;
  cartItemLocal$: BehaviorSubject<any> = new BehaviorSubject([]);
  product_arr: IProduct[] = [];
  subtotal: number = 0;
  total: number = 0;
  user: any;
  quantity: any;

  private computeTotals(list: any[]) {
    // list trả về đã include variant.product.price_sale
    this.subtotal = list.reduce((sum, itm) => {
      const price = itm.variant?.product?.price_sale ?? 0;
      return sum + price * itm.quantity;
    }, 0);

    // nếu có phí ship hoặc voucher cộng / trừ ở đây
    this.total = this.subtotal; // hiện tại ship = 0
  }

  ngOnInit(): void {
    this.items = this.cartService.getLocalCart().map((e: any) => ({
      variantId: e.variantId,
      sizeId: e.sizeId,
      quantity: e.quantity,
    }));
    this.onLoad();
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
      this.cartItems$.subscribe((res) => {
        this.computeTotals(res);
      });
      this.cartItemLocal$.next([]);
    } else {
      this.cartItems$ = of([]);
      this.cartService.getAllCartInLocal(payload).subscribe((data) => {
        this.cartItemLocal$.next(data);
        this.cartItemLocal$.subscribe((res) => {
          this.computeTotals(res);
        });
      });
    }
  }

  increase(item: any) {
    if (this.user) {
      const newQuantity = item.quantity + 1;
      this.cartService
        .updateCartQuantity(
          this.user.id,
          item.variant.id,
          item.size.id,
          newQuantity
        )
        .subscribe({
          next: () => this.onLoad(),
          error: (err: any) => console.error("Lỗi khi tăng số lượng:", err),
        });
    } else {
      this.cartService.updateLocalQuantity(
        item.variant.id,
        item.size.id,
        item.quantity + 1
      );
      this.refreshLocalCart();
    }
  }

  decrease(item: any) {
    if (item.quantity <= 1) {
      return;
    }

    const newQuantity = item.quantity - 1;

    if (this.user) {
      this.cartService
        .updateCartQuantity(
          this.user.id,
          item.variant.id,
          item.size.id,
          newQuantity
        )
        .subscribe({
          next: () => this.onLoad(),
          error: (err) => console.error("Lỗi giảm SL:", err),
        });
    } else {
      this.cartService.updateLocalQuantity(
        item.variant?.id ?? item.variantId,
        item.size?.id ?? item.sizeId,
        newQuantity
      );
      this.refreshLocalCart();
    }
  }

  toggleFavorite() {}

  remove(variantId: number, sizeId: number) {
    if (this.user) {
      this.cartService.removeFromCart(this.user.id, variantId, sizeId);
      this.cartItems$.subscribe((res) => {
        this.computeTotals(res);
      });
      this.onLoad();
      return;
    }
    this.cartService.removeFromCart(0, variantId, sizeId);
    this.items = this.cartService.getLocalCart().map((e: any) => ({
      variantId: e.variantId,
      sizeId: e.sizeId,
      quantity: e.quantity,
    }));
    this.cartService
      .getAllCartInLocal({ items: this.items })
      .subscribe((data) => {
        this.cartItemLocal$.next(data);
      });
    // this.cartItemLocal$.next(this.cartService.getLocalCart());
  }

  private refreshLocalCart() {
    this.items = this.cartService.getLocalCart().map((e: any) => ({
      variantId: e.variantId,
      sizeId: e.sizeId,
      quantity: e.quantity,
    }));
    this.cartService
      .getAllCartInLocal({ items: this.items })
      .subscribe((data) => {
        this.cartItemLocal$.next(data);
      });
  }

  onPay() {
    this.router.navigate(["/order"]);
  }
}
