import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { IBrand } from "../../core/models/structureData";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BrandService {
  private apiUrl = `${environment.apiUrl}/admin/brands`;

  constructor(private http: HttpClient) {}

  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(this.apiUrl);
  }

  getBrandById(id: number): Observable<IBrand> {
    return this.http.get<IBrand>(`${this.apiUrl}/${id}`);
  }

  createBrand(brand: IBrand): Observable<IBrand> {
    return this.http.post<IBrand>(this.apiUrl, brand);
  }

  updateBrand(id: number, brand: IBrand): Observable<IBrand> {
    return this.http.put<IBrand>(`${this.apiUrl}/${id}`, brand);
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
