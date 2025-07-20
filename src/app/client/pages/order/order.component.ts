import { Component } from "@angular/core";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CartService } from "../../services/cart.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { FormsModule, NgForm } from "@angular/forms";

const matAngular = [
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatRadioModule,
];
@Component({
  selector: "app-order",
  imports: [...matAngular, CommonModule, FormsModule],
  templateUrl: "./order.component.html",
  styleUrl: "./order.component.css",
})
export class OrderComponent {
  products: any[] = [];
  subtotal!: number;
  total!: number;
  items: any[] = [];
  cartItemLocal$: BehaviorSubject<any> = new BehaviorSubject([]);
  cartItems$!: Observable<any>;
  user!: any;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  province!: any;
  district!: any;
  ward!: any;

  fullName!: string;
  email!: string;
  phone!: string;
  note!: string;
  paymentMethod!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http
      .get("https://open.oapi.vn/location/provinces?page=0&size=63")
      .subscribe((p: any) => {
        this.provinces = p.data;
      });
    this.items = this.cartService.getLocalCart().map((e: any) => ({
      variantId: e.variantId,
      sizeId: e.sizeId,
      quantity: e.quantity,
    }));
    this.onLoad();
  }

  private computeTotals(list: any[]) {
    // list trả về đã include variant.product.price_sale
    this.subtotal = list.reduce((sum, itm) => {
      const price = itm.variant?.product?.price_sale ?? 0;
      return sum + price * itm.quantity;
    }, 0);

    // nếu có phí ship hoặc voucher cộng / trừ ở đây
    this.total = this.subtotal; // hiện tại ship = 0
  }

  onLoad() {
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
      this.cartItems$.subscribe(p=>{
        this.products = p.map((i: any)=>({
          name: i.variant.product.name,
          price: i.variant.product.price_sale,
          quantity: i.quantity
        }));
      });
    } else {
      this.cartItems$ = of([]);
      this.cartService.getAllCartInLocal(payload).subscribe((data) => {
        this.cartItemLocal$.next(data);
        this.cartItemLocal$.subscribe((res) => {
          this.computeTotals(res);
        });
        this.cartItemLocal$.subscribe(p=>{
        this.products = p.map((i: any)=>({
          name: i.variant.product.name,
          price: i.variant.product.price_sale,
          quantity: i.quantity
        }));
      });
      });
    }
  }

  pickProvince(id: number) {
    this.http
      .get(`https://open.oapi.vn/location/districts/${id}?page=0&size=100`)
      .subscribe((d: any) => {
        this.districts = d.data;
      });
  }

  pickDistrict(id: number) {
    this.http
      .get(`https://open.oapi.vn/location/wards/${id}?page=0&size=100`)
      .subscribe((w: any) => {
        this.wards = w.data;
      });
  }

  onPay(form: NgForm) {
    if (form.form.invalid) {
      form.form.markAllAsTouched(); 
      return;
    }
    if (form.value.paymentMethod !== "bank") {
      return;
    }
    const address = `${this.ward}, ${this.district}, ${this.province}`;
    const userId = this.user?.name || null;
    const customer = this.user?.name || this.fullName;
    const payload = {
      total_price: this.total,
      items: this.products,
      userId,
      customer,
      address,
      phone: form.value.phone,
      customerNote: form.value.note,
      adminNote: "",
    };
    this.http.post('http://localhost:3000/api/orders/create-payment-link', payload).subscribe({
      next: (res: any)=>{
        const url = res.checkoutUrl;
        if(typeof window != 'undefined'){
          window.open(url, '_self');
        }
      },
      error: (err)=>{
        console.log(err);     
      }
    });
    
  }
}
