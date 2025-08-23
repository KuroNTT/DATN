import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IWishlist } from "../../core/models/structureData";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  getFavoritesByUser(userId: number): Observable<{ productIds: number[] }> {
    return this.http.get<{ productIds: number[] }>(`${this.apiUrl}/by-user`);
  }

  addToWishlist(data: IWishlist): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  removeFromWishlist(wishlist_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${wishlist_id}`);
  }
  removeFromWishlistIcon(variant_id: number) {
    return this.http.delete(`${this.apiUrl}/${variant_id}`);
  }

  toggle(data: {
    product_id: number;
    variant_id: number;
    size: number;
    user_id: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle`, data);
  }
}
