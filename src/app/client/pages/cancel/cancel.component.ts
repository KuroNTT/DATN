import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../enviroments/environment";

@Component({
  selector: "app-cancel",
  imports: [],
  templateUrl: "./cancel.component.html",
  styleUrl: "./cancel.component.css",
})
export class CancelComponent {
  orderId!: any;
  url!: string;
  constructor(
    private routes: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderId = this.routes.snapshot.queryParamMap.get("orderCode");
    this.url = `${environment.apiUrl}/orders/callback/${this.orderId}`;
    this.http.post(this.url, {}).subscribe({
      error: (err) => {
        console.log(err);
      },
    });
    this.router.navigate([], {
      queryParams: {},
    });
  }
}
