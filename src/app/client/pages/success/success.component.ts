import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-success",
  imports: [],
  templateUrl: "./success.component.html",
  styleUrl: "./success.component.css",
})
export class SuccessComponent {
  user!: any;
  orderId!: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.orderId = route.snapshot.queryParamMap.get("orderCode");
  }

  ngOnInit() {
    this.router.navigate([], {
      queryParams: {},
    });
    const url = `${environment.apiUrl}/orders/callback/${this.orderId}`;
    if (typeof window != "undefined") {
      this.user = JSON.parse(sessionStorage.getItem("user") as string);
    }
    if (this.user) {
      this.http.post(url, {}).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      let cart;
      if (typeof window != "undefined") {
        cart = JSON.parse(localStorage.getItem("cart") as string);
      }
      this.http.post(url, { cart }).subscribe({
        next: (res) => {
          if (typeof window != "undefined") {
            localStorage.removeItem("cart");
          }
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
