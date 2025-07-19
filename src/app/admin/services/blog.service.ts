import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBlog } from "../../core/models/structureData";
import { IBlogCreate } from "../../core/models/structureData";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  private apiUrl = "http://localhost:3000/api/admin/blogs";
  constructor(private http: HttpClient) {}

  getAll(): Observable<IBlog[]> {
    return this.http.get<IBlog[]>(this.apiUrl);
  }

  getById(id: number): Observable<IBlog> {
    return this.http.get<IBlog>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/blog-categories`);
  }

  createBlog(blogPayload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, blogPayload);
  }

  update(id: number, blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.apiUrl}/${id}`, blog);
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
