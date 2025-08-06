import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IWishlist } from "../../core/models/structureData";
import { environment } from "../../../enviroments/environment";

@Injectable({
  providedIn: "root", // Service sẽ được tự động inject toàn app
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`; // URL tới API backend

  constructor(private http: HttpClient) {}

  addToWishlist(data: IWishlist): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  removeFromWishlist(variant_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${variant_id}`);
  }
}
