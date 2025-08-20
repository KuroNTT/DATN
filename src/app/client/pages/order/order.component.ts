import { Component } from "@angular/core";
import { environment } from "../../../../environments/environment";
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
import { VoucherService } from "../../services/voucher.service";
import Swal from "sweetalert2";

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
  coppyTotal!: number;
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
  private firstLoad = true;
  originalTotal!: number;

  fullName!: string;
  email!: string;
  phone!: string;
  note!: string;
  paymentMethod!: string;
  discountAmount: number = 0;
  voucherCode?: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private http: HttpClient,
    private vocherService: VoucherService
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
    this.onLoad(() => {
      this.originalTotal = this.total;
    });
  }

  private computeTotals(list: any[]) {
    this.subtotal = list.reduce((sum, itm) => {
      const price = itm.variant?.product?.price_sale ?? 0;
      return sum + price * itm.quantity;
    }, 0);
    this.total = this.subtotal;
  }

  onLoad(callBack?: () => void) {
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
        if (this.firstLoad) {
          this.coppyTotal = this.total;
          this.firstLoad = false;
          callBack?.();
        }
      });
      this.cartItemLocal$.next([]);
      this.cartItems$.subscribe((p) => {
        this.products = p.map((i: any) => ({
          product_name: i.variant.product.name,
          variant_name: i.variant.name ?? i.variant.product.name,
          price: i.variant.product.price_sale ?? i.variant.product.price,
          name: i.variant.product.name,
          quantity: i.quantity,
          variantId: i.variant.id,
          sizeId: i.size.id,
        }));
      });
    } else {
      this.cartItems$ = of([]);
      this.cartService.getAllCartInLocal(payload).subscribe((data) => {
        this.cartItemLocal$.next(data);
        this.cartItemLocal$.subscribe((res) => {
          this.computeTotals(res);
          if (this.firstLoad) {
            this.coppyTotal = this.total;
            this.firstLoad = false;
            callBack?.();
          }
        });
        this.cartItemLocal$.subscribe((p) => {
          this.products = p.map((i: any) => ({
            product_name: i.variant.product.name,
            variant_name: i.variant.name ?? i.variant.product.name,
            price: i.variant.product.price_sale ?? i.variant.product.price,
            name: i.variant.product.name,
            quantity: i.quantity,
            variantId: i.variant.id,
            sizeId: i.size.id,
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
    if (form.value.paymentMethod !== "Chuyển khoản ngân hàng") {
      const address = `${this.ward}, ${this.district}, ${this.province}`;
      const userId = this.user?.id;
      const customer = this.user?.name || this.fullName;
      const payload = {
        total_price: this.total,
        items: this.products,
        userId,
        customer,
        address,
        payment_method: this.paymentMethod,
        phone: form.value.phone,
        customerNote: form.value.note,
        adminNote: "",
        voucherCode: this.voucherCode || null,
      };
      if (this.discountAmount > 0) {
        payload.items.push({
          name: "Giảm giá",
          price: -this.discountAmount,
          quantity: 1,
        });
      }
      this.http
        .post(`${environment.apiUrl}/orders/create-order`, payload)
        .subscribe({
          next: (res: any) => {
            this.router.navigate(["/success"]);
          },
          error: (err) => {
            console.log(err);
          },
        });
      return;
    }
    if (typeof window != "undefined") {
      if (!sessionStorage.getItem("user")) {
        Swal.fire({
          title: "Cảnh báo!",
          text: "Bạn cần đăng nhập để thực hiện thanh toán.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Đăng nhập",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            // Chuyển đến trang đăng nhập
            window.location.href = "/sign-in";
          }
        });
        return;
      }
    }
    const address = `${this.ward}, ${this.district}, ${this.province}`;
    const userId = this.user?.id;
    const customer = this.user?.name || this.fullName;
    const payload = {
      total_price: this.total,
      items: this.products,
      userId,
      customer,
      address,
      payment_method: this.paymentMethod,
      phone: form.value.phone,
      customerNote: form.value.note,
      adminNote: "",
      voucherCode: this.voucherCode || null,
    };
    if (this.discountAmount > 0) {
      payload.items.push({
        name: "Giảm giá",
        price: this.discountAmount,
        quantity: 1,
      });
    }
    this.http
      .post(`${environment.apiUrl}/orders/create-payment-link`, payload)
      .subscribe({
        next: (res: any) => {
          const url = res.checkoutUrl;
          if (typeof window != "undefined") {
            window.open(url, "_self");
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  applyVoucher(code: string, orderTotal: number) {
    if (!code) return;
    this.voucherCode = code;
    this.vocherService.applyVoucher(code, orderTotal).subscribe({
      next: (res: any) => {
        this.discountAmount = res.discountAmount;
        this.total = this.originalTotal - res.discountAmount;
        Swal.fire({
          icon: "success",
          title: `Áp dụng mã thành công! <br> <p style="font-size: 19px">Bạn đã được giảm <span style="color: green">${Number(
            this.discountAmount
          ).toLocaleString()} VNĐ</span></p>`,
          showConfirmButton: true,
          timer: 3000,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Áp mã không thành công.",
          text: err.error.message,
        });
      },
    });
  }

  increase(item: any) {
    this.cartService
      .getStock(item.variant.id, item.size.id)
      .subscribe((res: any) => {
        const stock = res.stock;
        const newQuantity = item.quantity + 1;

        if (newQuantity > stock) {
          Swal.fire({
            icon: "warning",
            title: "Không đủ hàng",
            text: `Chỉ còn lại ${stock} sản phẩm trong kho.`,
          });
          return; // Không tiếp tục
        }

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
              error: (err: any) => {
                console.error("Lỗi khi tăng số lượng:", err);
                Swal.fire({
                  icon: "error",
                  title: "Lỗi",
                  text: "Không thể cập nhật giỏ hàng.",
                });
              },
            });
        } else {
          this.cartService.updateLocalQuantity(
            item.variant.id,
            item.size.id,
            newQuantity
          );
          this.refreshLocalCart();
        }
      });
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
}
