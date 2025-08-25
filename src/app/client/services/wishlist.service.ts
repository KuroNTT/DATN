import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { IWishlist } from "../../core/models/structureData";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  // Hàm tạo headers kèm token
  private getAuthHeaders(): HttpHeaders {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getFavoritesByUser(userId: number): Observable<{ productIds: number[] }> {
    return this.http.get<{ productIds: number[] }>(
      `${this.apiUrl}/by-user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addToWishlist(data: IWishlist): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  removeFromWishlist(wishlist_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${wishlist_id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  toggle(data: {
    product_id: number;
    variant_id: number;
    size: number;
    user_id: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}
