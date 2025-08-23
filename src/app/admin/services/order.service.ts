import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IOrder } from "../../core/models/structureData";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/admin/orders`;

  constructor(private http: HttpClient) {}

  getAllOrder(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.apiUrl}/${id}/status`, { status });
  }

  updateAdminNote(id: number, adminNote: string): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.apiUrl}/${id}/note`, { adminNote });
  }
}
