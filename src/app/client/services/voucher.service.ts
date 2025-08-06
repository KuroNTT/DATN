import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  url: string = 'http://localhost:3000/api/voucher/verify';
  constructor(private http: HttpClient) {}

  applyVoucher(code: string, orderTotal: number){
    return this.http.post(this.url, {code, orderTotal});
  }
}
