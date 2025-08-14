import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../enviroments/environment';
@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css',

})
export class PurchaseComponent implements OnInit {
  tabs = [
    'Tất cả',
    'Chờ thanh toán',
    'Vận chuyển',
    'Chờ giao hàng',
    'Hoàn thành',
    'Đã huỷ',
    'Trả hàng/Hoàn tiền'
  ];
  selectedTab = 'Tất cả';

  orders: any[] = [];
  ngOnInit() {
    const token = sessionStorage.getItem('token');
    fetch(`${environment.apiUrl}/orders/my`, {
      method: 'GET',
      headers:{
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if(!res.ok) throw new Error(`Http error! status ${res.status}`);
        return res.json()})
      .then(data => { this.orders = data })
      .catch(err => console.error(err))
  }
}
