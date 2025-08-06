import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Voucher } from '../pages/voucher/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  url: string = 'http://localhost:3000/api/voucher';
  constructor(private http: HttpClient) { }

  createVoucher(payload: any){
    return this.http.post(this.url, payload)
  }

  deleteVoucher(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  editVoucher(voucher: Voucher, id: number){
    return this.http.put(`${this.url}/update/${id}`, voucher);
  }
}
