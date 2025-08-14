import { Injectable } from "@angular/core";
import {
  IProduct,
  ICategory,
  IBrand,
  IGender,
  IShoeHeight,
  ISize,
} from "../../core/models/structureData";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`; // Thay bằng URL thật nếu có
  private preselectedCategoryId?: number;
  private preselectedBrandId: number | null = null;

  constructor(private http: HttpClient) {}

  async searchProducts(query: string): Promise<IProduct[]> {
    const response = await fetch(`${this.apiUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error("Lỗi khi tìm kiếm sản phẩm");
    }
    return await response.json();
  }
  /* private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getOne(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  create(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: number, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateStatus(id: number, status: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  uploadFile(formData: FormData): Observable<{ filename: string }> {
    return this.http.post<{ filename: string }>(
      'http://localhost:3000/admin/sp/upload',
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  getCategory(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('${environment.apiUrl}/categories');
  }
  getBrand(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>('${environment.apiUrl}/brand');
  }
  getSizes():Observable<ISize[]>{
    return this.http.get<ISize[]>('${environment.apiUrl}/sizes')
  }
  getGender(){
    return this.http.get<IGender[]>('${environment.apiUrl}/genders');
  }
  getShoeheights(){
    return this.http.get<IShoeHeight[]>('${environment.apiUrl}/shoe_heights');
  }  
   */

  setPreselectedCategory(id: number) {
    this.preselectedCategoryId = id;
  }

  getPreselectedCategory(): number | undefined {
    return this.preselectedCategoryId;
  }

  clearPreselectedCategory() {
    this.preselectedCategoryId = undefined;
  }
}
