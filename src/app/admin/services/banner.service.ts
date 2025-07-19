import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IBanner } from "../../core/models/structureData";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BannerService {
  private apiUrl = "http://localhost:3000/api/admin/banners";

  constructor(private http: HttpClient) {}

  getAll(): Observable<IBanner[]> {
    return this.http.get<IBanner[]>(this.apiUrl);
  }

  getById(id: number): Observable<IBanner> {
    return this.http.get<IBanner>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<{ imageUrl: string }>(
      "http://localhost:3000/api/admin/upload",
      formData
    );
  }
}
