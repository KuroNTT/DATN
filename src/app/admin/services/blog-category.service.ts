import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBlogCategory } from "../../core/models/structureData";

@Injectable({
  providedIn: "root",
})
export class BlogCategoryService {
  private api = "http://localhost:3000/api/admin/blog-categories";

  constructor(private http: HttpClient) {}

  getAll(): Observable<IBlogCategory[]> {
    return this.http.get<IBlogCategory[]>(this.api);
  }

  getById(id: number): Observable<IBlogCategory> {
    return this.http.get<IBlogCategory>(`${this.api}/${id}`);
  }

  create(data: Partial<IBlogCategory>) {
    return this.http.post(this.api, data);
  }

  update(id: number, data: Partial<IBlogCategory>) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
