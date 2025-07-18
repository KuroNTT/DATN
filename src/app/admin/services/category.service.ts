import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICategory } from "../../core/models/structureData";
import { ICategoryCreate } from "../../core/models/structureData";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = "http://localhost:3000/api/admin/categories";

  create(data: ICategoryCreate): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/${id}`);
  }

  update(id: number, blog: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/${id}`, blog);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
