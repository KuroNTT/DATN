import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../enviroments/environment";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  url = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAllOrder() {
    return this.http.get(this.url);
  }
}
