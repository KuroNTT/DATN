import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  url: string = `${environment.apiUrl}/voucher/verify`;
  constructor(private http: HttpClient) {}

  applyVoucher(code: string, orderTotal: number) {
    return this.http.post(this.url, { code, orderTotal });
  }
}
