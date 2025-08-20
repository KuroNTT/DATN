import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { IVoucher } from "../../core/models/structureData";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  url: string = `${environment.apiUrl}/voucher/verify`;
  voucherUrl: string = `${environment.apiUrl}/voucher`;

  constructor(private http: HttpClient) { }

  getUserVouchers(): Observable<IVoucher[]> {
    return this.http.get<IVoucher[]>(`${environment.apiUrl}/voucher`);
  }

  applyVoucher(code: string, orderTotal: number) {
    return this.http.post(this.url, { code, orderTotal });
  }
}