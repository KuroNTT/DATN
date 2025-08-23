import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/admin/dashboards`;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/blogs`);
  }

  getNewProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }
  getLowStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/low-stock`);
  }
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
