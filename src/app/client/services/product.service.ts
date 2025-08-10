import { Injectable } from "@angular/core";
import { IProduct } from "../../core/models/structureData";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`; // Thay bằng URL thật nếu có

  constructor(private http: HttpClient) {}

  async searchProducts(query: string): Promise<IProduct[]> {
    const response = await fetch(`${this.apiUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error("Lỗi khi tìm kiếm sản phẩm");
    }
    return await response.json();
  }
}
