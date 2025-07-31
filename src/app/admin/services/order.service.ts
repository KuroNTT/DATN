import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  getAllOrder(){
    return this.http.get(this.url);
  }
}
