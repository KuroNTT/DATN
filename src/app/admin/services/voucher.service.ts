import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Voucher } from "../pages/voucher/voucher.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  url: string = `${environment.apiUrl}/voucher`;
  constructor(private http: HttpClient) {}

  createVoucher(payload: any) {
    return this.http.post(this.url, payload);
  }

  deleteVoucher(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  editVoucher(voucher: Voucher, id: number) {
    return this.http.put(`${this.url}/update/${id}`, voucher);
  }
}
