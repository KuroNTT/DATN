import { Injectable } from "@angular/core";
import { IProduct } from "../models/structureData";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "http://localhost:3000/api/products"; // Thay bằng URL thật nếu có

  constructor() {}

  async searchProducts(query: string): Promise<IProduct[]> {
    const response = await fetch(`${this.apiUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error("Lỗi khi tìm kiếm sản phẩm");
    }
    return await response.json();
  }
}
