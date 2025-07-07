import { Injectable } from "@angular/core";
import { IProduct, ICategory,  IBrand } from "../models/structureData";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "http://localhost:3000/api/products"; // Thay bằng URL thật nếu có

  constructor(private http:HttpClient) {}

  async searchProducts(query: string): Promise<IProduct[]> {
    const response = await fetch(`${this.apiUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error("Lỗi khi tìm kiếm sản phẩm");
    }
    return await response.json();
  }

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }
  getOne(slug: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${slug}`);
  }
  create(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }
  update(id: number, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product);
  }

    
  delete(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }
  uploadFile(formData: FormData): Observable<{ filename: string }> {
    return this.http.post<{ filename: string }>(
      'http://localhost:3000/admin/sp/upload',formData
    );
  }
  getCategoty(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('http://localhost:3000/api/categories');
  }
  getBrand(): Observable<IBrand[]>{
    return this.http.get<IBrand[]>('http://localhost:3000/api/brand')
  }
}
