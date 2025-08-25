//test
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductWishListService {
  private apiUrl = `${environment.apiUrl}/admin/wishlist`;

  constructor(private http: HttpClient) {}

  // Lấy tất cả wishlist (dùng cho admin)
  getAllWishlists(): Observable<any> {
    const token = sessionStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Gửi token kèm request
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
